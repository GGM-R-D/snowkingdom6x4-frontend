// Import icon components
import { WildIcon } from '@/components/icons/wild-icon';
import { ScatterIcon } from '@/components/icons/scatter-icon';
import { Crown as CrownIcon } from 'lucide-react';
import { Gem as DiamondIcon } from 'lucide-react';
import { Zap as LightningIcon } from 'lucide-react';
import { AlertTriangle as AlertIcon } from 'lucide-react';
import { Star as StarIcon } from 'lucide-react';
import { Heart as HeartIcon } from 'lucide-react';
import { Sparkles as SparklesIcon } from 'lucide-react';
import { Award as AwardIcon } from 'lucide-react';
import { Coins as CoinsIcon } from 'lucide-react';

// Define all possible symbols
export type SymbolId = 
  | 'WILD'
  | 'SCATTER'
  | 'CROWN'
  | 'DRAGON'
  | 'LEOPARD'
  | 'QUEEN'
  | 'STONE'
  | 'WOLF'
  | 'ACE'
  | 'JACK'
  | 'QUEEN_CARD'
  | 'KING'
  | 'TEN';

interface SymbolConfig {
  id: SymbolId;
  name: string;
  payout: { [key: number]: number };
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color?: string;
}

export const SYMBOLS: Record<SymbolId, SymbolConfig> = {
  WILD: { 
    id: 'WILD', 
    name: 'Wild', 
    payout: { 2: 5, 3: 20, 4: 100, 5: 500, 6: 2000 },
    icon: WildIcon,
    color: '#f59e0b' // amber-500
  },
  SCATTER: { 
    id: 'SCATTER', 
    name: 'Scatter', 
    payout: { 3: 5, 4: 30, 5: 150, 6: 1000 },
    icon: ScatterIcon,
    color: '#10b981' // emerald-500
  },
  CROWN: { 
    id: 'CROWN', 
    name: 'Crown', 
    payout: { 3: 1.5, 4: 15, 5: 75, 6: 300 },
    icon: CrownIcon,
    color: '#f59e0b' // amber-500
  },
  DRAGON: { 
    id: 'DRAGON', 
    name: 'Dragon', 
    payout: { 3: 1.2, 4: 12, 5: 60, 6: 250 },
    icon: DiamondIcon,
    color: '#ef4444' // red-500
  },
  LEOPARD: { 
    id: 'LEOPARD', 
    name: 'Leopard', 
    payout: { 3: 1, 4: 10, 5: 50, 6: 200 },
    icon: LightningIcon,
    color: '#f97316' // orange-500
  },
  QUEEN: { 
    id: 'QUEEN', 
    name: 'Queen', 
    payout: { 3: 0.8, 4: 8, 5: 40, 6: 150 },
    icon: StarIcon,
    color: '#8b5cf6' // violet-500
  },
  STONE: { 
    id: 'STONE', 
    name: 'Stone', 
    payout: { 3: 0.6, 4: 6, 5: 30, 6: 120 },
    icon: AlertIcon,
    color: '#6b7280' // gray-500
  },
  WOLF: { 
    id: 'WOLF', 
    name: 'Wolf', 
    payout: { 3: 0.5, 4: 5, 5: 25, 6: 100 },
    icon: HeartIcon,
    color: '#ec4899' // pink-500
  },
  ACE: { 
    id: 'ACE', 
    name: 'Ace', 
    payout: { 3: 0.4, 4: 4, 5: 20, 6: 80 },
    icon: SparklesIcon,
    color: '#3b82f6' // blue-500
  },
  JACK: { 
    id: 'JACK', 
    name: 'Jack', 
    payout: { 3: 0.3, 4: 3, 5: 15, 6: 60 },
    icon: AwardIcon,
    color: '#10b981' // emerald-500
  },
  QUEEN_CARD: { 
    id: 'QUEEN_CARD', 
    name: 'Queen Card', 
    payout: { 3: 0.2, 4: 2, 5: 10, 6: 40 },
    icon: StarIcon,
    color: '#8b5cf6' // violet-500
  },
  KING: { 
    id: 'KING', 
    name: 'King', 
    payout: { 3: 0.1, 4: 1, 5: 5, 6: 20 },
    icon: CrownIcon,
    color: '#f59e0b' // amber-500
  },
  TEN: { 
    id: 'TEN', 
    name: 'Ten', 
    payout: { 3: 0.05, 4: 0.5, 5: 2.5, 6: 10 },
    icon: CoinsIcon,
    color: '#d1d5db' // gray-300
  },
};

// Reel strips configuration
export const REEL_STRIPS: SymbolId[][] = [
  // Reel 1
  ['WILD', 'TEN', 'KING', 'QUEEN_CARD', 'JACK', 'ACE', 'WOLF', 'STONE', 'QUEEN', 'LEOPARD', 'DRAGON', 'CROWN', 'SCATTER'],
  // Reel 2
  ['TEN', 'KING', 'QUEEN_CARD', 'JACK', 'ACE', 'WOLF', 'STONE', 'QUEEN', 'LEOPARD', 'DRAGON', 'CROWN', 'SCATTER', 'WILD'],
  // Reel 3
  ['KING', 'QUEEN_CARD', 'JACK', 'ACE', 'WOLF', 'STONE', 'QUEEN', 'LEOPARD', 'DRAGON', 'CROWN', 'SCATTER', 'WILD', 'TEN'],
  // Reel 4
  ['QUEEN_CARD', 'JACK', 'ACE', 'WOLF', 'STONE', 'QUEEN', 'LEOPARD', 'DRAGON', 'CROWN', 'SCATTER', 'WILD', 'TEN', 'KING'],
  // Reel 5
  ['JACK', 'ACE', 'WOLF', 'STONE', 'QUEEN', 'LEOPARD', 'DRAGON', 'CROWN', 'SCATTER', 'WILD', 'TEN', 'KING', 'QUEEN_CARD'],
  // Reel 6
  ['ACE', 'WOLF', 'STONE', 'QUEEN', 'LEOPARD', 'DRAGON', 'CROWN', 'SCATTER', 'WILD', 'TEN', 'KING', 'QUEEN_CARD', 'JACK'],
];

export const SCATTER_SYMBOL: SymbolId = 'SCATTER';
