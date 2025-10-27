// Import the new symbols configuration
import { SYMBOLS, REEL_STRIPS, SCATTER_SYMBOL, type SymbolId } from './symbols';

export { SYMBOLS, REEL_STRIPS, SCATTER_SYMBOL, type SymbolId };

export const NUM_REELS = 6;
export const NUM_ROWS = 4;
export const BET_AMOUNTS = [1, 2, 3, 5];
export const FREE_SPINS_AWARDED = 10;

// Paylines are defined by the row index (0, 1, 2 or 3) for each of the 6 reels.
export const PAYLINES: number[][] = [
  [0, 0, 0, 0, 0, 0], // Line 1: Top row (was Line 3)
  [1, 1, 1, 1, 1, 1], // Line 2: Second row (was Line 1)
  [2, 2, 2, 2, 2, 2], // Line 3: Third row (was Line 2)
  [3, 3, 3, 3, 3, 3], // Line 4: Bottom row (unchanged)
  [1, 0, 0, 0, 0, 1], // Line 5 (unchanged)
  [2, 3, 3, 3, 3, 2], // Line 6 (unchanged)
  [2, 1, 2, 1, 2, 1], // Line 7 (unchanged)
  [1, 2, 1, 2, 1, 2], // Line 8 (unchanged)
  [0, 1, 0, 1, 0, 1], // Line 9 (unchanged)
  [3, 2, 3, 2, 3, 2] // Line 10 (unchanged)
];

interface WinningLine {
  paylineIndex: number;
  symbol: SymbolId;
  count: number;
  payout: number;
  line: number[];
}

interface SpinResult {
  totalWin: number;
  winningLines: WinningLine[];
  scatterWin: {
    count: number;
    triggeredFreeSpins: boolean;
  };
}

export function evaluateSpin(grid: SymbolId[][], betAmount: number): SpinResult {
  let totalWin = 0;
  const winningLines: WinningLine[] = [];

  // 1. Evaluate Paylines
  PAYLINES.forEach((line, paylineIndex) => {
    const lineSymbols = line.map((row, reel) => grid[reel][row]);
    const firstSymbol = lineSymbols[0];
    let count = 1;
    
    // Count consecutive matching symbols
    while (count < lineSymbols.length && lineSymbols[count] === firstSymbol) {
      count++;
    }

    // Check for wild symbols
    if (firstSymbol !== 'WILD') {
      // If first symbol is not wild, check for wilds at the start
      let wildCount = 0;
      while (wildCount < lineSymbols.length && lineSymbols[wildCount] === 'WILD') {
        wildCount++;
      }
      
      if (wildCount > 0) {
        // If we have leading wilds, they can substitute for the first symbol
        count = Math.max(count, wildCount);
      }
    }

    const symbolInfo = SYMBOLS[firstSymbol];
    if (symbolInfo && symbolInfo.payout[count]) {
      const payout = symbolInfo.payout[count] * betAmount;
      if (payout > 0) {
        totalWin += payout;
        winningLines.push({ 
          paylineIndex, 
          symbol: firstSymbol, 
          count, 
          payout, 
          line: [...line].slice(0, count) // Only highlight the winning part of the line
        });
      }
    }
  });
  
  // 2. Evaluate Scatters
  let scatterCount = 0;
  const scatterPositions: {reel: number, row: number}[] = [];
  
  grid.forEach((reel, reelIndex) => {
    reel.forEach((symbol, rowIndex) => {
      if (symbol === SCATTER_SYMBOL) {
        scatterCount++;
        scatterPositions.push({reel: reelIndex, row: rowIndex});
      }
    });
  });

  const triggeredFreeSpins = scatterCount >= 3;
  let scatterPayout = 0;
  
  if (scatterCount >= 3) {
    // Add scatter payout (example: 3x, 4x, or 5x bet amount)
    scatterPayout = betAmount * (scatterCount === 3 ? 5 : scatterCount === 4 ? 20 : 50);
    totalWin += scatterPayout;
    
    // Add scatter symbols to winning lines for visual feedback
    const scatterLine: WinningLine = {
      paylineIndex: -1, // Special index for scatters
      symbol: SCATTER_SYMBOL,
      count: scatterCount,
      payout: scatterPayout,
      line: scatterPositions.map(p => p.row)
    };
    winningLines.push(scatterLine);
  }

  return { 
    totalWin, 
    winningLines, 
    scatterWin: { 
      count: scatterCount, 
      triggeredFreeSpins 
    } 
  };
}