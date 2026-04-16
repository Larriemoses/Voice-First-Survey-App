import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaChevronLeft,
  FaChevronRight,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import { signOutUser } from "../lib/auth";

type NavbarProps = {
  isMobile: boolean;
  desktopCollapsed: boolean;
  onToggleSidebar: () => void;
};

export default function Navbar({
  isMobile,
  desktopCollapsed,
  onToggleSidebar,
}: NavbarProps) {
  const navigate = useNavigate();

  async function handleLogout() {
    await signOutUser();
    navigate("/login");
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between gap-3 px-3 sm:px-4 lg:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-700"
            aria-label="Toggle sidebar"
            type="button"
          >
            {isMobile ? (
              <FaBars className="h-4 w-4" />
            ) : desktopCollapsed ? (
              <FaChevronRight className="h-4 w-4" />
            ) : (
              <FaChevronLeft className="h-4 w-4" />
            )}
          </button>

          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-slate-900 sm:text-base lg:text-lg">
              Survica Workspace
            </h2>
            <p className="hidden truncate text-xs text-slate-500 sm:block">
              Simple voice feedback workflows
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={() => navigate("/profile")}
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-700"
            aria-label="Go to profile"
          >
            <FaUser className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Profile</span>
          </button>

          <button
            onClick={handleLogout}
            type="button"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-3 text-sm font-medium text-white transition hover:bg-indigo-700"
            aria-label="Logout"
          >
            <FaSignOutAlt className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
