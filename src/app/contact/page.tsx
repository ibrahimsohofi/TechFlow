import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, MessageCircle, Phone, MapPin, Clock, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us - DataVault Pro',
  description: 'Get in touch with DataVault Pro. We\'re here to help with any questions or support needs.',
};

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Support',
    description: 'Get help via email',
    contact: 'support@datavaultpro.com',
    response: 'Response within 4 hours',
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'Chat with our support team',
    contact: 'Available 24/7',
    response: 'Instant response',
  },
  {
    icon: Phone,
    title: 'Phone Support',
    description: 'Enterprise customers only',
    contact: '+1 (555) 123-4567',
    response: 'Business hours',
  },
];

const offices = [
  {
    city: 'San Francisco',
    address: '123 Market St, Suite 400\nSan Francisco, CA 94105',
    phone: '+1 (555) 123-4567',
    email: 'sf@datavaultpro.com',
  },
  {
    city: 'New York',
    address: '456 Broadway, Floor 12\nNew York, NY 10013',
    phone: '+1 (555) 987-6543',
    email: 'nyc@datavaultpro.com',
  },
  {
    city: 'London',
    address: '789 Oxford St, Level 5\nLondon W1C 1DX, UK',
    phone: '+44 20 7123 4567',
    email: 'london@datavaultpro.com',
  },
];

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Get in Touch
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions about DataVault Pro? Need help with your scraping projects?
            Our team is here to help you succeed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" placeholder="Doe" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@company.com" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input id="company" placeholder="Your Company" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="inquiry">Inquiry Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select inquiry type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="support">Technical Support</SelectItem>
                    <SelectItem value="sales">Sales Inquiry</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="billing">Billing Question</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us about your project or question..."
                  rows={5}
                />
              </div>

              <Button className="w-full" size="lg">
                Send Message
              </Button>
            </CardContent>
          </Card>

          {/* Contact Methods & Info */}
          <div className="space-y-6">
            {/* Contact Methods */}
            <div>
              <h2 className="text-2xl font-bold mb-6">How to Reach Us</h2>
              <div className="space-y-4">
                {contactMethods.map((method, index) => (
                  <Card key={index}>
                    <CardContent className="flex items-start gap-4 pt-6">
                      <method.icon className="h-6 w-6 text-primary mt-1" />
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{method.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                        <p className="text-sm font-medium">{method.contact}</p>
                        <p className="text-xs text-muted-foreground">{method.response}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Business Hours */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Business Hours
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span>10:00 AM - 2:00 PM PST</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span>Closed</span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-xs text-muted-foreground">
                      *Email and chat support available 24/7
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Need Help Fast?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start" size="sm">
                  📚 Browse Documentation
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  💬 Join Community Discord
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  🎓 View Tutorials
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  ❓ Check FAQ
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Offices */}
        <div>
          <h2 className="text-3xl font-bold text-center mb-8">Our Offices</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {offices.map((office, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <CardTitle>{office.city}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground whitespace-pre-line">
                    {office.address}
                  </p>
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium">{office.phone}</p>
                    <p className="text-sm text-muted-foreground">{office.email}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
