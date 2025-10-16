// Import the new symbols configuration
import { SYMBOLS, REEL_STRIPS, SCATTER_SYMBOL, type SymbolId } from './symbols';

export { SYMBOLS, REEL_STRIPS, SCATTER_SYMBOL, type SymbolId };

export const NUM_REELS = 6;
export const NUM_ROWS = 4;
export const BET_AMOUNTS = [1, 2, 3, 5];
export const FREE_SPINS_AWARDED = 10;

// Paylines are defined by the row index (0, 1, 2 or 3) for each of the 6 reels.
export const PAYLINES: number[][] = [
  [1, 1, 1, 1, 1, 1], // Middle-top row
  [2, 2, 2, 2, 2, 2], // Middle-bottom row
  [0, 0, 0, 0, 0, 0], // Top row
  [3, 3, 3, 3, 3, 3], // Bottom row
  [0, 1, 2, 2, 1, 0], // V-shape
  [3, 2, 1, 1, 2, 3], // Inverted V-shape
  [0, 0, 1, 2, 3, 3], // Diagonal up
  [3, 3, 2, 1, 0, 0], // Diagonal down
  [1, 0, 0, 0, 0, 1], // U-shape
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