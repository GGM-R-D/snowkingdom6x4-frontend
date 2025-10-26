'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';

interface ImageSequenceAnimationProps {
  symbolId: string;
  isPlaying: boolean;
  duration?: number; // Duration in seconds for one complete cycle
  className?: string;
}

export function ImageSequenceAnimation({ 
  symbolId, 
  isPlaying, 
  duration = 1.5, 
  className 
}: ImageSequenceAnimationProps) {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationRef = useRef<number>();
  const startTimeRef = useRef<number>();
  
  const totalFrames = 72;
  const fps = 24; // 24 frames per second for 3-second duration
  
  const animate = useCallback((currentTime: number) => {
    if (!startTimeRef.current) return;
    
    const elapsed = (currentTime - startTimeRef.current) / 1000; // Convert to seconds
    const progress = (elapsed / duration) % 1; // Use modulo to loop continuously
    const frame = Math.floor(progress * totalFrames);
    
    // Convert 0-71 range to 1-72 range
    const adjustedFrame = frame + 1;
    
    // Debug: Log every 10th frame to see progression
    if (adjustedFrame % 10 === 0 || adjustedFrame <= 5) {
      console.log(`${symbolId}: Frame ${adjustedFrame}, elapsed: ${elapsed.toFixed(2)}s, progress: ${progress.toFixed(3)}`);
    }
    
    setCurrentFrame(adjustedFrame);
    
    // Continue animating - don't check isPlaying here to avoid recreation
    animationRef.current = requestAnimationFrame(animate);
  }, [duration, symbolId]);
  
  useEffect(() => {
    if (isPlaying && !isAnimating) {
      console.log(`${symbolId}: Starting animation`);
      setIsAnimating(true);
      setCurrentFrame(1);
      startTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(animate);
    } else if (!isPlaying && isAnimating) {
      console.log(`${symbolId}: Stopping animation`);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setIsAnimating(false);
      setCurrentFrame(0);
    }
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, symbolId]);
  
  // Generate the image path for the current frame
  const getImagePath = (frame: number) => {
    // Frame numbers start from 1, not 0, and don't need padding
    const frameNumber = frame;
    
    // Map symbol IDs to their correct folder names
    const getFolderName = (id: string) => {
      const folderMap: Record<string, string> = {
        'JACK': 'J',
        'QUEEN_CARD': 'Q', 
        'KING': 'K',
        'ACE': 'A',
        'TEN': '10',
        'WILD': 'Wild',
        'SCATTER': 'Scatter',
        'CROWN': 'Crown',
        'DRAGON': 'Dragon',
        'LEOPARD': 'Leopard',
        'QUEEN': 'Queen',
        'STONE': 'Stone',
        'WOLF': 'Wolf'
      };
      return folderMap[id] || id;
    };
    
    const folderName = getFolderName(symbolId);
    return `/animations/${folderName}/${folderName}_${frameNumber}.png`;
  };
  
  if (!isPlaying || !isAnimating) {
    return null;
  }
  
  return (
    <div className={`absolute inset-0 z-20 ${className}`}>
        <Image
          key={`${symbolId}-${currentFrame}`}
          src={getImagePath(currentFrame)}
          alt={`${symbolId} animation frame ${currentFrame}`}
          fill
          className="object-cover"
          unoptimized
          priority
        />
    </div>
  );
}
