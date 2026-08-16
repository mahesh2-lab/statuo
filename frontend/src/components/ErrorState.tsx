import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Failed to load data',
  message = 'An unexpected error occurred while communicating with the server. Please try again.',
  onRetry,
  className = '',
}) => {
  return (
    <Card className={`border border-destructive/30 bg-destructive/5 p-6 sm:p-8 text-center rounded-none shadow-none flex flex-col items-center justify-center gap-0 ${className}`}>
      <div className="w-10 h-10 rounded-none bg-destructive/10 border border-destructive/30 flex items-center justify-center text-destructive mb-3">
        <AlertCircle className="w-5 h-5" />
      </div>
      <h3 className="text-sm font-bold text-foreground font-sans">
        {title}
      </h3>
      <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-4 font-sans">
        {message}
      </p>
      {onRetry && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRetry}
          className="text-xs font-mono border-border hover:border-foreground"
        >
          <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
          <span>Retry Request</span>
        </Button>
      )}
    </Card>
  );
};
