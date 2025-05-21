
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
        title: "Error",
        description: "API Key and Secret Key are required",
        variant: "destructive"
      });
      return;
    }
    
    // Connect to Binance API
    onConnect(apiKey, apiSecret);
    
    toast({
      title: "Success",
      description: "API credentials saved",
      variant: "default"
    });
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Binance API Settings</DialogTitle>
        <DialogDescription>
          Enter your Binance API credentials to connect to your account.
          {isConnected && " Your API is currently connected."}
        </DialogDescription>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="apiKey">API Key</Label>
            <Input 
              id="apiKey" 
              type="password" 
              placeholder="Enter your API Key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="apiSecret">API Secret</Label>
            <Input 
              id="apiSecret" 
              type="password"
              placeholder="Enter your API Secret"
              value={apiSecret}
              onChange={(e) => setApiSecret(e.target.value)}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Your API key should have the following permissions:</p>
            <ul className="list-disc ml-5 mt-1">
              <li>Read Information</li>
              <li>Spot & Margin Trading</li>
            </ul>
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={handleConnect}>
            {isConnected ? "Update" : "Connect"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default APISettings;
