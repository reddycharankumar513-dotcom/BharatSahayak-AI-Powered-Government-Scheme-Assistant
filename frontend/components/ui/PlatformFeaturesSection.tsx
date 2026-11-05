'use client';

import React from 'react';
import { useLanguage } from '@/lib/language-context';
import { 
  Mic, 
  Binary, 
  BookOpenCheck, 
  FileSearch, 
  RefreshCw, 
  WifiOff, 
  Sparkles 
} from 'lucide-react';

export default function PlatformFeaturesSection() {
  const { t } = useLanguage();

  const features = [
    {
      title: t.features.f1Title,
      desc: t.features.f1Desc,
      icon: Mic,
      tag: 'Telugu & English Voice',
      border: 'hover:border-saffron-500',
    },
    {
      title: t.features.f2Title,
      desc: t.features.f2Desc,
      icon: Binary,
      tag: 'Deterministic Logic',
      border: 'hover:border-emerald-500',
    },
    {
      title: t.features.f3Title,
      desc: t.features.f3Desc,
      icon: BookOpenCheck,
      tag: 'Gazette Verified',
      border: 'hover:border-blue-500',
    },
    {
      title: t.features.f4Title,
      desc: t.features.f4Desc,
      icon: FileSearch,
      tag: 'Local OCR Pipeline',
      border: 'hover:border-purple-500',
    },
    {
      title: t.features.f5Title,
      desc: t.features.f5Desc,
      icon: RefreshCw,
      tag: 'Freshness Indicator',
      border: 'hover:border-amber-500',
    },
    {
      title: t.features.f6Title,
      desc: t.features.f6Desc,
      icon: WifiOff,
      tag: '2G/3G Optimized',
      border: 'hover:border-teal-500',
    },
  ];

  return (
    <section className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/80 border border-blue-200 text-blue-900 text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>{t.features.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
            {t.features.heading}
          </h2>
          <p className="mt-3 text-base text-slate-600">
            {t.features.subheading}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.title}
                className={`glass-card p-6 sm:p-8 rounded-2xl border border-slate-200/90 transition-all ${feat.border} hover:shadow-lg flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-slate-100 text-navy-900">
                      <Icon className="w-6 h-6 text-saffron-600" />
                    </div>
                    <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full">
                      {feat.tag}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-navy-900 mb-2">
                    {feat.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
