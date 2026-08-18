"use client";

import React, { useEffect, useState, useTransition, useCallback } from "react";
import {
  WordCounterInput,
  WordCounterOutput,
  WordCounterConfig,
  wordCounterRunner,
} from "@/lib/tools/text/word-counter";
import { useToolExecution } from "@/hooks/use-tool-execution";
import { clientStorage } from "@/lib/storage";
import { ToolDefinition } from "@/types/tool";
import {
  FileText,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Clock,
  Volume2,
  BarChart2,
  AlignLeft,
  Type,
  Hash,
  Shield,
  Zap,
} from "lucide-react";

interface WordCounterWorkspaceProps {
  tool: ToolDefinition;
}

const STORAGE_KEY_TEXT = "tool:word-counter:text";

const SAMPLE_TEXT = `The quick brown fox jumps over the lazy dog. A journey of a thousand miles begins with a single step.

In the middle of difficulty lies opportunity. Design is not just what it looks like and feels like. Design is how it works. Simplicity is the ultimate sophistication.

Browser-based client-side utilities provide immediate feedback, full privacy, and uninterrupted focus. Every computation runs strictly within your local environment with zero data leakage.`;

export function WordCounterWorkspace({ tool }: WordCounterWorkspaceProps) {
  const [text, setText] = useState<string>("");
  const [copiedText, setCopiedText] = useState(false);
  const [copiedStats, setCopiedStats] = useState(false);
  const [, startTransition] = useTransition();

  const { status, result, executionTimeMs, execute, reset } = useToolExecution<
    WordCounterInput,
    WordCounterOutput,
    WordCounterConfig
  >(wordCounterRunner);

  // Load persisted text from storage on mount
  useEffect(() => {
    clientStorage.getItem<string>(STORAGE_KEY_TEXT).then((saved) => {
      if (saved && typeof saved === "string") {
        setText(saved);
        execute({ text: saved });
      } else {
        execute({ text: "" });
      }
    });
  }, [execute]);

  const handleTextChange = useCallback(
    (newText: string) => {
      setText(newText);
      clientStorage.setItem(STORAGE_KEY_TEXT, newText);
      startTransition(() => {
        execute({ text: newText });
      });
    },
    [execute]
  );

  const handleClear = () => {
    setText("");
    clientStorage.setItem(STORAGE_KEY_TEXT, "");
    reset();
    execute({ text: "" });
  };

  const handleLoadSample = () => {
    handleTextChange(SAMPLE_TEXT);
  };

  const handleCopyText = async () => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch {
      // Fallback if clipboard API is restricted
    }
  };

  const handleCopyStats = async () => {
    if (!result?.data) return;
    const d = result.data;
    const statsSummary = [
      `=== ${tool.name} Report ===`,
      `Words: ${d.words.toLocaleString()}`,
      `Characters (with spaces): ${d.charactersWithSpaces.toLocaleString()}`,
      `Characters (without spaces): ${d.charactersWithoutSpaces.toLocaleString()}`,
      `Lines: ${d.lines.toLocaleString()}`,
      `Sentences: ${d.sentences.toLocaleString()}`,
      `Paragraphs: ${d.paragraphs.toLocaleString()}`,
      `Estimated Reading Time: ${Math.floor(d.readingTimeSeconds / 60)}m ${d.readingTimeSeconds % 60}s`,
      `Estimated Speaking Time: ${Math.floor(d.speakingTimeSeconds / 60)}m ${d.speakingTimeSeconds % 60}s`,
      `Average Word Length: ${d.averageWordLength} characters`,
      `Longest Word: ${d.longestWord || "N/A"}`,
    ].join("\n");

    try {
      await navigator.clipboard.writeText(statsSummary);
      setCopiedStats(true);
      setTimeout(() => setCopiedStats(false), 2000);
    } catch {
      // Fallback
    }
  };

  const transformCase = (type: "upper" | "lower" | "title" | "sentence") => {
    if (!text) return;
    let transformed = "";
    if (type === "upper") {
      transformed = text.toUpperCase();
    } else if (type === "lower") {
      transformed = text.toLowerCase();
    } else if (type === "title") {
      transformed = text.replace(
        /\w\S*/g,
        (w) => w.charAt(0).toUpperCase() + w.substring(1).toLowerCase()
      );
    } else if (type === "sentence") {
      transformed = text.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) =>
        c.toUpperCase()
      );
    }
    handleTextChange(transformed);
  };

  const output: WordCounterOutput = result?.data || {
    words: 0,
    charactersWithSpaces: 0,
    charactersWithoutSpaces: 0,
    lines: 0,
    sentences: 0,
    paragraphs: 0,
    readingTimeSeconds: 0,
    speakingTimeSeconds: 0,
    averageWordLength: 0,
    longestWord: "",
    topWords: [],
  };

  const formatSeconds = (sec: number) => {
    if (sec <= 0) return "0s";
    const minutes = Math.floor(sec / 60);
    const remainingSec = sec % 60;
    if (minutes === 0) return `${remainingSec}s`;
    if (remainingSec === 0) return `${minutes}m`;
    return `${minutes}m ${remainingSec}s`;
  };

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/40">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleLoadSample}
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-150 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Load Sample</span>
          </button>

          <button
            onClick={handleClear}
            type="button"
            disabled={!text}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted text-muted-foreground hover:text-foreground hover:bg-muted/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear</span>
          </button>

          <div className="h-4 w-px bg-border/60 mx-1 hidden sm:block" />

          {/* Quick Case Formatters */}
          <div className="inline-flex items-center rounded-lg bg-muted/60 p-0.5 border border-border/40 text-xs">
            <button
              onClick={() => transformCase("upper")}
              disabled={!text}
              title="Convert to UPPERCASE"
              className="px-2 py-1 rounded text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-card disabled:opacity-40 transition-colors"
            >
              UPPER
            </button>
            <button
              onClick={() => transformCase("lower")}
              disabled={!text}
              title="Convert to lowercase"
              className="px-2 py-1 rounded text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-card disabled:opacity-40 transition-colors"
            >
              lower
            </button>
            <button
              onClick={() => transformCase("title")}
              disabled={!text}
              title="Convert to Title Case"
              className="px-2 py-1 rounded text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-card disabled:opacity-40 transition-colors"
            >
              Title
            </button>
            <button
              onClick={() => transformCase("sentence")}
              disabled={!text}
              title="Convert to Sentence case"
              className="px-2 py-1 rounded text-[11px] font-medium text-muted-foreground hover:text-foreground hover:bg-card disabled:opacity-40 transition-colors"
            >
              Sentence
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyStats}
            type="button"
            disabled={!text}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
          >
            {copiedStats ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied Report</span>
              </>
            ) : (
              <>
                <BarChart2 className="w-3.5 h-3.5 text-primary" />
                <span>Copy Stats</span>
              </>
            )}
          </button>

          <button
            onClick={handleCopyText}
            type="button"
            disabled={!text}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted hover:bg-muted/80 text-foreground border border-border/40 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-150"
          >
            {copiedText ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-primary" />
                <span>Copy Text</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Content: Text Input Area */}
      <div className="relative">
        <label htmlFor="word-counter-input" className="sr-only">
          Text Input
        </label>
        <textarea
          id="word-counter-input"
          value={text}
          onChange={(e) => handleTextChange(e.target.value)}
          placeholder="Paste or type your text here to begin instant client-side analysis..."
          rows={10}
          className="w-full p-4 text-sm font-sans rounded-xl bg-background border border-border/70 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-all placeholder:text-muted-foreground/60 resize-y leading-relaxed text-foreground"
        />
        <div className="flex items-center justify-between text-[11px] text-muted-foreground px-1 pt-1.5">
          <span>
            {output.words.toLocaleString()} {output.words === 1 ? "word" : "words"} ·{" "}
            {output.charactersWithSpaces.toLocaleString()} characters
          </span>
          <span className="font-mono">
            {executionTimeMs > 0 ? `${executionTimeMs.toFixed(1)}ms execution` : "Live engine"}
          </span>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Words */}
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Words</span>
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {output.words.toLocaleString()}
          </p>
          <span className="text-[10px] text-muted-foreground mt-0.5">
            Total tokens
          </span>
        </div>

        {/* Characters with spaces */}
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Characters</span>
            <Type className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {output.charactersWithSpaces.toLocaleString()}
          </p>
          <span className="text-[10px] text-muted-foreground mt-0.5">
            With spaces
          </span>
        </div>

        {/* Characters without spaces */}
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">No Spaces</span>
            <Hash className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {output.charactersWithoutSpaces.toLocaleString()}
          </p>
          <span className="text-[10px] text-muted-foreground mt-0.5">
            Excluding spaces
          </span>
        </div>

        {/* Sentences */}
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Sentences</span>
            <AlignLeft className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {output.sentences.toLocaleString()}
          </p>
          <span className="text-[10px] text-muted-foreground mt-0.5">
            Sentence count
          </span>
        </div>

        {/* Paragraphs */}
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Paragraphs</span>
            <AlignLeft className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {output.paragraphs.toLocaleString()}
          </p>
          <span className="text-[10px] text-muted-foreground mt-0.5">
            Text blocks
          </span>
        </div>

        {/* Lines */}
        <div className="p-3.5 rounded-xl bg-muted/40 border border-border/40 flex flex-col justify-between">
          <div className="flex items-center justify-between text-muted-foreground mb-1">
            <span className="text-xs font-medium">Lines</span>
            <AlignLeft className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-bold tracking-tight text-foreground">
            {output.lines.toLocaleString()}
          </p>
          <span className="text-[10px] text-muted-foreground mt-0.5">
            Line breaks
          </span>
        </div>
      </div>

      {/* Secondary Metrics: Durations & Structure */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Estimated Reading & Speaking Times */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-primary" />
            <span>Time Estimates</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-card border border-border/40">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Clock className="w-3.5 h-3.5 text-blue-500" />
                <span>Reading Time</span>
              </div>
              <p className="text-lg font-bold text-foreground">
                {formatSeconds(output.readingTimeSeconds)}
              </p>
              <span className="text-[10px] text-muted-foreground">
                @ 200 wpm standard
              </span>
            </div>

            <div className="p-3 rounded-lg bg-card border border-border/40">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1">
                <Volume2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Speaking Time</span>
              </div>
              <p className="text-lg font-bold text-foreground">
                {formatSeconds(output.speakingTimeSeconds)}
              </p>
              <span className="text-[10px] text-muted-foreground">
                @ 130 wpm speech
              </span>
            </div>
          </div>
        </div>

        {/* Structural Metrics */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <BarChart2 className="w-3.5 h-3.5 text-primary" />
            <span>Word Composition</span>
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-card border border-border/40">
              <span className="text-xs text-muted-foreground block mb-1">
                Avg Word Length
              </span>
              <p className="text-lg font-bold text-foreground">
                {output.averageWordLength}
                <span className="text-xs font-normal text-muted-foreground ml-1">
                  chars
                </span>
              </p>
              <span className="text-[10px] text-muted-foreground">
                Character density
              </span>
            </div>

            <div className="p-3 rounded-lg bg-card border border-border/40 overflow-hidden">
              <span className="text-xs text-muted-foreground block mb-1">
                Longest Word
              </span>
              <p className="text-sm font-mono font-bold text-foreground truncate" title={output.longestWord || "N/A"}>
                {output.longestWord || "—"}
              </p>
              <span className="text-[10px] text-muted-foreground">
                {output.longestWord ? `${output.longestWord.length} chars` : "None"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Word Frequency & Density Table */}
      {output.topWords.length > 0 && (
        <div className="p-4 rounded-xl bg-muted/30 border border-border/40 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-primary" />
              <span>Word Frequency & Density (Top {output.topWords.length})</span>
            </h3>
            <span className="text-[11px] text-muted-foreground">
              {output.words.toLocaleString()} total words analyzed
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            {output.topWords.map((item, idx) => (
              <div
                key={`${item.word}-${idx}`}
                className="flex items-center justify-between p-2.5 rounded-lg bg-card border border-border/40 text-xs"
              >
                <div className="flex items-center gap-2 min-w-0 mr-3">
                  <span className="w-4 text-[10px] font-mono text-muted-foreground shrink-0 text-center">
                    {idx + 1}
                  </span>
                  <span className="font-mono font-semibold text-foreground truncate">
                    {item.word}
                  </span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden hidden sm:block">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${Math.min(100, item.frequency * 5)}%` }}
                    />
                  </div>
                  <span className="font-semibold text-foreground w-8 text-right">
                    {item.count}x
                  </span>
                  <span className="text-[11px] font-mono text-muted-foreground w-12 text-right">
                    {item.frequency}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Engine Status & Security Guarantee Footer */}
      <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium text-[11px]">
            <Shield className="w-3 h-3" />
            <span>Engine: {status === "running" ? "Analyzing..." : "Ready"}</span>
          </span>
          <span className="text-[11px] font-mono">
            {executionTimeMs > 0 ? `Execution: ${executionTimeMs.toFixed(1)}ms` : "Zero latency"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-[11px]">
          <Zap className="w-3.5 h-3.5 text-primary" />
          <span>Local synchronous execution</span>
        </div>
      </div>
    </div>
  );
}
