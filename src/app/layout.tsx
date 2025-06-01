import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Spray Wall Routes",
  description: "Track and manage your spray wall climbing routes",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Analytics />
      <body className={`${inter.className} bg-gray-900 text-gray-100`}>
        <main className="min-h-screen bg-gray-900">
          {children}
        </main>
      </body>
    </html>
  );
}
