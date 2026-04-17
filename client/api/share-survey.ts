import {
  BRAND_NAME,
  getSurveyPath,
  getSurveySharePath,
  getSurveyShareImagePath,
  trimTrailingSlash,
} from "../src/lib/branding";
import {
  ShareRequest,
  ShareResponse,
  SurveyPreview,
  buildAppUrl,
  escapeHtml,
  fetchSurveyPreview,
  getHeader,
  getShareDescription,
  getShareTitle,
  isPreviewBot,
} from "./survey-share-utils";

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
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:url" content="${shareUrl}" />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:url" content="${shareUrl}" />
    <link rel="canonical" href="${surveyUrl}" />
  </head>
  <body>
    <p>Open the survey: <a href="${surveyUrl}">${surveyUrl}</a></p>
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
  const shareImagePath = getSurveyShareImagePath(surveyId);
  const shareImageUrl = appUrl ? `${appUrl}${shareImagePath}` : shareImagePath;
  const previewRequest = isPreviewBot(req);

  let survey: SurveyPreview | null = null;

  try {
    survey = await fetchSurveyPreview(surveyId);
  } catch (error) {
    console.error("share-survey preview lookup failed", error);
  }

  const title = getShareTitle(survey);
  const description = getShareDescription(survey);

  if (!previewRequest) {
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Location", surveyUrl);
    res.status(307).send("");
    return;
  }

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
      imageUrl: shareImageUrl,
    }),
  );
}
