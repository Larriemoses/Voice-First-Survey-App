import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Card } from "./ui/Card";
import { SkeletonBlock } from "./ui/SkeletonBlock";

type ProtectedRouteProps = {
  children: ReactNode;
  requireOrg?: boolean;
  redirectAuthenticatedTo?: string;
};

function buildRedirectPath(
  pathname: string,
  search: string,
  hash: string,
): string {
  return `${pathname}${search}${hash}`;
}

function ProtectedRouteSkeleton() {
  return (
    <div className="min-h-screen survica-page-shell py-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
        <SkeletonBlock className="h-10 w-36" />
        <Card className="space-y-4">
          <SkeletonBlock className="h-5 w-40" />
          <SkeletonBlock className="h-20 rounded-lg" />
          <SkeletonBlock className="h-14 rounded-lg" />
        </Card>
      </div>
    </div>
  );
}

export default function ProtectedRoute({
  children,
  requireOrg = true,
  redirectAuthenticatedTo,
}: ProtectedRouteProps) {
  const location = useLocation();
  const { user, org, loading } = useAuth();

  if (loading) {
    return <ProtectedRouteSkeleton />;
  }

  if (!user) {
    const redirect = buildRedirectPath(
      location.pathname,
      location.search,
      location.hash,
    );

    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(redirect)}`}
        replace
      />
    );
  }

  if (requireOrg && !org) {
    return <Navigate to="/onboarding" replace />;
  }

  if (!requireOrg && org && redirectAuthenticatedTo) {
    return <Navigate to={redirectAuthenticatedTo} replace />;
  }

  return <>{children}</>;
}
