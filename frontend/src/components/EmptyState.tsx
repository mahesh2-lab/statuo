import React from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionIcon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  actionIcon: ActionIcon,
  className = '',
}) => {
  return (
    <Card className={`border border-border bg-card p-8 sm:p-12 text-center rounded-none shadow-none flex flex-col items-center justify-center gap-0 ${className}`}>
      <div className="w-12 h-12 rounded-none bg-muted border border-border flex items-center justify-center text-muted-foreground mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-sm sm:text-base font-bold text-foreground font-sans tracking-tight">
        {title}
      </h3>
      <p className="text-xs text-muted-foreground max-w-sm mt-1 mb-5 font-sans leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button
          variant="default"
          size="sm"
          onClick={onAction}
          className="text-xs font-semibold px-4"
        >
          {ActionIcon && <ActionIcon className="w-3.5 h-3.5 mr-1.5" />}
          <span>{actionLabel}</span>
        </Button>
      )}
    </Card>
  );
};
