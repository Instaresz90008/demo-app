
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  subtitle: string;
  iconBackground?: string;
  className?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}

const StatCard = ({ 
  title, 
  value, 
  icon, 
  subtitle,
  iconBackground,
  className,
  trend,
  trendValue
}: StatCardProps) => {
  return (
    <div 
      className={cn(
        "relative overflow-hidden p-4 group transition-all duration-300",
        "rounded-3xl hover:shadow-md hover:scale-[1.02]",
        "animate-reveal border",
        className
      )}
      style={{
        backgroundColor: 'var(--color-card-bg)',
        borderColor: 'var(--color-card-border-muted)',
        boxShadow: 'var(--color-card-shadow)'
      }}
    >
      {/* Background mesh pattern */}
      <div className="absolute inset-0 bg-mesh opacity-20"></div>
      
      {/* Content */}
      <div className="relative z-10 flex justify-between items-start">
        <div className="space-y-1 flex-1">
          <p 
            className="text-sm font-medium transition-colors"
            style={{ color: 'var(--color-card-text-muted)' }}
          >
            {title}
          </p>
          <h3 
            className="text-3xl font-bold group-hover:animate-pulse"
            style={{ color: 'var(--color-card-heading)' }}
          >
            {value}
          </h3>
          <div className="flex items-center gap-2">
            <p 
              className="text-xs transition-colors"
              style={{ color: 'var(--color-card-text-muted)' }}
            >
              {subtitle}
            </p>
            {trend && trendValue && (
              <span 
                className={cn(
                  "text-xs font-medium px-2 py-1 rounded-full",
                  trend === 'up' ? 'bg-[var(--color-kpi-up-bg)] text-[var(--color-kpi-up)]' :
                  trend === 'down' ? 'bg-[var(--color-kpi-down-bg)] text-[var(--color-kpi-down)]' :
                  'bg-gray-100 text-[var(--color-kpi-neutral)]'
                )}
              >
                {trend === 'up' ? '↗' : trend === 'down' ? '↘' : '→'} {trendValue}
              </span>
            )}
          </div>
        </div>
        
        {/* Enhanced icon container */}
        <div 
          className={cn(
            "p-3 rounded-xl shadow-lg transition-all duration-300",
            "border hover:border-opacity-20",
            "group-hover:scale-110 group-hover:rotate-3"
          )}
          style={{
            backgroundColor: iconBackground || 'var(--theme-primary)',
            borderColor: 'var(--color-card-border-muted)',
            color: 'var(--theme-primary-foreground)'
          }}
        >
          <div className="group-hover:glow transition-all duration-300">
            {icon}
          </div>
        </div>
      </div>
      
      {/* Interactive glow effect */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: 'linear-gradient(90deg, transparent, var(--theme-primary), transparent)',
          opacity: 0.05
        }}
      ></div>
      
      {/* Bottom accent line */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
        style={{
          background: `linear-gradient(90deg, transparent, var(--theme-primary), transparent)`
        }}
      ></div>
    </div>
  );
};

export default StatCard;
