import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { withProtectedPage } from "./routeLoaders";

const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const BuilderPage = lazy(() => import("../pages/BuilderPage"));
const ResultsPage = lazy(() => import("../pages/ResultsPage"));
const AnalyticsPage = lazy(() => import("../pages/AnalyticsPage"));
const OrgAnalyticsPage = lazy(() => import("../pages/OrgAnalyticsPage"));
const TemplatesPage = lazy(() => import("../pages/TemplatesPage"));
const SettingsPage = lazy(() => import("../pages/SettingsPage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

export const protectedRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: withProtectedPage(<DashboardPage />, { variant: "app" }),
  },
  {
    path: "/dashboard/surveys/new",
    element: withProtectedPage(<BuilderPage />, { variant: "builder" }),
  },
  {
    path: "/dashboard/surveys/:id",
    element: withProtectedPage(<BuilderPage />, { variant: "builder" }),
  },
  {
    path: "/dashboard/surveys/:id/results",
    element: withProtectedPage(<ResultsPage />, { variant: "builder" }),
  },
  {
    path: "/dashboard/surveys/:id/analytics",
    element: withProtectedPage(<AnalyticsPage />, { variant: "builder" }),
  },
  {
    path: "/dashboard/analytics",
    element: withProtectedPage(<OrgAnalyticsPage />, { variant: "app" }),
  },
  {
    path: "/dashboard/templates",
    element: withProtectedPage(<TemplatesPage />, { variant: "app" }),
  },
  {
    path: "/dashboard/settings",
    element: withProtectedPage(<SettingsPage initialTab="team" />, {
      variant: "app",
    }),
  },
  {
    path: "/dashboard/settings/team",
    element: withProtectedPage(<SettingsPage initialTab="team" />, {
      variant: "app",
    }),
  },
  {
    path: "/dashboard/settings/integrations",
    element: withProtectedPage(<SettingsPage initialTab="integrations" />, {
      variant: "app",
    }),
  },
  {
    path: "/dashboard/*",
    element: withProtectedPage(<NotFoundPage inApp />, { variant: "app" }),
  },
];
