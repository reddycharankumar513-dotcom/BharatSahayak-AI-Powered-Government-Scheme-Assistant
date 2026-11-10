'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { apiRequest } from '@/services/api';
import { 
  CheckCircle2, 
  Circle, 
  ArrowLeft, 
  ArrowRight, 
  ExternalLink, 
  FileText, 
  ShieldCheck, 
  Bot, 
  Sparkles,
  Compass,
  Check
} from 'lucide-react';

interface GuideData {
  id: number;
  scheme_id: number;
  scheme_name: string;
  scheme_slug: string;
  current_step: number;
  total_steps: number;
  checklist_status: Record<string, boolean>;
  status: string;
  official_website: string;
}

export default function GuidePage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const { user, token, isLoading: authLoading } = useAuth();
  const schemeSlug = params.id as string;

  const [guide, setGuide] = useState<GuideData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, authLoading, router]);

  const loadGuide = async () => {
    try {
      const data = await apiRequest<GuideData>(`/guides/${schemeSlug}`);
      setGuide(data);
    } catch (err) {
      console.error('Guide load error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && token && schemeSlug) {
      loadGuide();
    }
  }, [user, token, schemeSlug]);

  const toggleChecklist = async (key: string) => {
    if (!guide) return;
    const currentVal = !!guide.checklist_status[key];
    const newStatus = { ...guide.checklist_status, [key]: !currentVal };

    try {
      const updated = await apiRequest<GuideData>(`/guides/${schemeSlug}/step`, {
        method: 'POST',
        body: JSON.stringify({
          current_step: guide.current_step,
          checklist_status: newStatus
        })
      });
      setGuide(updated);
    } catch (err) {
      console.error('Update checklist error:', err);
    }
  };

  const setStep = async (step: number) => {
    if (!guide) return;
    try {
      const updated = await apiRequest<GuideData>(`/guides/${schemeSlug}/step`, {
        method: 'POST',
        body: JSON.stringify({
          current_step: step,
          checklist_status: guide.checklist_status,
          is_completed: step >= 5
        })
      });
      setGuide(updated);
    } catch (err) {
      console.error('Update step error:', err);
    }
  };

  if (authLoading || (loading && user)) {
    return (
      <div className="min-h-screen pt-36 pb-20 flex justify-center">
        <div className="w-8 h-8 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const stepsList = [
    {
      num: 1,
      title: "Confirm Eligibility Criteria",
      key: "step_1_overview_read",
      desc: "Review published criteria (age limits, land ownership, income caps) to ensure you qualify without disqualifications."
    },
    {
      num: 2,
      title: "Organize Required Certificates",
      key: "step_2_eligibility_checked",
      desc: "Gather original Aadhaar, Active Bank Passbook with NPCI linking, and Land RoR or Income Certificate."
    },
    {
      num: 3,
      title: "Aadhaar e-KYC Verification",
      key: "step_3_documents_uploaded",
      desc: "Ensure your mobile number is actively receiving Aadhaar OTPs, or locate your nearest Grama Sachivalayam / CSC centre."
    },
    {
      num: 4,
      title: "Fill Official Portal Application",
      key: "step_4_form_previewed",
      desc: "Open the authorized government portal, select New Registration, enter Khata/survey details, and verify bank IFSC."
    },
    {
      num: 5,
      title: "Track Application & Acknowledgement",
      key: "step_5_official_portal_visited",
      desc: "Save the generated Application / Reference ID number to monitor Direct Benefit Transfer (DBT) approval status."
    }
  ];

  return (
    <div className="min-h-screen pt-28 pb-24 bg-slate-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link
            href={`/schemes/${schemeSlug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-navy-900"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Scheme Details</span>
          </Link>
        </div>

        {/* Header */}
        <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-saffron-700 bg-orange-100 px-3 py-0.5 rounded-full">
              Application Guide Assistant
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
              {guide?.status || 'In Progress'}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight mb-2">
            Step-by-Step Preparation: {guide?.scheme_name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
            Follow this structured checklist to ensure your documents, e-KYC, and registration details are 100% prepared before visiting the government portal.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href={guide?.official_website}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-saffron-600 to-orange-600 text-white font-bold text-xs shadow-sm hover:shadow"
            >
              <span>Open Authorized Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <Link
              href={`/assistant?scheme=${schemeSlug}`}
              className="inline-flex items-center gap-2 py-2.5 px-4 rounded-xl bg-navy-900 text-white text-xs font-bold"
            >
              <Bot className="w-3.5 h-3.5 text-saffron-400" />
              <span>Ask AI Application Guidance</span>
            </Link>
          </div>
        </div>

        {/* 5-Step Process Timeline */}
        <div className="space-y-4">
          {stepsList.map((st) => {
            const isCompleted = !!guide?.checklist_status[st.key];
            const isCurrent = guide?.current_step === st.num;

            return (
              <div
                key={st.num}
                className={`glass-panel p-5 sm:p-6 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'border-saffron-500 ring-2 ring-saffron-200 shadow-md'
                    : 'border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3.5">
                    <button
                      onClick={() => toggleChecklist(st.key)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 text-slate-400 border border-slate-300'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : <span>{st.num}</span>}
                    </button>

                    <div>
                      <h3 className="text-base font-extrabold text-navy-900 mb-1">
                        Step {st.num}: {st.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-3">
                        {st.desc}
                      </p>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setStep(st.num)}
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                            isCurrent
                              ? 'bg-saffron-100 text-saffron-800'
                              : 'text-slate-500 hover:text-navy-900'
                          }`}
                        >
                          {isCurrent ? 'Current Active Step' : 'Mark as Current'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                    isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {isCompleted ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
