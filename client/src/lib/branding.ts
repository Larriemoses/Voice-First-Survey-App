export const BRAND_NAME = "Survica";
export const BRAND_LOGO_URL =
  "https://res.cloudinary.com/dvl2r3bdw/image/upload/v1776447917/survica_2-1_3_ntb3dm.svg";
export const BRAND_FAVICON_URL =
  "https://res.cloudinary.com/dvl2r3bdw/image/upload/f_png,q_auto,w_256,h_256,c_pad,b_white,r_32/v1776447917/survica_2-1_3_ntb3dm.png";
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

export function getSurveyShareImagePath(surveyId: string) {
  return `/api/share-survey-card?surveyId=${encodeURIComponent(surveyId)}`;
}

export function isLocalOrigin(value: string) {
  return /^https?:\/\/(localhost|127(?:\.\d{1,3}){3}|0\.0\.0\.0)(:\d+)?$/i.test(
    trimTrailingSlash(value),
  );
}
