'use client';

import { GlassCard } from '../ui/GlassCard';
import { NeonText } from '../ui/NeonText';

interface ModelStats {
  name: string;
  score: number;
  latencyMs: number;
  costUsd: number;
}

const DEMO_MODELS: ModelStats[] = [
  { name: 'GPT-4', score: 0.94, latencyMs: 820, costUsd: 0.0042 },
  { name: 'Claude', score: 0.91, latencyMs: 650, costUsd: 0.0031 },
  { name: 'Gemini', score: 0.88, latencyMs: 540, costUsd: 0.0024 },
  { name: 'Llama', score: 0.82, latencyMs: 420, costUsd: 0.0011 },
];

export function ModelComparison() {
  const maxScore = Math.max(...DEMO_MODELS.map((m) => m.score));

  return (
    <GlassCard className="flex flex-col gap-4">
      <NeonText color="orange" className="text-sm uppercase tracking-widest">
        Model Comparison
      </NeonText>

      <div className="flex flex-col gap-3">
        {DEMO_MODELS.map((m) => (
          <div key={m.name} className="flex items-center gap-3">
            <span className="text-xs text-gray-400 w-14 flex-shrink-0">{m.name}</span>

            {/* Score bar */}
            <div className="flex-1 bg-white/5 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${(m.score / maxScore) * 100}%`,
                  backgroundColor: m.score >= 0.9 ? '#00FF9C' : m.score >= 0.85 ? '#8A2EFF' : '#FF7A00',
                }}
              />
            </div>

            <span className="text-xs font-mono text-gray-300 w-12 text-right">
              {m.score.toFixed(2)}
            </span>
          </div>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
        <Stat label="Best" value="GPT-4" />
        <Stat label="Fastest" value="Llama" />
        <Stat label="Cheapest" value="Llama" />
      </div>
    </GlassCard>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="text-sm font-semibold text-[#00F0FF]">{value}</div>
    </div>
  );
}
