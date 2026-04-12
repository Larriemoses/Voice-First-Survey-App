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

  const desktopPadding = desktopCollapsed ? "lg:pl-24" : "lg:pl-72";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar
        isMobile={isMobile}
        desktopCollapsed={desktopCollapsed}
        mobileSidebarOpen={mobileSidebarOpen}
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
          aria-label="Close sidebar overlay"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-[1px]"
        />
      ) : null}

      <main
        className={[
          "min-h-screen pt-16 transition-all duration-300",
          desktopPadding,
        ].join(" ")}
      >
        <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
