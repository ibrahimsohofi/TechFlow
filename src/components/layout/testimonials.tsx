import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Building, TrendingUp, ShoppingCart, Globe, Zap, Target } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  industry: string;
  metric?: string;
  icon: any;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "DataVault Pro transformed our competitive intelligence. We now monitor 50,000+ product listings daily and reduced our data collection costs by 80%. The ROI was immediate.",
    author: "Sarah Chen",
    role: "VP of Analytics",
    company: "RetailEdge",
    industry: "E-commerce",
    metric: "80% cost reduction",
    icon: ShoppingCart,
  },
  {
    quote:
      "The no-code scraper builder is a game-changer. Our marketing team can now gather market data independently, freeing up 15 hours per week of developer time.",
    author: "Marcus Rodriguez",
    role: "Growth Director",
    company: "ScaleWorks",
    industry: "SaaS",
    metric: "15 hours/week saved",
    icon: TrendingUp,
  },
  {
    quote:
      "We use DataVault Pro to track real estate listings across 25 markets. The data accuracy and real-time updates give us a significant competitive advantage in property investments.",
    author: "Jennifer Liu",
    role: "Data Science Lead",
    company: "PropertyFlow",
    industry: "Real Estate",
    metric: "25 markets monitored",
    icon: Building,
  },
  {
    quote:
      "As a research institution, data integrity is crucial. DataVault Pro's validation and error handling have been exceptional, supporting our academic publications with reliable datasets.",
    author: "Dr. Michael Thompson",
    role: "Research Director",
    company: "TechUniversity",
    industry: "Research",
    metric: "99.7% data accuracy",
    icon: Target,
  },
  {
    quote:
      "The API integration was seamless. We're now processing 2M+ data points monthly and feeding them directly into our ML pipelines. The technical support team is outstanding.",
    author: "Alex Kim",
    role: "Chief Technology Officer",
    company: "DataInsight AI",
    industry: "AI/ML",
    metric: "2M+ data points/month",
    icon: Zap,
  },
  {
    quote:
      "DataVault Pro handles complex JavaScript-heavy sites that other tools couldn't touch. Our lead generation campaigns are now 3x more effective with higher quality data.",
    author: "Emma Watson",
    role: "Marketing Operations",
    company: "LeadGen Pro",
    industry: "Marketing",
    metric: "3x campaign effectiveness",
    icon: Globe,
  },
];

export function Testimonials() {
  return (
    <section className="py-24 bg-gradient-to-br from-background via-muted/20 to-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-sm mb-6">
            <TrendingUp className="h-4 w-4" />
            Customer Success Stories
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-800 bg-clip-text text-transparent">
              Trusted by Data-Driven Teams
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See how companies across industries are transforming their data operations with DataVault Pro
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => {
            const IconComponent = testimonial.icon;

            return (
              <Card
                key={index}
                className={cn(
                  "relative overflow-hidden transition-all duration-300 hover:shadow-lg border-border/50",
                  "group hover:scale-[1.02] hover:border-primary/20"
                )}
              >
                <CardContent className="p-6">
                  {/* Industry Badge & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <Badge variant="secondary" className="text-xs">
                      {testimonial.industry}
                    </Badge>
                    <div className="p-2 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                      <IconComponent className="h-4 w-4 text-primary" />
                    </div>
                  </div>

                  {/* Quote */}
                  <blockquote className="text-sm leading-relaxed text-muted-foreground mb-6">
                    "{testimonial.quote}"
                  </blockquote>

                  {/* Metric Highlight */}
                  {testimonial.metric && (
                    <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-primary/5 to-primary/10 border border-primary/20">
                      <div className="text-sm font-semibold text-primary">
                        Key Result: {testimonial.metric}
                      </div>
                    </div>
                  )}

                  {/* Author Info */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {testimonial.author.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{testimonial.author}</div>
                      <div className="text-xs text-muted-foreground">
                        {testimonial.role} • {testimonial.company}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Trust Indicators */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground mb-8">
            Trusted by 500+ companies worldwide
          </p>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center opacity-60">
            {/* Logo placeholders - replace with actual company logos */}
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">RetailEdge</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">ScaleWorks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">PropertyFlow</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">TechUniversity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">DataInsight</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-muted-foreground">LeadGen Pro</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
