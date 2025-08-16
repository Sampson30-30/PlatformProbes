import React, { useState, useRef } from 'react';
import { Info, Compass, FileText } from 'lucide-react';

/**
 * ComparisonSpectrum Component
 * 
 * Generic version of your BibleTranslationComparison component.
 * Displays any set of items along a spectrum and allows detailed comparison.
 * 
 * Perfect for:
 * - Bible translations (your original)
 * - Product pricing tiers
 * - Programming frameworks  
 * - Learning difficulty levels
 * - Software versions
 * - Design approaches
 * - Service packages
 * 
 * Key features:
 * - Spectrum visualization (left to right progression)
 * - Hover tooltips with detailed information
 * - Sample comparison across different items
 * - Flexible category organization
 * - Smart positioning tooltips
 */

// Individual item in the spectrum
interface SpectrumItem {
  id: string;
  name: string;
  year?: string;                    // When created/released
  description: string;
  features: string;                 // Key characteristics
  recommended?: boolean;            // Highlight as recommended
  properties?: Record<string, any>; // Additional properties for comparison
}

// Category along the spectrum (like word-for-word, thought-for-thought, paraphrase)
interface SpectrumCategory {
  type: string;                     // Category name
  description: string;              // When to use this category
  color: string;                    // Primary color
  darkColor: string;                // Darker shade for headers
  items: SpectrumItem[];            // Items in this category
}

// Sample content for comparison (like different Bible verses)
interface ComparisonSample {
  id: string;
  name: string;                     // "John 3:16" → "Pricing Example" → "Hello World"
  content: Record<string, string>;  // Item ID → sample content
}

// Props for the main component
interface ComparisonSpectrumProps {
  title: string;                    // "Understanding Bible Translations" → "Choose Your Plan"
  description?: string;             // Overview of what's being compared
  spectrum: SpectrumCategory[];     // The categories and items
  samples?: ComparisonSample[];     // Optional sample comparisons

  // Customization
  showInstructions?: boolean;       // Show usage instructions
  instructionText?: string;         // Custom instruction text
  spectrumLabel?: string;           // Label for the spectrum section
  comparisonLabel?: string;         // Label for the comparison section

  // Behavior
  onItemClick?: (item: SpectrumItem) => void;
  defaultSample?: string;           // Which sample to show first
}

/**
 * Individual Item Card in Spectrum
 */
const SpectrumItemCard: React.FC<{
  item: SpectrumItem;
  category: SpectrumCategory;
  isHovered: boolean;
  onHover: (item: SpectrumItem | null) => void;
  onPositionTooltip: (event: React.MouseEvent) => void;
  onClick?: (item: SpectrumItem) => void;
}> = ({ item, category, isHovered, onHover, onPositionTooltip, onClick }) => {

  return (
    <div
      className={`
        relative px-3 py-2 rounded-md border cursor-pointer transition-all duration-200
        ${isHovered ? 'bg-white shadow-md transform scale-105' : 'bg-white bg-opacity-60'}
        ${item.recommended ? 'border-blue-500 border-2 ring-2 ring-blue-200' : 'border-gray-200'}
      `}
      onMouseEnter={(e) => {
        onHover(item);
        onPositionTooltip(e);
      }}
      onMouseMove={(e) => {
        if (isHovered) {
          onPositionTooltip(e);
        }
      }}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick?.(item)}
    >
      <div className="font-bold text-center text-sm">{item.id}</div>
      {item.recommended && (
        <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs px-1 rounded-full">
          ★
        </div>
      )}
    </div>
  );
};

/**
 * Tooltip Component
 */
const ItemTooltip: React.FC<{
  item: SpectrumItem;
  position: { top: number; left: number };
  tooltipRef: React.RefObject<HTMLDivElement>;
}> = ({ item, position, tooltipRef }) => (
  <div
    ref={tooltipRef}
    className="fixed z-50 w-64 bg-white border border-gray-200 rounded-md shadow-lg p-3"
    style={{
      top: `${position.top}px`,
      left: `${position.left}px`,
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)'
    }}
  >
    <div className="font-bold">{item.name}</div>
    {item.year && (
      <div className="text-xs text-gray-500 mb-2">{item.year}</div>
    )}
    <div className="text-sm mb-2">{item.description}</div>
    <div className="text-xs text-gray-600">{item.features}</div>
    {item.recommended && (
      <div className="mt-2 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
        ⭐ Recommended
      </div>
    )}
  </div>
);

/**
 * Spectrum View Component
 */
const SpectrumView: React.FC<{
  spectrum: SpectrumCategory[];
  hoveredItem: string | null;
  onItemHover: (item: SpectrumItem | null) => void;
  onItemClick?: (item: SpectrumItem) => void;
  tooltipPosition: { top: number; left: number };
  onPositionTooltip: (event: React.MouseEvent) => void;
  tooltipRef: React.RefObject<HTMLDivElement>;
  spectrumLabel: string;
}> = ({ 
  spectrum, 
  hoveredItem, 
  onItemHover, 
  onItemClick, 
  tooltipPosition, 
  onPositionTooltip, 
  tooltipRef,
  spectrumLabel 
}) => {

  const hoveredItemData = spectrum
    .flatMap(cat => cat.items)
    .find(item => item.id === hoveredItem);

  return (
    <div>
      <h3 className="text-lg font-bold mb-2">{spectrumLabel}</h3>
      <p className="text-gray-600 mb-4">
        Items are organized along a spectrum from left to right. Hover over any item to see detailed information.
      </p>

      <div className="flex flex-col space-y-6 mt-8">
        {spectrum.map((category) => (
          <div key={category.type} className="border rounded-lg overflow-hidden">

            {/* Category Header */}
            <div
              className="px-4 py-2 text-white font-bold"
              style={{ backgroundColor: category.darkColor }}
            >
              {category.type}
              <span className="text-sm font-normal ml-3">({category.description})</span>
            </div>

            {/* Category Items */}
            <div
              className="p-4"
              style={{ backgroundColor: `${category.color}15` }}
            >
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                {category.items.map((item) => (
                  <SpectrumItemCard
                    key={item.id}
                    item={item}
                    category={category}
                    isHovered={hoveredItem === item.id}
                    onHover={onItemHover}
                    onPositionTooltip={onPositionTooltip}
                    onClick={onItemClick}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tooltip */}
      {hoveredItem && hoveredItemData && (
        <ItemTooltip
          item={hoveredItemData}
          position={tooltipPosition}
          tooltipRef={tooltipRef}
        />
      )}
    </div>
  );
};

/**
 * Comparison View Component
 */
const ComparisonView: React.FC<{
  spectrum: SpectrumCategory[];
  samples: ComparisonSample[];
  selectedSample: string;
  onSampleChange: (sampleId: string) => void;
  comparisonLabel: string;
}> = ({ spectrum, samples, selectedSample, onSampleChange, comparisonLabel }) => {

  const currentSample = samples.find(s => s.id === selectedSample) || samples[0];

  if (!currentSample) {
    return <div>No samples available for comparison.</div>;
  }

  return (
    <div>
      <h3 className="text-lg font-bold mb-4">{comparisonLabel}</h3>

      {/* Sample selector */}
      <div className="flex space-x-4 mb-6">
        {samples.map(sample => (
          <button
            key={sample.id}
            className={`px-3 py-1 rounded-md text-sm ${
              selectedSample === sample.id 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => onSampleChange(sample.id)}
          >
            {sample.name}
          </button>
        ))}
      </div>

      {/* Comparison grid */}
      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <h4 className="font-bold text-center mb-4">{currentSample.name}</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {spectrum.map((category) => (
            <React.Fragment key={category.type}>
              {category.items.map((item) => {
                const sampleContent = currentSample.content[item.id];

                if (!sampleContent) return null;

                return (
                  <div
                    key={item.id}
                    className="border rounded-md overflow-hidden"
                    style={{ 
                      borderLeftColor: category.darkColor, 
                      borderLeftWidth: '4px' 
                    }}
                  >
                    <div className="bg-gray-100 px-3 py-1 border-b flex justify-between">
                      <span className="font-bold">{item.id}</span>
                      <span className="text-xs text-gray-500">{category.type}</span>
                    </div>
                    <div className="p-3 text-sm">
                      {sampleContent}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Analysis section */}
      <div className="mt-6 bg-gray-50 rounded-lg p-4">
        <h4 className="font-bold mb-2">What to Notice</h4>
        <p className="text-sm text-gray-700">
          Compare how different items in the spectrum handle the same content. 
          Notice the trade-offs between accuracy, readability, and approach.
        </p>
      </div>
    </div>
  );
};

/**
 * Main ComparisonSpectrum Component
 */
export function ComparisonSpectrum({
  title,
  description,
  spectrum,
  samples = [],
  showInstructions = true,
  instructionText,
  spectrumLabel = "Spectrum Overview",
  comparisonLabel = "Compare Samples",
  onItemClick,
  defaultSample
}: ComparisonSpectrumProps) {
  const [activeTab, setActiveTab] = useState(samples.length > 0 ? 'spectrum' : 'spectrum');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [selectedSample, setSelectedSample] = useState(defaultSample || samples[0]?.id || '');
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Handle tooltip positioning
  const positionTooltip = (event: React.MouseEvent<HTMLDivElement>) => {
    if (tooltipRef.current) {
      const tooltipWidth = 280;
      const tooltipHeight = 180;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const mouseX = event.clientX;
      const mouseY = event.clientY;

      let top = mouseY + 20;
      let left = mouseX - (tooltipWidth / 2);

      // Keep within viewport
      if (left + tooltipWidth > viewportWidth) {
        left = viewportWidth - tooltipWidth - 10;
      }
      if (left < 10) {
        left = 10;
      }
      if (top + tooltipHeight > viewportHeight) {
        top = mouseY - tooltipHeight - 10;
      }

      setTooltipPosition({ top, left });
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold">{title}</h2>
        {description && (
          <p className="text-gray-600 mt-1">{description}</p>
        )}
      </div>

      {/* Instructions */}
      {showInstructions && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <Info className="text-blue-500 mt-1 flex-shrink-0" size={20} />
            <div>
              <h4 className="font-bold text-blue-700">How to Use This Comparison Tool</h4>
              <p className="text-gray-700 mt-1">
                {instructionText || 
                 "Explore the spectrum to understand different approaches, then use the comparison tab to see how they handle the same content differently."
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        <button
          className={`pb-3 px-4 font-medium ${
            activeTab === 'spectrum'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('spectrum')}
        >
          <div className="flex items-center gap-2">
            <Compass size={18} />
            <span>{spectrumLabel}</span>
          </div>
        </button>

        {samples.length > 0 && (
          <button
            className={`pb-3 px-4 font-medium ${
              activeTab === 'comparison'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveTab('comparison')}
          >
            <div className="flex items-center gap-2">
              <FileText size={18} />
              <span>{comparisonLabel}</span>
            </div>
          </button>
        )}
      </div>

      {/* Content */}
      {activeTab === 'spectrum' ? (
        <SpectrumView
          spectrum={spectrum}
          hoveredItem={hoveredItem}
          onItemHover={setHoveredItem}
          onItemClick={onItemClick}
          tooltipPosition={tooltipPosition}
          onPositionTooltip={positionTooltip}
          tooltipRef={tooltipRef}
          spectrumLabel={spectrumLabel}
        />
      ) : (
        <ComparisonView
          spectrum={spectrum}
          samples={samples}
          selectedSample={selectedSample}
          onSampleChange={setSelectedSample}
          comparisonLabel={comparisonLabel}
        />
      )}

      {/* Recommendation section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
        <div className="flex items-start gap-2">
          <Info className="text-blue-500 mt-1 flex-shrink-0" size={20} />
          <div>
            <h4 className="font-bold text-blue-700">Recommendation</h4>
            <p className="text-gray-700 mt-1">
              {spectrum.some(cat => cat.items.some(item => item.recommended)) ? (
                <>
                  Items marked with ⭐ are recommended for most users. 
                  Consider your specific needs and compare multiple options before deciding.
                </>
              ) : (
                "Compare different options to find what works best for your specific needs and preferences."
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Usage Examples:
 * 
 * // Bible Translations (your original)
 * <ComparisonSpectrum
 *   title="Understanding Bible Translations"
 *   description="Choose the right translation for your study needs"
 *   spectrum={[
 *     {
 *       type: 'WORD-FOR-WORD',
 *       description: 'Most literal, best for detailed study',
 *       color: '#4ade80',
 *       darkColor: '#16a34a',
 *       items: [
 *         { id: 'KJV', name: 'King James Version', year: '1611', description: '...', features: '...', recommended: true },
 *         { id: 'NASB', name: 'New American Standard', year: '1971', description: '...', features: '...' }
 *       ]
 *     },
 *     {
 *       type: 'THOUGHT-FOR-THOUGHT',
 *       description: 'Balance of accuracy and readability',
 *       color: '#facc15',
 *       darkColor: '#ca8a04',
 *       items: [
 *         { id: 'NIV', name: 'New International Version', year: '1978', description: '...', features: '...' }
 *       ]
 *     }
 *   ]}
 *   samples={[
 *     { id: 'john316', name: 'John 3:16', content: { 'KJV': 'For God so loved...', 'NIV': 'For God so loved...' }},
 *     { id: 'psalm23', name: 'Psalm 23:1', content: { 'KJV': 'The LORD is my shepherd...', 'NIV': 'The LORD is my shepherd...' }}
 *   ]}
 * />
 * 
 * // Software Pricing Tiers
 * <ComparisonSpectrum
 *   title="Choose Your Plan"
 *   description="Find the perfect plan for your needs and budget"
 *   spectrumLabel="Pricing Tiers"
 *   comparisonLabel="Feature Comparison"
 *   spectrum={[
 *     {
 *       type: 'BASIC',
 *       description: 'Perfect for individuals and small projects',
 *       color: '#10b981',
 *       darkColor: '#047857',
 *       items: [
 *         { id: 'FREE', name: 'Free Plan', description: 'Get started with core features', features: 'Up to 3 projects, 1GB storage', recommended: false },
 *         { id: 'STARTER', name: 'Starter', year: '$9/month', description: 'Great for freelancers', features: '10 projects, 10GB storage', recommended: true }
 *       ]
 *     },
 *     {
 *       type: 'PROFESSIONAL',
 *       description: 'For growing teams and businesses',
 *       color: '#f59e0b',
 *       darkColor: '#d97706',
 *       items: [
 *         { id: 'PRO', name: 'Professional', year: '$29/month', description: 'Full feature access', features: 'Unlimited projects, 100GB storage, team collaboration' }
 *       ]
 *     }
 *   ]}
 *   samples={[
 *     { id: 'storage', name: 'Storage Limits', content: { 'FREE': '1GB', 'STARTER': '10GB', 'PRO': '100GB' }},
 *     { id: 'projects', name: 'Project Limits', content: { 'FREE': '3 projects', 'STARTER': '10 projects', 'PRO': 'Unlimited' }}
 *   ]}
 * />
 * 
 * // Programming Frameworks
 * <ComparisonSpectrum
 *   title="JavaScript Framework Comparison"
 *   description="Choose the right framework for your next project"
 *   spectrumLabel="Framework Spectrum"
 *   comparisonLabel="Code Examples"
 *   spectrum={[
 *     {
 *       type: 'LIGHTWEIGHT',
 *       description: 'Minimal overhead, maximum control',
 *       color: '#06b6d4',
 *       darkColor: '#0891b2',
 *       items: [
 *         { id: 'VANILLA', name: 'Vanilla JS', description: 'Pure JavaScript', features: 'No dependencies, full control, steep learning curve' },
 *         { id: 'ALPINE', name: 'Alpine.js', description: 'Minimal framework', features: 'Small bundle, easy to learn, declarative' }
 *       ]
 *     },
 *     {
 *       type: 'FULL-FEATURED',
 *       description: 'Complete solutions with rich ecosystems',
 *       color: '#8b5cf6',
 *       darkColor: '#7c3aed',
 *       items: [
 *         { id: 'REACT', name: 'React', year: '2013', description: 'Component-based library', features: 'Large ecosystem, virtual DOM, JSX', recommended: true },
 *         { id: 'VUE', name: 'Vue.js', year: '2014', description: 'Progressive framework', features: 'Easy learning curve, great docs, flexible' }
 *       ]
 *     }
 *   ]}
 *   samples={[
 *     { 
 *       id: 'hello', 
 *       name: 'Hello World', 
 *       content: { 
 *         'VANILLA': 'document.body.innerHTML = "Hello World"', 
 *         'REACT': 'const App = () => <div>Hello World</div>',
 *         'VUE': '<template><div>Hello World</div></template>'
 *       }
 *     }
 *   ]}
 * />
 */

export default ComparisonSpectrum;