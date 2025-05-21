
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

// Define types for our hook
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

export function useTradingBot() {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [apiSettingsOpen, setApiSettingsOpen] = useState(false);
  const [inPosition, setInPosition] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  
  // Configurações do bot
  const [botSettings, setBotSettings] = useState<BotSettings>({
    symbol: 'SOLUSDT',
    timeframe: '15m',
    maShort: 7,
    maLong: 40,
    maType: 'EMA',
    investment: 0.10,
    checkInterval: 30,
  });

  // Dados da posição de demonstração
  const [positionData, setPositionData] = useState<PositionData>({
    quantity: 0,
    entryPrice: 0,
    currentPrice: 0,
    pnl: 0,
    pnlPercentage: 0,
  });

  // Dados do gráfico de demonstração
  const [chartData, setChartData] = useState<ChartData>({
    times: [],
    prices: [],
    maShort: [],
    maLong: [],
    buySignals: [],
    sellSignals: [],
  });

  // Dados da análise do gráfico
  const [chartAnalysis, setChartAnalysis] = useState<ChartAnalysis>({
    trend: 'Tendência de alta',
    strength: 65,
    signal: 'buy',
    resistance: 0,
    support: 0,
    maStatus: 'EMA curta acima da EMA longa, indicando momentum de alta',
    rsi: 58
  });

  // Histórico de trades de demonstração
  const [trades, setTrades] = useState<Trade[]>([]);

  // Estatísticas de demonstração
  const [stats, setStats] = useState<Stats>({
    profitToday: 0,
    totalProfit: 0,
    winRate: 0,
    tradesCount: 0,
  });

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      timestamp: new Date().toLocaleTimeString(),
      message: 'Bot inicializado',
      type: 'info',
    }
  ]);

  // Conectar à API da Binance
  const connectToBinance = (apiKey: string, apiSecret: string) => {
    // Simulando conexão com a API (em um app real, isso chamaria a API real da Binance)
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

  // Alternar estado de execução do bot
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
      addLog(`Bot iniciado com ${botSettings.maType}${botSettings.maShort} e ${botSettings.maType}${botSettings.maLong} em ${botSettings.symbol} ${botSettings.timeframe}`, 'success');
      toast({
        title: "Bot Iniciado",
        description: `O bot de trading está agora operando ${botSettings.symbol}`,
      });
      
      // Simular recebimento de dados iniciais
      simulateInitialData();
    }
  };

  // Atualizar configurações do bot
  const updateSettings = (key: string, value: any) => {
    setBotSettings(prev => ({
      ...prev,
      [key]: value
    }));

    // Se a moeda foi alterada, atualize os dados
    if (key === 'symbol' && isRunning) {
      simulateInitialData();
    }
  };

  // Salvar configurações do bot
  const saveSettings = () => {
    addLog(`Configurações atualizadas: ${botSettings.maType}${botSettings.maShort}/${botSettings.maType}${botSettings.maLong} em ${botSettings.symbol} ${botSettings.timeframe}`, 'info');
    toast({
      title: "Configurações Salvas",
      description: "As configurações do bot foram atualizadas",
    });
    
    // Simular recebimento de novos dados com configurações atualizadas
    if (isRunning) {
      simulateInitialData();
    }
  };

  // Adicionar entrada de log
  const addLog = (message: string, type: 'info' | 'success' | 'error' | 'warning' = 'info') => {
    setLogs(prev => [
      ...prev, 
      {
        timestamp: new Date().toLocaleTimeString(),
        message,
        type
      }
    ]);
  };

  // Fechar posição
  const closePosition = () => {
    if (!inPosition) return;
    
    addLog(`Fechando posição: ${positionData.quantity.toFixed(4)} ${botSettings.symbol.replace('USDT', '')} a $${positionData.currentPrice.toFixed(2)}`, 'info');
    
    // Calcular lucro/perda
    const profit = positionData.pnl;
    
    // Adicionar trade ao histórico
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
    
    // Atualizar estatísticas
    setStats(prev => ({
      ...prev,
      profitToday: prev.profitToday + profit,
      totalProfit: prev.totalProfit + profit,
      tradesCount: prev.tradesCount + 1,
      winRate: prev.tradesCount > 0 
        ? ((prev.winRate * (prev.tradesCount - 1) + (profit > 0 ? 100 : 0)) / prev.tradesCount) 
        : (profit > 0 ? 100 : 0)
    }));
    
    // Resetar posição
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

  // Analisar o gráfico atual
  const analyzeChart = () => {
    if (chartData.prices.length === 0) {
      toast({
        title: "Erro na Análise",
        description: "Não há dados suficientes para análise",
        variant: "destructive",
      });
      return;
    }

    // Calcular valores para a análise
    const currentPrice = chartData.prices[chartData.prices.length - 1];
    const prices = [...chartData.prices];
    
    // Valores de suporte e resistência simplificados
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const resistance = currentPrice + (maxPrice - currentPrice) * 0.5;
    const support = currentPrice - (currentPrice - minPrice) * 0.5;
    
    // Determinar a tendência baseada nas médias móveis
    const lastMaShort = chartData.maShort[chartData.maShort.length - 1];
    const lastMaLong = chartData.maLong[chartData.maLong.length - 1];
    
    let trend = 'Lateral';
    let signal: 'buy' | 'sell' | 'neutral' = 'neutral';
    let strength = 50;
    let maStatus = 'Médias móveis em equilíbrio';
    
    // Lógica simplificada para análise
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
    
    // Calcular RSI simplificado
    const rsi = 40 + Math.floor(Math.random() * 30); // Simulando um RSI entre 40-70
    
    // Atualizar o estado da análise
    setChartAnalysis({
      trend,
      strength,
      signal,
      resistance,
      support,
      maStatus,
      rsi
    });
    
    // Abrir a caixa de diálogo de análise
    setAnalysisOpen(true);
    
    addLog(`Análise técnica realizada para ${botSettings.symbol}`, 'info');
  };

  // Simular dados iniciais
  const simulateInitialData = () => {
    // Criar dados de preço aleatórios
    const basePrices = Array.from({ length: 100 }, (_, i) => 
      Math.sin(i * 0.1) * 10 + Math.random() * 5 + 100
    );
    
    // Timestamps
    const now = Date.now();
    const times = Array.from({ length: 100 }, (_, i) => 
      new Date(now - (99 - i) * 15 * 60 * 1000).toLocaleTimeString()
    );
    
    // Cálculo simples para médias móveis
    const maShort = calculateMA(basePrices, botSettings.maShort);
    const maLong = calculateMA(basePrices, botSettings.maLong);
    
    // Gerar alguns sinais
    const buySignals = [
      { time: times[30], price: basePrices[30] },
      { time: times[60], price: basePrices[60] },
      { time: times[85], price: basePrices[85] }
    ];
    
    const sellSignals = [
      { time: times[45], price: basePrices[45] },
      { time: times[75], price: basePrices[75] }
    ];
    
    // Configurar dados do gráfico
    setChartData({
      times,
      prices: basePrices,
      maShort,
      maLong,
      buySignals,
      sellSignals
    });
    
    // Adicionar alguns trades iniciais
    const initialTrades: Trade[] = [
      {
        id: 'buy-1',
        time: times[30],
        type: 'BUY',
        price: basePrices[30],
        amount: botSettings.investment / basePrices[30],
        total: botSettings.investment,
      },
      {
        id: 'sell-1',
        time: times[45],
        type: 'SELL',
        price: basePrices[45],
        amount: botSettings.investment / basePrices[30],
        total: (botSettings.investment / basePrices[30]) * basePrices[45],
        profit: ((basePrices[45] - basePrices[30]) / basePrices[30]) * 100
      }
    ];
    
    setTrades(initialTrades);
    
    // Iniciar simulação de atualizações de dados em tempo real
    startDataSimulation();
  };

  // Auxiliar para calcular média móvel
  const calculateMA = (prices: number[], period: number) => {
    return prices.map((_, i, arr) => {
      if (i < period - 1) return null;
      const slice = arr.slice(i - period + 1, i + 1);
      return slice.reduce((a, b) => a + b, 0) / period;
    });
  };

  // Simular atualizações de dados em tempo real
  const startDataSimulation = () => {
    const interval = setInterval(() => {
      if (!isRunning) {
        clearInterval(interval);
        return;
      }
      
      // Atualizar gráfico com novo preço
      setChartData(prev => {
        const lastPrice = prev.prices[prev.prices.length - 1];
        const change = (Math.random() - 0.5) * 2; // Mudança aleatória entre -1 e 1
        const newPrice = lastPrice + change;
        
        // Novo ponto de dados
        const now = new Date().toLocaleTimeString();
        const newTimes = [...prev.times.slice(1), now];
        const newPrices = [...prev.prices.slice(1), newPrice];
        
        // Atualizar MAs
        const newMaShort = calculateMA(newPrices, botSettings.maShort);
        const newMaLong = calculateMA(newPrices, botSettings.maLong);
        
        // Verificar novos sinais (lógica simplificada)
        let newBuySignals = [...prev.buySignals];
        let newSellSignals = [...prev.sellSignals];
        
        const shouldGenerateSignal = Math.random() > 0.85; // 15% de chance de sinal
        
        if (shouldGenerateSignal) {
          const isBuySignal = Math.random() > 0.5;
          
          if (isBuySignal && !inPosition) {
            newBuySignals = [...newBuySignals, { time: now, price: newPrice }];
            handleBuySignal(newPrice);
          } else if (!isBuySignal && inPosition) {
            newSellSignals = [...newSellSignals, { time: now, price: newPrice }];
            closePosition();
          }
        }
        
        // Se estiver em posição, atualizar os dados da posição
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
      
    }, 5000); // Atualizar a cada 5 segundos

    return () => clearInterval(interval);
  };

  // Lidar com sinal de compra
  const handleBuySignal = (price: number) => {
    if (inPosition) return;
    
    const quantity = botSettings.investment / price;
    
    // Adicionar ao histórico de trades
    const newTrade: Trade = {
      id: `buy-${Date.now()}`,
      time: new Date().toLocaleString(),
      type: 'BUY',
      price,
      amount: quantity,
      total: botSettings.investment
    };
    
    setTrades(prev => [newTrade, ...prev]);
    
    // Atualizar posição
    setInPosition(true);
    setPositionData({
      quantity,
      entryPrice: price,
      currentPrice: price,
      pnl: 0,
      pnlPercentage: 0
    });
    
    addLog(`SINAL DE COMPRA: Comprado ${quantity.toFixed(4)} ${botSettings.symbol.replace('USDT', '')} a $${price.toFixed(2)}`, 'success');
    
    toast({
      title: "Sinal de Compra",
      description: `Comprado ${quantity.toFixed(4)} ${botSettings.symbol.replace('USDT', '')} a $${price.toFixed(2)}`,
    });
    
    // Atualizar estatísticas
    setStats(prev => ({
      ...prev,
      tradesCount: prev.tradesCount + 1
    }));
  };

  // Atualizar dados da posição com novo preço
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
    isRunning,
    setIsRunning,
    isConnected,
    setIsConnected,
    apiSettingsOpen,
    setApiSettingsOpen,
    inPosition,
    setInPosition,
    analysisOpen,
    setAnalysisOpen,
    botSettings,
    setBotSettings,
    positionData,
    setPositionData,
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
