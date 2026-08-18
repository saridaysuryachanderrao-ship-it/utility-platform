import {
  ToolExecutionContext,
  ToolExecutionError,
  ToolExecutionOptions,
  ToolExecutionResult,
  ToolRunner,
} from "@/types/execution";
import { clientStorage } from "@/lib/storage";

function getNow(): number {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return Date.now();
}

function isAbortError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.name === "AbortError" ||
      error.name === "CanceledError" ||
      error.name === "CancelledError" ||
      error.message.toLowerCase().includes("abort") ||
      error.message.toLowerCase().includes("cancel")
    );
  }
  return false;
}

function normalizeError(error: unknown): ToolExecutionError {
  if (typeof error === "object" && error !== null) {
    const maybeError = error as { code?: string; message?: string; details?: unknown };
    if (typeof maybeError.code === "string" && typeof maybeError.message === "string") {
      return {
        code: maybeError.code,
        message: maybeError.message,
        details: maybeError.details,
      };
    }
  }

  if (error instanceof Error) {
    return {
      code: error.name || "EXECUTION_ERROR",
      message: error.message || "An unexpected error occurred during execution.",
      details: error.stack,
    };
  }

  if (typeof error === "string") {
    return {
      code: "EXECUTION_ERROR",
      message: error,
    };
  }

  return {
    code: "UNKNOWN_ERROR",
    message: "An unknown error occurred during execution.",
    details: error,
  };
}

export class ToolExecutionEngine {
  public static async execute<TInput = unknown, TOutput = unknown, TConfig = unknown>(
    runner: ToolRunner<TInput, TOutput, TConfig>,
    input: TInput,
    options?: ToolExecutionOptions<TConfig>
  ): Promise<ToolExecutionResult<TOutput>> {
    const startTime = getNow();
    const storage = options?.storage || clientStorage;
    const signal = options?.signal || new AbortController().signal;

    // Detect cancellation before execution
    if (signal.aborted) {
      const executionTimeMs = Math.max(0, getNow() - startTime);
      return {
        status: "cancelled",
        executionTimeMs,
        error: {
          code: "CANCELLED",
          message: "Execution was cancelled before it started.",
        },
      };
    }

    try {
      const context: ToolExecutionContext<TConfig, TInput> = {
        input,
        config: options?.config,
        signal,
        onProgress: options?.onProgress,
        storage,
      };

      const data = await runner(context);

      if (signal.aborted) {
        const executionTimeMs = Math.max(0, getNow() - startTime);
        return {
          status: "cancelled",
          executionTimeMs,
          error: {
            code: "CANCELLED",
            message: "Execution was cancelled during processing.",
          },
        };
      }

      const executionTimeMs = Math.max(0, getNow() - startTime);
      return {
        status: "success",
        data,
        executionTimeMs,
      };
    } catch (err: unknown) {
      const executionTimeMs = Math.max(0, getNow() - startTime);

      if (signal.aborted || isAbortError(err)) {
        return {
          status: "cancelled",
          executionTimeMs,
          error: {
            code: "CANCELLED",
            message: "Execution was cancelled.",
          },
        };
      }

      const error = normalizeError(err);
      return {
        status: "error",
        error,
        executionTimeMs,
      };
    }
  }
}
