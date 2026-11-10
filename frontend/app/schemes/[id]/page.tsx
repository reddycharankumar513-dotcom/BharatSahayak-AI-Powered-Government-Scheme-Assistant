'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { apiRequest } from '@/services/api';
import { 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Bot, 
  Bookmark, 
  BookmarkCheck, 
  Building2, 
  Calendar, 
  Sparkles,
  ArrowRight,
  ListChecks,
  AlertCircle
} from 'lucide-react';

interface Rule {
  id: number;
  rule_type: string;
  rule_operator: string;
  rule_value: string;
  description: string;
  description_te?: string;
  is_mandatory: boolean;
}

interface Doc {
  id: number;
  document_type: string;
  document_type_te?: string;
  description?: string;
  is_mandatory: boolean;
}

interface Source {
  id: number;
  source_name: string;
  url: string;
  verification_status: string;
}

interface SchemeDetail {
  id: number;
  name: string;
  name_te?: string;
  slug: string;
  level: string;
  summary: string;
  summary_te?: string;
  description: string;
  description_te?: string;
  benefits: string;
  benefits_te?: string;
  application_procedure: string;
  application_procedure_te?: string;
  official_website: string;
  last_verified_date: string;
  category?: { name: string; name_te?: string; slug: string };
  is_saved?: boolean;
  eligibility_rules: Rule[];
  required_documents: Doc[];
  sources: Source[];
}

export default function SchemeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const identifier = params.id as string;

  const [scheme, setScheme] = useState<SchemeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (identifier) {
      setLoading(true);
      apiRequest<SchemeDetail>(`/schemes/${identifier}`)
        .then((data) => setScheme(data))
        .catch((err) => setError(err.message || 'Scheme not found'))
        .finally(() => setLoading(false));
    }
  }, [identifier]);

  const toggleSave = async () => {
    if (!scheme) return;
    try {
      const res = await apiRequest<{ saved: boolean }>(`/schemes/${scheme.id}/save`, { method: 'POST' });
      setScheme({ ...scheme, is_saved: res.saved });
    } catch {
      router.push('/auth/login');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading verified scheme specifications...</p>
      </div>
    );
  }

  if (error || !scheme) {
    return (
      <div className="min-h-screen pt-36 pb-20 px-4 max-w-xl mx-auto text-center">
        <div className="glass-panel p-8 rounded-3xl border border-slate-200">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-navy-900 mb-2">Scheme Not Found</h2>
          <p className="text-xs text-slate-600 mb-6">{error || 'Unable to retrieve requested scheme record.'}</p>
          <Link
            href="/schemes"
            className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-navy-900 text-white text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Scheme Explorer</span>
          </Link>
        </div>
      </div>
    );
  }

  const name = language === 'te' && scheme.name_te ? scheme.name_te : scheme.name;
  const summary = language === 'te' && scheme.summary_te ? scheme.summary_te : scheme.summary;
  const description = language === 'te' && scheme.description_te ? scheme.description_te : scheme.description;
  const benefits = language === 'te' && scheme.benefits_te ? scheme.benefits_te : scheme.benefits;
  const procedure = language === 'te' && scheme.application_procedure_te ? scheme.application_procedure_te : scheme.application_procedure;

  return (
    <div className="min-h-screen pt-28 pb-24 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Back Link */}
        <div className="mb-6">
          <Link
            href="/schemes"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-navy-900 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{language === 'te' ? 'అన్ని పథకాలకు తిరిగి వెళ్లండి' : 'Back to All Schemes'}</span>
          </Link>
        </div>

        {/* Hero Header Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
                {scheme.category?.name || 'Central Welfare'}
              </span>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                {scheme.level} Scheme
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified: {new Date(scheme.last_verified_date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
              </span>

              <button
                onClick={toggleSave}
                className={`p-2 rounded-xl border transition-colors ${
                  scheme.is_saved
                    ? 'bg-orange-50 border-saffron-300 text-saffron-600'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
                title={scheme.is_saved ? 'Remove Bookmark' : 'Save Scheme'}
              >
                {scheme.is_saved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black text-navy-900 tracking-tight leading-tight mb-4">
            {name}
          </h1>

          <p className="text-sm sm:text-base text-slate-700 leading-relaxed max-w-3xl mb-6">
            {summary}
          </p>

          {/* Core Benefit Highlight Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-emerald-50 border border-orange-200/80 mb-6">
            <span className="text-xs font-bold text-saffron-800 uppercase tracking-wider block mb-1">
              {language === 'te' ? 'లభించే ముఖ్య ప్రయోజనాలు (Benefits)' : 'Entitlement & Financial Benefits'}
            </span>
            <p className="text-sm sm:text-base font-extrabold text-navy-950">
              {benefits}
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-100">
            <Link
              href={`/eligibility?scheme=${scheme.slug}`}
              className="flex items-center gap-2 py-3 px-5 rounded-xl bg-gradient-to-r from-saffron-600 to-orange-600 hover:from-saffron-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'te' ? 'నా అర్హతను పరిశీలించండి' : 'Check My Eligibility'}</span>
            </Link>

            <Link
              href={`/assistant?scheme=${scheme.slug}`}
              className="flex items-center gap-2 py-3 px-4 rounded-xl bg-navy-900 text-white hover:bg-navy-800 text-xs sm:text-sm font-bold transition-all shadow-sm"
            >
              <Bot className="w-4 h-4 text-saffron-400" />
              <span>{language === 'te' ? 'AI ని ప్రశ్నలు అడగండి' : 'Ask JanSathi AI'}</span>
            </Link>

            <Link
              href={`/guide/${scheme.slug}`}
              className="flex items-center gap-2 py-3 px-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 hover:bg-blue-100 text-xs sm:text-sm font-bold transition-all"
            >
              <ListChecks className="w-4 h-4 text-blue-600" />
              <span>{language === 'te' ? 'దరఖాస్తు గైడ్' : 'Application Guide'}</span>
            </Link>

            <a
              href={scheme.official_website}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 py-3 px-4 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-semibold transition-colors ml-auto"
            >
              <span>{language === 'te' ? 'అధికారిక ప్రభుత్వ పోర్టల్' : 'Official Portal'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
            </a>
          </div>
        </div>

        {/* Detailed Sections Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Detailed Scheme Description */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200">
              <h2 className="text-lg font-bold text-navy-900 mb-3 flex items-center gap-2">
                <FileText className="w-5 h-5 text-saffron-600" />
                <span>{language === 'te' ? 'పథకం పూర్తి సమాచారం' : 'Detailed Scheme Overview'}</span>
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                {description}
              </div>
            </div>

            {/* Application Procedure */}
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-200">
              <h2 className="text-lg font-bold text-navy-900 mb-3 flex items-center gap-2">
                <ListChecks className="w-5 h-5 text-blue-600" />
                <span>{language === 'te' ? 'దరఖాస్తు విధానం (దశలవారీగా)' : 'Application Procedure'}</span>
              </h2>
              <div className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-xl border border-slate-200 font-sans">
                {procedure}
              </div>
            </div>

            {/* Official Sources & Verification Audit */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                {language === 'te' ? 'ధృవీకరించబడిన ప్రభుత్వ మూలాలు' : 'Grounded Government Citations'}
              </h3>
              <div className="space-y-2">
                {scheme.sources.map((src) => (
                  <div key={src.id} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <span className="font-semibold text-navy-900">{src.source_name}</span>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-saffron-700 font-bold hover:underline flex items-center gap-1"
                    >
                      <span>{src.verification_status}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Specifications (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Structured Eligibility Criteria */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-navy-900 text-sm mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>{language === 'te' ? 'అర్హత నిబంధనలు' : 'Eligibility Criteria'}</span>
              </h3>

              <div className="space-y-3">
                {scheme.eligibility_rules.map((rule) => (
                  <div key={rule.id} className="flex items-start gap-2.5 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-slate-800">
                        {language === 'te' && rule.description_te ? rule.description_te : rule.description}
                      </p>
                      {rule.is_mandatory && (
                        <span className="text-[10px] font-bold text-red-600 uppercase tracking-wide">
                          Mandatory Requirement
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Required Documents Checklist */}
            <div className="glass-panel p-6 rounded-2xl border border-slate-200">
              <h3 className="font-bold text-navy-900 text-sm mb-4 flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-600" />
                <span>{language === 'te' ? 'కావలసిన పత్రాలు' : 'Required Documents'}</span>
              </h3>

              <div className="space-y-3">
                {scheme.required_documents.map((doc) => (
                  <div key={doc.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <strong className="text-navy-900">
                        {language === 'te' && doc.document_type_te ? doc.document_type_te : doc.document_type}
                      </strong>
                      {doc.is_mandatory && (
                        <span className="text-[10px] font-bold text-red-600 bg-red-50 px-1.5 py-0.5 rounded">
                          Required
                        </span>
                      )}
                    </div>
                    {doc.description && (
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        {doc.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
