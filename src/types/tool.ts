export type ToolCategory =
  | "text"
  | "image"
  | "pdf"
  | "developer"
  | "converter"
  | "math"
  | "utility";

export type ToolStatus = "stable" | "beta" | "deprecated";

export interface BrowserRequirement {
  api: string;
  supported: boolean;
  message?: string;
}

export interface ToolDefinition {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ToolCategory;
  tags: string[];
  icon: string;
  status: ToolStatus;
  version: string;
  browserRequirements?: BrowserRequirement[];
}
