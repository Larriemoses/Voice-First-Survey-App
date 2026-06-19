import { lazy, useEffect, useState } from "react";
import type { RouteObject } from "react-router-dom";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { completeAuthRedirect, sanitizeRedirectPath } from "../lib/auth";
import { withPublicPage } from "./routeLoaders";

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
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = sanitizeRedirectPath(searchParams.get("redirect"));
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function finishSignIn() {
      try {
        await completeAuthRedirect(window.location.search);

        if (active) {
          navigate(redirect || "/dashboard", { replace: true });
        }
      } catch (caughtError) {
        if (active) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "We couldn't complete sign-in.",
          );
        }
      }
    }

    void finishSignIn();

    return () => {
      active = false;
    };
  }, [navigate, redirect]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
        <div className="w-full max-w-md rounded-[28px] bg-white p-8 text-center shadow-lg">
          <h1 className="text-2xl font-semibold tracking-[-0.03em] text-text-primary">
            Sign-in needs another try
          </h1>
          <p className="mt-3 text-sm leading-6 text-text-secondary">{error}</p>
          <Link
            to="/login"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-full bg-brand-blue px-6 text-sm font-semibold text-white hover:bg-brand-blue-dark"
          >
            Return to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-sm rounded-[28px] bg-white p-8 text-center shadow-lg">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-blue-light border-t-brand-blue" />
        <h1 className="mt-5 text-xl font-semibold text-text-primary">Finishing your sign-in</h1>
        <p className="mt-2 text-sm text-text-secondary">This should only take a moment.</p>
      </div>
    </main>
  );
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
    element: withPublicPage(<AuthCallbackRedirect />, "auth"),
  },
];
