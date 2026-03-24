import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "The List — Companies Worth Watching",
  description:
    "A curated, opinionated list of companies building the future. Ranked, rated, and worth your attention.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${geist.variable} antialiased`}>
        <body className="min-h-screen bg-zinc-50 font-sans">{children}</body>
      </html>
    </ClerkProvider>
  );
}
