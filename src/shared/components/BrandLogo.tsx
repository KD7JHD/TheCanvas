import React from 'react';
import { cn } from '../utils/index';
import { Palette } from 'lucide-react';

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  className,
  showText = true,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center justify-center">
        <Palette className={cn('text-primary', sizeClasses[size])} />
      </div>
      
      {showText && (
        <span className={cn('font-bold text-foreground', textSizes[size])}>
          TheCanvas
        </span>
      )}
    </div>
  );
};
