"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "./theme-provider";
import { Sun, Moon, Monitor } from "lucide-react";
import { ThemeMode } from "@/types/theme";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9 rounded-lg bg-muted/50 animate-pulse" />;
  }

  const modes: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "Light", icon: <Sun className="w-4 h-4" /> },
    { value: "dark", label: "Dark", icon: <Moon className="w-4 h-4" /> },
    { value: "system", label: "System", icon: <Monitor className="w-4 h-4" /> },
  ];

  return (
    <div className="flex items-center gap-1 p-1 rounded-xl bg-muted/60 border border-border/40 backdrop-blur-sm">
      {modes.map((mode) => {
        const isActive = theme === mode.value;
        return (
          <button
            key={mode.value}
            onClick={() => setTheme(mode.value)}
            title={`Switch to ${mode.label} theme`}
            className={`flex items-center justify-center p-2 rounded-lg text-xs font-medium transition-all duration-200 ${
              isActive
                ? "bg-card text-foreground shadow-sm scale-105"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            {mode.icon}
            <span className="sr-only">{mode.label} theme</span>
          </button>
        );
      })}
    </div>
  );
}
