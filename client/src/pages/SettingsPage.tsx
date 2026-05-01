import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppShell } from "../components/layout/AppShell";
import { IntegrationsTab } from "../components/settings/IntegrationsTab";
import { TeamTab } from "../components/settings/TeamTab";
import { Chip } from "../components/ui/Chip";

type SettingsPageProps = {
  initialTab?: "team" | "integrations";
};

export default function SettingsPage({
  initialTab = "team",
}: SettingsPageProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<"team" | "integrations">(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab]);

  function selectTab(nextTab: "team" | "integrations") {
    setTab(nextTab);
    navigate(`/dashboard/settings/${nextTab}`);
  }

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-5 py-6 md:px-6">
        <div>
          <h1 className="text-lg font-medium text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your workspace, team, and integrations.</p>
        </div>
        <div className="mt-6 flex gap-2">
          <Chip active={tab === "team"} onClick={() => selectTab("team")}>Team</Chip>
          <Chip active={tab === "integrations"} onClick={() => selectTab("integrations")}>Integrations</Chip>
        </div>
        <div className="mt-6">
          {tab === "team" ? <TeamTab /> : <IntegrationsTab />}
        </div>
      </div>
    </AppShell>
  );
}
