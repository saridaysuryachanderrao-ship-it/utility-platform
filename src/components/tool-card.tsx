import React from "react";
import Link from "next/link";
import { ToolDefinition } from "@/types/tool";
import {
  FileCode,
  Binary,
  ShieldCheck,
  FileText,
  Type,
  Calculator,
  Wrench,
  ArrowRight,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  FileCode: <FileCode className="w-5 h-5" />,
  Binary: <Binary className="w-5 h-5" />,
  ShieldCheck: <ShieldCheck className="w-5 h-5" />,
  FileText: <FileText className="w-5 h-5" />,
  Type: <Type className="w-5 h-5" />,
  Calculator: <Calculator className="w-5 h-5" />,
};

interface ToolCardProps {
  tool: ToolDefinition;
}

export function ToolCard({ tool }: ToolCardProps) {
  const icon = iconMap[tool.icon] || <Wrench className="w-5 h-5" />;

  return (
    <Link
      href={`/tools/${tool.category}/${tool.slug}`}
      className="group relative flex flex-col justify-between p-6 rounded-2xl bg-card border border-border/60 shadow-sm hover:shadow-xl hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform duration-300" />

      <div>
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300 shadow-sm">
            {icon}
          </div>
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-muted text-muted-foreground border border-border/40">
            {tool.category}
          </span>
        </div>

        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors duration-200 mb-2 line-clamp-1">
          {tool.name}
        </h3>

        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4">
          {tool.description}
        </p>
      </div>

      <div className="pt-4 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex flex-wrap gap-1">
          {tool.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-muted/60"
            >
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-1 font-medium text-primary text-xs opacity-80 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200">
          <span>Open</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
}
