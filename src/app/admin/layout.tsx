"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, LayoutDashboard, Clock, Scissors } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Panel", icon: LayoutDashboard },
  { href: "/admin/randevular", label: "Randevular", icon: CalendarDays },
  { href: "/admin/hizmetler", label: "Hizmetler", icon: Scissors },
  { href: "/admin/calisma-saatleri", label: "Çalışma Saatleri", icon: Clock },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-muted/40">
        <div className="flex h-14 items-center border-b px-4">
          <Link href="/admin" className="flex items-center gap-2 font-semibold">
            <Scissors className="h-5 w-5" />
            <span>Admin Panel</span>
          </Link>
        </div>
        <nav className="space-y-1 p-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                pathname === item.href
                  ? "bg-accent text-accent-foreground font-medium"
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1">
        <header className="flex h-14 items-center justify-between border-b px-6">
          <h1 className="text-lg font-semibold">Mustafa Soylu - Yönetim Paneli</h1>
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Siteye Dön
          </Link>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
