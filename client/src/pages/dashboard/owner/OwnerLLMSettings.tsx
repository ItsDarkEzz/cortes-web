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
  Zap, Eye, CheckCircle, AlertCircle, Edit, Globe
} from "lucide-react";
import { 
  useLLMPriority, 
  useUpdateLLMPriority,
  useCustomProviders, 
  useCreateCustomProvider, 
  useUpdateCustomProvider, 
  useDeleteCustomProvider 
} from "@/hooks/use-owner";
import { ownerApi, type LLMModelEntry, type CustomLLMProvider } from "@/lib/api/owner";
import { useToast } from "@/hooks/use-toast";
import { Reorder, useDragControls } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

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

function CustomProvidersTab() {
  const { data: providers, isLoading } = useCustomProviders();
  const createMutation = useCreateCustomProvider();
  const updateMutation = useUpdateCustomProvider();
  const deleteMutation = useDeleteCustomProvider();
  const { toast } = useToast();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<CustomLLMProvider | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    base_url: "",
    api_key: "",
    is_active: true
  });

  const handleCreate = async () => {
    try {
      await createMutation.mutateAsync(formData);
      toast({ title: "Успешно", description: "Провайдер добавлен" });
      setIsCreateOpen(false);
      setFormData({ name: "", base_url: "", api_key: "", is_active: true });
    } catch {
      toast({ title: "Ошибка", description: "Не удалось добавить провайдера", variant: "destructive" });
    }
  };

  const handleUpdate = async () => {
    if (!editingProvider) return;
    try {
      await updateMutation.mutateAsync({
        id: editingProvider.id,
        data: {
          name: formData.name,
          base_url: formData.base_url,
          api_key: formData.api_key || undefined,
          is_active: formData.is_active
        }
      });
      toast({ title: "Успешно", description: "Провайдер обновлен" });
      setEditingProvider(null);
      setFormData({ name: "", base_url: "", api_key: "", is_active: true });
    } catch {
      toast({ title: "Ошибка", description: "Не удалось обновить провайдера", variant: "destructive" });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Вы уверены?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: "Успешно", description: "Провайдер удален" });
    } catch {
      toast({ title: "Ошибка", description: "Не удалось удалить провайдера", variant: "destructive" });
    }
  };

  const openEdit = (provider: CustomLLMProvider) => {
    setEditingProvider(provider);
    setFormData({
      name: provider.name,
      base_url: provider.base_url,
      api_key: "",
      is_active: provider.is_active
    });
  };

  if (isLoading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <ScrollArea className="h-full">
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Кастомные провайдеры</h2>
            <p className="text-sm text-muted-foreground">Подключение сторонних API, совместимых с OpenAI</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Добавить
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Добавить провайдера</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Название</Label>
                  <Input 
                    placeholder="My Local LLM" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Base URL</Label>
                  <Input 
                    placeholder="http://localhost:11434/v1" 
                    value={formData.base_url}
                    onChange={e => setFormData({...formData, base_url: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <Input 
                    type="password"
                    placeholder="sk-..." 
                    value={formData.api_key}
                    onChange={e => setFormData({...formData, api_key: e.target.value})}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch 
                    checked={formData.is_active}
                    onCheckedChange={c => setFormData({...formData, is_active: c})}
                  />
                  <Label>Активен</Label>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleCreate} disabled={createMutation.isPending}>
                  {createMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Создать
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4">
          {providers?.map(provider => (
            <div key={provider.id} className="bg-card border border-border/50 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Globe className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{provider.name}</h3>
                    {provider.is_active ? (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Active</Badge>
                    ) : (
                      <Badge variant="outline" className="text-muted-foreground">Inactive</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground font-mono mt-1">{provider.base_url}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => openEdit(provider)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-300" onClick={() => handleDelete(provider.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {providers?.length === 0 && (
            <div className="text-center py-12 text-muted-foreground border border-dashed border-white/10 rounded-lg">
              Нет кастомных провайдеров
            </div>
          )}
        </div>

        <Dialog open={!!editingProvider} onOpenChange={o => !o && setEditingProvider(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Редактировать провайдера</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Название</Label>
                <Input 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Base URL</Label>
                <Input 
                  value={formData.base_url}
                  onChange={e => setFormData({...formData, base_url: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>API Key (оставьте пустым, чтобы не менять)</Label>
                <Input 
                  type="password"
                  value={formData.api_key}
                  onChange={e => setFormData({...formData, api_key: e.target.value})}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch 
                  checked={formData.is_active}
                  onCheckedChange={c => setFormData({...formData, is_active: c})}
                />
                <Label>Активен</Label>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleUpdate} disabled={updateMutation.isPending}>
                {updateMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Сохранить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ScrollArea>
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
                  <TabsTrigger 
                    value="custom" 
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none h-full px-0"
                  >
                    Кастомные провайдеры
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

              <TabsContent value="custom" className="flex-1 min-h-0 mt-0">
                <CustomProvidersTab />
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
