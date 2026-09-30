import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Vayumandal — Extreme Weather Intelligence",
  description: "Explore spatio-temporal anomaly tracking and local impact scenarios for SIH 2026, PS 26078.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
