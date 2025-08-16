import React, { useState, useEffect } from 'react';
import { MessageSquare, Save, Edit3, BookOpen, Brain, Target, Users, Lightbulb, FileText, Heart, CheckCircle } from 'lucide-react';

/**
 * ReflectionJournal Component
 * 
 * This is a content-neutral version of your original ReflectionSection.
 * It provides a space for learners to think, write, and engage with content
 * in a personal, meaningful way.
 */

// Define different types of reflection prompts for smart defaults
type ReflectionType = 
  | 'reflection'     // General reflection and thinking
  | 'analysis'       // Critical analysis and evaluation
  | 'application'    // How to apply learning in real life
  | 'creative'       // Creative writing and expression
  | 'assessment'     // Self-assessment and evaluation
  | 'discussion'     // Discussion starter questions
  | 'planning'       // Goal setting and planning
  | 'synthesis'      // Combining multiple concepts
  | 'personal'       // Personal connection and meaning
  | 'problem'        // Problem-solving exercises
  | 'compare'        // Comparison and contrast
  | 'predict';       // Predictions and hypotheses

// Configuration for different reflection types
interface ReflectionConfig {
  placeholder: string;
  icon: React.ReactNode;
  actionWord: string;        // "Reflect", "Analyze", "Plan", etc.
  minWords?: number;         // Suggested minimum word count
  promptSuggestions?: string[];  // Helper prompts if user gets stuck
}

// Main component props
interface ReflectionJournalProps {
  children: React.ReactNode;     // The main question/prompt

  // Content configuration
  type?: ReflectionType;         // Determines default behavior and styling
  title?: string;                // Custom title instead of type-based default
  context?: string;              // Additional context or instructions

  // Writing features
  placeholder?: string;          // Custom placeholder text
  minWords?: number;             // Minimum word count (shows progress)
  maxWords?: number;             // Maximum word count (shows limit)
  allowFormatting?: boolean;     // Enable basic text formatting
  showWordCount?: boolean;       // Display word count indicator

  // Persistence features
  storageKey?: string;           // Unique key for auto-saving (required for persistence)
  autoSave?: boolean;           // Auto-save as user types
  allowExport?: boolean;         // Let users export their reflection

  // Layout options
  variant?: 'default' | 'compact' | 'expanded' | 'minimal';
  rows?: number;                 // Height of text area (in rows)

  // Interaction features
  hasPromptHelpers?: boolean;    // Show suggestion prompts if user gets stuck
  allowPrivateNotes?: boolean;   // Option for private vs. shareable reflections
  showEncouragement?: boolean;   // Show encouraging messages as they write

  // Theme integration
  colorScheme?: 'primary' | 'secondary' | 'accent' | 'success' | 'warning' | 'info';

  // Callbacks
  onSave?: (content: string, metadata?: any) => void;
  onChange?: (content: string) => void;
  onWordCountChange?: (count: number) => void;
}

/**
 * Configuration for different reflection types
 */
const getReflectionConfig = (type: ReflectionType): ReflectionConfig => {
  const configs: Record<ReflectionType, ReflectionConfig> = {
    reflection: {
      placeholder: "Take a moment to reflect on what you've learned. What stands out to you? How does this connect to your own experience?",
      icon: <MessageSquare className="h-5 w-5" />,
      actionWord: "Reflect",
      minWords: 50,
      promptSuggestions: [
        "What surprised you most about this content?",
        "How does this relate to something you already know?",
        "What questions does this raise for you?"
      ]
    },
    analysis: {
      placeholder: "Analyze the key points presented. What are the strengths and weaknesses? What evidence supports the main arguments?",
      icon: <Brain className="h-5 w-5" />,
      actionWord: "Analyze",
      minWords: 100,
      promptSuggestions: [
        "What evidence is most convincing?",
        "What assumptions are being made?",
        "What alternative perspectives exist?"
      ]
    },
    application: {
      placeholder: "How will you apply what you've learned? What specific actions will you take? What might be challenging?",
      icon: <Target className="h-5 w-5" />,
      actionWord: "Apply",
      minWords: 75,
      promptSuggestions: [
        "What will you do differently now?",
        "How can you practice this skill?",
        "What obstacles might you face?"
      ]
    },
    creative: {
      placeholder: "Let your creativity flow. Write a story, poem, or creative response inspired by this content.",
      icon: <Edit3 className="h-5 w-5" />,
      actionWord: "Create",
      promptSuggestions: [
        "If this were a story, what would happen next?",
        "How would you explain this to a child?",
        "What metaphor captures this concept?"
      ]
    },
    assessment: {
      placeholder: "Assess your understanding and progress. What do you know well? What needs more work? How confident do you feel?",
      icon: <CheckCircle className="h-5 w-5" />,
      actionWord: "Assess",
      minWords: 50,
      promptSuggestions: [
        "Rate your understanding from 1-10 and explain why",
        "What would you teach someone else?",
        "What do you still need to learn?"
      ]
    },
    discussion: {
      placeholder: "Share your thoughts for group discussion. What would you like to explore further with others?",
      icon: <Users className="h-5 w-5" />,
      actionWord: "Discuss",
      promptSuggestions: [
        "What would you ask the group?",
        "What controversial point interests you?",
        "How might others see this differently?"
      ]
    },
    planning: {
      placeholder: "Create a plan based on what you've learned. Set goals, identify steps, and consider timelines.",
      icon: <Target className="h-5 w-5" />,
      actionWord: "Plan",
      minWords: 75,
      promptSuggestions: [
        "What's your main goal?",
        "What are the key milestones?",
        "What resources do you need?"
      ]
    },
    synthesis: {
      placeholder: "Connect this content with other concepts you've learned. How do these ideas work together?",
      icon: <Lightbulb className="h-5 w-5" />,
      actionWord: "Synthesize",
      minWords: 100,
      promptSuggestions: [
        "How does this connect to previous lessons?",
        "What patterns do you notice?",
        "What bigger picture emerges?"
      ]
    },
    personal: {
      placeholder: "How does this content connect to your personal life, values, or experiences? What does it mean to you?",
      icon: <Heart className="h-5 w-5" />,
      actionWord: "Connect",
      minWords: 50,
      promptSuggestions: [
        "What personal experience does this remind you of?",
        "How does this align with your values?",
        "What emotions does this bring up?"
      ]
    },
    problem: {
      placeholder: "Work through this problem step by step. What's your approach? What solutions can you develop?",
      icon: <Brain className="h-5 w-5" />,
      actionWord: "Solve",
      minWords: 100,
      promptSuggestions: [
        "What's the core problem?",
        "What solutions have you tried?",
        "What would an expert do?"
      ]
    },
    compare: {
      placeholder: "Compare and contrast the different concepts, approaches, or perspectives presented.",
      icon: <FileText className="h-5 w-5" />,
      actionWord: "Compare",
      minWords: 75,
      promptSuggestions: [
        "What are the key similarities?",
        "What are the main differences?",
        "Which approach works better and why?"
      ]
    },
    predict: {
      placeholder: "Based on what you've learned, make predictions about what might happen next or how this might develop.",
      icon: <Lightbulb className="h-5 w-5" />,
      actionWord: "Predict",
      minWords: 50,
      promptSuggestions: [
        "What do you think will happen next?",
        "What trends do you notice?",
        "What are the implications?"
      ]
    }
  };

  return configs[type] || configs.reflection;
};

/**
 * Helper function to get color schemes
 */
const getColorClasses = (type: ReflectionType, colorScheme?: string) => {
  if (colorScheme) {
    const schemeMap = {
      primary: 'border-l-blue-500 bg-blue-50 text-blue-700 bg-blue-100 border-blue-200',
      secondary: 'border-l-purple-500 bg-purple-50 text-purple-700 bg-purple-100 border-purple-200',
      accent: 'border-l-indigo-500 bg-indigo-50 text-indigo-700 bg-indigo-100 border-indigo-200',
      success: 'border-l-green-500 bg-green-50 text-green-700 bg-green-100 border-green-200',
      warning: 'border-l-yellow-500 bg-yellow-50 text-yellow-700 bg-yellow-100 border-yellow-200',
      info: 'border-l-cyan-500 bg-cyan-50 text-cyan-700 bg-cyan-100 border-cyan-200',
    };

    return schemeMap[colorScheme as keyof typeof schemeMap] || schemeMap.primary;
  }

  // Default to a calming blue for all reflection types
  return 'border-l-blue-500 bg-blue-50 text-blue-700 bg-blue-100 border-blue-200';
};

/**
 * Helper function to count words in text
 */
const countWords = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

/**
 * Main ReflectionJournal Component
 */
export function ReflectionJournal({
  children,
  type = 'reflection',
  title,
  context,
  placeholder,
  minWords,
  maxWords,
  allowFormatting = false,
  showWordCount = true,
  storageKey,
  autoSave = true,
  allowExport = false,
  variant = 'default',
  rows = 6,
  hasPromptHelpers = true,
  allowPrivateNotes = false,
  showEncouragement = true,
  colorScheme,
  onSave,
  onChange,
  onWordCountChange
}: ReflectionJournalProps) {

  // Get configuration for this reflection type
  const config = getReflectionConfig(type);

  // State management
  const [content, setContent] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [showPrompts, setShowPrompts] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [wordCount, setWordCount] = useState(0);

  // Get styling
  const colorClasses = getColorClasses(type, colorScheme);
  const [borderColor, bgColor, textColor, iconBgColor, borderColorAlt] = colorClasses.split(' ');

  // Determine display values
  const displayTitle = title || `${config.actionWord} on This Content`;
  const displayPlaceholder = placeholder || config.placeholder;
  const displayMinWords = minWords || config.minWords || 0;

  // Load saved content on mount
  useEffect(() => {
    if (storageKey && autoSave) {
      const saved = localStorage.getItem(`reflection-${storageKey}`);
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setContent(data.content || '');
          setIsPrivate(data.isPrivate || false);
          setLastSaved(data.savedAt ? new Date(data.savedAt) : null);
        } catch (e) {
          // If parsing fails, just use the string directly
          setContent(saved);
        }
      }
    }
  }, [storageKey, autoSave]);

  // Update word count when content changes
  useEffect(() => {
    const words = countWords(content);
    setWordCount(words);
    onWordCountChange?.(words);
  }, [content, onWordCountChange]);

  // Auto-save functionality
  useEffect(() => {
    if (storageKey && autoSave && content.trim()) {
      const timer = setTimeout(() => {
        const data = {
          content,
          isPrivate,
          savedAt: new Date().toISOString(),
          type,
          wordCount: countWords(content)
        };
        localStorage.setItem(`reflection-${storageKey}`, JSON.stringify(data));
        setLastSaved(new Date());
      }, 1000); // Auto-save after 1 second of no typing

      return () => clearTimeout(timer);
    }
  }, [content, isPrivate, storageKey, autoSave, type]);

  // Handle content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;

    // Check max words if specified
    if (maxWords && countWords(newContent) > maxWords) {
      return; // Don't update if over limit
    }

    setContent(newContent);
    onChange?.(newContent);
  };

  // Handle manual save
  const handleSave = () => {
    const metadata = {
      wordCount,
      type,
      isPrivate,
      savedAt: new Date().toISOString()
    };

    onSave?.(content, metadata);
    setLastSaved(new Date());
  };

  // Handle export
  const handleExport = () => {
    const exportData = {
      prompt: typeof children === 'string' ? children : 'Reflection prompt',
      response: content,
      wordCount,
      type,
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reflection-${storageKey || 'export'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get encouragement message based on word count
  const getEncouragementMessage = () => {
    if (wordCount === 0) return null;
    if (wordCount < 10) return "Great start! Keep your thoughts flowing.";
    if (wordCount < displayMinWords * 0.5) return "You're making good progress. What else comes to mind?";
    if (wordCount >= displayMinWords) return "Excellent reflection! Your thoughtful response shows deep engagement.";
    return "You're on the right track. A bit more detail would make this even stronger.";
  };

  return (
    <div className={`border-l-4 ${borderColor} ${bgColor} rounded-lg shadow-sm mb-6 overflow-hidden`} data-testid="reflection-journal">

      {/* Header Section */}
      <div className="pt-6 px-6 pb-3">
        <div className="flex items-start gap-3 mb-3">

          {/* Icon */}
          <div className={`${iconBgColor} p-2 rounded-md flex-shrink-0`}>
            <div className={textColor}>
              {config.icon}
            </div>
          </div>

          {/* Title and prompt */}
          <div className="min-w-0 flex-1">
            <h3 className={`text-lg font-semibold ${textColor}`}>
              {displayTitle}
            </h3>

            {context && (
              <p className="text-sm text-gray-500 mt-1">
                {context}
              </p>
            )}
          </div>
        </div>

        {/* Main prompt/question */}
        <div className="bg-white bg-opacity-70 p-4 rounded-md border border-white border-opacity-50 mb-4">
          <div className="text-gray-800 font-medium">
            {children}
          </div>
        </div>
      </div>

      {/* Writing Section */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-md border border-gray-200 overflow-hidden">

          {/* Toolbar */}
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-4">

              {/* Word count indicator */}
              {showWordCount && (
                <div className="text-sm text-gray-600">
                  <span className={wordCount >= displayMinWords ? 'text-green-600' : ''} data-testid="word-count">
                    {wordCount} words
                  </span>
                  {displayMinWords > 0 && (
                    <span className="text-gray-400"> (min: {displayMinWords})</span>
                  )}
                  {maxWords && (
                    <span className="text-gray-400"> (max: {maxWords})</span>
                  )}
                </div>
              )}

              {/* Auto-save status */}
              {autoSave && lastSaved && (
                <div className="text-xs text-gray-500" data-testid="save-status">
                  Saved {lastSaved.toLocaleTimeString()}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">

              {/* Privacy toggle */}
              {allowPrivateNotes && (
                <label className="flex items-center text-sm text-gray-600">
                  <input
                    type="checkbox"
                    checked={isPrivate}
                    onChange={(e) => setIsPrivate(e.target.checked)}
                    className="mr-2"
                    data-testid="checkbox-private"
                  />
                  Private notes
                </label>
              )}

              {/* Prompt helpers */}
              {hasPromptHelpers && config.promptSuggestions && (
                <button
                  onClick={() => setShowPrompts(!showPrompts)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                  data-testid="button-prompts"
                >
                  {showPrompts ? 'Hide' : 'Show'} prompts
                </button>
              )}

              {/* Export button */}
              {allowExport && content.trim() && (
                <button
                  onClick={handleExport}
                  className="text-sm text-gray-600 hover:text-gray-800"
                  data-testid="button-export"
                >
                  Export
                </button>
              )}

              {/* Manual save button */}
              {onSave && (
                <button
                  onClick={handleSave}
                  className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  data-testid="button-save"
                >
                  <Save className="h-3 w-3" />
                  Save
                </button>
              )}
            </div>
          </div>

          {/* Prompt suggestions */}
          {showPrompts && hasPromptHelpers && config.promptSuggestions && (
            <div className="bg-blue-50 p-3 border-b border-blue-200" data-testid="prompt-suggestions">
              <p className="text-sm font-medium text-blue-800 mb-2">Need inspiration? Try these prompts:</p>
              <ul className="text-sm text-blue-700 space-y-1">
                {config.promptSuggestions.map((prompt, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <button 
                      onClick={() => setContent(prev => prev + (prev ? '\n\n' : '') + prompt + ' ')}
                      className="text-left hover:underline"
                      data-testid={`prompt-suggestion-${index}`}
                    >
                      {prompt}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Text area */}
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder={displayPlaceholder}
            rows={rows}
            className="w-full p-4 border-none focus:outline-none focus:ring-0 resize-y min-h-[120px]"
            data-testid="textarea-reflection"
          />

          {/* Encouragement message */}
          {showEncouragement && wordCount > 0 && (
            <div className="bg-green-50 px-4 py-2 border-t border-green-200">
              <p className="text-sm text-green-700" data-testid="encouragement-message">
                💡 {getEncouragementMessage()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReflectionJournal;
