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

  // Simula verificação de saldo da Binance
  const checkBalance = async (symbol: string, investment: number): Promise<{ hasBalance: boolean; balance: number }> => {
    // Simula uma consulta à API da Binance
    const simulatedBalance = 500 + Math.random() * 1000; // Simula saldo entre 500-1500 USDT
    
    console.log(`Verificando saldo para ${symbol}: ${simulatedBalance.toFixed(2)} USDT`);
    
    return {
      hasBalance: simulatedBalance >= investment,
      balance: simulatedBalance
    };
  };

  const handleBuySignal = async (
    price: number,
    investment: number,
    symbol: string,
    setTrades: React.Dispatch<React.SetStateAction<Trade[]>>,
    addLog: (message: string, type?: 'info' | 'success' | 'error' | 'warning') => void
  ) => {
    // Verifica se já está em posição
    if (inPosition) {
      addLog(`ENTRADA REJEITADA: Já existe uma posição aberta para ${symbol.replace('USDT', '')}`, 'warning');
      return;
    }
    
    addLog(`Verificando saldo disponível para entrada...`, 'info');
    
    try {
      // Verifica saldo disponível
      const { hasBalance, balance } = await checkBalance(symbol, investment);
      
      if (!hasBalance) {
        addLog(`ENTRADA REJEITADA: Saldo insuficiente. Necessário: ${investment} USDT, Disponível: ${balance.toFixed(2)} USDT`, 'error');
        
        toast({
          title: "Saldo Insuficiente",
          description: `Necessário ${investment} USDT, mas você tem apenas ${balance.toFixed(2)} USDT disponível`,
          variant: "destructive",
        });
        
        return;
      }
      
      addLog(`Saldo verificado: ${balance.toFixed(2)} USDT disponível`, 'success');
      
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
      
      addLog(`COMPRA EXECUTADA: ${quantity.toFixed(4)} ${symbol.replace('USDT', '')} a $${price.toFixed(2)} (Saldo restante: ${(balance - investment).toFixed(2)} USDT)`, 'success');
      
      toast({
        title: "Compra Executada",
        description: `Comprado ${quantity.toFixed(4)} ${symbol.replace('USDT', '')} a $${price.toFixed(2)}`,
      });
      
    } catch (error) {
      addLog(`ERRO ao verificar saldo: ${error instanceof Error ? error.message : 'Erro desconhecido'}`, 'error');
      
      toast({
        title: "Erro na Verificação de Saldo",
        description: "Não foi possível verificar o saldo disponível",
        variant: "destructive",
      });
    }
  };

  const closePosition = (
    symbol: string,
    setTrades: React.Dispatch<React.SetStateAction<Trade[]>>,
    setStats: React.Dispatch<React.SetStateAction<Stats>>,
    addLog: (message: string, type?: 'info' | 'success' | 'error' | 'warning') => void
  ) => {
    if (!inPosition) {
      addLog(`VENDA REJEITADA: Não há posição aberta para ${symbol.replace('USDT', '')}`, 'warning');
      return;
    }
    
    addLog(`Fechando posição: ${positionData.quantity.toFixed(4)} ${symbol.replace('USDT', '')} a $${positionData.currentPrice.toFixed(2)}`, 'info');
    
    const profit = positionData.pnl;
    const totalReceived = positionData.currentPrice * positionData.quantity;
    
    const newTrade: Trade = {
      id: `sell-${Date.now()}`,
      time: new Date().toLocaleString(),
      type: 'SELL',
      price: positionData.currentPrice,
      amount: positionData.quantity,
      total: totalReceived,
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
    
    addLog(`VENDA EXECUTADA: Recebido ${totalReceived.toFixed(2)} USDT (${profit > 0 ? 'Lucro' : 'Perda'}: ${profit.toFixed(2)} USDT)`, profit > 0 ? 'success' : 'error');
    
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
