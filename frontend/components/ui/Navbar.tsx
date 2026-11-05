'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/language-context';
import { useAuth } from '@/lib/auth-context';
import { 
  Bot, 
  Search, 
  CheckCircle, 
  FileText, 
  Globe, 
  Menu, 
  X, 
  ArrowRight,
  Sparkles,
  GitCompare,
  User as UserIcon,
  LogOut,
  LayoutDashboard
} from 'lucide-react';

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/schemes', label: t.nav.schemes, icon: Search },
    { href: '/eligibility', label: t.nav.eligibility, icon: CheckCircle },
    { href: '/assistant', label: t.nav.assistant, icon: Bot, isHighlighted: true },
    { href: '/documents', label: t.nav.documents, icon: FileText },
    { href: '/comparison', label: t.nav.comparison, icon: GitCompare },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass-panel shadow-sm border-b border-slate-200/80 py-3' 
          : 'bg-white/80 backdrop-blur-md py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-saffron-500 via-tiranga-saffron to-emerald-600 text-white shadow-md shadow-saffron-500/20 group-hover:scale-105 transition-transform">
              {/* Chakra icon / emblem */}
              <div className="w-5 h-5 rounded-full border-2 border-white/90 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
              </div>
              <Sparkles className="w-3.5 h-3.5 absolute -top-1 -right-1 text-amber-300" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-navy-900 group-hover:text-saffron-600 transition-colors">
                JanSathi <span className="text-saffron-600 font-bold">AI</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide -mt-1 hidden sm:block">
                Digital Citizen Assistant
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    link.isHighlighted
                      ? 'text-saffron-700 bg-orange-50/80 hover:bg-orange-100/90 font-semibold border border-orange-200/60'
                      : 'text-slate-700 hover:text-navy-900 hover:bg-slate-100/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${link.isHighlighted ? 'text-saffron-600' : 'text-slate-500'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions: Language Selector & Auth */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Language Selector */}
            <div className="relative flex items-center bg-slate-100/90 p-0.5 rounded-lg border border-slate-200 text-xs font-medium">
              <button
                onClick={() => setLanguage('en')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all ${
                  language === 'en'
                    ? 'bg-white text-navy-900 shadow-sm font-bold'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
                title="Switch to English"
              >
                <span>English</span>
              </button>
              <button
                onClick={() => setLanguage('te')}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md transition-all ${
                  language === 'te'
                    ? 'bg-saffron-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 hover:text-navy-900'
                }`}
                title="తెలుగు భాషకు మారండి"
              >
                <span>తెలుగు</span>
              </button>
            </div>

            {/* Auth Buttons */}
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 text-saffron-800 text-xs font-bold hover:bg-orange-100 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-saffron-600 text-white flex items-center justify-center text-[11px] font-extrabold">
                    {user.full_name ? user.full_name.charAt(0) : 'U'}
                  </div>
                  <span className="max-w-[100px] truncate">{user.full_name || user.email}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="text-sm font-medium text-slate-700 hover:text-navy-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  {t.nav.signIn}
                </Link>
                <Link
                  href="/auth/register"
                  className="flex items-center gap-1.5 text-sm font-semibold text-white bg-gradient-to-r from-navy-900 to-navy-800 hover:from-saffron-600 hover:to-saffron-700 px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all"
                >
                  <span>{t.nav.getStarted}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Mobile quick language toggle */}
            <button
              onClick={() => setLanguage(language === 'en' ? 'te' : 'en')}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-xs font-bold text-navy-900"
            >
              <Globe className="w-3.5 h-3.5 text-saffron-600" />
              <span>{language === 'en' ? 'తెలుగు' : 'ENG'}</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-panel border-b border-slate-200 px-4 pt-3 pb-6 animate-in slide-in-from-top duration-200">
          <div className="space-y-1 mb-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                    link.isHighlighted
                      ? 'text-saffron-700 bg-orange-50 font-semibold'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${link.isHighlighted ? 'text-saffron-600' : 'text-slate-500'}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500 font-medium">Select Language / భాష:</span>
              <div className="flex gap-1">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1 rounded text-xs font-semibold ${
                    language === 'en' ? 'bg-navy-900 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('te')}
                  className={`px-3 py-1 rounded text-xs font-semibold ${
                    language === 'te' ? 'bg-saffron-600 text-white' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  తెలుగు
                </button>
              </div>
            </div>

            <div className="pt-2">
              {user ? (
                <div className="space-y-2">
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-sm font-semibold rounded-lg bg-navy-900 text-white"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>{t.nav.dashboard} ({user.full_name || user.email})</span>
                  </Link>
                  <button
                    onClick={() => { logout(); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 text-sm font-semibold rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 px-3 text-sm font-semibold rounded-lg border border-slate-300 text-slate-800 hover:bg-slate-50"
                  >
                    {t.nav.signIn}
                  </Link>
                  <Link
                    href="/auth/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2 px-3 text-sm font-semibold rounded-lg bg-saffron-600 text-white hover:bg-saffron-700"
                  >
                    {t.nav.getStarted}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
