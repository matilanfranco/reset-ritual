"use client";

import { useRouter } from "next/navigation";
import { getSupabaseClient } from "@/lib/supabaseClient";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = getSupabaseClient();
    if (!supabase) {
      console.warn("Supabase client not available (SSR or missing env).");
      return;
    }

    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <button
      onClick={handleLogout}
      className="
        rounded-xl bg-[#162033] border border-white/10
        px-4 py-2 text-sm font-semibold text-[#E6EDF7]
        hover:bg-[#1F2937] transition
      "
    >
      Cerrar sesión
    </button>
  );
}