import { Compass, Home, LayoutDashboard } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { TopNav } from "../components/layout/TopNav";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/Card";
import { EmptyState } from "../components/ui/EmptyState";

type NotFoundPageProps = {
  inApp?: boolean;
};

function NotFoundContent({ inApp = false }: NotFoundPageProps) {
  const navigate = useNavigate();

  return (
    <div className="survica-page-shell py-8 md:py-10">
      <Card className="mx-auto max-w-2xl">
        <EmptyState
          icon={<Compass className="h-5 w-5" />}
          title="Page not found"
          description={
            inApp
              ? "This dashboard route does not exist or is no longer available."
              : "The page you requested does not exist or may have moved."
          }
          action={
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="secondary"
                leadingIcon={<Home className="h-4 w-4" />}
                onClick={() => navigate("/")}
              >
                Go home
              </Button>
              <Button
                leadingIcon={<LayoutDashboard className="h-4 w-4" />}
                onClick={() => navigate("/dashboard")}
              >
                Open dashboard
              </Button>
            </div>
          }
        />
        {!inApp ? (
          <p className="mt-5 text-center text-sm text-text-secondary">
            Looking for your workspace?{" "}
            <Link to="/login" className="font-medium text-brand-blue hover:text-brand-blue-dark">
              Log in
            </Link>
          </p>
        ) : null}
      </Card>
    </div>
  );
}

export default function NotFoundPage({ inApp = false }: NotFoundPageProps) {
  if (inApp) {
    return (
      <AppShell>
        <NotFoundContent inApp />
      </AppShell>
    );
  }

  return (
    <div className="min-h-screen bg-surface-page">
      <TopNav />
      <main>
        <NotFoundContent />
      </main>
    </div>
  );
}
