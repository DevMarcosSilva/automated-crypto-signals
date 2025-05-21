
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'error' | 'warning';
}

interface LogConsoleProps {
  logs: LogEntry[];
}

const LogConsole: React.FC<LogConsoleProps> = ({ logs }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-accent';
      case 'error': return 'text-destructive';
      case 'warning': return 'text-yellow-500';
      default: return 'text-foreground';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Bot Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[200px] rounded-md border bg-secondary/30 p-2">
          <div className="font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-muted-foreground p-2">No logs yet</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className={`mb-1 ${getLogColor(log.type)}`}>
                  <span className="text-muted-foreground">[{log.timestamp}]</span> {log.message}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default LogConsole;
