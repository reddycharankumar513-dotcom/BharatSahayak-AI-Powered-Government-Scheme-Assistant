'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { Shield, Sparkles, ExternalLink, Heart, Globe } from 'lucide-react';

export default function Footer() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <footer className="bg-navy-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand & Description */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-saffron-500 via-tiranga-saffron to-emerald-600 flex items-center justify-center text-white shadow-md">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                JanSathi <span className="text-saffron-500">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              {t.footer.aboutDesc}
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verified Public Data</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs text-saffron-400">
                <span>🇮🇳 English & తెలుగు</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/schemes" className="text-slate-400 hover:text-white transition-colors">
                  {t.nav.schemes}
                </Link>
              </li>
              <li>
                <Link href="/eligibility" className="text-slate-400 hover:text-white transition-colors">
                  {t.nav.eligibility}
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="text-slate-400 hover:text-white transition-colors">
                  {t.nav.assistant}
                </Link>
              </li>
              <li>
                <Link href="/documents" className="text-slate-400 hover:text-white transition-colors">
                  {t.nav.documents}
                </Link>
              </li>
              <li>
                <Link href="/comparison" className="text-slate-400 hover:text-white transition-colors">
                  {t.nav.comparison}
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-slate-500 hover:text-slate-300 transition-colors text-xs">
                  {t.nav.admin} Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Scheme Sectors */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              {t.footer.categories}
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/schemes?cat=agriculture" className="text-slate-400 hover:text-white transition-colors">
                  {t.schemes.agriculture}
                </Link>
              </li>
              <li>
                <Link href="/schemes?cat=healthcare" className="text-slate-400 hover:text-white transition-colors">
                  {t.schemes.healthcare}
                </Link>
              </li>
              <li>
                <Link href="/schemes?cat=housing" className="text-slate-400 hover:text-white transition-colors">
                  {t.schemes.housing}
                </Link>
              </li>
              <li>
                <Link href="/schemes?cat=finance" className="text-slate-400 hover:text-white transition-colors">
                  {t.schemes.finance}
                </Link>
              </li>
              <li>
                <Link href="/schemes?cat=women-child" className="text-slate-400 hover:text-white transition-colors">
                  {t.schemes.womenChild}
                </Link>
              </li>
              <li>
                <Link href="/schemes?cat=education" className="text-slate-400 hover:text-white transition-colors">
                  {t.schemes.education}
                </Link>
              </li>
            </ul>
          </div>

          {/* Official Verification Notice */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-white uppercase tracking-wider">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Official Portals</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scheme applications and approvals are strictly handled on official government domains:
            </p>
            <div className="space-y-1.5 text-xs text-slate-300">
              <a 
                href="https://data.gov.in" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-1 text-saffron-400 hover:underline"
              >
                <span>data.gov.in</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a 
                href="https://www.india.gov.in" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-1 text-saffron-400 hover:underline"
              >
                <span>india.gov.in</span>
                <ExternalLink className="w-3 h-3" />
              </a>
              <a 
                href="https://pmkisan.gov.in" 
                target="_blank" 
                rel="noreferrer" 
                className="flex items-center gap-1 text-saffron-400 hover:underline"
              >
                <span>pmkisan.gov.in</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Language Switcher in Footer */}
            <div className="pt-2">
              <button
                onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-xs text-slate-300 hover:text-white"
              >
                <Globe className="w-3 h-3 text-saffron-400" />
                <span>Language: {language === 'en' ? 'English (Switch to తెలుగు)' : 'తెలుగు (Switch to English)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Disclaimer Alert Box */}
        <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-400 leading-relaxed mb-8">
          <strong className="text-white block mb-1">
            {t.footer.disclaimerTitle}:
          </strong>
          {t.footer.disclaimerDesc}
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© 2026 {t.footer.rightsReserved}</p>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for Indian Digital Public Infrastructure</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
