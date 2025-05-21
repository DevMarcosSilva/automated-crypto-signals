
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface Coin {
  symbol: string;
  name: string;
}

interface CoinSelectDropdownProps {
  value: string;
  onValueChange: (value: string) => void;
}

const CoinSelectDropdown: React.FC<CoinSelectDropdownProps> = ({ value, onValueChange }) => {
  // Lista de criptomoedas populares
  const coins: Coin[] = [
    { symbol: 'BTCUSDT', name: 'Bitcoin' },
    { symbol: 'ETHUSDT', name: 'Ethereum' },
    { symbol: 'SOLUSDT', name: 'Solana' },
    { symbol: 'BNBUSDT', name: 'Binance Coin' },
    { symbol: 'ADAUSDT', name: 'Cardano' },
    { symbol: 'DOGEUSDT', name: 'Dogecoin' },
    { symbol: 'XRPUSDT', name: 'Ripple' },
    { symbol: 'DOTUSDT', name: 'Polkadot' },
    { symbol: 'AVAXUSDT', name: 'Avalanche' },
    { symbol: 'MATICUSDT', name: 'Polygon' },
  ];

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Selecione Moeda" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Criptomoedas Populares</SelectLabel>
          {coins.map((coin) => (
            <SelectItem key={coin.symbol} value={coin.symbol}>
              {coin.name} ({coin.symbol.replace('USDT', '')}/USDT)
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CoinSelectDropdown;
