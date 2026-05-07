'use client';

import { GlassCard } from '../ui/GlassCard';
import { NeonText } from '../ui/NeonText';
import { useAgentStore } from '@/store/useAgentStore';

export function PromptTimeline() {
  const { prompts } = useAgentStore();

  return (
    <GlassCard className="flex flex-col gap-4 overflow-hidden">
      <NeonText color="green" className="text-sm uppercase tracking-widest">
        Prompt Evolution
      </NeonText>

      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin">
        {prompts.length === 0 && (
          <div className="text-xs text-gray-600 py-2">No prompt versions yet</div>
        )}
        {prompts.map((p, i) => (
          <div
            key={p.versionId}
            className="flex-shrink-0 glass rounded-xl p-3 w-40 border border-white/5"
            style={{
              borderColor: i === prompts.length - 1 ? '#00FF9C' : undefined,
            }}
          >
            <div className="text-xs text-gray-500 mb-1">v{i + 1}</div>
            <div
              className="text-lg font-black"
              style={{ color: i === prompts.length - 1 ? '#00FF9C' : '#8A2EFF' }}
            >
              {p.score.toFixed(3)}
            </div>
            <div className="text-xs text-gray-400 truncate mt-1">{p.model}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
