import { Badge } from "../ui/Badge";
import { Button } from "../ui/button";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";

export function WebhookPanel() {
  return (
    <Card className="space-y-4">
      <div>
        <h3 className="text-base font-medium text-gray-900">Webhook</h3>
        <p className="mt-1 text-sm text-gray-500">Post a JSON payload every time a new response is submitted.</p>
      </div>
      <Input placeholder="https://api.example.com/survica-webhook" />
      <div className="flex flex-wrap gap-2">
        <Button>Save webhook</Button>
        <Badge variant="pending">Not configured</Badge>
      </div>
    </Card>
  );
}
