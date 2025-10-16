

import { BarIcon, BellIcon, CherryIcon, DiamondIcon, LemonIcon, SevenIcon } from "@/components/icons";

export type SymbolId = 'SEVEN' | 'DIAMOND' | 'BELL' | 'BAR' | 'CHERRY' | 'LEMON';

export const SYMBOLS: Record<SymbolId, {
  id: SymbolId;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  payout: { [key: number]: number }; // e.g., { 3: 10, 4: 50, 5: 200, 6: 1000 }
  name: string;
}> = {
  SEVEN: { id: 'SEVEN', icon: SevenIcon, payout: { 3: 1, 4: 500, 5: 2000, 6: 5000 }, name: 'Lucky Seven' },
  DIAMOND: { id: 'DIAMOND', icon: DiamondIcon, payout: { 3: 0.5, 4: 200, 5: 750, 6: 1500 }, name: 'Diamond' },
  BELL: { id: 'BELL', icon: BellIcon, payout: { 3: 0.2, 4: 100, 5: 400, 6: 800 }, name: 'Golden Bell' },
  BAR: { id: 'BAR', icon: BarIcon, payout: { 3: 0.1, 4: 50, 5: 200, 6: 400 }, name: 'BAR' },
  CHERRY: { id: 'CHERRY', icon: CherryIcon, payout: { 2: 0.5, 3: 1, 4: 2.5, 5: 10, 6: 20 }, name: 'Cherry' },
  LEMON: { id: 'LEMON', icon: LemonIcon, payout: { 3: 0.5, 4: 20, 5: 75, 6: 150 }, name: 'Lemon' },
};

export const REEL_STRIPS: SymbolId[][] = [
  // Reel 1
  ['SEVEN', 'CHERRY', 'LEMON', 'BAR', 'BELL', 'CHERRY', 'LEMON', 'BAR', 'BELL', 'DIAMOND', 'LEMON', 'BAR'],
  // Reel 2
  ['BAR', 'BELL', 'SEVEN', 'CHERRY', 'LEMON', 'CHERRY', 'BELL', 'LEMON', 'BAR', 'BELL', 'SEVEN', 'CHERRY'],
  // Reel 3
  ['CHERRY', 'LEMON', 'BAR', 'BELL', 'SEVEN', 'CHERRY', 'DIAMOND', 'BAR', 'LEMON', 'BELL', 'BAR', 'SEVEN'],
  // Reel 4
  ['BELL', 'SEVEN', 'CHERRY', 'LEMON', 'BAR', 'SEVEN', 'CHERRY', 'LEMON', 'BELL', 'CHERRY', 'BAR', 'LEMON'],
  // Reel 5
  ['LEMON', 'BAR', 'BELL', 'SEVEN', 'CHERRY', 'BAR', 'DIAMOND', 'CHERRY', 'LEMON', 'LEMON', 'SEVEN', 'BELL'],
  // Reel 6
  ['SEVEN', 'LEMON', 'CHERRY', 'BAR', 'BELL', 'SEVEN', 'CHERRY', 'BELL', 'BAR', 'SEVEN', 'LEMON', 'CHERRY'],
];

export const NUM_REELS = 6;
export const NUM_ROWS = 4;
export const BET_AMOUNTS = [1, 2, 3, 5];
export const FREE_SPINS_AWARDED = 10;
export const SCATTER_SYMBOL: SymbolId = 'DIAMOND';

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
  [2, 3, 3, 3, 3, 2], // Inverted U-shape
];


export type WinningLine = {
    paylineIndex: number;
    symbol: SymbolId;
    count: number;
    payout: number;
    line: number[];
}

export type SpinResult = {
    totalWin: number;
    winningLines: WinningLine[];
    scatterWin: {
        count: number;
        triggeredFreeSpins: boolean;
    };
}

export const evaluateSpin = (grid: SymbolId[][], betAmount: number): SpinResult => {
    let totalWin = 0;
    const winningLines: WinningLine[] = [];

    // 1. Evaluate Paylines
    PAYLINES.forEach((line, paylineIndex) => {
        const lineSymbols = line.map((row, reel) => grid[reel][row]);
        const firstSymbol = lineSymbols[0];
        let count = 1;
        while(count < lineSymbols.length && lineSymbols[count] === firstSymbol) {
            count++;
        }

        const symbolInfo = SYMBOLS[firstSymbol];
        if (symbolInfo && symbolInfo.payout[count]) {
             const payout = symbolInfo.payout[count] * betAmount;
             if(payout > 0) {
                totalWin += payout;
                winningLines.push({ paylineIndex, symbol: firstSymbol, count, payout, line });
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

    if (triggeredFreeSpins) {
        // Here you could add a scatter payout as well, e.g.:
        // totalWin += betAmount * (scatterCount === 3 ? 5 : scatterCount === 4 ? 20 : 50);
        
        // Add scatter symbols to winning lines for visual feedback
        const scatterLine: WinningLine = {
            paylineIndex: -1, // Special index for scatters
            symbol: SCATTER_SYMBOL,
            count: scatterCount,
            payout: 0, // Payout is the free spins themselves, but you can add monetary value
            line: scatterPositions.map(p => p.row) // This isn't a perfect representation but helps for highlighting
        };
        winningLines.push(scatterLine);
    }

    return { totalWin, winningLines, scatterWin: { count: scatterCount, triggeredFreeSpins } };
};
