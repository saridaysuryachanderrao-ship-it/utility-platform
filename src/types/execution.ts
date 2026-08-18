import { StorageAdapter } from "./storage";

export type ToolExecutionStatus =
  | "idle"
  | "running"
  | "success"
  | "error"
  | "cancelled";

export interface ToolExecutionError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ToolExecutionResult<TOutput = unknown> {
  status: ToolExecutionStatus;
  data?: TOutput;
  error?: ToolExecutionError;
  executionTimeMs: number;
}

export interface ToolExecutionContext<TConfig = unknown, TInput = unknown> {
  input: TInput;
  config?: TConfig;
  signal: AbortSignal;
  onProgress?: (progress: number) => void;
  storage: StorageAdapter;
}

export type ToolRunner<TInput = unknown, TOutput = unknown, TConfig = unknown> = (
  context: ToolExecutionContext<TConfig, TInput>
) => Promise<TOutput>;

export type BrowserCapabilityId =
  | "webWorker"
  | "webCrypto"
  | "clipboard"
  | "fileSystem"
  | "canvas"
  | "offscreenCanvas"
  | "localStorage";

export interface BrowserCapabilityResult {
  id: BrowserCapabilityId;
  name: string;
  supported: boolean;
  message?: string;
}

export interface ToolExecutionOptions<TConfig = unknown> {
  config?: TConfig;
  signal?: AbortSignal;
  onProgress?: (progress: number) => void;
  storage?: StorageAdapter;
}
