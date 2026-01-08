const API_BASE_URL = import.meta.env.VITE_API_URL || '/v1';

type TokenRefreshCallback = () => Promise<string | null>;

class ApiClient {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private onTokenRefresh: TokenRefreshCallback | null = null;

  constructor() {
    // Restore tokens from localStorage
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  setTokens(access: string, refresh: string) {
    this.accessToken = access;
    this.refreshToken = refresh;
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  getAccessToken() {
    return this.accessToken;
  }

  getRefreshToken() {
    return this.refreshToken;
  }

  isAuthenticated() {
    return !!this.accessToken;
  }

  setTokenRefreshCallback(callback: TokenRefreshCallback) {
    this.onTokenRefresh = callback;
  }

  private async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      });

      if (!res.ok) {
        this.clearTokens();
        return false;
      }

      const data = await res.json();
      this.setTokens(data.access_token, data.refresh_token || this.refreshToken);
      return true;
    } catch {
      this.clearTokens();
      return false;
    }
  }


  async request<T>(
    method: string,
    endpoint: string,
    options: {
      body?: unknown;
      headers?: Record<string, string>;
      auth?: boolean;
    } = {}
  ): Promise<T> {
    const { body, headers = {}, auth = true } = options;
    const url = `${API_BASE_URL}${endpoint}`;

    const requestHeaders: Record<string, string> = {
      ...headers,
    };

    if (body) {
      requestHeaders['Content-Type'] = 'application/json';
    }

    if (auth && this.accessToken) {
      requestHeaders['Authorization'] = `Bearer ${this.accessToken}`;
    }

    let res = await fetch(url, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    });

    // Handle 401 - try to refresh token
    if (res.status === 401 && auth && this.refreshToken) {
      const refreshed = await this.refreshAccessToken();
      if (refreshed) {
        requestHeaders['Authorization'] = `Bearer ${this.accessToken}`;
        res = await fetch(url, {
          method,
          headers: requestHeaders,
          body: body ? JSON.stringify(body) : undefined,
          credentials: 'include',
        });
      }
    }

    if (!res.ok) {
      const errorText = await res.text();
      throw new ApiError(res.status, errorText || res.statusText);
    }

    // Handle empty responses
    const text = await res.text();
    if (!text) return {} as T;
    
    return JSON.parse(text);
  }

  get<T>(endpoint: string, auth = true) {
    return this.request<T>('GET', endpoint, { auth });
  }

  post<T>(endpoint: string, body?: unknown, auth = true) {
    return this.request<T>('POST', endpoint, { body, auth });
  }

  patch<T>(endpoint: string, body?: unknown, auth = true) {
    return this.request<T>('PATCH', endpoint, { body, auth });
  }

  delete<T>(endpoint: string, auth = true) {
    return this.request<T>('DELETE', endpoint, { auth });
  }
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = new ApiClient();
