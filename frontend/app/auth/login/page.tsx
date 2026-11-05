'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { Sparkles, ArrowRight, ShieldCheck, UserCheck, Lock, Mail, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { language } = useLanguage();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4 bg-gradient-to-b from-orange-50/50 via-white to-slate-50">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-saffron-500 via-tiranga-saffron to-emerald-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-navy-900 tracking-tight">
              JanSathi <span className="text-saffron-600">AI</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-navy-900">
            {language === 'te' ? 'జన్ సాథికి లాగిన్ అవ్వండి' : 'Sign in to JanSathi AI'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {language === 'te' 
              ? 'ప్రభుత్వ సంక్షేమ సేవలు మరియు మార్గదర్శకత్వం పొందండి' 
              : 'Access your citizen dashboard, saved schemes & AI assistant'}
          </p>
        </div>

        {/* Demo Fast Login Pills for Hackathon Evaluators */}
        <div className="mb-6 p-3.5 rounded-2xl bg-orange-100/70 border border-orange-200/80 shadow-sm">
          <p className="text-[11px] font-bold uppercase tracking-wider text-saffron-800 mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-saffron-600" />
            <span>{language === 'te' ? 'త్వరిత డెమో లాగిన్ (పరీక్షకుల కోసం)' : 'Quick Demo Logins (Evaluation)'}</span>
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount('citizen@jansathi.gov.in', 'JanSathiDemo2026!')}
              className="text-left p-2 rounded-xl bg-white border border-orange-200 hover:border-saffron-500 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Citizen Demo</span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">citizen@jansathi.gov.in</p>
            </button>

            <button
              type="button"
              onClick={() => fillDemoAccount('admin@jansathi.gov.in', 'AdminJanSathi2026!')}
              className="text-left p-2 rounded-xl bg-white border border-orange-200 hover:border-saffron-500 hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                <ShieldCheck className="w-3.5 h-3.5 text-saffron-600" />
                <span>Admin Officer</span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">admin@jansathi.gov.in</p>
            </button>
          </div>
        </div>

        {/* Main Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-glass">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                {language === 'te' ? 'ఈమెయిల్ చిరునామా' : 'Email Address'}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 text-sm text-slate-900 bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider">
                  {language === 'te' ? 'పాస్‌వర్డ్' : 'Password'}
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs font-semibold text-saffron-700 hover:underline"
                >
                  {language === 'te' ? 'మర్చిపోయారా?' : 'Forgot password?'}
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 text-sm text-slate-900 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-saffron-600 to-orange-600 hover:from-saffron-700 hover:to-orange-700 text-white font-bold text-sm shadow-md hover:shadow transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>{language === 'te' ? 'ప్రాసెస్ అవుతోంది...' : 'Signing in...'}</span>
              ) : (
                <>
                  <span>{language === 'te' ? 'లాగిన్ చేయండి' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              {language === 'te' ? 'ఖాతా లేదా?' : "Don't have a JanSathi account?"}{' '}
              <Link href="/auth/register" className="font-bold text-saffron-700 hover:underline">
                {language === 'te' ? 'ఇప్పుడే నమోదు చేసుకోండి' : 'Register now'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
