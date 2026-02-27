"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

export type AuthField = {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
};

type AuthFormProps = {
  action: (
    state: { error?: string },
    formData: FormData
  ) => Promise<{ error?: string } | void>;
  fields: AuthField[];
  submitLabel: string;
  helper?: string;
};

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Working..." : label}
    </Button>
  );
}

export function AuthForm({ action, fields, submitLabel, helper }: AuthFormProps) {
  const [state, formAction] = useFormState(action, {});

  return (
    <form className="space-y-4" action={formAction}>
      {fields.map((field) => (
        <Input
          key={field.name}
          name={field.name}
          type={field.type}
          label={field.label}
          placeholder={field.placeholder}
          required
        />
      ))}
      {helper ? <p className="text-xs text-slate/60">{helper}</p> : null}
      {state?.error ? (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
          {state.error}
        </p>
      ) : null}
      <SubmitButton label={submitLabel} />
    </form>
  );
}
