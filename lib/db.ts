import { createClient } from "@/lib/supabase/server";

export function db() {
  return createClient();
}
