
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface DashboardHeaderProps {
  isRunning: boolean;
  toggleBot: () => void;
  openSettings: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  isRunning,
  toggleBot,
  openSettings
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">TraderBot</h1>
        {isRunning ? (
          <Badge variant="default" className="bg-accent hover:bg-accent">
            <span className="blinking mr-1">●</span> Running
          </Badge>
        ) : (
          <Badge variant="secondary">Stopped</Badge>
        )}
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" size="icon" onClick={openSettings}>
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Bot Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button 
          variant={isRunning ? "destructive" : "default"}
          onClick={toggleBot}
        >
          {isRunning ? "Stop Bot" : "Start Bot"}
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;
