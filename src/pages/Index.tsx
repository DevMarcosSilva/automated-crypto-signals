
import React, { useState, useEffect } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import PriceChart from '@/components/PriceChart';
import BotControls from '@/components/BotControls';
import PositionInfo from '@/components/PositionInfo';
import TradeHistory, { Trade } from '@/components/TradeHistory';
import LogConsole from '@/components/LogConsole';
import APISettings from '@/components/APISettings';
import DashboardStats from '@/components/DashboardStats';
import { useToast } from '@/hooks/use-toast';
import { Button } from "@/components/ui/button";

const Index = () => {
  const { toast } = useToast();
  const [isRunning, setIsRunning] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [apiSettingsOpen, setApiSettingsOpen] = useState(false);
  const [inPosition, setInPosition] = useState(false);
  
  // Bot settings
  const [botSettings, setBotSettings] = useState({
    symbol: 'SOLUSDT',
    timeframe: '15m',
    maShort: 7,
    maLong: 40,
    maType: 'EMA',
    investment: 0.10,
    checkInterval: 30,
  });

  // Demo position data
  const [positionData, setPositionData] = useState({
    quantity: 0,
    entryPrice: 0,
    currentPrice: 0,
    pnl: 0,
    pnlPercentage: 0,
  });

  // Demo chart data
  const [chartData, setChartData] = useState({
    times: [],
    prices: [],
    maShort: [],
    maLong: [],
    buySignals: [],
    sellSignals: [],
  });

  // Demo trade history
  const [trades, setTrades] = useState<Trade[]>([]);

  // Demo stats
  const [stats, setStats] = useState({
    profitToday: 0,
    totalProfit: 0,
    winRate: 0,
    tradesCount: 0,
  });

  // Demo logs
  const [logs, setLogs] = useState([
    {
      timestamp: new Date().toLocaleTimeString(),
      message: 'Bot initialized',
      type: 'info' as const,
    }
  ]);

  // Connect to Binance API
  const connectToBinance = (apiKey: string, apiSecret: string) => {
    // Simulating API connection (in a real app this would call the actual Binance API)
    addLog(`Connecting to Binance API...`, 'info');
    
    setTimeout(() => {
      setIsConnected(true);
      addLog(`Successfully connected to Binance API`, 'success');
      toast({
        title: "Connected",
        description: "Successfully connected to Binance API",
      });
    }, 1500);
  };

  // Toggle bot running state
  const toggleBot = () => {
    if (!isConnected) {
      toast({
        title: "Error",
        description: "Please connect to Binance API first",
        variant: "destructive",
      });
      setApiSettingsOpen(true);
      return;
    }
    
    if (isRunning) {
      setIsRunning(false);
      addLog(`Bot stopped`, 'info');
      toast({
        title: "Bot Stopped",
        description: "Trading bot has been stopped",
      });
    } else {
      setIsRunning(true);
      addLog(`Bot started with ${botSettings.maType}${botSettings.maShort} and ${botSettings.maType}${botSettings.maLong} on ${botSettings.symbol} ${botSettings.timeframe}`, 'success');
      toast({
        title: "Bot Started",
        description: `Trading bot is now running on ${botSettings.symbol}`,
      });
      
      // Simulate receiving initial data
      simulateInitialData();
    }
  };

  // Update bot settings
  const updateSettings = (key: string, value: any) => {
    setBotSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Save bot settings
  const saveSettings = () => {
    addLog(`Settings updated: ${botSettings.maType}${botSettings.maShort}/${botSettings.maType}${botSettings.maLong} on ${botSettings.symbol} ${botSettings.timeframe}`, 'info');
    toast({
      title: "Settings Saved",
      description: "Bot settings have been updated",
    });
    
    // Simulate receiving new data with updated settings
    if (isRunning) {
      simulateInitialData();
    }
  };

  // Add log entry
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

  // Close position
  const closePosition = () => {
    if (!inPosition) return;
    
    addLog(`Closing position: ${positionData.quantity.toFixed(4)} ${botSettings.symbol.replace('USDT', '')} at $${positionData.currentPrice.toFixed(2)}`, 'info');
    
    // Calculate profit/loss
    const profit = positionData.pnl;
    
    // Add trade to history
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
    
    // Update stats
    setStats(prev => ({
      ...prev,
      profitToday: prev.profitToday + profit,
      totalProfit: prev.totalProfit + profit,
      tradesCount: prev.tradesCount + 1,
      winRate: prev.tradesCount > 0 
        ? ((prev.winRate * (prev.tradesCount - 1) + (profit > 0 ? 100 : 0)) / prev.tradesCount) 
        : (profit > 0 ? 100 : 0)
    }));
    
    // Reset position
    setInPosition(false);
    setPositionData({
      quantity: 0,
      entryPrice: 0,
      currentPrice: 0,
      pnl: 0,
      pnlPercentage: 0,
    });
    
    toast({
      title: "Position Closed",
      description: `Position closed with ${profit > 0 ? 'profit' : 'loss'}: ${profit.toFixed(2)} USDT`,
      variant: profit > 0 ? "default" : "destructive",
    });
  };

  // Simulate initial data
  const simulateInitialData = () => {
    // Create random price data
    const basePrices = Array.from({ length: 100 }, (_, i) => 
      Math.sin(i * 0.1) * 10 + Math.random() * 5 + 100
    );
    
    // Timestamps
    const now = Date.now();
    const times = Array.from({ length: 100 }, (_, i) => 
      new Date(now - (99 - i) * 15 * 60 * 1000).toLocaleTimeString()
    );
    
    // Simple calculation for moving averages
    const maShort = calculateMA(basePrices, botSettings.maShort);
    const maLong = calculateMA(basePrices, botSettings.maLong);
    
    // Generate some signals
    const buySignals = [
      { time: times[30], price: basePrices[30] },
      { time: times[60], price: basePrices[60] },
      { time: times[85], price: basePrices[85] }
    ];
    
    const sellSignals = [
      { time: times[45], price: basePrices[45] },
      { time: times[75], price: basePrices[75] }
    ];
    
    // Set chart data
    setChartData({
      times,
      prices: basePrices,
      maShort,
      maLong,
      buySignals,
      sellSignals
    });
    
    // Add some initial trades
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
    
    // Start simulation of live data updates
    startDataSimulation();
  };

  // Helper to calculate moving average
  const calculateMA = (prices: number[], period: number) => {
    return prices.map((_, i, arr) => {
      if (i < period - 1) return null;
      const slice = arr.slice(i - period + 1, i + 1);
      return slice.reduce((a, b) => a + b, 0) / period;
    });
  };

  // Simulate live data updates
  const startDataSimulation = () => {
    const interval = setInterval(() => {
      if (!isRunning) {
        clearInterval(interval);
        return;
      }
      
      // Update chart with new price
      setChartData(prev => {
        const lastPrice = prev.prices[prev.prices.length - 1];
        const change = (Math.random() - 0.5) * 2; // Random change between -1 and 1
        const newPrice = lastPrice + change;
        
        // New data point
        const now = new Date().toLocaleTimeString();
        const newTimes = [...prev.times.slice(1), now];
        const newPrices = [...prev.prices.slice(1), newPrice];
        
        // Update MAs
        const newMaShort = calculateMA(newPrices, botSettings.maShort);
        const newMaLong = calculateMA(newPrices, botSettings.maLong);
        
        // Check for new signals (simplified logic)
        let newBuySignals = [...prev.buySignals];
        let newSellSignals = [...prev.sellSignals];
        
        const shouldGenerateSignal = Math.random() > 0.85; // 15% chance of signal
        
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
        
        // If in position, update position data
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
      
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  };

  // Handle buy signal
  const handleBuySignal = (price: number) => {
    if (inPosition) return;
    
    const quantity = botSettings.investment / price;
    
    // Add to trade history
    const newTrade: Trade = {
      id: `buy-${Date.now()}`,
      time: new Date().toLocaleString(),
      type: 'BUY',
      price,
      amount: quantity,
      total: botSettings.investment
    };
    
    setTrades(prev => [newTrade, ...prev]);
    
    // Update position
    setInPosition(true);
    setPositionData({
      quantity,
      entryPrice: price,
      currentPrice: price,
      pnl: 0,
      pnlPercentage: 0
    });
    
    addLog(`BUY SIGNAL: Bought ${quantity.toFixed(4)} ${botSettings.symbol.replace('USDT', '')} at $${price.toFixed(2)}`, 'success');
    
    toast({
      title: "Buy Signal",
      description: `Bought ${quantity.toFixed(4)} ${botSettings.symbol.replace('USDT', '')} at $${price.toFixed(2)}`,
    });
    
    // Update stats
    setStats(prev => ({
      ...prev,
      tradesCount: prev.tradesCount + 1
    }));
  };

  // Update position data with new price
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

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-6">
        <DashboardHeader
          isRunning={isRunning}
          toggleBot={toggleBot}
          openSettings={() => setApiSettingsOpen(true)}
        />
        
        <DashboardStats
          profitToday={stats.profitToday}
          totalProfit={stats.totalProfit}
          winRate={stats.winRate}
          tradesCount={stats.tradesCount}
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">
          <PriceChart 
            data={chartData} 
            symbol={botSettings.symbol}
            maShort={botSettings.maShort}
            maLong={botSettings.maLong}
            maType={botSettings.maType}
          />
          
          <div className="space-y-6">
            <PositionInfo
              isConnected={isConnected}
              inPosition={inPosition}
              symbol={botSettings.symbol}
              positionData={positionData}
              onClosePosition={closePosition}
            />
            
            <BotControls
              settings={botSettings}
              updateSettings={updateSettings}
              saveSettings={saveSettings}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <TradeHistory trades={trades} />
          <LogConsole logs={logs} />
        </div>
      </div>
      
      <APISettings
        open={apiSettingsOpen}
        onOpenChange={setApiSettingsOpen}
        onConnect={connectToBinance}
        isConnected={isConnected}
      />
    </div>
  );
};

export default Index;
