'use client';

import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  glow?: 'blue' | 'purple' | 'orange' | 'green';
}

const glowMap: Record<string, string> = {
  blue: 'glow-blue',
  purple: 'glow-purple',
  orange: 'glow-orange',
  green: 'glow-green',
};

export function GlassCard({ children, className = '', glow }: GlassCardProps) {
  const glowClass = glow ? glowMap[glow] : '';
  return (
    <div className={`glass rounded-2xl p-5 ${glowClass} ${className}`}>
      {children}
    </div>
  );
}
