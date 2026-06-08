import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { AuthInitializer } from "@/components/layout/AuthInitializer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StockVista | Professional Fintech Platform",
  description: "Track live stock prices, manage your portfolio, and analyze the market with premium charting and real-time updates.",
  keywords: ["fintech", "stock market", "trading", "portfolio", "watchlist", "candlestick charts", "NSE", "BSE"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark h-full antialiased ${inter.variable} ${manrope.variable}`}>
      <body className="min-h-full flex flex-col bg-[var(--color-background)] text-[var(--color-text-primary)] font-sans">
        <AuthInitializer />
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
