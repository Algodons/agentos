import { WorkerPool } from '../core/wasm/workerPool';

describe('WorkerPool load and scaling', () => {
  it('enforces configured concurrency while processing load', async () => {
    const pool = new WorkerPool({ concurrency: 3, maxQueueSize: 200 });
    let inFlight = 0;
    let maxObserved = 0;

    const tasks = Array.from({ length: 50 }, (_, i) =>
      pool.submit({
        id: `task-${i}`,
        payload: i,
        execute: async (value: number) => {
          inFlight++;
          maxObserved = Math.max(maxObserved, inFlight);
          await new Promise((resolve) => setTimeout(resolve, 5));
          inFlight--;
          return value * 2;
        },
      }),
    );

    const results = await Promise.all(tasks);

    expect(results).toHaveLength(50);
    expect(results.every((r) => typeof r.result === 'number')).toBe(true);
    expect(maxObserved).toBeLessThanOrEqual(3);
    expect(pool.capacity).toBe(3);
  });

  it('rejects submissions beyond queue capacity', async () => {
    const pool = new WorkerPool({ concurrency: 1, maxQueueSize: 1 });

    const first = pool.submit({
      id: 'first',
      payload: null,
      execute: async () => {
        await new Promise((resolve) => setTimeout(resolve, 30));
        return 'first';
      },
    });

    const second = pool.submit({
      id: 'second',
      payload: null,
      execute: async () => 'second',
    });

    await expect(
      pool.submit({
        id: 'third',
        payload: null,
        execute: async () => 'third',
      }),
    ).rejects.toThrow('queue capacity 1 exceeded');

    await expect(first).resolves.toHaveProperty('id', 'first');
    await expect(second).resolves.toHaveProperty('id', 'second');
  });

  it('rejects invalid concurrency configuration', () => {
    expect(() => new WorkerPool({ concurrency: 0 })).toThrow(
      'WorkerPool: concurrency must be a positive integer',
    );
  });
});
