import { ArrowLeft } from "lucide-react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/button";
import { Chip } from "../ui/Chip";

const tabs = [
  { label: "Build", href: "" },
  { label: "Design", href: "" },
  { label: "Share", href: "" },
  { label: "Results", href: "results" },
  { label: "Analytics", href: "analytics" },
];

export function BuilderNav() {
  const { pathname } = useLocation();
  const { id = "q4-customer-satisfaction" } = useParams();
  const basePath = `/dashboard/surveys/${id}`;

  return (
    <div className="sticky top-0 z-20 border-b border-gray-200 bg-white">
      <div className="flex min-h-[52px] flex-col gap-3 px-4 py-3 lg:flex-row lg:items-center lg:justify-between lg:px-6">
        <div className="flex min-w-0 flex-wrap items-center gap-3">
          <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary-500">
            <ArrowLeft className="h-4 w-4" />
            My surveys
          </Link>
          <span className="hidden h-4 w-px bg-gray-200 sm:block" />
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="truncate text-base font-medium text-gray-900">Q4 customer satisfaction</h1>
            <Badge variant="active">Active</Badge>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((tab) => {
            const href = tab.href ? `${basePath}/${tab.href}` : basePath;
            const active = tab.href ? pathname.endsWith(`/${tab.href}`) : pathname === basePath;

            return (
              <Link key={tab.label} to={href}>
                <Chip active={active}>{tab.label}</Chip>
              </Link>
            );
          })}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary">Preview</Button>
          <Button>Publish</Button>
        </div>
      </div>
    </div>
  );
}
