import { Logo } from "@/components/Logo";

export default function AuthLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-md">
        <div className="mb-6 flex items-center gap-2">
          <Logo size="sm" />
        </div>
        <div className="surface-card rounded-2xl p-6 shadow-card">{children}</div>
      </div>
    </div>
  );
}
