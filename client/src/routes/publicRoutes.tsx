import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { Navigate, useSearchParams } from "react-router-dom";
import { sanitizeRedirectPath } from "../lib/auth";
import { withProtectedPage, withPublicPage } from "./routeLoaders";

const HomePage = lazy(() => import("../pages/HomePage"));
const PublicSurveyPage = lazy(() => import("../pages/PublicSurveyPage"));
const LoginPage = lazy(() => import("../pages/auth/LoginPage"));
const SignUpPage = lazy(() => import("../pages/auth/SignUpPage"));
const ForgotPasswordPage = lazy(
  () => import("../pages/auth/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(
  () => import("../pages/auth/ResetPasswordPage"),
);
const AuthConfirmPage = lazy(() => import("../pages/auth/AuthConfirmPage"));

function AuthCallbackRedirect() {
  const [searchParams] = useSearchParams();
  const redirect = sanitizeRedirectPath(searchParams.get("redirect"));

  return <Navigate to={redirect || "/dashboard"} replace />;
}

export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: withPublicPage(<HomePage />, "public"),
  },
  {
    path: "/home",
    element: <Navigate to="/" replace />,
  },
  {
    path: "/login",
    element: withPublicPage(<LoginPage />, "auth"),
  },
  {
    path: "/signup",
    element: withPublicPage(<SignUpPage />, "auth"),
  },
  {
    path: "/forgot-password",
    element: withPublicPage(<ForgotPasswordPage />, "auth"),
  },
  {
    path: "/auth/confirm",
    element: withPublicPage(<AuthConfirmPage />, "auth"),
  },
  {
    path: "/auth/reset-password",
    element: withPublicPage(<ResetPasswordPage />, "auth"),
  },
  {
    path: "/reset-password",
    element: <Navigate to="/auth/reset-password" replace />,
  },
  {
    path: "/s/:slug",
    element: withPublicPage(<PublicSurveyPage />, "public"),
  },
  {
    path: "/auth-check",
    element: withProtectedPage(<AuthCallbackRedirect />, {
      variant: "auth",
      requireOrg: false,
    }),
  },
];
