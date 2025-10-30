import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BettaDayz PBBG - Norfolk Business Empire",
  description: "Build your business empire in Norfolk, VA. Experience life simulation inspired by IMVU, BitLife, and Torn.com with African American and minority culture at its core.",
  keywords: ["PBBG", "Norfolk VA", "business simulation", "HBCU", "African American culture", "life simulation"],
  authors: [{ name: "BettaDayz757" }],
  openGraph: {
    title: "BettaDayz PBBG - Norfolk Business Empire",
    description: "Build your legacy in Norfolk, VA",
    type: "website",
  }
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
