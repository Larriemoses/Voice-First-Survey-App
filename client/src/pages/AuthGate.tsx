import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getCurrentSession } from "../lib/auth";
import { getMyOrganizationMembership } from "../lib/organization";

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

        if (membership?.organization) {
          setDestination("/dashboard");
        } else {
          setDestination("/onboarding");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    }

    run();
  }, []);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
        Checking your workspace...
      </div>
    );
  }

  return <Navigate to={destination} replace />;
}
