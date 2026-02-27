"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { flags } from "@/lib/flags";

export async function signUp(
  _prevState: { error?: string },
  formData: FormData
) {
  if (flags.devLocalDb || flags.devBypassAuth) {
    redirect("/dashboard");
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const fullName = String(formData.get("full_name") || "").trim();
  const university = String(formData.get("university") || "").trim();

  const supabase = createClient();
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        university
      }
    }
  });

  if (error) {
    return { error: error.message };
  }

  if (data.user) {
    await supabase.from("profiles").insert({
      id: data.user.id,
      full_name: fullName,
      university
    });
  }

  redirect("/dashboard");
}

export async function signIn(
  _prevState: { error?: string },
  formData: FormData
) {
  if (flags.devLocalDb || flags.devBypassAuth) {
    redirect("/dashboard");
  }

  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  const supabase = createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message };
  }

  redirect("/dashboard");
}

export async function signOut() {
  if (flags.devLocalDb || flags.devBypassAuth) {
    redirect("/");
  }

  const supabase = createClient();
  await supabase.auth.signOut();
  redirect("/");
}
