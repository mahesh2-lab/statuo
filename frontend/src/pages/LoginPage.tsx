import React from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Card } from '../components/ui/card';
import { useSession, useSignIn } from '../hooks/useAuth';
import { toast } from 'sonner';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().default(true),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: session, isLoading: isCheckingSession } = useSession();
  const { mutateAsync: signIn, isPending: isSubmitting, error: submitError } = useSignIn();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema) as any,
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const rememberMe = watch('rememberMe');

  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-6 h-6 border-2 border-muted border-t-primary rounded-none animate-spin" />
      </div>
    );
  }

  if (session && ((session as any).user || (session as any).id)) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await signIn({ email: data.email, password: data.password });
      toast.success('Welcome back to Statuo');
      navigate('/');
    } catch {
      // Handled by react query error state
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-background text-foreground font-sans">
      <div className="w-full max-w-[400px] space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
            <img src="/logo.svg" alt="Statuo Logo" className="h-6 w-6 object-contain" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground font-sans uppercase">
            STATUO ENTERPRISE
          </h1>
          <p className="text-xs text-muted-foreground font-sans">
            High-availability uptime & endpoint monitoring platform
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-card border-border p-6 shadow-sm rounded-none gap-0">
          <div className="mb-5">
            <h2 className="text-base font-bold text-foreground font-sans">Sign In</h2>
            <p className="text-xs text-muted-foreground mt-0.5 font-sans">
              Enter your credentials to access your monitoring dashboard.
            </p>
          </div>

          {submitError && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-start gap-2 rounded-none">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{(submitError as any).message || 'Invalid email or password.'}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-mono text-foreground font-medium">
                Work Email
              </Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="name@company.com"
                className="rounded-none bg-background border-border text-foreground text-xs font-mono h-8"
              />
              {errors.email && (
                <p className="text-[11px] text-destructive font-mono">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-xs font-mono text-foreground font-medium">
                  Password
                </Label>
              </div>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="••••••••"
                className="rounded-none bg-background border-border text-foreground text-xs font-mono h-8"
              />
              {errors.password && (
                <p className="text-[11px] text-destructive font-mono">{errors.password.message}</p>
              )}
            </div>

            <div className="flex items-center gap-2 pt-1">
              <Checkbox
                id="rememberMe"
                checked={rememberMe}
                onCheckedChange={(checked) => setValue('rememberMe', Boolean(checked))}
                className="rounded-none border-border"
              />
              <Label htmlFor="rememberMe" className="text-xs text-muted-foreground font-sans cursor-pointer select-none">
                Remember this session
              </Label>
            </div>

            <Button
              type="submit"
              variant="default"
              size="sm"
              isLoading={isSubmitting}
              className="w-full text-xs font-semibold h-8 mt-2"
            >
              <span>Sign In to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground font-sans">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </Card>

        {/* Demo Credentials Box */}
        <div className="p-3 bg-muted/40 border border-border text-[11px] font-mono text-muted-foreground space-y-1">
          <div className="font-bold text-foreground">DEMO CREDENTIALS:</div>
          <div>email: <span className="text-foreground">tester@example.com</span></div>
          <div>password: <span className="text-foreground">password123</span></div>
        </div>
      </div>
    </div>
  );
};
