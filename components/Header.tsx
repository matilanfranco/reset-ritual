"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabaseClient } from "@/lib/supabaseClient";
import LogoutButton from "@/components/LogoutButton";

function NavItem({
  href,
  label,
  onClick,
}: {
  href: string;
  label: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      onClick={onClick}
      className={[
        "block w-full rounded-xl px-4 py-3 text-sm font-semibold border transition",
        active
          ? "bg-[#162033] border-white/15 text-[#E6EDF7]"
          : "bg-transparent border-white/10 text-[#9AA7B8] hover:text-[#E6EDF7] hover:bg-[#162033]/50",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    supabase.auth.getUser().then(({ data }) => {
      setEmail(data.user?.email ?? null);
    });

    // opcional: si cambia la sesión, refrescar email
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      sub?.subscription?.unsubscribe();
    };
  }, []);

  function closeMenu() {
    setOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 bg-[#0B0F14]/80 backdrop-blur border-b border-white/5">
      <div className="mx-auto max-w-md px-5 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" onClick={closeMenu} className="flex items-center gap-2">
          <img
            src="/icons/rr-logo.png"
            alt="Reset Ritual"
            className="h-10 w-10"
          />
          <span className="font-semibold tracking-tight">Reset Ritual</span>
        </Link>

        {/* Burger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-xl border border-white/10 px-3 py-2 text-sm font-semibold"
          aria-label="Abrir menú"
        >
          ☰
        </button>
      </div>

      {/* Menu desplegable */}
      <div
        className={[
          "overflow-hidden transition-all duration-300",
          open ? "max-h105 opacity-100" : "max-h-0 opacity-0",
        ].join(" ")}
      >
        <nav className="mx-auto max-w-md px-5 pb-5 space-y-2">
          {/* User */}
          {email && (
            <div className="mt-3 mb-3 rounded-xl border border-white/10 px-4 py-2 text-xs text-[#9AA7B8]">
              <strong>{email}</strong>
            </div>
          )}

          <NavItem href="/" label="Tu día" onClick={closeMenu} />
          <NavItem href="/history" label="Historial" onClick={closeMenu} />
          <NavItem href="/info" label="Info" onClick={closeMenu} />

          {/* Logout */}
          <div
            onClick={() => {
              closeMenu();
            }}
          >
            <LogoutButton />
          </div>
        </nav>
      </div>
    </header>
  );
}