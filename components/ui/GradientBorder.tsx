'use client';

import { ReactNode } from 'react';

type BorderColor = 'blue' | 'purple' | 'orange' | 'green';

interface GradientBorderProps {
  children: ReactNode;
  color?: BorderColor;
  className?: string;
}

const gradientMap: Record<BorderColor, string> = {
  blue: 'from-[#00F0FF] to-[#8A2EFF]',
  purple: 'from-[#8A2EFF] to-[#00F0FF]',
  orange: 'from-[#FF7A00] to-[#8A2EFF]',
  green: 'from-[#00FF9C] to-[#00F0FF]',
};

export function GradientBorder({ children, color = 'blue', className = '' }: GradientBorderProps) {
  return (
    <div className={`bg-gradient-to-r ${gradientMap[color]} p-px rounded-2xl ${className}`}>
      <div className="bg-[#05070D] rounded-2xl h-full">{children}</div>
    </div>
  );
}
