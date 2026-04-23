import { Suspense, lazy } from "react";
import { Navigate, Route, Routes, useSearchParams } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { Card } from "./components/ui/Card";
import { SkeletonBlock } from "./components/ui/SkeletonBlock";
import { sanitizeRedirectPath } from "./lib/auth";

const HomePage = lazy(() => import("./pages/HomePage"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const BuilderPage = lazy(() => import("./pages/BuilderPage"));
const SurveyPage = lazy(() => import("./pages/SurveyPage"));
const ResultsPage = lazy(() => import("./pages/ResultsPage"));
const AnalyticsPage = lazy(() => import("./pages/AnalyticsPage"));
const OrgAnalyticsPage = lazy(() => import("./pages/OrgAnalyticsPage"));
const TemplatesPage = lazy(() => import("./pages/TemplatesPage"));
const SettingsPage = lazy(() => import("./pages/SettingsPage"));
const OnboardingPage = lazy(() => import("./pages/Onboarding"));

function AuthCallbackRedirect() {
  const [searchParams] = useSearchParams();
  const redirect = sanitizeRedirectPath(searchParams.get("redirect"));

  return <Navigate to={redirect || "/dashboard"} replace />;
}

function AppFallback() {
  return (
    <div className="min-h-screen bg-gray-50 px-5 py-8">
      <div className="mx-auto max-w-5xl">
        <SkeletonBlock className="h-9 w-32" />
        <div className="mt-6 grid gap-4 lg:grid-cols-[1.5fr_0.9fr]">
          <Card className="space-y-4">
            <SkeletonBlock className="h-5 w-36" />
            <SkeletonBlock className="h-12 w-4/5" />
            <SkeletonBlock className="h-24" />
          </Card>
          <Card className="space-y-4">
            <SkeletonBlock className="h-5 w-28" />
            <SkeletonBlock className="h-12" />
            <SkeletonBlock className="h-12" />
            <SkeletonBlock className="h-12" />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<AppFallback />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/signup" element={<AuthPage mode="signup" />} />
        <Route
          path="/auth-check"
          element={
            <ProtectedRoute requireOrg={false}>
              <AuthCallbackRedirect />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute requireOrg={false} redirectAuthenticatedTo="/dashboard">
              <OnboardingPage />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/dashboard/analytics" element={<ProtectedRoute><OrgAnalyticsPage /></ProtectedRoute>} />
        <Route path="/dashboard/templates" element={<ProtectedRoute><TemplatesPage /></ProtectedRoute>} />
        <Route path="/dashboard/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
        <Route path="/dashboard/surveys/:id" element={<ProtectedRoute><BuilderPage /></ProtectedRoute>} />
        <Route path="/dashboard/surveys/:id/results" element={<ProtectedRoute><ResultsPage /></ProtectedRoute>} />
        <Route path="/dashboard/surveys/:id/analytics" element={<ProtectedRoute><AnalyticsPage /></ProtectedRoute>} />
        <Route path="/s/:slug" element={<SurveyPage />} />
        <Route path="/take-survey/:surveyId" element={<SurveyPage />} />
        <Route path="/take-survey/:surveyId/respond/:respondentId" element={<SurveyPage />} />
        <Route path="/take-survey/:surveyId/thank-you" element={<SurveyPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
