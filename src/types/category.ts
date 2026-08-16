import { ToolCategory } from "./tool";

export interface CategoryDefinition {
  id: ToolCategory;
  name: string;
  slug: ToolCategory;
  description: string;
  icon: string;
  tags: string[];
}
