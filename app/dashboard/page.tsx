'use client';

import { useState, useCallback } from 'react';
import { ScoreIndex } from '@/components/dashboard/ScoreIndex';
import { AgentSwarmPanel } from '@/components/dashboard/AgentSwarmPanel';
import { PromptTimeline } from '@/components/dashboard/PromptTimeline';
import { ModelComparison } from '@/components/dashboard/ModelComparison';
import { LiveLogs } from '@/components/dashboard/LiveLogs';
import { GlowButton } from '@/components/ui/GlowButton';
import { NeonText } from '@/components/ui/NeonText';
import { useAgentStore } from '@/store/useAgentStore';
import { AgentLog } from '@/core/agents/types';
import Link from 'next/link';

interface OptimizeResponse {
  optimizedPrompt: string;
  score: number;
  model: string;
  versionId: string;
  iterations: number;
  scoreBreakdown: Record<string, number>;
  threatDetected: boolean;
  logs?: AgentLog[];
}

export default function DashboardPage() {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<OptimizeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { setScore, addLog, addPromptVersion, reset } = useAgentStore();

  const handleOptimize = useCallback(async () => {
    if (!input.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });

      const data = (await res.json()) as OptimizeResponse & { error?: string };

      if (!res.ok) {
        setError(data.error ?? 'Request failed');
        return;
      }

      setResult(data);
      setScore(data.score, data.model);

      addPromptVersion({
        versionId: data.versionId,
        prompt: data.optimizedPrompt,
        score: data.score,
        model: data.model,
        timestamp: new Date().toISOString(),
      });

      if (data.logs) {
        for (const log of data.logs) {
          addLog(log);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }, [input, setScore, addLog, addPromptVersion]);

  return (
    <div className="grid-overlay min-h-screen flex flex-col">
      {/* Top Bar */}
      <header className="glass border-b border-white/5 px-6 py-3 flex items-center justify-between">
        <Link href="/">
          <NeonText color="blue" className="text-lg font-black tracking-tight">
            AgentOS
          </NeonText>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500 font-mono">v1.0.0</span>
          <div className="w-2 h-2 rounded-full bg-[#00FF9C] animate-pulse" />
          <span className="text-xs text-[#00FF9C]">ONLINE</span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex flex-col glass border-r border-white/5 w-52 p-4 gap-2">
          <NavItem label="Dashboard" active />
          <NavItem label="Studio" />
          <NavItem label="Marketplace" />
          <NavItem label="Settings" />
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Prompt Input */}
          <section className="glass rounded-2xl p-5 space-y-3">
            <NeonText color="blue" className="text-sm uppercase tracking-widest">
              Optimize Prompt
            </NeonText>
            <textarea
              className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-sm text-gray-200 resize-none focus:outline-none focus:border-[#00F0FF]/50 transition"
              rows={3}
              placeholder="Enter your prompt or task…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <div className="flex gap-3">
              <GlowButton color="blue" onClick={handleOptimize} disabled={loading || !input.trim()}>
                {loading ? 'Running…' : 'Run Swarm'}
              </GlowButton>
              <GlowButton
                color="purple"
                onClick={reset}
                disabled={loading}
              >
                Reset
              </GlowButton>
            </div>

            {error && (
              <div className="text-sm text-[#FF7A00] bg-[#FF7A00]/10 rounded-lg p-3">{error}</div>
            )}

            {result && (
              <div className="space-y-2 pt-2 border-t border-white/5">
                <div className="flex gap-4 text-sm">
                  <span className="text-gray-400">Score:</span>
                  <span
                    className="font-mono font-bold"
                    style={{ color: result.score >= 0.85 ? '#00FF9C' : '#8A2EFF' }}
                  >
                    {result.score.toFixed(4)}
                  </span>
                  <span className="text-gray-400">Model:</span>
                  <span className="text-[#00F0FF] font-mono">{result.model}</span>
                  <span className="text-gray-400">Iterations:</span>
                  <span className="text-gray-300 font-mono">{result.iterations}</span>
                  {result.threatDetected && (
                    <span className="text-[#FF7A00] text-xs">⚠ Threat detected &amp; sanitized</span>
                  )}
                </div>
                <div className="bg-black/30 rounded-xl p-3 font-mono text-xs text-gray-300 whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {result.optimizedPrompt}
                </div>
              </div>
            )}
          </section>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ScoreIndex />
            <AgentSwarmPanel />
          </div>

          <PromptTimeline />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModelComparison />
            <LiveLogs />
          </div>
        </main>
      </div>
    </div>
  );
}

function NavItem({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
      className={`text-left px-3 py-2 rounded-lg text-sm transition ${
        active
          ? 'bg-[#00F0FF]/10 text-[#00F0FF]'
          : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
      }`}
    >
      {label}
    </button>
  );
}
