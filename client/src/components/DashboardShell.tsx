import { useEffect, useState, type ReactNode } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

type Props = {
  children: ReactNode;
};

export default function DashboardShell({ children }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);

      if (!mobile) {
        setMobileSidebarOpen(false);
      }
    }

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (mobileSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileSidebarOpen]);

  function handleToggleSidebar() {
    if (isMobile) {
      setMobileSidebarOpen((prev) => !prev);
    } else {
      setDesktopCollapsed((prev) => !prev);
    }
  }

  function closeMobileSidebar() {
    setMobileSidebarOpen(false);
  }

  const desktopPadding = isMobile
    ? ""
    : desktopCollapsed
      ? "lg:pl-24"
      : "lg:pl-72";

  return (
    <div className="min-h-screen text-slate-900">
      <Navbar
        isMobile={isMobile}
        desktopCollapsed={desktopCollapsed}
        onToggleSidebar={handleToggleSidebar}
      />

      <Sidebar
        isMobile={isMobile}
        collapsed={desktopCollapsed}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={closeMobileSidebar}
      />

      {isMobile && mobileSidebarOpen ? (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-sm"
        />
      ) : null}

      <main
        className={[
          "min-h-screen pt-16 transition-all duration-300",
          desktopPadding,
        ].join(" ")}
      >
        <div className="mx-auto w-full max-w-[1600px] px-3 py-4 sm:px-4 sm:py-5 md:px-6 lg:px-8 lg:py-8">
          <div className="w-full min-w-0">{children}</div>
        </div>
      </main>
    </div>
  );
}
