import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { withProtectedPage } from "./routeLoaders";

const OnboardingPage = lazy(() => import("../pages/auth/OnboardingPage"));

export const onboardingRoutes: RouteObject[] = [
  {
    path: "/onboarding",
    element: withProtectedPage(<OnboardingPage />, {
      variant: "auth",
      requireOrg: false,
      redirectAuthenticatedTo: "/dashboard",
    }),
  },
];
