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
    question: "What makes a learning component effective?",
    options: [
      { id: "a", text: "Clear visual feedback" },
      { id: "b", text: "Interactive elements" },
      { id: "c", text: "Both of the above" }
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
            What are your main learning objectives? How will you measure success in your educational journey?
          </ReflectionJournal>
        );

      case 'timeline':
        return (
          <div className="space-y-4" data-testid="timeline-demo">
            <div className="flex items-center mb-4">
              <Clock className="text-primary mr-2" size={20} />
              <h4 className="font-semibold">Learning Platform Evolution</h4>
            </div>
            <div className="relative pl-8 border-l-2 border-gray-200">
              <div className="mb-4 relative">
                <div className="absolute -left-10 w-4 h-4 rounded-full bg-primary border-2 border-primary"></div>
                <Card 
                  className="cursor-pointer hover:shadow-sm transition-shadow bg-blue-50 border-blue-200"
                  onClick={() => setTimelineExpanded(timelineExpanded === "2020" ? null : "2020")}
                  data-testid="timeline-item-2020"
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-blue-600">2020</div>
                        <div className="font-semibold">Remote Learning Boom</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Pandemic accelerates digital education adoption
                        </div>
                        {timelineExpanded === "2020" && (
                          <div className="mt-2 text-sm text-gray-700">
                            The COVID-19 pandemic forced educational institutions worldwide to rapidly adopt digital learning solutions, 
                            leading to massive growth in online education platforms and tools.
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
                  onClick={() => setTimelineExpanded(timelineExpanded === "2023" ? null : "2023")}
                  data-testid="timeline-item-2023"
                >
                  <CardContent className="p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium text-purple-600">2023</div>
                        <div className="font-semibold">Interactive Components</div>
                        <div className="text-sm text-gray-600 mt-1">
                          Focus shifts to engagement and interactivity
                        </div>
                        {timelineExpanded === "2023" && (
                          <div className="mt-2 text-sm text-gray-700">
                            Educational technology evolves beyond basic video conferencing to include interactive elements, 
                            gamification, and personalized learning experiences.
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        );

      case 'comparison':
        return (
          <div className="space-y-4" data-testid="comparison-demo">
            <div className="flex items-center mb-4">
              <Scale className="text-primary mr-2" size={20} />
              <h4 className="font-semibold">Learning Approach Spectrum</h4>
            </div>
            <div className="space-y-3">
              <Card className="overflow-hidden">
                <div className="px-4 py-2 bg-blue-600 text-white font-semibold">
                  Self-Paced Learning
                  <span className="text-sm font-normal ml-3">(Individual focus)</span>
                </div>
                <CardContent className="p-3 bg-blue-50">
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs bg-white hover:shadow-sm"
                      data-testid="comparison-item-online-courses"
                    >
                      Online Courses
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs bg-white hover:shadow-sm"
                      data-testid="comparison-item-video-tutorials"
                    >
                      Video Tutorials
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs bg-white hover:shadow-sm"
                      data-testid="comparison-item-reading-materials"
                    >
                      Reading Materials
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card className="overflow-hidden">
                <div className="px-4 py-2 bg-green-600 text-white font-semibold">
                  Collaborative Learning
                  <span className="text-sm font-normal ml-3">(Group interaction)</span>
                </div>
                <CardContent className="p-3 bg-green-50">
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs bg-white hover:shadow-sm"
                      data-testid="comparison-item-workshops"
                    >
                      Workshops
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs bg-white hover:shadow-sm"
                      data-testid="comparison-item-group-projects"
                    >
                      Group Projects
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs bg-white hover:shadow-sm"
                      data-testid="comparison-item-peer-review"
                    >
                      Peer Review
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        );

      case 'grid':
        return (
          <div className="space-y-4" data-testid="grid-demo">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold">Course Module Browser</h4>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                <Input
                  type="text"
                  placeholder="Search modules..."
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
                  By Instructor
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <div>
                  <h5 className="text-sm font-semibold text-primary mb-2 flex items-center">
                    <Code className="mr-2" size={16} />
                    Development (3)
                  </h5>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <Card className="bg-blue-50 border-blue-200 hover:shadow-sm transition-shadow cursor-pointer" data-testid="grid-item-react">
                      <CardContent className="p-3">
                        <div className="font-medium text-sm">React Fundamentals</div>
                        <div className="text-xs text-gray-600 mt-1">Instructor: Sarah Chen</div>
                      </CardContent>
                    </Card>
                    <Card className="bg-blue-50 border-blue-200 hover:shadow-sm transition-shadow cursor-pointer" data-testid="grid-item-javascript">
                      <CardContent className="p-3">
                        <div className="font-medium text-sm">Advanced JavaScript</div>
                        <div className="text-xs text-gray-600 mt-1">Instructor: Mike Rodriguez</div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="instructor" className="mt-4">
                <div className="text-sm text-gray-600">Instructor view would show modules grouped by instructor...</div>
              </TabsContent>
            </Tabs>
          </div>
        );

      case 'tabs':
        return (
          <div className="space-y-4" data-testid="tabs-demo">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview" className="text-sm" data-testid="tab-overview">
                  <PlayCircle size={16} className="mr-2" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="content" className="text-sm" data-testid="tab-content">
                  <BookOpen size={16} className="mr-2" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="practice" className="text-sm" data-testid="tab-practice">
                  <CheckCircle size={16} className="mr-2" />
                  Practice
                </TabsTrigger>
                <TabsTrigger value="results" className="text-sm" data-testid="tab-results">
                  <Trophy size={16} className="mr-2" />
                  Results
                </TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="mt-4">
                <Card className="bg-gray-50">
                  <CardContent className="p-4">
                    <h5 className="font-semibold mb-2">Welcome to Component Design</h5>
                    <p className="text-sm text-gray-600 mb-3">
                      Learn how to create engaging, interactive learning experiences that keep students 
                      motivated and improve retention rates.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Lesson 1 of 8 • 12 min read</span>
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
                <div className="text-sm text-gray-600">Content section would contain the main lesson material...</div>
              </TabsContent>
              <TabsContent value="practice" className="mt-4">
                <div className="text-sm text-gray-600">Practice section would contain exercises and activities...</div>
              </TabsContent>
              <TabsContent value="results" className="mt-4">
                <div className="text-sm text-gray-600">Results section would show progress and achievements...</div>
              </TabsContent>
            </Tabs>
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
