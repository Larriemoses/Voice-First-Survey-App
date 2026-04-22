import { Copy } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/button";
import { Card } from "../ui/Card";
import { type Template } from "../../lib/demoData";

type TemplateCardProps = {
  template: Template;
};

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card className="flex flex-col justify-between gap-5">
      <div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50 text-primary-500">
          <Copy className="h-5 w-5" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-gray-900">{template.name}</h3>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge variant="done">{template.category}</Badge>
          <span className="text-sm text-gray-500">{template.questions} questions</span>
        </div>
      </div>
      <Button variant="secondary">Use template</Button>
    </Card>
  );
}
