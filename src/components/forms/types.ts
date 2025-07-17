
import { z } from 'zod';

export interface ValidationSchema {
  schema?: z.ZodSchema<any>;
}

export interface I18nConfig {
  enabled?: boolean;
  keys?: {
    [key: string]: string;
  };
}

export interface FieldGroup {
  id: string;
  title: string;
  description?: string;
  fields: string[]; // field names belonging to this group
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export interface AsyncOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SmartCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than' | 'truthy' | 'falsy';
  value?: any;
}

export interface EnhancedFieldConfig {
  // Existing field config properties
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
  
  // Enhanced features
  loadOptions?: () => Promise<AsyncOption[]>;
  visibleIf?: SmartCondition[];
  disabledIf?: SmartCondition[];
  i18nKey?: string;
  aiAssist?: {
    enabled: boolean;
    type: 'title' | 'description' | 'content';
    prompt?: string;
  };
  visibleToRoles?: string[];
}

export interface DraftConfig {
  enabled?: boolean;
  storageKey?: string;
  autoSave?: boolean;
  autoSaveInterval?: number;
}

export interface LayoutConfig {
  type?: 'single' | 'grid' | 'flex';
  columns?: number;
  responsive?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
}

export interface ValidationMode {
  mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'all';
}

export interface PreviewConfig {
  enabled?: boolean;
  defaultMode?: 'edit' | 'preview';
}

export type PluginType = 'rich-editor' | 'file-upload' | 'date-range' | 'multi-select' | 'color-picker';

export interface PluginRegistry {
  [key: string]: React.ComponentType<any>;
}

export interface EnhancedFormConfig {
  id: string;
  title?: string;
  description?: string;
  fields: EnhancedFieldConfig[];
  fieldGroups?: FieldGroup[];
  submit: {
    endpoint?: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    onSubmit?: (values: Record<string, any>) => Promise<void> | void;
    onSuccess?: (response?: any) => void;
    onError?: (error: any) => void;
    buttonText?: string;
    loadingText?: string;
    validateOnSubmit?: boolean;
    debounceMs?: number;
  };
  layout?: 'card' | 'plain';
  layoutConfig?: LayoutConfig;
  className?: string;
  resetOnSuccess?: boolean;
  
  // Enhanced features
  validationSchema?: ValidationSchema;
  i18n?: I18nConfig;
  draft?: DraftConfig;
  validation?: ValidationMode;
  preview?: PreviewConfig;
  pluginRegistry?: PluginRegistry;
  roleBasedAccess?: {
    userRoles?: string[];
    checkAccess?: (roles: string[]) => boolean;
  };
}
