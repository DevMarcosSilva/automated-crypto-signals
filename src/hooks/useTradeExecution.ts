
import { useState } from 'react';
import { Trade, PositionData, Stats } from '@/types/trading';
import { useToast } from '@/hooks/use-toast';

export const useTradeExecution = () => {
  const { toast } = useToast();
  const [inPosition, setInPosition] = useState(false);
  const [positionData, setPositionData] = useState<PositionData>({
    quantity: 0,
    entryPrice: 0,
    currentPrice: 0,
    pnl: 0,
    pnlPercentage: 0,
  });

  const handleBuySignal = (
    price: number,
    investment: number,
    symbol: string,
    setTrades: React.Dispatch<React.SetStateAction<Trade[]>>,
    addLog: (message: string, type?: 'info' | 'success' | 'error' | 'warning') => void
  ) => {
    if (inPosition) return;
    
    const quantity = investment / price;
    
    const newTrade: Trade = {
      id: `buy-${Date.now()}`,
      time: new Date().toLocaleString(),
      type: 'BUY',
      price,
      amount: quantity,
      total: investment
    };
    
    setTrades(prev => [newTrade, ...prev]);
    
    setInPosition(true);
    setPositionData({
      quantity,
      entryPrice: price,
      currentPrice: price,
      pnl: 0,
      pnlPercentage: 0
    });
    
    addLog(`COMPRA EXECUTADA: ${quantity.toFixed(4)} ${symbol.replace('USDT', '')} a $${price.toFixed(2)}`, 'success');
    
    toast({
      title: "Compra Executada",
      description: `Comprado ${quantity.toFixed(4)} ${symbol.replace('USDT', '')} a $${price.toFixed(2)}`,
    });
  };

  const closePosition = (
    symbol: string,
    setTrades: React.Dispatch<React.SetStateAction<Trade[]>>,
    setStats: React.Dispatch<React.SetStateAction<Stats>>,
    addLog: (message: string, type?: 'info' | 'success' | 'error' | 'warning') => void
  ) => {
    if (!inPosition) return;
    
    addLog(`Fechando posição: ${positionData.quantity.toFixed(4)} ${symbol.replace('USDT', '')} a $${positionData.currentPrice.toFixed(2)}`, 'info');
    
    const profit = positionData.pnl;
    
    const newTrade: Trade = {
      id: `sell-${Date.now()}`,
      time: new Date().toLocaleString(),
      type: 'SELL',
      price: positionData.currentPrice,
      amount: positionData.quantity,
      total: positionData.currentPrice * positionData.quantity,
      profit: positionData.pnlPercentage
    };
    
    setTrades(prev => [newTrade, ...prev]);
    
    setStats(prev => ({
      ...prev,
      profitToday: prev.profitToday + profit,
      totalProfit: prev.totalProfit + profit,
      tradesCount: prev.tradesCount + 1,
      winRate: prev.tradesCount > 0 
        ? ((prev.winRate * (prev.tradesCount - 1) + (profit > 0 ? 100 : 0)) / prev.tradesCount) 
        : (profit > 0 ? 100 : 0)
    }));
    
    setInPosition(false);
    setPositionData({
      quantity: 0,
      entryPrice: 0,
      currentPrice: 0,
      pnl: 0,
      pnlPercentage: 0,
    });
    
    toast({
      title: "Posição Fechada",
      description: `Posição fechada com ${profit > 0 ? 'lucro' : 'perda'}: ${profit.toFixed(2)} USDT`,
      variant: profit > 0 ? "default" : "destructive",
    });
  };

  const updatePositionData = (newPrice: number) => {
    setPositionData(prev => {
      const pnl = (newPrice - prev.entryPrice) * prev.quantity;
      const pnlPercentage = ((newPrice - prev.entryPrice) / prev.entryPrice) * 100;
      
      return {
        ...prev,
        currentPrice: newPrice,
        pnl,
        pnlPercentage
      };
    });
  };

  return {
    inPosition,
    positionData,
    handleBuySignal,
    closePosition,
    updatePositionData
  };
};
