/**
 * Вкладка "Тариф" - управление подпиской
 */
import { Button } from "@/components/ui/button";
import { Crown, Users, Zap, History, CreditCard, FileText, Check } from "lucide-react";
import { Section } from "./components";
import { mockPlan, plans } from "./constants";

export function PlanTab() {
  return (
    <div className="grid lg:grid-cols-3 gap-5">
      {/* Current Plan Card */}
      <Section className="lg:col-span-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Crown size={28} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-bold">{mockPlan.name}</h3>
                <span className="px-2 py-0.5 rounded-lg bg-green-400/10 text-green-400 text-xs font-medium">Активен</span>
              </div>
              <p className="text-muted-foreground">до {mockPlan.expiresAt} • осталось {mockPlan.daysLeft} дней</p>
            </div>
          </div>
          <Button variant="outline" className="border-white/10">
            <History size={16} className="mr-2" />История платежей
          </Button>
        </div>
      </Section>

      {/* Plan Cards */}
      {plans.map((plan) => {
        const isCurrent = plan.id === mockPlan.current;
        const isUpgrade = plan.id === "business" || (plan.id === "pro" && mockPlan.current === "free");
        
        return (
          <Section 
            key={plan.id} 
            className={`relative ${isCurrent ? "ring-2 ring-primary/50" : ""} ${plan.popular ? "lg:-mt-2 lg:mb-2" : ""}`}
          >
            {plan.popular && (
              <div className="absolute -top-3 right-4 px-3 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold">
                Рекомендуем
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                plan.id === "free" ? "bg-white/10 text-muted-foreground" :
                plan.id === "pro" ? "bg-primary/10 text-primary" :
                "bg-yellow-400/10 text-yellow-400"
              }`}>
                {plan.id === "free" ? <Users size={18} /> : plan.id === "pro" ? <Zap size={18} /> : <Crown size={18} />}
              </div>
              <div>
                <h4 className="font-semibold">{plan.name}</h4>
                <p className={`text-lg font-bold ${plan.color}`}>
                  {plan.price === "0" ? "Бесплатно" : `${plan.price}₽`}
                  <span className="text-sm font-normal text-muted-foreground">{plan.period}</span>
                </p>
              </div>
            </div>

            <div className="space-y-2 mb-5">
              {plan.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <Check size={14} className="text-green-400 shrink-0" />
                  <span className="text-muted-foreground">{f}</span>
                </div>
              ))}
            </div>

            {isCurrent ? (
              <div className="text-center py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium">
                Текущий тариф
              </div>
            ) : isUpgrade ? (
              <Button className="w-full">
                Улучшить до {plan.name}
              </Button>
            ) : (
              <Button variant="outline" className="w-full border-white/10">
                Понизить
              </Button>
            )}
          </Section>
        );
      })}

      {/* Quick Actions */}
      <Section className="lg:col-span-3">
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="border-white/10">
            <CreditCard size={16} className="mr-2" />Привязать карту
          </Button>
          <Button variant="outline" className="border-white/10">
            <FileText size={16} className="mr-2" />Скачать счёт
          </Button>
          <Button variant="ghost" className="text-red-400 hover:text-red-300 hover:bg-red-400/10 ml-auto">
            Отменить подписку
          </Button>
        </div>
      </Section>
    </div>
  );
}
