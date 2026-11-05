'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/lib/language-context';
import { apiRequest } from '@/services/api';
import { 
  Search, 
  Filter, 
  ExternalLink, 
  ArrowRight, 
  ShieldCheck, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles,
  GitCompare,
  X,
  CheckCircle2
} from 'lucide-react';

interface Category {
  id: number;
  name: string;
  name_te?: string;
  slug: string;
}

interface SchemeItem {
  id: number;
  name: string;
  name_te?: string;
  slug: string;
  level: string;
  state?: string;
  summary: string;
  summary_te?: string;
  benefits: string;
  benefits_te?: string;
  official_website: string;
  last_verified_date: string;
  category?: Category;
  is_saved?: boolean;
}

export default function SchemesExplorerPage() {
  const router = useRouter();
  const { language, t } = useLanguage();

  const [schemes, setSchemes] = useState<SchemeItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [loading, setLoading] = useState(true);

  // Scheme Comparison Selection Tray
  const [compareList, setCompareList] = useState<SchemeItem[]>([]);

  // Fetch categories on load
  useEffect(() => {
    apiRequest<Category[]>('/schemes/categories')
      .then((data) => setCategories(data))
      .catch((err) => console.error('Categories error:', err));
  }, []);

  // Fetch schemes when filters change
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search.trim()) params.append('search', search.trim());
    if (selectedCategory !== 'all') params.append('category', selectedCategory);
    if (selectedLevel !== 'all') params.append('level', selectedLevel);
    if (sortBy) params.append('sort_by', sortBy);

    apiRequest<SchemeItem[]>(`/schemes?${params.toString()}`)
      .then((data) => setSchemes(data))
      .catch((err) => console.error('Schemes fetch error:', err))
      .finally(() => setLoading(false));
  }, [search, selectedCategory, selectedLevel, sortBy]);

  const toggleSave = async (schemeId: number) => {
    try {
      const res = await apiRequest<{ saved: boolean }>(`/schemes/${schemeId}/save`, { method: 'POST' });
      setSchemes((prev) =>
        prev.map((s) => (s.id === schemeId ? { ...s, is_saved: res.saved } : s))
      );
    } catch {
      router.push('/auth/login');
    }
  };

  const toggleCompare = (scheme: SchemeItem) => {
    if (compareList.some((s) => s.id === scheme.id)) {
      setCompareList(compareList.filter((s) => s.id !== scheme.id));
    } else {
      if (compareList.length >= 3) {
        alert('You can compare up to 3 schemes at once.');
        return;
      }
      setCompareList([...compareList, scheme]);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 text-saffron-800 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-saffron-600" />
            <span>{language === 'te' ? 'అధికారిక ప్రజా పథకాల డైరెక్టరీ' : 'Official Public Schemes Directory'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
            {language === 'te' ? 'ప్రభుత్వ సంక్షేమ పథకాల అన్వేషణ' : 'Smart Government Scheme Explorer'}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">
            {language === 'te'
              ? 'కేంద్ర మరియు రాష్ట్ర ప్రభుత్వాలచే ధృవీకరించబడిన సంక్షేమ పథకాలను అన్వేషించండి మరియు మీ అర్హతను సరిచూసుకోండి.'
              : 'Search hundreds of verified Central and State welfare initiatives with guaranteed grounded details.'}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={language === 'te' ? 'పథకం పేరు లేదా ప్రయోజనం ద్వారా వెతకండి (ఉదా. కిసాన్, రైతు, ఆరోగ్యం)...' : 'Search by scheme name or keywords (e.g. Kisan, Health, Mudra)...'}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:border-saffron-500 focus:ring-2 focus:ring-saffron-200 text-sm text-slate-900 bg-white"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Level Filter (Central / State) */}
            <div className="flex items-center gap-2">
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                className="py-3 px-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 bg-white focus:outline-none focus:border-saffron-500"
              >
                <option value="all">{language === 'te' ? 'అన్ని స్థాయిలు (All Levels)' : 'All Levels'}</option>
                <option value="Central">Central (కేంద్ర ప్రభుత్వం)</option>
                <option value="State">State (రాష్ట్ర ప్రభుత్వం)</option>
              </select>

              {/* Sorting Filter */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-3 px-3.5 rounded-xl border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 bg-white focus:outline-none focus:border-saffron-500"
              >
                <option value="popular">{language === 'te' ? 'ప్రముఖమైనవి (Popular)' : 'Most Popular'}</option>
                <option value="recent">{language === 'te' ? 'ఇటీవల ధృవీకరించినవి' : 'Recently Verified'}</option>
                <option value="name_asc">{language === 'te' ? 'పేరు (A నుండి Z)' : 'Name (A-Z)'}</option>
              </select>
            </div>
          </div>

          {/* Category Quick Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-navy-900 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {language === 'te' ? 'అన్ని కేటగిరీలు' : 'All Categories'}
            </button>

            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.slug
                    ? 'bg-saffron-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {language === 'te' && cat.name_te ? cat.name_te : cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter & Active Filters */}
        <div className="flex items-center justify-between mb-6 text-xs text-slate-500">
          <div>
            Showing <strong className="text-navy-900">{schemes.length}</strong> verified government schemes
          </div>
          {compareList.length > 0 && (
            <div className="text-saffron-700 font-bold">
              {compareList.length} scheme{compareList.length > 1 ? 's' : ''} selected for comparison
            </div>
          )}
        </div>

        {/* Schemes Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-9 h-9 border-4 border-saffron-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold text-slate-500">Retrieving official gazette records...</p>
          </div>
        ) : schemes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schemes.map((scheme) => {
              const isComparing = compareList.some((s) => s.id === scheme.id);

              return (
                <div
                  key={scheme.id}
                  className={`glass-card p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                    isComparing ? 'border-saffron-500 ring-2 ring-saffron-200 shadow-md' : 'border-slate-200 hover:shadow-lg'
                  }`}
                >
                  <div>
                    {/* Top Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-saffron-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200/60">
                        {scheme.category?.name || 'Central'}
                      </span>
                      <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200/60">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        <span>Verified</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="font-extrabold text-navy-900 text-lg leading-snug mb-2">
                      <Link href={`/schemes/${scheme.slug}`} className="hover:text-saffron-600 transition-colors">
                        {language === 'te' && scheme.name_te ? scheme.name_te : scheme.name}
                      </Link>
                    </h3>

                    {/* Summary */}
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-4">
                      {language === 'te' && scheme.summary_te ? scheme.summary_te : scheme.summary}
                    </p>

                    {/* Benefit Box */}
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 mb-4 text-xs">
                      <span className="text-[11px] font-bold text-saffron-700 uppercase tracking-wide block mb-0.5">
                        {language === 'te' ? 'ప్రధాన ప్రయోజనం:' : 'Core Benefit:'}
                      </span>
                      <p className="text-slate-800 font-medium line-clamp-2">
                        {language === 'te' && scheme.benefits_te ? scheme.benefits_te : scheme.benefits}
                      </p>
                    </div>
                  </div>

                  {/* Actions & Compare Tray */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/schemes/${scheme.slug}`}
                        className="flex-1 text-center py-2 px-3 rounded-xl bg-navy-900 hover:bg-saffron-600 text-white text-xs font-bold transition-colors shadow-sm"
                      >
                        {language === 'te' ? 'పూర్తి వివరాలు' : 'View Full Details'}
                      </Link>
                      <button
                        onClick={() => toggleSave(scheme.id)}
                        className={`p-2 rounded-xl border transition-colors ${
                          scheme.is_saved
                            ? 'bg-orange-50 border-saffron-300 text-saffron-600'
                            : 'border-slate-200 text-slate-500 hover:bg-slate-100'
                        }`}
                        title={scheme.is_saved ? 'Remove Bookmark' : 'Save Scheme'}
                      >
                        {scheme.is_saved ? (
                          <BookmarkCheck className="w-4 h-4" />
                        ) : (
                          <Bookmark className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <Link
                        href={`/eligibility?scheme=${scheme.slug}`}
                        className="font-bold text-saffron-700 hover:underline flex items-center gap-1"
                      >
                        <span>{language === 'te' ? 'అర్హత చూడండి' : 'Check Eligibility'}</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>

                      <button
                        onClick={() => toggleCompare(scheme)}
                        className={`flex items-center gap-1 text-[11px] font-semibold transition-colors ${
                          isComparing ? 'text-saffron-700 font-bold' : 'text-slate-500 hover:text-navy-900'
                        }`}
                      >
                        <GitCompare className="w-3 h-3" />
                        <span>{isComparing ? 'Selected' : 'Compare'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-panel p-12 rounded-3xl border border-slate-200 text-center max-w-lg mx-auto">
            <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-navy-900 mb-1">No matching schemes found</h3>
            <p className="text-xs text-slate-500 mb-4">
              Try adjusting your search keyword or clearing the category filters.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('all');
                setSelectedLevel('all');
              }}
              className="py-2 px-4 rounded-xl bg-navy-900 text-white text-xs font-bold"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Floating Comparison Tray */}
        {compareList.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-2xl glass-dark text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center justify-between gap-4 animate-in slide-in-from-bottom duration-300">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="p-2 rounded-xl bg-saffron-600 text-white shrink-0">
                <GitCompare className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white">
                  Comparing {compareList.length} Scheme{compareList.length > 1 ? 's' : ''}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {compareList.map((s) => s.name.split('(')[0].trim()).join(' vs ')}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setCompareList([])}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5"
              >
                Clear
              </button>
              <Link
                href={`/comparison?schemes=${compareList.map((s) => s.slug).join(',')}`}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-saffron-600 to-orange-600 hover:from-saffron-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
              >
                <span>Compare Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
