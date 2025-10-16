import type { WinningLine } from "@/lib/slot-config";
import { PAYLINES, NUM_REELS, NUM_ROWS } from "@/lib/slot-config";

export const PAYLINE_COLORS = [
  '#FF3366', '#33FF66', '#3366FF', '#FFCC33', '#33CCFF',
  '#FF33CC', '#CCFF33', '#6633FF', '#FF6633', '#33FFCC',
  '#FFFF00' // Special color for scatter highlight
];

interface WinningLinesDisplayProps {
  winningLines: WinningLine[];
}

const SYMBOL_WIDTH_MD = 144; // w-36
const SYMBOL_HEIGHT_MD = 144; // h-36
const GAP_MD = 8; // md:gap-2
const PADDING_MD = 8; // md:p-2

const SYMBOL_WIDTH_SM = 80; // sm:w-20
const SYMBOL_HEIGHT_SM = 80; // sm:h-20
const GAP_SM = 8; // sm:gap-2
const PADDING_SM = 8; // sm:p-2

const SYMBOL_WIDTH_XS = 48; // h-12 w-12 on smallest
const SYMBOL_HEIGHT_XS = 48; // h-12 w-12 on smallest
const GAP_XS = 8; // gap-2 on smallest
const PADDING_XS = 8; // p-2 on smallest


const getPointForCell = (reel: number, row: number, screen: 'xs' | 'sm' | 'md') => {
  let symbolWidth, symbolHeight, gap, padding;

  switch(screen) {
    case 'xs':
        symbolWidth = SYMBOL_WIDTH_XS;
        symbolHeight = SYMBOL_HEIGHT_XS;
        gap = GAP_XS;
        padding = PADDING_XS;
        break;
    case 'sm':
        symbolWidth = SYMBOL_WIDTH_SM;
        symbolHeight = SYMBOL_HEIGHT_SM;
        gap = GAP_SM;
        padding = PADDING_SM;
        break;
    case 'md':
    default:
        symbolWidth = SYMBOL_WIDTH_MD;
        symbolHeight = SYMBOL_HEIGHT_MD;
        gap = GAP_MD;
        padding = PADDING_MD;
        break;
  }

  const x = padding + (reel * (symbolWidth + gap)) + (symbolWidth / 2);
  const y = padding + (row * (symbolHeight + gap)) + (symbolHeight / 2);
  return { x, y };
};

const getPathForLine = (line: number[], screen: 'xs' | 'sm' | 'md') => {
  const points = line.map((row, reel) => getPointForCell(reel, row, screen));
  return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
};

const getViewBox = (screen: 'xs' | 'sm' | 'md') => {
    let symbolWidth, symbolHeight, gap, padding;

    switch(screen) {
        case 'xs':
            symbolWidth = SYMBOL_WIDTH_XS;
            symbolHeight = SYMBOL_HEIGHT_XS;
            gap = GAP_XS;
            padding = PADDING_XS;
            break;
        case 'sm':
            symbolWidth = SYMBOL_WIDTH_SM;
            symbolHeight = SYMBOL_HEIGHT_SM;
            gap = GAP_SM;
            padding = PADDING_SM;
            break;
        case 'md':
        default:
            symbolWidth = SYMBOL_WIDTH_MD;
            symbolHeight = SYMBOL_HEIGHT_MD;
            gap = GAP_MD;
            padding = PADDING_MD;
            break;
    }
    const width = symbolWidth * NUM_REELS + gap * (NUM_REELS - 1) + padding * 2;
    const height = symbolHeight * NUM_ROWS + gap * (NUM_ROWS - 1) + padding * 2;
    return `0 0 ${width} ${height}`;
}


export function WinningLinesDisplay({ winningLines }: WinningLinesDisplayProps) {
  return (
    <>
      {/* Desktop SVG */}
      <svg
        className="absolute inset-0 pointer-events-none hidden md:block"
        viewBox={getViewBox('md')}
        preserveAspectRatio="xMidYMid meet"
      >
        {winningLines.map((line) => (
          <path
            key={line.paylineIndex}
            d={getPathForLine(PAYLINES[line.paylineIndex], 'md')}
            stroke={PAYLINE_COLORS[line.paylineIndex % PAYLINE_COLORS.length]}
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
                filter: `drop-shadow(0 0 5px ${PAYLINE_COLORS[line.paylineIndex % PAYLINE_COLORS.length]})`,
            }}
          />
        ))}
      </svg>
      {/* Tablet SVG */}
       <svg
        className="absolute inset-0 pointer-events-none hidden sm:block md:hidden"
        viewBox={getViewBox('sm')}
        preserveAspectRatio="xMidYMid meet"
      >
        {winningLines.map((line) => (
          <path
            key={line.paylineIndex}
            d={getPathForLine(PAYLINES[line.paylineIndex], 'sm')}
            stroke={PAYLINE_COLORS[line.paylineIndex % PAYLINE_COLORS.length]}
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
                filter: `drop-shadow(0 0 3px ${PAYLINE_COLORS[line.paylineIndex % PAYLINE_COLORS.length]})`,
            }}
          />
        ))}
      </svg>
      {/* Mobile SVG */}
       <svg
        className="absolute inset-0 pointer-events-none sm:hidden"
        viewBox={getViewBox('xs')}
        preserveAspectRatio="xMidYMid meet"
      >
        {winningLines.map((line) => (
          <path
            key={line.paylineIndex}
            d={getPathForLine(PAYLINES[line.paylineIndex], 'xs')}
            stroke={PAYLINE_COLORS[line.paylineIndex % PAYLINE_COLORS.length]}
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
                filter: `drop-shadow(0 0 2px ${PAYLINE_COLORS[line.paylineIndex % PAYLINE_COLORS.length]})`,
            }}
          />
        ))}
      </svg>
    </>
  );
}
