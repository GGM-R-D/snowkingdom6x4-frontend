// RGS API Service for Frontend
const RGS_BASE_URL = 'http://localhost:5000';
const OPERATOR_ID = 'LOCAL';
const GAME_ID = 'FROSTY_FORTUNES';

export interface GameStartRequest {
  languageId: string;
  client: string;
  funMode: number;
  token?: string;
  currencyId?: string;
}

export interface GameStartResponse {
  statusCode: number;
  message: string;
  player: {
    sessionId: string;
    id: string;
    balance: number;
  };
  client: {
    type: string;
    ip: string;
    country: {
      code: string;
      name: string;
    };
  };
  currency: {
    symbol: string;
    isoCode: string;
    name: string;
    separator: {
      decimal: string;
      thousand: string;
    };
    decimals: number;
  };
  game: {
    rtp: number;
    mode: number;
    bet: {
      default: number;
      levels: number[];
    };
    funMode: boolean;
    maxWinCap: number;
    config: {
      startScreen: any;
      settings: {
        isAutoplay: string;
        isSlamStop: string;
        isBuyFeatures: string;
        isTurboSpin: string;
        isRealityCheck: string;
        minSpin: string;
        maxSpin: string;
      };
    };
    freeSpins: {
      amount: number;
      left: number;
      betValue: number;
      roundWin: number;
      totalWin: number;
      totalBet: number;
    };
    promoFreeSpins: {
      amount: number;
      left: number;
      betValue: number;
      isPromotion: boolean;
      totalWin: number;
      totalBet: number;
    };
    feature: {
      name: string;
      type: string;
    };
    lastPlay: {
      betLevel: {
        index: number;
        value: number;
      };
      results: any[];
    };
  };
}

export interface GamePlayRequest {
  sessionId: string;
  bets: Array<{ amount: number }>;
  bet?: number;
  userPayload?: any;
  lastResponse?: any;
  rtpLevel?: number;
  mode?: number;
  currency?: { id: string };
}

export interface GamePlayResponse {
  statusCode: number;
  message: string;
  player: {
    sessionId: string;
    roundId: string;
    transaction: {
      withdraw: string;
      deposit: string;
    };
    prevBalance: number;
    balance: number;
    bet: number;
    win: number;
    currencyId: string;
  };
  game: {
    results: any;
    mode: number;
    maxWinCap: {
      achieved: boolean;
      value: number;
      realWin: number;
    };
  };
  freeSpins: {
    amount: number;
    left: number;
    isPromotion: boolean;
    roundWin: number;
    totalWin: number;
    totalBet: number;
    won: number;
  };
  promoFreeSpins: {
    amount: number;
    left: number;
    betValue: number;
    level: number;
    totalWin: number;
    totalBet: number;
  };
  jackpots: any[];
  feature: {
    name: string;
    type: string;
    isClosure: number;
  };
}

export interface PlayerBalanceRequest {
  playerId: string;
}

export interface PlayerBalanceResponse {
  statusCode: number;
  message: string;
  balance: number;
}

class RgsApiService {
  private async makeRequest<T>(endpoint: string, method: 'GET' | 'POST', body?: any): Promise<T> {
    const url = `${RGS_BASE_URL}${endpoint}`;
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (body && method === 'POST') {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async startGame(request: GameStartRequest): Promise<GameStartResponse> {
    return this.makeRequest<GameStartResponse>(
      `/${OPERATOR_ID}/${GAME_ID}/start`,
      'POST',
      request
    );
  }

  async playGame(request: GamePlayRequest): Promise<GamePlayResponse> {
    return this.makeRequest<GamePlayResponse>(
      `/${OPERATOR_ID}/${GAME_ID}/play`,
      'POST',
      request
    );
  }

  async getPlayerBalance(request: PlayerBalanceRequest): Promise<PlayerBalanceResponse> {
    return this.makeRequest<PlayerBalanceResponse>(
      `/${OPERATOR_ID}/player/balance`,
      'POST',
      request
    );
  }

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.makeRequest<{ status: string; timestamp: string }>('/health', 'GET');
  }
}

export const rgsApi = new RgsApiService();
