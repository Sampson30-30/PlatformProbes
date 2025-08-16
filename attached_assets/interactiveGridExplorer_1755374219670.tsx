import React, { useState } from 'react';
import { BookOpen, Users, Calendar, MapPin, Building, Beaker, Code, GraduationCap } from 'lucide-react';

/**
 * InteractiveGridExplorer Component
 * 
 * Generic version of your BibleVisualization component.
 * Displays any collection of items with multiple view modes and rich hover interactions.
 * 
 * Perfect for:
 * - Bible books & authors (your original)
 * - Course modules & instructors
 * - Company employees & departments  
 * - Products & categories
 * - Scientific elements & properties
 * - Historical events & periods
 * 
 * Key features:
 * - Multiple tabbed views of the same data
 * - Rich hover details with metadata
 * - Automatic grouping and organization
 * - Responsive grid layouts
 * - Smart color coding
 */

// Core data structure for any item
interface GridItem {
  id: string;
  name: string;
  group: string;                    // Primary grouping (testament, department, category)
  metadata: Record<string, any>;    // Flexible metadata (date, author, price, etc.)
  description?: string;
  details?: Record<string, any>;    // Additional hover details
}

// View configuration - how to display the data
interface ViewMode {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  groupBy: string;                  // What field to group by
  itemLayout?: 'compact' | 'detailed' | 'minimal';
  showMetadata?: string[];          // Which metadata fields to show
}

// Props for the main component
interface InteractiveGridExplorerProps {
  title: string;                    // "Bible Composition" → "Course Structure" → "Team Directory"
  subtitle?: string;                // "66 Books, 40 Authors" → "12 Modules, 8 Instructors"
  data: GridItem[];                 // The items to display
  views: ViewMode[];                // Different ways to view the data

  // Styling
  colorScheme?: Record<string, string>;  // Colors for each group
  defaultView?: string;             // Which view to show first

  // Behavior
  onItemClick?: (item: GridItem) => void;
  onItemHover?: (item: GridItem | null) => void;
  searchable?: boolean;

  // Layout
  gridCols?: {
    mobile: number;
    tablet: number; 
    desktop: number;
  };
}

/**
 * Helper function to get appropriate icons for different content types
 */
const getContentIcon = (group: string, itemName?: string): React.ReactNode => {
  const lowerGroup = group.toLowerCase();
  const lowerName = itemName?.toLowerCase() || '';

  // Smart icon selection based on content
  if (lowerGroup.includes('testament') || lowerGroup.includes('book')) {
    return <BookOpen className="h-4 w-4" />;
  }
  if (lowerGroup.includes('people') || lowerGroup.includes('author') || lowerGroup.includes('instructor')) {
    return <Users className="h-4 w-4" />;
  }
  if (lowerGroup.includes('period') || lowerGroup.includes('era') || lowerName.includes('century')) {
    return <Calendar className="h-4 w-4" />;
  }
  if (lowerGroup.includes('location') || lowerGroup.includes('region')) {
    return <MapPin className="h-4 w-4" />;
  }
  if (lowerGroup.includes('department') || lowerGroup.includes('company')) {
    return <Building className="h-4 w-4" />;
  }
  if (lowerGroup.includes('science') || lowerGroup.includes('research')) {
    return <Beaker className="h-4 w-4" />;
  }
  if (lowerGroup.includes('technology') || lowerGroup.includes('programming')) {
    return <Code className="h-4 w-4" />;
  }
  if (lowerGroup.includes('course') || lowerGroup.includes('education')) {
    return <GraduationCap className="h-4 w-4" />;
  }

  return <BookOpen className="h-4 w-4" />; // Sensible default
};

/**
 * Individual Item Card Component
 */
const ItemCard: React.FC<{
  item: GridItem;
  groupColor: string;
  isHovered: boolean;
  layout: string;
  showMetadata: string[];
  onHover: (item: GridItem | null) => void;
  onClick?: (item: GridItem) => void;
}> = ({ item, groupColor, isHovered, layout, showMetadata, onHover, onClick }) => {

  return (
    <div
      className={`
        rounded-md border cursor-pointer transition-all duration-200 overflow-hidden
        ${layout === 'compact' ? 'p-2' : 'p-3'}
        ${isHovered ? 'shadow-lg transform scale-105' : 'shadow-sm'}
        ${onClick ? 'hover:shadow-md' : ''}
      `}
      style={{
        backgroundColor: isHovered ? groupColor : `${groupColor}30`,
        borderColor: `${groupColor}80`,
        color: isHovered ? 'white' : 'inherit'
      }}
      onMouseEnter={() => onHover(item)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onClick?.(item)}
    >
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 mt-0.5">
          {getContentIcon(item.group, item.name)}
        </div>

        <div className="min-w-0 flex-1">
          {/* Item name */}
          <div className={`font-semibold ${layout === 'compact' ? 'text-sm' : 'text-base'}`}>
            {item.name}
          </div>

          {/* Basic metadata (always visible) */}
          {layout !== 'minimal' && showMetadata.length > 0 && (
            <div className="text-xs opacity-80 mt-1 space-y-0.5">
              {showMetadata.slice(0, 2).map(field => (
                item.metadata[field] && (
                  <div key={field}>
                    <span className="capitalize">{field}:</span> {String(item.metadata[field])}
                  </div>
                )
              ))}
            </div>
          )}

          {/* Hover details */}
          {isHovered && (
            <div className="mt-2 space-y-1">
              {/* Description */}
              {item.description && (
                <div className="text-sm opacity-90">
                  {item.description}
                </div>
              )}

              {/* Additional metadata */}
              {layout === 'detailed' && (
                <div className="text-xs space-y-0.5">
                  {Object.entries(item.metadata).map(([key, value]) => (
                    !showMetadata.includes(key) && value && (
                      <div key={key}>
                        <span className="capitalize font-medium">{key}:</span> {String(value)}
                      </div>
                    )
                  ))}
                </div>
              )}

              {/* Extra details */}
              {item.details && (
                <div className="text-xs space-y-0.5 border-t border-white border-opacity-30 pt-1 mt-2">
                  {Object.entries(item.details).map(([key, value]) => (
                    <div key={key}>
                      <span className="capitalize font-medium">{key}:</span> {String(value)}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Grid View Component
 */
const GridView: React.FC<{
  data: GridItem[];
  view: ViewMode;
  colorScheme: Record<string, string>;
  hoveredItem: string | null;
  gridCols: { mobile: number; tablet: number; desktop: number; };
  onItemHover: (item: GridItem | null) => void;
  onItemClick?: (item: GridItem) => void;
}> = ({ data, view, colorScheme, hoveredItem, gridCols, onItemHover, onItemClick }) => {

  // Group data by the specified field
  const groupBy = view.groupBy;
  const groupedData = data.reduce((groups, item) => {
    const groupKey = groupBy === 'group' ? item.group : String(item.metadata[groupBy] || item[groupBy as keyof GridItem] || 'Other');
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, GridItem[]>);

  // Generate responsive grid classes
  const gridClasses = `grid gap-3 grid-cols-${gridCols.mobile} md:grid-cols-${gridCols.tablet} lg:grid-cols-${gridCols.desktop}`;

  return (
    <div className="space-y-6">
      {Object.entries(groupedData).map(([groupName, items]) => (
        <div key={groupName}>
          {/* Group header */}
          <h3 
            className="text-lg font-bold mb-3 flex items-center gap-2"
            style={{ color: colorScheme[groupName] || '#6b7280' }}
          >
            {getContentIcon(groupName)}
            {groupName}
            <span className="text-sm font-normal text-gray-500">({items.length})</span>
          </h3>

          {/* Items grid */}
          <div className={gridClasses}>
            {items.map(item => (
              <ItemCard
                key={item.id}
                item={item}
                groupColor={colorScheme[groupName] || '#6b7280'}
                isHovered={hoveredItem === item.id}
                layout={view.itemLayout || 'detailed'}
                showMetadata={view.showMetadata || ['date', 'author']}
                onHover={onItemHover}
                onClick={onItemClick}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * Main InteractiveGridExplorer Component
 */
export function InteractiveGridExplorer({
  title,
  subtitle,
  data,
  views,
  colorScheme = {},
  defaultView,
  onItemClick,
  onItemHover,
  searchable = false,
  gridCols = { mobile: 2, tablet: 3, desktop: 4 }
}: InteractiveGridExplorerProps) {
  const [activeView, setActiveView] = useState(defaultView || views[0]?.id || '');
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter data based on search
  const filteredData = searchTerm
    ? data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.values(item.metadata).some(value =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  // Handle item hover
  const handleItemHover = (item: GridItem | null) => {
    setHoveredItem(item?.id || null);
    onItemHover?.(item);
  };

  // Get current view
  const currentView = views.find(v => v.id === activeView) || views[0];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold">{title}</h2>
        {subtitle && (
          <p className="text-gray-600 mt-1">{subtitle}</p>
        )}
      </div>

      {/* Search */}
      {searchable && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {/* View tabs */}
      <div className="flex space-x-4 mb-6 border-b">
        {views.map(view => (
          <button
            key={view.id}
            className={`pb-3 px-4 font-medium ${
              activeView === view.id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
            onClick={() => setActiveView(view.id)}
          >
            <div className="flex items-center gap-2">
              {view.icon}
              <span>{view.name}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Current view description */}
      {currentView?.description && (
        <div className="mb-4 text-sm text-gray-600 bg-gray-50 p-3 rounded">
          {currentView.description}
        </div>
      )}

      {/* Content */}
      <GridView
        data={filteredData}
        view={currentView}
        colorScheme={colorScheme}
        hoveredItem={hoveredItem}
        gridCols={gridCols}
        onItemHover={handleItemHover}
        onItemClick={onItemClick}
      />

      {/* Search results summary */}
      {searchTerm && (
        <div className="mt-4 text-sm text-gray-600">
          Found {filteredData.length} of {data.length} items
        </div>
      )}
    </div>
  );
}

/**
 * Usage Examples:
 * 
 * // Bible Study (your original)
 * <InteractiveGridExplorer
 *   title="Bible Composition"
 *   subtitle="66 Books, 40 Authors, 1,500 Years"
 *   data={bibleBooks.map(book => ({
 *     id: book.name,
 *     name: book.name,
 *     group: book.testament,
 *     metadata: { date: book.date, author: book.author },
 *     description: book.description
 *   }))}
 *   views={[
 *     { 
 *       id: 'books', 
 *       name: 'Books of the Bible', 
 *       icon: <BookOpen />, 
 *       groupBy: 'group',
 *       description: 'Explore all 66 books organized by testament'
 *     },
 *     { 
 *       id: 'authors', 
 *       name: 'Bible Authors', 
 *       icon: <Users />, 
 *       groupBy: 'author',
 *       description: 'View books organized by their human authors'
 *     }
 *   ]}
 *   colorScheme={{ 'Old Testament': '#6b7280', 'New Testament': '#3b82f6' }}
 *   searchable={true}
 * />
 * 
 * // Course Structure
 * <InteractiveGridExplorer
 *   title="Course Modules"
 *   subtitle="12 Modules, 8 Instructors, 16 Weeks"
 *   data={modules}
 *   views={[
 *     { id: 'difficulty', name: 'By Difficulty', icon: <GraduationCap />, groupBy: 'level' },
 *     { id: 'instructor', name: 'By Instructor', icon: <Users />, groupBy: 'teacher' }
 *   ]}
 *   colorScheme={{ 'Beginner': '#10b981', 'Intermediate': '#f59e0b', 'Advanced': '#ef4444' }}
 * />
 * 
 * // Team Directory
 * <InteractiveGridExplorer
 *   title="Our Team"
 *   subtitle="45 People, 6 Departments"
 *   data={employees}
 *   views={[
 *     { id: 'dept', name: 'By Department', icon: <Building />, groupBy: 'department' },
 *     { id: 'role', name: 'By Role', icon: <Users />, groupBy: 'position' }
 *   ]}
 *   gridCols={{ mobile: 1, tablet: 2, desktop: 3 }}
 * />
 */

export default InteractiveGridExplorer;