import { NextResponse } from 'next/server';
import { MemorySystem } from '@/core/memory/MemorySystem';

/**
 * GET /api/status
 *
 * Returns the current AgentOS system status for the polling fallback in lib/socket.ts.
 * Reports the score and model from the most recently deployed prompt version.
 */
export function GET(): NextResponse {
  const memory = MemorySystem.getInstance();
  const best = memory.getBestVersion();

  return NextResponse.json({
    score: best?.score ?? 0,
    model: best?.model ?? '—',
    versionCount: memory.getLongTermHistory().length,
  });
}
