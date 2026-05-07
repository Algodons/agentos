'use client';

import { GlassCard } from '../ui/GlassCard';
import { NeonText } from '../ui/NeonText';
import { useAgentStore } from '@/store/useAgentStore';

type AgentStatus = 'idle' | 'running' | 'failed';

const statusColor: Record<AgentStatus, string> = {
  idle: '#4B5563',
  running: '#00F0FF',
  failed: '#FF7A00',
};

const statusLabel: Record<AgentStatus, string> = {
  idle: 'IDLE',
  running: 'RUNNING',
  failed: 'FAILED',
};

export function AgentSwarmPanel() {
  const { agents } = useAgentStore();

  return (
    <GlassCard className="flex flex-col gap-4">
      <NeonText color="purple" className="text-sm uppercase tracking-widest">
        Agent Swarm
      </NeonText>

      <div className="flex flex-col gap-2">
        {agents.map((agent) => (
          <div key={agent.name} className="flex items-center justify-between">
            <span className="text-sm text-gray-300">{agent.name}</span>
            <div className="flex items-center gap-2">
              {agent.status === 'running' && (
                <span
                  className="w-2 h-2 rounded-full animate-pulse"
                  style={{ backgroundColor: statusColor.running }}
                />
              )}
              <span
                className="text-xs font-mono"
                style={{ color: statusColor[agent.status] }}
              >
                {statusLabel[agent.status]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
