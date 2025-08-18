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
                DataVault Pro
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
            <div className="aspect-video bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-8 flex items-center justify-center relative">
              {/* Simulated Dashboard Preview */}
              <div className="absolute inset-4 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
                {/* Header */}
                <div className="h-12 bg-slate-700 border-b border-slate-600 flex items-center px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="ml-4 text-sm text-slate-300 font-mono">DataVault Pro Dashboard</div>
                </div>

                {/* Content Area */}
                <div className="p-4 space-y-4">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="bg-slate-700 rounded p-2 border border-slate-600">
                      <div className="text-xs text-slate-400">Active Scrapers</div>
                      <div className="text-lg font-bold text-green-400">24</div>
                    </div>
                    <div className="bg-slate-700 rounded p-2 border border-slate-600">
                      <div className="text-xs text-slate-400">Data Extracted</div>
                      <div className="text-lg font-bold text-blue-400">2.4M</div>
                    </div>
                    <div className="bg-slate-700 rounded p-2 border border-slate-600">
                      <div className="text-xs text-slate-400">Success Rate</div>
                      <div className="text-lg font-bold text-purple-400">99.7%</div>
                    </div>
                    <div className="bg-slate-700 rounded p-2 border border-slate-600">
                      <div className="text-xs text-slate-400">Cost Saved</div>
                      <div className="text-lg font-bold text-orange-400">$12K</div>
                    </div>
                  </div>

                  {/* Activity Feed */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-slate-300">Product scraper completed - 1,247 items extracted</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                      <span className="text-slate-300">News monitoring active - 15 new articles found</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <span className="text-slate-300">Price tracking updated - 892 price changes detected</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Try Demo Button */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                <Link href="/demo">
                  <Button variant="gradient" size="sm" className="text-sm">
                    <LucideSparkles className="h-4 w-4 mr-2" />
                    Try Live Demo
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
