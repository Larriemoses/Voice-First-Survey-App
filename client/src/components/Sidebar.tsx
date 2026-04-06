import { NavLink } from "react-router-dom";

const linkBase = "block rounded-xl px-4 py-3 text-sm font-medium transition";
const inactive = "text-gray-600 hover:bg-gray-100 hover:text-gray-900";
const active = "bg-gray-900 text-white";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r border-gray-200 bg-white p-4">
      <nav className="space-y-2">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          Profile Settings
        </NavLink>

        <NavLink
          to="/onboarding"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          Organization Setup
        </NavLink>
      </nav>
    </aside>
  );
}
