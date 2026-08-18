import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { toolRegistry } from "@/lib/tools/registry";
import { categoryRegistry } from "@/lib/categories/registry";
import { ToolShell } from "@/components/tool-shell";
import { ToolCategory } from "@/types/tool";
import { WordCounterWorkspace } from "@/components/tools/text/word-counter";
import { Wrench } from "lucide-react";

interface ToolPageProps {
  params: Promise<{
    category: string;
    tool: string;
  }>;
}

export const dynamicParams = false;

export async function generateStaticParams() {
  const tools = toolRegistry.getAll();
  if (tools.length === 0) {
    // Structural framework route fallback for Next.js static export (zero concrete tools)
    return [{ category: "_", tool: "_" }];
  }
  return tools.map((t) => ({
    category: t.category,
    tool: t.slug,
  }));
}

export async function generateMetadata({
  params,
}: ToolPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const tool = toolRegistry.getBySlug(resolvedParams.tool);

  if (!tool || tool.category !== resolvedParams.category) {
    return {
      title: "Tool Not Found",
    };
  }

  return {
    title: `${tool.name} - Utility Platform`,
    description: tool.description,
  };
}

export default async function ToolDetailPage({ params }: ToolPageProps) {
  const resolvedParams = await params;
  const tool = toolRegistry.getBySlug(resolvedParams.tool);
  const category = categoryRegistry.getBySlug(resolvedParams.category as ToolCategory);

  if (!tool || tool.category !== resolvedParams.category) {
    notFound();
  }

  return (
    <ToolShell tool={tool} category={category}>
      {tool.slug === "word-counter" ? (
        <WordCounterWorkspace tool={tool} />
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[250px] text-center p-8 border-2 border-dashed border-border/60 rounded-xl bg-muted/20">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-foreground mb-1">
            {tool.name} Container
          </h3>
          <p className="text-xs text-muted-foreground max-w-md leading-relaxed">
            Layout-only tool shell active for {tool.name}. Utility logic and client-side workspace engine will be attached in subsequent milestones.
          </p>
        </div>
      )}
    </ToolShell>
  );
}
