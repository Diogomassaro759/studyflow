"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* ======================= */

const menu = [
  // PERFIL PRIMEIRO
  { name: "Perfil", path: "/profile", icon: "" },

  { name: "Dashboard", path: "/dashboard", icon: "" },
  { name: "Cronômetro", path: "/cronometro", icon: "" },
  { name: "Planejamento", path: "/planning", icon: "" },
  { name: "Metas", path: "/goals", icon: "" },
  { name: "Biblioteca", path: "/library", icon: "" },
];

/* ======================= */

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-header">
        <h1>StudyFlow</h1>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">
        {menu.map((item) => {
          const active = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`sidebar-item ${active ? "active" : ""}`}
            >
              <span style={{ marginRight: "8px" }}>
                {item.icon}
              </span>

              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <p>© StudyFlow</p>
      </div>
    </aside>
  );
}
