import { CheckCircle2 } from "lucide-react";
import { Card } from "../ui/Card";
import { Input } from "../ui/Input";
import { Toggle } from "../ui/Toggle";

export function ThankYouEditor() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card className="space-y-4">
        <Input label="Title" defaultValue="Thank you!" />
        <Input label="Message" defaultValue="Your response has been submitted." />
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-gray-900">Show company logo</p>
            <p className="text-sm text-gray-500">Display the respondent-facing brand mark.</p>
          </div>
          <Toggle checked />
        </div>
        <Input label="Redirect URL" placeholder="https://example.com/next-step" />
      </Card>
      <Card className="flex min-h-72 flex-col items-center justify-center text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-primary-500">SV</div>
        <div className="mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-success">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h2 className="mt-5 text-xl font-medium text-gray-900">Thank you!</h2>
        <p className="mt-2 text-base text-gray-500">Your response has been submitted.</p>
        <p className="mt-6 text-xs text-gray-400">Acme research</p>
      </Card>
    </div>
  );
}
