import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

declare global {
  // eslint-disable-next-line no-var
  var __supabase__: SupabaseClient | undefined;
}

export function getSupabaseClient(): SupabaseClient | null {
  // ✅ Nunca crear cliente en SSR / build
  if (typeof window === "undefined") return null;

  // ✅ Evita crashear si faltan envs
  if (!url || !key) return null;

  // ✅ Singleton (evita warning de múltiples instancias)
  if (!globalThis.__supabase__) {
    globalThis.__supabase__ = createClient(url, key);
  }
  return globalThis.__supabase__;
}