import Link from "next/link";

export function Topbar() {
  return (
    <header className="flex items-center justify-between border-b border-white/5 bg-black/20 px-6 py-5 backdrop-blur">
      <div>
        <p className="text-sm font-medium text-slate/70">Welcome back</p>
        <h1 className="text-xl font-semibold text-ink">Your Study Command Center</h1>
      </div>
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/settings"
          className="rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-slate/80"
        >
          Settings
        </Link>
        <div className="h-10 w-10 rounded-full bg-white/10" />
      </div>
    </header>
  );
}
