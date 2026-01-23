import { apiClient } from './client';

export interface GraphNode {
  id: string;
  chat_id: string;
  name: string;
  type: string;
  description?: string;
  metadata?: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface GraphEdge {
  id: string;
  chat_id: string;
  source_id: string;
  target_id: string;
  relation_type: string;
  weight: number;
  metadata?: Record<string, any>;
  created_at?: string;
}

export interface GraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface EmbeddingPoint {
  id: string;
  source_type: string;
  source_id: string;
  text_content: string;
  metadata?: Record<string, any>;
  x: number;
  y: number;
  z: number;
}

export interface Embeddings3DResponse {
  items: EmbeddingPoint[];
}

export interface EmbeddingSearchItem {
  embedding_id: string;
  source_type: string;
  source_id: string;
  similarity: number;
  text_content: string;
  metadata?: Record<string, any>;
}

export interface EmbeddingSearchResponse {
  results: EmbeddingSearchItem[];
}

export interface EntityCreateRequest {
  name: string;
  type: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface EpochSummaryItem {
  id: string;
  epoch_number: number;
  created_at?: string;
  topic?: string | null;
  summary: string;
  structured_data?: Record<string, any> | null;
  annotations_count: number;
}

export interface EpochSummariesResponse {
  items: EpochSummaryItem[];
  total: number;
}

export interface MemorySearchItem {
  epoch_summary_id: string;
  epoch_number: number;
  created_at?: string;
  topic?: string | null;
  summary: string;
  structured_data?: Record<string, any> | null;
  similarity: number;
  reasons: Record<string, any>;
}

export interface MemorySearchResponse {
  results: MemorySearchItem[];
}

export interface EpochSummaryAnnotation {
  id: string;
  note: string;
  owner_id?: number | null;
  created_at?: string;
}

export interface EpochSummaryAnnotationsResponse {
  items: EpochSummaryAnnotation[];
}

export interface ChangeLogItem {
  id: string;
  field_name: string;
  old_value?: Record<string, any> | null;
  new_value?: Record<string, any> | null;
  owner_id?: number | null;
  change_type: string;
  created_at?: string;
}

export interface ChangeLogResponse {
  items: ChangeLogItem[];
}

export const memoryApi = {
  getGraph: (chatId: string) => {
    return apiClient.get<GraphResponse>(`/memory/graph/${chatId}`);
  },

  getEmbeddings3D: (chatId: string, params?: { source_type?: string; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.source_type) qs.set('source_type', params.source_type);
    if (params?.limit !== undefined) qs.set('limit', String(params.limit));
    const q = qs.toString();
    return apiClient.get<Embeddings3DResponse>(`/memory/embeddings/${chatId}${q ? `?${q}` : ''}`);
  },

  searchEmbeddings: (chatId: string, params: { q: string; source_type?: string; limit?: number; threshold?: number }) => {
    const qs = new URLSearchParams();
    qs.set('q', params.q);
    if (params.source_type) qs.set('source_type', params.source_type);
    if (params.limit !== undefined) qs.set('limit', String(params.limit));
    if (params.threshold !== undefined) qs.set('threshold', String(params.threshold));
    return apiClient.get<EmbeddingSearchResponse>(`/memory/embeddings/search/${chatId}?${qs.toString()}`);
  },

  createEntity: (chatId: string, data: EntityCreateRequest) => {
    return apiClient.post<{ success: boolean }>(`/memory/entities/${chatId}`, data);
  },

  getRelated: (chatId: string, entityId: string) => {
    return apiClient.get<any[]>(`/memory/entities/${chatId}/${entityId}/related`);
  },

  listEpochs: (chatId: string, params?: { limit?: number; offset?: number; q?: string; from_ts?: string; to_ts?: string }) => {
    const qs = new URLSearchParams();
    if (params?.limit !== undefined) qs.set('limit', String(params.limit));
    if (params?.offset !== undefined) qs.set('offset', String(params.offset));
    if (params?.q) qs.set('q', params.q);
    if (params?.from_ts) qs.set('from_ts', params.from_ts);
    if (params?.to_ts) qs.set('to_ts', params.to_ts);
    const q = qs.toString();
    return apiClient.get<EpochSummariesResponse>(`/memory/epochs/${chatId}${q ? `?${q}` : ''}`);
  },

  search: (chatId: string, params: { q: string; limit?: number; threshold?: number }) => {
    const qs = new URLSearchParams();
    qs.set('q', params.q);
    if (params.limit !== undefined) qs.set('limit', String(params.limit));
    if (params.threshold !== undefined) qs.set('threshold', String(params.threshold));
    return apiClient.get<MemorySearchResponse>(`/memory/search/${chatId}?${qs.toString()}`);
  },

  updateEpoch: (chatId: string, epochSummaryId: string, data: { summary?: string; structured_data?: Record<string, any> }) => {
    return apiClient.patch<{ success: boolean }>(`/memory/epochs/${chatId}/${epochSummaryId}`, data);
  },

  listAnnotations: (chatId: string, epochSummaryId: string) => {
    return apiClient.get<EpochSummaryAnnotationsResponse>(`/memory/epochs/${chatId}/${epochSummaryId}/annotations`);
  },

  addAnnotation: (chatId: string, epochSummaryId: string, note: string) => {
    const qs = new URLSearchParams();
    qs.set('note', note);
    return apiClient.post<{ success: boolean }>(`/memory/epochs/${chatId}/${epochSummaryId}/annotations?${qs.toString()}`, {});
  },

  history: (chatId: string, epochSummaryId: string) => {
    return apiClient.get<ChangeLogResponse>(`/memory/epochs/${chatId}/${epochSummaryId}/history`);
  },

  rollback: (chatId: string, epochSummaryId: string, changeId: string) => {
    return apiClient.post<{ success: boolean }>(`/memory/epochs/${chatId}/${epochSummaryId}/rollback/${changeId}`, {});
  },
};
