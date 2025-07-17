
import React, { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2 } from 'lucide-react';
import { EnhancedFieldConfig } from '../types';

interface AIAssistManagerProps {
  field: EnhancedFieldConfig;
  form: UseFormReturn<any>;
}

export const AIAssistManager: React.FC<AIAssistManagerProps> = ({ field, form }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState<string>('');

  const generateSuggestion = async () => {
    setIsGenerating(true);
    try {
      // Mock AI suggestion - in a real implementation, this would call an AI service
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockSuggestions = {
        title: 'AI-Generated: Professional Meeting Title',
        description: 'AI-Generated: This is a comprehensive description that provides detailed information about the topic.',
        content: 'AI-Generated: High-quality content generated specifically for your needs.'
      };
      
      const suggestion = mockSuggestions[field.aiAssist?.type || 'content'];
      setSuggestion(suggestion);
    } catch (error) {
      console.error('AI suggestion failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const applySuggestion = () => {
    form.setValue(field.name, suggestion);
    setSuggestion('');
  };

  if (!field.aiAssist?.enabled) return null;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={generateSuggestion}
          disabled={isGenerating}
          className="gap-2"
        >
          {isGenerating ? (
            <Loader2 className="h-3 w-3 animate-spin" />
          ) : (
            <Sparkles className="h-3 w-3" />
          )}
          {isGenerating ? 'Generating...' : 'AI Assist'}
        </Button>
        <Badge variant="secondary" className="text-xs">
          {field.aiAssist.type}
        </Badge>
      </div>
      
      {suggestion && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md space-y-2">
          <p className="text-sm text-blue-800">{suggestion}</p>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              onClick={applySuggestion}
            >
              Apply
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSuggestion('')}
            >
              Dismiss
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
