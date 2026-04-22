import { useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { IntegrationsTab } from "../components/settings/IntegrationsTab";
import { TeamTab } from "../components/settings/TeamTab";
import { Chip } from "../components/ui/Chip";

export default function SettingsPage() {
  const [tab, setTab] = useState<"team" | "integrations">("team");

  return (
    <AppShell>
      <div className="mx-auto max-w-5xl px-5 py-6 md:px-6">
        <div>
          <h1 className="text-lg font-medium text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your workspace, team, and integrations.</p>
        </div>
        <div className="mt-6 flex gap-2">
          <Chip active={tab === "team"} onClick={() => setTab("team")}>Team</Chip>
          <Chip active={tab === "integrations"} onClick={() => setTab("integrations")}>Integrations</Chip>
        </div>
        <div className="mt-6">
          {tab === "team" ? <TeamTab /> : <IntegrationsTab />}
        </div>
      </div>
    </AppShell>
  );
}
