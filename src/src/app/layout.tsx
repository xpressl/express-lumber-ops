import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Express Lumber Ops",
  description: "Operational control layer for wholesale building materials distribution",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-background text-foreground antialiased">{children}</body>
    </html>
  );
}
