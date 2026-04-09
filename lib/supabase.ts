import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

let supabaseClient: ReturnType<typeof createClient<Database>> | null = null;

export const hasSupabaseEnv = Boolean(supabaseUrl && supabaseKey);

export const getSupabase = () => {
  if (!hasSupabaseEnv) {
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient<Database>(supabaseUrl!, supabaseKey!);
  }

  return supabaseClient;
};

export const supabase = getSupabase();
