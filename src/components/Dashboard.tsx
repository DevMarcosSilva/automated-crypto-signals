
import React from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import PriceChart from '@/components/PriceChart';
import BotControls from '@/components/BotControls';
import PositionInfo from '@/components/PositionInfo';
import TradeHistory from '@/components/TradeHistory';
import LogConsole from '@/components/LogConsole';
import APISettings from '@/components/APISettings';
import DashboardStats from '@/components/DashboardStats';
import ChartAnalysisResult from '@/components/ChartAnalysisResult';
import { useTradingBot } from '@/hooks/useTradingBot';

const Dashboard: React.FC = () => {
  const {
    isRunning,
    isConnected,
    apiSettingsOpen,
    setApiSettingsOpen,
    inPosition,
    analysisOpen,
    setAnalysisOpen,
    botSettings,
    positionData,
    chartData,
    chartAnalysis,
    trades,
    stats,
    logs,
    connectToBinance,
    toggleBot,
    updateSettings,
    saveSettings,
    closePosition,
    analyzeChart
  } = useTradingBot();

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
            onAnalyzeChart={analyzeChart}
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
      
      <ChartAnalysisResult
        open={analysisOpen}
        onOpenChange={setAnalysisOpen}
        symbol={botSettings.symbol}
        trend={chartAnalysis.trend}
        strength={chartAnalysis.strength}
        signal={chartAnalysis.signal}
        resistance={chartAnalysis.resistance}
        support={chartAnalysis.support}
        maStatus={chartAnalysis.maStatus}
        rsi={chartAnalysis.rsi}
      />
    </div>
  );
};

export default Dashboard;
