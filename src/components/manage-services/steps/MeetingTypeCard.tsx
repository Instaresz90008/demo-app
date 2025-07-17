
import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface MeetingTypeOption {
  id: string;
  label: string;
  icon: React.ElementType;
  description: string;
  color: string;
  gradient: string;
  bgGradient: string;
  features: string[];
}

interface MeetingTypeCardProps {
  option: MeetingTypeOption;
  isEnabled: boolean;
  onToggle: (id: string) => void;
}

const MeetingTypeCard: React.FC<MeetingTypeCardProps> = ({ option, isEnabled, onToggle }) => {
  const Icon = option.icon;
  return (
    <div
      className={cn(
        "group relative transition-all hover:scale-105 duration-300 cursor-pointer animate-fade-in"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-2xl border-2 transition-all duration-300 backdrop-blur-sm",
          isEnabled
            ? `border-${option.color}-400 bg-gradient-to-br ${option.bgGradient} shadow-xl shadow-${option.color}-100/60 scale-[1.03]`
            : "border-gray-200 bg-white/80 hover:bg-white hover:border-gray-300 hover:shadow-lg"
        )}
        onClick={() => onToggle(option.id)}
        tabIndex={0}
        aria-pressed={isEnabled}
        role="button"
      >
        {/* Header */}
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className={cn(
              "w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300",
              isEnabled
                ? `bg-gradient-to-br ${option.gradient} shadow-lg`
                : "bg-gray-100 group-hover:bg-gray-200"
            )}>
              {isEnabled ? (
                <CheckCircle2 className="w-6 h-6 text-white animate-scale-in" />
              ) : (
                <Icon className={cn(
                  "w-6 h-6 transition-colors duration-300",
                  `text-${option.color}-600`
                )} />
              )}
            </div>
            <div className={cn(
              "w-6 h-6 rounded-full border-2 transition-all duration-300 flex items-center justify-center",
              isEnabled
                ? `border-${option.color}-400 bg-${option.color}-400`
                : "border-gray-300 group-hover:border-gray-400"
            )}>
              {isEnabled && <CheckCircle2 className="w-4 h-4 text-white" />}
            </div>
          </div>
          <h3 className={cn(
            "font-bold text-lg mb-1 transition-colors duration-300",
            isEnabled ? "text-gray-900" : "text-gray-700"
          )}>
            {option.label}
          </h3>
          <p className="text-sm text-gray-600 mb-3">{option.description}</p>
          <div className="space-y-1">
            {option.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-gray-500">
                <div className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  isEnabled ? `bg-${option.color}-400` : "bg-gray-300"
                )} />
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingTypeCard;
