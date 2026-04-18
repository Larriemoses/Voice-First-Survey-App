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
  organization?:
    | {
        name?: string | null;
      }
    | Array<{
        name?: string | null;
      }>
    | null;
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
    "title,description,header_text,logo_url,organization:organizations(name)",
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

export function getSurveyOrganizationName(survey: SurveyPreview | null) {
  const organization = survey?.organization;

  if (!organization) return "";

  if (Array.isArray(organization)) {
    return organization[0]?.name?.trim() || "";
  }

  return organization.name?.trim() || "";
}

function toBase64(bytes: Uint8Array) {
  return Buffer.from(bytes).toString("base64");
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
    try {
      return await fetchImageDataUri(BRAND_FAVICON_URL);
    } catch (fallbackError) {
      console.error("resolveSurveyLogoDataUri fallback failed", fallbackError);
      return "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgZmlsbD0ibm9uZSI+PHJlY3Qgd2lkdGg9IjI1NiIgaGVpZ2h0PSIyNTYiIHJ4PSI2NCIgZmlsbD0iI0ZGRkZGRiIvPjxwYXRoIGQ9Ik02NCAxNDRDNjQgMTA4LjY1NCA5Mi42NTM4IDgwIDEyOCA4MEMxNjMuMzQ2IDgwIDE5MiAxMDguNjU0IDE5MiAxNDRDMTkyIDE3OS4zNDYgMTYzLjM0NiAyMDggMTI4IDIwOEM5Mi42NTM4IDIwOCA2NCAxNzkuMzQ2IDY0IDE0NFoiIGZpbGw9IiMyNDU3RjUiLz48L3N2Zz4=";
    }
  }
}

export function getShareDescription(survey: SurveyPreview | null) {
  const organizationName = getSurveyOrganizationName(survey);

  return (
    survey?.header_text ||
    survey?.description ||
    (organizationName
      ? `You've been invited to answer ${organizationName}'s voice survey`
      : DEFAULT_PUBLIC_SURVEY_DESCRIPTION)
  );
}

export function getShareTitle(survey: SurveyPreview | null) {
  const organizationName = getSurveyOrganizationName(survey);

  if (survey?.title && organizationName) {
    return `${survey.title} | ${organizationName}`;
  }

  if (survey?.title) {
    return survey.title;
  }

  if (organizationName) {
    return `Voice Survey from ${organizationName}`;
  }

  return `Voice Survey on ${BRAND_NAME}`;
}

export function getShareSiteName(survey: SurveyPreview | null) {
  return getSurveyOrganizationName(survey) || BRAND_NAME;
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
