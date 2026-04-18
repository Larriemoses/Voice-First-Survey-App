import { BRAND_NAME } from "../src/lib/branding";
import {
  ShareRequest,
  ShareResponse,
  escapeHtml,
  fetchSurveyPreview,
  getHeader,
  getShareDescription,
  getSurveyOrganizationName,
  getShareTitle,
  resolveSurveyLogoDataUri,
  wrapSvgText,
} from "./survey-share-utils";

function renderSvgCard(input: {
  logoDataUri: string;
  organizationName: string;
  title: string;
  description: string;
}) {
  const titleLines = wrapSvgText(input.title, 28, 3);
  const descriptionLines = wrapSvgText(input.description, 46, 4);
  const organizationName = escapeHtml(
    input.organizationName.length > 36
      ? `${input.organizationName.slice(0, 33)}...`
      : input.organizationName,
  );
  const titleStartY = 255;
  const titleLineHeight = 62;
  const descriptionStartY = titleStartY + titleLines.length * titleLineHeight + 28;

  const titleText = titleLines
    .map(
      (line, index) =>
        `<tspan x="104" dy="${index === 0 ? 0 : titleLineHeight}">${escapeHtml(line)}</tspan>`,
    )
    .join("");

  const descriptionText = descriptionLines
    .map(
      (line, index) =>
        `<tspan x="104" dy="${index === 0 ? 0 : 34}">${escapeHtml(line)}</tspan>`,
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="74" y1="68" x2="1118" y2="590" gradientUnits="userSpaceOnUse">
      <stop stop-color="#0B1320" />
      <stop offset="0.55" stop-color="#16263A" />
      <stop offset="1" stop-color="#0E1829" />
    </linearGradient>
    <linearGradient id="accent" x1="190" y1="108" x2="1036" y2="496" gradientUnits="userSpaceOnUse">
      <stop stop-color="#67A1FF" stop-opacity="0.42" />
      <stop offset="1" stop-color="#F79128" stop-opacity="0.28" />
    </linearGradient>
    <filter id="shadow" x="0" y="0" width="1200" height="630" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feDropShadow dx="0" dy="24" stdDeviation="32" flood-opacity="0.18" />
    </filter>
  </defs>
  <rect width="1200" height="630" rx="40" fill="url(#bg)" />
  <circle cx="1038" cy="120" r="168" fill="#67A1FF" fill-opacity="0.14" />
  <circle cx="1030" cy="524" r="186" fill="#F79128" fill-opacity="0.12" />
  <rect x="72" y="72" width="1056" height="486" rx="36" fill="#101B2C" stroke="rgba(255,255,255,0.10)" filter="url(#shadow)" />
  <rect x="94" y="94" width="1012" height="442" rx="30" fill="url(#accent)" fill-opacity="0.16" />
  <rect x="104" y="104" width="140" height="140" rx="28" fill="#FFFFFF" />
  <image href="${input.logoDataUri}" x="122" y="122" width="104" height="104" preserveAspectRatio="xMidYMid meet" />
  <rect x="270" y="118" width="248" height="34" rx="17" fill="rgba(255,255,255,0.12)" />
  <text x="394" y="140" fill="#DCE7F7" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" text-anchor="middle">Voice survey invitation</text>
  <text x="104" y="${titleStartY}" fill="#FFFFFF" font-family="Arial, Helvetica, sans-serif" font-size="56" font-weight="700">${titleText}</text>
  <text x="104" y="${descriptionStartY}" fill="#C4D1E1" font-family="Arial, Helvetica, sans-serif" font-size="28" font-weight="500">${descriptionText}</text>
  <rect x="104" y="482" width="420" height="28" rx="14" fill="rgba(255,255,255,0.10)" />
  <text x="314" y="501" fill="#E9F1FB" font-family="Arial, Helvetica, sans-serif" font-size="18" font-weight="700" text-anchor="middle">From ${organizationName || escapeHtml(BRAND_NAME)}</text>
  <path d="M858 402C906.049 402 945 363.049 945 315C945 266.951 906.049 228 858 228C809.951 228 771 266.951 771 315C771 363.049 809.951 402 858 402Z" stroke="rgba(255,255,255,0.1)" stroke-width="2"/>
  <path d="M922 447C966.183 447 1002 411.183 1002 367C1002 322.817 966.183 287 922 287C877.817 287 842 322.817 842 367C842 411.183 877.817 447 922 447Z" stroke="rgba(103,161,255,0.18)" stroke-width="2"/>
</svg>`;
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

  let survey = null;

  try {
    survey = await fetchSurveyPreview(surveyId);
  } catch (error) {
    console.error("share-survey-card preview lookup failed", error);
  }

  const title = getShareTitle(survey);
  const description = getShareDescription(survey);
  const logoDataUri = await resolveSurveyLogoDataUri(survey?.logo_url);
  const organizationName = getSurveyOrganizationName(survey) || BRAND_NAME;

  res.setHeader("Content-Type", "image/svg+xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, max-age=0, s-maxage=600, stale-while-revalidate=3600",
  );
  res.status(200).send(
    renderSvgCard({
      logoDataUri,
      organizationName,
      title,
      description,
    }),
  );
}
