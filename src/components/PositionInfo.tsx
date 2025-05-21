
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PositionInfoProps {
  isConnected: boolean;
  inPosition: boolean;
  symbol: string;
  positionData: {
    quantity: number;
    entryPrice: number;
    currentPrice: number;
    pnl: number;
    pnlPercentage: number;
  };
  onClosePosition: () => void;
}

const PositionInfo: React.FC<PositionInfoProps> = ({
  isConnected,
  inPosition,
  symbol,
  positionData,
  onClosePosition
}) => {
  const asset = symbol.replace('USDT', '');
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          Current Position
          {isConnected ? (
            <Badge variant="outline" className="bg-accent/20 text-accent border-accent">
              Connected
            </Badge>
          ) : (
            <Badge variant="outline" className="bg-destructive/20 text-destructive border-destructive">
              Not Connected
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!isConnected ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">Connect your Binance API to start trading</p>
          </div>
        ) : !inPosition ? (
          <div className="text-center py-4">
            <p className="text-muted-foreground">No open position</p>
            <p className="text-sm text-muted-foreground mt-2">Waiting for signals...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Asset</p>
                <p className="font-semibold">{asset}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Quantity</p>
                <p className="font-semibold">{positionData.quantity.toFixed(4)} {asset}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Entry Price</p>
                <p className="font-semibold">${positionData.entryPrice.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Price</p>
                <p className="font-semibold">${positionData.currentPrice.toFixed(2)}</p>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Unrealized P/L</p>
              <div className="flex justify-between items-center">
                <p className={`font-semibold ${positionData.pnl >= 0 ? 'profit' : 'loss'}`}>
                  ${positionData.pnl.toFixed(2)} ({positionData.pnl >= 0 ? '+' : ''}{positionData.pnlPercentage.toFixed(2)}%)
                </p>
                <Button variant="destructive" size="sm" onClick={onClosePosition}>
                  Close Position
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PositionInfo;
