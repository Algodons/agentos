'use client';

import { ReactNode } from 'react';

type NeonColor = 'blue' | 'purple' | 'orange' | 'green';

interface NeonTextProps {
  children: ReactNode;
  color?: NeonColor;
  className?: string;
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p';
}

const colorMap: Record<NeonColor, string> = {
  blue: 'text-[#00F0FF]',
  purple: 'text-[#8A2EFF]',
  orange: 'text-[#FF7A00]',
  green: 'text-[#00FF9C]',
};

export function NeonText({ children, color = 'blue', className = '', as: Tag = 'span' }: NeonTextProps) {
  return (
    <Tag className={`${colorMap[color]} font-semibold ${className}`}>
      {children}
    </Tag>
  );
}
