
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  index?: number;
  formatter?: (value: number | string) => string;
}

const MetricCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  className,
  index = 0,
  formatter = (val) => String(val)
}: MetricCardProps) => {
  const [displayValue, setDisplayValue] = useState<string>("0");
  
  // Animate the counter
  useEffect(() => {
    // If the value is a string, just set it directly
    if (typeof value === 'string') {
      setDisplayValue(value);
      return;
    }

    // For numbers, animate the count
    const duration = 1200; // ms
    const steps = 20;
    const stepTime = duration / steps;
    
    let current = 0;
    const increment = value / steps;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        current = value;
        clearInterval(timer);
      }
      setDisplayValue(formatter(Math.round(current)));
    }, stepTime);
    
    return () => clearInterval(timer);
  }, [value, formatter]);
  
  return (
    <div 
      className={cn(
        "card overflow-hidden hover-lift transition-all duration-300 bg-[#1A1F2C] border-white/5",
        className
      )}
      style={{ '--delay': index } as React.CSSProperties}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-neutral-400 text-sm font-medium">{title}</p>
          <p className="text-2xl sm:text-3xl font-semibold text-white metric-appear">
            {displayValue}
          </p>
          
          {trend && (
            <div className="flex items-center mt-1">
              <span
                className={cn(
                  "text-xs font-medium rounded-full px-2 py-0.5 flex items-center",
                  trend.isPositive 
                    ? "text-green-200 bg-green-900/40" 
                    : "text-red-200 bg-red-900/40"
                )}
              >
                {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
              </span>
            </div>
          )}
        </div>
        
        <div className="p-3 rounded-lg bg-[#222631] text-white">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default MetricCard;
