import { NextResponse } from 'next/server';
import { MemorySystem } from '@/core/memory/MemorySystem';

const processStartTime = Date.now();

/**
 * GET /api/status
 *
 * Returns the current AgentOS status and operational metrics.
 */
export function GET(): NextResponse {
  const memory = MemorySystem.getInstance();
  const best = memory.getBestVersion();

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptimeMs: Date.now() - processStartTime,
    score: best?.score ?? 0,
    model: best?.model ?? '—',
    versionCount: memory.getLongTermHistory().length,
  });
}
