import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categoryRegistry, initialCategories } from "@/lib/categories/registry";
import { toolRegistry } from "@/lib/tools/registry";
import { ToolCard } from "@/components/tool-card";
import { ToolCategory } from "@/types/tool";
import {
  FileText,
  Image as ImageIcon,
  FileSpreadsheet,
  Code2,
  ArrowLeftRight,
  Calculator,
  Wrench,
  ChevronRight,
  Boxes,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-8 h-8" />,
  Image: <ImageIcon className="w-8 h-8" />,
  FileSpreadsheet: <FileSpreadsheet className="w-8 h-8" />,
  Code2: <Code2 className="w-8 h-8" />,
  ArrowLeftRight: <ArrowLeftRight className="w-8 h-8" />,
  Calculator: <Calculator className="w-8 h-8" />,
  Wrench: <Wrench className="w-8 h-8" />,
};

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

export async function generateStaticParams() {
  return initialCategories.map((cat) => ({
    category: cat.slug,
  }));
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = categoryRegistry.getBySlug(resolvedParams.category as ToolCategory);

  if (!category) {
    return {
      title: "Category Not Found",
    };
  }

  return {
    title: `${category.name} - Utility Platform`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const category = categoryRegistry.getBySlug(resolvedParams.category as ToolCategory);

  if (!category) {
    notFound();
  }

  const categoryTools = toolRegistry.getByCategory(category.id);
  const icon = iconMap[category.icon] || <Wrench className="w-8 h-8" />;

  return (
    <div className="space-y-8">
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-xs text-muted-foreground font-medium"
      >
        <Link
          href="/"
          className="hover:text-foreground transition-colors duration-150"
        >
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        <span className="text-foreground font-semibold">
          {category.name}
        </span>
      </nav>

      {/* Category Hero Banner */}
      <div className="relative rounded-2xl bg-card border border-border/60 p-6 sm:p-8 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-primary-foreground shadow-lg shadow-primary/20 shrink-0">
              {icon}
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {category.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  {categoryTools.length} {categoryTools.length === 1 ? "Tool" : "Tools"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-2xl leading-relaxed">
                {category.description}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-border/40 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground mr-1">
            Category Tags:
          </span>
          {category.tags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-md bg-muted text-[11px] font-mono text-muted-foreground border border-border/40"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Category Tool List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground tracking-tight flex items-center gap-2">
            <Boxes className="w-5 h-5 text-primary" />
            <span>Available Tools</span>
          </h2>
        </div>

        {categoryTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryTools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-card border border-border/60 space-y-3">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted text-muted-foreground mb-2">
              <Wrench className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">No Tools Found</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              There are currently no utilities configured under the {category.name} category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
