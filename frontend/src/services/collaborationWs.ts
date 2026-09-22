import { CollaborationEvent } from '../types';

type EventHandler = (event: CollaborationEvent) => void;

class CollaborationWebSocketService {
  private ws: WebSocket | null = null;
  private repositoryId: string | null = null;
  private userId: string;
  private username: string;
  private color: string;
  private listeners: Map<string, Set<EventHandler>> = new Map();
  private reconnectTimeout: any = null;
  private heartbeatInterval: any = null;
  private seenEventIds: Set<string> = new Set();
  private isExplicitlyClosed: boolean = false;

  constructor() {
    // Generate or retrieve persistent local user identity
    const savedUserId = localStorage.getItem('codeatlas_user_id');
    const savedUsername = localStorage.getItem('codeatlas_username');
    const savedColor = localStorage.getItem('codeatlas_user_color');

    this.userId = savedUserId || `user_${Math.random().toString(36).substring(2, 9)}`;
    this.username = savedUsername || `Engineer_${this.userId.substring(5, 9)}`;
    this.color = savedColor || this.getRandomColor();

    localStorage.setItem('codeatlas_user_id', this.userId);
    localStorage.setItem('codeatlas_username', this.username);
    localStorage.setItem('codeatlas_user_color', this.color);
  }

  private getRandomColor(): string {
    const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4', '#3b82f6'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  public getCurrentUser(): { userId: string; username: string; color: string } {
    return {
      userId: this.userId,
      username: this.username,
      color: this.color,
    };
  }

  public connect(repositoryId: string, currentTab: string = 'overview') {
    if (this.repositoryId === repositoryId && this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.disconnect();
    this.repositoryId = repositoryId;
    this.isExplicitlyClosed = false;

    const baseApi = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
    const wsProto = baseApi.startsWith('https') ? 'wss:' : 'ws:';
    const host = baseApi.replace(/^https?:\/\//, '').replace(/\/api\/v1\/?$/, '');
    const wsUrl = `${wsProto}//${host}/api/v1/ws/repositories/${repositoryId}?user_id=${this.userId}&username=${encodeURIComponent(this.username)}&color=${encodeURIComponent(this.color)}`;

    try {
      this.ws = new WebSocket(wsUrl);

      this.ws.onopen = () => {
        console.log(`[CodeAtlas RealTime] Connected to repository ${repositoryId}`);
        this.startHeartbeat(currentTab);
      };

      this.ws.onmessage = (event) => {
        try {
          const parsed: CollaborationEvent = JSON.parse(event.data);
          // Deduplicate events
          if (parsed.event_id && this.seenEventIds.has(parsed.event_id)) {
            return;
          }
          if (parsed.event_id) {
            this.seenEventIds.add(parsed.event_id);
            if (this.seenEventIds.size > 500) {
              const oldest = this.seenEventIds.values().next().value;
              if (oldest) this.seenEventIds.delete(oldest);
            }
          }

          this.dispatch(parsed.event_type, parsed);
          // Also dispatch to wildcard listeners
          this.dispatch('*', parsed);
        } catch (err) {
          console.error('[CodeAtlas RealTime] Message parse error:', err);
        }
      };

      this.ws.onclose = () => {
        this.stopHeartbeat();
        if (!this.isExplicitlyClosed) {
          console.log('[CodeAtlas RealTime] Connection lost. Reconnecting in 3s...');
          this.reconnectTimeout = setTimeout(() => {
            if (this.repositoryId) {
              this.connect(this.repositoryId, currentTab);
            }
          }, 3000);
        }
      };

      this.ws.onerror = (err) => {
        console.warn('[CodeAtlas RealTime] WebSocket encountered error:', err);
      };
    } catch (err) {
      console.error('[CodeAtlas RealTime] Failed to create WebSocket:', err);
    }
  }

  public disconnect() {
    this.isExplicitlyClosed = true;
    this.stopHeartbeat();
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.repositoryId = null;
  }

  public on(eventType: string, handler: EventHandler): () => void {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType)!.add(handler);

    // Return unbind function
    return () => {
      this.off(eventType, handler);
    };
  }

  public off(eventType: string, handler: EventHandler) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType)!.delete(handler);
    }
  }

  private dispatch(eventType: string, event: CollaborationEvent) {
    const handlers = this.listeners.get(eventType);
    if (handlers) {
      handlers.forEach((h) => {
        try {
          h(event);
        } catch (e) {
          console.error(`[CodeAtlas RealTime] Handler error on ${eventType}:`, e);
        }
      });
    }
  }

  public send(data: Record<string, any>) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  public sendHeartbeat(currentTab: string) {
    this.send({
      type: 'presence.heartbeat',
      current_tab: currentTab,
      timestamp: new Date().toISOString(),
    });
  }

  private startHeartbeat(currentTab: string) {
    this.stopHeartbeat();
    this.sendHeartbeat(currentTab);
    this.heartbeatInterval = setInterval(() => {
      this.sendHeartbeat(currentTab);
    }, 15000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}

export const collaborationWs = new CollaborationWebSocketService();
