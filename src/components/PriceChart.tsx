
import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from 'recharts';
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import { Badge } from "@/components/ui/badge";

interface ChartData {
  times: string[];
  prices: number[];
  maShort: number[];
  maLong: number[];
  buySignals: { time: string, price: number }[];
  sellSignals: { time: string, price: number }[];
}

interface PriceChartProps {
  data: ChartData;
  symbol: string;
  maShort: number;
  maLong: number;
  maType: string;
  onAnalyzeChart: () => void;
}

const PriceChart: React.FC<PriceChartProps> = ({ 
  data, 
  symbol,
  maShort,
  maLong,
  maType,
  onAnalyzeChart
}) => {
  // Transformar os dados para o formato do recharts
  const chartData = data.times.map((time, index) => {
    return {
      time,
      price: data.prices[index],
      maShort: data.maShort[index],
      maLong: data.maLong[index],
    };
  });

  const formattedData = chartData.filter(item => item.maShort !== null && item.maLong !== null);

  return (
    <Card className="col-span-3">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Gráfico de Preço - {symbol}</CardTitle>
          <Button variant="outline" size="sm" onClick={onAnalyzeChart}>
            Analisar Gráfico
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {formattedData.length > 0 ? (
          <ChartContainer 
            config={{
              price: { theme: { light: "#1D4ED8", dark: "#60A5FA" } },
              maShort: { theme: { light: "#059669", dark: "#10B981" } },
              maLong: { theme: { light: "#DC2626", dark: "#EF4444" } },
            }}
            className="h-[220px]"
          >
            <AreaChart
              data={formattedData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#60A5FA" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#60A5FA" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="time" 
                tickFormatter={(value) => value.slice(-5)} 
                tick={{ fontSize: 10 }} 
                minTickGap={10}
              />
              <YAxis 
                tickFormatter={(value) => `$${value.toFixed(2)}`} 
                domain={['auto', 'auto']} 
                tick={{ fontSize: 10 }}
              />
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <Tooltip content={<ChartTooltipContent />} />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke="var(--color-price)" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorPrice)" 
              />
              <Area 
                type="monotone" 
                dataKey="maShort" 
                stroke="var(--color-maShort)" 
                strokeWidth={1.5}
                fill="none"
              />
              <Area 
                type="monotone" 
                dataKey="maLong" 
                stroke="var(--color-maLong)" 
                strokeWidth={1.5}
                fill="none"
              />
              
              {data.buySignals.map((signal, index) => {
                const signalIndex = data.times.findIndex(time => time === signal.time);
                if (signalIndex === -1) return null;
                return (
                  <ReferenceDot
                    key={`buy-${index}`}
                    x={data.times[signalIndex]}
                    y={signal.price}
                    r={5}
                    fill="green"
                    stroke="white"
                  />
                );
              })}
              
              {data.sellSignals.map((signal, index) => {
                const signalIndex = data.times.findIndex(time => time === signal.time);
                if (signalIndex === -1) return null;
                return (
                  <ReferenceDot
                    key={`sell-${index}`}
                    x={data.times[signalIndex]}
                    y={signal.price}
                    r={5}
                    fill="red"
                    stroke="white"
                  />
                );
              })}
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="chart-container bg-card p-4 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">Visualização do gráfico aparecerá aqui</p>
              <p className="text-sm text-muted-foreground">Usando {maType} com períodos {maShort} e {maLong}</p>
              {data.buySignals.length > 0 && (
                <div className="mt-4">
                  <p className="text-accent">Último Sinal de Compra: {data.buySignals[data.buySignals.length - 1]?.time || 'Nenhum'}</p>
                </div>
              )}
              {data.sellSignals.length > 0 && (
                <div className="mt-2">
                  <p className="text-destructive">Último Sinal de Venda: {data.sellSignals[data.sellSignals.length - 1]?.time || 'Nenhum'}</p>
                </div>
              )}
            </div>
          </div>
        )}
        <div className="flex justify-between mt-2 text-sm text-muted-foreground">
          <span>Preço: ${data.prices[data.prices.length - 1]?.toFixed(2) || '0.00'}</span>
          <span>{maType}{maShort}: ${data.maShort[data.maShort.length - 1]?.toFixed(2) || '0.00'}</span>
          <span>{maType}{maLong}: ${data.maLong[data.maLong.length - 1]?.toFixed(2) || '0.00'}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default PriceChart;
