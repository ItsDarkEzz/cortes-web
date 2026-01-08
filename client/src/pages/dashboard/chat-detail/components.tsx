/**
 * Общие компоненты для ChatDetail
 */
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

// Стили для скроллбара
export const scrollStyles = "scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20";

export function Toggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle} className={`w-11 h-6 rounded-full transition-colors flex items-center px-0.5 ${enabled ? "bg-primary" : "bg-white/20"}`}>
      <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-transform ${enabled ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

export function SettingRow({ icon: Icon, title, desc, enabled, onToggle, color = "text-primary" }: {
  icon: React.ElementType; title: string; desc: string; enabled: boolean; onToggle: () => void; color?: string;
}) {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 hover:bg-white/[0.07] transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${color}`}><Icon size={18} /></div>
        <div><p className="font-medium">{title}</p><p className="text-sm text-muted-foreground">{desc}</p></div>
      </div>
      <Toggle enabled={enabled} onToggle={onToggle} />
    </div>
  );
}

export function TabBtn({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: React.ElementType; label: string }) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${active ? "bg-primary text-white" : "text-muted-foreground hover:text-white hover:bg-white/5"}`}>
      <Icon size={16} />{label}
    </button>
  );
}

export function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-5 rounded-2xl bg-white/5 border border-white/10 ${className}`}>{children}</div>;
}

export function SectionTitle({ icon: Icon, title, color = "text-primary" }: { icon: React.ElementType; title: string; color?: string }) {
  return <h3 className="text-lg font-semibold flex items-center gap-2 mb-4"><Icon size={18} className={color} />{title}</h3>;
}

export function CollapsibleSection({ icon: Icon, title, color = "text-primary", enabled, onToggle, children, className = "" }: {
  icon: React.ElementType; title: string; color?: string; enabled: boolean; onToggle: () => void; children?: React.ReactNode; className?: string;
}) {
  return (
    <div className={`rounded-2xl bg-white/5 border border-white/10 overflow-hidden ${className}`}>
      <div className={`flex items-center justify-between p-4 ${enabled && children ? "border-b border-white/5" : ""}`}>
        <h3 className="font-semibold flex items-center gap-2"><Icon size={18} className={color} />{title}</h3>
        <Toggle enabled={enabled} onToggle={onToggle} />
      </div>
      {enabled && children && (
        <div className="p-4 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import { Edit2 } from "lucide-react";

export function CommandCard({ icon: Icon, title, desc, enabled, onToggle, color, message, onMessageChange, vars }: {
  icon: React.ElementType; title: string; desc: string; enabled: boolean; onToggle: () => void; color: string;
  message?: string; onMessageChange?: (v: string) => void; vars?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div layout className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
      <div className="flex items-center justify-between p-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center shrink-0 ${color}`}><Icon size={16} /></div>
          <div className="min-w-0"><p className="font-medium text-sm truncate">{title}</p><p className="text-xs text-muted-foreground truncate">{desc}</p></div>
        </div>
        <div className="flex items-center gap-2">
          {enabled && message !== undefined && (
            <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-white">
              <Edit2 size={14} />
            </button>
          )}
          <Toggle enabled={enabled} onToggle={onToggle} />
        </div>
      </div>
      {enabled && expanded && message !== undefined && onMessageChange && (
        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-3 pb-3 border-t border-white/5">
          <textarea value={message} onChange={(e) => onMessageChange(e.target.value)} className="w-full min-h-[50px] px-3 py-2 mt-3 rounded-lg bg-white/5 border border-white/10 resize-y font-mono text-xs" placeholder="Кастомное сообщение..." />
          {vars && <p className="text-xs text-muted-foreground mt-1">{vars}</p>}
        </motion.div>
      )}
    </motion.div>
  );
}
