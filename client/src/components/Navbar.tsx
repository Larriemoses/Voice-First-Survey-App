import { useNavigate } from "react-router-dom";
import { FaBars, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { signOutUser } from "../lib/auth";

type NavbarProps = {
  isMobile: boolean;
  desktopCollapsed: boolean;
  mobileSidebarOpen: boolean;
  onToggleSidebar: () => void;
};

export default function Navbar({
  isMobile,
  desktopCollapsed,
  mobileSidebarOpen,
  onToggleSidebar,
}: NavbarProps) {
  const navigate = useNavigate();

  async function handleLogout() {
    await signOutUser();
    navigate("/login");
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-slate-200 bg-white/90 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900"
            aria-label="Toggle sidebar"
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
            <h2 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
              Survica Workspace
            </h2>
            <p className="hidden text-xs text-slate-500 sm:block">
              Review surveys, transcripts, and reports
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-[#0B4EA2] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#093E81]"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
