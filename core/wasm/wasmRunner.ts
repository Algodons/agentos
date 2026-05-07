export interface WasmTask<T, R> {
  id: string;
  payload: T;
  execute: (payload: T) => Promise<R>;
  timeoutMs?: number;
}

export interface WasmTaskResult<R> {
  id: string;
  result?: R;
  error?: string;
  durationMs: number;
}

export interface WasmRunnerOptions {
  now?: () => number;
  defaultTimeoutMs?: number;
  maxTimeoutMs?: number;
}

/**
 * WasmRunner — deterministic task execution wrapper for WASM-compatible workloads.
 */
export class WasmRunner {
  private readonly now: () => number;
  private readonly defaultTimeoutMs: number;
  private readonly maxTimeoutMs: number;

  constructor(options: WasmRunnerOptions = {}) {
    this.now = options.now ?? Date.now;

    const defaultTimeoutMs = options.defaultTimeoutMs ?? 10_000;
    const maxTimeoutMs = options.maxTimeoutMs ?? 60_000;

    if (!Number.isFinite(defaultTimeoutMs) || defaultTimeoutMs <= 0) {
      throw new Error('WasmRunner: defaultTimeoutMs must be a positive finite number');
    }
    if (!Number.isFinite(maxTimeoutMs) || maxTimeoutMs <= 0) {
      throw new Error('WasmRunner: maxTimeoutMs must be a positive finite number');
    }
    if (maxTimeoutMs < defaultTimeoutMs) {
      throw new Error('WasmRunner: maxTimeoutMs must be >= defaultTimeoutMs');
    }

    this.defaultTimeoutMs = defaultTimeoutMs;
    this.maxTimeoutMs = maxTimeoutMs;
  }

  /**
   * Executes a single task with validated timeout bounds.
   */
  async run<T, R>(task: WasmTask<T, R>): Promise<WasmTaskResult<R>> {
    const start = this.now();
    const timeoutMs = this.resolveTimeout(task.timeoutMs);

    let timeoutId: NodeJS.Timeout | null = null;

    try {
      const timeoutPromise = new Promise<R>((_, reject) => {
        timeoutId = setTimeout(
          () => reject(new Error(`WasmRunner: task ${task.id} timed out after ${timeoutMs}ms`)),
          timeoutMs,
        );
      });

      const result = await Promise.race([task.execute(task.payload), timeoutPromise]);
      return { id: task.id, result, durationMs: this.now() - start };
    } catch (err) {
      return {
        id: task.id,
        error: err instanceof Error ? err.message : String(err),
        durationMs: this.now() - start,
      };
    } finally {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    }
  }

  /**
   * Executes multiple tasks in deterministic input order.
   */
  async runAll<T, R>(tasks: WasmTask<T, R>[]): Promise<WasmTaskResult<R>[]> {
    return Promise.all(tasks.map((task) => this.run(task)));
  }

  private resolveTimeout(taskTimeoutMs?: number): number {
    if (typeof taskTimeoutMs !== 'number' || !Number.isFinite(taskTimeoutMs) || taskTimeoutMs <= 0) {
      return this.defaultTimeoutMs;
    }
    return Math.min(taskTimeoutMs, this.maxTimeoutMs);
  }
}
