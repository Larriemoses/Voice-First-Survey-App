import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentSession } from "../lib/auth";
import { Card } from "./ui/Card";
import { Skeleton } from "./ui/Skeleton";

type Props = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    async function check() {
      const session = await getCurrentSession();

      if (!session) {
        navigate("/login");
        return;
      }

      setAuthorized(true);
      setLoading(false);
    }

    check();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen px-4 py-6 sm:px-6 md:px-8">
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
          <Skeleton className="h-16 rounded-[28px]" />
          <Card className="space-y-4">
            <Skeleton className="h-6 w-40 rounded-full" />
            <Skeleton className="h-20 rounded-[24px]" />
            <Skeleton className="h-16 rounded-[24px]" />
          </Card>
        </div>
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
