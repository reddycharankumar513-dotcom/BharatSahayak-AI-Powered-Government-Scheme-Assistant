'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import Hero3DCanvas from '@/components/three/Hero3DCanvas';
import { 
  ArrowRight, 
  Sparkles, 
  Bot, 
  ShieldCheck, 
  CheckCircle2, 
  Layers,
  Users
} from 'lucide-react';

export default function HeroSection() {
  const { language, t } = useLanguage();

  return (
    <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden bg-gradient-to-b from-orange-50/40 via-white to-slate-50">
      {/* Background radial accent glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-tr from-saffron-500/10 via-amber-400/10 to-emerald-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline and Call-to-Actions */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-saffron-800 text-xs sm:text-sm font-semibold shadow-sm">
              <span className="w-2 h-2 rounded-full bg-saffron-600 animate-pulse" />
              <span>{t.hero.badge}</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-navy-900 tracking-tight leading-[1.12]">
              <span>{t.hero.titlePart1}</span>{' '}
              <span className="text-gradient-saffron block sm:inline">
                {t.hero.titlePart2}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href="/schemes"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-gradient-to-r from-saffron-600 to-orange-600 text-white font-bold text-base shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all"
              >
                <span>{t.hero.startExploring}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/assistant"
                className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-white border-2 border-navy-900/10 text-navy-900 font-bold text-base hover:bg-slate-50 hover:border-navy-900/30 hover:-translate-y-0.5 transition-all shadow-sm"
              >
                <Bot className="w-5 h-5 text-saffron-600" />
                <span>{t.hero.askAi}</span>
              </Link>
            </div>

            {/* Trust and Key Capabilities Strip */}
            <div className="pt-6 border-t border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center lg:text-left">
              <div>
                <div className="flex items-center justify-center lg:justify-start gap-1 text-navy-900 font-extrabold text-xl sm:text-2xl">
                  <Layers className="w-5 h-5 text-saffron-600" />
                  <span>{t.hero.statsSchemes}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{t.hero.statsSchemesLabel}</p>
              </div>

              <div>
                <div className="flex items-center justify-center lg:justify-start gap-1 text-navy-900 font-extrabold text-xl sm:text-2xl">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>{t.hero.statsAccuracy}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{t.hero.statsAccuracyLabel}</p>
              </div>

              <div>
                <div className="flex items-center justify-center lg:justify-start gap-1 text-navy-900 font-extrabold text-xl sm:text-2xl">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span>{t.hero.statsCitizens}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{t.hero.statsCitizensLabel}</p>
              </div>

              <div>
                <div className="flex items-center justify-center lg:justify-start gap-1 text-navy-900 font-extrabold text-xl sm:text-2xl">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <span>{t.hero.statsLanguages}</span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{t.hero.statsLanguagesLabel}</p>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Interactive India Globe & Floating Holograms */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <Hero3DCanvas />
          </div>
        </div>
      </div>
    </section>
  );
}
