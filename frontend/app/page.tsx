'use client';

import React from 'react';
import HeroSection from '@/components/ui/HeroSection';
import PopularSchemesSection from '@/components/ui/PopularSchemesSection';
import HowItWorksSection from '@/components/ui/HowItWorksSection';
import PlatformFeaturesSection from '@/components/ui/PlatformFeaturesSection';
import SocialImpactSection from '@/components/ui/SocialImpactSection';
import TestimonialsSection from '@/components/ui/TestimonialsSection';
import FaqSection from '@/components/ui/FaqSection';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 3D Animated Hero Section */}
      <HeroSection />

      {/* Popular Verified Government Schemes */}
      <PopularSchemesSection />

      {/* How JanSathi AI Works (4-Step Process) */}
      <HowItWorksSection />

      {/* Advanced Platform Features */}
      <PlatformFeaturesSection />

      {/* Civic & Social Impact */}
      <SocialImpactSection />

      {/* Citizen Experiences (Demo Content) */}
      <TestimonialsSection />

      {/* Frequently Asked Questions */}
      <FaqSection />
    </div>
  );
}
