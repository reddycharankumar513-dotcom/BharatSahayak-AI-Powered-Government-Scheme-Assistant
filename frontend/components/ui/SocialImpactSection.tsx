'use client';

import React from 'react';
import { useLanguage } from '@/lib/language-context';
import { Award, Globe2, ShieldCheck, HeartHandshake } from 'lucide-react';

export default function SocialImpactSection() {
  const { t } = useLanguage();

  const metrics = [
    {
      num: t.impact.stat1Number,
      label: t.impact.stat1Label,
      icon: Award,
      color: 'text-saffron-500',
    },
    {
      num: t.impact.stat2Number,
      label: t.impact.stat2Label,
      icon: Globe2,
      color: 'text-blue-500',
    },
    {
      num: t.impact.stat3Number,
      label: t.impact.stat3Label,
      icon: ShieldCheck,
      color: 'text-emerald-500',
    },
    {
      num: t.impact.stat4Number,
      label: t.impact.stat4Label,
      icon: HeartHandshake,
      color: 'text-purple-500',
    },
  ];

  return (
    <section className="py-20 bg-navy-900 text-white relative overflow-hidden">
      {/* Background digital grid / glow */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-saffron-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-saffron-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>{t.impact.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {t.impact.heading}
          </h2>
          <p className="mt-3 text-base text-slate-300">
            {t.impact.subheading}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.num}
                className="glass-dark p-6 sm:p-8 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center hover:border-slate-700 transition-all"
              >
                <div className="p-3 rounded-xl bg-slate-800/80 mb-4">
                  <Icon className={`w-7 h-7 ${m.color}`} />
                </div>
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {m.num}
                </span>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 font-medium leading-relaxed">
                  {m.label}
                </p>
              </div>
            );
          })}
        </div>

        {/* Mission Statement Box */}
        <div className="mt-16 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-navy-950 to-slate-900 border border-slate-800 text-center max-w-4xl mx-auto shadow-2xl">
          <p className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed">
            "Millions of eligible citizens miss out on life-changing welfare schemes due to language barriers, complex bureaucratic forms, and misinformation. <span className="text-saffron-400 font-bold">JanSathi AI</span> is built to ensure that public welfare reaches the last mile without intermediaries."
          </p>
        </div>
      </div>
    </section>
  );
}
