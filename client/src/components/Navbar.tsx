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

  const desktopButtonIcon = desktopCollapsed ? (
    <FaChevronRight />
  ) : (
    <FaChevronLeft />
  );
  const mobileButtonIcon = <FaBars />;

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900"
            aria-label={
              isMobile
                ? mobileSidebarOpen
                  ? "Close menu"
                  : "Open menu"
                : desktopCollapsed
                  ? "Expand sidebar"
                  : "Collapse sidebar"
            }
          >
            {isMobile ? mobileButtonIcon : desktopButtonIcon}
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-gray-900 sm:text-lg">
              Voice Survey Platform
            </h1>
            <p className="hidden text-xs text-gray-500 sm:block">
              Organization workspace
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => navigate("/profile")}
            className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-gray-300 hover:bg-gray-50"
          >
            <span className="hidden sm:inline">Profile</span>
            <span className="sm:hidden">Me</span>
          </button>

          <button
            onClick={handleLogout}
            className="rounded-xl bg-gray-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-black"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
