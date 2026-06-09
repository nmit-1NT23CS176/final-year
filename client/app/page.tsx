"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, BrainCircuit, Wallet, Activity, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";

const FEATURES = [
  { icon: ShieldCheck, title: "Secure Investing", description: "Bank-grade security with advanced encryption protocols to protect your assets." },
  { icon: BrainCircuit, title: "Smart Analytics", description: "AI-powered market insights and portfolio rebalancing recommendations." },
  { icon: Wallet, title: "Low Brokerage", description: "Competitive, transparent pricing with zero hidden fees for all trades." },
  { icon: Activity, title: "Real-Time Data", description: "Live market tracking with sub-millisecond latency and advanced charting." },
];

export default function Home() {
  return (
    <>
      <div className="flex-1 flex flex-col w-full max-w-[1440px] mx-auto overflow-hidden">
        {/* ===== HERO SECTION ===== */}
        <section className="relative pt-32 pb-40 px-6 flex flex-col items-center justify-center text-center min-h-[85vh]">
          {/* Background Glows */}
          <div className="absolute top-[-10%] left-[50%] -translate-x-1/2 w-[50%] h-[50%] bg-[var(--color-bullish)] rounded-full blur-[180px] opacity-10 pointer-events-none" />

          {/* Main Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full max-w-4xl z-10 flex flex-col items-center"
          >
            {/* Trust Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-8 inline-flex items-center justify-center gap-3 px-2 py-1.5 pr-5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-md shadow-[0_0_20px_rgba(0,230,118,0.05)]"
            >
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className={`w-7 h-7 rounded-full border-2 border-[var(--color-background)] bg-[var(--color-elevated)] flex items-center justify-center text-[10px] font-bold z-${30 - i * 10} text-[var(--color-text-secondary)] overflow-hidden`}>
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${i}&backgroundColor=121418`} alt="user" className="w-full h-full opacity-80" />
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 text-[13px] font-medium text-[var(--color-text-secondary)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-bullish)] animate-pulse shadow-[0_0_10px_rgba(0,230,118,0.8)]" />
                Trusted by 1M+ Investors
              </div>
            </motion.div>

            {/* Headline */}
            <h1 className="text-5xl sm:text-6xl lg:text-[80px] leading-[1.05] font-extrabold tracking-tight mb-8 text-[var(--color-text-primary)]">
              Invest Smarter. <br className="hidden sm:block" />
              <span className="relative inline-block mt-2">
                <span className="absolute -inset-1 blur-2xl bg-[var(--color-bullish)] opacity-20 rounded-lg pointer-events-none"></span>
                <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-bullish)] via-[#00F58A] to-[#00A859]">
                  Build Wealth Confidently.
                </span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-12 max-w-2xl leading-relaxed font-light mx-auto">
              Track markets, manage portfolios, and make informed investment decisions with institutional-grade insights and unparalleled security.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 w-full">
              <Link href="/auth/register" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto h-14 px-10 text-base shadow-green-glow rounded-2xl group">
                  Start Investing
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/dashboard" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-14 px-10 text-base rounded-2xl bg-[var(--color-surface)]/50 backdrop-blur-sm border-[var(--color-border)] hover:bg-[var(--color-elevated)] transition-all">
                  View Markets
                </Button>
              </Link>
            </div>

            {/* Trust Stats */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-6 border-t border-[var(--color-border)] w-full max-w-3xl">
              <div className="flex flex-col items-center gap-1 px-8 py-2">
                <p className="text-3xl font-bold text-[var(--color-text-primary)] tabular-nums tracking-tight">₹10K Cr+</p>
                <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-widest mt-0.5 font-semibold">Assets Managed</p>
              </div>
              <div className="hidden sm:block w-px h-12 bg-[var(--color-border)]" />
              <div className="flex flex-col items-center gap-1 px-8 py-2">
                <div className="flex items-center gap-1.5 text-3xl font-bold text-[var(--color-text-primary)] tracking-tight">
                  4.8 <Star className="w-5 h-5 fill-[var(--color-warning)] text-[var(--color-warning)]" />
                </div>
                <p className="text-xs text-[var(--color-text-secondary)] uppercase tracking-widest mt-0.5 font-semibold">App Store Rating</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* ===== WHY CHOOSE US SECTION ===== */}
        <section className="py-24 px-6 lg:px-12 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl lg:text-5xl font-bold mb-6 text-[var(--color-text-primary)] tracking-tight"
            >
              Why Choose StockVista?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-[var(--color-text-secondary)] text-lg"
            >
              Benefits designed to provide a seamless, secure, and accessible experience for all users, from beginners to pros.
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {FEATURES.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 + 0.2, duration: 0.5 }}
                  className="p-8 rounded-[24px] border border-[var(--color-border)] bg-[var(--color-surface)] hover:bg-[var(--color-elevated)] hover:-translate-y-2 hover:shadow-green-glow transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-[var(--color-elevated)] border border-[var(--color-border)] flex items-center justify-center mb-6 group-hover:bg-[var(--color-bullish-muted)] group-hover:border-[var(--color-bullish)]/30 transition-colors">
                    <Icon className="w-7 h-7 text-[var(--color-text-primary)] group-hover:text-[var(--color-bullish)] transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-[var(--color-text-primary)]">{feature.title}</h3>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ===== SOCIAL PROOF / TRUST ===== */}
        <section className="py-24 px-6 lg:px-12 border-t border-[var(--color-border)]">
          <div className="max-w-4xl mx-auto text-center">
            <h3 className="text-sm uppercase tracking-widest text-[var(--color-text-secondary)] mb-8 font-semibold">
              Trusted by leading financial institutions
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              {/* Dummy partner logos using text for now */}
              <div className="text-2xl font-bold tracking-tighter">NEXUS</div>
              <div className="text-2xl font-bold font-serif italic">Vanguard</div>
              <div className="text-2xl font-bold tracking-widest">QUANTUM</div>
              <div className="text-2xl font-black">VERTEX</div>
            </div>
          </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section className="py-32 px-6 lg:px-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-bullish-muted)]/20 pointer-events-none" />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto rounded-[32px] border border-[var(--color-border)] bg-[var(--color-elevated)] p-12 lg:p-20 text-center relative overflow-hidden"
          >
            {/* Glowing orb behind CTA */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[var(--color-bullish)] rounded-full blur-[120px] opacity-20 pointer-events-none" />
            
            <h2 className="text-4xl lg:text-5xl font-bold mb-6 text-[var(--color-text-primary)] relative z-10">
              Ready to take control?
            </h2>
            <p className="text-[var(--color-text-secondary)] text-lg mb-10 max-w-xl mx-auto relative z-10">
              Join the new standard of investing. Open your account in under 3 minutes and start building wealth.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 relative z-10">
              <Link href="/auth/register">
                <Button variant="primary" size="lg" className="h-14 px-10 text-base shadow-green-glow w-full sm:w-auto">
                  Create Account Free
                </Button>
              </Link>
            </div>
            
            <div className="mt-8 flex justify-center items-center gap-6 text-xs text-[var(--color-text-secondary)] relative z-10">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-[var(--color-bullish)]" /> No hidden fees</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-[var(--color-bullish)]" /> 24/7 Support</span>
            </div>
          </motion.div>
        </section>
      </div>
      <Footer />
    </>
  );
}
