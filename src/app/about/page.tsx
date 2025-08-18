import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, Users, Globe, Zap, Heart, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us - DataVault Pro',
  description: 'Learn about DataVault Pro\'s mission to democratize web data extraction and our team of passionate developers.',
};

const teamMembers = [
  {
    name: 'Sarah Chen',
    role: 'CEO & Co-Founder',
    bio: 'Former Google engineer with 10+ years in distributed systems and data infrastructure.',
    image: '/team/sarah.jpg',
  },
  {
    name: 'David Rodriguez',
    role: 'CTO & Co-Founder',
    bio: 'Ex-Facebook architect specializing in large-scale web crawling and machine learning.',
    image: '/team/david.jpg',
  },
  {
    name: 'Emily Johnson',
    role: 'VP of Engineering',
    bio: 'Former Amazon principal engineer with expertise in cloud architecture and security.',
    image: '/team/emily.jpg',
  },
  {
    name: 'Michael Kim',
    role: 'Head of Product',
    bio: 'Product leader from Stripe with deep experience in developer tools and APIs.',
    image: '/team/michael.jpg',
  },
];

const values = [
  {
    icon: Heart,
    title: 'User-Centric',
    description: 'Every decision we make starts with understanding our users\' needs and challenges.',
  },
  {
    icon: Shield,
    title: 'Privacy & Ethics',
    description: 'We\'re committed to responsible data extraction and protecting user privacy.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'We continuously push the boundaries of what\'s possible in web data extraction.',
  },
  {
    icon: Globe,
    title: 'Accessibility',
    description: 'Making powerful data extraction tools accessible to developers of all skill levels.',
  },
];

const milestones = [
  { year: '2021', event: 'DataVault Pro founded by Sarah and David' },
  { year: '2022', event: 'Launched beta with 100 early users' },
  { year: '2022', event: 'Raised $2M seed round' },
  { year: '2023', event: 'Reached 10,000+ active users' },
  { year: '2023', event: 'Launched AI-powered selector generation' },
  { year: '2024', event: 'Processing 100M+ requests monthly' },
];

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Democratizing Web Data Extraction
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
            We believe that access to web data shouldn't be limited by technical complexity or infrastructure costs.
            DataVault Pro makes it possible for anyone to extract structured data from the web with enterprise-grade
            reliability and simplicity.
          </p>
          <div className="flex justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              50,000+ Users
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              180+ Countries
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4" />
              99.9% Uptime
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card>
            <CardHeader>
              <Target className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To democratize access to web data by providing simple, powerful, and ethical tools that enable
                businesses and developers to extract insights from the web without technical barriers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Globe className="h-8 w-8 text-primary mb-2" />
              <CardTitle>Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                A world where web data is as accessible as traditional databases, enabling innovation and
                insights that drive progress across industries while maintaining the highest standards of
                privacy and ethics.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <value.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-20 h-20 mx-auto mb-4 bg-muted rounded-full flex items-center justify-center">
                    <Users className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <CardTitle className="text-lg">{member.name}</CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    {member.role}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Company Timeline */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Journey</h2>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">{milestone.year}</span>
                  </div>
                  <div className="flex-1 pt-3">
                    <p className="text-muted-foreground">{milestone.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <Card className="text-center">
          <CardHeader>
            <CardTitle>DataVault Pro by the Numbers</CardTitle>
            <CardDescription>Our impact on the web scraping community</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <div className="text-3xl font-bold text-primary mb-1">50K+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">100M+</div>
                <div className="text-sm text-muted-foreground">Requests/Month</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">99.9%</div>
                <div className="text-sm text-muted-foreground">Uptime</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Support</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
