
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface APISettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (apiKey: string, apiSecret: string) => void;
  isConnected: boolean;
}

const APISettings: React.FC<APISettingsProps> = ({
  open,
  onOpenChange,
  onConnect,
  isConnected
}) => {
  const [apiKey, setApiKey] = useState('');
  const [apiSecret, setApiSecret] = useState('');
  const { toast } = useToast();

  const handleConnect = () => {
    if (!apiKey || !apiSecret) {
      toast({
        title: "Erro",
        description: "API Key e Secret Key são obrigatórios",
        variant: "destructive"
      });
      return;
    }
    
    // Conectar à API da Binance
    onConnect(apiKey, apiSecret);
    
    toast({
      title: "Sucesso",
      description: "Credenciais da API salvas",
      variant: "default"
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Configurações da API da Binance</DialogTitle>
        <DialogDescription>
          Digite suas credenciais da API da Binance para se conectar à sua conta.
          {isConnected && " Sua API está conectada no momento."}
        </DialogDescription>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input 
              id="apiKey" 
              type="password" 
              placeholder="Digite sua API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiSecret">API Secret</Label>
            <Input 
              id="apiSecret" 
              type="password"
              placeholder="Digite sua API Secret"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Sua API key deve ter as seguintes permissões:</p>
            <ul className="list-disc ml-5 mt-1">
              <li>Leitura de Informações</li>
              <li>Trading Spot & Margin</li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleConnect}>
            {isConnected ? "Atualizar" : "Conectar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default APISettings;
