import React, { useState } from 'react';
import { BookOpen, Sun, Compass, Zap, MessageCircle, Gift, Book, ChevronDown, ChevronUp, Leaf, Star, Award, Shield } from 'lucide-react';

// This component creates a tabbed interface for exploring different aspects of a topic.
// Each tab contains expandable cards with detailed information, references, and examples.
// Perfect for educational content with multiple categories or sections.

const GenericTabbedExplorer = () => {
  // State to track which tab is currently active
  const [activeSection, setActiveSection] = useState('section1'); // Start with first section

  // State to track which cards are expanded in each section
  const [expandedSection1, setExpandedSection1] = useState(null);
  const [expandedSection2, setExpandedSection2] = useState(null);
  const [expandedSection3, setExpandedSection3] = useState(null);

  // First section data - customize this for your specific content
  const section1Data = [
    {
      id: 1,
      title: "[First Item Title]",
      subtitle: "[Reference or subtitle]",
      icon: <Sun className="text-yellow-500" size={24} />,
      color: "bg-yellow-50",
      borderColor: "border-yellow-400",
      textColor: "text-yellow-800",
      hoverColor: "hover:bg-yellow-100",
      description: "[Detailed description of this item. Explain what it means, why it's important, and how it relates to the overall topic.]",
      references: [
        { source: "[Reference 1 Source]", text: "[Supporting quote, data, or example that backs up this point]" },
        { source: "[Reference 2 Source]", text: "[Additional supporting evidence or example]" }
      ]
    },
    {
      id: 2,
      title: "[Second Item Title]",
      subtitle: "[Reference or subtitle]",
      icon: <Compass className="text-blue-500" size={24} />,
      color: "bg-blue-50",
      borderColor: "border-blue-400",
      textColor: "text-blue-800",
      hoverColor: "hover:bg-blue-100",
      description: "[Description of the second item and its significance]",
      references: [
        { source: "[Reference Source]", text: "[Supporting information for this item]" }
      ]
    },
    {
      id: 3,
      title: "[Third Item Title]",
      subtitle: "[Reference or subtitle]",
      icon: <MessageCircle className="text-purple-500" size={24} />,
      color: "bg-purple-50",
      borderColor: "border-purple-400",
      textColor: "text-purple-800",
      hoverColor: "hover:bg-purple-100",
      description: "[Description of the third item]",
      references: [
        { source: "[Reference Source]", text: "[Supporting evidence]" }
      ]
    }
  ];

  // Second section data
  const section2Data = [
    {
      id: 1,
      title: "[Benefit/Feature 1]",
      subtitle: "[Reference or source]",
      icon: <Book className="text-emerald-500" size={24} />,
      color: "bg-emerald-50",
      borderColor: "border-emerald-400",
      textColor: "text-emerald-800",
      hoverColor: "hover:bg-emerald-100",
      description: "[Detailed explanation of this benefit or feature and how it helps users]",
      references: [
        { source: "[Reference Source]", text: "[Supporting quote or evidence]" }
      ]
    },
    {
      id: 2,
      title: "[Benefit/Feature 2]",
      subtitle: "[Reference or source]",
      icon: <Sun className="text-amber-500" size={24} />,
      color: "bg-amber-50",
      borderColor: "border-amber-400",
      textColor: "text-amber-800",
      hoverColor: "hover:bg-amber-100",
      description: "[Description of the second benefit]",
      references: [
        { source: "[Reference Source]", text: "[Supporting information]" }
      ]
    },
    {
      id: 3,
      title: "[Benefit/Feature 3]",
      subtitle: "[Reference or source]",
      icon: <Compass className="text-indigo-500" size={24} />,
      color: "bg-indigo-50",
      borderColor: "border-indigo-400",
      textColor: "text-indigo-800",
      hoverColor: "hover:bg-indigo-100",
      description: "[Description of the third benefit]",
      references: [
        { source: "[Reference Source]", text: "[Supporting evidence]" }
      ]
    },
    {
      id: 4,
      title: "[Benefit/Feature 4]",
      subtitle: "[Reference or source]",
      icon: <Zap className="text-red-500" size={24} />,
      color: "bg-red-50",
      borderColor: "border-red-400",
      textColor: "text-red-800",
      hoverColor: "hover:bg-red-100",
      description: "[Description of the fourth benefit]",
      references: [
        { source: "[Reference Source]", text: "[Supporting information]" }
      ]
    },
    {
      id: 5,
      title: "[Benefit/Feature 5]",
      subtitle: "[Reference or source]",
      icon: <MessageCircle className="text-blue-500" size={24} />,
      color: "bg-blue-50",
      borderColor: "border-blue-400",
      textColor: "text-blue-800",
      hoverColor: "hover:bg-blue-100",
      description: "[Description of the fifth benefit]",
      references: [
        { source: "[Reference 1]", text: "[Supporting quote]" },
        { source: "[Reference 2]", text: "[Additional support]" }
      ]
    },
    {
      id: 6,
      title: "[Benefit/Feature 6]",
      subtitle: "[Reference or source]",
      icon: <Leaf className="text-green-500" size={24} />,
      color: "bg-green-50",
      borderColor: "border-green-400",
      textColor: "text-green-800",
      hoverColor: "hover:bg-green-100",
      description: "[Description of the sixth benefit]",
      references: [
        { source: "[Reference Source]", text: "[Supporting evidence]" }
      ]
    }
  ];

  // Third section data
  const section3Data = [
    {
      id: 1,
      title: "[Evidence/Example 1]",
      subtitle: "[Source or reference]",
      icon: <MessageCircle className="text-blue-500" size={24} />,
      color: "bg-blue-50",
      borderColor: "border-blue-400",
      textColor: "text-blue-800",
      description: "[Description of this evidence or example and what it demonstrates]",
      quote: "[Key quote or data point that supports this evidence]",
      reference: "[Source attribution]"
    },
    {
      id: 2,
      title: "[Evidence/Example 2]",
      subtitle: "[Source or reference]",
      icon: <BookOpen className="text-green-500" size={24} />,
      color: "bg-green-50",
      borderColor: "border-green-400",
      textColor: "text-green-800",
      description: "[Description of the second piece of evidence]",
      quote: "[Supporting quote or key finding]",
      reference: "[Source attribution]"
    },
    {
      id: 3,
      title: "[Evidence/Example 3]",
      subtitle: "[Source or reference]",
      icon: <BookOpen className="text-purple-500" size={24} />,
      color: "bg-purple-50",
      borderColor: "border-purple-400",
      textColor: "text-purple-800",
      description: "[Description of the third piece of evidence]",
      quote: "[Supporting quote or data]",
      reference: "[Source attribution]"
    }
  ];

  // Render the navigation tabs
  const renderTabs = () => (
    <div className="flex border-b mb-6">
      <button 
        className={`px-4 py-2 font-medium text-sm ${activeSection === 'section1' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
        onClick={() => setActiveSection('section1')}
      >
        [Section 1 Tab Label]
      </button>
      <button 
        className={`px-4 py-2 font-medium text-sm ${activeSection === 'section2' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
        onClick={() => setActiveSection('section2')}
      >
        [Section 2 Tab Label]
      </button>
      <button 
        className={`px-4 py-2 font-medium text-sm ${activeSection === 'section3' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
        onClick={() => setActiveSection('section3')}
      >
        [Section 3 Tab Label]
      </button>
    </div>
  );

  // Render first section with numbered priority cards
  const renderSection1 = () => (
    <div>
      <h2 className="text-xl font-bold mb-4 text-indigo-900">[Section 1 Main Title]</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {section1Data.map(item => (
          <div 
            key={item.id}
            className={`rounded-lg border ${item.borderColor} ${item.color} overflow-hidden transition-all`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <div className="mr-3 p-2 rounded-full bg-white">
                    {item.icon}
                  </div>
                  <h3 className="font-bold text-lg">{item.title}</h3>
                </div>
                <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-white text-indigo-600 font-bold text-lg border border-indigo-200">
                  {item.id}
                </div>
              </div>

              <div className="text-sm mb-3">
                <div className="flex items-center text-gray-600">
                  <BookOpen size={14} className="mr-1" />
                  <span>{item.subtitle}</span>
                </div>
              </div>

              <p className="text-gray-700 text-sm mb-3">{item.description}</p>

              <button
                className={`w-full py-2 px-3 rounded ${item.textColor} ${item.hoverColor} text-sm font-medium flex items-center justify-center`}
                onClick={() => setExpandedSection1(expandedSection1 === item.id ? null : item.id)}
              >
                {expandedSection1 === item.id ? (
                  <>Hide References <ChevronUp size={16} className="ml-1" /></>
                ) : (
                  <>View References <ChevronDown size={16} className="ml-1" /></>
                )}
              </button>

              {expandedSection1 === item.id && (
                <div className="mt-3 p-3 bg-white rounded-md border border-gray-200">
                  {item.references.map((ref, index) => (
                    <div key={index} className="mb-2 last:mb-0">
                      <div className="font-medium text-sm text-indigo-700">{ref.source}</div>
                      <p className="text-sm italic mt-1">"{ref.text}"</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render second section with expandable benefit cards
  const renderSection2 = () => (
    <div>
      <h2 className="text-xl font-bold mb-4 text-indigo-900">[Section 2 Main Title]</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {section2Data.map(item => (
          <div 
            key={item.id}
            className={`rounded-lg border ${item.borderColor} overflow-hidden transition-all hover:shadow-md cursor-pointer`}
            onClick={() => setExpandedSection2(expandedSection2 === item.id ? null : item.id)}
          >
            <div className={`p-4 ${item.color}`}>
              <div className="flex items-center mb-3">
                <div className="mr-3 p-2 rounded-full bg-white">
                  {item.icon}
                </div>
                <h3 className="font-bold">{item.title}</h3>
              </div>

              <div className="text-sm mb-3">
                <div className="flex items-center text-gray-600">
                  <BookOpen size={14} className="mr-1" />
                  <span>{item.subtitle}</span>
                </div>
              </div>

              {expandedSection2 === item.id && (
                <>
                  <p className="text-gray-700 text-sm mb-3">{item.description}</p>

                  <div className="p-3 bg-white rounded-md border border-gray-200 mt-2">
                    {item.references.map((ref, index) => (
                      <div key={index} className="mb-2 last:mb-0">
                        <div className="font-medium text-sm text-indigo-700">{ref.source}</div>
                        <p className="text-sm italic mt-1">"{ref.text}"</p>
                      </div>
                    ))}
                  </div>
                </>
              )}

              <div className={`text-sm ${item.textColor} font-medium mt-2 flex items-center`}>
                {expandedSection2 === item.id ? (
                  <>Click to collapse <ChevronUp size={16} className="ml-1" /></>
                ) : (
                  <>Click to expand <ChevronDown size={16} className="ml-1" /></>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render third section with evidence/examples
  const renderSection3 = () => (
    <div>
      <h2 className="text-xl font-bold mb-4 text-indigo-900">[Section 3 Main Title]</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-gray-700">
          [Introduction text for section 3. Explain what users will find in this section and how it supports the main topic.]
        </p>
      </div>

      <div className="border border-indigo-200 rounded-lg overflow-hidden mb-6">
        <div className="bg-indigo-50 p-4 border-b border-indigo-200 flex items-start">
          <BookOpen className="text-indigo-600 mr-3 flex-shrink-0 mt-1" size={20} />
          <div>
            <h3 className="font-medium text-indigo-800">[Highlighted Evidence Title]</h3>
            <p className="text-sm text-gray-600">[Description of this key evidence]</p>
          </div>
        </div>
        <div className="p-4 bg-white">
          <p className="text-lg italic text-gray-800">
            "[Key quote or finding that represents the most important evidence]"
          </p>
          <p className="text-right text-indigo-600 font-medium mt-2">[Source attribution]</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {section3Data.map(item => (
          <div 
            key={item.id}
            className={`rounded-lg border ${item.borderColor} overflow-hidden transition-all hover:shadow-md cursor-pointer`}
            onClick={() => setExpandedSection3(expandedSection3 === item.id ? null : item.id)}
          >
            <div className={`p-4 ${item.color}`}>
              <div className="flex items-center mb-3">
                <div className="mr-3 p-2 rounded-full bg-white">
                  {item.icon}
                </div>
                <h3 className="font-bold">{item.title}</h3>
              </div>

              <div className="text-sm mb-3">
                <div className="flex items-center text-gray-600">
                  <BookOpen size={14} className="mr-1" />
                  <span>{item.subtitle}</span>
                </div>
              </div>

              {expandedSection3 === item.id && (
                <p className="text-gray-700 text-sm mb-3">{item.description}</p>
              )}

              <div className="p-3 bg-white rounded-md border border-gray-200 text-sm italic">
                "{item.quote}"
                <div className="text-right text-indigo-600 font-medium mt-1">{item.reference}</div>
              </div>

              <div className={`text-sm ${item.textColor} font-medium mt-3 flex items-center justify-center`}>
                {expandedSection3 === item.id ? (
                  <>Show Less <ChevronUp size={16} className="ml-1" /></>
                ) : (
                  <>Show More <ChevronDown size={16} className="ml-1" /></>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header section */}
      <div className="bg-indigo-600 text-white p-5">
        <h2 className="text-xl font-bold">[Your Main Component Title]</h2>
        <p className="mt-1 text-indigo-200">
          [Brief description of what this component explores and why it's useful]
        </p>
      </div>

      <div className="p-5">
        {/* Instructions panel */}
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
          <h3 className="font-bold text-indigo-800 mb-2">How to Use This Interactive Guide</h3>
          <ul className="space-y-2 text-sm text-indigo-700">
            <li><span className="font-semibold">Navigation Tabs:</span> Use the tabs at the top to switch between different sections of information.</li>
            <li><span className="font-semibold">Interactive Cards:</span> Click each card to expand and see detailed information and supporting material.</li>
            <li><span className="font-semibold">Reference Study:</span> Take time to read and reflect on the references and examples provided for each point.</li>
            <li><span className="font-semibold">Personal Application:</span> Consider the reflection questions at the bottom to apply these insights to your situation.</li>
          </ul>
        </div>

        {/* Tab navigation */}
        {renderTabs()}

        {/* Conditional rendering based on active section */}
        {activeSection === 'section1' && renderSection1()}
        {activeSection === 'section2' && renderSection2()}
        {activeSection === 'section3' && renderSection3()}
      </div>

      {/* Application questions footer */}
      <div className="bg-gray-50 p-4 border-t">
        <h3 className="font-bold text-gray-700 mb-2">[Application Section Title]</h3>
        <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
          <li>[Question about which aspect is most relevant to the user's current situation]</li>
          <li>[Question about personal experience with these concepts]</li>
          <li>[Question about practical next steps for implementation]</li>
        </ul>
      </div>
    </div>
  );
};

export default GenericTabbedExplorer;   