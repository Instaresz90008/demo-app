
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EnhancedSelectProps {
  label: string;
  icon?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options: { value: string; label: string }[];
  required?: boolean;
  className?: string;
}

const EnhancedSelect: React.FC<EnhancedSelectProps> = ({
  label,
  icon,
  value,
  onChange,
  placeholder,
  options,
  required = false,
  className
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn("space-y-2", className)}
    >
      <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {icon && <span className="text-blue-600">{icon}</span>}
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>

      <motion.div
        animate={{
          scale: isOpen ? 1.02 : 1,
          boxShadow: isOpen 
            ? '0 10px 25px rgba(59, 130, 246, 0.15), 0 0 0 1px rgba(59, 130, 246, 0.3)'
            : '0 2px 4px rgba(0, 0, 0, 0.05)'
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <Select 
          value={value} 
          onValueChange={onChange}
          onOpenChange={setIsOpen}
        >
          <SelectTrigger className="border-0 bg-white/90 backdrop-blur-sm rounded-xl h-12 transition-all duration-200 focus:bg-white focus:ring-0 focus:border-0">
            <SelectValue placeholder={placeholder} />
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="h-4 w-4 opacity-50" />
            </motion.div>
          </SelectTrigger>
          <SelectContent className="border-0 bg-white/95 backdrop-blur-xl rounded-xl shadow-xl">
            <AnimatePresence>
              {options.map((option, index) => (
                <motion.div
                  key={option.value}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <SelectItem 
                    value={option.value}
                    className="rounded-lg hover:bg-blue-50 focus:bg-blue-50 transition-colors duration-150"
                  >
                    {option.label}
                  </SelectItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </SelectContent>
        </Select>
      </motion.div>
    </motion.div>
  );
};

export default EnhancedSelect;
