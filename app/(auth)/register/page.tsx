import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { signUp } from "@/auth/actions";

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-ink">Create your account</h1>
        <p className="mt-2 text-sm text-slate/60">
          Start organizing your semester in minutes.
        </p>
      </div>
      <AuthForm
        action={signUp}
        submitLabel="Create account"
        fields={[
          {
            name: "full_name",
            label: "Full name",
            type: "text",
            placeholder: "Alex Johnson"
          },
          {
            name: "university",
            label: "University",
            type: "text",
            placeholder: "University of California"
          },
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
            placeholder: "Create a secure password"
          }
        ]}
        helper="By creating an account, you agree to the Terms and Privacy Policy."
      />
      <p className="text-sm text-slate/60">
        Already have an account?{" "}
        <Link className="font-semibold text-accent" href="/login">
          Log in
        </Link>
      </p>
    </div>
  );
}
