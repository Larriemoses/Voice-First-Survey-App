import { ExternalLink } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/button";
import { Card } from "../ui/Card";
import { Select } from "../ui/Select";
import { WebhookPanel } from "./WebhookPanel";

export function IntegrationsTab() {
  return (
    <div className="space-y-4">
      <WebhookPanel />
      <Card className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-base font-medium text-gray-900">Slack notifications</h3>
            <p className="mt-1 text-sm text-gray-500">Send new response alerts to a chosen Slack channel.</p>
          </div>
          <Button variant="secondary">Connect workspace</Button>
        </div>
        <Select defaultValue="insights">
          <option value="insights">#customer-insights</option>
          <option value="support">#support</option>
        </Select>
      </Card>
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-medium text-gray-900">Zapier</h3>
          <p className="mt-1 text-sm text-gray-500">Connect Survica responses to your automation workflows.</p>
        </div>
        <Button variant="secondary" trailingIcon={<ExternalLink className="h-4 w-4" />}>Connect with Zapier</Button>
      </Card>
      <Card className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-medium text-gray-900">Google Sheets</h3>
          <p className="mt-1 text-sm text-gray-500">Export responses to a linked spreadsheet.</p>
        </div>
        <Badge variant="pending">Coming soon</Badge>
      </Card>
    </div>
  );
}
