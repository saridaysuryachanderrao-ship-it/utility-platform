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

export const initialTools: ToolDefinition[] = [];

export const toolRegistry = new ToolRegistry(initialTools);
