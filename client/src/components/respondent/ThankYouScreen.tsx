import { CheckCircle2 } from "lucide-react";

type ThankYouScreenProps = {
  companyName: string;
};

export function ThankYouScreen({ companyName }: ThankYouScreenProps) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-5">
      <div className="w-full max-w-[480px] rounded-lg border border-gray-200 bg-white px-5 py-10 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-50 text-sm font-medium text-primary-700">AC</div>
        <div className="mx-auto mt-8 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-success">
          <CheckCircle2 className="h-9 w-9" />
        </div>
        <h1 className="mt-5 text-xl font-medium text-gray-900">Thank you!</h1>
        <p className="mt-2 text-base text-gray-500">Your response has been submitted.</p>
        <p className="mt-8 text-xs text-gray-400">{companyName}</p>
      </div>
    </main>
  );
}
