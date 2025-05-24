import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useTradeExecution } from '@/hooks/useTradeExecution';
import {
  BotSettings,
  ChartData,
  ChartAnalysis,
  Trade,
  Stats,
  LogEntry
} from '@/types/trading';
import {
  calculateMA,
  generateSimulatedPrices,
  generateTimeLabels,
  detectSignals,
  simulateHistoricalTrades,
  calculateStatsFromTrades,
  analyzeChart as analyzeChartUtil
} from '@/utils/tradingUtils';

export function useTradingBot() {
  const { toast } = useToast();
  const {
    inPosition,
    positionData,
    handleBuySignal,
    closePosition: executeClosePosition,
    updatePositionData
  } = useTradeExecution();

  const [isRunning, setIsRunning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [apiSettingsOpen, setApiSettingsOpen] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  
  const [botSettings, setBotSettings] = useState<BotSettings>({
    symbol: 'SOLUSDT',
    timeframe: '15m',
    maShort: 7,
    maLong: 40,
    maType: 'EMA',
    investment: 0.10,
    checkInterval: 30,
  });

  const [chartData, setChartData] = useState<ChartData>({
    times: [],
    prices: [],
    maShort: [],
    maLong: [],
    buySignals: [],
    sellSignals: [],
  });

  const [chartAnalysis, setChartAnalysis] = useState<ChartAnalysis>({
    trend: 'Tendência de alta',
    strength: 65,
    signal: 'buy',
    resistance: 0,
    support: 0,
    maStatus: 'EMA curta acima da EMA longa, indicando momentum de alta',
    rsi: 58
  });

  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState<Stats>({
    profitToday: 0,
    totalProfit: 0,
    winRate: 0,
    tradesCount: 0,
  });

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      timestamp: new Date().toLocaleTimeString(),
      message: 'Bot inicializado com verificação de saldo ativada',
      type: 'info',
    }
  ]);

  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    setLogs(prev => [
      ...prev.slice(-49),
      {
        timestamp: new Date().toLocaleTimeString(),
        message,
        type
      }
    ]);
  };

  const connectToBinance = (apiKey: string, apiSecret: string) => {
    addLog(`Conectando à API da Binance...`, 'info');
    
    setTimeout(() => {
      setIsConnected(true);
      addLog(`Conectado com sucesso à API da Binance`, 'success');
      toast({
        title: "Conectado",
        description: "Conectado com sucesso à API da Binance",
      });
    }, 1500);
  };

  const toggleBot = () => {
    if (!isConnected) {
      toast({
        title: "Erro",
        description: "Por favor, conecte-se à API da Binance primeiro",
        variant: "destructive",
      });
      setApiSettingsOpen(true);
      return;
    }
    
    if (isRunning) {
      setIsRunning(false);
      addLog(`Bot parado`, 'info');
      toast({
        title: "Bot Parado",
        description: "O bot de trading foi parado",
      });
    } else {
      setIsRunning(true);
      addLog(`Bot iniciado com verificação de saldo ativada - ${botSettings.maType}${botSettings.maShort} e ${botSettings.maType}${botSettings.maLong} em ${botSettings.symbol} ${botSettings.timeframe}`, 'success');
      toast({
        title: "Bot Iniciado",
        description: `O bot de trading está agora operando ${botSettings.symbol}`,
      });
      
      simulateInitialData();
    }
  };

  const updateSettings = (key: string, value: any) => {
    setBotSettings(prev => ({
      ...prev,
      [key]: value
    }));

    if (key === 'symbol' && isRunning) {
      simulateInitialData();
    }
  };

  const saveSettings = () => {
    addLog(`Configurações atualizadas: ${botSettings.maType}${botSettings.maShort}/${botSettings.maType}${botSettings.maLong} em ${botSettings.symbol} ${botSettings.timeframe}`, 'info');
    toast({
      title: "Configurações Salvas",
      description: "As configurações do bot foram atualizadas",
    });
    
    if (isRunning) {
      simulateInitialData();
    }
  };

  const closePosition = () => {
    executeClosePosition(botSettings.symbol, setTrades, setStats, addLog);
  };

  const analyzeChart = () => {
    try {
      const analysis = analyzeChartUtil(chartData, botSettings);
      setChartAnalysis(analysis);
      setAnalysisOpen(true);
      addLog(`Análise técnica realizada para ${botSettings.symbol}`, 'info');
    } catch (error) {
      toast({
        title: "Erro na Análise",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    }
  };

  const simulateInitialData = () => {
    const basePrices = generateSimulatedPrices(100);
    const times = generateTimeLabels(100);
    
    const maShort = calculateMA(basePrices, botSettings.maShort);
    const maLong = calculateMA(basePrices, botSettings.maLong);
    
    const { buySignals, sellSignals } = detectSignals(
      basePrices,
      maShort,
      maLong,
      times,
      botSettings.maLong
    );
    
    setChartData({
      times,
      prices: basePrices,
      maShort,
      maLong,
      buySignals,
      sellSignals
    });
    
    const historicalTrades = simulateHistoricalTrades(
      buySignals,
      sellSignals,
      times,
      botSettings.investment
    );
    
    setTrades(historicalTrades);
    
    const calculatedStats = calculateStatsFromTrades(historicalTrades);
    setStats(calculatedStats as Stats);
    
    addLog(`Dados históricos carregados: ${historicalTrades.length} trades simulados`, 'info');
    startDataSimulation();
  };

  const startDataSimulation = () => {
    let intervalId: NodeJS.Timeout;
    
    const runSimulation = () => {
      if (!isRunning) {
        if (intervalId) clearInterval(intervalId);
        return;
      }
      
      setChartData(prev => {
        const lastPrice = prev.prices[prev.prices.length - 1] || 100;
        const change = (Math.random() - 0.5) * 4;
        const newPrice = Math.max(lastPrice + change, 10);
        
        const now = new Date().toLocaleTimeString();
        const newTimes = [...prev.times.slice(1), now];
        const newPrices = [...prev.prices.slice(1), newPrice];
        
        const newMaShort = calculateMA(newPrices, botSettings.maShort);
        const newMaLong = calculateMA(newPrices, botSettings.maLong);
        
        let newBuySignals = [...prev.buySignals];
        let newSellSignals = [...prev.sellSignals];
        
        const currentShort = newMaShort[newMaShort.length - 1];
        const currentLong = newMaLong[newMaLong.length - 1];
        const prevShort = newMaShort[newMaShort.length - 2];
        const prevLong = newMaLong[newMaLong.length - 2];
        
        if (currentShort && currentLong && prevShort && prevLong) {
          // Sinal de compra: MA curta cruza acima da MA longa E não está em posição
          if (prevShort <= prevLong && currentShort > currentLong && !inPosition) {
            newBuySignals = [...newBuySignals, { time: now, price: newPrice }];
            addLog(`SINAL DETECTADO: Cruzamento de alta - ${botSettings.maType}${botSettings.maShort} acima de ${botSettings.maType}${botSettings.maLong}`, 'warning');
            
            // Executa a compra com verificação de saldo
            setTimeout(() => handleBuySignal(newPrice, botSettings.investment, botSettings.symbol, setTrades, addLog), 100);
            
          // Sinal de venda: MA curta cruza abaixo da MA longa E está em posição
          } else if (prevShort >= prevLong && currentShort < currentLong && inPosition) {
            newSellSignals = [...newSellSignals, { time: now, price: newPrice }];
            addLog(`SINAL DETECTADO: Cruzamento de baixa - ${botSettings.maType}${botSettings.maShort} abaixo de ${botSettings.maType}${botSettings.maLong}`, 'warning');
            
            setTimeout(() => closePosition(), 100);
          }
        }
        
        // Atualiza dados da posição se estiver em posição
        if (inPosition) {
          updatePositionData(newPrice);
        }
        
        return {
          times: newTimes,
          prices: newPrices,
          maShort: newMaShort,
          maLong: newMaLong,
          buySignals: newBuySignals,
          sellSignals: newSellSignals
        };
      });
    };

    runSimulation();
    intervalId = setInterval(runSimulation, botSettings.checkInterval * 1000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  };

  useEffect(() => {
    return () => {
      // Cleanup if necessary
    };
  }, [isRunning]);

  return {
    isRunning,
    setIsRunning,
    isConnected,
    setIsConnected,
    apiSettingsOpen,
    setApiSettingsOpen,
    inPosition,
    setInPosition: () => {}, // Not used externally
    analysisOpen,
    setAnalysisOpen,
    botSettings,
    setBotSettings,
    positionData,
    setPositionData: () => {}, // Not used externally
    chartData,
    setChartData,
    chartAnalysis,
    setChartAnalysis,
    trades,
    setTrades,
    stats,
    setStats,
    logs,
    setLogs,
    connectToBinance,
    toggleBot,
    updateSettings,
    saveSettings,
    addLog,
    closePosition,
    analyzeChart
  };
}
