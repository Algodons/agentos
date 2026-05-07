import { NextRequest, NextResponse } from 'next/server';
import { SwarmOrchestrator } from '@/core/swarm/SwarmOrchestrator';
import type { ScoreBreakdown } from '@/core/evaluation/ScoringEngine';
import type { AgentLog } from '@/core/agents/types';

interface OptimizeRequestBody {
  input: string;
  model?: string;
}

interface OptimizeResponse {
  optimizedPrompt: string;
  score: number;
  model: string;
  versionId: string;
  iterations: number;
  scoreBreakdown: ScoreBreakdown;
  threatDetected: boolean;
  logs: AgentLog[];
}

/**
 * POST /api/optimize
 *
 * Runs the full AgentOS swarm pipeline on the provided input prompt.
 *
 * Request body:
 *   { input: string, model?: string }
 *
 * Response:
 *   { optimizedPrompt, score, model, versionId, iterations, scoreBreakdown, threatDetected, logs }
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: OptimizeRequestBody;

  try {
    body = (await request.json()) as OptimizeRequestBody;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!body.input || typeof body.input !== 'string' || body.input.trim().length === 0) {
    return NextResponse.json(
      { error: 'Field "input" is required and must be a non-empty string.' },
      { status: 422 },
    );
  }

  try {
    const orchestrator = new SwarmOrchestrator();
    const result = await orchestrator.run({ raw: body.input, model: body.model });

    const response: OptimizeResponse = {
      optimizedPrompt: result.finalPrompt,
      score: result.score,
      model: result.model,
      versionId: result.versionId,
      iterations: result.iterations,
      scoreBreakdown: result.scoreBreakdown,
      threatDetected: result.threatDetected,
      logs: result.logs,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
