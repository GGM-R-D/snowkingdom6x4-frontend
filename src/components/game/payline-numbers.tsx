"use client";

import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import { PAYLINE_COLORS } from "./winning-lines-display";

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
        {paylineNumbers.map((number) => {
          const paylineIndex = number - 1;
          const isActive = activePaylines.includes(paylineIndex);
          const paylineColor = PAYLINE_COLORS[paylineIndex % PAYLINE_COLORS.length];
          
          return (
            <div
              key={`left-${number}`}
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                isActive ? "text-white shadow-lg animate-pulse" : "bg-black/50 text-muted-foreground border border-primary/30"
              )}
              style={isActive ? {
                backgroundColor: paylineColor,
                boxShadow: `0 0 10px ${paylineColor}50, 0 0 20px ${paylineColor}30`
              } : {}}
            >
              {number}
            </div>
          );
        })}
      </div>

      {/* Grid content */}
      <div className="flex-1">
        {children}
      </div>

      {/* Right side payline numbers */}
      <div className="flex flex-col justify-between h-full w-8 ml-2">
        {paylineNumbers.map((number) => {
          const paylineIndex = number - 1;
          const isActive = activePaylines.includes(paylineIndex);
          const paylineColor = PAYLINE_COLORS[paylineIndex % PAYLINE_COLORS.length];
          
          return (
            <div
              key={`right-${number}`}
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300",
                isActive ? "text-white shadow-lg animate-pulse" : "bg-black/50 text-muted-foreground border border-primary/30"
              )}
              style={isActive ? {
                backgroundColor: paylineColor,
                boxShadow: `0 0 10px ${paylineColor}50, 0 0 20px ${paylineColor}30`
              } : {}}
            >
              {number}
            </div>
          );
        })}
      </div>
    </div>
  );
}
