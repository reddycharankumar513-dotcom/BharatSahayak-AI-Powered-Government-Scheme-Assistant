'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { apiRequest } from '@/services/api';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Sparkles, 
  FileText, 
  ExternalLink, 
  ArrowRight,
  Filter,
  RefreshCw,
  Info
} from 'lucide-react';

interface ConditionResult {
  rule_type: string;
  description: string;
  description_te?: string;
  is_satisfied: boolean;
  is_mandatory: boolean;
  notes?: string;
}

interface EligibilityReport {
  scheme_id: number;
  scheme_name: string;
  scheme_name_te?: string;
  scheme_slug: string;
  status: string;
  match_percentage: number;
  satisfied_conditions: ConditionResult[];
  unmet_conditions: ConditionResult[];
  required_documents: Array<{ id: number; document_type: string; document_type_te?: string; is_mandatory: boolean }>;
  official_application_link: string;
  explanation: string;
  explanation_te: string;
  disclaimer: string;
}

function EligibilityCheckerContent() {
  const searchParams = useSearchParams();
  const { language } = useLanguage();
  const { user } = useAuth();

  const [schemeSlug, setSchemeSlug] = useState<string>(searchParams.get('scheme') || 'all');
  const [age, setAge] = useState<number>(user?.profile?.age || 38);
  const [occupation, setOccupation] = useState<string>(user?.profile?.occupation || 'Farmer');
  const [state, setState] = useState<string>(user?.profile?.state || 'Andhra Pradesh');
  const [annualIncome, setAnnualIncome] = useState<number>(user?.profile?.annual_income || 150000);
  const [landHolding, setLandHolding] = useState<number>(user?.profile?.land_holding_acres || 2.5);
  const [hasRationCard, setHasRationCard] = useState<boolean>(true);
  const [ownsPuccaHouse, setOwnsPuccaHouse] = useState<boolean>(false);
  const [isTaxPayer, setIsTaxPayer] = useState<boolean>(false);

  const [reports, setReports] = useState<EligibilityReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasEvaluated, setHasEvaluated] = useState(false);

  const runEvaluation = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<EligibilityReport[]>('/eligibility/check', {
        method: 'POST',
        body: JSON.stringify({
          scheme_slug: schemeSlug,
          age,
          occupation,
          state,
          annual_income: annualIncome,
          land_holding_acres: landHolding,
          has_ration_card: hasRationCard,
          owns_pucca_house: ownsPuccaHouse,
          is_income_tax_payer: isTaxPayer,
          language
        })
      });
      setReports(data);
      setHasEvaluated(true);
    } catch (err) {
      console.error('Eligibility check error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runEvaluation();
  }, [schemeSlug]);

  return (
    <div className="min-h-screen pt-28 pb-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-saffron-800 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5 text-saffron-600" />
            <span>{language === 'te' ? 'నియమ-ఆధారిత అర్హత ఇంజిన్' : 'Deterministic Eligibility Engine'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
            {language === 'te' ? 'ప్రభుత్వ పథకాల అర్హత తనిఖీ' : 'Check Welfare Scheme Eligibility'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            {language === 'te'
              ? 'మీ వ్యక్తిగత వివరాలను నమోదు చేయండి మరియు అధికారిక నిబంధనల ప్రకారం ఖచ్చితమైన అర్హతను క్షణాల్లో తెలుసుకోండి.'
              : 'Deterministic matching against published Gazette rules with zero hallucination.'}
          </p>
        </div>

        {/* 2-Column Grid: Form & Results */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Form (5 cols) */}
          <div className="lg:col-span-5 glass-panel p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <h2 className="text-base font-bold text-navy-900 pb-2 border-b border-slate-200 flex items-center justify-between">
              <span>{language === 'te' ? 'మీ వివరాలను నమోదు చేయండి' : 'Enter Citizen Details'}</span>
              <Filter className="w-4 h-4 text-slate-400" />
            </h2>

            {/* Scheme Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {language === 'te' ? 'లక్ష్య పథకం' : 'Target Scheme'}
              </label>
              <select
                value={schemeSlug}
                onChange={(e) => setSchemeSlug(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
              >
                <option value="all">Check All Popular Schemes</option>
                <option value="pm-kisan">PM-KISAN (Kisan Samman Nidhi)</option>
                <option value="ayushman-bharat">Ayushman Bharat (PM-JAY Health)</option>
                <option value="pm-awas-yojana">Pradhan Mantri Awas Yojana (Housing)</option>
                <option value="pm-mudra-yojana">PM Mudra Yojana (Business Loans)</option>
                <option value="sukanya-samriddhi">Sukanya Samriddhi (Girl Child)</option>
              </select>
            </div>

            {/* Occupation */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {language === 'te' ? 'వృత్తి / Occupation' : 'Occupation'}
              </label>
              <select
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
              >
                <option value="Farmer">Farmer (రైతు / Cultivator)</option>
                <option value="Student">Student (విద్యార్థి)</option>
                <option value="Small Business">Small Business / Kirana / MSME</option>
                <option value="Daily Wage Laborer">Daily Wage Laborer / Artisan</option>
                <option value="Homemaker">Homemaker (గృహిణి)</option>
              </select>
            </div>

            {/* Age & Land */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {language === 'te' ? 'వయస్సు / Age' : 'Age (Years)'}
                </label>
                <input
                  type="number"
                  min={1}
                  max={100}
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  {language === 'te' ? 'సాగుభూమి (ఎకరాలు)' : 'Land Holding (Acres)'}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min={0}
                  value={landHolding}
                  onChange={(e) => setLandHolding(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
                />
              </div>
            </div>

            {/* Annual Income */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                {language === 'te' ? 'కుటుంబ వార్షిక ఆదాయం (రూ.)' : 'Annual Family Income (₹)'}
              </label>
              <input
                type="number"
                step="10000"
                min={0}
                value={annualIncome}
                onChange={(e) => setAnnualIncome(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 bg-white"
              />
            </div>

            {/* Checklist Toggles */}
            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasRationCard}
                  onChange={(e) => setHasRationCard(e.target.checked)}
                  className="rounded text-saffron-600 focus:ring-saffron-500 w-4 h-4"
                />
                <span className="font-semibold text-slate-800">Possess active Food Security / Ration Card</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ownsPuccaHouse}
                  onChange={(e) => setOwnsPuccaHouse(e.target.checked)}
                  className="rounded text-saffron-600 focus:ring-saffron-500 w-4 h-4"
                />
                <span className="font-semibold text-slate-800">Own a Pucca (Concrete) House in India</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isTaxPayer}
                  onChange={(e) => setIsTaxPayer(e.target.checked)}
                  className="rounded text-saffron-600 focus:ring-saffron-500 w-4 h-4"
                />
                <span className="font-semibold text-slate-800">Income Tax Payer in previous assessment year</span>
              </label>
            </div>

            <button
              onClick={runEvaluation}
              disabled={loading}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-saffron-600 to-orange-600 hover:from-saffron-700 text-white font-bold text-sm shadow-md transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Evaluating Rules...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Re-Evaluate Eligibility</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Evaluation Results (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {reports.map((report) => {
              const isEligible = report.status === 'Potentially Eligible';

              return (
                <div
                  key={report.scheme_id}
                  className={`glass-panel p-6 sm:p-7 rounded-3xl border transition-all ${
                    isEligible
                      ? 'border-emerald-300 ring-1 ring-emerald-100 shadow-sm'
                      : 'border-slate-200'
                  }`}
                >
                  {/* Top Bar: Scheme Name and Status Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <h3 className="font-black text-navy-900 text-lg sm:text-xl">
                      {language === 'te' && report.scheme_name_te ? report.scheme_name_te : report.scheme_name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                        {report.match_percentage}% Match
                      </span>
                      <span
                        className={`text-xs font-extrabold px-3 py-1 rounded-full border ${
                          isEligible
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        {report.status}
                      </span>
                    </div>
                  </div>

                  {/* AI Grounded Explanation */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700 mb-5 leading-relaxed">
                    {language === 'te' ? report.explanation_te : report.explanation}
                  </div>

                  {/* Conditions Breakdown */}
                  <div className="space-y-4 mb-6">
                    {/* Satisfied Criteria */}
                    {report.satisfied_conditions.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Satisfied Criteria ({report.satisfied_conditions.length})</span>
                        </h4>
                        <div className="space-y-1.5">
                          {report.satisfied_conditions.map((c, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs p-2 rounded-xl bg-emerald-50/60 border border-emerald-100 text-slate-800">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold">{language === 'te' && c.description_te ? c.description_te : c.description}</span>
                                {c.notes && <p className="text-[11px] text-slate-500 mt-0.5">{c.notes}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Unmet Criteria */}
                    {report.unmet_conditions.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-red-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                          <span>Unmet Criteria / Disqualifications ({report.unmet_conditions.length})</span>
                        </h4>
                        <div className="space-y-1.5">
                          {report.unmet_conditions.map((c, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs p-2 rounded-xl bg-red-50/60 border border-red-100 text-slate-800">
                              <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-semibold text-red-900">{language === 'te' && c.description_te ? c.description_te : c.description}</span>
                                {c.notes && <p className="text-[11px] text-slate-500 mt-0.5">{c.notes}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions & Official Link */}
                  <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <Link
                      href={`/schemes/${report.scheme_slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-navy-900 hover:text-saffron-600"
                    >
                      <span>View Scheme Specifications</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>

                    <a
                      href={report.official_application_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 py-2 px-3.5 rounded-xl bg-navy-900 text-white hover:bg-saffron-600 text-xs font-bold shadow-sm transition-colors"
                    >
                      <span>Official Portal</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}

            {/* Official Disclaimer Notice */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
              <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                <strong>Informational Notice:</strong> This eligibility calculation is an automated rule assessment based on published Central/State criteria. Official entitlement approval is subject to document scrutiny by respective government departments upon formal portal submission.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function EligibilityPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen pt-36 pb-20 flex justify-center">
        <div className="w-8 h-8 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <EligibilityCheckerContent />
    </Suspense>
  );
}
