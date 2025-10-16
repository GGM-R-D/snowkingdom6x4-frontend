import { memo } from 'react';
import Image from 'next/image';
import { SYMBOLS, type SymbolId } from '@/lib/slot-config';
import { cn } from '@/lib/utils';
import { PAYLINE_COLORS } from './winning-lines-display';

interface SymbolDisplayProps {
  symbolId: SymbolId;
  className?: string;
  winningLineIndices?: number[];
}

export const SymbolDisplay = memo(({ symbolId, className, winningLineIndices = [] }: SymbolDisplayProps) => {
  const symbol = SYMBOLS[symbolId];
  if (!symbol) return null; // Return null if symbol is not found
  
  const { image } = symbol;
  const isWinning = winningLineIndices.length > 0;
  
  // Use a different color for winning highlights
  const borderColor = isWinning 
    ? PAYLINE_COLORS[winningLineIndices[0] % PAYLINE_COLORS.length] 
    : undefined;

  return (
    <div
      className={cn(
        'aspect-square w-full h-full flex items-center justify-center bg-black/30 rounded-lg p-2 transition-all duration-300 relative overflow-hidden',
        isWinning && 'border-2 animate-pulse-win',
        className
      )}
      style={{
        borderColor: borderColor,
        boxShadow: isWinning ? `0 0 10px ${borderColor}` : undefined
      }}
    >
      {image ? (
        <Image 
          src={image} 
          alt={symbolId.toLowerCase()} 
          fill
          className="object-cover drop-shadow-lg"
          unoptimized={process.env.NODE_ENV !== 'production'} // Only optimize in production
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white">
          {symbolId}
        </div>
      )}
    </div>
  );
});

SymbolDisplay.displayName = 'SymbolDisplay';