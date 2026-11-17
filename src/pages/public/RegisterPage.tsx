import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNotification } from '../../context/NotificationContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UiThemeProvider } from '../../components/ui/ThemeContext';
import type { UserRole } from '../../types/auth';
import { ArrowRight, Sparkles, Building2, User } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { showToast } = useNotification();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>('customer');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [salonName, setSalonName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await register({
        email,
        password,
        fullName,
        phone,
        role,
        salonName: role === 'salon_owner' ? salonName : undefined,
      });

      showToast('Registration Complete', 'Your account has been created.');
      if (role === 'salon_owner') {
        navigate('/owner/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
      showToast('Error', err.message || 'Registration failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UiThemeProvider theme="light">
      <div className="min-h-screen bg-[#FAF6F1] flex flex-col justify-between p-6 sm:p-10 font-['Plus_Jakarta_Sans'] text-[#241812]">
      {/* Top Header */}
      <div className="max-w-lg w-full mx-auto flex items-center justify-between pb-6">
        <Link to="/" className="inline-block group text-left">
          <h1 className="font-['Montserrat'] text-2xl font-light tracking-[0.22em] uppercase text-[#41332B] group-hover:text-[#806B5C] transition-colors leading-none">
            GLAMOURÉ
          </h1>
          <p className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase tracking-[0.24em] text-[#806B5C] mt-1 font-medium">
            Salon Platform
          </p>
        </Link>

        <Link
          to="/login"
          className="text-xs text-[#806B5C] hover:text-[#41332B] font-medium transition-colors"
        >
          Already have an account? Sign In ↗
        </Link>
      </div>

      {/* Main Register Card */}
      <div className="max-w-lg w-full mx-auto bg-white rounded-3xl border border-[#41332B]/10 shadow-[0_20px_60px_rgba(65,51,43,0.08)] p-8 sm:p-10 my-auto text-left">
        <div className="mb-6">
          <span className="font-['Montserrat'] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#806B5C] block mb-1">
            Get Started
          </span>
          <h2 className="font-['Montserrat'] text-2xl sm:text-[26px] font-light tracking-tight text-[#41332B]">
            Create Your Account
          </h2>
          <p className="text-xs text-[#806B5C] mt-1 font-normal leading-relaxed">
            Select your account profile type to proceed.
          </p>
        </div>

        {/* Role Selection Tabs */}
        <div className="grid grid-cols-2 gap-3 mb-6 p-1 rounded-2xl bg-[#F5EFE7] border border-[#41332B]/10">
          <button
            type="button"
            onClick={() => setRole('customer')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-['Montserrat'] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              role === 'customer'
                ? 'bg-white text-[#41332B] shadow-sm'
                : 'text-[#806B5C] hover:text-[#41332B]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Customer</span>
          </button>

          <button
            type="button"
            onClick={() => setRole('salon_owner')}
            className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-['Montserrat'] font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              role === 'salon_owner'
                ? 'bg-white text-[#41332B] shadow-sm'
                : 'text-[#806B5C] hover:text-[#41332B]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Salon Owner</span>
          </button>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            required
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            placeholder="e.g. Elena Vance"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="elena@glamoure.com"
            />
            <Input
              label="Phone Number"
              type="tel"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
            />
          </div>

          {role === 'salon_owner' && (
            <div className="p-4 rounded-2xl bg-[#E8D8C7]/25 border border-[#41332B]/10 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-['Montserrat'] font-semibold uppercase tracking-wider text-[#41332B]">
                <Sparkles className="w-3.5 h-3.5 text-[#B99470]" />
                <span>Salon Business Details</span>
              </div>
              <Input
                label="Salon Brand Name"
                required
                value={salonName}
                onChange={e => setSalonName(e.target.value)}
                placeholder="e.g. Glamouré Sanctuary"
              />
            </div>
          )}

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="At least 6 characters"
          />

          <Button
            type="submit"
            className="w-full mt-2"
            isLoading={isLoading}
          >
            <span>{role === 'salon_owner' ? 'Register Salon & Open Studio' : 'Create Customer Account'}</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-[#806B5C]">
          By continuing, you agree to the{' '}
          <Link to="/" className="text-[#41332B] font-semibold underline">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/" className="text-[#41332B] font-semibold underline">
            Privacy Policy
          </Link>.
        </div>
      </div>

      <div className="text-center text-xs text-[#806B5C]/70 pt-6">
        © 2026 Glamouré Salon Management &amp; Customer Booking Platform.
      </div>
    </div>
    </UiThemeProvider>
  );
};
