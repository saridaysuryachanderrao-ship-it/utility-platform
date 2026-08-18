import { ToolExecutionContext, ToolRunner } from "@/types/execution";
import { ToolDefinition } from "@/types/tool";

export interface WordCounterInput {
  text: string;
}

export interface WordCounterConfig {
  readingSpeedWpm?: number;
  speakingSpeedWpm?: number;
  topWordsLimit?: number;
}

export interface WordFrequency {
  word: string;
  count: number;
  frequency: number;
}

export interface WordCounterOutput {
  words: number;
  charactersWithSpaces: number;
  charactersWithoutSpaces: number;
  lines: number;
  sentences: number;
  paragraphs: number;
  readingTimeSeconds: number;
  speakingTimeSeconds: number;
  averageWordLength: number;
  longestWord: string;
  topWords: WordFrequency[];
}

export const wordCounterToolDefinition: ToolDefinition = {
  id: "text-word-counter",
  name: "Word Counter & Text Analyzer",
  slug: "word-counter",
  description:
    "Analyze text metrics including word and character counts, sentences, paragraphs, reading time, and word density distribution.",
  category: "text",
  tags: ["text", "counter", "words", "analysis", "statistics"],
  icon: "FileText",
  status: "stable",
  version: "1.0.0",
  requiredCapabilities: ["clipboard", "localStorage"],
  workerSupported: false,
};

export const wordCounterRunner: ToolRunner<
  WordCounterInput,
  WordCounterOutput,
  WordCounterConfig
> = async (
  context: ToolExecutionContext<WordCounterConfig, WordCounterInput>
): Promise<WordCounterOutput> => {
  const { input, config, signal, onProgress } = context;
  const text = input?.text || "";

  if (signal.aborted) {
    const err = new Error("Execution was aborted.");
    err.name = "AbortError";
    throw err;
  }

  onProgress?.(10);

  const readingWpm =
    config?.readingSpeedWpm && config.readingSpeedWpm > 0
      ? config.readingSpeedWpm
      : 200;
  const speakingWpm =
    config?.speakingSpeedWpm && config.speakingSpeedWpm > 0
      ? config.speakingSpeedWpm
      : 130;
  const topWordsLimit =
    config?.topWordsLimit && config.topWordsLimit > 0
      ? config.topWordsLimit
      : 10;

  if (!text || text.length === 0) {
    onProgress?.(100);
    return {
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
  }

  const charactersWithSpaces = text.length;
  const charactersWithoutSpaces = text.replace(/\s/g, "").length;

  onProgress?.(30);

  // Lines calculation
  const lines = text.split(/\r\n|\r|\n/).length;

  // Paragraphs calculation (non-empty blocks separated by double newlines or trimmed lines)
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0).length;

  // Sentences calculation (split by terminal punctuation)
  const sentenceMatches = text.match(/[^.!?]+[.!?]+(\s|$)/g);
  const sentences = sentenceMatches
    ? sentenceMatches.filter((s) => s.trim().length > 0).length
    : text.trim().length > 0
    ? 1
    : 0;

  onProgress?.(60);

  // Words extraction with Unicode support
  const rawWords = text.match(/[\p{L}\p{N}]+(?:['’\-][\p{L}\p{N}]+)*/gu) || [];
  const wordsCount = rawWords.length;

  // Word frequency & longest word computation
  const wordFrequencyMap = new Map<string, number>();
  let longestWord = "";
  let totalWordChars = 0;

  for (const w of rawWords) {
    if (signal.aborted) {
      const err = new Error("Execution was aborted.");
      err.name = "AbortError";
      throw err;
    }
    const cleanWord = w.toLowerCase();
    totalWordChars += cleanWord.length;
    if (cleanWord.length > longestWord.length) {
      longestWord = cleanWord;
    }
    wordFrequencyMap.set(cleanWord, (wordFrequencyMap.get(cleanWord) || 0) + 1);
  }

  onProgress?.(80);

  const averageWordLength =
    wordsCount > 0 ? Number((totalWordChars / wordsCount).toFixed(1)) : 0;

  // Sorted frequency list
  const sortedWordEntries = Array.from(wordFrequencyMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, topWordsLimit);

  const topWords: WordFrequency[] = sortedWordEntries.map(([word, count]) => ({
    word,
    count,
    frequency:
      wordsCount > 0 ? Number(((count / wordsCount) * 100).toFixed(1)) : 0,
  }));

  // Estimated reading and speaking durations in seconds
  const readingTimeSeconds =
    wordsCount > 0 ? Math.ceil((wordsCount / readingWpm) * 60) : 0;
  const speakingTimeSeconds =
    wordsCount > 0 ? Math.ceil((wordsCount / speakingWpm) * 60) : 0;

  onProgress?.(100);

  return {
    words: wordsCount,
    charactersWithSpaces,
    charactersWithoutSpaces,
    lines,
    sentences: Math.max(sentences, paragraphs > 0 ? 1 : 0),
    paragraphs: Math.max(paragraphs, wordsCount > 0 ? 1 : 0),
    readingTimeSeconds,
    speakingTimeSeconds,
    averageWordLength,
    longestWord,
    topWords,
  };
};
