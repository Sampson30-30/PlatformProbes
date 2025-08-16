import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

interface PricingTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
}

interface Component {
  id: string;
  name: string;
  description: string;
  additionalCost: number;
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'template',
    name: 'Template',
    price: 200,
    description: 'Pre-built components with basic customization',
    features: [
      'Choose from library',
      'Color & font changes',
      'Basic configuration',
      '48hr delivery'
    ]
  },
  {
    id: 'curated',
    name: 'Curated',
    price: 300,
    description: 'Customized components for your brand',
    features: [
      'Everything in Template',
      'Brand integration',
      'Content adaptation',
      'Custom interactions'
    ],
    popular: true
  },
  {
    id: 'custom',
    name: 'Custom',
    price: 500,
    description: 'Fully bespoke components built to spec',
    features: [
      'Everything in Curated',
      'Unique functionality',
      'Advanced integrations',
      'Ongoing support'
    ]
  }
];

const COMPONENTS: Component[] = [
  {
    id: 'quiz',
    name: 'Quiz System',
    description: 'Interactive assessments',
    additionalCost: 50
  },
  {
    id: 'reflection',
    name: 'Reflection Journal',
    description: 'Thoughtful responses',
    additionalCost: 50
  },
  {
    id: 'timeline',
    name: 'Timeline',
    description: 'Historical progression',
    additionalCost: 50
  },
  {
    id: 'comparison',
    name: 'Comparison Tool',
    description: 'Spectrum analysis',
    additionalCost: 50
  },
  {
    id: 'grid',
    name: 'Grid Explorer',
    description: 'Content organization',
    additionalCost: 50
  },
  {
    id: 'tabs',
    name: 'Tab System',
    description: 'Lesson navigation',
    additionalCost: 50
  }
];

interface PricingCalculatorProps {
  onOrderSubmit?: (orderData: {
    tier: string;
    components: string[];
    totalCost: number;
  }) => void;
}

export default function PricingCalculator({ onOrderSubmit }: PricingCalculatorProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedComponents, setSelectedComponents] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  const selectedTierData = PRICING_TIERS.find(tier => tier.id === selectedTier);
  const baseCost = selectedTierData?.price || 0;
  const additionalComponentsCost = Math.max(0, selectedComponents.size - 1) * 50; // First component included
  const totalCost = baseCost + additionalComponentsCost;

  const handleTierSelect = (tierId: string) => {
    setSelectedTier(tierId);
  };

  const handleComponentToggle = (componentId: string) => {
    const newSelection = new Set(selectedComponents);
    if (newSelection.has(componentId)) {
      newSelection.delete(componentId);
    } else {
      newSelection.add(componentId);
    }
    setSelectedComponents(newSelection);
  };

  const handleOrderSubmit = () => {
    if (!selectedTier || selectedComponents.size === 0) {
      toast({
        title: "Please complete your selection",
        description: "Select a service tier and at least one component to continue.",
        variant: "destructive"
      });
      return;
    }

    const orderData = {
      tier: selectedTier,
      components: Array.from(selectedComponents),
      totalCost
    };

    onOrderSubmit?.(orderData);

    toast({
      title: "Order Submitted!",
      description: `Your ${selectedTierData?.name} project with ${selectedComponents.size} components has been submitted. Total: £${totalCost}`,
      variant: "default"
    });
  };

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden" data-testid="pricing-calculator">
      <div className="gradient-primary text-white p-6">
        <h3 className="text-xl font-sf font-bold mb-2">Project Cost Calculator</h3>
        <p className="text-white/90">Select your components and customization level to get instant pricing</p>
      </div>

      <div className="p-6">
        {/* Service Tier Selection */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4">Choose Your Service Level</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PRICING_TIERS.map((tier) => (
              <Card
                key={tier.id}
                className={`cursor-pointer transition-all ${
                  selectedTier === tier.id
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'hover:border-primary/50'
                }`}
                onClick={() => handleTierSelect(tier.id)}
                data-testid={`tier-${tier.id}`}
              >
                <CardContent className="p-4">
                  <div className="text-center">
                    {tier.popular && (
                      <Badge className="mb-2 bg-primary text-white" data-testid="badge-popular">
                        Popular
                      </Badge>
                    )}
                    <div className="text-2xl font-bold text-primary mb-2">£{tier.price}</div>
                    <div className="font-semibold mb-2">{tier.name}</div>
                    <div className="text-sm text-gray-600 mb-4">{tier.description}</div>
                    <ul className="text-xs text-left space-y-1">
                      {tier.features.map((feature, index) => (
                        <li key={index}>✓ {feature}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Component Selection */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4">
            Select Components (£50 each additional)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {COMPONENTS.map((component) => (
              <Card
                key={component.id}
                className={`cursor-pointer transition-all ${
                  selectedComponents.has(component.id)
                    ? 'border-primary bg-primary/5'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleComponentToggle(component.id)}
                data-testid={`component-${component.id}`}
              >
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedComponents.has(component.id)}
                      onChange={() => {}} // Controlled by card click
                      data-testid={`checkbox-${component.id}`}
                    />
                    <div>
                      <div className="font-medium text-sm">{component.name}</div>
                      <div className="text-xs text-gray-500">{component.description}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Cost Breakdown */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg">Project Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Service Tier:</span>
                <span data-testid="text-tier-display">
                  {selectedTierData?.name || 'Select a tier above'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Base Cost:</span>
                <span data-testid="text-base-cost">£{baseCost}</span>
              </div>
              <div className="flex justify-between">
                <span>Additional Components:</span>
                <span data-testid="text-component-cost">£{additionalComponentsCost}</span>
              </div>
              <div className="flex justify-between">
                <span>Selected Components:</span>
                <span data-testid="text-selected-components">
                  {selectedComponents.size > 0 
                    ? Array.from(selectedComponents).map(id => 
                        COMPONENTS.find(c => c.id === id)?.name
                      ).join(', ')
                    : 'None'
                  }
                </span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Cost:</span>
                <span data-testid="text-total-cost">£{totalCost}</span>
              </div>
            </div>
            <Button
              onClick={handleOrderSubmit}
              disabled={!selectedTier || selectedComponents.size === 0}
              className="w-full gradient-primary hover:opacity-90 transition-opacity"
              data-testid="button-order"
            >
              {selectedTier && selectedComponents.size > 0
                ? `Place Order - £${totalCost}`
                : 'Place Order - Start Project'
              }
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
