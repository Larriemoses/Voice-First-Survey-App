import { useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentSession } from "../lib/auth";

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
      <div className="flex min-h-screen items-center justify-center bg-gray-50 text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  return authorized ? <>{children}</> : null;
}
