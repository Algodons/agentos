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
    this.defaultTimeoutMs = options.defaultTimeoutMs ?? 10_000;
    this.maxTimeoutMs = options.maxTimeoutMs ?? 60_000;
  }

  /**
   * Executes a single task with validated timeout bounds.
   */
  async run<T, R>(task: WasmTask<T, R>): Promise<WasmTaskResult<R>> {
    const start = this.now();
    const timeoutMs = this.resolveTimeout(task.timeoutMs);

    try {
      const result = await Promise.race([
        task.execute(task.payload),
        this.timeout<R>(timeoutMs, task.id),
      ]);
      return { id: task.id, result, durationMs: this.now() - start };
    } catch (err) {
      return {
        id: task.id,
        error: err instanceof Error ? err.message : String(err),
        durationMs: this.now() - start,
      };
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

  private timeout<R>(ms: number, taskId: string): Promise<R> {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`WasmRunner: task ${taskId} timed out after ${ms}ms`)), ms),
    );
  }
}
