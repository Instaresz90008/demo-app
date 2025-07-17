
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectItem, SelectTrigger, SelectContent, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { EnhancedFieldConfig } from './types';

interface EnhancedFieldRendererProps {
  field: EnhancedFieldConfig;
  form: UseFormReturn<any>;
}

export const EnhancedFieldRenderer: React.FC<EnhancedFieldRendererProps> = ({ field, form }) => {
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

  // Get label with i18n support
  const getLabel = () => {
    // In a real implementation, you would use your i18n library here
    // For now, we'll just return the label or use the i18nKey as fallback
    return field.label;
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
              required: field.required ? `${getLabel()} is required` : false,
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
              required: field.required ? `${getLabel()} is required` : false,
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
        const isLoading = field.loadOptions && !field.options;
        
        return (
          <Select 
            value={value || ''} 
            onValueChange={(val) => setValue(field.name, val)} 
            disabled={field.disabled || isLoading}
          >
            <SelectTrigger className={field.className}>
              <SelectValue placeholder={
                isLoading ? 'Loading options...' : field.placeholder
              } />
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            </SelectTrigger>
            <SelectContent>
              {field.options?.map((option) => {
                const optionValue = typeof option === 'string' ? option : option.value;
                const optionLabel = typeof option === 'string' ? option : option.label;
                const isDisabled = typeof option === 'object' && 'disabled' in option ? option.disabled : false;
                
                return (
                  <SelectItem 
                    key={optionValue} 
                    value={optionValue}
                    disabled={isDisabled}
                  >
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
              {getLabel()}
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
        {field.visibleToRoles && field.visibleToRoles.length > 0 && (
          <div className="flex gap-1">
            {field.visibleToRoles.map(role => (
              <Badge key={role} variant="outline" className="text-xs">
                {role}
              </Badge>
            ))}
          </div>
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
        {getLabel()}
        {field.required && <span className="text-destructive ml-1">*</span>}
        {field.loadOptions && !field.options && (
          <Loader2 className="h-3 w-3 animate-spin inline ml-2" />
        )}
      </Label>
      {renderField()}
      {field.description && (
        <p className="text-sm text-muted-foreground">{field.description}</p>
      )}
      {field.visibleToRoles && field.visibleToRoles.length > 0 && (
        <div className="flex gap-1">
          {field.visibleToRoles.map(role => (
            <Badge key={role} variant="outline" className="text-xs">
              {role}
            </Badge>
          ))}
        </div>
      )}
      {getErrorMessage() && (
        <p className="text-sm text-destructive">{getErrorMessage()}</p>
      )}
    </div>
  );
};
