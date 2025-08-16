import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LucideDatabase, LucideArrowRight, LucideShield, LucideZap, LucideSparkles } from 'lucide-react';
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid-pattern" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-teal-600/20 blur-[120px] w-full h-full max-w-4xl max-h-4xl rounded-full opacity-30" />
      </div>

      <div className="relative container mx-auto px-4 py-24 md:py-32 lg:py-40">
        <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium backdrop-blur-sm">
            <LucideDatabase className="h-4 w-4" />
            Next-Generation Data Extraction
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-blue-800 bg-clip-text text-transparent">
                TechFlow Pro
              </span>
              <br />
              <span className="text-foreground">
                Powers Modern
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-800 via-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Data Workflows
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Build, deploy, and scale intelligent data extraction pipelines with cutting-edge automation.
              Modern solutions for the next generation of data-driven teams.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <Link href="/auth/signup" className="inline-flex items-center gap-2">
                Start Free Trial
                <LucideArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="backdrop-blur-sm border-primary/20 hover:bg-primary/5">
              <Link href="/documentation">
                View Documentation
              </Link>
            </Button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-4 items-center justify-center pt-8">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50">
              <LucideShield className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium">Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50">
              <LucideZap className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-medium">Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm border border-border/50">
              <LucideDatabase className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium">Scalable Infrastructure</span>
            </div>
          </div>
        </div>

        {/* Demo Preview Card */}
        <div className="mt-16 max-w-5xl mx-auto">
          <Card className="overflow-hidden border border-border/50 bg-card/50 backdrop-blur-sm shadow-2xl">
            <div className="aspect-video bg-gradient-to-br from-muted/20 to-muted/5 p-8 flex items-center justify-center">
              <div className="text-center space-y-4">
                <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10 border border-primary/20 text-primary">
                  <LucideSparkles className="h-5 w-5" />
                  <span className="font-medium">Interactive Demo Coming Soon</span>
                </div>
                <p className="text-muted-foreground max-w-md">
                  Experience the power of DataVault Pro with live data extraction and real-time analytics
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
