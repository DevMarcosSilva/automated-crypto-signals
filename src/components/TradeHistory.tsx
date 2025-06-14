
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

export interface Trade {
  id: string;
  time: string;
  type: 'BUY' | 'SELL';
  price: number;
  amount: number;
  total: number;
  profit?: number;
}

interface TradeHistoryProps {
  trades: Trade[];
}

const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Histórico de Trades</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Preço</TableHead>
                <TableHead className="text-right">Quantidade</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">L/P</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trades.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    Nenhum trade ainda
                  </TableCell>
                </TableRow>
              ) : (
                trades.map((trade) => (
                  <TableRow key={trade.id}>
                    <TableCell className="font-mono">{trade.time}</TableCell>
                    <TableCell className={trade.type === 'BUY' ? 'text-accent' : 'text-destructive'}>
                      {trade.type === 'BUY' ? 'COMPRA' : 'VENDA'}
                    </TableCell>
                    <TableCell>${trade.price.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{trade.amount.toFixed(4)}</TableCell>
                    <TableCell className="text-right">${trade.total.toFixed(2)}</TableCell>
                    <TableCell className={`text-right ${trade.profit && trade.profit > 0 ? 'profit' : trade.profit && trade.profit < 0 ? 'loss' : ''}`}>
                      {trade.profit ? `${trade.profit > 0 ? '+' : ''}${trade.profit.toFixed(2)}%` : '-'}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default TradeHistory;
