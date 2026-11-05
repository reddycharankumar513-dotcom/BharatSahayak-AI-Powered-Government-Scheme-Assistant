'use client';

import React from 'react';
import { useLanguage } from '@/lib/language-context';
import { Search, CheckCircle2, FileCheck2, Compass, ArrowRight } from 'lucide-react';

export default function HowItWorksSection() {
  const { t } = useLanguage();

  const steps = [
    {
      num: '01',
      title: t.howItWorks.s1Title,
      desc: t.howItWorks.s1Desc,
      icon: Search,
      color: 'bg-orange-50 text-saffron-600 border-orange-200',
    },
    {
      num: '02',
      title: t.howItWorks.s2Title,
      desc: t.howItWorks.s2Desc,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      num: '03',
      title: t.howItWorks.s3Title,
      desc: t.howItWorks.s3Desc,
      icon: FileCheck2,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
    },
    {
      num: '04',
      title: t.howItWorks.s4Title,
      desc: t.howItWorks.s4Desc,
      icon: Compass,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
  ];

  return (
    <section className="py-20 bg-slate-50/70 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-saffron-800 text-xs font-bold uppercase tracking-wider mb-3">
            <span>{t.howItWorks.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
            {t.howItWorks.heading}
          </h2>
          <p className="mt-3 text-base text-slate-600">
            {t.howItWorks.subheading}
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative glass-card rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between hover:shadow-lg transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`p-3 rounded-xl border ${step.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-2xl font-black text-slate-300">
                      {step.num}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-navy-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                {idx < 3 && (
                  <div className="hidden lg:block absolute -right-4 top-1/2 -translate-y-1/2 z-10 text-slate-300">
                    <ArrowRight className="w-6 h-6" />
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
