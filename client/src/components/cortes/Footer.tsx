import { Link } from "wouter";

export function Footer() {
  return (
      <footer className="py-20 border-t border-white/10 bg-black relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-primary/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center relative z-10">
          <Link href="/">
            <a className="text-5xl md:text-8xl font-bold tracking-tighter mb-10 text-transparent bg-clip-text bg-gradient-to-b from-white to-white/30 cursor-pointer hover:text-gradient-primary transition-all block">
              CORTES
            </a>
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-center mb-12">
            <Link href="/about">
              <a className="text-muted-foreground hover:text-white transition-colors">О проекте</a>
            </Link>
            <Link href="/documentation">
              <a className="text-muted-foreground hover:text-white transition-colors">Документация</a>
            </Link>
            <Link href="/support">
              <a className="text-muted-foreground hover:text-white transition-colors">Поддержка</a>
            </Link>
          </div>

          <p className="text-sm text-muted-foreground/50 font-mono">
            © 2025 CORTES AI.
          </p>
        </div>
      </footer>
  );
}
