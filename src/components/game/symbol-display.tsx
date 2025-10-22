'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { SYMBOLS, type SymbolId } from '@/lib/symbols'; // Corrected import path
import { cn } from '@/lib/utils';
import { PAYLINE_COLORS } from './winning-lines-display';

interface SymbolDisplayProps {
  symbolId: SymbolId;
  className?: string;
  winningLineIndices?: number[];
}

export function SymbolDisplay({ symbolId, className, winningLineIndices = [] }: SymbolDisplayProps) {
  const symbol = SYMBOLS[symbolId];
  const videoRef = useRef<HTMLVideoElement>(null);
  
  const isWinning = winningLineIndices.length > 0;
  
  useEffect(() => {
    // When the symbol becomes winning, play the video from the beginning
    if (isWinning && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(error => {
        // Autoplay can sometimes be blocked by the browser, log error if it happens
        console.error("Video play failed:", error);
      });
    }
  }, [isWinning]);

  if (!symbol) {
    return null;
  }
  
  // Conditionally render the video if the symbol is winning AND has a video defined
  const shouldPlayVideo = isWinning && symbol.video;

  // Determine border color for winning symbols
  const borderColor = isWinning 
    ? PAYLINE_COLORS[winningLineIndices[0] % PAYLINE_COLORS.length] 
    : undefined;

  return (
    <div
      className={cn(
        'aspect-square w-full h-full flex items-center justify-center bg-black/30 rounded-lg p-2 transition-all duration-300 relative overflow-hidden',
        // Apply border and shadow styles directly
        isWinning && 'border-2',
        // Use the fallback pulse animation ONLY if a video isn't playing
        isWinning && !shouldPlayVideo && 'animate-pulse-win',
        className
      )}
      style={{
        borderColor: borderColor,
        boxShadow: isWinning ? `0 0 10px ${borderColor}` : undefined
      }}
    >
      {/* The video element - rendered only when it should play */}
      {shouldPlayVideo && (
        <video
          ref={videoRef}
          src={symbol.video}
          muted     // Muted is crucial for autoplay
          playsInline // Important for iOS
          className="absolute top-0 left-0 w-full h-full object-cover z-10"
        />
      )}

      {/* The static image - always present */}
      {symbol.image ? (
        <Image 
          src={symbol.image} 
          alt={symbolId.toLowerCase()} 
          fill
          sizes="(max-width: 640px) 48px, (max-width: 768px) 80px, 144px"
          className={cn(
            "object-cover drop-shadow-lg transition-opacity duration-300",
            // If a video is playing, the image is hidden; otherwise, it's visible.
            shouldPlayVideo ? 'opacity-0' : 'opacity-100'
          )}
          unoptimized={process.env.NODE_ENV !== 'production'}
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white">
          {symbolId}
        </div>
      )}
    </div>
  );
}

SymbolDisplay.displayName = 'SymbolDisplay';