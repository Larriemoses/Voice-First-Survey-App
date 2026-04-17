import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import PageMeta from "../components/PageMeta";
import { getCurrentSession } from "../lib/auth";
import { getMyOrganizationMembership } from "../lib/organization";
import { Card } from "../components/ui/Card";
import { Feedback } from "../components/ui/Feedback";
import { Skeleton } from "../components/ui/Skeleton";

type Destination = "/login" | "/dashboard" | "/onboarding" | null;

export default function AuthGate() {
  const [destination, setDestination] = useState<Destination>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    async function run() {
      try {
        const session = await getCurrentSession();

        if (!session) {
          setDestination("/login");
          return;
        }

        const membership = await getMyOrganizationMembership();
        setDestination(membership?.organization ? "/dashboard" : "/onboarding");
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    }

    run();
  }, []);

  if (error) {
    return (
      <>
        <PageMeta
          title="Checking Workspace | Survica"
          description="Checking where to send you next"
        />
        <div className="flex min-h-screen items-center justify-center px-4">
          <Card className="w-full max-w-lg">
            <Feedback
              variant="error"
              title="We couldn't check your workspace"
              description={error}
            />
          </Card>
        </div>
      </>
    );
  }

  if (!destination) {
    return (
      <>
        <PageMeta
          title="Checking Workspace | Survica"
          description="Checking where to send you next"
        />
        <div className="flex min-h-screen items-center justify-center px-4">
          <Card className="w-full max-w-lg space-y-4">
            <div>
              <h1 className="text-2xl font-semibold text-[var(--color-text)]">
                Checking your workspace
              </h1>
              <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                This should only take a moment
              </p>
            </div>
            <Skeleton className="h-12 rounded-[20px]" />
            <Skeleton className="h-24 rounded-[24px]" />
          </Card>
        </div>
      </>
    );
  }

  return <Navigate to={destination} replace />;
}
