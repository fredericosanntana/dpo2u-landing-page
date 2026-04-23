import React from 'react';
import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/500.css';
import '@fontsource/geist-sans/600.css';
import '@fontsource/geist-sans/700.css';

import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import ChessSection from '@/components/landing/ChessSection';
import ReverseChessSection from '@/components/landing/ReverseChessSection';
import NumbersSection from '@/components/landing/NumbersSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import CTAFooterWrapper from '@/components/landing/CTAFooterWrapper';

export default function HomePage() {
  return (
    <div className="apex-bg min-h-screen font-geist">
      <HeroSection />
      <FeaturesSection />
      <ChessSection />
      <ReverseChessSection />
      <NumbersSection />
      <TestimonialsSection />
      <CTAFooterWrapper />
    </div>
  );
}
