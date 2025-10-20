'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { getWinningFeedback } from '@/app/actions';
import type { WinningFeedbackEnhancementOutput } from '@/app/actions';
import { ReelColumn } from './reel-column';
import { ControlPanel } from './control-panel';
import { WinAnimation } from './win-animation';
import { WinningLinesDisplay } from './winning-lines-display';
import { useToast } from '@/hooks/use-toast';
import useSound from 'use-sound';
import { SOUNDS } from '@/lib/sounds';
import { cn } from '@/lib/utils';
import { useBackgroundMusic } from '@/hooks/useBackgroundMusic';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';

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
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  const [freeSpinsRemaining, setFreeSpinsRemaining] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const isFreeSpinsMode = useMemo(() => freeSpinsRemaining > 0, [freeSpinsRemaining]);

  const soundConfig = {
    soundEnabled: !isMuted,
    volume: 0.3,
  };

  const [playBgMusic, { stop: stopBgMusic }] = useSound(SOUNDS.background, {
    ...soundConfig,
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
  

  useEffect(() => {
    if (!isMuted) {
      playBgMusic();
    }
    return () => {
      stopBgMusic();
    };
  }, [playBgMusic, stopBgMusic, isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const isSpinning = useMemo(() => spinningReels.some(s => s), [spinningReels]);

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

      const spin = useCallback(async () => {
          if (isSpinning) return;

          // Check balance on frontend for quick response
          if (balance < betAmount && freeSpinsRemaining === 0) {
              toast({
                  variant: "destructive",
                  title: "Insufficient Balance",
                  description: "You don't have enough balance to place that bet.",
              });
              return;
          }

          stopSpinSound();
          playSpinSound();

          // Start spinning animation
          setLastWin(0);
          setWinningLines([]);
          setWinningFeedback(null);

          // Stagger the start of each reel's spin
          for (let i = 0; i < NUM_REELS; i++) {
            setTimeout(() => {
              setSpinningReels(prev => {
                const newSpinning = [...prev];
                newSpinning[i] = true;
                return newSpinning;
              });
            }, i * 50); // 500ms delay between each reel
          }

          try {
              // Call backend API
              const response = await fetch('http://localhost:5047/play', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      sessionId: sessionId,
                      betAmount: betAmount,
                  }),
              });

              if (!response.ok) {
                  const errorData = await response.json().catch(() => ({}));
                  console.error('API Error Response:', errorData);
                  throw new Error(errorData.Error || `HTTP error! status: ${response.status}`);
              }

              const data: PlayResponse = await response.json();
              
              

              const newGrid = data.game.results.grid;
              const newWinningLines = data.game.results.winningLines;

              // DO NOT set winning lines here. We will do it after the reels stop.
              // setWinningLines(newWinningLines); // <-- This was the problem line

              // Animate reels stopping one by one
              for (let i = 0; i < NUM_REELS; i++) {
                  await new Promise(resolve => setTimeout(resolve, 250 + i * 50));

                  // Update grid FIRST, then stop spinning animation
                  setGrid(prevGrid => {
                      const updatedGrid = [...prevGrid];
                      updatedGrid[i] = newGrid[i];
                      return updatedGrid;
                  });

                  // Small delay to ensure grid update completes
                  await new Promise(resolve => setTimeout(resolve, 50));

                  playReelStopSound();
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
              setWinningLines(newWinningLines);
              
                // Update state from backend response
              setBalance(data.player.balance);
              setFreeSpinsRemaining(data.player.freeSpinsRemaining);
              setLastWin(data.player.lastWin);

              await new Promise(resolve => setTimeout(resolve, 100));

              // Handle free spins trigger
              if (data.game.results.scatterWin.triggeredFreeSpins) {
                  playFreeSpinsTriggerSound();
                  toast({
                      title: "Free Spins Triggered!",
                      description: `You won ${FREE_SPINS_AWARDED} free spins!`,
                      duration: 5000,
                  });
              }

              // Handle wins (This logic is already in the correct place)
              if (data.player.lastWin > 0) {
                  if (data.player.lastWin > betAmount * 5) {
                      playBigWinSound();
                  } else {
                      playWinSound();
                  }

                  // Get winning feedback for win animation
                  const winningSymbols = [...new Set(newWinningLines.map(l => l.symbol))];
                  const feedback = await getWinningFeedback({
                      winAmount: data.player.lastWin,
                      winningSymbols: winningSymbols,
                      betAmount: betAmount
                  });
                  setWinningFeedback(feedback);
              }

          } catch (error) {
              console.error("Failed to fetch spin result:", error);
              toast({
                  variant: "destructive",
                  title: "Connection Error",
                  description: error instanceof Error ? error.message : "Failed to connect to game server",
              });
              setSpinningReels(Array(NUM_REELS).fill(false));
              stopSpinSound();
          }
      }, [isSpinning, balance, betAmount, freeSpinsRemaining, toast, playSpinSound, stopSpinSound, playReelStopSound, playWinSound, playBigWinSound, playFreeSpinsTriggerSound, sessionId]);
  useEffect(() => {
    if (freeSpinsRemaining > 0 && !isSpinning) {
      const timer = setTimeout(() => {
        spin();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [freeSpinsRemaining, isSpinning, spin]);

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
    <div className="flex flex-col items-center gap-2 md:gap-4 p-2 md:p-4 rounded-2xl bg-card/50 border-2 md:border-4 border-primary/50 shadow-2xl w-full max-w-6xl relative">
      <div className="absolute top-2 right-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="rounded-full w-10 h-10 p-2 bg-black/50 hover:bg-black/70 transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <VolumeX className="w-6 h-6 text-white" />
          ) : (
            <Volume2 className="w-6 h-6 text-white" />
          )}
        </Button>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-6xl font-headline text-accent tracking-wider drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
        FROSTY FORTUNES
      </h1>

      <div className="relative w-full flex justify-center">
        <div className="grid grid-cols-6 gap-2 p-2 bg-black/30 rounded-lg relative">
          {Array.from({ length: NUM_REELS }).map((_, i) => (
            <ReelColumn
              key={i}
              symbols={getReelSymbols(i)}
              isSpinning={spinningReels[i]}
              reelIndex={i}
              winningLineIndicesForColumn={
                Array(NUM_ROWS).fill(0).map((_, j) => getWinningLineIndices(i, j))
              }
            />
          ))}
          {!isSpinning && winningLines.length > 0 && <WinningLinesDisplay winningLines={winningLines.filter(l => l.paylineIndex !== -1)} />}
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
      />

      {winningFeedback && (
        <WinAnimation
          feedback={winningFeedback}
          onAnimationComplete={() => {
            setWinningFeedback(null);
            if (!isFreeSpinsMode) setWinningLines([]);
          }}
        />
      )}
    </div>
  );
}

