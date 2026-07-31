"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeContextType, ThemeMode } from "@/types/theme";
import { clientStorage } from "@/lib/storage";

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    clientStorage.getItem<ThemeMode>(STORAGE_KEY).then((savedTheme) => {
      if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
        setThemeState(savedTheme);
      }
    });
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const getSystemTheme = (): "light" | "dark" => {
      if (
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
      ) {
        return "dark";
      }
      return "light";
    };

    const effectiveTheme = theme === "system" ? getSystemTheme() : theme;
    setResolvedTheme(effectiveTheme);

    const root = document.documentElement;
    root.setAttribute("data-theme", effectiveTheme);
    if (effectiveTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => {
        const sysTheme = getSystemTheme();
        setResolvedTheme(sysTheme);
        root.setAttribute("data-theme", sysTheme);
        if (sysTheme === "dark") {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      };
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme, mounted]);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    clientStorage.setItem(STORAGE_KEY, newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
