
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedInputProps {
  label: string;
  icon?: React.ReactNode;
  type?: 'text' | 'email' | 'tel' | 'textarea';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  className?: string;
  rows?: number;
  validation?: (value: string) => boolean;
  errorMessage?: string;
}

const EnhancedInput: React.FC<EnhancedInputProps> = ({
  label,
  icon,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  maxLength,
  className,
  rows = 3,
  validation,
  errorMessage
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  const isValid = !validation || validation(value);
  const showValidation = hasInteracted && value.length > 0;
  const showError = showValidation && !isValid && required;
  const showSuccess = showValidation && isValid && required && value.length > 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const newValue = maxLength ? e.target.value.slice(0, maxLength) : e.target.value;
    onChange(newValue);
    if (!hasInteracted) setHasInteracted(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("space-y-2", className)}
    >
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
          {icon && <span className="text-blue-600">{icon}</span>}
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        {maxLength && (
          <span className="text-xs text-gray-400 font-medium">
            {value.length}/{maxLength}
          </span>
        )}
      </div>

      <div className="relative">
        {type === 'textarea' ? (
          <Textarea
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            rows={rows}
            className={cn(
              "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "transition-all duration-200 resize-none",
              showError && "border-red-300 focus:ring-red-500",
              showSuccess && "border-green-300 focus:ring-green-500"
            )}
          />
        ) : (
          <Input
            type={type}
            value={value}
            onChange={handleChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={cn(
              "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm h-10",
              "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "transition-all duration-200",
              showError && "border-red-300 focus:ring-red-500",
              showSuccess && "border-green-300 focus:ring-green-500"
            )}
          />
        )}

        {/* Validation icon */}
        <AnimatePresence>
          {showValidation && (showSuccess || showError) && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className={cn(
                "absolute right-3 flex items-center justify-center",
                type === 'textarea' ? "top-3" : "top-1/2 -translate-y-1/2"
              )}
            >
              {showSuccess && (
                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="h-2.5 w-2.5 text-white" />
                </div>
              )}
              {showError && (
                <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-2.5 w-2.5 text-white" />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error message */}
      <AnimatePresence>
        {showError && errorMessage && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="text-xs text-red-600 flex items-center gap-1"
          >
            <AlertCircle className="h-3 w-3" />
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default EnhancedInput;
