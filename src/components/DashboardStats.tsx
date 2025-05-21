
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface DashboardStatsProps {
  profitToday: number;
  totalProfit: number;
  winRate: number;
  tradesCount: number;
}

const DashboardStats: React.FC<DashboardStatsProps> = ({
  profitToday,
  totalProfit,
  winRate,
  tradesCount
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Lucro de Hoje</p>
            <p className={`text-lg font-semibold ${profitToday >= 0 ? 'profit' : 'loss'}`}>
              {profitToday >= 0 ? '+' : ''}{profitToday.toFixed(2)} USDT
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Lucro Total</p>
            <p className={`text-lg font-semibold ${totalProfit >= 0 ? 'profit' : 'loss'}`}>
              {totalProfit >= 0 ? '+' : ''}{totalProfit.toFixed(2)} USDT
            </p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Taxa de Acerto</p>
            <p className="text-lg font-semibold">{winRate.toFixed(1)}%</p>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total de Trades</p>
            <p className="text-lg font-semibold">{tradesCount}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;
