import React from "react";
import Link from "next/link";
import { ToolDefinition } from "@/types/tool";
import { CategoryDefinition } from "@/types/category";
import {
  FileCode,
  Binary,
  ShieldCheck,
  FileText,
  Type,
  Calculator,
  Wrench,
  Image as ImageIcon,
  FileSpreadsheet,
  Code2,
  ArrowLeftRight,
  ChevronRight,
  Shield,
  Zap,
  Info,
} from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  FileCode: <FileCode className="w-6 h-6" />,
  Binary: <Binary className="w-6 h-6" />,
  ShieldCheck: <ShieldCheck className="w-6 h-6" />,
  FileText: <FileText className="w-6 h-6" />,
  Type: <Type className="w-6 h-6" />,
  Calculator: <Calculator className="w-6 h-6" />,
  Wrench: <Wrench className="w-6 h-6" />,
  Image: <ImageIcon className="w-6 h-6" />,
  FileSpreadsheet: <FileSpreadsheet className="w-6 h-6" />,
  Code2: <Code2 className="w-6 h-6" />,
  ArrowLeftRight: <ArrowLeftRight className="w-6 h-6" />,
};

interface ToolShellProps {
  tool: ToolDefinition;
  category?: CategoryDefinition;
  children: React.ReactNode;
}

export function ToolShell({ tool, category, children }: ToolShellProps) {
  const toolIcon = iconMap[tool.icon] || <Wrench className="w-6 h-6" />;
  const categoryName = category ? category.name : tool.category;

  return (
    <div className="space-y-6">
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
        <Link
          href={`/tools/${tool.category}`}
          className="hover:text-foreground transition-colors duration-150 capitalize"
        >
          {categoryName}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-60" />
        <span className="text-foreground font-semibold line-clamp-1">
          {tool.name}
        </span>
      </nav>

      {/* Tool Header Frame */}
      <div className="relative rounded-2xl bg-card border border-border/60 p-6 sm:p-8 shadow-sm overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-primary/10 via-primary/5 to-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            {/* Tool Icon Box */}
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-blue-600 text-primary-foreground shadow-lg shadow-primary/20 shrink-0">
              {toolIcon}
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                  {tool.name}
                </h1>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-muted text-muted-foreground border border-border/40">
                  v{tool.version}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase ${
                    tool.status === "stable"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                      : tool.status === "beta"
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"
                  }`}
                >
                  {tool.status}
                </span>
              </div>

              <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
                {tool.description}
              </p>
            </div>
          </div>

          {/* Category Badge & Actions */}
          <div className="flex md:flex-col items-end justify-between md:justify-start gap-3 shrink-0">
            <Link
              href={`/tools/${tool.category}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-200 text-xs font-semibold"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="capitalize">{categoryName}</span>
            </Link>
          </div>
        </div>

        {/* Tags & Capability Metadata */}
        <div className="mt-6 pt-4 border-t border-border/40 flex flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-medium text-muted-foreground mr-1">
              Tags:
            </span>
            {tool.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-md bg-muted/60 font-mono text-[10px] text-foreground/80 border border-border/30"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            <Shield className="w-4 h-4" />
            <span>100% Client-Side Engine</span>
          </div>
        </div>

        {/* Browser Requirements Banner (if defined) */}
        {tool.browserRequirements && tool.browserRequirements.length > 0 && (
          <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs flex items-start gap-2">
            <Info className="w-4 h-4 mt-0.5 shrink-0" />
            <div>
              <span className="font-semibold">Browser Capabilities: </span>
              {tool.browserRequirements.map((req) => (
                <span key={req.api} className="mr-2">
                  {req.api}: {req.supported ? "Supported" : "Unsupported"}{" "}
                  {req.message && `(${req.message})`}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Main Tool Workspace Container Slot (Layout-Only) */}
      <div className="rounded-2xl bg-card border border-border/60 shadow-sm p-6 min-h-[350px]">
        {children}
      </div>
    </div>
  );
}
