import React, { Component, type ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Statuo Runtime Error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background text-foreground font-sans">
          <Card className="bg-card border-destructive/40 p-8 text-center max-w-md w-full rounded-none shadow-lg gap-0">
            <div className="w-12 h-12 bg-destructive/10 border border-destructive/30 text-destructive mx-auto flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h1 className="text-base font-bold text-foreground font-sans uppercase tracking-tight">
              Application Error
            </h1>
            <p className="text-xs text-muted-foreground mt-2 mb-4 font-sans leading-relaxed">
              A client-side runtime exception occurred. The error details have been logged.
            </p>
            {this.state.error && (
              <div className="p-3 bg-muted/40 border border-border text-left font-mono text-[10px] text-destructive overflow-x-auto mb-6 max-h-32">
                {this.state.error.message}
              </div>
            )}
            <Button
              variant="default"
              size="sm"
              onClick={this.handleReset}
              className="text-xs font-semibold px-4"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5" />
              <span>Reload Application</span>
            </Button>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
