type BrandedHeaderProps = {
  companyName: string;
  surveyLabel: string;
};

export function BrandedHeader({ companyName, surveyLabel }: BrandedHeaderProps) {
  return (
    <header className="bg-white px-5 py-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-50 text-sm font-medium text-primary-700">AC</div>
        <div>
          <p className="text-sm font-medium text-gray-900">{companyName}</p>
          <p className="text-xs text-gray-500">{surveyLabel}</p>
        </div>
      </div>
    </header>
  );
}
