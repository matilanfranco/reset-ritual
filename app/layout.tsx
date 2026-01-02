import "./globals.css";
import ClientShell from "@/components/ClientShell";

export const metadata = {
  title: "JawReset",
  description: "Rutina diaria para soltar mandíbula y bruxismo",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-[#0B0F14] text-[#E6EDF7] antialiased">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}