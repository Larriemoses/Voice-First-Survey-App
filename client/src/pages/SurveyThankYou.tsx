import { FaCheckCircle } from "react-icons/fa";

export default function SurveyThankYou() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="max-w-xl rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <FaCheckCircle className="h-8 w-8 text-green-600" />
        </div>

        <h1 className="mt-6 text-2xl font-semibold text-gray-900">
          Thank you for your response
        </h1>

        <p className="mt-3 text-sm leading-6 text-gray-500">
          Your voice responses have been recorded successfully. You may now
          close this page.
        </p>
      </div>
    </div>
  );
}
