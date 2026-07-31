import React from "react";
import { ShieldCheck, Zap, Lock } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-muted/20 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8 pb-8 border-b border-border/40 text-sm">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">100% Client-Side</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Your data never leaves your browser. All computations run locally for complete privacy.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Instant Performance</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Zero network roundtrips for processing. Optimized WebAssembly & JavaScript execution.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary mt-0.5">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">Offline Capable</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Designed to work seamlessly without active internet connection.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Utility Platform. All rights reserved.</p>
          <p className="font-mono text-[11px]">
            Milestone 02B Bootstrap v0.1.0
          </p>
        </div>
      </div>
    </footer>
  );
}
