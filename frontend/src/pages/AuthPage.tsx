import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useToast } from '../context/useToast';
import { FlickeringGrid } from '../components/ui/flickering-grid';
import { GoogleIcon, GitHubIcon } from '../components/icons/BrandIcons';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Checkbox } from '../components/ui/checkbox';
import { Card } from '../components/ui/card';

export const AuthPage: React.FC<{ defaultMode?: 'signIn' | 'signUp' }> = ({
  defaultMode = 'signIn',
}) => {
  const { isAuthenticated, isLoading, signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'signIn' | 'signUp'>(defaultMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rememberMe: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-6 h-6 border-2 border-zinc-700 border-t-white rounded-none animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleRememberMeChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, rememberMe: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError(null);
    setFieldErrors({});

    const errors: Record<string, string> = {};
    if (mode === 'signUp' && !formData.name.trim()) {
      errors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'signUp') {
        await signUp(formData.name, formData.email, formData.password);
        toast.success('Account created successfully');
      } else {
        await signIn(formData.email, formData.password);
        toast.success('Welcome back to Statuo');
      }
      navigate('/');
    } catch (err: any) {
      if (err.errors) {
        if (Array.isArray(err.errors)) {
          const map: Record<string, string> = {};
          err.errors.forEach((item: any) => {
            if (typeof item === 'object' && item.field && item.message) {
              map[item.field] = item.message;
            }
          });
          setFieldErrors(map);
        } else if (typeof err.errors === 'object') {
          const map: Record<string, string> = {};
          Object.entries(err.errors).forEach(([field, msg]) => {
            map[field] = Array.isArray(msg) ? msg.join(', ') : String(msg);
          });
          setFieldErrors(map);
        }
      }
      setGeneralError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialSignIn = (provider: string) => {
    try {
      window.location.href = `/api/auth/sign-in/social?provider=${provider}`;
    } catch {
      toast.info(`${provider} sign in initiated.`);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-center items-center p-4 bg-black text-white overflow-hidden font-sans selection:bg-zinc-800 selection:text-white">
      {/* Background Matrix: Map silhouette + subtle grid lines + FlickeringGrid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* World Map Silhouette */}
        <svg
          viewBox="0 0 1000 500"
          className="absolute -left-48 top-12 w-225 h-137.5 opacity-25 stroke-zinc-800 fill-zinc-900/30 stroke-[0.75]"
        >
          <path d="M150,90 Q170,80 230,85 Q280,100 270,160 Q230,190 200,210 Q160,190 140,140 Z" />
          <path d="M210,190 Q240,220 230,270 Q210,290 190,260 Q180,210 210,190 Z" />
          <path d="M280,270 Q340,280 330,360 Q300,440 270,470 Q250,420 260,340 Z" />
          <path d="M470,80 Q540,70 550,130 Q510,160 460,140 Q450,100 470,80 Z" />
          <path d="M460,170 Q540,160 550,230 Q530,340 480,380 Q430,310 440,210 Z" />
          <path d="M570,80 Q760,70 780,180 Q700,240 620,200 Q560,160 570,80 Z" />
          <path d="M720,290 Q820,280 840,360 Q780,410 710,380 Q690,320 720,290 Z" />
        </svg>

        {/* Global Grid Overlay Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#27272a15_1px,transparent_1px),linear-gradient(to_bottom,#27272a15_1px,transparent_1px)] bg-size-[4rem_4rem]" />

        {/* Flickering Grid Particles */}
        <FlickeringGrid
          className="absolute inset-0 size-full mask-[radial-gradient(ellipse_at_center,white_30%,transparent_90%)]"
          squareSize={4}
          gridGap={6}
          color="#ffffff"
          maxOpacity={0.2}
          flickerChance={0.15}
        />
      </div>

      <div className="relative z-10 w-full max-w-107.5">
        {/* Tab Switcher */}
        <div className="inline-flex border border-b-0 border-[#27272a] bg-black">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setMode('signIn');
              setGeneralError(null);
              setFieldErrors({});
            }}
            className={`px-5 py-2.5 h-auto text-sm font-semibold tracking-tight normal-case rounded-none ${
              mode === 'signIn'
                ? 'text-white bg-black hover:bg-black'
                : 'text-zinc-500 hover:text-zinc-300 bg-black'
            }`}
          >
            Sign In
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setMode('signUp');
              setGeneralError(null);
              setFieldErrors({});
            }}
            className={`px-5 py-2.5 h-auto text-sm font-semibold tracking-tight normal-case rounded-none ${
              mode === 'signUp'
                ? 'text-white bg-black hover:bg-black'
                : 'text-zinc-500 hover:text-zinc-300 bg-black'
            }`}
          >
            Sign Up
          </Button>
        </div>

        {/* Main Card Container */}
        <Card className="bg-black border-[#27272a] p-8 shadow-2xl rounded-none gap-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans">
              {mode === 'signIn' ? 'Sign In' : 'Sign Up'}
            </h1>
            <p className="text-sm text-zinc-400 mt-1.5 font-sans">
              {mode === 'signIn'
                ? 'Enter your email below to login to your account'
                : 'Enter your information below to create your account'}
            </p>
          </div>

          {generalError && (
            <div
              role="alert"
              className="mb-5 p-3 rounded-none bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{generalError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signUp' && (
              <div className="space-y-1.5">
                <Label
                  htmlFor="auth-name"
                  className="block text-sm font-semibold text-white"
                >
                  Name
                </Label>
                <Input
                  id="auth-name"
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Alex Morgan"
                  aria-invalid={fieldErrors.name ? 'true' : undefined}
                  className={`rounded-none bg-black text-sm text-white placeholder:text-zinc-600 ${
                    fieldErrors.name ? 'border-rose-500/80 ring-1 ring-rose-500/50' : 'border-[#27272a]'
                  }`}
                />
                {fieldErrors.name && (
                  <p role="alert" className="text-xs text-rose-400">
                    {fieldErrors.name}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-1.5">
              <Label
                htmlFor="auth-email"
                className="block text-sm font-semibold text-white"
              >
                Email
              </Label>
              <div className="relative">
                <Input
                  id="auth-email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="m@example.com"
                  aria-invalid={fieldErrors.email ? 'true' : undefined}
                  className={`pr-10 rounded-none bg-black text-sm text-white placeholder:text-zinc-600 ${
                    fieldErrors.email ? 'border-rose-500/80 ring-1 ring-rose-500/50' : 'border-[#27272a]'
                  }`}
                />
                {formData.email && !fieldErrors.email && /\S+@\S+\.\S+/.test(formData.email) && (
                  <div className="absolute right-3 top-2.5 flex items-center justify-center">
                    <div className="bg-emerald-500/20 text-emerald-400 p-0.5 rounded-none">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              {fieldErrors.email && (
                <p role="alert" className="text-xs text-rose-400">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="auth-password"
                  className="block text-sm font-semibold text-white"
                >
                  Password
                </Label>
                {mode === 'signIn' && (
                  <a
                    href="#forgot"
                    onClick={(e) => {
                      e.preventDefault();
                      toast.info('Please contact your administrator to reset your password.');
                    }}
                    className="text-sm font-semibold text-white underline underline-offset-4 hover:text-zinc-300 transition-colors"
                  >
                    Forgot your password?
                  </a>
                )}
              </div>
              <div className="relative">
                <Input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="password"
                  aria-invalid={fieldErrors.password ? 'true' : undefined}
                  className={`pr-10 rounded-none bg-black text-sm text-white placeholder:text-zinc-600 ${
                    fieldErrors.password ? 'border-rose-500/80 ring-1 ring-rose-500/50' : 'border-[#27272a]'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300 cursor-pointer transition-colors p-0.5"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p role="alert" className="text-xs text-rose-400">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2.5 pt-1">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={handleRememberMeChange}
                className="rounded-none border-[#27272a]"
              />
              <Label htmlFor="rememberMe" className="text-sm font-semibold text-white cursor-pointer select-none">
                Remember me
              </Label>
            </div>

            {/* Login / Submit Button */}
            <Button
              type="submit"
              variant="default"
              isLoading={isSubmitting}
              className="w-full h-10 mt-2 text-sm font-semibold tracking-tight"
            >
              {mode === 'signIn' ? 'Login' : 'Create Account'}
            </Button>
          </form>

          {/* Social Sign-In Buttons */}
          <div className="space-y-2.5 mt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialSignIn('google')}
              className="w-full h-10 border-[#27272a] text-white text-sm font-semibold flex items-center justify-center gap-2.5 rounded-none"
            >
              <GoogleIcon size={16} />
              <span>Sign in with Google</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialSignIn('github')}
              className="w-full h-10 border-[#27272a] text-white text-sm font-semibold flex items-center justify-center gap-2.5 rounded-none"
            >
              <GitHubIcon size={16} className="text-white" />
              <span>Sign in with GitHub</span>
            </Button>
          </div>

          {/* Footer Terms */}
          <div className="mt-8 pt-5 border-t border-[#1f1f23]">
            <p className="text-xs text-zinc-500 text-center leading-relaxed font-sans">
              By signing in, you agree to the{' '}
              <a href="#terms" className="underline underline-offset-4 text-zinc-400 hover:text-white transition-colors">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#privacy" className="underline underline-offset-4 text-zinc-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
