import { WasmRunner, WasmTask, WasmTaskResult } from './wasmRunner';

/**
 * WorkerPool — manages a pool of WasmRunner instances for parallel task execution.
 * Implements a task queue with configurable concurrency.
 */
export class WorkerPool {
  private readonly runners: WasmRunner[];
  private readonly queue: Array<() => void> = [];
  private activeCount = 0;

  constructor(private readonly concurrency: number = 4) {
    this.runners = Array.from({ length: concurrency }, () => new WasmRunner());
  }

  /**
   * Submits a task to the pool. Queues it if all runners are busy.
   */
  submit<T, R>(task: WasmTask<T, R>): Promise<WasmTaskResult<R>> {
    return new Promise((resolve) => {
      const run = () => {
        this.activeCount++;
        const runner = this.runners[this.activeCount % this.runners.length];
        runner.run(task).then((result) => {
          resolve(result);
          this.activeCount--;
          this.next();
        });
      };

      if (this.activeCount < this.concurrency) {
        run();
      } else {
        this.queue.push(run);
      }
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
}
