
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ArrowUpCircle, ArrowDownCircle, TrendingUp, TrendingDown, AlertTriangle } from "lucide-react";

interface ChartAnalysisResultProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  symbol: string;
  trend: string;
  strength: number; // 0-100
  signal: 'buy' | 'sell' | 'neutral';
  resistance: number;
  support: number;
  maStatus: string;
  rsi?: number; // opcional
}

const ChartAnalysisResult: React.FC<ChartAnalysisResultProps> = ({
  open,
  onOpenChange,
  symbol,
  trend,
  strength,
  signal,
  resistance,
  support,
  maStatus,
  rsi
}) => {
  const getSignalColor = () => {
    switch (signal) {
      case 'buy': return 'text-green-500';
      case 'sell': return 'text-red-500';
      default: return 'text-yellow-500';
    }
  };

  const getSignalIcon = () => {
    switch (signal) {
      case 'buy': return <ArrowUpCircle className="h-8 w-8 text-green-500" />;
      case 'sell': return <ArrowDownCircle className="h-8 w-8 text-red-500" />;
      default: return <AlertTriangle className="h-8 w-8 text-yellow-500" />;
    }
  };

  const getTrendIcon = () => {
    if (trend.toLowerCase().includes('alta')) {
      return <TrendingUp className="h-5 w-5 text-green-500" />;
    } else if (trend.toLowerCase().includes('baixa')) {
      return <TrendingDown className="h-5 w-5 text-red-500" />;
    }
    return null;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Análise Técnica: {symbol}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4">
          <div className="flex items-center justify-center mb-2">
            {getSignalIcon()}
            <h3 className={`text-2xl font-bold ml-2 ${getSignalColor()}`}>
              {signal === 'buy' ? 'Sinal de Compra' : signal === 'sell' ? 'Sinal de Venda' : 'Neutro'}
            </h3>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <CardTitle className="text-sm mb-2 flex items-center">
                  Tendência {getTrendIcon()}
                </CardTitle>
                <p className="font-medium">{trend}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2 dark:bg-gray-700">
                  <div 
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${strength}%` }}
                  ></div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Força: {strength}%</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <CardTitle className="text-sm mb-2">Suporte/Resistência</CardTitle>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs">Resistência:</span>
                    <span className="font-medium">${resistance.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs">Suporte:</span>
                    <span className="font-medium">${support.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <CardTitle className="text-sm mb-2">Médias Móveis</CardTitle>
              <p>{maStatus}</p>
              {rsi !== undefined && (
                <div className="mt-2">
                  <p className="text-sm">RSI: <span className="font-medium">{rsi.toFixed(1)}</span></p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1 dark:bg-gray-700">
                    <div 
                      className={`h-2 rounded-full ${
                        rsi > 70 ? 'bg-red-500' : 
                        rsi < 30 ? 'bg-green-500' : 
                        'bg-yellow-500'
                      }`}
                      style={{ width: `${rsi}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Sobrevendido</span>
                    <span>Neutro</span>
                    <span>Sobrecomprado</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Fechar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChartAnalysisResult;
