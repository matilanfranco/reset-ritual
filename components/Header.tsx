"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

function NavItem({ href, label }: { href: string; label: string }) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={[
        "px-3 py-2 rounded-xl text-sm font-semibold border",
        active
          ? "bg-[#162033] border-white/15 text-[#E6EDF7]"
          : "bg-transparent border-white/10 text-[#9AA7B8] hover:text-[#E6EDF7]",
      ].join(" ")}
    >
      {label}
    </Link>
  );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-[#0B0F14]/80 backdrop-blur border-b border-white/5">
      <div className="mx-auto max-w-md px-5 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
            <img
                src="/icons/rr-logo.png"
                alt="Reset Ritual"
                className="h-10 w-10"
            />
            <span className="font-semibold tracking-tight">
                Reset Ritual
            </span>
            </Link>

        <nav className="flex items-center gap-2">
          <NavItem href="/" label="Tu día" />
          <NavItem href="/history" label="Historial" />
          <NavItem href="/info" label="Info" />
        </nav>
      </div>
    </header>
  );
}