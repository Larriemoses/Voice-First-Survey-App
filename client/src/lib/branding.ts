export const BRAND_NAME = "Survica";
export const BRAND_TAGLINE = "Voice survey operating system";
export const BRAND_LOGO_URL =
  "https://res.cloudinary.com/dvl2r3bdw/image/upload/v1776447917/survica_2-1_3_ntb3dm.svg";
export const BRAND_SHARE_IMAGE_URL =
  "https://res.cloudinary.com/dvl2r3bdw/image/upload/f_png,w_1200,c_limit/v1776447917/survica_2-1_3_ntb3dm.png";
export const DEFAULT_SHARE_DESCRIPTION =
  "Create voice-first surveys, collect spoken feedback, and review clear response insights in one place";
export const DEFAULT_PUBLIC_SURVEY_DESCRIPTION =
  "You've been invited to answer this voice survey";

export function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export function getSurveyPath(surveyId: string) {
  return `/take-survey/${surveyId}`;
}

export function getSurveySharePath(surveyId: string) {
  return `/share/survey/${surveyId}`;
}
