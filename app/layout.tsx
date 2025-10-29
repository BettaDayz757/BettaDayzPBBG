import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BettaDayz PBBG - Persistent Browser-Based Game",
  description: "BettaDayz Persistent Browser-Based Game with dual domain support for bettadayz.shop and bettadayz.store",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
