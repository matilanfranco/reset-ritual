import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ✅ Evita que explote en build/SSR
export const supabase =
  typeof window === "undefined"
    ? null
    : createClient(supabaseUrl, supabaseAnonKey);