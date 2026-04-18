import {
  BRAND_SHARE_IMAGE_URL,
  getSurveyPath,
  getSurveySharePath,
} from "../src/lib/branding";
import {
  buildAppUrl,
  escapeHtml,
  fetchSurveyPreview,
  getHeader,
  getShareDescription,
  getShareSiteName,
  getShareTitle,
  ShareRequest,
  ShareResponse,
  SurveyPreview,
} from "./survey-share-utils";

function renderSharePage(input: {
  shareUrl: string;
  surveyUrl: string;
  siteName: string;
  title: string;
  description: string;
  imageUrl: string;
}) {
  const siteName = escapeHtml(input.siteName);
  const title = escapeHtml(input.title);
  const description = escapeHtml(input.description);
  const shareUrl = escapeHtml(input.shareUrl);
  const surveyUrl = escapeHtml(input.surveyUrl);
  const imageUrl = escapeHtml(input.imageUrl);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta name="robots" content="noindex, nofollow" />
    <meta property="og:site_name" content="${siteName}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:alt" content="${title}" />
    <meta property="og:url" content="${shareUrl}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:image:alt" content="${title}" />
    <meta name="twitter:url" content="${shareUrl}" />
    <link rel="canonical" href="${surveyUrl}" />
    <meta http-equiv="refresh" content="0;url=${surveyUrl}" />
    <script>
      window.location.replace(${JSON.stringify(input.surveyUrl)});
    </script>
  </head>
  <body>
    <main style="font-family: Inter, Arial, sans-serif; padding: 24px; color: #101828;">
      <p style="margin: 0 0 8px; font-size: 14px; color: #52606d;">Opening your survey...</p>
      <h1 style="margin: 0 0 8px; font-size: 24px;">${title}</h1>
      <p style="margin: 0 0 16px; max-width: 48rem; line-height: 1.6;">${description}</p>
      <p style="margin: 0;">
        <a href="${surveyUrl}" style="color: #2457f5; font-weight: 600;">Continue to survey</a>
      </p>
    </main>
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

  const title = getShareTitle(survey);
  const description = getShareDescription(survey);
  const siteName = getShareSiteName(survey);
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
      siteName,
      title,
      description,
      imageUrl,
    }),
  );
}
