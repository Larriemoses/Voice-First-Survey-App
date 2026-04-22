import { TemplateCard } from "./TemplateCard";
import { templates } from "../../lib/demoData";

export function TemplateGallery() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}
