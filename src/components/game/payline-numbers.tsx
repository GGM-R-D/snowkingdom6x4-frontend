"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface PaylineNumbersProps {
  winningLines: Array<{
    paylineIndex: number;
    symbol: string;
    count: number;
    payout: number;
    line: number[];
  }>;
  isSpinning: boolean;
  children: ReactNode;
}

export function PaylineNumbers({ winningLines, isSpinning, children }: PaylineNumbersProps) {
  // Get unique payline indices from winning lines
  const activePaylines = [...new Set(winningLines.map(line => line.paylineIndex).filter(index => index !== -1))];
  
  // Create array of 10 paylines (1-10)
  const paylineNumbers = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center w-full">
      {/* Left side payline numbers */}
      <div className="flex flex-col justify-between h-full w-8 mr-2">
        {paylineNumbers.map((number) => (
          <div
            key={`left-${number}`}
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
              activePaylines.includes(number - 1)
                ? "bg-accent text-accent-foreground shadow-lg shadow-accent/50 animate-pulse"
                : "bg-black/50 text-muted-foreground border border-primary/30"
            )}
          >
            {number}
          </div>
        ))}
      </div>

      {/* Grid content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Right side payline numbers */}
      <div className="flex flex-col justify-between h-full w-8 ml-2">
        {paylineNumbers.map((number) => (
          <div
            key={`right-${number}`}
            className={cn(
              "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
              activePaylines.includes(number - 1)
                ? "bg-accent text-accent-foreground shadow-lg shadow-accent/50 animate-pulse"
                : "bg-black/50 text-muted-foreground border border-primary/30"
            )}
          >
            {number}
          </div>
        ))}
      </div>
    </div>
  );
}
