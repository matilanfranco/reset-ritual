"use client";

import Header from "@/components/Header";

export default function ClientShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* <Header /> */}
      {children}
    </>
  );
}