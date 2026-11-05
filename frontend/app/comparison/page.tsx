'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { apiRequest } from '@/services/api';
import { 
  GitCompare, 
  Plus, 
  X, 
  ShieldCheck, 
  ExternalLink, 
  ArrowRight, 
  CheckCircle2, 
  FileText,
  Building2,
  Sparkles
} from 'lucide-react';

interface SchemeDetail {
  id: number;
  name: string;
  name_te?: string;
  slug: string;
  level: string;
  summary: string;
  summary_te?: string;
  benefits: string;
  benefits_te?: string;
  application_procedure: string;
  application_procedure_te?: string;
  official_website: string;
  last_verified_date: string;
  category?: { name: string };
  eligibility_rules: Array<{ id: number; description: string; description_te?: string }>;
  required_documents: Array<{ id: number; document_type: string; document_type_te?: string }>;
}

function ComparisonContent() {
  const searchParams = useSearchParams();
  const { language } = useLanguage();

  const [availableSchemes, setAvailableSchemes] = useState<SchemeDetail[]>([]);
  const [comparedSchemes, setComparedSchemes] = useState<SchemeDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all schemes
    apiRequest<SchemeDetail[]>('/schemes?limit=50')
      .then(async (all) => {
        // Fetch full details for the schemes
        const detailedList: SchemeDetail[] = await Promise.all(
          all.map((s) => apiRequest<SchemeDetail>(`/schemes/${s.slug}`).catch(() => s as SchemeDetail))
        );
        setAvailableSchemes(detailedList);

        // Preload based on URL parameter or default to first 2
        const queryParam = searchParams.get('schemes');
        if (queryParam) {
          const slugs = queryParam.split(',');
          const matched = detailedList.filter((s) => slugs.includes(s.slug));
          setComparedSchemes(matched.length > 0 ? matched : detailedList.slice(0, 2));
        } else {
          setComparedSchemes(detailedList.slice(0, 2));
        }
      })
      .catch((err) => console.error('Comparison load error:', err))
      .finally(() => setLoading(false));
  }, [searchParams]);

  const addScheme = (slug: string) => {
    if (comparedSchemes.length >= 3) {
      alert('You can compare a maximum of 3 schemes simultaneously.');
      return;
    }
    const found = availableSchemes.find((s) => s.slug === slug);
    if (found && !comparedSchemes.some((s) => s.slug === slug)) {
      setComparedSchemes([...comparedSchemes, found]);
    }
  };

  const removeScheme = (slug: string) => {
    setComparedSchemes(comparedSchemes.filter((s) => s.slug !== slug));
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-saffron-800 text-xs font-bold uppercase tracking-wider mb-2">
            <GitCompare className="w-3.5 h-3.5 text-saffron-600" />
            <span>{language === 'te' ? 'పథకాల పోలిక పరికరం' : 'Scheme Comparison Engine'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
            {language === 'te' ? 'ప్రభుత్వ పథకాల ప్రత్యక్ష పోలిక' : 'Compare Government Welfare Initiatives'}
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            {language === 'te'
              ? 'ప్రయోజనాలు, అర్హత నిబంధనలు మరియు పత్రాల అవసరాలను పక్కపక్కనే పరిశీలించండి.'
              : 'Side-by-side analysis of benefits, eligibility conditions, and documentation requirements.'}
          </p>
        </div>

        {/* Add Scheme Selector */}
        <div className="glass-panel p-4 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-navy-900 uppercase tracking-wider">
              Comparing ({comparedSchemes.length}/3 schemes):
            </span>
            {comparedSchemes.map((s) => (
              <span
                key={s.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-50 border border-orange-200 text-xs font-bold text-saffron-800"
              >
                <span>{s.name.split('(')[0].trim()}</span>
                <button onClick={() => removeScheme(s.slug)} className="hover:text-red-600">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          {comparedSchemes.length < 3 && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addScheme(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
                className="py-2 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 bg-white"
              >
                <option value="" disabled>+ Add Scheme to Compare...</option>
                {availableSchemes
                  .filter((s) => !comparedSchemes.some((c) => c.slug === s.slug))
                  .map((s) => (
                    <option key={s.id} value={s.slug}>
                      {s.name}
                    </option>
                  ))}
              </select>
            </div>
          )}
        </div>

        {/* Comparison Table */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-9 h-9 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Preparing scheme comparison matrix...</p>
          </div>
        ) : comparedSchemes.length > 0 ? (
          <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-sm bg-white">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/90 border-b border-slate-200">
                  <th className="p-5 text-xs font-extrabold uppercase tracking-wider text-slate-500 w-1/4">
                    Feature Criteria
                  </th>
                  {comparedSchemes.map((scheme) => (
                    <th key={scheme.id} className="p-5 text-left border-l border-slate-200 min-w-[280px]">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-saffron-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                          {scheme.category?.name || 'Central'}
                        </span>
                        <button
                          onClick={() => removeScheme(scheme.slug)}
                          className="text-slate-400 hover:text-red-500 p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                      <h3 className="font-black text-navy-900 text-base leading-snug">
                        {language === 'te' && scheme.name_te ? scheme.name_te : scheme.name}
                      </h3>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {/* Benefits Row */}
                <tr>
                  <td className="p-5 font-bold text-navy-900 bg-slate-50/40">
                    {language === 'te' ? 'లభించే ప్రయోజనాలు' : 'Financial / Welfare Benefits'}
                  </td>
                  {comparedSchemes.map((s) => (
                    <td key={s.id} className="p-5 border-l border-slate-200 text-slate-800 font-semibold leading-relaxed">
                      {language === 'te' && s.benefits_te ? s.benefits_te : s.benefits}
                    </td>
                  ))}
                </tr>

                {/* Eligibility Criteria */}
                <tr>
                  <td className="p-5 font-bold text-navy-900 bg-slate-50/40">
                    {language === 'te' ? 'అర్హత నిబంధనలు' : 'Eligibility Requirements'}
                  </td>
                  {comparedSchemes.map((s) => (
                    <td key={s.id} className="p-5 border-l border-slate-200 space-y-1.5">
                      {s.eligibility_rules && s.eligibility_rules.length > 0 ? (
                        s.eligibility_rules.map((r) => (
                          <div key={r.id} className="flex items-start gap-1.5 text-xs text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{language === 'te' && r.description_te ? r.description_te : r.description}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400 text-xs">Standard eligibility rules apply.</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Required Documents */}
                <tr>
                  <td className="p-5 font-bold text-navy-900 bg-slate-50/40">
                    {language === 'te' ? 'అవసరమైన పత్రాలు' : 'Required Documents'}
                  </td>
                  {comparedSchemes.map((s) => (
                    <td key={s.id} className="p-5 border-l border-slate-200 space-y-1.5">
                      {s.required_documents && s.required_documents.length > 0 ? (
                        s.required_documents.map((d) => (
                          <div key={d.id} className="flex items-center gap-1.5 text-xs text-slate-700">
                            <FileText className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                            <span>{language === 'te' && d.document_type_te ? d.document_type_te : d.document_type}</span>
                          </div>
                        ))
                      ) : (
                        <span className="text-slate-400 text-xs">Basic identity proof required.</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Level & Jurisdiction */}
                <tr>
                  <td className="p-5 font-bold text-navy-900 bg-slate-50/40">
                    {language === 'te' ? 'ప్రభుత్వ స్థాయి' : 'Government Level'}
                  </td>
                  {comparedSchemes.map((s) => (
                    <td key={s.id} className="p-5 border-l border-slate-200 font-semibold text-slate-700">
                      {s.level} Level Initiative
                    </td>
                  ))}
                </tr>

                {/* Actions */}
                <tr className="bg-slate-50/20">
                  <td className="p-5 font-bold text-navy-900 bg-slate-50/40">
                    Actions
                  </td>
                  {comparedSchemes.map((s) => (
                    <td key={s.id} className="p-5 border-l border-slate-200 space-y-2">
                      <Link
                        href={`/eligibility?scheme=${s.slug}`}
                        className="w-full block text-center py-2 px-3 rounded-xl bg-navy-900 text-white hover:bg-saffron-600 text-xs font-bold transition-colors shadow-sm"
                      >
                        {language === 'te' ? 'అర్హత తనిఖీ' : 'Check Eligibility'}
                      </Link>
                      <a
                        href={s.official_website}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full flex items-center justify-center gap-1 py-1.5 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-3xl border border-slate-200 text-center max-w-md mx-auto">
            <GitCompare className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm text-slate-600 mb-4">Please select at least 2 schemes to compare.</p>
            <Link
              href="/schemes"
              className="py-2 px-4 rounded-xl bg-navy-900 text-white text-xs font-bold"
            >
              Go to Scheme Explorer
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ComparisonPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-36 pb-20 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-xs font-semibold text-slate-500">Loading Scheme Comparison Engine...</p>
      </div>
    }>
      <ComparisonContent />
    </Suspense>
  );
}
