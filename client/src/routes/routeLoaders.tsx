import { Suspense, type ReactNode } from "react";
import ProtectedRoute from "../components/ProtectedRoute";
import { Card } from "../components/ui/Card";
import { SkeletonBlock } from "../components/ui/SkeletonBlock";

export type RouteLoaderVariant = "public" | "auth" | "app" | "builder";

type RouteFallbackProps = {
  variant?: RouteLoaderVariant;
};

export function RouteFallback({ variant = "public" }: RouteFallbackProps) {
  if (variant === "app") {
    return (
      <div className="h-screen overflow-hidden bg-surface-page">
        <div className="hidden h-full w-[52px] border-r border-border bg-surface-card md:fixed md:left-0 md:top-0 md:block">
          <div className="flex h-full flex-col items-center gap-4 py-3">
            <SkeletonBlock className="h-7 w-7 rounded-lg" />
            <div className="mt-4 flex flex-col gap-3">
              <SkeletonBlock className="h-9 w-9 rounded-lg" />
              <SkeletonBlock className="h-9 w-9 rounded-lg" />
              <SkeletonBlock className="h-9 w-9 rounded-lg" />
              <SkeletonBlock className="h-9 w-9 rounded-lg" />
            </div>
          </div>
        </div>
        <div className="h-full md:pl-[52px]">
          <div className="h-full overflow-hidden pb-[72px] md:pb-0">
            <div className="survica-page-shell py-6">
              <div className="space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="space-y-2">
                    <SkeletonBlock className="h-6 w-40" />
                    <SkeletonBlock className="h-4 w-56" />
                  </div>
                  <SkeletonBlock className="h-[38px] w-32" />
                </div>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {Array.from({ length: 4 }, (_, index) => (
                    <Card key={index} variant="muted" hoverable={false} className="space-y-3">
                      <SkeletonBlock className="h-4 w-24" />
                      <SkeletonBlock className="h-7 w-20" />
                      <SkeletonBlock className="h-4 w-28" />
                    </Card>
                  ))}
                </div>
                <Card className="space-y-4">
                  <SkeletonBlock className="h-5 w-36" />
                  <SkeletonBlock className="h-16 rounded-lg" />
                  <SkeletonBlock className="h-16 rounded-lg" />
                  <SkeletonBlock className="h-16 rounded-lg" />
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "builder") {
    return (
      <div className="h-screen overflow-hidden bg-surface-page">
        <div className="hidden h-full w-[52px] border-r border-border bg-surface-card md:fixed md:left-0 md:top-0 md:block" />
        <div className="h-full md:pl-[52px]">
          <div className="sticky top-0 z-20 border-b border-border bg-surface-card">
            <div className="survica-page-shell flex min-h-[52px] flex-col gap-3 py-3">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-2">
                  <SkeletonBlock className="h-4 w-24" />
                  <SkeletonBlock className="h-5 w-44" />
                </div>
                <div className="flex gap-2">
                  <SkeletonBlock className="h-[38px] w-24" />
                  <SkeletonBlock className="h-[38px] w-28" />
                </div>
              </div>
              <div className="flex gap-2 overflow-hidden">
                {Array.from({ length: 5 }, (_, index) => (
                  <SkeletonBlock key={index} className="h-7 w-20 rounded-full" />
                ))}
              </div>
            </div>
          </div>
          <div className="grid min-h-[calc(100vh-52px)] lg:grid-cols-[220px_minmax(0,1fr)_240px]">
            <div className="border-r border-border bg-surface-muted p-4">
              <div className="space-y-3">
                {Array.from({ length: 5 }, (_, index) => (
                  <SkeletonBlock key={index} className="h-20 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="bg-surface-card p-5 md:p-6">
              <Card className="space-y-4">
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="h-24 rounded-lg" />
                <SkeletonBlock className="h-24 rounded-lg" />
                <SkeletonBlock className="h-24 rounded-lg" />
              </Card>
            </div>
            <div className="border-l border-border bg-surface-muted p-4">
              <div className="space-y-4">
                <SkeletonBlock className="h-32 rounded-lg" />
                <SkeletonBlock className="h-28 rounded-lg" />
                <SkeletonBlock className="h-24 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "auth") {
    return (
      <div className="min-h-screen bg-surface-page">
        <div className="border-b border-border bg-surface-card">
          <div className="survica-page-shell flex h-[60px] items-center justify-between">
            <SkeletonBlock className="h-7 w-28" />
            <SkeletonBlock className="hidden h-6 w-44 md:block" />
            <div className="hidden gap-2 md:flex">
              <SkeletonBlock className="h-[38px] w-20" />
              <SkeletonBlock className="h-[38px] w-32" />
            </div>
          </div>
        </div>
        <main className="survica-page-shell py-8 md:py-10 lg:py-12">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(380px,440px)]">
            <Card className="hidden space-y-4 lg:block">
              <SkeletonBlock className="h-6 w-28" />
              <SkeletonBlock className="h-10 w-4/5" />
              <SkeletonBlock className="h-5 w-full" />
              <SkeletonBlock className="h-24 rounded-lg" />
              <SkeletonBlock className="h-24 rounded-lg" />
              <SkeletonBlock className="h-24 rounded-lg" />
            </Card>
            <Card className="space-y-4">
              <SkeletonBlock className="h-6 w-24" />
              <SkeletonBlock className="h-9 w-3/4" />
              <SkeletonBlock className="h-5 w-full" />
              <SkeletonBlock className="h-[38px]" />
              <SkeletonBlock className="h-[38px]" />
              <SkeletonBlock className="h-[46px]" />
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-page">
      <div className="border-b border-border bg-surface-card">
        <div className="survica-page-shell flex h-[60px] items-center justify-between">
          <SkeletonBlock className="h-7 w-28" />
          <SkeletonBlock className="hidden h-6 w-52 md:block" />
          <div className="hidden gap-2 md:flex">
            <SkeletonBlock className="h-[38px] w-20" />
            <SkeletonBlock className="h-[38px] w-32" />
          </div>
        </div>
      </div>
      <main className="survica-page-shell py-10">
        <div className="space-y-6">
          <div className="mx-auto max-w-3xl space-y-3 text-center">
            <SkeletonBlock className="mx-auto h-6 w-28" />
            <SkeletonBlock className="mx-auto h-12 w-3/4" />
            <SkeletonBlock className="mx-auto h-5 w-2/3" />
          </div>
          <Card className="mx-auto max-w-5xl">
            <SkeletonBlock className="h-[360px] rounded-lg" />
          </Card>
        </div>
      </main>
    </div>
  );
}

type RouteSuspenseProps = {
  children: ReactNode;
  variant?: RouteLoaderVariant;
};

export function RouteSuspense({
  children,
  variant = "public",
}: RouteSuspenseProps) {
  return <Suspense fallback={<RouteFallback variant={variant} />}>{children}</Suspense>;
}

type ProtectedPageOptions = {
  variant?: RouteLoaderVariant;
  requireOrg?: boolean;
  redirectAuthenticatedTo?: string;
};

export function withProtectedPage(
  children: ReactNode,
  options?: ProtectedPageOptions,
) {
  return (
    <ProtectedRoute
      requireOrg={options?.requireOrg}
      redirectAuthenticatedTo={options?.redirectAuthenticatedTo}
    >
      <RouteSuspense variant={options?.variant ?? "app"}>{children}</RouteSuspense>
    </ProtectedRoute>
  );
}

export function withPublicPage(
  children: ReactNode,
  variant: RouteLoaderVariant = "public",
) {
  return <RouteSuspense variant={variant}>{children}</RouteSuspense>;
}
