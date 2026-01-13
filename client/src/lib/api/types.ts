// Auth
export interface AuthInitResponse {
  auth_token: string;
  bot_link: string;
  expires_in: number;
}

export interface AuthStatusResponse {
  status: 'pending' | 'success' | 'confirmed' | 'expired';
  user_id?: number;
  access_token?: string;
  refresh_token?: string;
  user?: {
    id: number;
    name: string;
    username?: string;
    avatar?: string;
  };
}

export interface AuthTokensResponse {
  access_token: string;
  refresh_token?: string;
}

// User
export interface User {
  id: number;
  name: string;
  username?: string;
  avatar?: string;
  created_at?: string;
}

export interface UserStats {
  messages_total: number;
  quests_completed: number;
  achievements_unlocked: number;
  achievements_total: number;
  days_active: number;
  chats_count: number;
}

// Chats
export interface Chat {
  id: number;
  name: string;
  description?: string;
  avatar?: string;
  role?: 'owner' | 'admin' | 'moderator';
  members_count: number;
  messages_today: number;
  bot_responses_today: number;
  bot_active: boolean;
  plan: string;
  plan_expires_at?: string;
}

export interface ChatDetails {
  id: number;
  name: string;
  description?: string;
  avatar?: string;
  rules?: string;
  members_count: number;
  created_at?: string;
  stats: ChatStats;
}

export interface ChatStats {
  messages_total: number;
  messages_today: number;
  bot_responses_total: number;
  bot_responses_today: number;
  days_active: number;
}

export interface ChatSettings {
  bot: {
    name: string;
    personality: string;
    mode: 'normal' | 'passive' | 'muted' | 'admins';
    welcome_enabled: boolean;
    welcome_message?: string;
    inactivity_enabled: boolean;
    inactivity_hours: number;
    inactivity_messages: string[];
    // Триггер-слова
    trigger_words_enabled: boolean;
    trigger_words: string[];
    trigger_words_message: string;
  };
  moderation: {
    ban_enabled: boolean;
    ban_message: string;
    mute_enabled: boolean;
    mute_message: string;
    kick_enabled: boolean;
    kick_message: string;
    warn_enabled: boolean;
    warn_message: string;
    warnings_for_ban: number;
    ban_duration_days: number;
    warning_expire_days: number;
    auto_ban_message: string;
    report_enabled: boolean;
    report_message: string;
    read_only_enabled: boolean;
    read_only_message: string;
    read_only_off_message: string;
    // Системные сообщения
    show_disabled_message: boolean;
    disabled_command_message: string;
    no_permission_message: string;
    // Сообщения об использовании команд
    ban_usage_message: string;
    mute_usage_message: string;
    kick_usage_message: string;
    warn_usage_message: string;
    report_usage_message: string;
  };
  filters: {
    stop_words_enabled: boolean;
    stop_words: string[];
    stop_word_message: string;
    block_channel_posts: boolean;
    blocked_channels: string[];
    channel_block_message: string;
    filter_arabic: boolean;
    arabic_message: string;
    filter_chinese: boolean;
    chinese_message: string;
    filter_zalgo: boolean;
    zalgo_message: string;
    block_links: boolean;
    nsfw_filter_enabled: boolean;
    nsfw_message: string;
  };
  media_permissions: {
    can_send_photos: boolean;
    can_send_videos: boolean;
    can_send_video_notes: boolean;
    can_send_voice_notes: boolean;
    can_send_documents: boolean;
    can_send_audios: boolean;
    can_send_stickers: boolean;
    can_send_polls: boolean;
    can_send_links: boolean;
  };
  face_control: {
    enabled: boolean;
    require_avatar: boolean;
    require_username: boolean;
    min_name_length: number;
    nsfw_avatar_check: boolean;
    notify_chat_id: number | null;
    questionnaire_enabled: boolean;
    questionnaire_intro: string;
    questionnaire_success: string;
    questionnaire_questions: Array<{
      id: number;
      text: string;
      required: boolean;
      order: number;
    }>;
  };
}

export interface ChatMember {
  id: number;
  name: string;
  username?: string;
  avatar?: string;
  role: 'owner' | 'admin' | 'moderator' | 'member';
  level: number;
  sympathy: number;
  warnings: number;
  joined_at?: string;
  last_message_at?: string;
  messages_count: number;
}


// Logs
export interface LogEntry {
  id: number;
  type: string;
  action: string;
  target_id: number;
  target_name: string;
  by_id?: number;
  by_name: string;
  reason?: string;
  created_at: string;
  // Расширенная информация
  message_id?: number;
  filter_type?: string;
  matched_content?: string;
  duration?: string;
  warning_count?: number;
  warning_limit?: number;
  old_role?: string;
  new_role?: string;
}

export interface SettingsLogEntry {
  id: number;
  user_id: number;
  user_name: string;
  section: string;
  field_name: string;
  old_value?: string;
  new_value?: string;
  created_at: string;
}

export interface Message {
  id: string;
  user_id: number;
  user_name: string;
  text: string;
  created_at: string;
  deleted: boolean;
  deleted_at?: string;
  deleted_reason?: string;
  // Новые поля
  message_type: string;
  telegram_message_id?: number;
  reply_to_user_id?: number;
  reply_to_user_name?: string;
}

// Brain
export interface BrainConfig {
  chat_id: number;
  instructions: string | null;
  memory_entries: number;
  last_summary_at: string | null;
  total_messages_processed: number;
}

// Opinions
export interface Opinion {
  id: number;
  topic: string;
  stance: string;
  reasoning: string;
  strength: number;
  can_change: boolean;
  is_default: boolean;
  created_at: string | null;
  updated_at: string | null;
}

export interface OpinionCreate {
  topic: string;
  stance: string;
  reasoning: string;
  strength?: number;
  can_change?: boolean;
}

export interface OpinionUpdate {
  stance?: string;
  reasoning?: string;
  strength?: number;
  can_change?: boolean;
}

export interface OpinionsListResponse {
  opinions: Opinion[];
  total: number;
}

// Notifications
export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'achievement' | 'quest' | 'system';
  title: string;
  message: string;
  is_read: boolean;
  chat_id?: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

// Plans
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  limits: {
    chats: number;
    messages_per_day: number;
    brain_instructions_length: number;
  };
}

export interface ChatPlan {
  plan: Plan;
  expires_at?: string;
  is_active: boolean;
}

// Pagination
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  has_more: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
