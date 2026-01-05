import "./globals.css";
import ClientShell from "@/components/ClientShell";

export const metadata = {
  title: "Reset Ritual",
  icons: {
    icon: "/icons/rr-32.png",
    apple: "/icons/rr-180.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />

        <meta name="mobile-web-app-capable" content="yes" />

        {/* iOS PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Reset Ritual" />
      </head>

      <body className="bg-[#0B0F14] text-[#E6EDF7] antialiased">
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}