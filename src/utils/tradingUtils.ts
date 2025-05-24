
import { BotSettings, ChartData, Trade, Stats } from '@/types/trading';

export const calculateMA = (prices: number[], period: number): (number | null)[] => {
  return prices.map((_, i) => {
    if (i < period - 1) return null;
    const slice = prices.slice(i - period + 1, i + 1);
    return slice.reduce((a, b) => a + b, 0) / period;
  });
};

export const generateSimulatedPrices = (length: number = 100): number[] => {
  const basePrice = 100 + Math.random() * 50;
  return Array.from({ length }, (_, i) => {
    const trend = Math.sin(i * 0.05) * 5;
    const noise = (Math.random() - 0.5) * 2;
    return basePrice + trend + noise + (i * 0.1);
  });
};

export const generateTimeLabels = (length: number): string[] => {
  const now = Date.now();
  return Array.from({ length }, (_, i) => 
    new Date(now - (length - 1 - i) * 15 * 60 * 1000).toLocaleTimeString()
  );
};

export const detectSignals = (
  prices: number[],
  maShort: (number | null)[],
  maLong: (number | null)[],
  times: string[],
  startIndex: number
): { buySignals: { time: string, price: number }[], sellSignals: { time: string, price: number }[] } => {
  const buySignals: { time: string, price: number }[] = [];
  const sellSignals: { time: string, price: number }[] = [];
  
  for (let i = startIndex; i < prices.length; i++) {
    const currentShort = maShort[i];
    const currentLong = maLong[i];
    const prevShort = maShort[i - 1];
    const prevLong = maLong[i - 1];
    
    if (currentShort && currentLong && prevShort && prevLong) {
      if (prevShort <= prevLong && currentShort > currentLong) {
        buySignals.push({ time: times[i], price: prices[i] });
      } else if (prevShort >= prevLong && currentShort < currentLong) {
        sellSignals.push({ time: times[i], price: prices[i] });
      }
    }
  }
  
  return { buySignals, sellSignals };
};

export const simulateHistoricalTrades = (
  buySignals: { time: string, price: number }[],
  sellSignals: { time: string, price: number }[],
  times: string[],
  investment: number
): Trade[] => {
  const historicalTrades: Trade[] = [];
  let isInHistoricalPosition = false;
  let entryPrice = 0;
  let entryQuantity = 0;
  
  [...buySignals, ...sellSignals]
    .sort((a, b) => times.indexOf(a.time) - times.indexOf(b.time))
    .forEach((signal, index) => {
      const isBuySignal = buySignals.includes(signal);
      
      if (isBuySignal && !isInHistoricalPosition) {
        entryPrice = signal.price;
        entryQuantity = investment / signal.price;
        
        historicalTrades.push({
          id: `historical-buy-${index}`,
          time: signal.time,
          type: 'BUY',
          price: signal.price,
          amount: entryQuantity,
          total: investment,
        });
        
        isInHistoricalPosition = true;
      } else if (!isBuySignal && isInHistoricalPosition) {
        const profit = ((signal.price - entryPrice) / entryPrice) * 100;
        
        historicalTrades.push({
          id: `historical-sell-${index}`,
          time: signal.time,
          type: 'SELL',
          price: signal.price,
          amount: entryQuantity,
          total: signal.price * entryQuantity,
          profit: profit
        });
        
        isInHistoricalPosition = false;
      }
    });
  
  return historicalTrades.reverse();
};

export const calculateStatsFromTrades = (trades: Trade[]): Partial<Stats> => {
  const profits = trades
    .filter(trade => trade.type === 'SELL' && trade.profit !== undefined)
    .map(trade => trade.profit!);
  
  if (profits.length === 0) {
    return { profitToday: 0, totalProfit: 0, winRate: 0, tradesCount: 0 };
  }
  
  const totalProfit = profits.reduce((sum, profit) => sum + profit, 0);
  const winningTrades = profits.filter(profit => profit > 0).length;
  
  return {
    profitToday: totalProfit * 0.3,
    totalProfit: totalProfit,
    winRate: (winningTrades / profits.length) * 100,
    tradesCount: profits.length
  };
};

export const analyzeChart = (
  chartData: ChartData,
  botSettings: BotSettings
): {
  trend: string;
  strength: number;
  signal: 'buy' | 'sell' | 'neutral';
  resistance: number;
  support: number;
  maStatus: string;
  rsi: number;
} => {
  if (chartData.prices.length === 0) {
    throw new Error("Não há dados suficientes para análise");
  }

  const currentPrice = chartData.prices[chartData.prices.length - 1];
  const prices = [...chartData.prices];
  
  const maxPrice = Math.max(...prices);
  const minPrice = Math.min(...prices);
  const resistance = currentPrice + (maxPrice - currentPrice) * 0.5;
  const support = currentPrice - (currentPrice - minPrice) * 0.5;
  
  const lastMaShort = chartData.maShort[chartData.maShort.length - 1];
  const lastMaLong = chartData.maLong[chartData.maLong.length - 1];
  
  let trend = 'Lateral';
  let signal: 'buy' | 'sell' | 'neutral' = 'neutral';
  let strength = 50;
  let maStatus = 'Médias móveis em equilíbrio';
  
  if (lastMaShort && lastMaLong) {
    if (lastMaShort > lastMaLong) {
      trend = 'Tendência de alta';
      strength = 65 + Math.floor(Math.random() * 20);
      signal = 'buy';
      maStatus = `${botSettings.maType}${botSettings.maShort} acima de ${botSettings.maType}${botSettings.maLong}, indicando momentum de alta`;
    } else if (lastMaShort < lastMaLong) {
      trend = 'Tendência de baixa';
      strength = 35 + Math.floor(Math.random() * 20);
      signal = 'sell';
      maStatus = `${botSettings.maType}${botSettings.maShort} abaixo de ${botSettings.maType}${botSettings.maLong}, indicando momentum de baixa`;
    }
  }
  
  const rsi = 40 + Math.floor(Math.random() * 30);
  
  return { trend, strength, signal, resistance, support, maStatus, rsi };
};
