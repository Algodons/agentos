import { create } from 'zustand';
import { AgentLog } from '@/core/agents/types';

export interface AgentState {
  name: string;
  status: 'idle' | 'running' | 'failed';
}

export interface PromptEntry {
  versionId: string;
  prompt: string;
  score: number;
  model: string;
  timestamp: string;
}

interface AgentStore {
  score: number;
  history: number[];
  model: string;
  agents: AgentState[];
  logs: AgentLog[];
  prompts: PromptEntry[];

  setScore: (score: number, model: string) => void;
  setAgentStatus: (name: string, status: AgentState['status']) => void;
  addLog: (log: AgentLog) => void;
  addPromptVersion: (entry: PromptEntry) => void;
  reset: () => void;
}

const DEFAULT_AGENTS: AgentState[] = [
  { name: 'InputAgent', status: 'idle' },
  { name: 'PromptArchitect', status: 'idle' },
  { name: 'SecurityAgent', status: 'idle' },
  { name: 'ExecutionAgent', status: 'idle' },
  { name: 'EvaluationAgent', status: 'idle' },
  { name: 'OptimizationAgent', status: 'idle' },
  { name: 'DeploymentAgent', status: 'idle' },
];

export const useAgentStore = create<AgentStore>((set) => ({
  score: 0,
  history: [],
  model: '—',
  agents: DEFAULT_AGENTS,
  logs: [],
  prompts: [],

  setScore: (score, model) =>
    set((state) => ({
      score,
      model,
      history: [...state.history.slice(-19), score],
    })),

  setAgentStatus: (name, status) =>
    set((state) => ({
      agents: state.agents.map((a) => (a.name === name ? { ...a, status } : a)),
    })),

  addLog: (log) =>
    set((state) => ({
      logs: [...state.logs.slice(-200), log],
    })),

  addPromptVersion: (entry) =>
    set((state) => ({
      prompts: [...state.prompts.slice(-49), entry],
    })),

  reset: () =>
    set({
      score: 0,
      history: [],
      model: '—',
      agents: DEFAULT_AGENTS,
      logs: [],
      prompts: [],
    }),
}));
