import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthService } from '../../services/authService';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { UiThemeProvider } from '../../components/ui/ThemeContext';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tokenMessage, setTokenMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const msg = await AuthService.forgotPassword(email);
      setTokenMessage(msg);
      setIsSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <UiThemeProvider theme="light">
      <div className="min-h-screen bg-[#FAF6F1] flex flex-col justify-between p-6 sm:p-10 font-['Plus_Jakarta_Sans'] text-[#241812]">
        <div className="max-w-md w-full mx-auto flex items-center justify-between pb-6">
          <Link to="/login" className="flex items-center gap-2 text-xs font-medium text-[#41332B] hover:text-[#806B5C]">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Sign In</span>
          </Link>
        </div>

        <div className="max-w-md w-full mx-auto bg-white rounded-3xl border border-[#41332B]/10 shadow-[0_20px_60px_rgba(65,51,43,0.08)] p-8 sm:p-10 my-auto text-left">
          <div className="mb-6">
            <span className="font-['Montserrat'] text-[11px] font-semibold uppercase tracking-[0.2em] text-[#806B5C] block mb-1">
              Account Recovery
            </span>
            <h2 className="font-['Montserrat'] text-2xl font-light tracking-tight text-[#41332B]">
              Reset Your Password
            </h2>
            <p className="text-xs text-[#806B5C] mt-1 font-normal leading-relaxed">
              Enter your registered email address. We'll generate a secure token to recover your account.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs space-y-2">
              <div className="flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Recovery Request Sent</span>
              </div>
              <p className="leading-relaxed">{tokenMessage}</p>
              <div className="pt-3">
                <Link to="/login">
                  <Button size="sm" variant="outline" className="w-full">
                    Return to Sign In
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@glamoure.com"
              />

              <Button type="submit" className="w-full mt-2" isLoading={isLoading}>
                Send Recovery Token
              </Button>
            </form>
          )}
        </div>

        <div className="text-center text-xs text-[#806B5C]/70 pt-6">
          © 2026 Glamouré Salon Platform.
        </div>
      </div>
    </UiThemeProvider>
  );
};
