import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowDown, Copy, ExternalLink } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

const TOKEN_ADDRESS: string = "TBA";

export function TokenHero() {
  const [copied, setCopied] = useState(false);

  const scrollToAirdrop = () => {
    document.getElementById("airdrop")?.scrollIntoView({ behavior: "smooth" });
  };

  const copyAddress = () => {
    if (TOKEN_ADDRESS !== "TBA") {
      navigator.clipboard.writeText(TOKEN_ADDRESS);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px]">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-[conic-gradient(from_0deg,transparent,rgba(120,119,198,0.3),transparent,rgba(0,200,200,0.2),transparent)] rounded-full blur-[100px]"
          />
        </div>
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px]"
        />
        <motion.div
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[120px]"
        />
      </div>

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: '100px 100px'
        }}
      />



      {/* Back Link */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute top-8 left-8 z-20"
      >
        <Link href="/">
          <a className="text-white/40 hover:text-white transition-colors text-sm font-mono">
            ← CORTES
          </a>
        </Link>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto">
        {/* Token Badge */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <span className="inline-block px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl text-xs font-mono tracking-[0.3em] text-white/60">
            МЕМ-ТОКЕН НА SOLANA
          </span>
        </motion.div>

        {/* Giant Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative"
        >
          <span className="block text-[12rem] md:text-[18rem] font-black tracking-tighter leading-[0.8] bg-gradient-to-b from-white via-white to-white/20 bg-clip-text text-transparent">
            $C
          </span>
          <motion.span
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-2xl md:text-3xl font-light tracking-[0.5em] text-white/40"
          >
            ORTES
          </motion.span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="mt-16 text-xl md:text-2xl text-white/50 font-light max-w-xl mx-auto"
        >
          Мем-токен комьюнити. Награды за активность.
        </motion.p>

        {/* Token Address */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-8 inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
        >
          <span className="text-xs text-white/40 font-mono">CA:</span>
          <span className="font-mono text-white/70">
            {TOKEN_ADDRESS === "TBA" ? "Скоро" : `${TOKEN_ADDRESS.slice(0, 8)}...${TOKEN_ADDRESS.slice(-6)}`}
          </span>
          <button
            onClick={copyAddress}
            disabled={TOKEN_ADDRESS === "TBA"}
            className="p-1.5 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-30"
          >
            <Copy className="w-4 h-4 text-white/50" />
          </button>
          {TOKEN_ADDRESS !== "TBA" && (
            <a href={`https://solscan.io/token/${TOKEN_ADDRESS}`} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
              <ExternalLink className="w-4 h-4 text-white/50" />
            </a>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mt-12"
        >
          <Button
            onClick={scrollToAirdrop}
            size="lg"
            className="h-16 px-12 rounded-full bg-white text-black hover:bg-white/90 font-semibold text-lg shadow-[0_0_60px_rgba(255,255,255,0.3)] transition-all hover:scale-105 hover:shadow-[0_0_80px_rgba(255,255,255,0.4)]"
          >
            Claim Airdrop
          </Button>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-20 flex flex-wrap justify-center gap-12 md:gap-20"
        >
          {[
            { value: "1B", label: "Всего токенов" },
            { value: "200M", label: "Пул Airdrop" },
            { value: "70%", label: "Комьюнити" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <p className="text-4xl md:text-5xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-white/30 font-mono tracking-wider mt-2">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="w-6 h-6 text-white/20" />
        </motion.div>
      </motion.div>
    </section>
  );
}
