import { AppShell } from "../components/layout/AppShell";
import { TemplateGallery } from "../components/templates/TemplateGallery";
import { Button } from "../components/ui/button";

export default function TemplatesPage() {
  return (
    <AppShell>
      <div className="mx-auto max-w-[1440px] px-5 py-6 md:px-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-medium text-gray-900">Templates</h1>
            <p className="mt-1 text-sm text-gray-500">Reusable survey starters for common research workflows.</p>
          </div>
          <Button variant="secondary">Save current survey as template</Button>
        </div>
        <div className="mt-6">
          <TemplateGallery />
        </div>
      </div>
    </AppShell>
  );
}
