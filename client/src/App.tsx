import { useMemo } from "react";
import { useRoutes, type RouteObject } from "react-router-dom";
import { notFoundRoutes } from "./routes/notFoundRoutes";
import { onboardingRoutes } from "./routes/onboardingRoutes";
import { protectedRoutes } from "./routes/protectedRoutes";
import { publicRoutes } from "./routes/publicRoutes";

export default function App() {
  const routes = useMemo<RouteObject[]>(
    () => [
      ...publicRoutes,
      ...onboardingRoutes,
      ...protectedRoutes,
      ...notFoundRoutes,
    ],
    [],
  );

  return useRoutes(routes);
}
