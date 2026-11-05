'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { Sparkles, ArrowRight, User, Mail, Lock, AlertCircle, Briefcase, MapPin } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedLang, setSelectedLang] = useState<'en' | 'te'>(language);
  const [occupation, setOccupation] = useState('Farmer');
  const [state, setState] = useState('Andhra Pradesh');
  const [annualIncome, setAnnualIncome] = useState('150000');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await register({
        full_name: fullName,
        email,
        password,
        preferred_language: selectedLang,
        occupation,
        state,
        annual_income: parseFloat(annualIncome) || 150000,
      });
      setLanguage(selectedLang);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-4 bg-gradient-to-b from-orange-50/50 via-white to-slate-50">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-saffron-500 via-tiranga-saffron to-emerald-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black text-navy-900 tracking-tight">
              JanSathi <span className="text-saffron-600">AI</span>
            </span>
          </Link>
          <h1 className="text-2xl font-extrabold text-navy-900">
            {language === 'te' ? 'పౌరుని ఖాతాను సృష్టించండి' : 'Create Citizen Account'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            {language === 'te' 
              ? 'మీ అర్హతకు తగిన సంక్షేమ పథకాలను సులభంగా కనుగొనండి' 
              : 'Empower yourself with verified welfare discovery & AI assistance'}
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-glass">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Preferred Language selector */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                {language === 'te' ? 'ప్రాధాన్య భాష / Preferred Language' : 'Preferred Language / ప్రాధాన్య భాష'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedLang('en')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    selectedLang === 'en'
                      ? 'border-navy-900 bg-navy-900 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLang('te')}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                    selectedLang === 'te'
                      ? 'border-saffron-600 bg-saffron-600 text-white shadow-sm'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  తెలుగు (Telugu)
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                {language === 'te' ? 'పూర్తి పేరు' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar / రమేష్"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 text-sm text-slate-900 bg-white"
                />
              </div>
            </div>

            {/* Email */}
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
                  placeholder="citizen@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 text-sm text-slate-900 bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                {language === 'te' ? 'పాస్‌వర్డ్' : 'Password'}
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 text-sm text-slate-900 bg-white"
                />
              </div>
            </div>

            {/* Basic Profile Details for Instant Scheme Matching */}
            <div className="pt-2 border-t border-slate-100">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-3">
                {language === 'te' ? 'పథకాల పరిశీలన కోసం ప్రాథమిక వివరాలు (ఐచ్ఛికం)' : 'Basic Discovery Details (Optional)'}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {language === 'te' ? 'వృత్తి / Occupation' : 'Occupation'}
                  </label>
                  <select
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                  >
                    <option value="Farmer">Farmer (రైతు)</option>
                    <option value="Student">Student (విద్యార్థి)</option>
                    <option value="Small Business">Small Business (చిరు వ్యాపారి)</option>
                    <option value="Daily Wage Laborer">Daily Wage Laborer (రోజువారీ కూలీ)</option>
                    <option value="Homemaker">Homemaker (గృహిణి)</option>
                    <option value="Other">Other / ఇతర</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    {language === 'te' ? 'రాష్ట్రం / State' : 'State'}
                  </label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white"
                  >
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Other">Other States</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-saffron-600 to-orange-600 hover:from-saffron-700 hover:to-orange-700 text-white font-bold text-sm shadow-md hover:shadow transition-all disabled:opacity-50"
            >
              {loading ? (
                <span>{language === 'te' ? 'నమోదు అవుతోంది...' : 'Creating Account...'}</span>
              ) : (
                <>
                  <span>{language === 'te' ? 'ఖాతా సృష్టించండి' : 'Create Free Account'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              {language === 'te' ? 'ఇప్పటికే ఖాతా ఉందా?' : 'Already have an account?'}{' '}
              <Link href="/auth/login" className="font-bold text-saffron-700 hover:underline">
                {language === 'te' ? 'ఇక్కడ లాగిన్ అవ్వండి' : 'Sign In here'}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
