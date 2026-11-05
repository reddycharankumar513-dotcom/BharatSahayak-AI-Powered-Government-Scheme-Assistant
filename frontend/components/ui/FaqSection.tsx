'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/lib/language-context';
import { ChevronDown, HelpCircle, Sparkles } from 'lucide-react';

export default function FaqSection() {
  const { language, t } = useLanguage();
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      qEn: "How does JanSathi AI ensure scheme information is accurate and up to date?",
      qTe: "జన్ సాథి AI ప్రభుత్వ పథకాల సమాచారాన్ని ఎలా ఖచ్చితంగా మరియు తాజాగా ఉంచుతుంది?",
      aEn: "JanSathi AI uses a Retrieval-Augmented Generation (RAG) architecture connected directly to official Government of India gazettes, ministry notifications, and verified public repositories (such as data.gov.in and india.gov.in). Each scheme is tagged with its last verified date and official source URL. The AI is strictly prompt-engineered never to invent benefits or eligibility rules.",
      aTe: "జన్ సాథి AI అధికారిక భారత ప్రభుత్వ గెజిట్లు, మంత్రిత్వ శాఖల ప్రకటనలు మరియు అధికారిక పోర్టళ్ల (data.gov.in, india.gov.in) నుండి ధృవీకరించబడిన డేటాను మాత్రమే ఉపయోగిస్తుంది. ప్రతీ పథకం చివరి ధృవీకరణ తేదీ మరియు అధికారిక వెబ్‌సైట్ లింక్‌తో ముడిపడి ఉంటుంది. AI ఎప్పుడూ ఊహాజనిత సమాచారాన్ని సృష్టించదు.",
    },
    {
      qEn: "Does JanSathi AI submit applications directly to government portals on my behalf?",
      qTe: "జన్ సాథి AI నా తరఫున దరఖాస్తులను నేరుగా ప్రభుత్వ పోర్టల్‌లో సమర్పిస్తుందా?",
      aEn: "No. JanSathi AI acts as an informational guide, document readiness assistant, and eligibility checker. To ensure citizen security, we provide direct links to authorized government portals (such as pmkisan.gov.in or pmjay.gov.in) where you submit your official application. We never ask for Aadhaar OTPs or bank credentials.",
      aTe: "లేదు. జన్ సాథి AI మీకు మార్గదర్శిగా, అర్హత పరిశీలకుడిగా మరియు పత్రాల సంసిద్ధత సహాయకుడిగా మాత్రమే పనిచేస్తుంది. మీ భద్రత దృష్ట్యా, అధికారిక ప్రభుత్వ వెబ్‌సైట్ల లింకులను మాత్రమే అందిస్తాము. మేము ఎప్పుడూ ఆధార్ OTPలు లేదా బ్యాంక్ వివరాలను అడగము.",
    },
    {
      qEn: "Is Telugu voice input and audio response supported?",
      qTe: "తెలుగులో వాయిస్ ద్వారా మాట్లాడటం మరియు ఆడియో సమాధానాలు పొందడం సాధ్యమేనా?",
      aEn: "Yes! JanSathi AI features a dedicated Voice-First Rural Assistant that allows citizens to speak questions in Telugu or English using Speech-to-Text, and listen to synthesized voice guidance. This is specifically designed to eliminate literacy and typing barriers for rural citizens.",
      aTe: "అవును! జన్ సాథి AI గ్రామీణ పౌరుల కోసం ప్రత్యేక వాయిస్ అసిస్టెంట్‌ను కలిగి ఉంది. మీరు తెలుగులో నేరుగా మాట్లాడి ప్రశ్నలు అడగవచ్చు మరియు సమాధానాలను ఆడియో రూపంలో వినవచ్చు. ఇది టైపింగ్ మరియు చదవడం రాని వారికి ఎంతో ఉపయోగపడుతుంది.",
    },
    {
      qEn: "How does the AI Eligibility Checker work?",
      qTe: "AI అర్హత తనిఖీ వ్యవస్థ ఎలా పనిచేస్తుంది?",
      aEn: "The eligibility evaluation is 100% deterministic and rule-based. It cross-checks your profile parameters (age, state, occupation, landholding, income bracket) against official scheme criteria and provides a clear breakdown of matching conditions and unmet prerequisites, with an explicit reminder that results are informational estimates.",
      aTe: "ఈ అర్హత పరిశీలన పూర్తిగా నియమ-ఆధారితమైనది. మీ వయస్సు, రాష్ట్రం, వృత్తి, వ్యవసాయ భూమి మరియు ఆదాయ వివరాలను అధికారిక నిబంధనలతో పోల్చి, మీకు సరిపోయే మరియు సరిపోని నిబంధనలను స్పష్టంగా వివరిస్తుంది.",
    },
    {
      qEn: "What happens to documents uploaded for OCR analysis?",
      qTe: "OCR కోసం అప్‌లోడ్ చేసిన పత్రాలు సురక్షితంగా ఉంటాయా?",
      aEn: "All uploaded documents are processed securely in local isolated pipelines for text extraction, field detection (like certificate dates or names), and document readiness checking. Citizens have full control to inspect and permanently delete their uploaded files at any time.",
      aTe: "అప్‌లోడ్ చేసిన అన్ని పత్రాలు కేవలం వివరాల వెలికితీత మరియు చెక్‌లిస్ట్ సరిచూసుకోవడానికి మాత్రమే అత్యంత సురక్షితంగా ప్రాసెస్ చేయబడతాయి. పౌరులు తమ పత్రాలను ఎప్పుడైనా శాశ్వతంగా తొలగించుకునే పూర్తి నియంత్రణను కలిగి ఉంటారు.",
    },
    {
      qEn: "Is JanSathi AI free to use for all citizens?",
      qTe: "జన్ సాథి AI పౌరులందరికీ ఉచితంగా అందుబాటులో ఉంటుందా?",
      aEn: "Yes, JanSathi AI is 100% free for all Indian citizens. It is built under the vision of Digital Public Goods and Digital Public Infrastructure (DPI) to make governance accessible to every stratum of society.",
      aTe: "అవును, జన్ సాథి AI భారతీయ పౌరులందరికీ 100% ఉచితం. ప్రతి పౌరుడికీ ప్రభుత్వ సేవలు సులభంగా చేరాలనే డిజిటల్ పబ్లిక్ ఇన్‌ఫ్రాస్ట్రక్చర్ సంకల్పంతో ఇది నిర్మించబడింది.",
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-saffron-800 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5 text-saffron-600" />
            <span>{t.faq.badge}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
            {t.faq.heading}
          </h2>
          <p className="mt-2 text-base text-slate-600">
            {t.faq.subheading}
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            const q = language === 'te' ? faq.qTe : faq.qEn;
            const a = language === 'te' ? faq.aTe : faq.aEn;

            return (
              <div
                key={faq.qEn}
                className={`rounded-2xl border transition-all ${
                  isOpen
                    ? 'border-saffron-500/80 bg-orange-50/20 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between p-5 sm:p-6 text-left"
                >
                  <span className="font-extrabold text-navy-900 text-base sm:text-lg pr-4">
                    {q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-saffron-600 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-slate-600 leading-relaxed border-t border-orange-100/60">
                    {a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
