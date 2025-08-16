import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ComponentDemo from "@/components/ComponentDemo";
import PricingCalculator from "@/components/PricingCalculator";
import { 
  Mail, 
  Phone, 
  Clock, 
  Shield, 
  Award,
  Star,
  CheckCircle,
  ArrowRight,
  ExternalLink
} from "lucide-react";

export default function Home() {
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    projectType: '',
    components: '',
    projectDetails: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiRequest('POST', '/api/project-requests', {
        name: contactForm.name,
        email: contactForm.email,
        projectType: contactForm.projectType,
        components: contactForm.components.split(',').map(c => c.trim()).filter(Boolean),
        projectDetails: contactForm.projectDetails,
        totalCost: contactForm.projectType === 'Template (£200)' ? '200' : 
                   contactForm.projectType === 'Curated (£300)' ? '300' : '500'
      });

      toast({
        title: "Project Request Submitted!",
        description: "We'll get back to you within 2 hours with next steps.",
        variant: "default"
      });

      setContactForm({
        name: '',
        email: '',
        projectType: '',
        components: '',
        projectDetails: ''
      });
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePricingOrder = (orderData: { tier: string; components: string[]; totalCost: number }) => {
    // Scroll to contact form and pre-fill it
    const contactSection = document.getElementById('contact');
    contactSection?.scrollIntoView({ behavior: 'smooth' });
    
    setContactForm(prev => ({
      ...prev,
      projectType: orderData.tier.charAt(0).toUpperCase() + orderData.tier.slice(1) + ` (£${orderData.totalCost})`,
      components: orderData.components.join(', ')
    }));
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50" data-testid="navigation">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-sf font-bold text-gradient">
                Alex's Learning Platform
              </h1>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <button 
                  onClick={() => scrollToSection('components')}
                  className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                  data-testid="nav-components"
                >
                  Components
                </button>
                <button 
                  onClick={() => scrollToSection('pricing')}
                  className="text-gray-600 hover:text-primary px-3 py-2 text-sm font-medium transition-colors"
                  data-testid="nav-pricing"
                >
                  Pricing
                </button>
                <button 
                  onClick={() => scrollToSection('contact')}
                  className="gradient-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
                  data-testid="nav-get-started"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="gradient-accent text-white" data-testid="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-sf font-bold mb-6 leading-tight">
                Professional Educational Components That Actually Work
              </h1>
              <p className="text-xl mb-8 text-white/90">
                Transform your learning platform with battle-tested interactive components. 
                No more guesswork - see exactly what you're getting with live demos and transparent pricing.
              </p>
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="text-center" data-testid="stat-components">
                  <div className="text-3xl font-bold">200+</div>
                  <div className="text-sm text-white/80">Components Delivered</div>
                </div>
                <div className="text-center" data-testid="stat-delivery">
                  <div className="text-3xl font-bold">48hr</div>
                  <div className="text-sm text-white/80">Average Delivery</div>
                </div>
                <div className="text-center" data-testid="stat-satisfaction">
                  <div className="text-3xl font-bold">100%</div>
                  <div className="text-sm text-white/80">Client Satisfaction</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => scrollToSection('components')}
                  className="bg-white text-primary hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold"
                  data-testid="button-explore-components"
                >
                  Explore Components
                  <ArrowRight className="ml-2" size={16} />
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => scrollToSection('pricing')}
                  className="border-white/30 text-white hover:bg-white/10 px-6 py-3 rounded-lg font-semibold"
                  data-testid="button-view-pricing"
                >
                  View Pricing
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Professional development team collaborating on educational platform" 
                className="rounded-xl shadow-2xl w-full h-auto"
                data-testid="hero-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Component Showcase */}
      <section id="components" className="py-20 bg-white" data-testid="components-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-sf font-bold mb-4">
              Interactive Component Library
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every component includes working demos, complete documentation, and can be customised to match your brand. 
              No black boxes - see exactly what you're getting.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ComponentDemo
              title="Interactive Quiz Component"
              description="Engaging quiz system with instant feedback, progress tracking, and customisable scoring."
              badge="Popular"
              features={[
                "Instant feedback",
                "Progress tracking", 
                "Custom scoring",
                "Mobile responsive"
              ]}
              demoType="quiz"
            />

            <ComponentDemo
              title="Reflection Journal"
              description="Thoughtful reflection space with auto-save, word counting, and guided prompts."
              badge="Flexible"
              features={[
                "Auto-save",
                "Word counting",
                "Guided prompts",
                "Export options"
              ]}
              demoType="reflection"
            />

            <ComponentDemo
              title="Interactive Timeline"
              description="Engaging historical progressions with expandable details and thematic connections."
              badge="Visual"
              features={[
                "Expandable events",
                "Visual connections",
                "Custom themes",
                "Responsive design"
              ]}
              demoType="timeline"
            />

            <ComponentDemo
              title="Comparison Spectrum"
              description="Help learners understand complex choices with visual spectrum comparisons."
              badge="Analytical"
              features={[
                "Visual organization",
                "Hover details",
                "Sample comparisons",
                "Flexible categories"
              ]}
              demoType="comparison"
            />

            <ComponentDemo
              title="Interactive Grid Explorer"
              description="Organize complex content with multiple views, search, and rich hover interactions."
              badge="Versatile"
              features={[
                "Multiple views",
                "Search functionality",
                "Rich metadata",
                "Responsive grids"
              ]}
              demoType="grid"
            />

            <ComponentDemo
              title="Lesson Tab System"
              description="Clean lesson organization with progress tracking and smooth navigation."
              badge="Essential"
              features={[
                "Progress tracking",
                "Smooth transitions",
                "Mobile optimized",
                "Custom styling"
              ]}
              demoType="tabs"
            />
          </div>

          {/* Call to Action */}
          <div className="text-center mt-16">
            <Card className="gradient-primary text-white p-8">
              <CardContent className="p-0">
                <h3 className="text-2xl font-sf font-bold mb-4">Ready to See These Components in Action?</h3>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  Every component comes with complete documentation, customization options, and ongoing support. 
                  No surprises, no hidden costs.
                </p>
                <Button 
                  onClick={() => scrollToSection('pricing')}
                  className="bg-white text-primary hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold"
                  data-testid="button-calculate-cost"
                >
                  Calculate Your Project Cost
                  <ArrowRight className="ml-2" size={16} />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50" data-testid="pricing-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-sf font-bold mb-4">
              Transparent, Self-Service Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No more lengthy consultations or surprise costs. Calculate exactly what your project will cost and place your order immediately.
            </p>
          </div>

          <PricingCalculator onOrderSubmit={handlePricingOrder} />

          {/* Pricing Comparison */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="font-sf text-lg">Why Our Pricing Works</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 text-green-500" size={16} />
                    No hidden consultation fees
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 text-green-500" size={16} />
                    Fixed-price guarantee
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 text-green-500" size={16} />
                    Transparent cost breakdown
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 text-green-500" size={16} />
                    No lengthy discovery calls
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-sf text-lg">What You Get</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 text-green-500" size={16} />
                    Production-ready components
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 text-green-500" size={16} />
                    Complete documentation
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 text-green-500" size={16} />
                    Mobile-responsive design
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="mr-2 text-green-500" size={16} />
                    30-day support included
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="font-sf text-lg">Delivery Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Clock className="mr-2 text-blue-500" size={16} />
                    Template: 24-48 hours
                  </li>
                  <li className="flex items-center">
                    <Clock className="mr-2 text-blue-500" size={16} />
                    Curated: 3-5 business days
                  </li>
                  <li className="flex items-center">
                    <Clock className="mr-2 text-blue-500" size={16} />
                    Custom: 5-10 business days
                  </li>
                  <li className="flex items-center">
                    <Clock className="mr-2 text-blue-500" size={16} />
                    Rush delivery available
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-white" data-testid="contact-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-sf font-bold mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-600">
              Have questions or ready to place an order? Get in touch and we'll have your components delivered within 48 hours.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-sf font-semibold">Start Your Project</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      type="text"
                      value={contactForm.name}
                      onChange={(e) => setContactForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                      data-testid="input-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={contactForm.email}
                      onChange={(e) => setContactForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                      data-testid="input-email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectType">Project Type</Label>
                    <Select 
                      value={contactForm.projectType} 
                      onValueChange={(value) => setContactForm(prev => ({ ...prev, projectType: value }))}
                    >
                      <SelectTrigger data-testid="select-project-type">
                        <SelectValue placeholder="Select project type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Template (£200)">Template (£200)</SelectItem>
                        <SelectItem value="Curated (£300)">Curated (£300)</SelectItem>
                        <SelectItem value="Custom (£500)">Custom (£500)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="components">Required Components</Label>
                    <Textarea
                      id="components"
                      value={contactForm.components}
                      onChange={(e) => setContactForm(prev => ({ ...prev, components: e.target.value }))}
                      placeholder="List the components you need or describe your requirements..."
                      rows={3}
                      data-testid="textarea-components"
                    />
                  </div>
                  <div>
                    <Label htmlFor="projectDetails">Project Details</Label>
                    <Textarea
                      id="projectDetails"
                      value={contactForm.projectDetails}
                      onChange={(e) => setContactForm(prev => ({ ...prev, projectDetails: e.target.value }))}
                      placeholder="Tell us about your learning platform, target audience, and any specific requirements..."
                      rows={4}
                      data-testid="textarea-project-details"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full gradient-primary hover:opacity-90 transition-opacity"
                    data-testid="button-submit-request"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Project Request'}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Contact Info & Social Proof */}
            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-sf font-semibold">Get in Touch</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center" data-testid="contact-email">
                      <Mail className="text-primary mr-3" size={20} />
                      <span>alex@learningplatform.com</span>
                    </div>
                    <div className="flex items-center" data-testid="contact-phone">
                      <Phone className="text-primary mr-3" size={20} />
                      <span>+44 20 7946 0958</span>
                    </div>
                    <div className="flex items-center" data-testid="contact-response-time">
                      <Clock className="text-primary mr-3" size={20} />
                      <span>Response within 2 hours</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <img 
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400" 
                alt="Modern learning interface workspace" 
                className="rounded-xl shadow-lg w-full h-auto"
                data-testid="contact-image"
              />

              <Card className="bg-gray-50">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Star className="text-yellow-500 mr-2" size={20} />
                    Recent Client Feedback
                  </h4>
                  <blockquote className="text-gray-600 italic mb-3">
                    "Alex delivered exactly what we needed in 36 hours. The components work perfectly and the pricing was completely transparent from the start."
                  </blockquote>
                  <cite className="text-sm text-gray-500">— Sarah Chen, Learning Director at TechCorp</cite>
                </CardContent>
              </Card>

              <Card className="bg-success/10 border border-success/20">
                <CardContent className="p-4">
                  <div className="flex items-center">
                    <Shield className="text-success mr-3" size={20} />
                    <div>
                      <div className="font-semibold text-success">100% Satisfaction Guarantee</div>
                      <div className="text-sm text-gray-600">Not happy? Full refund within 7 days.</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-text text-white py-12" data-testid="footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-sf font-bold mb-4">Alex's Learning Platform</h3>
              <p className="text-gray-300 text-sm">
                Professional educational components that help create engaging learning experiences.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Components</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Quiz Systems</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Reflection Journals</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Interactive Timelines</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Comparison Tools</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Template Components</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Curated Solutions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Custom Development</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Ongoing Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li>alex@learningplatform.com</li>
                <li>+44 20 7946 0958</li>
                <li>London, UK</li>
                <li>2-hour response time</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Alex's Learning Platform. All rights reserved. | Built with passion for education.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
