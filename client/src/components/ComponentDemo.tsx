import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import QuizComponent, { QuizQuestion } from "./QuizComponent";
import ReflectionJournal from "./ReflectionJournal";
import { 
  Clock, 
  Users, 
  Code, 
  BarChart3, 
  CheckCircle, 
  PlayCircle, 
  BookOpen, 
  Trophy, 
  Scale,
  Grid3X3,
  Search
} from "lucide-react";
import { useState } from "react";

// Sample quiz data
const SAMPLE_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "Your quiz question goes here - try editing this!",
    options: [
      { id: "a", text: "First answer option" },
      { id: "b", text: "Second answer option" },
      { id: "c", text: "Correct answer option" }
    ],
    correctAnswerId: "c"
  }
];

interface ComponentDemoProps {
  title: string;
  description: string;
  badge?: string;
  features: string[];
  demoType: 'quiz' | 'reflection' | 'timeline' | 'comparison' | 'grid' | 'tabs';
}

export default function ComponentDemo({ 
  title, 
  description, 
  badge, 
  features, 
  demoType 
}: ComponentDemoProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [timelineExpanded, setTimelineExpanded] = useState<string | null>(null);

  const renderDemo = () => {
    switch (demoType) {
      case 'quiz':
        return (
          <QuizComponent
            questions={SAMPLE_QUIZ_QUESTIONS}
            onQuizComplete={(score, passed) => {
              console.log(`Quiz completed: ${score}% (${passed ? 'passed' : 'failed'})`);
            }}
          />
        );

      case 'reflection':
        return (
          <ReflectionJournal
            type="personal"
            storageKey="demo-reflection"
            showEncouragement={true}
          >
            Your reflection prompt goes here - students can write their thoughts and ideas below. Try typing something!
          </ReflectionJournal>
        );

      case 'timeline':
        return (
          <div className="space-y-4" data-testid="timeline-demo">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Clock className="text-primary mr-2" size={20} />
                <h4 className="font-semibold">Your Timeline Title Here</h4>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                data-testid="customize-timeline"
              >
                Add Your Events ✏️
              </Button>
            </div>
            <div className="relative pl-8 border-l-2 border-gray-200">
              <div className="mb-4 relative">
                <div className="absolute -left-10 w-4 h-4 rounded-full bg-primary border-2 border-primary"></div>
                <Card 
                  className="cursor-pointer hover:shadow-sm transition-shadow bg-blue-50 border-blue-200"
                  onClick={() => setTimelineExpanded(timelineExpanded === "event1" ? null : "event1")}
                  data-testid="timeline-item-event1"
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-blue-600">[Your Date]</div>
                        <div className="font-semibold">[Your Event Title]</div>
                        <div className="text-sm text-gray-600 mt-1">
                          [Brief description of your event]
                        </div>
                        {timelineExpanded === "event1" && (
                          <div className="mt-2 text-sm text-gray-700">
                            [Detailed explanation of your event goes here. Click to expand/collapse this content. 
                            Perfect for showing historical progressions, project milestones, or learning pathways.]
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="mb-4 relative">
                <div className="absolute -left-10 w-4 h-4 rounded-full bg-secondary border-2 border-secondary"></div>
                <Card 
                  className="cursor-pointer hover:shadow-sm transition-shadow bg-purple-50 border-purple-200"
                  onClick={() => setTimelineExpanded(timelineExpanded === "event2" ? null : "event2")}
                  data-testid="timeline-item-event2"
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-purple-600">[Another Date]</div>
                        <div className="font-semibold">[Second Event Title]</div>
                        <div className="text-sm text-gray-600 mt-1">
                          [Another event description]
                        </div>
                        {timelineExpanded === "event2" && (
                          <div className="mt-2 text-sm text-gray-700">
                            [Your second event details here. Try clicking on different timeline items to see 
                            how the expand/collapse functionality works for organizing chronological content.]
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div className="mb-4 relative">
                <div className="absolute -left-10 w-4 h-4 rounded-full bg-green-500 border-2 border-green-500"></div>
                <Card 
                  className="cursor-pointer hover:shadow-sm transition-shadow bg-green-50 border-green-200"
                  onClick={() => setTimelineExpanded(timelineExpanded === "event3" ? null : "event3")}
                  data-testid="timeline-item-event3"
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-green-600">[Latest Date]</div>
                        <div className="font-semibold">[Most Recent Event]</div>
                        <div className="text-sm text-gray-600 mt-1">
                          [Current or future milestone]
                        </div>
                        {timelineExpanded === "event3" && (
                          <div className="mt-2 text-sm text-gray-700">
                            [Details about your most recent or upcoming event. Great for showing progress 
                            towards goals or future learning objectives.]
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                📝 Perfect for course progressions, historical events, project milestones, or learning pathways. 
                Each event can include rich content, images, and interactive elements.
              </p>
            </div>
          </div>
        );

      case 'comparison':
        return (
          <div className="space-y-4" data-testid="comparison-demo">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <Scale className="text-primary mr-2" size={20} />
                <h4 className="font-semibold">Interactive Comparison Tool</h4>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                data-testid="customize-comparison"
              >
                Customize This ✏️
              </Button>
            </div>

            {/* Mini version of the comparison tool */}
            <Card className="overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
                <h3 className="font-bold text-sm">[Your Comparison Title] vs [Alternative]</h3>
                <p className="text-xs text-blue-100">Compare your options side-by-side</p>
              </div>

              {/* Subject headers */}
              <div className="grid grid-cols-2 bg-gray-100 border-b text-xs">
                <div className="p-2 text-center border-r">
                  <h4 className="font-semibold text-gray-800">[Option A Title]</h4>
                  <p className="text-gray-600">[Option A subtitle]</p>
                </div>
                <div className="p-2 text-center">
                  <h4 className="font-semibold text-gray-800">[Option B Title]</h4>
                  <p className="text-gray-600">[Option B subtitle]</p>
                </div>
              </div>

              {/* Simplified tabs */}
              <div className="flex border-b bg-white text-xs">
                <div className="flex-1 py-2 px-3 text-center bg-blue-50 text-blue-600 border-b-2 border-blue-600">
                  ⚙️ [Category 1]
                </div>
                <div className="flex-1 py-2 px-3 text-center text-gray-600">
                  ✅ [Category 2]
                </div>
                <div className="flex-1 py-2 px-3 text-center text-gray-600">
                  ⚠️ [Category 3]
                </div>
              </div>

              {/* Content preview */}
              <div className="grid grid-cols-2 text-xs">
                <div className="p-3 border-r bg-blue-25">
                  <div className="space-y-2">
                    <div className="p-2 bg-white rounded border-l-2 border-blue-400">
                      [Your first point for Option A]
                    </div>
                    <div className="p-2 bg-white rounded border-l-2 border-blue-400">
                      [Your second point for Option A]
                    </div>
                    <div className="p-2 bg-white rounded border-l-2 border-blue-400">
                      [Your third point for Option A]
                    </div>
                  </div>
                </div>
                <div className="p-3 bg-purple-25">
                  <div className="space-y-2">
                    <div className="p-2 bg-white rounded border-l-2 border-purple-400">
                      [Your first point for Option B]
                    </div>
                    <div className="p-2 bg-white rounded border-l-2 border-purple-400">
                      [Your second point for Option B]
                    </div>
                    <div className="p-2 bg-white rounded border-l-2 border-purple-400">
                      [Your third point for Option B]
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Customization preview */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">Perfect for Any Comparison</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-gray-800 mb-1">[Your Topic 1]</div>
                    <div className="text-gray-600">[Option A] vs [Option B]</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-gray-800 mb-1">[Your Topic 2]</div>
                    <div className="text-gray-600">[Method A] vs [Method B]</div>
                  </div>
                  <div className="bg-white p-3 rounded border">
                    <div className="font-medium text-gray-800 mb-1">[Your Topic 3]</div>
                    <div className="text-gray-600">[Approach A] vs [Approach B]</div>
                  </div>
                </div>
                <p className="text-yellow-700 text-xs mt-3">
                  Simply replace the categories and content to match your specific comparison needs.
                </p>
              </CardContent>
            </Card>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                Perfect for helping learners understand trade-offs between different approaches, methods, or philosophies.
              </p>
            </div>
          </div>
        );

      case 'grid':
        return (
          <div className="space-y-4" data-testid="grid-demo">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Your Content Explorer</h4>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  type="text"
                  placeholder="Search your items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm w-48"
                  data-testid="input-search-modules"
                />
              </div>
            </div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview" className="text-sm" data-testid="tab-by-category">
                  <Grid3X3 size={16} className="mr-2" />
                  By Category
                </TabsTrigger>
                <TabsTrigger value="instructor" className="text-sm" data-testid="tab-by-instructor">
                  <Users size={16} className="mr-2" />
                  By Author
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <div>
                  <h5 className="text-sm font-semibold text-primary mb-2 flex items-center">
                    <Code className="mr-2" size={16} />
                    [Your Category Name] (3)
                  </h5>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Card className="bg-blue-50 border-blue-200 hover:shadow-sm transition-shadow cursor-pointer" data-testid="grid-item-1">
                      <CardContent className="p-3">
                        <div className="font-medium text-sm">[Your Item Title]</div>
                        <div className="text-xs text-gray-600 mt-1">Author: [Your Name]</div>
                        <div className="text-xs text-gray-500 mt-1">Type something in the search above!</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-blue-200 hover:shadow-sm transition-shadow cursor-pointer" data-testid="grid-item-2">
                      <CardContent className="p-3">
                        <div className="font-medium text-sm">[Second Item Title]</div>
                        <div className="text-xs text-gray-600 mt-1">Author: [Another Name]</div>
                        <div className="text-xs text-gray-500 mt-1">Click to view details</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-green-50 border-green-200 hover:shadow-sm transition-shadow cursor-pointer" data-testid="grid-item-3">
                      <CardContent className="p-3">
                        <div className="font-medium text-sm">[Third Item Title]</div>
                        <div className="text-xs text-gray-600 mt-1">Author: [Your Name]</div>
                        <div className="text-xs text-gray-500 mt-1">Try switching tabs above</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-purple-50 border-purple-200 hover:shadow-sm transition-shadow cursor-pointer" data-testid="grid-item-4">
                      <CardContent className="p-3">
                        <div className="font-medium text-sm">[Fourth Item Title]</div>
                        <div className="text-xs text-gray-600 mt-1">Author: [Team Member]</div>
                        <div className="text-xs text-gray-500 mt-1">Perfect for browsing content</div>
                      </CardContent>
                    </Card>
                  </div>
                  <h5 className="text-sm font-semibold text-secondary mb-2 flex items-center">
                    <BookOpen className="mr-2" size={16} />
                    [Another Category] (2)
                  </h5>
                  <div className="grid grid-cols-2 gap-2">
                    <Card className="bg-yellow-50 border-yellow-200 hover:shadow-sm transition-shadow cursor-pointer" data-testid="grid-item-5">
                      <CardContent className="p-3">
                        <div className="font-medium text-sm">[More Content Here]</div>
                        <div className="text-xs text-gray-600 mt-1">Author: [Content Creator]</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-orange-50 border-orange-200 hover:shadow-sm transition-shadow cursor-pointer" data-testid="grid-item-6">
                      <CardContent className="p-3">
                        <div className="font-medium text-sm">[Final Item Example]</div>
                        <div className="text-xs text-gray-600 mt-1">Author: [Your Team]</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="instructor" className="mt-4">
                <div className="space-y-3">
                  <div>
                    <h5 className="text-sm font-semibold text-primary mb-2 flex items-center">
                      <Users className="mr-2" size={16} />
                      [Your Name] (2 items)
                    </h5>
                    <div className="grid grid-cols-2 gap-2">
                      <Card className="bg-blue-50 border-blue-200 hover:shadow-sm transition-shadow cursor-pointer">
                        <CardContent className="p-3">
                          <div className="font-medium text-sm">[Your First Item]</div>
                          <div className="text-xs text-gray-600 mt-1">Category: [Type]</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-green-50 border-green-200 hover:shadow-sm transition-shadow cursor-pointer">
                        <CardContent className="p-3">
                          <div className="font-medium text-sm">[Your Second Item]</div>
                          <div className="text-xs text-gray-600 mt-1">Category: [Type]</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-secondary mb-2 flex items-center">
                      <Users className="mr-2" size={16} />
                      [Team Member] (1 item)
                    </h5>
                    <div className="grid grid-cols-2 gap-2">
                      <Card className="bg-purple-50 border-purple-200 hover:shadow-sm transition-shadow cursor-pointer">
                        <CardContent className="p-3">
                          <div className="font-medium text-sm">[Team Member's Item]</div>
                          <div className="text-xs text-gray-600 mt-1">Category: [Type]</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                📝 Perfect for organizing courses, resources, portfolio items, or any content that benefits 
                from multiple viewing perspectives. Search and categorize your content effortlessly.
              </p>
            </div>
          </div>
        );

      case 'tabs':
        return (
          <div className="space-y-4" data-testid="tabs-demo">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Your Lesson Organizer</h4>
              <Button 
                variant="outline" 
                size="sm"
                className="text-xs"
                data-testid="customize-tabs"
              >
                Customize Tabs ✏️
              </Button>
            </div>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" className="text-sm" data-testid="tab-overview">
                  <PlayCircle size={16} className="mr-2" />
                  [Tab 1]
                </TabsTrigger>
                <TabsTrigger value="content" className="text-sm" data-testid="tab-content">
                  <BookOpen size={16} className="mr-2" />
                  [Tab 2]
                </TabsTrigger>
                <TabsTrigger value="practice" className="text-sm" data-testid="tab-practice">
                  <CheckCircle size={16} className="mr-2" />
                  [Tab 3]
                </TabsTrigger>
                <TabsTrigger value="results" className="text-sm" data-testid="tab-results">
                  <Trophy size={16} className="mr-2" />
                  [Tab 4]
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <h5 className="font-semibold mb-2">[Your Section Title Here]</h5>
                    <p className="text-sm text-gray-600 mb-3">
                      [Your content description goes here. This could be lesson introduction, 
                      course overview, project briefing, or any organized content you want to present.]
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">[Your progress info] • [Time estimate]</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-24 bg-gray-200 rounded-full h-2">
                          <div className="bg-primary h-2 rounded-full w-3/4"></div>
                        </div>
                        <span className="text-xs text-gray-500">75%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="content" className="mt-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-4">
                    <h5 className="font-semibold mb-2 text-blue-800">[Content Section Title]</h5>
                    <p className="text-sm text-gray-600 mb-3">
                      [Your main content goes here. This might include lesson materials, reading assignments, 
                      video content, or instructional text. Try clicking through the different tabs!]
                    </p>
                    <div className="bg-white p-3 rounded border-l-4 border-blue-400">
                      <p className="text-sm text-blue-700">
                        💡 [Add your key takeaways, important notes, or highlighted content here]
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="practice" className="mt-4">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="p-4">
                    <h5 className="font-semibold mb-2 text-green-800">[Practice Section Title]</h5>
                    <p className="text-sm text-gray-600 mb-3">
                      [Your practice activities go here. This could include exercises, assignments, 
                      interactive elements, or hands-on activities for learners.]
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded border">
                        <h6 className="font-medium text-sm text-green-700 mb-1">[Exercise 1]</h6>
                        <p className="text-xs text-gray-600">[Brief description of practice activity]</p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <h6 className="font-medium text-sm text-green-700 mb-1">[Exercise 2]</h6>
                        <p className="text-xs text-gray-600">[Another practice opportunity]</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="results" className="mt-4">
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="p-4">
                    <h5 className="font-semibold mb-2 text-purple-800">[Results Section Title]</h5>
                    <p className="text-sm text-gray-600 mb-3">
                      [Your results and achievements section. This could show progress, completed work, 
                      grades, certificates, or learning outcomes.]
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between bg-white p-2 rounded">
                        <span className="text-sm text-gray-700">[Achievement 1]</span>
                        <CheckCircle className="text-green-500" size={16} />
                      </div>
                      <div className="flex items-center justify-between bg-white p-2 rounded">
                        <span className="text-sm text-gray-700">[Achievement 2]</span>
                        <CheckCircle className="text-green-500" size={16} />
                      </div>
                      <div className="flex items-center justify-between bg-white p-2 rounded opacity-50">
                        <span className="text-sm text-gray-700">[Future Achievement]</span>
                        <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">
                📝 Perfect for organizing lessons, courses, portfolios, or any content that benefits 
                from clear sections. Each tab can contain rich content, media, and interactive elements.
              </p>
            </div>
          </div>
        );

      default:
        return <div>Demo not available</div>;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow" data-testid={`component-demo-${demoType}`}>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="text-xl font-sf font-semibold">{title}</CardTitle>
          {badge && (
            <Badge className="bg-primary/10 text-primary" data-testid="component-badge">
              {badge}
            </Badge>
          )}
        </div>
        <p className="text-gray-600 mb-6">{description}</p>
      </CardHeader>

      <CardContent>
        {/* Live Demo */}
        <div className="bg-white rounded-lg border mb-4">
          {renderDemo()}
        </div>

        {/* Features List */}
        <div className="text-sm text-gray-500">
          {features.map((feature, index) => (
            <span key={index}>
              ✓ {feature}
              {index < features.length - 1 && ' • '}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}