import type { Metadata, Viewport } from 'next';
import './globals.css';
import { LanguageProvider } from '@/lib/language-context';
import { AuthProvider } from '@/lib/auth-context';
import AccessibilityBar from '@/components/ui/AccessibilityBar';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';

export const metadata: Metadata = {
  title: 'JanSathi AI - Government Services Made Simple for Every Indian',
  description: 'AI-powered multilingual government services assistant designed for Indian citizens. Discover welfare schemes, verify deterministic eligibility, prepare documents with OCR, and access step-by-step guidance in Telugu and English.',
  keywords: [
    'JanSathi AI',
    'Indian Government Schemes',
    'PM-KISAN',
    'Ayushman Bharat',
    'Telugu AI Assistant',
    'Government Welfare India',
    'Eligibility Checker',
    'Digital Public Infrastructure Bharat'
  ],
  authors: [{ name: 'JanSathi AI Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#FDFCFA] text-slate-900 antialiased selection:bg-orange-200 selection:text-orange-900">
        <AccessibilityBar />
        <LanguageProvider>
          <AuthProvider>
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
