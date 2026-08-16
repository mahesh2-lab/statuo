import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <Card className="bg-card border-border p-8 sm:p-12 text-center max-w-md w-full rounded-none shadow-none gap-0">
        <div className="w-12 h-12 rounded-lg bg-primary mx-auto flex items-center justify-center mb-4">
          <img src="/logo.svg" alt="Statuo Logo" className="h-7 w-7 object-contain" />
        </div>
        <div className="text-3xl font-black font-mono text-foreground mb-1">
          404
        </div>
        <h1 className="text-base font-bold text-foreground font-sans uppercase tracking-tight">
          Page Not Found
        </h1>
        <p className="text-xs text-muted-foreground mt-2 mb-6 font-sans leading-relaxed">
          The requested endpoint or resource does not exist in the Statuo routing table.
        </p>
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(-1)}
            className="text-xs font-mono border-border"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1" />
            <span>Go Back</span>
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={() => navigate('/')}
            className="text-xs font-semibold"
          >
            <LayoutDashboard className="w-3.5 h-3.5 mr-1" />
            <span>Dashboard</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};
