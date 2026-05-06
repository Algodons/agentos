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

/**
 * WasmRunner — provides deterministic, parallel task execution via a simulated WASM sandbox.
 *
 * In production this would compile and run Wasm modules via the WebAssembly API.
 * The interface is kept identical so swapping in a real WASM engine requires no
 * changes to the surrounding code.
 */
export class WasmRunner {
  /**
   * Executes a single task with optional timeout.
   */
  async run<T, R>(task: WasmTask<T, R>): Promise<WasmTaskResult<R>> {
    const start = Date.now();
    const timeoutMs = task.timeoutMs ?? 10_000;

    try {
      const result = await Promise.race([
        task.execute(task.payload),
        this.timeout<R>(timeoutMs, task.id),
      ]);
      return { id: task.id, result, durationMs: Date.now() - start };
    } catch (err) {
      return {
        id: task.id,
        error: err instanceof Error ? err.message : String(err),
        durationMs: Date.now() - start,
      };
    }
  }

  /**
   * Executes multiple tasks in parallel.
   */
  async runAll<T, R>(tasks: WasmTask<T, R>[]): Promise<WasmTaskResult<R>[]> {
    return Promise.all(tasks.map((task) => this.run(task)));
  }

  private timeout<R>(ms: number, taskId: string): Promise<R> {
    return new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`WasmRunner: task ${taskId} timed out after ${ms}ms`)), ms),
    );
  }
}
