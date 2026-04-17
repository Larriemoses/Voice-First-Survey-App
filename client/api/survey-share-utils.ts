import {
  BRAND_FAVICON_URL,
  BRAND_NAME,
  DEFAULT_PUBLIC_SURVEY_DESCRIPTION,
  isLocalOrigin,
  trimTrailingSlash,
} from "../src/lib/branding";

declare const process: {
  env: Record<string, string | undefined>;
};

export type SurveyPreview = {
  title?: string | null;
  description?: string | null;
  header_text?: string | null;
  logo_url?: string | null;
};

export type ShareRequest = {
  headers: Record<string, string | string[] | undefined>;
  query?: { surveyId?: string | string[] };
};

export type ShareResponse = {
  status: (code: number) => ShareResponse;
  setHeader: (name: string, value: string) => void;
  send: (body: string) => void;
};

export const PREVIEW_BOT_PATTERN =
  /(facebookexternalhit|facebot|twitterbot|slackbot|discordbot|linkedinbot|whatsapp|telegrambot|skypeuripreview|googlebot|bingbot|pinterest|quora link preview|applebot|chatgpt|crawler|bot)/i;

export function getHeader(
  value: string | string[] | undefined,
  fallback = "",
) {
  return Array.isArray(value) ? value[0] : value || fallback;
}

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildAppUrl(req: {
  headers: Record<string, string | string[] | undefined>;
}) {
  const protocol = getHeader(req.headers["x-forwarded-proto"], "https");
  const host = getHeader(
    req.headers["x-forwarded-host"] || req.headers.host,
  );

  if (host) {
    return `${protocol}://${host}`;
  }

  const configuredUrl = trimTrailingSlash(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : process.env.VITE_APP_URL || "",
  );

  if (configuredUrl && !isLocalOrigin(configuredUrl)) {
    return configuredUrl;
  }

  return "";
}

export async function fetchSurveyPreview(surveyId: string) {
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const supabaseKey =
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  const requestUrl = new URL("/rest/v1/surveys", supabaseUrl);
  requestUrl.searchParams.set(
    "select",
    "title,description,header_text,logo_url",
  );
  requestUrl.searchParams.set("id", `eq.${surveyId}`);
  requestUrl.searchParams.set("status", "eq.published");
  requestUrl.searchParams.set("limit", "1");

  const response = await fetch(requestUrl, {
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${supabaseKey}`,
    },
  });

  if (!response.ok) {
    return null;
  }

  const rows = (await response.json()) as SurveyPreview[];
  return rows[0] || null;
}

export function isPreviewBot(req: ShareRequest) {
  return PREVIEW_BOT_PATTERN.test(getHeader(req.headers["user-agent"]));
}

function toBase64(bytes: Uint8Array) {
  let binary = "";

  for (let index = 0; index < bytes.length; index += 0x8000) {
    const chunk = bytes.subarray(index, index + 0x8000);
    binary += String.fromCharCode(...chunk);
  }

  return btoa(binary);
}

export async function fetchImageDataUri(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Image fetch failed: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const contentType = response.headers.get("content-type") || "image/png";

  return `data:${contentType};base64,${toBase64(new Uint8Array(arrayBuffer))}`;
}

export async function resolveSurveyLogoDataUri(logoUrl?: string | null) {
  try {
    return await fetchImageDataUri(logoUrl || BRAND_FAVICON_URL);
  } catch (error) {
    console.error("resolveSurveyLogoDataUri failed", error);
    return await fetchImageDataUri(BRAND_FAVICON_URL);
  }
}

export function getShareDescription(survey: SurveyPreview | null) {
  return (
    survey?.header_text ||
    survey?.description ||
    DEFAULT_PUBLIC_SURVEY_DESCRIPTION
  );
}

export function getShareTitle(survey: SurveyPreview | null) {
  return survey?.title || `Voice Survey on ${BRAND_NAME}`;
}

export function wrapSvgText(
  input: string,
  lineLength: number,
  maxLines: number,
) {
  const words = input.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;

    if (next.length <= lineLength) {
      current = next;
      continue;
    }

    if (current) {
      lines.push(current);
    }

    current = word;

    if (lines.length === maxLines - 1) {
      break;
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  if (lines.length === 0) {
    return [input];
  }

  const consumedWords = lines.join(" ").split(/\s+/).filter(Boolean).length;

  if (consumedWords < words.length) {
    const lastIndex = lines.length - 1;
    lines[lastIndex] = `${lines[lastIndex].replace(/[.]{3}$/, "")}...`;
  }

  return lines;
}
