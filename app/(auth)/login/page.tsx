import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { signIn } from "@/auth/actions";

export default function LoginPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Welcome back</h1>
        <p className="mt-2 text-sm text-slate/60">
          Log in to keep your semester on track.
        </p>
      </div>
      <AuthForm
        action={signIn}
        submitLabel="Log in"
        fields={[
          {
            name: "email",
            label: "Email",
            type: "email",
            placeholder: "you@university.edu"
          },
          {
            name: "password",
            label: "Password",
            type: "password",
            placeholder: "********"
          }
        ]}
      />
      <p className="text-sm text-slate/60">
        New to ScholarFlow?{" "}
        <Link className="font-semibold text-accent" href="/register">
          Create an account
        </Link>
      </p>
    </div>
  );
}
