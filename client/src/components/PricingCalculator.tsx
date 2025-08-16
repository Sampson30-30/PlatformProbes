
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface PricingTier {
  id: string;
  name: string;
  price: number;
  description: string;
  features: string[];
  popular?: boolean;
  examples: string[];
}

const PRICING_TIERS: PricingTier[] = [
  {
    id: 'template',
    name: 'Template Modules',
    price: 200,
    description: 'Complete learning topics using proven component combinations',
    features: [
      'Pre-designed learning experiences',
      'Color & font customization',
      'Basic configuration',
      '24-48hr delivery'
    ],
    examples: [
      'Introduction to Project Management',
      'Basic Communication Skills',
      'Time Management Fundamentals'
    ]
  },
  {
    id: 'curated',
    name: 'Curated Modules',
    price: 300,
    description: 'Custom-designed complete learning experiences',
    features: [
      'Everything in Template',
      'Brand integration',
      'Content adaptation',
      'Custom interactions'
    ],
    popular: true,
    examples: [
      'Risk Assessment Training',
      'Leadership Development Workshop',
      'Customer Service Excellence'
    ]
  },
  {
    id: 'custom',
    name: 'Custom Modules',
    price: 500,
    description: 'Entirely new complete learning topics built to your specifications',
    features: [
      'Everything in Curated',
      'Unique functionality',
      'Advanced integrations',
      'Ongoing support'
    ],
    examples: [
      'Company Values Workshop',
      'Technical Skills Assessment',
      'Compliance Training Suite'
    ]
  }
];

interface PricingCalculatorProps {
  onOrderSubmit?: (orderData: {
    tier: string;
    modules: number;
    totalCost: number;
  }) => void;
}

export default function PricingCalculator({ onOrderSubmit }: PricingCalculatorProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [moduleCount, setModuleCount] = useState<number>(1);
  const { toast } = useToast();

  const selectedTierData = PRICING_TIERS.find(tier => tier.id === selectedTier);
  const baseCostPerModule = selectedTierData?.price || 0;
  const totalCost = baseCostPerModule * moduleCount;

  const handleTierSelect = (tierId: string) => {
    setSelectedTier(tierId);
  };

  const handleModuleCountChange = (value: string) => {
    const count = parseInt(value) || 1;
    setModuleCount(Math.max(1, Math.min(10, count))); // Limit between 1-10 modules
  };

  const handleOrderSubmit = () => {
    if (!selectedTier) {
      toast({
        title: "Please complete your selection",
        description: "Select a service tier to continue.",
        variant: "destructive"
      });
      return;
    }

    const orderData = {
      tier: selectedTier,
      modules: moduleCount,
      totalCost
    };

    onOrderSubmit?.(orderData);

    toast({
      title: "Order Submitted!",
      description: `Your ${selectedTierData?.name} project with ${moduleCount} module${moduleCount > 1 ? 's' : ''} has been submitted. Total: £${totalCost}`,
      variant: "default"
    });
  };

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden" data-testid="pricing-calculator">
      <div className="gradient-primary text-white p-6">
        <h3 className="text-xl font-sf font-bold mb-2">Project Cost Calculator</h3>
        <p className="text-white/90">One Module = One Complete Learning Topic</p>
        <p className="text-sm text-white/80 mt-1">Multiple components work together within each module to create cohesive learning experiences</p>
      </div>

      <div className="p-6">
        {/* Service Tier Selection */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4">Choose Your Module Type</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <CardContent className="p-5">
                  <div className="text-center mb-4">
                    {tier.popular && (
                      <Badge className="mb-3 bg-primary text-white" data-testid="badge-popular">
                        Most Popular
                      </Badge>
                    )}
                    <div className="text-3xl font-bold text-primary mb-2">£{tier.price}</div>
                    <div className="text-sm text-gray-500 mb-2">per module</div>
                    <div className="font-semibold mb-3 text-lg">{tier.name}</div>
                    <div className="text-sm text-gray-600 mb-4">{tier.description}</div>
                  </div>
                  
                  <div className="text-left space-y-3">
                    <div>
                      <div className="font-medium text-sm mb-2">Features:</div>
                      <ul className="text-xs space-y-1">
                        {tier.features.map((feature, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <div className="font-medium text-sm mb-2">Example modules:</div>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {tier.examples.map((example, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            {example}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Module Count Selection */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4">
            How many modules do you need?
          </h4>
          <div className="flex items-center space-x-4">
            <label htmlFor="moduleCount" className="text-sm font-medium">
              Number of modules:
            </label>
            <Input
              id="moduleCount"
              type="number"
              min="1"
              max="10"
              value={moduleCount}
              onChange={(e) => handleModuleCountChange(e.target.value)}
              className="w-24"
              data-testid="input-module-count"
            />
            <span className="text-sm text-gray-600">
              (each module is a complete learning topic)
            </span>
          </div>
        </div>

        {/* Available Tools Info */}
        <div className="mb-8">
          <h4 className="text-lg font-semibold mb-4">Available Tools for Your Modules</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { name: 'Quiz Systems', desc: 'Interactive assessments' },
              { name: 'Reflection Journals', desc: 'Thoughtful responses' },
              { name: 'Interactive Timelines', desc: 'Historical progression' },
              { name: 'Comparison Tools', desc: 'Spectrum analysis' },
              { name: 'Grid Explorers', desc: 'Content organization' },
              { name: 'Tab Systems', desc: 'Lesson navigation' }
            ].map((component, index) => (
              <Card key={index} className="bg-gray-50">
                <CardContent className="p-3">
                  <div className="font-medium text-sm">{component.name}</div>
                  <div className="text-xs text-gray-500">{component.desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-3">
            Each module can include multiple components working together to create a complete learning experience.
          </p>
        </div>

        {/* Cost Breakdown */}
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-lg">Project Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span>Module Type:</span>
                <span data-testid="text-tier-display">
                  {selectedTierData?.name || 'Select a type above'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Cost per Module:</span>
                <span data-testid="text-cost-per-module">£{baseCostPerModule}</span>
              </div>
              <div className="flex justify-between">
                <span>Number of Modules:</span>
                <span data-testid="text-module-count">{moduleCount}</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total Project Cost:</span>
                <span data-testid="text-total-cost">£{totalCost}</span>
              </div>
            </div>
            <Button
              onClick={handleOrderSubmit}
              disabled={!selectedTier}
              className="w-full gradient-primary hover:opacity-90 transition-opacity"
              data-testid="button-order"
            >
              {selectedTier
                ? `Place Order - £${totalCost} for ${moduleCount} module${moduleCount > 1 ? 's' : ''}`
                : 'Place Order - Select Module Type'
              }
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
