'use client';

import React, { useState, useEffect, Suspense } from 'react';
import dynamic from 'next/dynamic';
import GlobeFallback from './GlobeFallback';

// Dynamically import Canvas and OrbitControls with SSR disabled
const DynamicCanvas = dynamic(
  () => import('@react-three/fiber').then((mod) => mod.Canvas),
  { ssr: false }
);

const DynamicIndiaGlobe = dynamic(
  () => import('./IndiaGlobe'),
  { ssr: false }
);

const DynamicOrbitControls = dynamic(
  () => import('@react-three/drei').then((mod) => mod.OrbitControls),
  { ssr: false }
);

export default function Hero3DCanvas() {
  const [mounted, setMounted] = useState(false);
  const [hasWebGL, setHasWebGL] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check for reduced motion preference
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setPrefersReducedMotion(true);
      return;
    }

    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setHasWebGL(false);
      }
    } catch {
      setHasWebGL(false);
    }
  }, []);

  if (!mounted || prefersReducedMotion || !hasWebGL) {
    return <GlobeFallback />;
  }

  return (
    <div className="relative w-full h-[420px] lg:h-[500px]">
      <Suspense fallback={<GlobeFallback />}>
        <DynamicCanvas
          camera={{ position: [0, 0, 5.8], fov: 45 }}
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <DynamicIndiaGlobe />
          <DynamicOrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
            maxPolarAngle={Math.PI / 1.7}
            minPolarAngle={Math.PI / 2.3}
          />
        </DynamicCanvas>
      </Suspense>
    </div>
  );
}
