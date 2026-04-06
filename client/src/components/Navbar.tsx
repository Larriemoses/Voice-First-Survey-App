import { useNavigate } from "react-router-dom";
import { signOutUser } from "../lib/auth";

export default function Navbar() {
  const navigate = useNavigate();

  async function handleLogout() {
    await signOutUser();
    navigate("/login");
  }

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div>
        <h1 className="text-lg font-semibold text-gray-900">
          Voice Survey Platform
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/profile")}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
        >
          Profile
        </button>
        <button
          onClick={handleLogout}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
