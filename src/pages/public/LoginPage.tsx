import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as any)?.from?.pathname || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(email, password);
      showToast('Welcome back', 'Successfully authenticated to Glamouré.');
      
      if (from) {
        navigate(from, { replace: true });
      } else {
        // Route according to user email
        if (email.includes('owner')) navigate('/owner/dashboard');
        else if (email.includes('marcus') || email.includes('aria') || email.includes('julian')) navigate('/member/dashboard');
        else navigate('/customer/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to login');
      showToast('Authentication Error', err.message || 'Invalid credentials', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, rolePath: string) => {
    setEmail(demoEmail);
    setPassword('glamoure2026');
    setIsLoading(true);
    try {
      await login(demoEmail, 'glamoure2026');
      showToast('Authenticated', `Signed in with demo identity.`);
      navigate(rolePath);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F1] flex flex-col justify-between p-6 sm:p-10 font-['Plus_Jakarta_Sans'] text-[#241812]">
      {/* Top Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pb-6">
        <Link to="/" className="inline-block group text-left">
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-[0.22em] uppercase text-[#41332B] group-hover:text-[#806B5C] transition-colors leading-none">
            GLAMOURÉ
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-[0.24em] text-[#806B5C] mt-1 font-medium">
            Salon Platform
          </p>
        </Link>

        <Link
          to="/"
          className="text-xs text-[#806B5C] hover:text-[#41332B] font-medium transition-colors"
        >
          Back to Sanctuary ↗
        </Link>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full mx-auto bg-white rounded-3xl border border-[#41332B]/10 shadow-[0_20px_60px_rgba(65,51,43,0.08)] p-8 sm:p-10 my-auto text-left">
        <div className="mb-6">
          <span className="font-['Montserrat'] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#806B5C] block mb-1">
            Sign In
          </span>
          <h2 className="font-['Montserrat'] text-2xl sm:text-[26px] font-light tracking-tight text-[#41332B]">
            Welcome to Glamouré
          </h2>
          <p className="text-xs text-[#806B5C] mt-1 font-normal leading-relaxed">
            Access your appointments, client formulas, or salon management dashboard.
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@glamoure.com"
          />

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[12px] font-['Montserrat'] font-medium uppercase tracking-wider text-[#41332B]">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[11.5px] text-[#806B5C] hover:text-[#41332B] font-normal"
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-2"
            isLoading={isLoading}
          >
            <span>Sign In to Glamouré</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        {/* 1-Click Fast Demo Logins */}
        <div className="mt-8 pt-6 border-t border-[#41332B]/10">
          <div className="flex items-center gap-1.5 text-xs font-['Montserrat'] uppercase tracking-wider text-[#806B5C] font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#B99470]" />
            <span>Instant Demo Logins</span>
          </div>

          <div className="space-y-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('owner@glamoure.com', '/owner/dashboard')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#41332B]/15 hover:border-[#41332B]/40 bg-[#F5EFE7]/50 hover:bg-[#F5EFE7] text-left transition-all cursor-pointer group"
            >
              <div>
                <span className="font-['Montserrat'] text-xs font-semibold text-[#41332B] block">
                  Elena Vance (Salon Owner)
                </span>
                <span className="text-[11px] text-[#806B5C]">Full salon governance & analytics</span>
              </div>
              <span className="text-[11px] font-semibold text-[#41332B] group-hover:translate-x-0.5 transition-transform">
                Owner ↗
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('marcus@glamoure.com', '/member/dashboard')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#41332B]/15 hover:border-[#41332B]/40 bg-[#F5EFE7]/50 hover:bg-[#F5EFE7] text-left transition-all cursor-pointer group"
            >
              <div>
                <span className="font-['Montserrat'] text-xs font-semibold text-[#41332B] block">
                  Marcus Reed (Salon Member / Artisan)
                </span>
                <span className="text-[11px] text-[#806B5C]">Master Colorist appointments & schedule</span>
              </div>
              <span className="text-[11px] font-semibold text-[#41332B] group-hover:translate-x-0.5 transition-transform">
                Staff ↗
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('customer@glamoure.com', '/customer/dashboard')}
              className="w-full flex items-center justify-between p-2.5 rounded-xl border border-[#41332B]/15 hover:border-[#41332B]/40 bg-[#F5EFE7]/50 hover:bg-[#F5EFE7] text-left transition-all cursor-pointer group"
            >
              <div>
                <span className="font-['Montserrat'] text-xs font-semibold text-[#41332B] block">
                  Sophia Reynolds (Customer)
                </span>
                <span className="text-[11px] text-[#806B5C]">VIP booking history, slots & profile</span>
              </div>
              <span className="text-[11px] font-semibold text-[#41332B] group-hover:translate-x-0.5 transition-transform">
                Client ↗
              </span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-[#806B5C]">
          Don't have an account yet?{' '}
          <Link to="/register" className="text-[#41332B] font-semibold underline underline-offset-2">
            Create an Account
          </Link>
        </div>
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-[#806B5C]/70 pt-6 flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#41332B]" />
        <span>End-to-end encrypted multi-tenant authentication engine.</span>
      </div>
    </div>
  );
};
