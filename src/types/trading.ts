
export interface BotSettings {
  symbol: string;
  timeframe: string;
  maShort: number;
  maLong: number;
  maType: string;
  investment: number;
  checkInterval: number;
}

export interface PositionData {
  quantity: number;
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercentage: number;
}

export interface ChartData {
  times: string[];
  prices: number[];
  maShort: number[];
  maLong: number[];
  buySignals: { time: string, price: number }[];
  sellSignals: { time: string, price: number }[];
}

export interface ChartAnalysis {
  trend: string;
  strength: number;
  signal: 'buy' | 'sell' | 'neutral';
  resistance: number;
  support: number;
  maStatus: string;
  rsi: number;
}

export interface Trade {
  id: string;
  time: string;
  type: 'BUY' | 'SELL';
  price: number;
  amount: number;
  total: number;
  profit?: number;
}

export interface Stats {
  profitToday: number;
  totalProfit: number;
  winRate: number;
  tradesCount: number;
}

export interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}
