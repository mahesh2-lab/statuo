import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Switch } from './ui/switch';
import type { CreateJobPayload, HttpMethod, Job } from '../types/pulse';
import { Activity, Radio } from 'lucide-react';

const jobFormSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be under 100 characters'),
  url: z.string().url('Please enter a valid URL (e.g. https://api.example.com/health)'),
  method: z.enum(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD'] as const),
  interval: z.coerce.number().min(10, 'Interval must be at least 10 seconds').max(86400, 'Max interval is 24 hours'),
  description: z.string().optional(),
  token: z.string().optional(),
  retryCount: z.coerce.number().min(0, 'Retry count cannot be negative').max(10, 'Max 10 retries'),
  retryInterval: z.coerce.number().min(1, 'Retry interval must be at least 1s').max(3600, 'Max retry interval 1 hour'),
  timeout: z.coerce.number().min(1, 'Timeout must be at least 1s').max(60, 'Max timeout is 60 seconds'),
  isActive: z.boolean(),
});

type JobFormValues = z.infer<typeof jobFormSchema>;

interface JobFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateJobPayload) => Promise<any> | void;
  job?: Job | null;
  isLoading?: boolean;
}

export const JobFormModal: React.FC<JobFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  job,
  isLoading = false,
}) => {
  const isEditMode = Boolean(job);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema) as any,
    defaultValues: {
      name: '',
      url: '',
      method: 'GET',
      interval: 60,
      description: '',
      token: '',
      retryCount: 5,
      retryInterval: 60,
      timeout: 10,
      isActive: true,
    },
  });

  useEffect(() => {
    if (isOpen) {
      if (job) {
        reset({
          name: job.name,
          url: job.url,
          method: job.method || 'GET',
          interval: job.interval || 60,
          description: job.description || '',
          token: job.token || '',
          retryCount: job.retryCount ?? 5,
          retryInterval: job.retryInterval ?? 60,
          timeout: job.timeout ?? 10,
          isActive: job.isActive ?? true,
        });
      } else {
        reset({
          name: '',
          url: '',
          method: 'GET',
          interval: 60,
          description: '',
          token: '',
          retryCount: 5,
          retryInterval: 60,
          timeout: 10,
          isActive: true,
        });
      }
    }
  }, [isOpen, job, reset]);

  const onFormSubmit = async (data: JobFormValues) => {
    await onSubmit({
      name: data.name,
      url: data.url,
      method: data.method as HttpMethod,
      interval: data.interval,
      description: data.description || undefined,
      token: data.token || undefined,
      retryCount: data.retryCount,
      retryInterval: data.retryInterval,
      timeout: data.timeout,
      isActive: data.isActive,
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="rounded-none border-border bg-card p-6 max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b border-border pb-3">
          <div className="flex items-center gap-2">
            {isEditMode ? (
              <Activity className="w-4 h-4 text-primary" />
            ) : (
              <Radio className="w-4 h-4 text-primary" />
            )}
            <DialogTitle className="text-sm font-bold text-foreground font-sans">
              {isEditMode ? `Edit Monitor: ${job?.name}` : 'Create New Health Monitor'}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground font-sans">
            {isEditMode
              ? 'Update the target URL, ping frequency, and retry policies for this endpoint.'
              : 'Configure a new automated HTTP ping check to monitor service availability and latency.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4 pt-2">
          {/* Target Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs text-foreground font-mono font-medium">
              Monitor Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g. Production API Health"
              className="rounded-none bg-background border-border text-foreground font-mono text-xs h-8"
            />
            {errors.name && (
              <p className="text-[11px] text-destructive font-mono">{errors.name.message}</p>
            )}
          </div>

          {/* URL & Method */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div className="sm:col-span-1 space-y-1.5">
              <Label htmlFor="method" className="text-xs text-foreground font-mono font-medium">
                HTTP Method
              </Label>
              <Controller
                control={control}
                name="method"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="rounded-none bg-background border-border text-foreground font-mono text-xs h-8">
                      <SelectValue placeholder="GET" />
                    </SelectTrigger>
                    <SelectContent className="rounded-none bg-popover border-border font-mono text-xs">
                      <SelectItem value="GET">GET</SelectItem>
                      <SelectItem value="POST">POST</SelectItem>
                      <SelectItem value="PUT">PUT</SelectItem>
                      <SelectItem value="PATCH">PATCH</SelectItem>
                      <SelectItem value="DELETE">DELETE</SelectItem>
                      <SelectItem value="HEAD">HEAD</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="sm:col-span-3 space-y-1.5">
              <Label htmlFor="url" className="text-xs text-foreground font-mono font-medium">
                Endpoint URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="url"
                {...register('url')}
                placeholder="https://api.example.com/v1/health"
                className="rounded-none bg-background border-border text-foreground font-mono text-xs h-8"
              />
              {errors.url && (
                <p className="text-[11px] text-destructive font-mono">{errors.url.message}</p>
              )}
            </div>
          </div>

          {/* Interval & Timeout */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="interval" className="text-xs text-foreground font-mono font-medium">
                Interval (Seconds)
              </Label>
              <Input
                id="interval"
                type="number"
                {...register('interval')}
                className="rounded-none bg-background border-border text-foreground font-mono text-xs h-8"
              />
              {errors.interval && (
                <p className="text-[11px] text-destructive font-mono">{errors.interval.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="timeout" className="text-xs text-foreground font-mono font-medium">
                Timeout (Seconds)
              </Label>
              <Input
                id="timeout"
                type="number"
                {...register('timeout')}
                className="rounded-none bg-background border-border text-foreground font-mono text-xs h-8"
              />
              {errors.timeout && (
                <p className="text-[11px] text-destructive font-mono">{errors.timeout.message}</p>
              )}
            </div>
          </div>

          {/* Retry Settings */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="retryCount" className="text-xs text-foreground font-mono font-medium">
                Retry Attempts
              </Label>
              <Input
                id="retryCount"
                type="number"
                {...register('retryCount')}
                className="rounded-none bg-background border-border text-foreground font-mono text-xs h-8"
              />
              {errors.retryCount && (
                <p className="text-[11px] text-destructive font-mono">{errors.retryCount.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="retryInterval" className="text-xs text-foreground font-mono font-medium">
                Retry Delay (Seconds)
              </Label>
              <Input
                id="retryInterval"
                type="number"
                {...register('retryInterval')}
                className="rounded-none bg-background border-border text-foreground font-mono text-xs h-8"
              />
              {errors.retryInterval && (
                <p className="text-[11px] text-destructive font-mono">{errors.retryInterval.message}</p>
              )}
            </div>
          </div>

          {/* Auth Token (Masked Password Input) */}
          <div className="space-y-1.5">
            <Label htmlFor="token" className="text-xs text-foreground font-mono font-medium">
              Bearer Authorization Token (Optional)
            </Label>
            <Input
              id="token"
              type="password"
              {...register('token')}
              placeholder="e.g. sec_live_bearer_token_..."
              className="rounded-none bg-background border-border text-foreground font-mono text-xs h-8"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="description" className="text-xs text-foreground font-mono font-medium">
              Description / Notes
            </Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Optional notes or alert runbook instructions..."
              rows={2}
              className="rounded-none bg-background border-border text-foreground font-mono text-xs"
            />
          </div>

          {/* Active Switch */}
          <div className="flex items-center justify-between p-3 border border-border bg-muted/30">
            <div>
              <div className="text-xs font-semibold text-foreground font-sans">Active Monitoring</div>
              <div className="text-[10px] text-muted-foreground font-sans">
                Immediately schedule periodic health pings for this service
              </div>
            </div>
            <Controller
              control={control}
              name="isActive"
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="rounded-none"
                />
              )}
            />
          </div>

          <DialogFooter className="pt-3 border-t border-border flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting || isLoading}
              className="text-xs font-mono"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              isLoading={isSubmitting || isLoading}
              className="text-xs font-semibold"
            >
              {isEditMode ? 'Save Changes' : 'Create Monitor'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
