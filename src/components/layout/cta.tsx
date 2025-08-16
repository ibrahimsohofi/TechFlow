import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Link from 'next/link';
import { LucideSparkles, LucideZap, LucideShield } from 'lucide-react';

export function CTA() {
  return (
    <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
      <div className="container mx-auto px-4">
        <Card variant="premium" className="p-8 md:p-12 lg:p-16 text-center max-w-5xl mx-auto relative overflow-hidden">
          {/* Enhanced background effects */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-gradient-to-r from-teal-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
          </div>

          <div className="relative mx-auto max-w-2xl">
            <div className="flex justify-center mb-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                <LucideSparkles className="h-4 w-4 text-blue-400" />
                <span className="text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Enterprise Ready
                </span>
              </div>
            </div>

            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl mb-6">
              <span className="bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent">
                Ready to transform your data into
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 bg-clip-text text-transparent">
                competitive intelligence?
              </span>
            </h2>

            <p className="mt-6 text-lg text-gray-300 leading-relaxed">
              Join thousands of businesses that use DataVault Pro to extract insights, monitor competitors, and make data-driven decisions with enterprise-grade security.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
              <Link href="/auth/signup">
                <Button variant="gradient" size="xl" className="min-w-[200px]">
                  <LucideZap className="h-5 w-5 mr-2" />
                  Start Your Free Trial
                </Button>
              </Link>
              <Link href="/demo">
                <Button variant="glass" size="xl" className="min-w-[200px]">
                  <LucideShield className="h-5 w-5 mr-2" />
                  Schedule a Demo
                </Button>
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-green-400 rounded-full animate-pulse" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-blue-400 rounded-full animate-pulse delay-500" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 bg-purple-400 rounded-full animate-pulse delay-1000" />
                <span>Enterprise support</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
