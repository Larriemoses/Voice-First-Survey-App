import { lazy } from "react";
import type { RouteObject } from "react-router-dom";
import { withPublicPage } from "./routeLoaders";

const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

export const notFoundRoutes: RouteObject[] = [
  {
    path: "*",
    element: withPublicPage(<NotFoundPage />, "public"),
  },
];
