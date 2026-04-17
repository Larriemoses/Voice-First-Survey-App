import {
  BRAND_NAME,
  BRAND_SHARE_IMAGE_URL,
  DEFAULT_PUBLIC_SURVEY_DESCRIPTION,
  getSurveyPath,
  getSurveySharePath,
  trimTrailingSlash,
} from "../src/lib/branding";

declare const process: {
  env: Record<string, string | undefined>;
};

type SurveyPreview = {
  title?: string | null;
  description?: string | null;
  header_text?: string | null;
  logo_url?: string | null;
};

type ShareRequest = {
  headers: Record<string, string | string[] | undefined>;
  query?: { surveyId?: string | string[] };
};

type ShareResponse = {
  status: (code: number) => ShareResponse;
  setHeader: (name: string, value: string) => void;
  send: (body: string) => void;
};

function getHeader(
  value: string | string[] | undefined,
  fallback = "",
) {
  return Array.isArray(value) ? value[0] : value || fallback;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildAppUrl(req: {
  headers: Record<string, string | string[] | undefined>;
}) {
  const configuredUrl = trimTrailingSlash(process.env.VITE_APP_URL || "");

  if (configuredUrl) {
    return configuredUrl;
  }

  const protocol = getHeader(req.headers["x-forwarded-proto"], "https");
  const host = getHeader(
    req.headers["x-forwarded-host"] || req.headers.host,
  );

  return host ? `${protocol}://${host}` : "";
}

async function fetchSurveyPreview(surveyId: string) {
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

function renderSharePage(input: {
  shareUrl: string;
  surveyUrl: string;
  title: string;
  description: string;
  imageUrl: string;
}) {
  const title = escapeHtml(input.title);
  const description = escapeHtml(input.description);
  const shareUrl = escapeHtml(input.shareUrl);
  const surveyUrl = escapeHtml(input.surveyUrl);
  const imageUrl = escapeHtml(input.imageUrl);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="noindex, nofollow" />
    <meta property="og:site_name" content="${BRAND_NAME}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:url" content="${shareUrl}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:url" content="${shareUrl}" />
    <meta http-equiv="refresh" content="0; url=${surveyUrl}" />
    <link rel="canonical" href="${surveyUrl}" />
    <script>
      window.location.replace(${JSON.stringify(input.surveyUrl)});
    </script>
  </head>
  <body>
    <p>Redirecting to the survey...</p>
  </body>
</html>`;
}

export default async function handler(
  req: ShareRequest,
  res: ShareResponse,
) {
  const surveyId = getHeader(req.query?.surveyId);

  if (!surveyId) {
    res.status(400).send("Missing surveyId");
    return;
  }

  const appUrl = buildAppUrl(req);
  const surveyPath = getSurveyPath(surveyId);
  const sharePath = getSurveySharePath(surveyId);
  const surveyUrl = appUrl ? `${appUrl}${surveyPath}` : surveyPath;
  const shareUrl = appUrl ? `${appUrl}${sharePath}` : sharePath;

  let survey: SurveyPreview | null = null;

  try {
    survey = await fetchSurveyPreview(surveyId);
  } catch (error) {
    console.error("share-survey preview lookup failed", error);
  }

  const title = survey?.title
    ? `${survey.title} | ${BRAND_NAME}`
    : `Voice Survey | ${BRAND_NAME}`;
  const description =
    survey?.header_text ||
    survey?.description ||
    DEFAULT_PUBLIC_SURVEY_DESCRIPTION;
  const imageUrl = survey?.logo_url || BRAND_SHARE_IMAGE_URL;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, max-age=0, s-maxage=300, stale-while-revalidate=3600",
  );
  res.status(200).send(
    renderSharePage({
      shareUrl,
      surveyUrl,
      title,
      description,
      imageUrl,
    }),
  );
}
