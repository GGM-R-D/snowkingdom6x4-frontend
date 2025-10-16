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
}

export function ReelColumn({ symbols, isSpinning, reelIndex, winningLineIndicesForColumn }: ReelColumnProps) {
    const reelStrip = REEL_STRIPS[reelIndex];
    const [isStopping, setIsStopping] = useState(false);

    useEffect(() => {
        if (!isSpinning) {
            setIsStopping(true);
            const timer = setTimeout(() => setIsStopping(false), 500); // Duration of the bounce animation
            return () => clearTimeout(timer);
        }
    }, [isSpinning]);

    // By duplicating the reel strip, we create a seamless loop for the animation.
    const displaySymbols = isSpinning ? [...reelStrip, ...reelStrip, ...reelStrip.slice(0, NUM_ROWS)] : symbols;
    
    const containerHeightClass = 'h-[220px] sm:h-[352px] md:h-[592px]';

    return (
        <div className={cn("overflow-hidden", containerHeightClass)}>
            <div
                className={cn(
                    'flex flex-col gap-2',
                    isSpinning && 'animate-reel-spin',
                    isStopping && 'animate-reel-bounce'
                )}
                style={{
                    animationDuration: isSpinning ? `0.2s` : undefined
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
