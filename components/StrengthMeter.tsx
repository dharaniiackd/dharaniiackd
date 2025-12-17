import React from 'react';
import { StrengthResult } from '../utils/security';
import { Check, AlertTriangle, XCircle } from 'lucide-react';

interface StrengthMeterProps {
  result: StrengthResult;
}

const StrengthMeter: React.FC<StrengthMeterProps> = ({ result }) => {
  const { color, label, score, feedback } = result;

  // Map color names to Tailwind classes
  const colorMap = {
    red: 'bg-red-500 text-red-400',
    orange: 'bg-orange-500 text-orange-400',
    green: 'bg-green-500 text-green-400',
    gray: 'bg-slate-700 text-slate-500',
  };

  const textColorMap = {
    red: 'text-red-500',
    orange: 'text-orange-500',
    green: 'text-green-500',
    gray: 'text-slate-500',
  };

  const getIcon = () => {
    if (color === 'green') return <Check className="w-5 h-5" />;
    if (color === 'orange') return <AlertTriangle className="w-5 h-5" />;
    if (color === 'red') return <XCircle className="w-5 h-5" />;
    return null;
  };

  // Determine width of the progress bar based on score (1=33%, 2=66%, 3=100%)
  const widthPercentage = Math.min((score / 3) * 100, 100);

  return (
    <div className="w-full space-y-3 animate-fade-in">
      {/* Label and Icon */}
      <div className={`flex items-center gap-2 font-bold uppercase tracking-wide ${textColorMap[color]}`}>
        {getIcon()}
        <span>{label}</span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 w-full bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${colorMap[color].split(' ')[0]}`}
          style={{ width: `${widthPercentage}%` }}
        ></div>
      </div>

      {/* Feedback Items */}
      <div className="space-y-1">
        {feedback.map((item, idx) => (
          <p key={idx} className="text-xs text-slate-400 flex items-center gap-1">
             • {item}
          </p>
        ))}
      </div>
    </div>
  );
};

export default StrengthMeter;