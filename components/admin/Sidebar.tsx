"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  FaHome,
  FaUsers,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: FaHome },
  { href: "/admin/families", label: "Familias", icon: FaUsers },
];

interface SidebarStats {
  totalFamilies: number;
  respondedCount: number;
  confirmedFamilies: number;
}

export default function AdminSidebar({ email }: { email: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [stats, setStats] = useState<SidebarStats | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) =>
        setStats({
          totalFamilies: data.totalFamilies,
          respondedCount: data.respondedCount,
          confirmedFamilies: data.confirmedFamilies,
        })
      )
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const progressPct = stats
    ? Math.round((stats.respondedCount / stats.totalFamilies) * 100)
    : 0;

  const sidebar = (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
      {/* Brand */}
      <div style={{ padding: "1.5rem 1.5rem 1.25rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <h2
          style={{
            fontFamily: "'Great Vibes', cursive",
            fontSize: "1.75rem",
            color: "#D4AF37",
            lineHeight: 1.2,
          }}
        >
          Milena & Miguel
        </h2>
        <p style={{ fontSize: "0.65rem", color: "#6B7280", marginTop: "0.375rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          Panel de Admin
        </p>
      </div>

      {/* RSVP Progress */}
      {stats && (
        <div style={{ padding: "1.25rem 1.5rem", borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.65rem", marginBottom: "0.5rem" }}>
            <span style={{ color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 500 }}>
              RSVP
            </span>
            <span style={{ color: "#9CA3AF" }}>
              {stats.respondedCount}/{stats.totalFamilies}
            </span>
          </div>
          <div style={{ width: "100%", backgroundColor: "#374151", borderRadius: "9999px", height: "6px" }}>
            <div
              style={{
                backgroundColor: "#D4AF37",
                height: "6px",
                borderRadius: "9999px",
                transition: "all 0.7s",
                width: `${progressPct}%`,
              }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem", fontSize: "0.625rem", color: "#6B7280" }}>
            <span>{stats.confirmedFamilies} confirmadas</span>
            <span>{progressPct}%</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav style={{ flex: 1, padding: "1.25rem 1rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
          {navItems.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/admin" && pathname.startsWith(item.href));
            return (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  padding: "0.75rem 1rem",
                  borderRadius: "0.75rem",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  textDecoration: "none",
                  transition: "all 0.15s",
                  backgroundColor: active ? "#4F5D48" : "transparent",
                  color: active ? "#fff" : "#9CA3AF",
                  boxShadow: active ? "0 4px 12px rgba(79,93,72,0.2)" : "none",
                }}
              >
                <item.icon style={{ fontSize: "1rem" }} />
                {item.label}
              </a>
            );
          })}
        </div>
      </nav>

      {/* User / Logout */}
      <div style={{ padding: "1rem 1rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
        <p style={{ fontSize: "0.65rem", color: "#6B7280", paddingLeft: "1rem", marginBottom: "0.5rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {email}
        </p>
        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1rem",
            borderRadius: "0.75rem",
            fontSize: "0.875rem",
            fontWeight: 500,
            color: "#9CA3AF",
            background: "none",
            border: "none",
            cursor: "pointer",
            width: "100%",
            textAlign: "left",
          }}
        >
          <FaSignOutAlt style={{ fontSize: "1rem" }} />
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-gray-900 text-white p-2.5 rounded-xl shadow-lg"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <FaTimes /> : <FaBars />}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        style={{ width: "17rem" }}
        className={`fixed top-0 left-0 h-full bg-gray-900 z-40 transition-transform md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebar}
      </aside>
    </>
  );
}
