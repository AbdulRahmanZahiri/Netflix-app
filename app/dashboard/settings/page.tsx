import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/Button";
import { flags } from "@/lib/flags";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Settings"
        subtitle="Manage your account and subscription."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="surface-card rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-ink">Subscription</h3>
          {flags.billingEnabled ? (
            <>
              <p className="mt-2 text-sm text-slate/70">
                You are currently on the Free plan.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <form action="/api/stripe/checkout" method="POST">
                  <Button type="submit">Upgrade to Pro</Button>
                </form>
                <form action="/api/stripe/portal" method="POST">
                  <Button type="submit" variant="secondary">
                    Manage billing
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm text-slate/70">
              Billing is disabled for development testing.
            </p>
          )}
        </div>

        <div className="surface-card rounded-2xl p-6 shadow-soft">
          <h3 className="text-lg font-semibold text-ink">Profile</h3>
          <div className="mt-4 space-y-3 text-sm text-slate/80">
            <p>Name: Alex Johnson</p>
            <p>University: University of California</p>
            <p>Email: alex@university.edu</p>
          </div>
        </div>
      </div>
    </div>
  );
}
