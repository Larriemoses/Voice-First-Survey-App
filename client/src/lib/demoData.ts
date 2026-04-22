export type SurveyStatus = "active" | "draft" | "closed";

export type Survey = {
  id: string;
  name: string;
  status: SurveyStatus;
  questions: number;
  responses: number;
  lastActivity: string;
  completionRate: number;
  team: string[];
  liveResponses?: number;
};

export type SurveyQuestion = {
  id: string;
  label: string;
  text: string;
  hint: string;
  required: boolean;
};

export type ResponseItem = {
  id: string;
  respondent: string;
  duration: string;
  questionCount: string;
  timestamp: string;
  status: "done" | "pending";
  sentiment: "positive" | "neutral" | "negative";
  emotion: string;
  quality: number;
  qualityRationale: string;
  transcript: string;
};

export type Template = {
  id: string;
  name: string;
  category: string;
  questions: number;
};

export const surveys: Survey[] = [
  {
    id: "q4-customer-satisfaction",
    name: "Q4 customer satisfaction",
    status: "active",
    questions: 7,
    responses: 43,
    lastActivity: "12 min ago",
    completionRate: 82,
    team: ["JA", "MO", "LK"],
    liveResponses: 2,
  },
  {
    id: "product-onboarding",
    name: "Product onboarding research",
    status: "active",
    questions: 5,
    responses: 29,
    lastActivity: "1 hr ago",
    completionRate: 76,
    team: ["JA", "NT"],
  },
  {
    id: "event-feedback",
    name: "Event feedback",
    status: "draft",
    questions: 6,
    responses: 0,
    lastActivity: "Yesterday",
    completionRate: 0,
    team: ["MO"],
  },
  {
    id: "churn-exit-survey",
    name: "Churn exit survey",
    status: "closed",
    questions: 4,
    responses: 56,
    lastActivity: "Mar 28",
    completionRate: 68,
    team: ["JA", "LK"],
  },
];

export const questions: SurveyQuestion[] = [
  {
    id: "q1",
    label: "Q1 - Voice",
    text: "What stood out most about your experience with us this quarter?",
    hint: "Mention one or two moments that shaped your opinion.",
    required: true,
  },
  {
    id: "q2",
    label: "Q2 - Voice",
    text: "Where did we make your work easier, faster, or more confident?",
    hint: "Think about speed, support, reliability, or clarity.",
    required: true,
  },
  {
    id: "q3",
    label: "Q3 - Voice",
    text: "What should we improve before your next purchase or renewal?",
    hint: "Be as specific as possible so the team can act on it.",
    required: false,
  },
  {
    id: "q4",
    label: "Q4 - Voice",
    text: "If you could change one thing about pricing or communication, what would it be?",
    hint: "Share what felt unclear, surprising, or fair.",
    required: false,
  },
];

export const responses: ResponseItem[] = [
  {
    id: "r01",
    respondent: "R-01",
    duration: "1m 42s",
    questionCount: "7/7",
    timestamp: "12 min ago",
    status: "done",
    sentiment: "positive",
    emotion: "Satisfied",
    quality: 86,
    qualityRationale: "Detailed response with clear themes",
    transcript:
      "Delivery was faster than expected and the support team stayed friendly throughout. The only thing I would change is making renewal pricing easier to understand before the invoice arrives.",
  },
  {
    id: "r02",
    respondent: "R-02",
    duration: "58s",
    questionCount: "6/7",
    timestamp: "28 min ago",
    status: "pending",
    sentiment: "neutral",
    emotion: "Curious",
    quality: 58,
    qualityRationale: "Useful but missing examples",
    transcript:
      "The product works well overall. I would like a clearer onboarding email and maybe a checklist so the team knows what to do first.",
  },
  {
    id: "r03",
    respondent: "R-03",
    duration: "2m 21s",
    questionCount: "7/7",
    timestamp: "1 hr ago",
    status: "done",
    sentiment: "negative",
    emotion: "Frustrated",
    quality: 74,
    qualityRationale: "Specific concerns and actionable detail",
    transcript:
      "Support was responsive, but the pricing page did not match what sales described. We lost time clarifying the plan limits and that made the purchase feel less transparent.",
  },
  {
    id: "r04",
    respondent: "R-04",
    duration: "1m 15s",
    questionCount: "7/7",
    timestamp: "2 hrs ago",
    status: "done",
    sentiment: "positive",
    emotion: "Excited",
    quality: 91,
    qualityRationale: "High context and strong recommendation signals",
    transcript:
      "The setup process was surprisingly smooth. Fast delivery, clear next steps, and practical support are the reasons I would recommend this to another team.",
  },
];

export const sentimentTrend = [
  { day: "Apr 1", positive: 62, negative: 18 },
  { day: "Apr 6", positive: 66, negative: 16 },
  { day: "Apr 11", positive: 69, negative: 14 },
  { day: "Apr 16", positive: 74, negative: 12 },
  { day: "Apr 21", positive: 78, negative: 10 },
];

export const responseVolume = [
  { day: "Mon", responses: 5 },
  { day: "Tue", responses: 8 },
  { day: "Wed", responses: 7 },
  { day: "Thu", responses: 11 },
  { day: "Fri", responses: 12 },
];

export const themeBreakdown = [
  { theme: "Fast delivery", count: 26 },
  { theme: "Friendly support", count: 23 },
  { theme: "Pricing clarity", count: 15 },
  { theme: "Onboarding", count: 12 },
  { theme: "Reliability", count: 9 },
  { theme: "Reporting", count: 7 },
];

export const sentimentByQuestion = [
  { question: "Q1", positive: 72, neutral: 18, negative: 10 },
  { question: "Q2", positive: 80, neutral: 14, negative: 6 },
  { question: "Q3", positive: 54, neutral: 26, negative: 20 },
  { question: "Q4", positive: 44, neutral: 22, negative: 34 },
];

export const keywords = [
  { label: "delivery", score: 18 },
  { label: "support", score: 17 },
  { label: "pricing", score: 15 },
  { label: "clear", score: 12 },
  { label: "setup", score: 10 },
  { label: "renewal", score: 9 },
  { label: "friendly", score: 8 },
  { label: "invoice", score: 6 },
  { label: "checklist", score: 5 },
];

export const emotionDistribution = [
  { name: "Positive", value: 48, color: "#10B981" },
  { name: "Neutral", value: 22, color: "#9CA3AF" },
  { name: "Frustrated", value: 14, color: "#EF4444" },
  { name: "Confused", value: 8, color: "#F59E0B" },
  { name: "Excited", value: 8, color: "#3B82F6" },
];

export const templates: Template[] = [
  { id: "customer-feedback", name: "Customer satisfaction check-in", category: "Customer feedback", questions: 7 },
  { id: "product-research", name: "Feature discovery interview", category: "Product research", questions: 8 },
  { id: "employee-pulse", name: "Monthly employee pulse", category: "Employee pulse", questions: 6 },
  { id: "event-follow-up", name: "Event attendee reflection", category: "Event follow-up", questions: 5 },
  { id: "exit-survey", name: "Customer exit interview", category: "Exit survey", questions: 4 },
  { id: "beta-feedback", name: "Beta programme feedback", category: "Product research", questions: 9 },
];

export const orgSurveyVolume = [
  { survey: "Q4 satisfaction", responses: 43 },
  { survey: "Onboarding", responses: 29 },
  { survey: "Exit", responses: 56 },
  { survey: "Event", responses: 0 },
];

export const orgSentimentTrend = [
  { day: "Apr 1", q4: 62, onboarding: 58, exit: 42 },
  { day: "Apr 8", q4: 68, onboarding: 61, exit: 46 },
  { day: "Apr 15", q4: 74, onboarding: 66, exit: 48 },
  { day: "Apr 22", q4: 78, onboarding: 70, exit: 52 },
];
