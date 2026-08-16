import React from 'react';
import { AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from './ui/alert-dialog';
import { buttonVariants } from './ui/button';
import { cn } from '../lib/utils';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
  onCancel?: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onClose,
  onCancel,
}) => {
  const handleClose = () => {
    if (onCancel) onCancel();
    onClose();
  };

  const bodyText = description || message || 'Are you sure you want to proceed with this action?';

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <AlertDialogContent className="rounded-none border-border bg-card p-6 max-w-md">
        <AlertDialogHeader className="space-y-3">
          <div className="flex items-start gap-3">
            {isDestructive && (
              <div className="p-2 rounded-none bg-destructive/10 border border-destructive/20 text-destructive shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
            )}
            <div className="space-y-1">
              <AlertDialogTitle className="text-sm font-bold text-foreground tracking-tight font-sans">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed font-sans">
                {bodyText}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4 flex items-center justify-end gap-2">
          <AlertDialogCancel
            onClick={handleClose}
            disabled={isLoading}
            className="h-8 text-xs font-mono rounded-none border-border bg-transparent hover:bg-accent text-foreground"
          >
            {cancelLabel}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isLoading}
            className={cn(
              buttonVariants({
                variant: isDestructive ? 'destructive' : 'default',
                size: 'sm',
              }),
              'h-8 text-xs font-semibold rounded-none'
            )}
          >
            {isLoading ? 'Processing...' : confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
