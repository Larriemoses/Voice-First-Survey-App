import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Onboarding from "./pages/Onboarding";
import AuthGate from "./pages/AuthGate";
import ProtectedRoute from "./components/ProtectedRoute";
import Surveys from "./pages/Surveys";
import CreateSurvey from "./pages/CreateSurvey";
import SurveyBuilder from "./pages/SurveyBuilder";
import PublicSurvey from "./pages/PublicSurvey";
import RespondSurvey from "./pages/RespondSurvey";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth-check" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/auth-check" element={<AuthGate />} />
      <Route path="/take-survey/:surveyId" element={<PublicSurvey />} />

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
      <Route path="/take-survey/:surveyId" element={<PublicSurvey />} />
      <Route
        path="/take-survey/:surveyId/respond/:respondentId"
        element={<RespondSurvey />}
      />
    </Routes>
  );
}
