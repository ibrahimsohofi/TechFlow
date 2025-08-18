import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface PricingTierProps {
  title: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonVariant?: 'default' | 'outline' | 'gradient';
  popular?: boolean;
  className?: string;
}

function PricingTier({
  title,
  price,
  description,
  features,
  buttonText,
  buttonVariant = 'default',
  popular = false,
  className,
}: PricingTierProps) {
  return (
    <Card
      variant={popular ? 'gradient' : 'default'}
      className={cn(
        "flex flex-col relative",
        popular && "border-primary/20",
        className
      )}
    >
      {popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
          Most Popular
        </div>
      )}
      <CardHeader className="pb-8">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="pt-4 text-muted-foreground">{description}</CardDescription>
        <div className="mt-4 flex items-baseline text-foreground">
          <span className="text-4xl font-bold tracking-tight">{price}</span>
          {price !== 'Custom' && <span className="ml-1 text-sm font-medium text-muted-foreground">/month</span>}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="flex-shrink-0 text-primary mt-1">
                <Check className="h-4 w-4" />
              </div>
              <span className="text-sm text-muted-foreground">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="pt-6">
        <Link href="/auth/signup" className="w-full">
          <Button variant={buttonVariant} className="w-full" size="lg">
            {buttonText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

export function Pricing() {
  return (
    <section className="py-16 md:py-24" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, Transparent Pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that fits your needs. All plans include a 14-day free trial with no credit card required.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          <PricingTier
            title="Free"
            price="$0"
            description="Perfect for trying out DataVault Pro for personal projects."
            features={[
              'Up to 1,000 requests/month',
              '1 concurrent scraper',
              'Standard proxies',
              'JSON & CSV exports',
              'Community support',
              '7-day data retention'
            ]}
            buttonText="Start Free"
            buttonVariant="outline"
          />
          <PricingTier
            title="Starter"
            price="$19"
            description="For individuals and small projects requiring reliable data extraction."
            features={[
              'Up to 50,000 requests/month',
              '3 concurrent scrapers',
              'Rotating proxies',
              'All export formats',
              'Email support',
              '30-day data retention',
              'Basic scheduling'
            ]}
            buttonText="Start Trial"
            buttonVariant="default"
          />
          <PricingTier
            title="Pro"
            price="$59"
            description="For professionals and teams with advanced web scraping needs."
            features={[
              'Up to 250,000 requests/month',
              '10 concurrent scrapers',
              'Premium proxies',
              'All export formats',
              'API access',
              'Priority support',
              '90-day data retention',
              'Advanced scheduling',
              'Custom scripts'
            ]}
            buttonText="Start Trial"
            buttonVariant="gradient"
            popular={true}
          />
          <PricingTier
            title="Enterprise"
            price="Custom"
            description="For organizations with high-volume or specialized requirements."
            features={[
              'Unlimited requests',
              'Unlimited concurrent scrapers',
              'Enterprise proxies',
              'CAPTCHA solving',
              'Dedicated infrastructure',
              'Dedicated support manager',
              'Custom data retention',
              'Custom integrations',
              'SLA guarantees'
            ]}
            buttonText="Contact Sales"
            buttonVariant="outline"
          />
        </div>
      </div>
    </section>
  );
}
