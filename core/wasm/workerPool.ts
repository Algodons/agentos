import { WasmRunner, WasmTask, WasmTaskResult } from './wasmRunner';

export interface WorkerPoolOptions {
  concurrency?: number;
  maxQueueSize?: number;
}

/**
 * WorkerPool — manages a pool of WasmRunner instances for parallel task execution.
 */
export class WorkerPool {
  private readonly runners: WasmRunner[];
  private readonly queue: Array<() => void> = [];
  private readonly concurrency: number;
  private readonly maxQueueSize: number;
  private activeCount = 0;
  private roundRobinIndex = 0;

  constructor(options: WorkerPoolOptions | number = 4) {
    const normalized = typeof options === 'number' ? { concurrency: options } : options;
    const concurrency = normalized.concurrency ?? 4;

    if (!Number.isInteger(concurrency) || concurrency < 1) {
      throw new Error('WorkerPool: concurrency must be a positive integer');
    }

    this.concurrency = concurrency;
    this.maxQueueSize = normalized.maxQueueSize ?? concurrency * 100;
    this.runners = Array.from({ length: concurrency }, () => new WasmRunner());
  }

  /**
   * Submits a task to the pool. Queues it if all runners are busy.
   */
  submit<T, R>(task: WasmTask<T, R>): Promise<WasmTaskResult<R>> {
    return new Promise((resolve, reject) => {
      const run = () => {
        this.activeCount++;
        const runnerIndex = this.roundRobinIndex % this.runners.length;
        this.roundRobinIndex++;
        const runner = this.runners[runnerIndex];
        runner.run(task).then((result) => {
          resolve(result);
          this.activeCount--;
          this.next();
        });
      };

      if (this.activeCount < this.concurrency) {
        run();
        return;
      }

      if (this.queue.length >= this.maxQueueSize) {
        reject(new Error(`WorkerPool: queue capacity ${this.maxQueueSize} exceeded`));
        return;
      }

      this.queue.push(run);
    });
  }

  /** Submits a batch of tasks, respecting the concurrency limit. */
  submitAll<T, R>(tasks: WasmTask<T, R>[]): Promise<WasmTaskResult<R>[]> {
    return Promise.all(tasks.map((t) => this.submit(t)));
  }

  private next(): void {
    const fn = this.queue.shift();
    if (fn) fn();
  }

  get pending(): number {
    return this.queue.length;
  }

  get active(): number {
    return this.activeCount;
  }

  get capacity(): number {
    return this.concurrency;
  }
}
