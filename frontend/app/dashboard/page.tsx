'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/language-context';
import { apiRequest } from '@/services/api';
import { 
  User, 
  Sparkles, 
  Bookmark, 
  BookmarkCheck, 
  CheckCircle2, 
  FileText, 
  Bot, 
  ArrowRight, 
  ExternalLink, 
  ShieldCheck, 
  Briefcase, 
  MapPin, 
  TrendingUp,
  Layers,
  Clock
} from 'lucide-react';

interface SchemeItem {
  id: number;
  name: string;
  name_te?: string;
  slug: string;
  level: string;
  summary: string;
  summary_te?: string;
  benefits: string;
  benefits_te?: string;
  official_website: string;
  last_verified_date: string;
  category?: { name: string; slug: string };
  is_saved?: boolean;
}

interface DashboardSummary {
  recommended_schemes: SchemeItem[];
  saved_schemes: SchemeItem[];
  total_schemes_count: number;
  saved_schemes_count: number;
  documents_readiness_score: number;
  active_guides_count: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, token, isLoading: authLoading, logout } = useAuth();
  const { language, setLanguage } = useLanguage();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);

  // Redirect if unauthenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  // Fetch summary
  useEffect(() => {
    if (user && token) {
      apiRequest<DashboardSummary>('/dashboard/summary')
        .then((data) => setSummary(data))
        .catch((err) => console.error('Dashboard load error:', err))
        .finally(() => setLoading(false));
    }
  }, [user, token]);

  const toggleSave = async (schemeId: number) => {
    try {
      await apiRequest(`/schemes/${schemeId}/save`, { method: 'POST' });
      // Refresh summary locally
      if (summary) {
        const isCurrentlySaved = summary.saved_schemes.some((s) => s.id === schemeId);
        let newSaved = [...summary.saved_schemes];
        if (isCurrentlySaved) {
          newSaved = newSaved.filter((s) => s.id !== schemeId);
        } else {
          const found = summary.recommended_schemes.find((s) => s.id === schemeId);
          if (found) newSaved.push({ ...found, is_saved: true });
        }
        setSummary({
          ...summary,
          saved_schemes: newSaved,
          saved_schemes_count: newSaved.length,
          recommended_schemes: summary.recommended_schemes.map((s) =>
            s.id === schemeId ? { ...s, is_saved: !isCurrentlySaved } : s
          ),
        });
      }
    } catch (e) {
      console.error('Failed to toggle save:', e);
    }
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600">
            {language === 'te' ? 'డ్యాష్‌బోర్డ్ లోడ్ అవుతోంది...' : 'Loading citizen dashboard...'}
          </p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen pt-28 pb-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200/80 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-saffron-500 to-orange-600 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-orange-500/20">
                {user.full_name ? user.full_name.charAt(0) : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-orange-100 px-2.5 py-0.5 rounded-full">
                    {user.role === 'admin' ? 'Nodal Officer / Admin' : 'Citizen Portal'}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-saffron-600" />
                    {user.profile?.state || 'Andhra Pradesh'}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-navy-900 mt-1">
                  {language === 'te' ? `స్వాగతం, ${user.full_name || 'పౌరులారా'}!` : `Welcome back, ${user.full_name || 'Citizen'}!`}
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  {language === 'te' 
                    ? `మీ ప్రొఫైల్ ఆధారంగా సంక్షేమ పథకాలు మరియు పత్రాల స్థితి ఇక్కడ పరిశీలించండి.` 
                    : `Verified welfare entitlements matched to your profile criteria.`}
                </p>
              </div>
            </div>

            {/* Language Preference & Quick Actions */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold shadow-sm">
                <span className="px-2 text-slate-500">Language:</span>
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    language === 'en' ? 'bg-navy-900 text-white' : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('te')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    language === 'te' ? 'bg-saffron-600 text-white' : 'text-slate-600 hover:text-navy-900'
                  }`}
                >
                  తెలుగు
                </button>
              </div>

              <Link
                href="/assistant"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 text-white hover:bg-saffron-600 transition-all font-bold text-xs shadow-sm"
              >
                <Bot className="w-4 h-4 text-saffron-400" />
                <span>{language === 'te' ? 'AI సహాయకుడిని అడగండి' : 'Ask AI Assistant'}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Quick Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="glass-card p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-100 text-saffron-600 flex items-center justify-center shrink-0">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                {language === 'te' ? 'సిద్ధంగా ఉన్న పథకాలు' : 'Available Schemes'}
              </p>
              <h3 className="text-xl font-black text-navy-900">
                {summary?.total_schemes_count || 5}+
              </h3>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <BookmarkCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                {language === 'te' ? 'భద్రపరచిన పథకాలు' : 'Saved Schemes'}
              </p>
              <h3 className="text-xl font-black text-navy-900">
                {summary?.saved_schemes_count || 0}
              </h3>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-500 font-medium">
                  {language === 'te' ? 'పత్రాల సంసిద్ధత' : 'Document Readiness'}
                </p>
                <span className="text-xs font-bold text-emerald-700">
                  {summary?.documents_readiness_score || 35}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-slate-100 mt-2 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                  style={{ width: `${summary?.documents_readiness_score || 35}%` }}
                />
              </div>
            </div>
          </div>

          <div className="glass-card p-5 rounded-2xl border border-slate-200 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
              <Briefcase className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-medium">
                {language === 'te' ? 'రిజిస్టర్డ్ వృత్తి' : 'Occupation Profile'}
              </p>
              <h3 className="text-sm font-bold text-navy-900 truncate max-w-[140px]">
                {user.profile?.occupation || 'Citizen'}
              </h3>
            </div>
          </div>
        </div>

        {/* Two-Column Grid: Recommended Schemes & Action Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Recommended Schemes (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-navy-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-saffron-600" />
                  <span>{language === 'te' ? 'మీ కోసం సిఫార్సు చేసిన పథకాలు' : 'Recommended Schemes for You'}</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'te' 
                    ? `మీ ప్రొఫైల్ (${user.profile?.occupation || 'రైతు'}, ${user.profile?.state || 'AP'}) కు సరిపోయే పథకాలు.` 
                    : `Tailored matching your occupation (${user.profile?.occupation || 'Farmer'}) and state.`}
                </p>
              </div>

              <Link
                href="/schemes"
                className="text-xs font-bold text-saffron-700 hover:underline flex items-center gap-1"
              >
                <span>{language === 'te' ? 'అన్నీ చూడండి' : 'View All'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Scheme Cards */}
            <div className="space-y-4">
              {summary?.recommended_schemes && summary.recommended_schemes.length > 0 ? (
                summary.recommended_schemes.map((scheme) => (
                  <div
                    key={scheme.id}
                    className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-200 hover:border-saffron-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                          {scheme.category?.name || 'Central Welfare'}
                        </span>
                        <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                          ✓ Verified Source
                        </span>
                      </div>

                      <h3 className="text-base font-extrabold text-navy-900 leading-snug">
                        {language === 'te' && scheme.name_te ? scheme.name_te : scheme.name}
                      </h3>

                      <p className="text-xs text-slate-600 line-clamp-2">
                        {language === 'te' && scheme.summary_te ? scheme.summary_te : scheme.summary}
                      </p>

                      <div className="text-xs text-slate-700 font-semibold flex items-center gap-1.5 pt-1">
                        <span className="text-saffron-700 uppercase tracking-wide text-[11px]">
                          {language === 'te' ? 'ప్రయోజనం:' : 'Benefit:'}
                        </span>
                        <span>{language === 'te' && scheme.benefits_te ? scheme.benefits_te : scheme.benefits}</span>
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <Link
                          href={`/schemes/${scheme.slug}`}
                          className="flex-1 sm:flex-initial text-center py-2 px-3.5 rounded-xl bg-navy-900 text-white hover:bg-saffron-600 text-xs font-bold transition-colors shadow-sm"
                        >
                          {language === 'te' ? 'వివరాలు' : 'View Details'}
                        </Link>
                        <button
                          onClick={() => toggleSave(scheme.id)}
                          className={`p-2 rounded-xl border transition-colors ${
                            scheme.is_saved
                              ? 'bg-orange-50 border-saffron-300 text-saffron-600'
                              : 'border-slate-200 text-slate-500 hover:bg-slate-100'
                          }`}
                          title={scheme.is_saved ? 'Remove Bookmark' : 'Save Scheme'}
                        >
                          {scheme.is_saved ? (
                            <BookmarkCheck className="w-4 h-4" />
                          ) : (
                            <Bookmark className="w-4 h-4" />
                          )}
                        </button>
                      </div>

                      <Link
                        href={`/eligibility?scheme=${scheme.slug}`}
                        className="text-[11px] font-bold text-saffron-700 hover:underline flex items-center gap-1"
                      >
                        <span>{language === 'te' ? 'అర్హత తనిఖీ చేయండి' : 'Check Eligibility'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 rounded-2xl border border-slate-200 text-center bg-white">
                  <p className="text-sm text-slate-600">No schemes found matching your preferences.</p>
                </div>
              )}
            </div>

            {/* Saved Schemes Section */}
            <div className="pt-6">
              <h2 className="text-xl font-extrabold text-navy-900 flex items-center gap-2 mb-4">
                <BookmarkCheck className="w-5 h-5 text-blue-600" />
                <span>{language === 'te' ? 'మీరు భద్రపరచిన పథకాలు' : 'Your Saved Schemes'}</span>
              </h2>

              {summary?.saved_schemes && summary.saved_schemes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {summary.saved_schemes.map((s) => (
                    <div
                      key={s.id}
                      className="glass-card p-4 rounded-xl border border-slate-200 flex flex-col justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-navy-900 text-sm mb-1">
                          {language === 'te' && s.name_te ? s.name_te : s.name}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                          {language === 'te' && s.summary_te ? s.summary_te : s.summary}
                        </p>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <Link
                          href={`/schemes/${s.slug}`}
                          className="text-xs font-bold text-saffron-700 hover:underline"
                        >
                          {language === 'te' ? 'వివరాలు చూడండి' : 'Open Details'}
                        </Link>
                        <button
                          onClick={() => toggleSave(s.id)}
                          className="text-xs text-slate-400 hover:text-red-500"
                        >
                          {language === 'te' ? 'తొలగించు' : 'Remove'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 rounded-2xl border border-dashed border-slate-300 text-center bg-white/50">
                  <Bookmark className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">
                    {language === 'te' 
                      ? 'మీరు ఇంకా ఎటువంటి పథకాలను భద్రపరచలేదు. పథకాల పేజీలో బుక్‌మార్క్ చిహ్నాన్ని క్లిక్ చేయండి.' 
                      : 'You have not saved any schemes yet. Click the bookmark icon on any scheme to save it for later.'}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Interactive Widgets (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Eligibility Checker Widget */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy-900 text-base mb-1">
                {language === 'te' ? 'తక్షణ అర్హత తనిఖీ' : 'Deterministic Eligibility'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">
                {language === 'te'
                  ? 'మీ వయస్సు, భూమి మరియు ఆదాయ వివరాలను నమోదు చేసి అధికారిక నిబంధనల ప్రకారం అర్హతను క్షణాల్లో తెలుసుకోండి.'
                  : 'Compare your verified details against official Gazette rules with zero hallucination.'}
              </p>
              <Link
                href="/eligibility"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs shadow-sm hover:shadow transition-all"
              >
                <span>{language === 'te' ? 'అర్హత ఇంజిన్ ప్రారంభించండి' : 'Launch Eligibility Engine'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Document Readiness Hub Widget */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-navy-900 text-base mb-1">
                {language === 'te' ? 'పత్రాల సంసిద్ధతా కేంద్రం' : 'Document Intelligence'}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {language === 'te'
                  ? 'ఆధార్, రేషన్ కార్డు, ఆదాయ ధృవీకరణ పత్రాలను అప్‌లోడ్ చేసి స్మార్ట్ OCR ద్వారా చెక్‌లిస్ట్‌ను పరిశీలించండి.'
                  : 'Safely upload sample certificates to identify missing prerequisite categories before application.'}
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 mb-4">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Aadhaar & Bank Linked:</span>
                  <span className="text-emerald-600">✓ Verified</span>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                  <span>Income Proof:</span>
                  <span className="text-amber-600">Upload Needed</span>
                </div>
              </div>
              <Link
                href="/documents"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white border border-slate-300 text-slate-800 hover:bg-slate-50 font-bold text-xs transition-colors"
              >
                <span>{language === 'te' ? 'పత్రాలను నిర్వహించండి' : 'Manage Documents & OCR'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Scheme Comparison Shortcut */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-navy-900 text-sm mb-1">
                {language === 'te' ? 'పథకాల పోలిక పరికరం' : 'Compare Welfare Schemes'}
              </h3>
              <p className="text-xs text-slate-600 mb-3">
                {language === 'te'
                  ? 'రెండు లేదా అంతకంటే ఎక్కువ పథకాల ప్రయోజనాలు మరియు నిబంధనలను పక్కపక్కనే సరిపోల్చండి.'
                  : 'Compare benefits, required documents, and eligibility across schemes side-by-side.'}
              </p>
              <Link
                href="/comparison"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron-700 hover:underline"
              >
                <span>{language === 'te' ? 'పోలిక టూల్ తెరవండి' : 'Open Comparison Tool'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
