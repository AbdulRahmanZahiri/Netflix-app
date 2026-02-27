import Link from "next/link";
import { Logo } from "@/components/Logo";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/courses", label: "Courses" },
  { href: "/dashboard/assignments", label: "Assignments" },
  { href: "/dashboard/planner", label: "Study Planner" },
  { href: "/dashboard/flashcards", label: "Flashcards" },
  { href: "/dashboard/settings", label: "Settings" }
];

export function Sidebar() {
  return (
    <aside className="hidden h-full w-72 flex-col border-r border-white/5 bg-black/30 p-6 backdrop-blur lg:flex">
      <div className="flex items-center gap-3">
        <Logo size="sm" />
      </div>
      <nav className="mt-8 flex flex-1 flex-col gap-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl px-3 py-2 text-sm font-medium text-slate/80 transition hover:bg-white/5 hover:text-ink"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <div className="rounded-xl border border-white/10 bg-white/5 p-4">
        <p className="text-xs font-medium text-slate/70">Plan</p>
        <p className="mt-1 text-sm font-semibold text-ink">Free</p>
        <p className="mt-1 text-xs text-slate/70">Upgrade for unlimited AI credits.</p>
        <Link
          href="/dashboard/settings"
          className="mt-3 inline-flex text-xs font-semibold text-cyan"
        >
          Manage subscription
        </Link>
      </div>
    </aside>
  );
}
