'use client';

import { useEffect, useRef } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { NeonText } from '../ui/NeonText';
import { useAgentStore } from '@/store/useAgentStore';

const levelColor: Record<string, string> = {
  info: '#00F0FF',
  warn: '#FF7A00',
  error: '#FF4444',
};

export function LiveLogs() {
  const { logs } = useAgentStore();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <GlassCard className="flex flex-col gap-3">
      <NeonText color="blue" className="text-sm uppercase tracking-widest">
        Live Logs
      </NeonText>

      <div className="font-mono text-xs bg-black/30 rounded-xl p-3 h-40 overflow-y-auto space-y-1">
        {logs.length === 0 && (
          <div className="text-gray-600">Waiting for events…</div>
        )}
        {logs.map((log, i) => (
          <div key={i} className="flex gap-2">
            <span className="text-gray-600 flex-shrink-0">{log.timestamp.slice(11, 19)}</span>
            <span
              className="flex-shrink-0 uppercase"
              style={{ color: levelColor[log.level] ?? '#aaa' }}
            >
              {log.level}
            </span>
            <span className="text-gray-400">[{log.agent}]</span>
            <span className="text-gray-300">{log.message}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </GlassCard>
  );
}
