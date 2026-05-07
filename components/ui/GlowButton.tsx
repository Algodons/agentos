'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';

type GlowColor = 'blue' | 'purple' | 'orange' | 'green';

interface GlowButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  color?: GlowColor;
}

const colorStyles: Record<GlowColor, string> = {
  blue: 'bg-[#00F0FF] text-black hover:bg-[#00F0FF]/90 glow-blue',
  purple: 'bg-[#8A2EFF] text-white hover:bg-[#8A2EFF]/90 glow-purple',
  orange: 'bg-[#FF7A00] text-black hover:bg-[#FF7A00]/90 glow-orange',
  green: 'bg-[#00FF9C] text-black hover:bg-[#00FF9C]/90 glow-green',
};

export function GlowButton({ children, color = 'blue', className = '', ...props }: GlowButtonProps) {
  return (
    <button
      {...props}
      className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-200 ${colorStyles[color]} ${className}`}
    >
      {children}
    </button>
  );
}
