'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Sparkles, ArrowRight, Mail, CheckCircle2, ArrowLeft } from 'lucide-react';
import { apiRequest } from '@/services/api';

export default function ForgotPasswordPage() {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiRequest('/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `email=${encodeURIComponent(email)}`,
      });
    } catch {
      // ignore
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4 bg-gradient-to-b from-orange-50/50 via-white to-slate-50">
      <div className="w-full max-w-md">
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
            {language === 'te' ? 'పాస్‌వర్డ్ రీసెట్' : 'Reset Password'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {language === 'te' 
              ? 'మీ రిజిస్టర్డ్ ఈమెయిల్ చిరునామాను నమోదు చేయండి' 
              : 'Enter your registered email to receive recovery instructions'}
          </p>
        </div>

        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-glass">
          {submitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-navy-900">
                {language === 'te' ? 'సూచనలు పంపబడ్డాయి' : 'Instructions Dispatched'}
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                {language === 'te'
                  ? 'మీ ఈమెయిల్ ఖాతాకు రీసెట్ సూచనలు పంపబడ్డాయి. దయచేసి ఇన్‌బాక్స్ పరిశీలించండి.'
                  : 'If this account is registered in JanSathi AI, password recovery steps have been sent.'}
              </p>
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 text-xs text-slate-700 text-left">
                <strong>Hackathon Demo Note:</strong> You can always login with pre-configured accounts: <code className="font-mono text-saffron-700">citizen@jansathi.gov.in</code> (Pass: <code className="font-mono text-saffron-700">JanSathiDemo2026!</code>).
              </div>
              <div className="pt-2">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-700 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{language === 'te' ? 'లాగిన్‌కు తిరిగి వెళ్ళండి' : 'Back to Sign In'}</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                  {language === 'te' ? 'ఈమెయిల్ చిరునామా' : 'Registered Email Address'}
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="citizen@example.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 text-sm text-slate-900 bg-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-saffron-600 to-orange-600 hover:from-saffron-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span>{language === 'te' ? 'ప్రాసెస్ అవుతోంది...' : 'Sending...'}</span>
                ) : (
                  <>
                    <span>{language === 'te' ? 'రీసెట్ లింక్ పంపండి' : 'Send Recovery Instructions'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="mt-4 text-center">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-navy-900"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{language === 'te' ? 'లాగిన్‌కు వెళ్ళండి' : 'Return to Login'}</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
