"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, LayoutDashboard, Users, LogOut } from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F8F6F2" }}>
      {/* Sidebar */}
      <aside
        className="flex w-56 flex-col border-r"
        style={{ backgroundColor: "#1A1A1A", borderColor: "#2A2A2A" }}
      >
        <div className="flex items-center gap-2.5 border-b px-5 py-5" style={{ borderColor: "#2A2A2A" }}>
          <Building2 className="h-5 w-5" style={{ color: "#C4A87C" }} />
          <div>
            <p className="text-sm font-bold text-white">Ractysh</p>
            <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "#8B6B4A" }}>
              Admin Panel
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-0.5 px-3 py-4">
          {navItems.map((item) => {
            const active = item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  active
                    ? "text-white"
                    : "text-neutral-400 hover:text-white hover:bg-white/5"
                }`}
                style={active ? { backgroundColor: "rgba(196,168,124,0.15)", color: "#C4A87C" } : undefined}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t px-3 py-4" style={{ borderColor: "#2A2A2A" }}>
          <Link
            href="/"
            className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium text-neutral-400 transition-all hover:text-white hover:bg-white/5"
          >
            <LogOut className="h-4 w-4" />
            Back to Site
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-8 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
