import { ScoringEngine } from '../core/evaluation/ScoringEngine';

describe('ScoringEngine', () => {
  const engine = new ScoringEngine();

  it('returns score between 0 and 1', () => {
    const { score } = engine.score({
      prompt: 'What is gravity?',
      response: 'Gravity is the force that attracts objects with mass toward each other.',
      latencyMs: 300,
      estimatedCostUsd: 0.00005,
    });
    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
  });

  it('provides all five breakdown components', () => {
    const { breakdown } = engine.score({
      prompt: 'Hello',
      response: 'World',
      latencyMs: 100,
      estimatedCostUsd: 0.000001,
    });
    expect(breakdown).toHaveProperty('accuracy');
    expect(breakdown).toHaveProperty('completeness');
    expect(breakdown).toHaveProperty('determinism');
    expect(breakdown).toHaveProperty('cost');
    expect(breakdown).toHaveProperty('latency');
    expect(breakdown).toHaveProperty('total');
  });

  it('scores a longer, relevant response higher than an empty one', () => {
    const prompt = 'Explain neural networks';

    const { score: highScore } = engine.score({
      prompt,
      response:
        'Neural networks are computing systems inspired by biological neural networks in brains. ' +
        'They consist of layers of interconnected nodes or neurons that process information using ' +
        'connectionist approaches to computation.',
      latencyMs: 300,
      estimatedCostUsd: 0.00005,
    });

    const { score: lowScore } = engine.score({
      prompt,
      response: '',
      latencyMs: 300,
      estimatedCostUsd: 0.00005,
    });

    expect(highScore).toBeGreaterThan(lowScore);
  });

  it('penalises high latency', () => {
    const base = {
      prompt: 'Test',
      response: 'Test response with enough words to get a decent completeness score here.',
      estimatedCostUsd: 0.00001,
    };

    const { score: fastScore } = engine.score({ ...base, latencyMs: 200 });
    const { score: slowScore } = engine.score({ ...base, latencyMs: 4_800 });

    expect(fastScore).toBeGreaterThan(slowScore);
  });

  it('penalises high cost', () => {
    const base = {
      prompt: 'Test',
      response: 'Test response with enough words to get a decent completeness score here.',
      latencyMs: 200,
    };

    const { score: cheapScore } = engine.score({ ...base, estimatedCostUsd: 0.000001 });
    const { score: expensiveScore } = engine.score({ ...base, estimatedCostUsd: 0.009 });

    expect(cheapScore).toBeGreaterThan(expensiveScore);
  });

  it('breakdown total matches the returned score', () => {
    const { score, breakdown } = engine.score({
      prompt: 'Describe photosynthesis',
      response:
        'Photosynthesis is the process used by plants, algae and certain bacteria to harness ' +
        'energy from sunlight and turn it into chemical energy.',
      latencyMs: 400,
      estimatedCostUsd: 0.00003,
    });
    expect(score).toBe(breakdown.total);
  });
});
