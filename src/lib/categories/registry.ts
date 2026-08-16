import { ToolCategory } from "@/types/tool";
import { CategoryDefinition } from "@/types/category";

export class CategoryRegistry {
  private categories: Map<ToolCategory, CategoryDefinition> = new Map();

  constructor(initialCategories: CategoryDefinition[] = []) {
    initialCategories.forEach((cat) => this.register(cat));
  }

  public register(category: CategoryDefinition): void {
    this.categories.set(category.id, category);
  }

  public getById(id: ToolCategory): CategoryDefinition | undefined {
    return this.categories.get(id);
  }

  public getBySlug(slug: ToolCategory): CategoryDefinition | undefined {
    return this.categories.get(slug);
  }

  public getAll(): CategoryDefinition[] {
    return Array.from(this.categories.values());
  }
}

export const initialCategories: CategoryDefinition[] = [
  {
    id: "text",
    name: "Text Tools",
    slug: "text",
    description: "Manipulate, transform, inspect, format, and evaluate text content.",
    icon: "FileText",
    tags: ["text", "formatting", "counter", "editor"],
  },
  {
    id: "image",
    name: "Image Tools",
    slug: "image",
    description: "Process, optimize, convert, and crop images directly in your browser.",
    icon: "Image",
    tags: ["image", "graphics", "photo", "converter"],
  },
  {
    id: "pdf",
    name: "PDF Utilities",
    slug: "pdf",
    description: "Merge, split, compress, and inspect PDF files with client-side privacy.",
    icon: "FileSpreadsheet",
    tags: ["pdf", "document", "merge", "split"],
  },
  {
    id: "developer",
    name: "Developer Utilities",
    slug: "developer",
    description: "Code formatting, Base64 encoding/decoding, hash generation, and dev tools.",
    icon: "Code2",
    tags: ["developer", "code", "json", "hash", "base64"],
  },
  {
    id: "converter",
    name: "Converters & Units",
    slug: "converter",
    description: "Convert length, mass, volume, temperature, and digital storage units.",
    icon: "ArrowLeftRight",
    tags: ["converter", "units", "measurement", "data"],
  },
  {
    id: "math",
    name: "Math & Calculations",
    slug: "math",
    description: "Calculators, formula tools, financial tools, and numerical utilities.",
    icon: "Calculator",
    tags: ["math", "calculator", "numbers", "finance"],
  },
  {
    id: "utility",
    name: "General Utilities",
    slug: "utility",
    description: "Handy everyday web utilities, generators, and productivity tools.",
    icon: "Wrench",
    tags: ["utility", "tools", "generators", "productivity"],
  },
];

export const categoryRegistry = new CategoryRegistry(initialCategories);
