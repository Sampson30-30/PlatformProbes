import React, { useState } from 'react';
import { BookOpen, Calendar, Clock, ChevronRight, Info } from 'lucide-react';

const GenericTimeline = () => {
  // State to track which event is currently expanded for details
  const [activeEvent, setActiveEvent] = useState(null);
  // State to control whether all event details are shown at once
  const [showAllDetails, setShowAllDetails] = useState(false);

  // Timeline data structure - Replace this with your own historical events
  const timelineEvents = [
    {
      id: 1,
      year: "[Add your date here - e.g., 1776, 500 BC, etc.]",
      title: "[Event title goes here]",
      reference: "[Source or reference - could be a book, document, etc.]",
      text: "[Short quote or key text from the event]",
      details: "[Detailed explanation of the event's significance and context]",
      type: "early", // Categories: early, middle, recent (you can customize these)
      group: "theme-1" // Thematic grouping to show connections between events
    },
    {
      id: 2,
      year: "[Another date here]",
      title: "[Second event title]",
      reference: "[Another source reference]",
      text: "[Another relevant quote or description]",
      details: "[Detailed context for this event and why it matters]",
      type: "early",
      group: "theme-2"
    },
    {
      id: 3,
      year: "[Middle period date]",
      title: "[Transitional event title]",
      reference: "[Reference for this period]",
      text: "[Key quote or description for this transition]",
      details: "[Explain how this event bridges earlier and later periods]",
      type: "middle",
      group: "theme-1"
    },
    {
      id: 4,
      year: "[Later date]",
      title: "[Recent event title]",
      reference: "[Modern source or reference]",
      text: "[Contemporary quote or description]",
      details: "[How this event represents the culmination or result of earlier events]",
      type: "recent",
      group: "theme-1"
    },
    {
      id: 5,
      year: "[Final date]",
      title: "[Concluding event title]",
      reference: "[Final reference]",
      text: "[Closing quote or summary statement]",
      details: "[Final context and significance of this concluding event]",
      type: "recent",
      group: "theme-2"
    }
  ];

  // Function to assign colors based on the event type (early, middle, recent)
  const getTypeColor = (type) => {
    switch (type) {
      case 'early':
        return 'bg-blue-100 border-blue-500 text-blue-800';
      case 'middle':
        return 'bg-purple-100 border-purple-500 text-purple-800';
      case 'recent':
        return 'bg-green-100 border-green-500 text-green-800';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };

  // Function to assign colors for thematic groups (shows connections between related events)
  const getGroupColor = (group) => {
    switch (group) {
      case 'theme-1':
        return '#ef4444'; // Red - for events related to first major theme
      case 'theme-2':
        return '#3b82f6'; // Blue - for events related to second major theme
      case 'theme-3':
        return '#10b981'; // Green - for events related to third major theme
      case 'theme-4':
        return '#8b5cf6'; // Purple - for events related to fourth major theme
      default:
        return '#6b7280'; // Gray - for ungrouped events
    }
  };

  // Toggle function to show/hide all event details at once
  const toggleAllDetails = () => {
    setShowAllDetails(!showAllDetails);
  };

  // Organize events into historical periods for better visual organization
  const eras = [
    {
      name: "[Early Period Name - e.g., 'Ancient Era', 'Foundation Period']",
      yearRange: "[Date range - e.g., '1000-500 BC', '1600-1700']",
      events: timelineEvents.filter(e => e.type === 'early')
    },
    {
      name: "[Middle Period Name - e.g., 'Transition Era', 'Development Period']",
      yearRange: "[Date range for middle period]",
      events: timelineEvents.filter(e => e.type === 'middle')
    },
    {
      name: "[Recent Period Name - e.g., 'Modern Era', 'Contemporary Period']",
      yearRange: "[Date range for recent period]",
      events: timelineEvents.filter(e => e.type === 'recent')
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Instructions panel - explains how to use the interactive timeline */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg m-4">
        <div className="p-4">
          <h3 className="font-bold text-blue-800 mb-2">How to Use This Timeline</h3>
          <ul className="space-y-2 text-sm text-blue-700">
            <li><span className="font-semibold">Interactive Events:</span> Click on any event card to view detailed historical context and significance.</li>
            <li><span className="font-semibold">Colour Coding:</span> Events are colour-coded by historical period - early (blue), middle (purple), and recent (green).</li>
            <li><span className="font-semibold">Connecting Lines:</span> Follow the coloured lines to see how events with similar themes connect across time periods.</li>
            <li><span className="font-semibold">Show All Details:</span> Use the "Show All Details" button to expand all events at once.</li>
          </ul>
        </div>
      </div>

      {/* Header section with title and description */}
      <div className="bg-blue-600 text-white p-4">
        <h2 className="text-xl font-bold flex items-center">
          <Calendar size={22} className="mr-2" />
          [Your Timeline Title Here]
        </h2>
        <p className="mt-1 text-blue-100 text-sm">
          [Timeline description - explain what historical progression you're showing]
        </p>
      </div>

      {/* Legend showing what different colors and symbols mean */}
      <div className="bg-gray-50 p-4 border-b">
        <div className="flex flex-wrap items-center gap-4">
          {/* Period type indicators */}
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-blue-500 mr-1"></span>
            <span className="text-sm">[Early Period Label]</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-purple-500 mr-1"></span>
            <span className="text-sm">[Middle Period Label]</span>
          </div>
          <div className="flex items-center">
            <span className="h-3 w-3 rounded-full bg-green-500 mr-1"></span>
            <span className="text-sm">[Recent Period Label]</span>
          </div>

          {/* Thematic connection indicators */}
          <div className="border-l pl-4 ml-2 flex items-center">
            <span className="h-2 w-6 bg-red-500 mr-1"></span>
            <span className="text-sm mr-3">[Theme 1 Name]</span>

            <span className="h-2 w-6 bg-blue-500 mr-1"></span>
            <span className="text-sm mr-3">[Theme 2 Name]</span>

            <span className="h-2 w-6 bg-green-500 mr-1"></span>
            <span className="text-sm mr-3">[Theme 3 Name]</span>

            <span className="h-2 w-6 bg-purple-500 mr-1"></span>
            <span className="text-sm">[Theme 4 Name]</span>
          </div>
        </div>
      </div>

      {/* Control panel for user interactions */}
      <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
        <div className="flex items-center">
          <Info size={18} className="text-blue-600 mr-2" />
          <span className="text-sm text-gray-600">Click on any event to view details</span>
        </div>
        <button 
          onClick={toggleAllDetails}
          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm hover:bg-blue-200"
        >
          {showAllDetails ? "Hide All Details" : "Show All Details"}
        </button>
      </div>

      {/* Main timeline visualization */}
      <div className="p-6">
        {eras.map((era, eraIndex) => (
          <div key={`era-${eraIndex}`} className="mb-10">
            {/* Era header showing the time period and name */}
            <div className="flex items-center mb-4">
              <div className="w-24 flex-shrink-0">
                <span className="inline-block bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                  {era.yearRange}
                </span>
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-bold">{era.name}</h3>
              </div>
            </div>

            {/* Vertical timeline with events */}
            <div className="relative ml-24 pl-8 border-l-2 border-gray-300">
              {era.events.map((event, eventIndex) => {
                return (
                  <div 
                    key={`event-${event.id}`} 
                    className="mb-6 relative"
                    id={`event-${event.id}`}
                  >
                    {/* Timeline dot - shows position on vertical timeline */}
                    <div 
                      className={`absolute -left-10 w-4 h-4 rounded-full border-2 ${
                        event.type === 'early' ? 'bg-blue-500 border-blue-600' :
                        event.type === 'middle' ? 'bg-purple-500 border-purple-600' :
                        'bg-green-500 border-green-600'
                      }`}
                    />

                    {/* Horizontal connecting line - shows thematic connections */}
                    <div 
                      className="absolute -left-6 top-2 h-0.5 w-6"
                      style={{ backgroundColor: getGroupColor(event.group) }}
                    />

                    {/* Event card - contains all the event information */}
                    <div 
                      className={`p-4 rounded-md border-l-4 cursor-pointer transition-all ${
                        getTypeColor(event.type)
                      } ${activeEvent === event.id ? 'ring-2 ring-offset-2 shadow-md' : 'hover:shadow-md'}`}
                      onClick={() => setActiveEvent(activeEvent === event.id ? null : event.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          {/* Event date */}
                          <div className="text-sm font-medium flex items-center">
                            <Clock size={14} className="mr-1" />
                            {event.year}
                          </div>
                          {/* Event title */}
                          <h4 className="font-bold mt-1">{event.title}</h4>
                          {/* Source reference */}
                          <div className="text-sm mt-1">{event.reference}</div>
                        </div>

                        {/* Theme indicator dot - shows which thematic group this event belongs to */}
                        <div 
                          className="h-4 w-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: getGroupColor(event.group) }}
                          title={`${event.group.charAt(0).toUpperCase() + event.group.slice(1).replace('-', ' ')} theme`}
                        />
                      </div>

                      {/* Key quote or description */}
                      <div className="mt-2 text-sm italic">"{event.text}"</div>

                      {/* Detailed explanation - shows when event is clicked or "Show All" is enabled */}
                      {(activeEvent === event.id || showAllDetails) && (
                        <div className="mt-3 text-sm p-3 bg-white bg-opacity-50 rounded">
                          {event.details}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Reflection section - customise these questions for your specific timeline topic */}
      <div className="bg-indigo-50 p-6 border-t">
        <h3 className="text-lg font-bold text-indigo-900 mb-3">
          Reflection Questions
        </h3>
        <ol className="list-decimal pl-5 space-y-2 text-gray-700">
          <li>[Question about patterns or connections you want users to notice]</li>
          <li>[Question about the significance of the timeline's progression]</li>
          <li>[Question about lessons or insights from this historical sequence]</li>
          <li>[Question that helps users apply this history to contemporary understanding]</li>
        </ol>
      </div>
    </div>
  );
};

export default GenericTimeline;