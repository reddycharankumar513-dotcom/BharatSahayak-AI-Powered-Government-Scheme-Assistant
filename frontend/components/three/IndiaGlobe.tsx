'use client';

import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Float, Html } from '@react-three/drei';
import * as THREE from 'three';

// Coordinate converter for India (approx. 20.5937° N, 78.9629° E)
function latLongToVector3(lat: number, lon: number, radius: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return [x, y, z];
}

// Particle cloud around the globe
function ParticleStars({ count = 250 }: { count?: number }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 2.8 + Math.random() * 1.5;
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = r * Math.cos(phi);
    }
    return p;
  }, [count]);

  const pointsRef = useRef<THREE.Points>(null!);
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.05;
      pointsRef.current.rotation.x += delta * 0.02;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.035}
        color="#FF9933"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// India Glowing Beacon Pin
function IndiaBeacon() {
  const beaconRef = useRef<THREE.Group>(null!);
  const [x, y, z] = latLongToVector3(21.5, 78.9, 2.02);

  useFrame(({ clock }) => {
    if (beaconRef.current) {
      const scale = 1 + Math.sin(clock.getElapsedTime() * 4) * 0.25;
      beaconRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={[x, y, z]}>
      {/* Central pin point */}
      <mesh>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#FF7A00" emissive="#FF9933" emissiveIntensity={2.5} />
      </mesh>

      {/* Pulsing beacon wave */}
      <group ref={beaconRef}>
        <mesh>
          <ringGeometry args={[0.09, 0.16, 32]} />
          <meshBasicMaterial color="#FF9933" transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Floating 3D Label */}
      <Html distanceFactor={8} position={[0.2, 0.2, 0]}>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/90 text-white border border-saffron-400/60 shadow-lg shadow-saffron-500/20 whitespace-nowrap select-none backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-[11px] font-semibold tracking-wide text-amber-200">🇮🇳 Bharat / India</span>
        </div>
      </Html>
    </group>
  );
}

export default function IndiaGlobe() {
  const globeGroupRef = useRef<THREE.Group>(null!);

  useFrame((_, delta) => {
    if (globeGroupRef.current) {
      // Smooth slow continuous rotation
      globeGroupRef.current.rotation.y += delta * 0.18;
    }
  });

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 4, 3]} intensity={1.8} color="#ffffff" />
      <pointLight position={[-4, -3, -2]} intensity={0.8} color="#0044ff" />
      <pointLight position={[3, 2, 4]} intensity={1.2} color="#FF9933" />

      <ParticleStars count={300} />

      {/* Rotating Globe Group */}
      <group ref={globeGroupRef} rotation={[0.25, 0.6, 0]}>
        {/* Core Earth Sphere */}
        <Sphere args={[2.0, 48, 48]}>
          <meshStandardMaterial
            color="#081426"
            roughness={0.4}
            metalness={0.25}
            emissive="#040b15"
          />
        </Sphere>

        {/* Digital Wireframe Lattice */}
        <Sphere args={[2.015, 36, 36]}>
          <meshBasicMaterial
            color="#2563eb"
            wireframe
            transparent
            opacity={0.16}
          />
        </Sphere>

        {/* Outer Atmospheric Aura */}
        <Sphere args={[2.08, 32, 32]}>
          <meshStandardMaterial
            color="#0066cc"
            transparent
            opacity={0.08}
            side={THREE.BackSide}
          />
        </Sphere>

        {/* India Marker Beacon */}
        <IndiaBeacon />

        {/* Orbital digital rings */}
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <ringGeometry args={[2.35, 2.37, 64]} />
          <meshBasicMaterial color="#FF9933" transparent opacity={0.25} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[-Math.PI / 4, 0.5, 0]}>
          <ringGeometry args={[2.5, 2.52, 64]} />
          <meshBasicMaterial color="#10B981" transparent opacity={0.2} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* Floating 3D Holographic Badges around the globe */}
      <Float speed={2.5} rotationIntensity={0.3} floatIntensity={1.2}>
        <Html position={[-2.7, 1.4, 0.4]} distanceFactor={7}>
          <div className="glass-panel px-3.5 py-2 rounded-xl shadow-glass flex items-center gap-2.5 border-l-4 border-l-saffron-500 animate-float-slow select-none">
            <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
              🌾
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium">Central Support</p>
              <p className="text-xs font-bold text-slate-900">PM-KISAN ₹6,000</p>
            </div>
          </div>
        </Html>
      </Float>

      <Float speed={3.0} rotationIntensity={0.2} floatIntensity={1.5}>
        <Html position={[2.6, 1.2, 0.6]} distanceFactor={7}>
          <div className="glass-panel px-3.5 py-2 rounded-xl shadow-glass flex items-center gap-2.5 border-l-4 border-l-emerald-500 select-none">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
              🏥
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium">Universal Health</p>
              <p className="text-xs font-bold text-slate-900">PM-JAY ₹5 Lakh</p>
            </div>
          </div>
        </Html>
      </Float>

      <Float speed={2.2} rotationIntensity={0.4} floatIntensity={1.0}>
        <Html position={[-2.2, -1.5, 0.5]} distanceFactor={7}>
          <div className="glass-panel px-3.5 py-2 rounded-xl shadow-glass flex items-center gap-2.5 border-l-4 border-l-blue-600 select-none">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
              🤖
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium">Multilingual AI</p>
              <p className="text-xs font-bold text-slate-900">Telugu & English Voice</p>
            </div>
          </div>
        </Html>
      </Float>

      <Float speed={2.8} rotationIntensity={0.3} floatIntensity={1.3}>
        <Html position={[2.3, -1.3, 0.4]} distanceFactor={7}>
          <div className="glass-panel px-3.5 py-2 rounded-xl shadow-glass flex items-center gap-2.5 border-l-4 border-l-purple-500 select-none">
            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-sm">
              ⚡
            </div>
            <div>
              <p className="text-[10px] text-slate-500 font-medium">Grounded RAG</p>
              <p className="text-xs font-bold text-slate-900">100% Official Gazettes</p>
            </div>
          </div>
        </Html>
      </Float>
    </>
  );
}
