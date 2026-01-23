import { useEffect, useMemo, useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import ForceGraph3D from 'react-force-graph-3d';
import { useBotChats } from '@/hooks/use-owner';
import {
  memoryApi,
  EpochSummaryItem,
  MemorySearchItem,
  EmbeddingPoint,
  EmbeddingSearchItem,
} from '@/lib/api/memory';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Loader2, Network, Search, Pencil, History, MessageSquarePlus, RotateCcw } from 'lucide-react';

export default function MemoryPage() {
  const { data: chatsData, isLoading: isLoadingChats } = useBotChats({ limit: 100 });
  const chats = chatsData?.chats?.filter((chat) => chat.chat_type === 'group' || chat.chat_type === 'supergroup');
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Память</h1>
          <p className="text-muted-foreground">Эпохи (саммари), поиск по воспоминаниям (RAG) и граф знаний.</p>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <Select value={selectedChatId || ''} onValueChange={setSelectedChatId}>
          <SelectTrigger className="w-[320px]">
            <SelectValue placeholder="Выбери чат" />
          </SelectTrigger>
          <SelectContent>
            {isLoadingChats ? (
              <div className="p-2 flex justify-center"><Loader2 className="h-4 w-4 animate-spin" /></div>
            ) : (
              chats?.map(chat => (
                <SelectItem key={chat.telegram_chat_id} value={String(chat.telegram_chat_id)}>
                  {chat.title || `Chat ${chat.telegram_chat_id}`}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {!selectedChatId ? (
        <Card className="h-[420px] flex items-center justify-center text-muted-foreground border-dashed">
          Выбери чат, чтобы посмотреть воспоминания
        </Card>
      ) : (
        <Tabs defaultValue="timeline" className="space-y-4">
          <TabsList>
            <TabsTrigger value="timeline">Эпохи</TabsTrigger>
            <TabsTrigger value="rag">Поиск (RAG)</TabsTrigger>
            <TabsTrigger value="graph">3D Граф</TabsTrigger>
            <TabsTrigger value="vectors">Вектора</TabsTrigger>
          </TabsList>

          <TabsContent value="timeline">
            <TimelineTab chatId={selectedChatId} />
          </TabsContent>
          <TabsContent value="rag">
            <SearchTab chatId={selectedChatId} />
          </TabsContent>
          <TabsContent value="graph">
            <GraphTab chatId={selectedChatId} />
          </TabsContent>
          <TabsContent value="vectors">
            <VectorsTab chatId={selectedChatId} />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function TimelineTab({ chatId }: { chatId: string }) {
  const [offset, setOffset] = useState(0);
  const limit = 30;
  const [q, setQ] = useState('');
  const [fromTs, setFromTs] = useState('');
  const [toTs, setToTs] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['memory-epochs', chatId, limit, offset, q, fromTs, toTs],
    queryFn: () => memoryApi.listEpochs(chatId, { limit, offset, q: q.trim(), from_ts: fromTs.trim(), to_ts: toTs.trim() }),
    enabled: !!chatId,
  });

  const items = data?.items || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Фильтр (тема/текст)</div>
            <Input value={q} onChange={(e) => { setOffset(0); setQ(e.target.value); }} placeholder="Например: гренландия, планы, кино..." />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">От (timestamptz)</div>
            <Input value={fromTs} onChange={(e) => { setOffset(0); setFromTs(e.target.value); }} placeholder="2026-01-01T00:00:00Z" />
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">До (timestamptz)</div>
            <Input value={toTs} onChange={(e) => { setOffset(0); setToTs(e.target.value); }} placeholder="2026-02-01T00:00:00Z" />
          </div>
        </CardContent>
      </Card>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Всего: {total} эпох
        </div>
        <div className="flex gap-2">
          <Button variant="outline" disabled={offset === 0} onClick={() => setOffset(Math.max(0, offset - limit))}>
            Назад
          </Button>
          <Button variant="outline" disabled={offset + limit >= total} onClick={() => setOffset(offset + limit)}>
            Дальше
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="h-[320px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <EpochCard key={item.id} chatId={chatId} item={item} />
          ))}
          {items.length === 0 && (
            <Card className="h-[260px] flex items-center justify-center text-muted-foreground border-dashed">
              Пока нет эпох. Они появятся после генерации саммари.
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function EpochCard({ chatId, item }: { chatId: string; item: EpochSummaryItem }) {
  const structured = item.structured_data || {};
  const topics = (structured['основные_темы'] as string[]) || [];
  const keywords = (structured['ключевые_слова'] as string[]) || [];
  const facts = (structured['важные_факты'] as string[]) || [];
  const decisions = (structured['решения'] as string[]) || [];
  const emotion = structured['эмоция'] as string | undefined;

  return (
    <Card>
      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-lg">
              Эпоха {item.epoch_number}{item.topic ? ` — ${item.topic}` : ''}
            </CardTitle>
            <CardDescription className="truncate">
              {item.created_at ? new Date(item.created_at).toLocaleString() : ''}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {emotion && <Badge variant="outline">{emotion}</Badge>}
            <Badge variant="secondary">{item.annotations_count} заметок</Badge>
            <EditEpochDialog chatId={chatId} item={item} />
            <AnnotationsDialog chatId={chatId} item={item} />
            <HistoryDialog chatId={chatId} item={item} />
          </div>
        </div>

        <div className="text-sm">{item.summary}</div>

        {(topics.length > 0 || keywords.length > 0) && (
          <div className="flex flex-wrap gap-2">
            {topics.slice(0, 8).map(t => <Badge key={`t-${t}`} variant="secondary">{t}</Badge>)}
            {keywords.slice(0, 8).map(k => <Badge key={`k-${k}`} variant="outline">{k}</Badge>)}
          </div>
        )}
      </CardHeader>

      {(facts.length > 0 || decisions.length > 0) && (
        <CardContent className="space-y-3">
          {facts.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">Важные факты</div>
              <div className="text-sm space-y-1">
                {facts.slice(0, 6).map((f, idx) => (
                  <div key={idx} className="text-muted-foreground">{f}</div>
                ))}
              </div>
            </div>
          )}
          {decisions.length > 0 && (
            <div className="space-y-1">
              <div className="text-xs font-medium text-muted-foreground">Решения</div>
              <div className="text-sm space-y-1">
                {decisions.slice(0, 6).map((d, idx) => (
                  <div key={idx} className="text-muted-foreground">{d}</div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}

function EditEpochDialog({ chatId, item }: { chatId: string; item: EpochSummaryItem }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [summary, setSummary] = useState(item.summary);
  const [structured, setStructured] = useState(JSON.stringify(item.structured_data || {}, null, 2));

  const mutation = useMutation({
    mutationFn: async () => {
      let structured_data: any = undefined;
      try {
        structured_data = JSON.parse(structured);
      } catch {
        structured_data = undefined;
      }
      return memoryApi.updateEpoch(chatId, item.id, { summary, structured_data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memory-epochs', chatId] });
      queryClient.invalidateQueries({ queryKey: ['memory-search', chatId] });
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Редактировать эпоху {item.epoch_number}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="text-sm font-medium">Саммари</div>
            <Textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} />
          </div>
          <div className="space-y-2">
            <div className="text-sm font-medium">Structured JSON</div>
            <Textarea value={structured} onChange={(e) => setStructured(e.target.value)} rows={10} />
          </div>
          <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Сохранить
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function AnnotationsDialog({ chatId, item }: { chatId: string; item: EpochSummaryItem }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['memory-annotations', chatId, item.id],
    queryFn: () => memoryApi.listAnnotations(chatId, item.id),
    enabled: open,
  });

  const addMutation = useMutation({
    mutationFn: () => memoryApi.addAnnotation(chatId, item.id, note),
    onSuccess: () => {
      setNote('');
      queryClient.invalidateQueries({ queryKey: ['memory-annotations', chatId, item.id] });
      queryClient.invalidateQueries({ queryKey: ['memory-epochs', chatId] });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <MessageSquarePlus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Заметки к эпохе {item.epoch_number}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="Добавь заметку или уточнение..." />
            <Button onClick={() => addMutation.mutate()} disabled={addMutation.isPending || note.trim().length === 0}>
              {addMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Добавить
            </Button>
          </div>
          <Separator />
          <ScrollArea className="h-[360px] pr-4">
            {isLoading ? (
              <div className="py-8 flex justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
            ) : (
              <div className="space-y-3">
                {(data?.items || []).map(a => (
                  <Card key={a.id}>
                    <CardContent className="p-4">
                      <div className="text-sm">{a.note}</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {a.created_at ? new Date(a.created_at).toLocaleString() : ''}
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {(data?.items || []).length === 0 && (
                  <div className="text-sm text-muted-foreground">Заметок пока нет</div>
                )}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function HistoryDialog({ chatId, item }: { chatId: string; item: EpochSummaryItem }) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['memory-history', chatId, item.id],
    queryFn: () => memoryApi.history(chatId, item.id),
    enabled: open,
  });

  const rollbackMutation = useMutation({
    mutationFn: (changeId: string) => memoryApi.rollback(chatId, item.id, changeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memory-history', chatId, item.id] });
      queryClient.invalidateQueries({ queryKey: ['memory-epochs', chatId] });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline">
          <History className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>История изменений</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[420px] pr-4">
          {isLoading ? (
            <div className="py-8 flex justify-center"><Loader2 className="h-5 w-5 animate-spin" /></div>
          ) : (
            <div className="space-y-3">
              {(data?.items || []).map(ch => (
                <Card key={ch.id}>
                  <CardContent className="p-4 space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-medium">{ch.change_type}</div>
                      <div className="text-xs text-muted-foreground">{ch.created_at ? new Date(ch.created_at).toLocaleString() : ''}</div>
                    </div>
                    {ch.new_value && (
                      <div className="text-xs text-muted-foreground truncate">
                        {JSON.stringify(ch.new_value).slice(0, 220)}
                      </div>
                    )}
                    {ch.old_value && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => rollbackMutation.mutate(ch.id)}
                        disabled={rollbackMutation.isPending}
                      >
                        Откатить к этому
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
              {(data?.items || []).length === 0 && (
                <div className="text-sm text-muted-foreground">Истории пока нет</div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

function SearchTab({ chatId }: { chatId: string }) {
  const [q, setQ] = useState('');
  const [submitted, setSubmitted] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['memory-search', chatId, submitted],
    queryFn: () => memoryApi.search(chatId, { q: submitted, limit: 20, threshold: 0.55 }),
    enabled: submitted.trim().length >= 2,
  });

  const results = data?.results || [];

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4 flex gap-2">
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Что найти в воспоминаниях? Например: «Гренландия», «аннексия», «планы»" />
          <Button onClick={() => setSubmitted(q.trim())} disabled={q.trim().length < 2}>
            <Search className="mr-2 h-4 w-4" />
            Найти
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="h-[280px] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-3">
          {results.map(r => (
            <SearchResultCard key={r.epoch_summary_id} r={r} />
          ))}
          {submitted.trim().length >= 2 && results.length === 0 && (
            <Card className="h-[220px] flex items-center justify-center text-muted-foreground border-dashed">
              Ничего не найдено по запросу
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

function SearchResultCard({ r }: { r: MemorySearchItem }) {
  const structured = r.structured_data || {};
  const topics = (structured['основные_темы'] as string[]) || [];
  const emotion = structured['эмоция'] as string | undefined;
  const mode = (r.reasons as any)?.mode as string | undefined;

  return (
    <Card>
      <CardHeader className="space-y-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-base">
              Эпоха {r.epoch_number}{r.topic ? ` — ${r.topic}` : ''}
            </CardTitle>
            <CardDescription className="truncate">
              {r.created_at ? new Date(r.created_at).toLocaleString() : ''} • similarity {r.similarity.toFixed(2)}{mode === 'keyword_fallback' ? ' • text match' : ''}
            </CardDescription>
          </div>
          <div className="flex gap-2 items-center">
            {emotion && <Badge variant="outline">{emotion}</Badge>}
            {mode === 'keyword_fallback' && <Badge variant="secondary">Текст</Badge>}
          </div>
        </div>
        <div className="text-sm">{r.summary}</div>
        {topics.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {topics.slice(0, 10).map(t => <Badge key={t} variant="secondary">{t}</Badge>)}
          </div>
        )}
      </CardHeader>
    </Card>
  );
}

function GraphTab({ chatId }: { chatId: string }) {
  const [nodeTypeFilter, setNodeTypeFilter] = useState<string>('all');
  const [relationTypeFilter, setRelationTypeFilter] = useState<string>('all');
  const containerRef = useRef<HTMLDivElement | null>(null);
  const graphRef = useRef<any>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  const { data: graph, isLoading, isError, error } = useQuery({
    queryKey: ['memory-graph', chatId],
    queryFn: () => memoryApi.getGraph(chatId),
    enabled: !!chatId,
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      setSize({ width: Math.max(0, Math.floor(rect.width)), height: Math.max(0, Math.floor(rect.height)) });
    };

    const ro = new ResizeObserver(measure);
    ro.observe(el);

    measure();
    let tries = 0;
    let raf = 0;
    const retry = () => {
      tries += 1;
      measure();
      if (tries < 30) raf = requestAnimationFrame(retry);
    };
    raf = requestAnimationFrame(retry);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel as any);
  }, []);

  const nodeTypes = useMemo(() => {
    const s = new Set<string>();
    (graph?.nodes || []).forEach(n => s.add(n.type));
    return Array.from(s).sort();
  }, [graph]);

  const relationTypes = useMemo(() => {
    const s = new Set<string>();
    (graph?.edges || []).forEach(e => s.add(e.relation_type));
    return Array.from(s).sort();
  }, [graph]);

  const graphData = useMemo(() => {
    const baseNodes = (graph?.nodes || []).map(n => ({
      id: n.id,
      name: n.name,
      type: n.type,
    }));

    const nodes = baseNodes.filter(n => nodeTypeFilter === 'all' || n.type === nodeTypeFilter);
    const allowedNodeIds = new Set(nodes.map(n => n.id));

    const links = (graph?.edges || [])
      .filter(e => relationTypeFilter === 'all' || e.relation_type === relationTypeFilter)
      .filter(e => allowedNodeIds.has(e.source_id) && allowedNodeIds.has(e.target_id))
      .map(e => ({
        source: e.source_id,
        target: e.target_id,
        type: e.relation_type,
        weight: e.weight,
      }));

    return { nodes, links };
  }, [graph, nodeTypeFilter, relationTypeFilter]);

  return (
    <Card className="h-[720px] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Граф знаний (3D)
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => graphRef.current?.zoomToFit?.(400, 60)}
            disabled={isLoading}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Сброс
          </Button>
          <Select value={nodeTypeFilter} onValueChange={setNodeTypeFilter}>
            <SelectTrigger className="w-[160px] h-8">
              <SelectValue placeholder="Тип узла" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все узлы</SelectItem>
              {nodeTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={relationTypeFilter} onValueChange={setRelationTypeFilter}>
            <SelectTrigger className="w-[180px] h-8">
              <SelectValue placeholder="Тип связи" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все связи</SelectItem>
              {relationTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Badge variant="outline">{graphData.nodes.length} узлов</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-0 h-[640px]">
        <div ref={containerRef} className="h-full w-full touch-none relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {!isLoading && isError && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground border-t">
              Ошибка загрузки графа: {String((error as any)?.message || error || 'unknown')}
            </div>
          )}
          {!isLoading && !isError && graphData.nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground border-t">
              Граф пуст или фильтры скрыли все узлы
            </div>
          )}
          {!isLoading && !isError && graphData.nodes.length > 0 && size.width > 0 && size.height > 0 && (
            <ForceGraph3D
              ref={graphRef}
              width={size.width}
              height={size.height}
              graphData={graphData as any}
              backgroundColor="rgba(0,0,0,0)"
              nodeLabel={(n: any) => `${n.name} (${n.type})`}
              nodeAutoColorBy="type"
              linkLabel={(l: any) => l.type}
              linkOpacity={0.35}
              nodeRelSize={4}
              linkDirectionalParticles={1}
              linkDirectionalParticleSpeed={(d: any) => Math.max(0.002, (d.weight || 1) * 0.002)}
              enableNodeDrag={false}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function VectorsTab({ chatId }: { chatId: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const graphRef = useRef<any>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [limit, setLimit] = useState<number>(1200);
  const [scale, setScale] = useState<number>(900);
  const [jitter, setJitter] = useState<number>(16);
  const [q, setQ] = useState('');
  const [submitted, setSubmitted] = useState('');

  useEffect(() => {
    const measure = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const next = { width: Math.max(0, Math.floor(rect.width)), height: Math.max(0, Math.floor(rect.height)) };
      setSize((prev) => (prev.width === next.width && prev.height === next.height ? prev : next));
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [chatId]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel as any);
  }, []);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['memory-embeddings-3d', chatId, sourceFilter, limit],
    queryFn: () => memoryApi.getEmbeddings3D(chatId, { source_type: sourceFilter === 'all' ? '' : sourceFilter, limit }),
    enabled: !!chatId,
  });

  const items = data?.items || [];
  const effectiveSourceType = sourceFilter === 'all' ? '' : sourceFilter;

  const searchQuery = useQuery({
    queryKey: ['memory-embeddings-search', chatId, submitted, effectiveSourceType],
    queryFn: () => memoryApi.searchEmbeddings(chatId, { q: submitted, source_type: effectiveSourceType, limit: 50, threshold: 0.35 }),
    enabled: submitted.trim().length >= 2,
  });

  const searchResults: EmbeddingSearchItem[] = (searchQuery.data?.results || []) as any;
  const sourceTypes = useMemo(() => {
    const s = new Set<string>();
    items.forEach(p => s.add(p.source_type));
    return Array.from(s).sort();
  }, [items]);

  const hash01 = (input: string) => {
    let h = 2166136261;
    for (let i = 0; i < input.length; i += 1) {
      h ^= input.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return ((h >>> 0) % 10000) / 10000;
  };

  const colorFor = (key: string) => {
    const hue = Math.floor(hash01(key) * 360);
    return `hsl(${hue}, 70%, 60%)`;
  };

  const graphData = useMemo(() => {
    const nodes = items.map((p: EmbeddingPoint) => ({
      id: p.id,
      source_type: p.source_type,
      source_id: p.source_id,
      text: p.text_content,
      x: p.x * scale + (hash01(`${p.id}:x`) - 0.5) * jitter,
      y: p.y * scale + (hash01(`${p.id}:y`) - 0.5) * jitter,
      z: p.z * scale + (hash01(`${p.id}:z`) - 0.5) * jitter,
    }));
    return { nodes, links: [] as any[] };
  }, [items, scale, jitter]);

  const nodeById = useMemo(() => {
    const m = new Map<string, any>();
    graphData.nodes.forEach((n: any) => m.set(String(n.id), n));
    return m;
  }, [graphData]);

  const highlightIds = useMemo(() => {
    if (submitted.trim().length < 2) return new Set<string>();
    const ids = new Set<string>();
    searchResults.forEach(r => ids.add(String(r.embedding_id)));
    return ids;
  }, [submitted, searchResults]);
  return (
    <Card className="h-[720px] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Network className="h-5 w-5" />
          Вектора (3D)
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => graphRef.current?.zoomToFit?.(400, 20)} disabled={isLoading}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Сброс
          </Button>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-[200px] h-8">
              <SelectValue placeholder="Тип" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Все типы</SelectItem>
              {sourceTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input
            className="w-[220px] h-8"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Семантический поиск по векторам"
          />
          <Button size="sm" onClick={() => setSubmitted(q.trim())} disabled={q.trim().length < 2}>
            <Search className="h-4 w-4 mr-2" />
            Найти
          </Button>
          <Input
            className="w-[120px] h-8"
            value={String(limit)}
            onChange={(e) => setLimit(Math.max(50, Math.min(500000, Number(e.target.value || 0))))}
            placeholder="limit"
          />
          <Badge variant="outline">{graphData.nodes.length} точек</Badge>
          <Input
            className="w-[110px] h-8"
            value={String(scale)}
            onChange={(e) => setScale(Math.max(1, Math.min(2000, Number(e.target.value || 0))))}
            placeholder="scale"
          />
          <Input
            className="w-[110px] h-8"
            value={String(jitter)}
            onChange={(e) => setJitter(Math.max(0, Math.min(2000, Number(e.target.value || 0))))}
            placeholder="jitter"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 h-[640px]">
        <div ref={containerRef} className="h-full w-full touch-none relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {!isLoading && isError && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground border-t">
              Ошибка загрузки векторов: {String((error as any)?.message || error || 'unknown')}
            </div>
          )}
          {!isLoading && !isError && graphData.nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground border-t">
              Нет векторов для отображения
            </div>
          )}
          {!isLoading && !isError && graphData.nodes.length > 0 && size.width > 0 && size.height > 0 && (
            <ForceGraph3D
              ref={graphRef}
              width={size.width}
              height={size.height}
              graphData={graphData as any}
              backgroundColor="rgba(0,0,0,0)"
              nodeLabel={(n: any) => `${n.source_type}\n${String(n.text || '').slice(0, 160)}`}
              nodeColor={(n: any) => {
                const id = String(n.id);
                if (highlightIds.size > 0 && !highlightIds.has(id)) return 'rgba(150,150,150,0.10)';
                return colorFor(String(n.source_type));
              }}
              nodeRelSize={2.6}
              enableNodeDrag={false}
              warmupTicks={0}
              cooldownTicks={0}
            />
          )}
          {submitted.trim().length >= 2 && (
            <div className="absolute bottom-0 left-0 right-0 border-t bg-background/90 backdrop-blur p-3 max-h-[220px] overflow-auto">
              <div className="text-xs text-muted-foreground mb-2">
                Найдено: {searchQuery.isLoading ? '...' : searchResults.length}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {(searchResults || []).slice(0, 8).map(r => (
                  <Button
                    key={r.embedding_id}
                    variant="outline"
                    className="h-auto justify-start whitespace-normal text-left"
                    onClick={() => {
                      const n = nodeById.get(String(r.embedding_id));
                      if (!n) return;
                      graphRef.current?.cameraPosition?.(
                        { x: n.x, y: n.y, z: n.z + 260 },
                        { x: n.x, y: n.y, z: n.z },
                        650
                      );
                    }}
                  >
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">
                        {r.source_type} • sim {r.similarity.toFixed(2)}
                      </div>
                      <div className="text-sm">
                        {String(r.text_content || '').slice(0, 140)}
                      </div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
