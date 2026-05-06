'use client';

import { GlassCard } from '../ui/GlassCard';
import { NeonText } from '../ui/NeonText';
import { useAgentStore } from '@/store/useAgentStore';

function scoreColor(score: number): string {
  if (score >= 0.85) return '#00FF9C';
  if (score >= 0.6) return '#8A2EFF';
  return '#FF7A00';
}

export function ScoreIndex() {
  const { score, history, model } = useAgentStore();
  const confidence = Math.round(score * 100);
  const color = scoreColor(score);

  return (
    <GlassCard className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <NeonText color="blue" className="text-sm uppercase tracking-widest">
          Score Index
        </NeonText>
        <span className="text-xs text-gray-500">{model}</span>
      </div>

      {/* Main score */}
      <div className="flex items-end gap-3">
        <span className="text-5xl font-black transition-all duration-500" style={{ color }}>
          {score.toFixed(3)}
        </span>
        <span className="text-lg text-gray-400 mb-1">{confidence}%</span>
      </div>

      {/* Sparkline — last 20 scores */}
      <SparkLine history={history.slice(-20)} />
    </GlassCard>
  );
}

function SparkLine({ history }: { history: number[] }) {
  if (history.length === 0) {
    return <div className="h-10 text-xs text-gray-600 flex items-center">No data yet</div>;
  }

  const max = Math.max(...history, 1);
  const height = 40;
  const width = 200;
  const step = width / Math.max(history.length - 1, 1);

  const points = history
    .map((v, i) => `${i * step},${height - (v / max) * height}`)
    .join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-10 overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke="#00F0FF"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
