import { WasmRunner } from '../core/wasm/wasmRunner';

describe('WasmRunner determinism', () => {
  it('preserves deterministic output for identical task input', async () => {
    const fixedNow = [1_000, 1_010, 2_000, 2_010];
    let index = 0;
    const runner = new WasmRunner({ now: () => fixedNow[index++] ?? 2_010 });

    const task = {
      id: 'deterministic-task',
      payload: { value: 7 },
      execute: async ({ value }: { value: number }) => value * 3,
    };

    const first = await runner.run(task);
    const second = await runner.run(task);

    expect(first.result).toBe(21);
    expect(second.result).toBe(21);
    expect(first.durationMs).toBe(10);
    expect(second.durationMs).toBe(10);
  });

  it('returns runAll results in input order even with mixed latencies', async () => {
    const runner = new WasmRunner();
    const tasks = [
      {
        id: 'slow',
        payload: 1,
        execute: async (value: number) => {
          await new Promise((resolve) => setTimeout(resolve, 30));
          return value;
        },
      },
      {
        id: 'fast',
        payload: 2,
        execute: async (value: number) => value,
      },
    ];

    const results = await runner.runAll(tasks);

    expect(results.map((r) => r.id)).toEqual(['slow', 'fast']);
    expect(results.map((r) => r.result)).toEqual([1, 2]);
  });

  it('applies timeout validation bounds', async () => {
    const runner = new WasmRunner({ defaultTimeoutMs: 20, maxTimeoutMs: 40 });

    const result = await runner.run({
      id: 'timeout-bounded',
      payload: null,
      timeoutMs: 1_000,
      execute: async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        return 'done';
      },
    });

    expect(result.error).toContain('timed out after 40ms');
  });
});
