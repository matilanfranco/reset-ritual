"use client";

import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Mode = "login" | "signup";

export default function LoginPage() {
  const [mode, setMode] = useState<Mode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    // 1) Chequear sesión actual
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/");
    });

    // 2) Escuchar cambios de auth (login/logout)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) router.replace("/");
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [router]);

  async function handleSubmit() {
    const supabase = getSupabaseClient();
    if (!supabase) {
      setError("Supabase no disponible (env faltante o contexto inválido).");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    if (!email || password.length < 6) {
      setError("Email válido y contraseña (mín. 6 caracteres).");
      setLoading(false);
      return;
    }

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });

      if (error) setError(error.message);
      else setMessage("Cuenta creada. Ya podés entrar 👌");
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0F14] text-[#E6EDF7]">
      <div className="w-full max-w-sm rounded-2xl bg-[#111827] p-6 border border-white/10 space-y-4">
        <div className="flex justify-center">
          <img src="/icons/rr-logo.png" alt="Reset Ritual" className="w-24 h-24" />
        </div>

        {/* Toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-xl text-sm transition ${
              mode === "login"
                ? "bg-[#162033] text-white"
                : "bg-[#0B0F14] text-[#9AA7B8] border border-[#1F2937]"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-2 rounded-xl text-sm transition ${
              mode === "signup"
                ? "bg-[#162033] text-white"
                : "bg-[#0B0F14] text-[#9AA7B8] border border-[#1F2937]"
            }`}
          >
            Registrarse
          </button>
        </div>

        <input
          type="email"
          placeholder="Email"
          className="w-full rounded-xl bg-[#0B0F14] border border-[#1F2937] px-4 py-3 text-sm focus:outline-none focus:border-[#3B82F6]"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Contraseña (mín. 6)"
          className="w-full rounded-xl bg-[#0B0F14] border border-[#1F2937] px-4 py-3 text-sm focus:outline-none focus:border-[#3B82F6]"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-sm text-red-400">{error}</p>}
        {message && <p className="text-sm text-emerald-400">{message}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full rounded-xl bg-[#3B82F6] py-3 text-sm font-semibold hover:bg-[#2563EB] transition disabled:opacity-50"
        >
          {loading ? "Procesando..." : mode === "login" ? "Entrar" : "Crear cuenta"}
        </button>

        <p className="text-xs text-center text-[#9AA7B8]">
          {mode === "login" ? "Entrá con tu cuenta" : "Creá una cuenta nueva"}
        </p>
      </div>
    </div>
  );
}