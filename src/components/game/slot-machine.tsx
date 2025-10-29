'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getWinningFeedback } from '@/app/actions';
import type { WinningFeedbackEnhancementOutput } from '@/app/actions';
import { ReelColumn } from './reel-column';
import { ControlPanel } from './control-panel';
import { WinAnimation } from './win-animation';
import { FreeSpinsOverlay } from './free-spins-overlay';
import { WinningLinesDisplay } from './winning-lines-display';
import { AutoplayDialog } from './autoplay-dialog';
import { PaylineNumbers } from './payline-numbers';
import { useToast } from '@/hooks/use-toast';
import useSound from 'use-sound';
import { SOUNDS } from '@/lib/sounds';
import { cn } from '@/lib/utils';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';
import { rgsApi, type GameStartResponse, type GamePlayResponse } from '@/lib/rgs-api';

// Types for API communication
type SymbolId = 
  | 'TEN' | 'JACK' | 'QUEEN' | 'KING' | 'ACE' 
  | 'WOLF' | 'STONE' | 'LEOPARD' | 'DRAGON' 
  | 'CROWN' | 'QUEEN_CARD' | 'WILD' | 'SCATTER';
type WinningLine = {
  paylineIndex: number;
  symbol: SymbolId;
  count: number;
  payout: number;
  line: number[];
};

type SpinResult = {
  totalWin: number;
  winningLines: WinningLine[];
  scatterWin: {
    count: number;
    triggeredFreeSpins: boolean;
  };
  grid: SymbolId[][];
};

type PlayResponse = {
  sessionId: string;
  player: {
    balance: number;
    freeSpinsRemaining: number;
    lastWin: number;
    results: SpinResult;
  };
  game: {
    balance: number;
    freeSpinsRemaining: number;
    lastWin: number;
    results: SpinResult;
  };
  freeSpins: number;
};

// Autoplay types
type AutoplaySettings = {
  numberOfSpins: number;
  stopOnAnyWin: boolean;
  stopOnSingleWinExceeds: number;
  stopOnFeature: boolean;
  stopOnTotalLossExceeds: number;
};

type AutoplayState = {
  isActive: boolean;
  settings: AutoplaySettings | null;
  spinsRemaining: number;
  totalLoss: number;
  originalBalance: number;
};

// Reel strips for spinning animation (from original game)
const REEL_STRIPS: SymbolId[][] = [
  // Reel 1 (34 symbols) - copied from original symbols.ts
  [
    'KING', 'CROWN', 'QUEEN_CARD', 'TEN', 'ACE', 'WOLF', 'STONE', 'QUEEN',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'LEOPARD', 'DRAGON', 'JACK',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'WOLF', 'STONE', 'TEN', 'JACK',
    'QUEEN_CARD', 'KING', 'ACE', 'WILD', 'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'SCATTER'
  ] as SymbolId[],
  // Reel 2
  ['TEN', 'STONE', 'QUEEN', 'KING', 'ACE', 'WOLF', 'STONE', 'QUEEN_CARD',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'LEOPARD', 'DRAGON', 'CROWN',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'WOLF', 'JACK', 'TEN', 'JACK',
    'QUEEN_CARD', 'KING', 'ACE', 'WILD', 'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'SCATTER'
  ] as SymbolId[],
  // Reel 3
  ['WILD', 'ACE', 'WOLF', 'STONE', 'ACE', 'QUEEN_CARD', 'STONE', 'QUEEN',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'LEOPARD', 'DRAGON', 'CROWN',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'WOLF', 'KING', 'TEN', 'JACK',
    'QUEEN_CARD', 'KING', 'JACK', 'WILD', 'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'SCATTER'
  ] as SymbolId[],
  // Reel 4
  ['TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'WOLF', 'STONE', 'QUEEN',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'LEOPARD', 'DRAGON', 'CROWN',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'WOLF', 'STONE', 'TEN', 'JACK',
    'QUEEN_CARD', 'KING', 'ACE', 'WILD', 'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'SCATTER'
  ] as SymbolId[],
  // Reel 5
  ['DRAGON', 'WILD', 'LEOPARD', 'JACK', 'ACE', 'WOLF', 'STONE', 'QUEEN',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'QUEEN_CARD', 'TEN', 'CROWN',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'WOLF', 'STONE', 'TEN', 'JACK',
    'QUEEN_CARD', 'KING', 'ACE', 'KING', 'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'SCATTER'
  ] as SymbolId[],
  // Reel 6
  ['JACK', 'SCATTER', 'KING', 'QUEEN_CARD', 'ACE', 'WOLF', 'STONE', 'QUEEN',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'LEOPARD', 'DRAGON', 'CROWN',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'WOLF', 'STONE', 'TEN', 'JACK',
    'QUEEN_CARD', 'KING', 'ACE', 'WILD', 'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'TEN'
  ] as SymbolId[]
];

// Game constants (these could eventually come from the backend)
const NUM_REELS = 6;
const NUM_ROWS = 4;
const BET_AMOUNTS = [1, 2, 3, 5];
const FREE_SPINS_AWARDED = 10;


// Generate initial grid (for visual purposes only)
const generateInitialGrid = (): SymbolId[][] =>
  Array(NUM_REELS).fill(null).map(() => Array(NUM_ROWS).fill('TEN'));

export function SlotMachine() {
  const [grid, setGrid] = useState<SymbolId[][]>(generateInitialGrid);
  useEffect(() => {
    // Now we can safely randomize the grid on the client
    setGrid(
      Array(NUM_REELS)
        .fill(null)
        .map((_, reelIndex) =>
          Array(NUM_ROWS)
            .fill(null)
            .map(() => {
              const reelStrip = REEL_STRIPS[reelIndex];
              return reelStrip[Math.floor(Math.random() * reelStrip.length)];
            })
        )
    );
  }, []);
  const [spinningReels, setSpinningReels] = useState<boolean[]>(Array(NUM_REELS).fill(false));
  const [balance, setBalance] = useState(1000);
  const [betAmount, setBetAmount] = useState(BET_AMOUNTS[0]);
  const [lastWin, setLastWin] = useState(0);
  const [winningLines, setWinningLines] = useState<WinningLine[]>([]);
  const [winningFeedback, setWinningFeedback] = useState<WinningFeedbackEnhancementOutput | null>(null);
  const { toast } = useToast();
  const [sessionId, setSessionId] = useState<string>('');
  const [freeSpinsActivated, setFreeSpinsActivated] = useState(false);
  const [showFreeSpinsOverlay, setShowFreeSpinsOverlay] = useState<{show: boolean; count: number; winAmount?: number; winningSymbols?: string[]; isComplete?: boolean; totalWin?: number}>({ show: false, count: 0 });
  const [hasShownGlowForCurrentFreeSpins, setHasShownGlowForCurrentFreeSpins] = useState(false);
  const [previousFreeSpinsRemaining, setPreviousFreeSpinsRemaining] = useState(0);

  const [freeSpinsRemaining, setFreeSpinsRemaining] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [isSfxEnabled, setIsSfxEnabled] = useState(true);
  const [volume, setVolume] = useState(50);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [isTurboMode, setIsTurboMode] = useState(false);
  const [bouncingReels, setBouncingReels] = useState<boolean[]>(Array(NUM_REELS).fill(false));
  
  // Autoplay state
  const [autoplayState, setAutoplayState] = useState<AutoplayState>({
    isActive: false,
    settings: null,
    spinsRemaining: 0,
    totalLoss: 0,
    originalBalance: 0,
  });
  const [showAutoplayDialog, setShowAutoplayDialog] = useState(false);
  const isFreeSpinsMode = useMemo(() => freeSpinsRemaining > 0, [freeSpinsRemaining]);

  // Initialize game session
  useEffect(() => {
    const initializeGame = async () => {
      try {
        const startResponse = await rgsApi.startGame({
          languageId: 'en',
          client: 'desktop',
          funMode: 1, // Demo mode
        });
        
        if (startResponse.statusCode === 6000) {
          setSessionId(startResponse.player.sessionId);
          setBalance(startResponse.player.balance);
          setFreeSpinsRemaining(startResponse.game.freeSpins.left);
          setPreviousFreeSpinsRemaining(startResponse.game.freeSpins.left);
        }
      } catch (error) {
        console.error('Failed to initialize game:', error);
        toast({
          title: "Connection Error",
          description: "Failed to connect to game server. Please refresh the page.",
          variant: "destructive",
        });
      }
    };

    initializeGame();
  }, [toast]);

  const soundConfig = useMemo(() => ({
    soundEnabled: isSfxEnabled,
    volume: volume / 100, // Convert 0-100 to 0-1
  }), [isSfxEnabled, volume]);

  const musicConfig = useMemo(() => ({
    soundEnabled: isMusicEnabled,
    volume: volume / 100, // Convert 0-100 to 0-1
  }), [isMusicEnabled, volume]);

  const [playBgMusic, { stop: stopBgMusic }] = useSound(SOUNDS.background, {
    ...musicConfig,
    loop: true
  });
  const [playSpinSound, { stop: stopSpinSound }] = useSound(SOUNDS.spin, {
    ...soundConfig,
    loop: false,
  });
  const [playReelStopSound] = useSound(SOUNDS.reelStop, { ...soundConfig, loop: false });
  const [playWinSound] = useSound(SOUNDS.win, soundConfig);
  const [playBigWinSound] = useSound(SOUNDS.bigWin, soundConfig);
  const [playFreeSpinsTriggerSound] = useSound(SOUNDS.featureTrigger, soundConfig);
  const [playClickSound] = useSound(SOUNDS.click, soundConfig);
  const [playFreeSpinsMusic, { stop: stopFreeSpinsMusic }] = useSound(SOUNDS.freeSpinsMusic, {
    ...musicConfig,
    loop: true
  });
  

 useEffect(() => {
    // If music is disabled, stop all music.
    if (!isMusicEnabled) {
      stopBgMusic();
      stopFreeSpinsMusic();
      return;
    }

    // If in free spins mode, play the free spins music.
    // Otherwise, play the normal background music.
    if (isFreeSpinsMode) {
      stopBgMusic();
      playFreeSpinsMusic();
    } else {
      stopFreeSpinsMusic();
      playBgMusic();
    }

    // Cleanup function to stop all music when the component is no longer on screen.
    return () => {
      stopBgMusic();
      stopFreeSpinsMusic();
    };
  }, [isFreeSpinsMode, isMusicEnabled, playBgMusic, stopBgMusic, playFreeSpinsMusic, stopFreeSpinsMusic]);

  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    setIsMusicEnabled(!newMutedState);
    setIsSfxEnabled(!newMutedState);
  };

  const toggleMusic = () => {
    setIsMusicEnabled(!isMusicEnabled);
  };

  const toggleSfx = () => {
    setIsSfxEnabled(!isSfxEnabled);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
  };

  const isSpinning = useMemo(() => spinningReels.some(s => s), [spinningReels]);

  // Stabilize win animation callbacks to prevent re-runs of child effects
  const handleWinAnimationComplete = useCallback(() => {
    setWinningFeedback(null);
    // Don't clear winning lines - let them persist until next spin
  }, []);

  const handleWinCountComplete = useCallback((amount: number) => {
    // Update control panel only when counting finishes
    setLastWin(amount);
  }, []);

  const handleIncreaseBet = () => {
    if (isFreeSpinsMode) return;
    playClickSound();
    const currentIndex = BET_AMOUNTS.indexOf(betAmount);
    const nextIndex = (currentIndex + 1) % BET_AMOUNTS.length;
    setBetAmount(BET_AMOUNTS[nextIndex]);
  };

  const handleDecreaseBet = () => {
    if (isFreeSpinsMode) return;
    playClickSound();
    const currentIndex = BET_AMOUNTS.indexOf(betAmount);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : BET_AMOUNTS.length - 1;
    setBetAmount(BET_AMOUNTS[prevIndex]);
  };

  const handleToggleAutoSpin = () => {
    playClickSound();
    setIsAutoSpin(prev => !prev);
  };

  const handleToggleTurbo = () => {
    playClickSound();
    setIsTurboMode(prev => !prev);
  };

  // Autoplay functions
  const startAutoplay = (settings: AutoplaySettings) => {
    setAutoplayState({
      isActive: true,
      settings,
      spinsRemaining: settings.numberOfSpins,
      totalLoss: 0,
      originalBalance: balance,
    });
    setIsAutoSpin(true);
    toast({
      title: "Autoplay Started",
      description: `${settings.numberOfSpins} spins will be executed automatically.`,
    });
  };

  const stopAutoplay = () => {
    setAutoplayState({
      isActive: false,
      settings: null,
      spinsRemaining: 0,
      totalLoss: 0,
      originalBalance: 0,
    });
    setIsAutoSpin(false);
    toast({
      title: "Autoplay Stopped",
      description: "Automatic spinning has been stopped.",
    });
  };

  const checkAutoplayStopConditions = (spinResult: SpinResult): boolean => {
    if (!autoplayState.isActive || !autoplayState.settings) return false;
    
    const { settings } = autoplayState;
    
    // Stop if any win and setting is enabled
    if (settings.stopOnAnyWin && spinResult.totalWin > 0) {
      return true;
    }
    
    // Stop if single win exceeds threshold
    if (spinResult.totalWin > settings.stopOnSingleWinExceeds) {
      return true;
    }
    
    // Stop on feature (free spins)
    if (settings.stopOnFeature && spinResult.scatterWin.triggeredFreeSpins) {
      return true;
    }
    
    // Stop if total loss exceeds threshold
    const currentLoss = autoplayState.originalBalance - balance;
    if (currentLoss > settings.stopOnTotalLossExceeds) {
      return true;
    }
    
    return false;
  };

      const spin = useCallback(async () => {
          if (isSpinning) return;
          // Add this block to activate free spins on the first click
            if (isFreeSpinsMode && !freeSpinsActivated) {
              setFreeSpinsActivated(true);
              // Hide free spins overlay when free spins actually start
              setShowFreeSpinsOverlay({ show: false, count: 0 });
              // Mark glow as shown for this free spins session
              setHasShownGlowForCurrentFreeSpins(true);
            }

          // Check balance on frontend for quick response
          if (balance < betAmount && freeSpinsRemaining === 0) {
              toast({
                  variant: "destructive",
                  title: "Insufficient Balance",
                  description: "You don't have enough balance to place that bet.",
              });
              return;
          }

          // Hide free spins overlay when spinning starts
          setShowFreeSpinsOverlay({ show: false, count: 0 });
          
          stopSpinSound();
          playSpinSound();

          // Start spinning animation
          setLastWin(0);
          setWinningLines([]);
          setWinningFeedback(null); // Clear any existing win animation

          // Asynchronously start reels one by one to ensure staggering
          const startDelay = isTurboMode ? 0 : 10; // Turbo: instant, Normal: 10ms between reels
          const startReelsSequentially = async () => {
          for (let i = 0; i < NUM_REELS; i++) {
          setSpinningReels(prev => {
          const newSpinning = [...prev];
          newSpinning[i] = true;
         return newSpinning;
           });
         await new Promise(resolve => setTimeout(resolve, startDelay));
          }
      };

           // Start the reel animation without waiting for it to finish
           startReelsSequentially();
           
           // Track when spinning started for minimum spin duration
           const spinStartTime = Date.now();

          try {
              // Call RGS API
              const data: GamePlayResponse = await rgsApi.playGame({
                  sessionId: sessionId,
                  bets: [{ amount: betAmount }],
                  bet: betAmount,
                  mode: isFreeSpinsMode ? 1 : 0, // 1 for free spins, 0 for normal play
              });

              if (data.statusCode !== 6000) {
                  throw new Error(data.message || 'Game play failed');
              }

              const newGrid = data.game.results.grid;
              const newWinningLines = data.game.results.winningLines;

              // DO NOT set winning lines here. We will do it after the reels stop.
              // setWinningLines(newWinningLines); // <-- This was the problem line

              // Ensure minimum spin time so animation looks good
              const minSpinTime = isTurboMode ? 200 : 600; // Turbo: 200ms, Normal: 600ms minimum
              const elapsedTime = Date.now() - spinStartTime;
              const remainingTime = Math.max(0, minSpinTime - elapsedTime);
              
              if (remainingTime > 0) {
                await new Promise(resolve => setTimeout(resolve, remainingTime));
              }

              // Animate reels stopping one by one
              const stopBaseDelay = isTurboMode ? 5 : 40; // Turbo: 5ms, Normal: 40ms
              const stopIncrementDelay = isTurboMode ? 2 : 20; // Turbo: 2ms, Normal: 20ms  
              const gridUpdateDelay = isTurboMode ? 2 : 20; // Turbo: 2ms, Normal: 20ms
              
              for (let i = 0; i < NUM_REELS; i++) {
                  await new Promise(resolve => setTimeout(resolve, stopBaseDelay + i * stopIncrementDelay));

                  // Update grid FIRST, then stop spinning animation
                  setGrid(prevGrid => {
                      const updatedGrid = [...prevGrid];
                      updatedGrid[i] = newGrid[i];
                      return updatedGrid;
                  });

                  // Small delay to ensure grid update completes
                  await new Promise(resolve => setTimeout(resolve, gridUpdateDelay));

                  playReelStopSound();
                  
                  // Trigger bounce animation for this reel (synced with sound)
                  setBouncingReels(prev => {
                      const newBouncing = [...prev];
                      newBouncing[i] = true;
                      return newBouncing;
                  });
                  
                  // Reset bounce after animation
                  setTimeout(() => {
                      setBouncingReels(prev => {
                          const newBouncing = [...prev];
                          newBouncing[i] = false;
                          return newBouncing;
                      });
                  }, 300);
                  setSpinningReels(prev => {
                      const newSpinning = [...prev];
                      newSpinning[i] = false;
                      return newSpinning;
                  });
              }

              // *** FIX APPLIED HERE ***
              // Now that all reels have visually stopped, we can reveal the winning lines.
              // This is the perfect time to trigger the animations.
              stopSpinSound();

              if (data.game.results.scatterWin.triggeredFreeSpins) {
               const scatterLine: WinningLine = {
               paylineIndex: -1, // Special index for non-payline wins
               symbol: 'SCATTER',
               count: data.game.results.scatterWin.count,
               payout: 0, // The reward is the free spins, not a direct payout
               line: [], // Not used for scatters, but the type requires it
              };
               // Add our special scatter line to the list of lines to be animated
                 newWinningLines.push(scatterLine);
            }

              setWinningLines(newWinningLines);
              
                // Update state from RGS response
              setBalance(data.player.balance);
              
              // Check if free spins just ended using backend data
              // All logic comes from backend: data.freeSpins.left and data.freeSpins.totalWin
              // Frontend only detects the transition from having free spins to none
              const freeSpinsJustEnded = freeSpinsRemaining > 0 && data.freeSpins.left === 0;
              
              setPreviousFreeSpinsRemaining(freeSpinsRemaining);
              setFreeSpinsRemaining(data.freeSpins.left);
              
              // Don't update lastWin yet - wait for counter animation to finish
              // setLastWin(data.player.win);

              await new Promise(resolve => setTimeout(resolve, 100));
              
              // Handle free spins completion
              if (freeSpinsJustEnded) {
                  setShowFreeSpinsOverlay({ 
                    show: true, 
                    count: 0,
                    isComplete: true,
                    totalWin: data.freeSpins.totalWin || 0
                  });
                  return data.game.results; // Return early to prevent other overlays
              }

              // Handle free spins trigger
              if (data.game.results.scatterWin.triggeredFreeSpins) {
                  playFreeSpinsTriggerSound();
                  
                  // Get winning symbols for the combined message
                  const winningSymbols = [...new Set(newWinningLines.map((l: WinningLine) => l.symbol))] as string[];
                  
                  // Show combined free spins + win message
                  setShowFreeSpinsOverlay({ 
                    show: true, 
                    count: FREE_SPINS_AWARDED,
                    winAmount: data.player.win,
                    winningSymbols: winningSymbols
                  });
                  setHasShownGlowForCurrentFreeSpins(false); // Reset glow state for new free spins
              } else {
                  // Handle wins only when free spins are NOT triggered
                  if (data.player.win > 0) {
                      if (data.player.win > betAmount * 5) {
                          playBigWinSound();
                      } else {
                          playWinSound();
                      }

                      // Get winning feedback for win animation
                      const winningSymbols = [...new Set(newWinningLines.map((l: WinningLine) => l.symbol))] as string[];
                      const feedback = await getWinningFeedback({
                          winAmount: data.player.win,
                          winningSymbols: winningSymbols,
                          betAmount: betAmount
                      });
                      setWinningFeedback(feedback);
                  }
              }

              // Return spin result for autoplay logic
              return data.game.results;

          } catch (error) {
              console.error("Failed to fetch spin result:", error);
              toast({
                  variant: "destructive",
                  title: "Connection Error",
                  description: error instanceof Error ? error.message : "Failed to connect to game server",
              });
              setSpinningReels(Array(NUM_REELS).fill(false));
              stopSpinSound();
              return null; // Return null for failed spins
          }
      }, [isSpinning, balance, betAmount, freeSpinsRemaining, toast, playSpinSound, stopSpinSound, playReelStopSound, playWinSound, playBigWinSound, playFreeSpinsTriggerSound, sessionId, isTurboMode]);
        
  // Autoplay effect - handles automatic spinning with stop conditions
  useEffect(() => {
    if (!autoplayState.isActive || !autoplayState.settings) return;
    
    if (autoplayState.spinsRemaining <= 0) {
      stopAutoplay();
      return;
    }
    
    if (!isSpinning && !winningFeedback) {
      const timer = setTimeout(() => {
        spin().then((spinResult) => {
          if (spinResult && checkAutoplayStopConditions(spinResult)) {
            stopAutoplay();
            return;
          }
          
          // Decrement spins remaining
          setAutoplayState(prev => ({
            ...prev,
            spinsRemaining: prev.spinsRemaining - 1,
          }));
        });
      }, 1000); // 1 second delay between spins
      
      return () => clearTimeout(timer);
    }
  }, [autoplayState, isSpinning, winningFeedback, spin]);
        
       useEffect(() => {
     // Only run auto-spins if the feature has been activated by the user
     // Also check that win animation is not playing and overlay is not showing
     if (freeSpinsRemaining > 0 && freeSpinsActivated && !isSpinning && !winningFeedback && !showFreeSpinsOverlay.show) {
       const timer = setTimeout(() => {
         spin();
       }, 2000); // 2-second delay between auto-spins
       return () => clearTimeout(timer);
     }
   }, [freeSpinsRemaining, freeSpinsActivated, isSpinning, winningFeedback, showFreeSpinsOverlay.show, spin]);

  // Auto spin logic - similar to free spins but for regular gameplay
  useEffect(() => {
    // Only run auto-spins if auto spin is enabled and not in free spins mode
    // Also check that win animation is not playing
    if (isAutoSpin && !isFreeSpinsMode && !isSpinning && !winningFeedback && balance >= betAmount) {
      const timer = setTimeout(() => {
        spin();
      }, 2000); // 2-second delay between auto-spins
      return () => clearTimeout(timer);
    }
  }, [isAutoSpin, isFreeSpinsMode, isSpinning, winningFeedback, balance, betAmount, spin]);

  // Disable auto spin when balance is insufficient or when free spins are triggered
  useEffect(() => {
    if (isAutoSpin && (balance < betAmount || isFreeSpinsMode)) {
      setIsAutoSpin(false);
    }
  }, [isAutoSpin, balance, betAmount, isFreeSpinsMode]);

  // Add this new useEffect
      useEffect(() => {
        // Reset the activation state when the free spins counter reaches zero
        if (freeSpinsRemaining === 0) {
          setFreeSpinsActivated(false);
        }
      }, [freeSpinsRemaining]);

  // For spinning reels, show the reel strip for animation (matching original behavior)
  const getReelSymbols = (reelIndex: number) => {
    if (spinningReels[reelIndex]) {
      // Return the full reel strip for spinning animation (original behavior)
      return REEL_STRIPS[reelIndex];
    }
    return grid[reelIndex];
  };

  const getWinningLineIndices = (reelIndex: number, rowIndex: number): number[] => {
    if (winningLines.length === 0) return [];

    return winningLines.reduce((acc, line, lineIndex) => {
      if (line.paylineIndex !== -1 && line.line[reelIndex] === rowIndex && (reelIndex < line.count)) {
        acc.push(line.paylineIndex);
      }
      else if (line.paylineIndex === -1) {
        const gridSymbol = grid[reelIndex][rowIndex];
        if (gridSymbol === line.symbol) {
          acc.push(10);
        }
      }
      return acc;
    }, [] as number[]);
  };

  return (
    <>
    <div className="flex flex-col items-center justify-start py-2">
      <h1 className="frosted-title text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-headline uppercase tracking-wider font-bold leading-tight mb-1 w-full max-w-6xl text-center">
        FROSTY FORTUNES
      </h1>

      <div className={`flex flex-col items-center gap-1 p-1 rounded-2xl bg-card/50 border-2 md:border-4 shadow-2xl w-full max-w-6xl relative mb-1 ${
        isFreeSpinsMode && !hasShownGlowForCurrentFreeSpins
          ? `free-spins-border border-yellow-400 ${isSpinning ? 'spinning' : ''}` 
          : isFreeSpinsMode 
            ? 'border-yellow-400'
            : 'border-primary/50'
      }`}>
      <div className="relative w-full flex justify-center">
        <PaylineNumbers 
          winningLines={winningLines} 
          isSpinning={isSpinning}
        >
          <div className="grid grid-cols-6 gap-px p-2 bg-black/30 rounded-lg relative">
            {Array.from({ length: NUM_REELS }).map((_, i) => (
              <ReelColumn
                key={i}
                symbols={getReelSymbols(i)}
                isSpinning={spinningReels[i]}
                reelIndex={i}
                winningLineIndicesForColumn={
                  Array(NUM_ROWS).fill(0).map((_, j) => getWinningLineIndices(i, j))
                }
                isTurboMode={isTurboMode}
                shouldBounce={bouncingReels[i]}
              />
            ))}
            
            {!isSpinning && winningLines.length > 0 && <WinningLinesDisplay winningLines={winningLines.filter(l => l.paylineIndex !== -1)} />}
          </div>
        </PaylineNumbers>
      </div>

      {winningFeedback && (
        <WinAnimation
          feedback={winningFeedback}
          onAnimationComplete={handleWinAnimationComplete}
          onCountComplete={handleWinCountComplete}
        />
      )}
      </div>
    </div>

    <ControlPanel
      betAmount={betAmount}
      balance={balance}
      lastWin={lastWin}
      isSpinning={isSpinning}
      onSpin={spin}
      onIncreaseBet={handleIncreaseBet}
      onDecreaseBet={handleDecreaseBet}
      freeSpinsRemaining={freeSpinsRemaining}
      isFreeSpinsMode={isFreeSpinsMode}
      freeSpinsActivated={freeSpinsActivated}
      isAutoSpin={isAutoSpin}
      onToggleAutoSpin={handleToggleAutoSpin}
      isTurboMode={isTurboMode}
      onToggleTurbo={handleToggleTurbo}
      isMusicEnabled={isMusicEnabled}
      onToggleMusic={toggleMusic}
      isSfxEnabled={isSfxEnabled}
      onToggleSfx={toggleSfx}
      volume={volume}
      onVolumeChange={handleVolumeChange}
      autoplayState={autoplayState}
      onStartAutoplay={startAutoplay}
      onStopAutoplay={stopAutoplay}
      onShowAutoplayDialog={() => setShowAutoplayDialog(true)}
    />

    {showFreeSpinsOverlay.show && (
      <FreeSpinsOverlay
        count={showFreeSpinsOverlay.count}
        onClose={() => setShowFreeSpinsOverlay({ show: false, count: 0 })}
        winAmount={showFreeSpinsOverlay.winAmount}
        winningSymbols={showFreeSpinsOverlay.winningSymbols}
        isComplete={showFreeSpinsOverlay.isComplete}
        totalWin={showFreeSpinsOverlay.totalWin}
      />
    )}

    <AutoplayDialog
      isOpen={showAutoplayDialog}
      onClose={() => setShowAutoplayDialog(false)}
      onStartAutoplay={startAutoplay}
      currentBalance={balance}
      currentBet={betAmount}
    />
    </>
  );
}

