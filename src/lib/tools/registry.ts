import { ToolCategory, ToolDefinition } from "@/types/tool";

export class ToolRegistry {
  private tools: Map<string, ToolDefinition> = new Map();

  constructor(initialTools: ToolDefinition[] = []) {
    initialTools.forEach((tool) => this.register(tool));
  }

  public register(tool: ToolDefinition): void {
    this.tools.set(tool.id, tool);
  }

  public getById(id: string): ToolDefinition | undefined {
    return this.tools.get(id);
  }

  public getBySlug(slug: string): ToolDefinition | undefined {
    return Array.from(this.tools.values()).find((tool) => tool.slug === slug);
  }

  public getAll(): ToolDefinition[] {
    return Array.from(this.tools.values());
  }

  public getByCategory(category: ToolCategory): ToolDefinition[] {
    return Array.from(this.tools.values()).filter(
      (tool) => tool.category === category
    );
  }

  public search(query: string, category?: ToolCategory): ToolDefinition[] {
    const q = query.trim().toLowerCase();
    return Array.from(this.tools.values()).filter((tool) => {
      const matchesCategory = !category || category === tool.category;
      if (!matchesCategory) return false;
      if (!q) return true;

      return (
        tool.name.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    });
  }
}

export const initialTools: ToolDefinition[] = [
  {
    id: "json-formatter",
    name: "JSON Formatter & Validator",
    slug: "json-formatter",
    description: "Format, validate, and minify JSON data with instant error feedback.",
    category: "developer",
    tags: ["json", "formatter", "developer", "utility", "parser"],
    icon: "FileCode",
    status: "stable",
    version: "1.0.0",
  },
  {
    id: "base64-converter",
    name: "Base64 Encoder / Decoder",
    slug: "base64-converter",
    description: "Encode and decode text or binary data to and from Base64 format.",
    category: "developer",
    tags: ["base64", "encode", "decode", "developer"],
    icon: "Binary",
    status: "stable",
    version: "1.0.0",
  },
  {
    id: "hash-generator",
    name: "Hash Generator",
    slug: "hash-generator",
    description: "Generate SHA-256, SHA-512, MD5, and HMAC hashes instantly in standard web browser.",
    category: "developer",
    tags: ["hash", "sha256", "md5", "crypto", "developer"],
    icon: "ShieldCheck",
    status: "stable",
    version: "1.0.0",
  },
  {
    id: "markdown-preview",
    name: "Markdown Preview & Editor",
    slug: "markdown-preview",
    description: "Write and preview Github-flavored markdown side-by-side with live export.",
    category: "text",
    tags: ["markdown", "text", "editor", "preview"],
    icon: "FileText",
    status: "stable",
    version: "1.0.0",
  },
  {
    id: "word-counter",
    name: "Word & Character Counter",
    slug: "word-counter",
    description: "Analyze word count, character length, reading time, and paragraph count.",
    category: "text",
    tags: ["word", "counter", "text", "stats"],
    icon: "Type",
    status: "stable",
    version: "1.0.0",
  },
  {
    id: "unit-converter",
    name: "Unit & Measurement Converter",
    slug: "unit-converter",
    description: "Convert length, mass, temperature, area, volume, and digital storage units.",
    category: "converter",
    tags: ["converter", "unit", "math", "calculator"],
    icon: "Calculator",
    status: "stable",
    version: "1.0.0",
  },
];

export const toolRegistry = new ToolRegistry(initialTools);
