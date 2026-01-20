/**
 * Owner LLM Settings - Управление fallback цепочками
 */
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, ArrowLeft, Bot, GripVertical, 
  Play, Trash2, Plus, Save, RotateCcw,
  Zap, Eye, CheckCircle, AlertCircle
} from "lucide-react";
import { useLLMPriority, useUpdateLLMPriority } from "@/hooks/use-owner";
import { ownerApi, type LLMModelEntry } from "@/lib/api/owner";
import { useToast } from "@/hooks/use-toast";
import { Reorder, useDragControls } from "framer-motion";
import { cn } from "@/lib/utils";

type ChainKey = "response" | "observer" | "background";

// Локальный тип с ID для drag-n-drop
interface ChainItem extends LLMModelEntry {
  id: string;
}

function generateId() {
  return Math.random().toString(36).substring(2, 9);
}

// Отдельный компонент для элемента списка, чтобы использовать хук useDragControls
function ChainListItem({
  item,
  onUpdate,
  onRemove,
  onTest,
  testingState
}: {
  item: ChainItem;
  onUpdate: (updates: Partial<ChainItem>) => void;
  onRemove: () => void;
  onTest: (withTools: boolean) => void;
  testingState: { id: string; withTools: boolean } | null;
}) {
  const dragControls = useDragControls();

  return (
    <Reorder.Item
      value={item}
      dragListener={false}
      dragControls={dragControls}
      className="bg-card border border-border/50 rounded-lg p-3 select-none"
    >
      <div className="flex items-center gap-3">
        <div 
          className="cursor-grab active:cursor-grabbing p-1 -ml-1 hover:bg-muted/50 rounded transition-colors"
          onPointerDown={(e) => dragControls.start(e)}
        >
          <GripVertical className="w-5 h-5 text-muted-foreground/50" />
        </div>
        
        <Switch 
          checked={item.enabled} 
          onCheckedChange={(v) => onUpdate({ enabled: v })} 
        />
        
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
          <Input
            value={item.provider}
            onChange={(e) => onUpdate({ provider: e.target.value })}
            placeholder="Provider (e.g. openai)"
            className="h-9 bg-background/50"
          />
          <Input
            value={item.model}
            onChange={(e) => onUpdate({ model: e.target.value })}
            placeholder="Model (e.g. gpt-4)"
            className="h-9 bg-background/50"
          />
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => onTest(false)}
            disabled={!!testingState}
            title="Проверить (Simple)"
          >
            {testingState?.id === item.id && !testingState.withTools ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            onClick={() => onTest(true)}
            disabled={!!testingState}
            title="Проверить (Tools)"
          >
            {testingState?.id === item.id && testingState.withTools ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={onRemove}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Reorder.Item>
  );
}

function ChainList({
  items,
  onChange,
}: {
  items: ChainItem[];
  onChange: (items: ChainItem[]) => void;
}) {
  const { toast } = useToast();
  const [testing, setTesting] = useState<{ id: string; withTools: boolean } | null>(null);

  const updateItem = (id: string, updates: Partial<ChainItem>) => {
    onChange(items.map(item => item.id === id ? { ...item, ...updates } : item));
  };

  const removeItem = (id: string) => {
    onChange(items.filter(item => item.id !== id));
  };

  const testModel = async (item: ChainItem, withTools: boolean) => {
    if (!item.provider || !item.model) {
      toast({ title: "Ошибка", description: "Укажите provider и model", variant: "destructive" });
      return;
    }
    setTesting({ id: item.id, withTools });
    try {
      const res = await ownerApi.llmTest({ provider: item.provider, model: item.model, with_tools: withTools });
      if (res.success) {
        toast({ 
          title: "Успешно", 
          description: (
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span>Совместимо, {res.latency_ms}ms</span>
            </div>
          ) 
        });
      } else {
        toast({ 
          title: "Ошибка", 
          description: (
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400" />
              <span>{res.error || "Неизвестная ошибка"}</span>
            </div>
          ),
          variant: "destructive" 
        });
      }
    } catch (e) {
      toast({ title: "Ошибка", description: "Ошибка при проверке", variant: "destructive" });
    } finally {
      setTesting(null);
    }
  };

  return (
    <div className="space-y-4">
      <Reorder.Group axis="y" values={items} onReorder={onChange} className="space-y-2">
        {items.map((item) => (
          <ChainListItem
            key={item.id}
            item={item}
            onUpdate={(updates) => updateItem(item.id, updates)}
            onRemove={() => removeItem(item.id)}
            onTest={(withTools) => testModel(item, withTools)}
            testingState={testing}
          />
        ))}
      </Reorder.Group>
      
      {items.length === 0 && (
        <div className="text-center py-8 text-muted-foreground border border-dashed border-white/10 rounded-lg">
          Список пуст
        </div>
      )}
    </div>
  );
}

export default function OwnerLLMSettings() {
  const [, setLocation] = useLocation();
  const { data, isLoading } = useLLMPriority();
  const update = useUpdateLLMPriority();
  const { toast } = useToast();
  
  const [chains, setChains] = useState<Record<ChainKey, ChainItem[]>>({
    response: [],
    observer: [],
    background: [],
  });

  // Инициализация данных
  useEffect(() => {
    if (data && !isLoading) {
      setChains({
        response: data.response.map(x => ({ ...x, id: generateId() })),
        observer: data.observer.map(x => ({ ...x, id: generateId() })),
        background: data.background.map(x => ({ ...x, id: generateId() })),
      });
    }
  }, [data, isLoading]);

  const handleSave = async () => {
    try {
      // Убираем id перед отправкой
      const cleanChains = {
        response: chains.response.map(({ id, ...rest }) => rest),
        observer: chains.observer.map(({ id, ...rest }) => rest),
        background: chains.background.map(({ id, ...rest }) => rest),
      };
      
      await update.mutateAsync(cleanChains);
      toast({ title: "Сохранено", description: "Настройки LLM успешно обновлены" });
    } catch {
      toast({ title: "Ошибка", description: "Не удалось сохранить настройки", variant: "destructive" });
    }
  };

  const handleReset = () => {
    if (data) {
      setChains({
        response: data.response.map(x => ({ ...x, id: generateId() })),
        observer: data.observer.map(x => ({ ...x, id: generateId() })),
        background: data.background.map(x => ({ ...x, id: generateId() })),
      });
      toast({ title: "Сброшено", description: "Возвращены последние сохраненные настройки" });
    }
  };

  const addItem = (key: ChainKey) => {
    setChains(prev => ({
      ...prev,
      [key]: [...prev[key], { provider: "", model: "", enabled: true, id: generateId() }]
    }));
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full gap-4">
        {/* Header */}
        <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border/50 shadow-sm shrink-0">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation('/dashboard/owner')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold flex items-center gap-2">
                <Bot className="w-6 h-6 text-primary" />
                LLM Настройки
              </h1>
              <p className="text-sm text-muted-foreground">Управление приоритетами и моделями</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleReset} disabled={isLoading || update.isPending}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Сбросить
            </Button>
            <Button onClick={handleSave} disabled={isLoading || update.isPending} className="min-w-[120px]">
              {update.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Сохранить
            </Button>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="flex-1 min-h-0 bg-card rounded-xl border border-border/50 overflow-hidden flex flex-col shadow-sm">
            <Tabs defaultValue="response" className="flex-1 min-h-0 flex flex-col">
              <div className="border-b border-border/50 px-4 pt-2 shrink-0">
                <TabsList className="bg-transparent w-full justify-start h-12 p-0 gap-6">
                  <TabsTrigger 
                    value="response" 
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0"
                  >
                    Ответы (Main)
                    <Badge variant="secondary" className="ml-2">{chains.response.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="observer" 
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0"
                  >
                    Observer
                    <Badge variant="secondary" className="ml-2">{chains.observer.length}</Badge>
                  </TabsTrigger>
                  <TabsTrigger 
                    value="background" 
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0"
                  >
                    Фоновые задачи
                    <Badge variant="secondary" className="ml-2">{chains.background.length}</Badge>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="response" className="flex-1 min-h-0 mt-0">
                <ScrollArea className="h-full">
                  <div className="p-6 max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-lg font-semibold">Цепочка генерации ответов</h2>
                        <p className="text-sm text-muted-foreground">Основной канал общения с пользователем. Используется для всех текстовых ответов.</p>
                      </div>
                      <Button size="sm" onClick={() => addItem('response')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить
                      </Button>
                    </div>
                    <ChainList items={chains.response} onChange={(items) => setChains(c => ({ ...c, response: items }))} />
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="observer" className="flex-1 min-h-0 mt-0">
                <ScrollArea className="h-full">
                  <div className="p-6 max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-lg font-semibold">Цепочка Observer</h2>
                        <p className="text-sm text-muted-foreground">Анализ контекста и триггеров. Должны быть быстрые и умные модели.</p>
                      </div>
                      <Button size="sm" onClick={() => addItem('observer')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить
                      </Button>
                    </div>
                    <ChainList items={chains.observer} onChange={(items) => setChains(c => ({ ...c, observer: items }))} />
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="background" className="flex-1 min-h-0 mt-0">
                <ScrollArea className="h-full">
                  <div className="p-6 max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-lg font-semibold">Фоновые задачи</h2>
                        <p className="text-sm text-muted-foreground">Саммари, классификация, Shadow Scribe. Дешевые и быстрые модели.</p>
                      </div>
                      <Button size="sm" onClick={() => addItem('background')}>
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить
                      </Button>
                    </div>
                    <ChainList items={chains.background} onChange={(items) => setChains(c => ({ ...c, background: items }))} />
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
