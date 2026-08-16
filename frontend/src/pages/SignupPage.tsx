import React from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertCircle, ArrowRight, Check } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Card } from '../components/ui/card';
import { useSession, useSignUp } from '../hooks/useAuth';
import { toast } from 'sonner';

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms to continue',
  }),
});

type SignupFormValues = z.infer<typeof signupSchema>;

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: session, isLoading: isCheckingSession } = useSession();
  const { mutateAsync: signUp, isPending: isSubmitting, error: submitError } = useSignUp();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema) as any,
    defaultValues: {
      name: '',
      email: '',
      password: '',
      acceptTerms: false,
    },
  });

  const passwordValue = watch('password') || '';
  const acceptTerms = watch('acceptTerms');

  const hasMinLength = passwordValue.length >= 8;
  const hasNumberOrSpecial = /[0-9!@#$%^&*]/.test(passwordValue);

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

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await signUp({ name: data.name, email: data.email, password: data.password });
      toast.success('Account created successfully');
      navigate('/');
    } catch {
      // Handled by query error state
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-background text-foreground font-sans">
      <div className="w-full max-w-[420px] space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-primary">
            <img src="/logo.svg" alt="Statuo Logo" className="h-6 w-6 object-contain" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-foreground font-sans uppercase">
            CREATE STATUO ACCOUNT
          </h1>
          <p className="text-xs text-muted-foreground font-sans">
            Start monitoring enterprise endpoints with sub-minute precision
          </p>
        </div>

        {/* Signup Card */}
        <Card className="bg-card border-border p-6 shadow-sm rounded-none gap-0">
          <div className="mb-5">
            <h2 className="text-base font-bold text-foreground font-sans">Get Started</h2>
            <p className="text-xs text-muted-foreground mt-0.5 font-sans">
              Create your organization and configure your first health checks.
            </p>
          </div>

          {submitError && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-start gap-2 rounded-none">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{(submitError as any).message || 'Registration failed. Please try again.'}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-xs font-mono text-foreground font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                {...register('name')}
                placeholder="Jane Doe"
                className="rounded-none bg-background border-border text-foreground text-xs font-mono h-8"
              />
              {errors.name && (
                <p className="text-[11px] text-destructive font-mono">{errors.name.message}</p>
              )}
            </div>

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
              <Label htmlFor="password" className="text-xs font-mono text-foreground font-medium">
                Password
              </Label>
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

              {/* Password Strength Hint */}
              <div className="pt-1 space-y-1 font-mono text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <span className={`w-3 h-3 flex items-center justify-center border ${hasMinLength ? 'bg-emerald-500 text-white border-emerald-500' : 'border-border text-transparent'}`}>
                    <Check className="w-2.5 h-2.5" />
                  </span>
                  <span>Minimum 8 characters</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-3 h-3 flex items-center justify-center border ${hasNumberOrSpecial ? 'bg-emerald-500 text-white border-emerald-500' : 'border-border text-transparent'}`}>
                    <Check className="w-2.5 h-2.5" />
                  </span>
                  <span>Contains a number or special character</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="acceptTerms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setValue('acceptTerms', Boolean(checked))}
                  className="rounded-none border-border mt-0.5"
                />
                <Label htmlFor="acceptTerms" className="text-xs text-muted-foreground font-sans leading-tight cursor-pointer select-none">
                  I agree to the Statuo Service Level Terms and Privacy Architecture.
                </Label>
              </div>
              {errors.acceptTerms && (
                <p className="text-[11px] text-destructive font-mono">{errors.acceptTerms.message}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="default"
              size="sm"
              isLoading={isSubmitting}
              className="w-full text-xs font-semibold h-8 mt-2"
            >
              <span>Create Statuo Account</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </form>

          <div className="mt-6 pt-4 border-t border-border text-center text-xs text-muted-foreground font-sans">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Sign in instead
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};
