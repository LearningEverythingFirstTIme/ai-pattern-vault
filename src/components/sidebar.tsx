"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: "◈" },
  { href: "/notes", label: "Notes", icon: "◉" },
  { href: "/projects", label: "Projects", icon: "◆" },
  { href: "/areas", label: "Areas", icon: "◇" },
  { href: "/graph", label: "Connections", icon: "◐" },
  { href: "/review", label: "Review", icon: "◑" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-bg-secondary border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent-navy flex items-center justify-center text-white font-display text-xl">
            P
          </div>
          <div>
            <p className="font-display text-lg text-text-primary leading-tight">Pattern</p>
            <p className="font-display text-lg text-text-primary leading-tight">Vault</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                  pathname === item.href
                    ? "bg-accent-navy text-white"
                    : "text-text-secondary hover:bg-bg-tertiary hover:text-text-primary"
                )}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-border">
        <div className="card p-4">
          <p className="text-xs text-text-muted uppercase tracking-wide mb-2">Quick Tip</p>
          <p className="text-sm text-text-secondary">
            Press <kbd className="px-1.5 py-0.5 bg-bg-tertiary rounded text-xs">Cmd+K</kbd> to capture anywhere
          </p>
        </div>
      </div>
    </aside>
  );
}
