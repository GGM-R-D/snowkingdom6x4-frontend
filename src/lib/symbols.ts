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
  image: string; // Path to the image
}

export const SYMBOLS: Record<SymbolId, SymbolConfig> = {
  WILD: { 
    id: 'WILD', 
    name: 'Wild', 
    payout: { '3': 100, '4': 300, '5': 1000, '6': 3000 },
    image: '/images/symbols/Wild.png',
  },
  SCATTER: { 
    id: 'SCATTER', 
    name: 'Scatter', 
    payout: { '3': 5, '4': 10, '5': 250, '6': 500 },
    image: '/images/symbols/Scatter.png',
  },
  CROWN: { 
    id: 'CROWN', 
    name: 'Crown', 
   payout: { '3': 40, '4': 100, '5': 250, '6': 800 },
    image: '/images/symbols/Crown.png',
  },
  DRAGON: { 
    id: 'DRAGON', 
    name: 'Dragon', 
    payout: { '3': 20, '4': 40, '5': 200, '6': 400 },
    image: '/images/symbols/Dragon.png',
  },
  LEOPARD: { 
    id: 'LEOPARD', 
    name: 'Leopard', 
    payout: { '3': 20, '4': 40, '5': 200, '6': 400 },
    image: '/images/symbols/Leopard.png',
  },
  QUEEN: { 
    id: 'QUEEN', 
    name: 'Queen', 
   payout: { '3': 10, '4': 20, '5': 70, '6': 140 },
    image: '/images/symbols/Queen.png',
  },
  STONE: { 
    id: 'STONE', 
    name: 'Stone', 
    payout: { '3': 5, '4': 20, '5': 60, '6': 100 },
    image: '/images/symbols/Stone.png',
  },
  WOLF: { 
    id: 'WOLF', 
    name: 'Wolf', 
    payout: { '3': 5, '4': 20, '5': 60, '6': 100 },
    image: '/images/symbols/Wolf.png',
  },
  ACE: { 
    id: 'ACE', 
    name: 'Ace', 
    payout: { '3': 2, '4': 5, '5': 20, '6': 40 },
    image: '/images/symbols/A.png',
  },
  JACK: { 
    id: 'JACK', 
    name: 'Jack', 
    payout: { '3': 2, '4': 5, '5': 20, '6': 40 },
    image: '/images/symbols/J.png',
  },
  QUEEN_CARD: { 
    id: 'QUEEN_CARD', 
    name: 'Queen Card', 
    payout: { '3': 2, '4': 5, '5': 20, '6': 40 },
    image: '/images/symbols/Q.png',
  },
  KING: { 
    id: 'KING', 
    name: 'King', 
    payout: { '3': 2, '4': 5, '5': 20, '6': 40 },
    image: '/images/symbols/K.png',
  },
  TEN: { 
    id: 'TEN', 
    name: 'Ten', 
    payout: { '3': 2, '4': 5, '5': 20, '6': 40 },
    image: '/images/symbols/10.png',
  },
};

// Reel strips configuration
export const REEL_STRIPS: SymbolId[][] = [
  // Reel 1 (34 symbols)
  [
    'KING', 'CROWN', 'QUEEN_CARD', 'TEN', 'ACE', 'WOLF', 'STONE', 'QUEEN',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'LEOPARD', 'DRAGON', 'JACK',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'WOLF', 'STONE', 'TEN', 'JACK',
    'QUEEN_CARD', 'KING', 'ACE', 'WILD', 'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'SCATTER'
  ],
  // Reel 2 (34 symbols)
  [
    'TEN', 'STONE', 'QUEEN', 'KING', 'ACE', 'WOLF', 'STONE', 'QUEEN_CARD',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'LEOPARD', 'DRAGON', 'CROWN',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'WOLF', 'JACK', 'TEN', 'JACK',
    'QUEEN_CARD', 'KING', 'ACE', 'WILD', 'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'SCATTER'
  ],
  // Reel 3 (34 symbols)
  [
    'WILD', 'ACE', 'WOLF', 'STONE', 'ACE', 'QUEEN_CARD', 'STONE', 'QUEEN',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'LEOPARD', 'DRAGON', 'CROWN',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'WOLF', 'KING', 'TEN', 'JACK',
    'QUEEN_CARD', 'KING', 'JACK', 'WILD', 'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'SCATTER'
  ],
  // Reel 4 (34 symbols)
  [
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'WOLF', 'STONE', 'QUEEN',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'LEOPARD', 'DRAGON', 'CROWN',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'WOLF', 'STONE', 'TEN', 'JACK',
    'QUEEN_CARD', 'KING', 'ACE', 'WILD', 'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'SCATTER'
  ],
  // Reel 5 (34 symbols)
  [
    'DRAGON', 'WILD', 'LEOPARD', 'JACK', 'ACE', 'WOLF', 'STONE', 'QUEEN',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'QUEEN_CARD', 'TEN', 'CROWN',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'WOLF', 'STONE', 'TEN', 'JACK',
    'QUEEN_CARD', 'KING', 'ACE', 'KING', 'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'SCATTER'
  ],
  // Reel 6 (34 symbols)
  [
    'JACK', 'SCATTER', 'KING', 'QUEEN_CARD', 'ACE', 'WOLF', 'STONE', 'QUEEN',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'LEOPARD', 'DRAGON', 'CROWN',
    'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'ACE', 'WOLF', 'STONE', 'TEN', 'JACK',
    'QUEEN_CARD', 'KING', 'ACE', 'WILD', 'TEN', 'JACK', 'QUEEN_CARD', 'KING', 'TEN'
  ],
];

export const SCATTER_SYMBOL: SymbolId = 'SCATTER';
