import { Suspense, lazy } from "react";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useParams,
} from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { Card } from "./components/ui/Card";
import { Skeleton } from "./components/ui/Skeleton";
import { getSurveyPath } from "./lib/branding";
import Home from "./pages/Home";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Profile = lazy(() => import("./pages/Profile"));
const Onboarding = lazy(() => import("./pages/Onboarding"));
const AuthGate = lazy(() => import("./pages/AuthGate"));
const Surveys = lazy(() => import("./pages/Surveys"));
const CreateSurvey = lazy(() => import("./pages/CreateSurvey"));
const SurveyBuilder = lazy(() => import("./pages/SurveyBuilder"));
const PublicSurvey = lazy(() => import("./pages/PublicSurvey"));
const RespondSurvey = lazy(() => import("./pages/RespondSurvey"));
const SurveyThankYou = lazy(() => import("./pages/SurveyThankYou"));
const SurveyResponses = lazy(() => import("./pages/SurveyResponses"));

function SurveyShareRedirect() {
  const { surveyId } = useParams();

  if (!surveyId) {
    return <Navigate to="/" replace />;
  }

  return <Navigate to={getSurveyPath(surveyId)} replace />;
}

function AppFallback() {
  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <Skeleton className="h-16 rounded-[28px]" />
        <div className="grid gap-4 lg:grid-cols-[1.5fr_0.9fr]">
          <Card className="space-y-4">
            <Skeleton className="h-6 w-36 rounded-full" />
            <Skeleton className="h-12 w-4/5" />
            <Skeleton className="h-20 rounded-[24px]" />
          </Card>
          <Card className="space-y-4">
            <Skeleton className="h-5 w-28" />
            <Skeleton className="h-12 rounded-[20px]" />
            <Skeleton className="h-12 rounded-[20px]" />
            <Skeleton className="h-12 rounded-[20px]" />
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const location = useLocation();

  return (
    <Suspense fallback={<AppFallback />}>
      <div
        key={location.pathname}
        className="motion-safe:animate-[page-in_260ms_cubic-bezier(0.16,1,0.3,1)]"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth-check" element={<AuthGate />} />
          <Route path="/take-survey/:surveyId" element={<PublicSurvey />} />
          <Route path="/share/survey/:surveyId" element={<SurveyShareRedirect />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/onboarding"
            element={
              <ProtectedRoute>
                <Onboarding />
              </ProtectedRoute>
            }
          />
          <Route
            path="/surveys"
            element={
              <ProtectedRoute>
                <Surveys />
              </ProtectedRoute>
            }
          />

          <Route
            path="/surveys/create"
            element={
              <ProtectedRoute>
                <CreateSurvey />
              </ProtectedRoute>
            }
          />

          <Route
            path="/surveys/:surveyId"
            element={
              <ProtectedRoute>
                <SurveyBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/take-survey/:surveyId/respond/:respondentId"
            element={<RespondSurvey />}
          />
          <Route
            path="/take-survey/:surveyId/thank-you"
            element={<SurveyThankYou />}
          />
          <Route
            path="/surveys/:surveyId/responses"
            element={
              <ProtectedRoute>
                <SurveyResponses />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Suspense>
  );
}
