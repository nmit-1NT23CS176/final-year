import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { AuthInitializer } from "@/components/layout/AuthInitializer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StockVista | Real-Time Stock Tracking",
  description: "Track live stock prices, manage your portfolio, and analyze the market with professional charting and real-time updates.",
  keywords: ["fintech", "stock market", "trading", "portfolio", "watchlist", "candlestick charts", "NSE", "BSE"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-[var(--color-background)] text-[var(--color-text-primary)] font-sans antialiased">
        <AuthInitializer />
        <Navbar />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}
