'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { 
  CheckCircle2, 
  ExternalLink, 
  ArrowRight, 
  Sparkles, 
  Building2, 
  HeartHandshake, 
  Coins, 
  GraduationCap, 
  Home, 
  Wheat,
  ShieldCheck
} from 'lucide-react';

interface SchemeCardData {
  id: string;
  category: string;
  categoryEn: string;
  nameEn: string;
  nameTe: string;
  summaryEn: string;
  summaryTe: string;
  benefitsEn: string;
  benefitsTe: string;
  eligibilityKeyEn: string;
  eligibilityKeyTe: string;
  officialPortal: string;
  verifiedDate: string;
  icon: any;
  color: string;
}

const SAMPLE_POPULAR_SCHEMES: SchemeCardData[] = [
  {
    id: 'pm-kisan',
    category: 'agriculture',
    categoryEn: 'Agriculture',
    nameEn: 'PM-KISAN (Kisan Samman Nidhi)',
    nameTe: 'పీఎం కిసాన్ (కిసాన్ సమ్మాన్ నిధి)',
    summaryEn: 'Central sector scheme providing income support to small and marginal landholding farmer families across India.',
    summaryTe: 'భారతదేశంలోని చిన్న మరియు సన్నకారు రైతు కుటుంబాలకు ఏటా ఆర్థిక చేయూతనిచ్చే కేంద్ర ప్రభుత్వ పథకం.',
    benefitsEn: '₹6,000 per year in 3 equal installments of ₹2,000 directly transferred to bank accounts (DBT).',
    benefitsTe: 'ఏడాదికి ₹6,000 నగదు, 3 విడతల్లో నేరుగా బ్యాంకు ఖాతాల్లోకి జమ (DBT).',
    eligibilityKeyEn: 'Landholding farmer families with cultivable land in their name.',
    eligibilityKeyTe: 'సొంతంగా సాగుభూమి ఉన్న రైతు కుటుంబాలు.',
    officialPortal: 'https://pmkisan.gov.in',
    verifiedDate: 'November 2026',
    icon: Wheat,
    color: 'border-orange-500 text-orange-600 bg-orange-50',
  },
  {
    id: 'ayushman-bharat',
    category: 'healthcare',
    categoryEn: 'Healthcare',
    nameEn: 'Ayushman Bharat (PM-JAY)',
    nameTe: 'ఆయుష్మాన్ భారత్ (పీఎం జేఏవై)',
    summaryEn: 'Worlds largest government-funded health assurance scheme providing secondary and tertiary hospitalization cover.',
    summaryTe: 'పేద కుటుంబాలకు ద్వితీయ మరియు తృతీయ స్థాయి ఆసుపత్రి చికిత్సల కోసం ఉచిత ఆరోగ్య బీమా పథకం.',
    benefitsEn: 'Cashless health cover up to ₹5,00,000 per family per year across 27,000+ empaneled hospitals.',
    benefitsTe: 'కుటుంబానికి ఏడాదికి ₹5,00,000 వరకు ఉచిత నగదు రహిత ఆసుపత్రి చికిత్స ప్రయోజనం.',
    eligibilityKeyEn: 'Families identified in SECC 2011 deprivation criteria & active ration cards.',
    eligibilityKeyTe: 'SECC 2011 డేటా ప్రకారం పేద మరియు బలహీన వర్గాల కుటుంబాలు.',
    officialPortal: 'https://pmjay.gov.in',
    verifiedDate: 'November 2026',
    icon: HeartHandshake,
    color: 'border-emerald-500 text-emerald-600 bg-emerald-50',
  },
  {
    id: 'pm-awas-yojana',
    category: 'housing',
    categoryEn: 'Housing',
    nameEn: 'Pradhan Mantri Awas Yojana (PMAY)',
    nameTe: 'ప్రధాన మంత్రి ఆవాస్ యోజన (పీఎంఏవై)',
    summaryEn: 'Flagship mission to provide all-weather pucca houses with basic amenities to homeless and kutcha house dwellers.',
    summaryTe: 'ఇల్లు లేని నిరుపేదలకు పక్కా గృహాల నిర్మాణం కోసం ఆర్థిక రాయితీ అందించే పథకం.',
    benefitsEn: 'Interest subsidy up to ₹2.67 Lakh for home loans, or direct construction grant of ₹1.20-1.30 Lakh in rural areas.',
    benefitsTe: 'గృహ రుణంపై ₹2.67 లక్షల వరకు వడ్డీ రాయితీ లేదా గ్రామీణ ప్రాంతంలో ప్రత్యక్ష గృహ నిర్మాణ నిధులు.',
    eligibilityKeyEn: 'EWS/LIG families who do not own a pucca house anywhere in India.',
    eligibilityKeyTe: 'దేశంలో ఎక్కడా సొంత పక్కా ఇల్లు లేని పేద కుటుంబాలు.',
    officialPortal: 'https://pmaymis.gov.in',
    verifiedDate: 'November 2026',
    icon: Home,
    color: 'border-blue-500 text-blue-600 bg-blue-50',
  },
  {
    id: 'pm-mudra-yojana',
    category: 'finance',
    categoryEn: 'Financial',
    nameEn: 'Pradhan Mantri Mudra Yojana (PMMY)',
    nameTe: 'పీఎం ముద్రా యోజన (పీఎంఎంవై)',
    summaryEn: 'Institutional micro-credit facility providing collateral-free loans to micro and small non-corporate enterprises.',
    summaryTe: 'చిరు వ్యాపారులు మరియు సూక్ష్మ పరిశ్రమల స్థాపనకు పూచీకత్తు లేని రుణ సదుపాయం.',
    benefitsEn: 'Loans up to ₹10 Lakh in three tiers: Shishu (up to ₹50k), Kishore (₹50k-5L), Tarun (₹5L-10L).',
    benefitsTe: '₹10 లక్షల వరకు పూచీకత్తు లేని బ్యాంక్ రుణం (శిశు, కిశోర్ మరియు తరుణ్ కేటగిరీలు).',
    eligibilityKeyEn: 'Indian citizens with a business plan for non-farm income-generating activities.',
    eligibilityKeyTe: 'వ్యవసాయేతర స్వయం ఉపాధి లేదా వ్యాపారం ప్రారంభించాలనుకునే భారతీయ పౌరులు.',
    officialPortal: 'https://www.mudra.org.in',
    verifiedDate: 'November 2026',
    icon: Coins,
    color: 'border-purple-500 text-purple-600 bg-purple-50',
  },
  {
    id: 'sukanya-samriddhi',
    category: 'women-child',
    categoryEn: 'Women & Child',
    nameEn: 'Sukanya Samriddhi Yojana (SSY)',
    nameTe: 'సుకున్య సమృద్ధి యోజన (ఎస్ఎస్వై)',
    summaryEn: 'High-interest, tax-free government-backed savings initiative aimed at securing the financial future of girl children.',
    summaryTe: 'ఆడపిల్లల ఉన్నత చదువులు మరియు భవిష్యత్తు కోసం అత్యధిక వడ్డీ మరియు పన్ను మినహాయింపు పథకం.',
    benefitsEn: '8.2% annual compounded interest, complete tax exemption under Sec 80C, matures on marriage/age 21.',
    benefitsTe: '8.2% వరకు అధిక చక్రవడ్డీ, ఆదాయపు పన్ను సెక్షన్ 80C కింద పూర్తి పన్ను మినహాయింపు.',
    eligibilityKeyEn: 'Parents or guardians of a girl child below 10 years of age (max 2 girls per family).',
    eligibilityKeyTe: '10 సంవత్సరాలలోపు వయస్సు ఉన్న బాలిక తల్లిదండ్రులు లేదా సంరక్షకులు.',
    officialPortal: 'https://www.indiapost.gov.in',
    verifiedDate: 'November 2026',
    icon: Building2,
    color: 'border-pink-500 text-pink-600 bg-pink-50',
  },
  {
    id: 'pm-vidyalakshmi',
    category: 'education',
    categoryEn: 'Education',
    nameEn: 'PM-Vidyalaxmi Education Loan Scheme',
    nameTe: 'పీఎం-విద్యా లక్ష్మి ఉన్నత విద్య రుణ పథకం',
    summaryEn: 'Unified portal connecting students seeking educational loans with public and private banks under simplified terms.',
    summaryTe: 'పేద విద్యార్థులు ఉన్నత విద్యను అభ్యసించడానికి కేంద్ర ప్రభుత్వ పూచీకత్తుతో సులభతర రుణ పథకం.',
    benefitsEn: 'Collateral-free, guarantor-free education loans up to ₹7.5 Lakh with full interest subvention for low income.',
    benefitsTe: '₹7.5 లక్షల వరకు పూచీకత్తు లేని ఉన్నత విద్యా రుణాలు మరియు పూర్తి వడ్డీ రాయితీ.',
    eligibilityKeyEn: 'Indian students admitted to approved Higher Education Institutions (HEIs).',
    eligibilityKeyTe: 'గుర్తింపు పొందిన ఉన్నత విద్యా సంస్థల్లో ప్రవేశం పొందిన భారతీయ విద్యార్థులు.',
    officialPortal: 'https://www.vidyalakshmi.co.in',
    verifiedDate: 'November 2026',
    icon: GraduationCap,
    color: 'border-teal-500 text-teal-600 bg-teal-50',
  },
];

export default function PopularSchemesSection() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState('all');

  const filteredSchemes = activeTab === 'all'
    ? SAMPLE_POPULAR_SCHEMES
    : SAMPLE_POPULAR_SCHEMES.filter((s) => s.category === activeTab);

  const tabs = [
    { id: 'all', label: t.schemes.all },
    { id: 'agriculture', label: t.schemes.agriculture },
    { id: 'healthcare', label: t.schemes.healthcare },
    { id: 'housing', label: t.schemes.housing },
    { id: 'finance', label: t.schemes.finance },
    { id: 'women-child', label: t.schemes.womenChild },
    { id: 'education', label: t.schemes.education },
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-saffron-800 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
            <span>{t.schemes.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
            {t.schemes.heading}
          </h2>
          <p className="mt-3 text-base text-slate-600">
            {t.schemes.subheading}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-4 gap-2 no-scrollbar mb-10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-navy-900 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-navy-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredSchemes.map((scheme) => {
            const Icon = scheme.icon;
            const name = language === 'te' ? scheme.nameTe : scheme.nameEn;
            const summary = language === 'te' ? scheme.summaryTe : scheme.summaryEn;
            const benefits = language === 'te' ? scheme.benefitsTe : scheme.benefitsEn;
            const eligibility = language === 'te' ? scheme.eligibilityKeyTe : scheme.eligibilityKeyEn;

            return (
              <div
                key={scheme.id}
                className="glass-card rounded-2xl p-6 flex flex-col justify-between border border-slate-200/80 hover:border-saffron-400/80 transition-all shadow-sm hover:shadow-lg"
              >
                <div>
                  {/* Card Header: Category & Verified Tag */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200/60">
                      {scheme.categoryEn}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{scheme.verifiedDate}</span>
                    </span>
                  </div>

                  {/* Scheme Icon & Title */}
                  <div className="flex items-start gap-3.5 mb-3">
                    <div className={`p-2.5 rounded-xl border ${scheme.color} shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-navy-900 text-lg leading-snug">
                        {name}
                      </h3>
                    </div>
                  </div>

                  {/* Summary */}
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
                    {summary}
                  </p>

                  {/* Highlighted Benefit Box */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 mb-3 text-xs">
                    <span className="font-bold text-navy-900 block mb-0.5 text-[11px] uppercase tracking-wide text-saffron-700">
                      {t.schemes.benefitLabel}:
                    </span>
                    <p className="text-slate-700 font-medium">
                      {benefits}
                    </p>
                  </div>

                  {/* Eligibility Hint */}
                  <div className="flex items-start gap-1.5 text-xs text-slate-500 mb-5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{eligibility}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                  <Link
                    href={`/eligibility?scheme=${scheme.id}`}
                    className="flex-1 text-center py-2 px-3 text-xs font-bold rounded-lg bg-navy-900 text-white hover:bg-saffron-600 transition-colors shadow-sm"
                  >
                    {t.schemes.checkEligibility}
                  </Link>
                  <a
                    href={scheme.officialPortal}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg border border-slate-200 text-slate-600 hover:text-navy-900 hover:bg-slate-50 transition-colors"
                    title={t.schemes.verifiedSource}
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Schemes Bottom CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/schemes"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold text-sm transition-all shadow-sm"
          >
            <span>Explore All 500+ Central & State Schemes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
