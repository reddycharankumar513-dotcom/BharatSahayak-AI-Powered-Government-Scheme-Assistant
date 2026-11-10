'use client';

import React, { useState, useEffect } from 'react';
import { Eye, Type, Wifi, Zap } from 'lucide-react';

export default function AccessibilityBar() {
  const [highContrast, setHighContrast] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState(1); // 0 = small, 1 = normal, 2 = large
  const [lowBandwidth, setLowBandwidth] = useState(false);

  useEffect(() => {
    // Check saved preferences
    const savedContrast = localStorage.getItem('jansathi_contrast') === 'true';
    const savedSize = parseInt(localStorage.getItem('jansathi_font_size') || '1');
    const savedBandwidth = localStorage.getItem('jansathi_bandwidth') === 'true';

    setHighContrast(savedContrast);
    setFontSizeLevel(savedSize);
    setLowBandwidth(savedBandwidth);

    applyStyles(savedContrast, savedSize, savedBandwidth);
  }, []);

  const applyStyles = (contrast: boolean, size: number, bandwidth: boolean) => {
    const root = document.documentElement;
    // Contrast
    if (contrast) {
      root.classList.add('contrast-125', 'brightness-95');
    } else {
      root.classList.remove('contrast-125', 'brightness-95');
    }

    // Font size
    if (size === 0) {
      root.style.fontSize = '14px';
    } else if (size === 2) {
      root.style.fontSize = '18px';
    } else {
      root.style.fontSize = '16px';
    }
  };

  const toggleContrast = () => {
    const next = !highContrast;
    setHighContrast(next);
    localStorage.setItem('jansathi_contrast', String(next));
    applyStyles(next, fontSizeLevel, lowBandwidth);
  };

  const changeFontSize = (delta: number) => {
    const next = Math.max(0, Math.min(2, fontSizeLevel + delta));
    setFontSizeLevel(next);
    localStorage.setItem('jansathi_font_size', String(next));
    applyStyles(highContrast, next, lowBandwidth);
  };

  const toggleLowBandwidth = () => {
    const next = !lowBandwidth;
    setLowBandwidth(next);
    localStorage.setItem('jansathi_bandwidth', String(next));
    applyStyles(highContrast, fontSizeLevel, next);
  };

  return (
    <div className="bg-slate-900 text-slate-300 text-[11px] py-1 px-4 border-b border-slate-800 flex items-center justify-between z-50 select-none">
      <div className="flex items-center gap-2">
        <span className="font-bold text-slate-400">🇮🇳 Digital Public Goods</span>
        <span className="text-slate-600 hidden sm:inline">•</span>
        <span className="hidden sm:inline text-slate-400">Universal Bharat Accessibility</span>
      </div>

      <div className="flex items-center gap-3">
        {/* Font size control */}
        <div className="flex items-center gap-1 border-r border-slate-700 pr-3">
          <Type className="w-3 h-3 text-slate-400" />
          <button
            onClick={() => changeFontSize(-1)}
            disabled={fontSizeLevel === 0}
            className="px-1 font-bold hover:text-white disabled:opacity-30"
            title="Decrease text size"
          >
            A-
          </button>
          <button
            onClick={() => changeFontSize(1)}
            disabled={fontSizeLevel === 2}
            className="px-1 font-bold hover:text-white disabled:opacity-30"
            title="Increase text size"
          >
            A+
          </button>
        </div>

        {/* High contrast control */}
        <button
          onClick={toggleContrast}
          className={`flex items-center gap-1 hover:text-white transition-colors ${highContrast ? 'text-saffron-400 font-bold' : ''}`}
          title="Toggle High Contrast Mode"
        >
          <Eye className="w-3 h-3" />
          <span className="hidden sm:inline">Contrast</span>
        </button>

        {/* Low bandwidth toggle */}
        <button
          onClick={toggleLowBandwidth}
          className={`flex items-center gap-1 hover:text-white transition-colors ${lowBandwidth ? 'text-emerald-400 font-bold' : ''}`}
          title="Toggle Low Bandwidth (2G/3G) Mode"
        >
          <Wifi className="w-3 h-3" />
          <span className="hidden sm:inline">Lite 2G Mode</span>
        </button>
      </div>
    </div>
  );
}
