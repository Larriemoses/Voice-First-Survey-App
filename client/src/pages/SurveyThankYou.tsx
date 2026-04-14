import { FaCheckCircle } from "react-icons/fa";
import PageMeta from "../components/PageMeta";

export default function SurveyThankYou() {
  return (
    <>
      <PageMeta
        title="Response Submitted"
        description="Thank you for completing this survey."
      />

      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          {/* ICON */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <FaCheckCircle className="h-7 w-7 text-green-600" />
          </div>

          {/* TITLE */}
          <h1 className="mt-6 text-2xl font-semibold text-gray-900">
            Response submitted
          </h1>

          {/* MESSAGE */}
          <p className="mt-3 text-sm leading-relaxed text-gray-500">
            Your voice responses have been recorded successfully. You can now
            close this page.
          </p>

          {/* OPTIONAL FOOTER (very subtle branding) */}
          <p className="mt-8 text-xs text-gray-400">Powered by Survica</p>
        </div>
      </div>
    </>
  );
}
