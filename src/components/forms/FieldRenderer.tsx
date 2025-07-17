
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export interface FieldConfig {
  type: 'text' | 'number' | 'email' | 'password' | 'date' | 'textarea' | 'select' | 'checkbox' | 'radio' | 'rich-editor' | 'file-upload' | 'date-range' | 'multi-select' | 'color-picker';
  name: string;
  label: string;
  placeholder?: string;
  defaultValue?: any;
  required?: boolean;
  disabled?: boolean;
  options?: string[] | { value: string; label: string }[];
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    min?: number;
    max?: number;
    custom?: (value: any) => string | null;
  };
  className?: string;
  description?: string;
  pluginProps?: Record<string, any>;
}

interface FieldRendererProps {
  field: FieldConfig;
  form: UseFormReturn<any>;
}

export const FieldRenderer: React.FC<FieldRendererProps> = ({ field, form }) => {
  const { register, setValue, watch, formState: { errors } } = form;
  const value = watch(field.name);
  const error = errors[field.name];

  // Helper function to get error message safely
  const getErrorMessage = () => {
    if (!error) return null;
    if (typeof error === 'string') return error;
    if (typeof error === 'object' && 'message' in error) {
      return typeof error.message === 'string' ? error.message : null;
    }
    return null;
  };

  const renderField = () => {
    switch (field.type) {
      case 'text':
      case 'number':
      case 'email':
      case 'password':
      case 'date':
        return (
          <Input
            {...register(field.name, {
              required: field.required ? `${field.label} is required` : false,
              minLength: field.validation?.minLength ? {
                value: field.validation.minLength,
                message: `Minimum length is ${field.validation.minLength}`
              } : undefined,
              maxLength: field.validation?.maxLength ? {
                value: field.validation.maxLength,
                message: `Maximum length is ${field.validation.maxLength}`
              } : undefined,
              pattern: field.validation?.pattern ? {
                value: field.validation.pattern,
                message: 'Invalid format'
              } : undefined
            })}
            type={field.type}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={field.className}
          />
        );

      case 'textarea':
        return (
          <Textarea
            {...register(field.name, {
              required: field.required ? `${field.label} is required` : false,
              minLength: field.validation?.minLength ? {
                value: field.validation.minLength,
                message: `Minimum length is ${field.validation.minLength}`
              } : undefined,
              maxLength: field.validation?.maxLength ? {
                value: field.validation.maxLength,
                message: `Maximum length is ${field.validation.maxLength}`
              } : undefined
            })}
            placeholder={field.placeholder}
            disabled={field.disabled}
            className={field.className}
          />
        );

      case 'select':
        return (
          <Select 
            value={value || ''} 
            onValueChange={(val) => setValue(field.name, val)} 
            disabled={field.disabled}
          >
            <SelectTrigger className={field.className}>
              <SelectValue placeholder={field.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => {
                const optionValue = typeof option === 'string' ? option : option.value;
                const optionLabel = typeof option === 'string' ? option : option.label;
                return (
                  <SelectItem key={optionValue} value={optionValue}>
                    {optionLabel}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        );

      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value || false}
              onCheckedChange={(checked) => setValue(field.name, checked)}
              disabled={field.disabled}
              className={field.className}
            />
            <Label htmlFor={field.name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {field.label}
            </Label>
          </div>
        );

      default:
        return null;
    }
  };

  if (field.type === 'checkbox') {
    return (
      <div className="space-y-2">
        {renderField()}
        {field.description && (
          <p className="text-sm text-muted-foreground">{field.description}</p>
        )}
        {getErrorMessage() && (
          <p className="text-sm text-destructive">{getErrorMessage()}</p>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Label htmlFor={field.name} className="text-sm font-medium">
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderField()}
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      {getErrorMessage() && (
        <p className="text-sm text-destructive">{getErrorMessage()}</p>
      )}
    </div>
  );
};
