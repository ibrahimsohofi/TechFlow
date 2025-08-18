import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import {
  LucideCode,
  LucideDatabase,
  LucideCloudLightning,
  LucideLineChart,
  LucideCalendarClock,
  LucideShield,
  LucideSettings,
  LucideHistory,
  LucideMail,
  LucidePhone,
  LucideUsers,
  LucideBuilding,
  LucideMapPin,
  LucideLinkedin,
  LucideTarget,
  LucideFilter
} from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

function FeatureCard({ title, description, icon, className }: FeatureCardProps) {
  return (
    <Card variant="elevated" className={cn("h-full", className)}>
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-primary/10 p-2 rounded-md">
            {icon}
          </div>
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">

      </CardContent>
    </Card>
  );
}

export function Features() {
  return (
    <section className="py-16 md:py-24 bg-muted/30" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Enterprise Data Extraction
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            DataVault Pro combines AI-powered data detection with enterprise-scale automation to extract, process, and transform web data faster than ever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <FeatureCard
            title="AI Email Detection"
            description="Advanced AI automatically finds and extracts email addresses from any website layout."
            icon={<LucideMail className="h-5 w-5 text-blue-500" />}
          />
          <FeatureCard
            title="Contact Information"
            description="Extract phone numbers, addresses, and social profiles with intelligent pattern recognition."
            icon={<LucidePhone className="h-5 w-5 text-green-500" />}
          />
          <FeatureCard
            title="Company Data Mining"
            description="Gather business names, industry info, and organizational details at scale."
            icon={<LucideBuilding className="h-5 w-5 text-purple-500" />}
          />
          <FeatureCard
            title="Lead Qualification"
            description="Smart filtering and scoring to identify your highest-value prospects automatically."
            icon={<LucideTarget className="h-5 w-5 text-orange-500" />}
          />
          <FeatureCard
            title="Mass Prospecting"
            description="Process thousands of websites simultaneously to build massive prospect databases."
            icon={<LucideUsers className="h-5 w-5 text-teal-500" />}
          />
          <FeatureCard
            title="Social Profile Extraction"
            description="Automatically detect and extract LinkedIn, Twitter, and other social media profiles."
            icon={<LucideLinkedin className="h-5 w-5 text-blue-600" />}
          />
          <FeatureCard
            title="CRM Integration"
            description="Export leads directly to your CRM or sales tools with automated data formatting."
            icon={<LucideDatabase className="h-5 w-5 text-indigo-500" />}
          />
          <FeatureCard
            title="GDPR Compliant"
            description="Built-in compliance tools and opt-out mechanisms for responsible lead generation."
            icon={<LucideShield className="h-5 w-5 text-red-500" />}
          />
        </div>
      </div>
    </section>
  );
}
