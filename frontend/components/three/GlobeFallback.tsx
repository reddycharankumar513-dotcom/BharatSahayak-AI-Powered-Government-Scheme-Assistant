'use client';

import React from 'react';
import { ShieldCheck, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

export default function GlobeFallback() {
  return (
    <div className="relative w-full h-[420px] lg:h-[480px] flex items-center justify-center select-none">
      {/* Outer Glow Halo */}
      <div className="absolute w-72 h-72 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-saffron-500/20 via-blue-600/10 to-emerald-500/20 blur-2xl animate-pulse" />

      {/* Main Stylized Globe Sphere */}
      <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-gradient-to-br from-navy-900 via-slate-900 to-navy-950 border border-blue-500/30 shadow-2xl flex items-center justify-center overflow-hidden">
        {/* Lat/Long Grid Rings */}
        <div className="absolute inset-2 rounded-full border border-blue-400/20" />
        <div className="absolute inset-8 rounded-full border border-blue-400/20" />
        <div className="absolute inset-x-0 top-1/2 h-px bg-blue-400/25 -translate-y-1/2" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-blue-400/25 -translate-x-1/2" />

        {/* Diagonal orbital rings */}
        <div className="absolute w-[125%] h-24 border border-saffron-500/40 rounded-[100%] rotate-45 pointer-events-none" />
        <div className="absolute w-[125%] h-24 border border-emerald-500/30 rounded-[100%] -rotate-45 pointer-events-none" />

        {/* Center Glowing India Indicator */}
        <div className="flex flex-col items-center z-10 text-center px-4">
          <div className="relative mb-2">
            <span className="w-4 h-4 rounded-full bg-saffron-500 block animate-ping" />
            <span className="w-4 h-4 rounded-full bg-saffron-600 block absolute inset-0" />
          </div>
          <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-saffron-400 via-white to-emerald-400">
            BHARAT
          </span>
          <span className="text-[11px] text-blue-200/80 font-medium tracking-wider uppercase mt-0.5">
            140+ Cr Citizens
          </span>
        </div>
      </div>

      {/* Static Floating Pill Badges */}
      <div className="absolute -top-2 left-4 sm:left-12 glass-panel px-3.5 py-2 rounded-xl shadow-glass flex items-center gap-2 border-l-4 border-l-saffron-500">
        <Sparkles className="w-4 h-4 text-saffron-600" />
        <div>
          <p className="text-[10px] text-slate-500 font-medium">Income Support</p>
          <p className="text-xs font-bold text-slate-900">PM-KISAN ₹6,000</p>
        </div>
      </div>

      <div className="absolute top-12 right-2 sm:right-8 glass-panel px-3.5 py-2 rounded-xl shadow-glass flex items-center gap-2 border-l-4 border-l-emerald-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600" />
        <div>
          <p className="text-[10px] text-slate-500 font-medium">Health Cover</p>
          <p className="text-xs font-bold text-slate-900">PM-JAY ₹5 Lakh</p>
        </div>
      </div>

      <div className="absolute bottom-6 left-2 sm:left-8 glass-panel px-3.5 py-2 rounded-xl shadow-glass flex items-center gap-2 border-l-4 border-l-blue-600">
        <FileText className="w-4 h-4 text-blue-600" />
        <div>
          <p className="text-[10px] text-slate-500 font-medium">Smart OCR</p>
          <p className="text-xs font-bold text-slate-900">Telugu & English</p>
        </div>
      </div>

      <div className="absolute -bottom-2 right-4 sm:right-12 glass-panel px-3.5 py-2 rounded-xl shadow-glass flex items-center gap-2 border-l-4 border-l-purple-600">
        <CheckCircle2 className="w-4 h-4 text-purple-600" />
        <div>
          <p className="text-[10px] text-slate-500 font-medium">Grounded RAG</p>
          <p className="text-xs font-bold text-slate-900">Official Gazettes</p>
        </div>
      </div>
    </div>
  );
}
