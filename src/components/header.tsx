import React from "react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import { Wrench } from "lucide-react";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-blue-600 text-primary-foreground shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-200">
            <Wrench className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-tight tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
              Utility Platform
            </span>
            <span className="text-[10px] text-muted-foreground font-mono tracking-wide">
              CLIENT-SIDE WORKSPACE
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
