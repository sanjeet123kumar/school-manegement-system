import { useEffect, useState } from 'react';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: 'primary' | 'accent' | 'warning' | 'info' | 'success';
  suffix?: string;
  delay?: number;
}

const colorClasses = {
  primary: 'from-primary/20 to-primary/5 border-primary/20',
  accent: 'from-accent/20 to-accent/5 border-accent/20',
  warning: 'from-warning/20 to-warning/5 border-warning/20',
  info: 'from-info/20 to-info/5 border-info/20',
  success: 'from-success/20 to-success/5 border-success/20',
};

const iconColorClasses = {
  primary: 'bg-primary text-primary-foreground',
  accent: 'bg-accent text-accent-foreground',
  warning: 'bg-warning text-warning-foreground',
  info: 'bg-info text-info-foreground',
  success: 'bg-success text-success-foreground',
};

export function StatCard({
  title,
  value,
  icon: Icon,
  color,
  suffix = '',
  delay = 0,
}: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 1500;
    const steps = 60;
    const stepValue = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += stepValue;
      if (current >= value) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, isVisible]);

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-2xl border bg-gradient-to-br p-6 transition-all duration-500 card-hover',
        colorClasses[color],
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight">
              {displayValue.toLocaleString()}
            </span>
            {suffix && <span className="text-lg text-muted-foreground">{suffix}</span>}
          </div>
        </div>
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl shadow-lg',
            iconColorClasses[color]
          )}
        >
          <Icon className="h-6 w-6" />
        </div>
      </div>

      {/* Decorative element */}
      <div className="absolute -right-4 -bottom-4 h-24 w-24 rounded-full bg-gradient-to-br from-white/10 to-transparent" />
    </div>
  );
}
