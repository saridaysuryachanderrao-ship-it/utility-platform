export interface WorkerHelperOptions {
  name?: string;
  type?: WorkerType;
}

export interface PostMessageOptions {
  signal?: AbortSignal;
  transfer?: Transferable[];
}

export class WorkerHelper<TMessage = unknown, TResponse = unknown> {
  private worker: Worker | null = null;
  private isTerminated: boolean = false;

  constructor(
    private scriptUrlOrFactory: string | URL | (() => Worker),
    private options?: WorkerHelperOptions
  ) {}

  public static isSupported(): boolean {
    return typeof window !== "undefined" && typeof window.Worker !== "undefined";
  }

  private getWorker(): Worker {
    if (this.isTerminated) {
      throw new Error("WorkerHelper has already been terminated.");
    }
    if (!WorkerHelper.isSupported()) {
      throw new Error("Web Workers are not supported in this browser environment.");
    }

    if (!this.worker) {
      if (typeof this.scriptUrlOrFactory === "function") {
        this.worker = this.scriptUrlOrFactory();
      } else {
        this.worker = new Worker(this.scriptUrlOrFactory, this.options);
      }
    }
    return this.worker;
  }

  public postMessage(
    message: TMessage,
    options?: PostMessageOptions
  ): Promise<TResponse> {
    return new Promise<TResponse>((resolve, reject) => {
      if (options?.signal?.aborted) {
        this.terminate();
        const abortErr = new Error("Worker task was aborted.");
        abortErr.name = "AbortError";
        return reject(abortErr);
      }

      let worker: Worker;
      try {
        worker = this.getWorker();
      } catch (err) {
        return reject(err);
      }

      const handleMessage = (event: MessageEvent<TResponse>) => {
        cleanup();
        resolve(event.data);
      };

      const handleError = (errorEvent: ErrorEvent) => {
        cleanup();
        const error = new Error(
          errorEvent.message || "An error occurred inside Web Worker"
        );
        reject(error);
      };

      const handleAbort = () => {
        cleanup();
        this.terminate();
        const abortErr = new Error("Worker task was aborted.");
        abortErr.name = "AbortError";
        reject(abortErr);
      };

      const cleanup = () => {
        worker.removeEventListener("message", handleMessage);
        worker.removeEventListener("error", handleError);
        if (options?.signal) {
          options.signal.removeEventListener("abort", handleAbort);
        }
      };

      worker.addEventListener("message", handleMessage);
      worker.addEventListener("error", handleError);

      if (options?.signal) {
        options.signal.addEventListener("abort", handleAbort, { once: true });
      }

      if (options?.transfer && options.transfer.length > 0) {
        worker.postMessage(message, options.transfer);
      } else {
        worker.postMessage(message);
      }
    });
  }

  public terminate(): void {
    if (this.worker) {
      this.worker.terminate();
      this.worker = null;
    }
    this.isTerminated = true;
  }
}
