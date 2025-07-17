
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PricingModel } from '@/types/smartService';
import { PRICING_MODELS } from '@/data/smartServiceData';

interface PricingModelSelectorProps {
  supportedModels: string[];
  selectedModel: PricingModel | null;
  onModelSelect: (model: PricingModel) => void;
  onBack: () => void;
}

const PricingModelSelector: React.FC<PricingModelSelectorProps> = ({
  supportedModels,
  selectedModel,
  onModelSelect,
  onBack
}) => {
  const availableModels = supportedModels.map(modelId => PRICING_MODELS[modelId]).filter(Boolean);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Back
        </Button>
        <div>
          <h2 className="text-2xl font-bold">Choose Pricing Model</h2>
          <p className="text-muted-foreground">
            Select how you want to price this service
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {availableModels.map((model) => (
          <Card 
            key={model.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 ${
              selectedModel?.id === model.id ? 'border-primary bg-primary/5' : 'hover:border-primary/30'
            }`}
            onClick={() => onModelSelect(model)}
          >
            <CardHeader className="text-center pb-4">
              <div className="text-3xl mb-2">{model.icon}</div>
              <CardTitle className="text-lg">{model.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-center text-sm">
                {model.description}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PricingModelSelector;
