
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface BotControlsProps {
  settings: {
    symbol: string;
    timeframe: string;
    maShort: number;
    maLong: number;
    maType: string;
    investment: number;
    checkInterval: number;
  };
  updateSettings: (key: string, value: any) => void;
  saveSettings: () => void;
}

const BotControls: React.FC<BotControlsProps> = ({ 
  settings, 
  updateSettings,
  saveSettings
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Bot Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="symbol">Trading Pair</Label>
              <Select 
                value={settings.symbol} 
                onValueChange={(value) => updateSettings('symbol', value)}
              >
                <SelectTrigger id="symbol">
                  <SelectValue placeholder="Select Symbol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SOLUSDT">SOL/USDT</SelectItem>
                  <SelectItem value="BTCUSDT">BTC/USDT</SelectItem>
                  <SelectItem value="ETHUSDT">ETH/USDT</SelectItem>
                  <SelectItem value="BNBUSDT">BNB/USDT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="timeframe">Timeframe</Label>
              <Select 
                value={settings.timeframe} 
                onValueChange={(value) => updateSettings('timeframe', value)}
              >
                <SelectTrigger id="timeframe">
                  <SelectValue placeholder="Select Timeframe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1m">1 minute</SelectItem>
                  <SelectItem value="5m">5 minutes</SelectItem>
                  <SelectItem value="15m">15 minutes</SelectItem>
                  <SelectItem value="1h">1 hour</SelectItem>
                  <SelectItem value="4h">4 hours</SelectItem>
                  <SelectItem value="1d">1 day</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="matype">MA Type</Label>
              <Select 
                value={settings.maType} 
                onValueChange={(value) => updateSettings('maType', value)}
              >
                <SelectTrigger id="matype">
                  <SelectValue placeholder="MA Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EMA">EMA</SelectItem>
                  <SelectItem value="SMA">SMA</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="mashort">Short MA</Label>
              <Input 
                id="mashort" 
                type="number" 
                min="2" 
                max="50"
                value={settings.maShort}
                onChange={(e) => updateSettings('maShort', parseInt(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="malong">Long MA</Label>
              <Input 
                id="malong" 
                type="number" 
                min="10" 
                max="200"
                value={settings.maLong}
                onChange={(e) => updateSettings('maLong', parseInt(e.target.value))}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="investment">Investment (USDT)</Label>
              <Input 
                id="investment" 
                type="number" 
                min="0.1" 
                step="0.1"
                value={settings.investment}
                onChange={(e) => updateSettings('investment', parseFloat(e.target.value))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="interval">Check Interval (seconds)</Label>
              <Input 
                id="interval" 
                type="number" 
                min="10" 
                max="300"
                value={settings.checkInterval}
                onChange={(e) => updateSettings('checkInterval', parseInt(e.target.value))}
              />
            </div>
          </div>
          
          <Button 
            className="w-full" 
            onClick={saveSettings}
          >
            Save Settings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BotControls;
