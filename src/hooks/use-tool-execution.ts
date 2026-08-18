"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ToolExecutionError,
  ToolExecutionOptions,
  ToolExecutionResult,
  ToolExecutionStatus,
  ToolRunner,
} from "@/types/execution";
import { ToolExecutionEngine } from "@/lib/execution/runner";

export interface UseToolExecutionReturn<TInput, TOutput, TConfig> {
  status: ToolExecutionStatus;
  result: ToolExecutionResult<TOutput> | null;
  error: ToolExecutionError | null;
  progress: number;
  executionTimeMs: number;
  execute: (
    input: TInput,
    overrideOptions?: ToolExecutionOptions<TConfig>
  ) => Promise<ToolExecutionResult<TOutput>>;
  cancel: () => void;
  reset: () => void;
}

export function useToolExecution<
  TInput = unknown,
  TOutput = unknown,
  TConfig = unknown
>(
  runner?: ToolRunner<TInput, TOutput, TConfig>,
  defaultOptions?: ToolExecutionOptions<TConfig>
): UseToolExecutionReturn<TInput, TOutput, TConfig> {
  const [status, setStatus] = useState<ToolExecutionStatus>("idle");
  const [result, setResult] = useState<ToolExecutionResult<TOutput> | null>(null);
  const [error, setError] = useState<ToolExecutionError | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [executionTimeMs, setExecutionTimeMs] = useState<number>(0);

  const abortControllerRef = useRef<AbortController | null>(null);
  const executionCountRef = useRef<number>(0);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    cancel();
    setStatus("idle");
    setResult(null);
    setError(null);
    setProgress(0);
    setExecutionTimeMs(0);
  }, [cancel]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const execute = useCallback(
    async (
      input: TInput,
      overrideOptions?: ToolExecutionOptions<TConfig>
    ): Promise<ToolExecutionResult<TOutput>> => {
      // Cancel previous execution if still running
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const currentExecutionId = ++executionCountRef.current;

      setStatus("running");
      setProgress(0);
      setError(null);

      // Handle case when no runner is provided
      if (!runner) {
        const noRunnerResult: ToolExecutionResult<TOutput> = {
          status: "error",
          error: {
            code: "NO_RUNNER",
            message: "No execution runner provided for this tool.",
          },
          executionTimeMs: 0,
        };

        if (executionCountRef.current === currentExecutionId) {
          setStatus("error");
          setError(noRunnerResult.error || null);
          setResult(noRunnerResult);
          setExecutionTimeMs(0);
        }
        return noRunnerResult;
      }

      const mergedOptions: ToolExecutionOptions<TConfig> = {
        ...defaultOptions,
        ...overrideOptions,
        signal:
          overrideOptions?.signal ||
          defaultOptions?.signal ||
          abortController.signal,
        onProgress: (p: number) => {
          if (executionCountRef.current === currentExecutionId) {
            const clamped = Math.max(0, Math.min(100, p));
            setProgress(clamped);
          }
          if (overrideOptions?.onProgress) {
            overrideOptions.onProgress(p);
          } else if (defaultOptions?.onProgress) {
            defaultOptions.onProgress(p);
          }
        },
      };

      const executionResult = await ToolExecutionEngine.execute<
        TInput,
        TOutput,
        TConfig
      >(runner, input, mergedOptions);

      // Prevent stale executions from overwriting state
      if (executionCountRef.current === currentExecutionId) {
        setStatus(executionResult.status);
        setResult(executionResult);
        setError(executionResult.error || null);
        setExecutionTimeMs(executionResult.executionTimeMs);
        if (executionResult.status === "success") {
          setProgress(100);
        }
        abortControllerRef.current = null;
      }

      return executionResult;
    },
    [runner, defaultOptions]
  );

  return {
    status,
    result,
    error,
    progress,
    executionTimeMs,
    execute,
    cancel,
    reset,
  };
}
