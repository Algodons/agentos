import { useAgentStore } from '@/store/useAgentStore';
import { AgentLog } from '@/core/agents/types';

type SocketEvent = 'score:update' | 'agent:activity' | 'prompt:update' | 'system:log';

interface ScoreUpdatePayload {
  score: number;
  model: string;
}

interface AgentActivityPayload {
  name: string;
  status: 'idle' | 'running' | 'failed';
}

interface PromptUpdatePayload {
  versionId: string;
  prompt: string;
  score: number;
  model: string;
  timestamp: string;
}

type EventPayload = ScoreUpdatePayload | AgentActivityPayload | PromptUpdatePayload | AgentLog;

let ws: WebSocket | null = null;
let pollInterval: ReturnType<typeof setInterval> | null = null;

/**
 * Connect to the AgentOS WebSocket server.
 * Falls back to polling if the socket fails to connect.
 */
export function connectSocket(wsUrl: string = 'ws://localhost:3001'): void {
  if (typeof window === 'undefined') return;

  try {
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.info('[socket] Connected');
      stopPolling();
    };

    ws.onmessage = (event: MessageEvent<string>) => {
      try {
        const { type, payload } = JSON.parse(event.data) as {
          type: SocketEvent;
          payload: EventPayload;
        };
        handleEvent(type, payload);
      } catch {
        // ignore malformed messages
      }
    };

    ws.onerror = () => {
      console.warn('[socket] Error — falling back to polling');
      startPolling();
    };

    ws.onclose = () => {
      console.info('[socket] Disconnected — falling back to polling');
      startPolling();
    };
  } catch {
    startPolling();
  }
}

export function disconnectSocket(): void {
  ws?.close();
  ws = null;
  stopPolling();
}

function handleEvent(type: SocketEvent, payload: EventPayload): void {
  const store = useAgentStore.getState();

  switch (type) {
    case 'score:update': {
      const p = payload as ScoreUpdatePayload;
      store.setScore(p.score, p.model);
      break;
    }
    case 'agent:activity': {
      const p = payload as AgentActivityPayload;
      store.setAgentStatus(p.name, p.status);
      break;
    }
    case 'prompt:update': {
      const p = payload as PromptUpdatePayload;
      store.addPromptVersion(p);
      break;
    }
    case 'system:log': {
      store.addLog(payload as AgentLog);
      break;
    }
  }
}

/** Polling fallback — calls GET /api/status every 3 s */
function startPolling(): void {
  if (pollInterval) return;
  pollInterval = setInterval(async () => {
    try {
      const res = await fetch('/api/status');
      if (!res.ok) return;
      const data = (await res.json()) as { score?: number; model?: string };
      if (data.score !== undefined && data.model !== undefined) {
        useAgentStore.getState().setScore(data.score, data.model);
      }
    } catch {
      // ignore fetch errors
    }
  }, 3_000);
}

function stopPolling(): void {
  if (pollInterval) {
    clearInterval(pollInterval);
    pollInterval = null;
  }
}
