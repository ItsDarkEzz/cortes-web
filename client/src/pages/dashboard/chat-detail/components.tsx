import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Edit2 } from "lucide-react";

export const scrollStyles = "scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20";

export function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={`w-11 h-6 shrink-0 rounded-full transition-colors flex items-center px-0.5 border ${enabled ? "bg-white border-white" : "bg-[#09090b] border-white/20"}`}>
      <div className={`w-4 h-4 rounded-full transition-transform ${enabled ? "bg-black translate-x-5" : "bg-white/40 translate-x-0"}`} />
    </button>
  );
}

export function SettingRow({ icon: Icon, title, desc, enabled, onToggle, color = "text-white" }: {
  icon: React.ElementType; title: string; desc: string; enabled: boolean; onToggle: () => void; color?: string;
}) {
  return (
    <div className="flex items-center justify-between p-5 rounded-[24px] bg-white/[0.02] border border-white/5 hover:border-white/10 hover:bg-white/[0.04] transition-all group gap-4 overflow-hidden w-full">
      <div className="flex items-center gap-4 min-w-0 flex-1">
        <div className={`w-10 h-10 rounded-[14px] bg-[#09090b] border border-white/10 flex items-center justify-center shadow-inner group-hover:border-white/20 transition-all shrink-0 ${color}`}><Icon size={16} /></div>
        <div className="min-w-0 flex-1">
          <p className="font-cortes-display text-lg leading-none tracking-tight text-white mb-1.5 truncate">{title}</p>
          <p className="font-cortes-mono text-[9px] uppercase tracking-[0.1em] text-white/40 leading-relaxed truncate block w-full">{desc}</p>
        </div>
      </div>
      <div className="shrink-0"><Toggle enabled={enabled} onToggle={onToggle} /></div>
    </div>
  );
}

export function TabBtn({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: React.ElementType; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all whitespace-nowrap focus:outline-none shrink-0 relative ${active ? "bg-white text-black font-semibold shadow-[0_0_20px_rgba(255,255,255,0.2)]" : "text-white/40 hover:text-white hover:bg-white/5"}`}
    >
      <Icon size={14} className={`shrink-0 ${active ? "text-black" : "text-white/40"}`} />
      <span className="font-cortes-mono text-[10px] uppercase tracking-[0.2em]">{label}</span>
      {active && (
        <motion.div layoutId="activeTabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-white hidden" />
      )}
    </button>
  );
}

export function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-5 md:p-8 rounded-[32px] bg-[#09090b]/80 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.4)] w-full overflow-hidden ${className}`}>{children}</div>;
}

export function SectionTitle({ icon: Icon, title, color = "text-white" }: { icon: React.ElementType; title: string; color?: string }) {
  return (
    <h3 className="font-cortes-display text-2xl flex items-center gap-3 mb-6 tracking-tight text-white min-w-0 w-full overflow-hidden">
      <Icon size={20} className={`shrink-0 ${color}`} />
      <span className="flex-1 min-w-0 truncate">{title}</span>
    </h3>
  );
}

export function CollapsibleSection({ icon: Icon, title, color = "text-white", enabled, onToggle, children, className = "" }: {
  icon: React.ElementType; title: string; color?: string; enabled: boolean; onToggle: () => void; children?: React.ReactNode; className?: string;
}) {
  return (
    <div className={`rounded-[32px] bg-[#09090b]/80 border border-white/10 overflow-hidden shadow-[0_20px_40px_rgba(0,0,0,0.4)] transition-all w-full ${className} ${enabled ? 'border-white/20 bg-[#0a0a0c]' : ''}`}>
      <div className={`flex items-center justify-between p-5 md:p-8 gap-4 w-full ${enabled && children ? "border-b border-white/10" : ""}`}>
        <h3 className="font-cortes-display text-2xl flex items-center gap-3 tracking-tight text-white min-w-0 flex-1">
          <Icon size={20} className={`shrink-0 ${color}`} />
          <span className="flex-1 min-w-0 truncate">{title}</span>
        </h3>
        <div className="shrink-0"><Toggle enabled={enabled} onToggle={onToggle} /></div>
      </div>
      {enabled && children && (
        <div className="p-5 md:p-8 pt-6 overflow-hidden w-full">
          {children}
        </div>
      )}
    </div>
  );
}

export function CommandCard({ icon: Icon, title, desc, enabled, onToggle, color, message, onMessageChange, vars }: {
  icon: React.ElementType; title: string; desc: string; enabled: boolean; onToggle: () => void; color: string;
  message?: string; onMessageChange?: (v: string) => void; vars?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div layout className={`rounded-[24px] bg-white/[0.02] border transition-all overflow-hidden w-full ${enabled ? 'border-white/20' : 'border-white/5 hover:border-white/10'}`}>
      <div className="flex items-center justify-between p-5 gap-3 w-full">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className={`w-10 h-10 rounded-[14px] bg-[#09090b] flex items-center justify-center shrink-0 border border-white/10 ${color}`}><Icon size={16} /></div>
          <div className="min-w-0 flex-1">
            <p className="font-cortes-display text-lg tracking-tight text-white truncate w-full mb-1">{title}</p>
            <p className="font-cortes-mono text-[9px] uppercase tracking-[0.1em] text-white/40 truncate w-full">{desc}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {enabled && message !== undefined && (
            <button onClick={() => setExpanded(!expanded)} className={`p-2.5 rounded-xl transition-all shrink-0 ${expanded ? 'bg-white/10 text-white shadow-inner' : 'text-white/30 hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10'}`}>
              <Edit2 size={14} />
            </button>
          )}
          <Toggle enabled={enabled} onToggle={onToggle} />
        </div>
      </div>
      {enabled && expanded && message !== undefined && onMessageChange && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-5 pb-5 border-t border-white/10 bg-[#09090b]/50 overflow-hidden">
          <textarea 
            value={message} 
            onChange={(e) => onMessageChange(e.target.value)} 
            className="w-full min-h-[80px] px-4 py-3 mt-5 rounded-2xl bg-black border border-white/10 resize-y font-cortes-mono text-[11px] leading-relaxed text-[#3B82F6] placeholder:text-white/20 focus:outline-none focus:border-[#3B82F6]/50 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] min-w-0 block" 
            placeholder="Кастомное сообщение..." 
          />
          {vars && <div className="mt-3 bg-gradient-to-r from-[#8B5CF6]/10 to-transparent p-3 rounded-xl border border-[#8B5CF6]/20">
            <p className="font-cortes-mono text-[9px] text-[#8B5CF6] break-all leading-relaxed whitespace-pre-wrap">{vars}</p>
          </div>}
        </motion.div>
      )}
    </motion.div>
  );
}
