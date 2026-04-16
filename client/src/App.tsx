import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

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
const Home = lazy(() => import("./pages/Home"));

export default function App() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center px-6 text-sm text-slate-500">
          Loading page...
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/auth-check" element={<AuthGate />} />
        <Route path="/take-survey/:surveyId" element={<PublicSurvey />} />
        <Route path="/home" element={<Home />} />

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
    </Suspense>
  );
}
