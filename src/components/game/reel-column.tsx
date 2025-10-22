'use client';

import type { SymbolId } from '@/lib/slot-config';
import { SymbolDisplay } from './symbol-display';
import { cn } from '@/lib/utils';
import { NUM_ROWS, REEL_STRIPS } from '@/lib/slot-config';
import { useState, useEffect } from 'react';

interface ReelColumnProps {
  symbols: SymbolId[];
  isSpinning: boolean;
  reelIndex: number;
  winningLineIndicesForColumn: number[][];
  isTurboMode?: boolean;
  shouldBounce?: boolean;
}

export function ReelColumn({ symbols, isSpinning, reelIndex, winningLineIndicesForColumn, isTurboMode = false, shouldBounce = false }: ReelColumnProps) {
    const reelStrip = REEL_STRIPS[reelIndex];
    const [isStopping, setIsStopping] = useState(false);

    useEffect(() => {
        if (shouldBounce && !isTurboMode) {
            // Trigger bounce when shouldBounce is true (synced with reel stop sound)
            setIsStopping(true);
            const timer = setTimeout(() => setIsStopping(false), 300);
            return () => clearTimeout(timer);
        } else if (!isSpinning && isTurboMode) {
            // No bounce animation for turbo
            setIsStopping(false);
        }
    }, [shouldBounce, isTurboMode, isSpinning]);

    // Duplicate once for seamless loop without extra work
    const displaySymbols = isSpinning ? [...reelStrip, ...reelStrip] : symbols;
    
    // increased the height at each breakpoint to create more space at the bottom.
    const containerHeightClass = 'h-[228px] sm:h-[360px] md:h-[600px]';

    return (
        <div className={cn("overflow-hidden contain-paint", containerHeightClass)}>
            <div
                className={cn(
                    'flex flex-col gap-2 transform-gpu will-change-transform',
                    isSpinning && 'animate-reel-spin',
                    isStopping && 'animate-reel-bounce'
                )}
                style={{
                    animationDuration: isSpinning ? `3s` : undefined
                } as React.CSSProperties}
            >
                {displaySymbols.slice(0, isSpinning ? reelStrip.length * 2 : NUM_ROWS).map((symbolId, i) => (
                    <SymbolDisplay 
                        key={i} 
                        symbolId={symbolId} 
                        className="h-12 w-12 sm:h-20 sm:w-20 md:h-36 md:w-36"
                        winningLineIndices={winningLineIndicesForColumn[i]}
                    />
                ))}
            </div>
        </div>
    );
}