"use client";

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import {
  LucideActivity,
  LucideCode,
  LucideFileSpreadsheet,
  LucideArrowRight,
  LucideLayoutGrid,
  LucidePlus,
  LucideDatabase,
  LucideCheckCircle2,
  LucideAlertCircle,
  LucideTrendingUp,
  LucideZap,
  LucideGlobe,
  LucidePlay,
  LucidePause,
  LucideClock,
  LucideLoader2,
} from 'lucide-react';
import { useAuth } from '@/lib/auth/context';
import { toast } from 'sonner';

interface DashboardStats {
  totalJobs: number;
  runningJobs: number;
  completedJobs: number;
  failedJobs: number;
  pendingJobs: number;
  scheduledJobs: number;
  totalDataPoints: number;
  monthlyUsage: number;
  monthlyLimit: number;
  monthlyDataPoints: number;
  storageUsed: number;
  estimatedCost: number;
  avgExecutionTime: number;
  successRate: number;
}

interface RecentJob {
  id: string;
  name: string;
  description?: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PENDING' | 'SCHEDULED' | 'CANCELLED' | 'PAUSED';
  lastRun: string;
  lastRunAt?: string;
  lastSuccessAt?: string;
  lastFailureAt?: string;
  dataPoints: number;
  schedule?: string;
  url: string;
  errorMessage?: string;
  executionDetails?: {
    status: string;
    duration?: number;
    dataPointsCount?: number;
    errorMessage?: string;
    startedAt: string;
    completedAt?: string;
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentJobs, setRecentJobs] = useState<RecentJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast.error('No authentication token found');
        return;
      }

      const [statsResponse, jobsResponse] = await Promise.all([
        fetch('/api/dashboard/stats', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch('/api/dashboard/recent-jobs', {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      if (!statsResponse.ok || !jobsResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const statsData = await statsResponse.json();
      const jobsData = await jobsResponse.json();

      setStats(statsData.stats);
      setRecentJobs(jobsData.jobs);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return 'text-blue-600';
      case 'COMPLETED':
        return 'text-green-600';
      case 'FAILED':
        return 'text-red-600';
      case 'PENDING':
        return 'text-yellow-600';
      case 'SCHEDULED':
        return 'text-purple-600';
      case 'PAUSED':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return <LucidePlay className="h-3.5 w-3.5" />;
      case 'COMPLETED':
        return <LucideCheckCircle2 className="h-3.5 w-3.5" />;
      case 'FAILED':
        return <LucideAlertCircle className="h-3.5 w-3.5" />;
      case 'PENDING':
        return <LucideClock className="h-3.5 w-3.5" />;
      case 'SCHEDULED':
        return <LucideZap className="h-3.5 w-3.5" />;
      case 'PAUSED':
        return <LucidePause className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <LucideLoader2 className="h-8 w-8 animate-spin" />
          </div>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">Monitor your scraping operations and performance</p>
            </div>
            <Link href="/dashboard/scrapers/new">
              <Button variant="gradient" size="lg">
                <LucidePlus className="h-4 w-4 mr-2" />
                New Scraper
              </Button>
            </Link>
          </div>

          {/* Enterprise System Status */}
          <Card variant="gradient" className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-green-500/20 to-transparent rounded-full blur-2xl" />
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    DataVault Pro Enterprise Infrastructure
                  </CardTitle>
                  <CardDescription>Multi-region distributed scraping cluster status</CardDescription>
                </div>
                <div className="text-xs text-muted-foreground bg-background/50 px-2 py-1 rounded">
                  Organization: {user?.organization?.name}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Plan Status</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Current Plan</span>
                      <span className="font-medium text-primary">{user?.organization?.plan}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span className="font-medium text-green-600">{stats?.successRate || 0}%</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Performance</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Active Jobs</span>
                      <span className="font-medium">{stats?.runningJobs || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Avg Execution Time</span>
                      <span className="font-medium">{stats?.avgExecutionTime || 0}ms</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Usage</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Monthly Requests</span>
                      <span className="font-medium">{stats?.monthlyUsage || 0} / {stats?.monthlyLimit || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Storage Used</span>
                      <span className="font-medium">{((stats?.storageUsed || 0) / (1024 * 1024)).toFixed(1)} MB</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card variant="elevated" className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-full blur-xl" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <LucideCode className="h-4 w-4 text-blue-500" />
                  Total Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalJobs || 0}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <LucideTrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  {stats?.runningJobs || 0} running
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated" className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-full blur-xl" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <LucideDatabase className="h-4 w-4 text-purple-500" />
                  Total Data Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(stats?.totalDataPoints || 0).toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <LucideTrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  All time collected
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated" className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-xl" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <LucideActivity className="h-4 w-4 text-orange-500" />
                  Completed Jobs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.completedJobs || 0}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <LucideCheckCircle2 className="h-3 w-3 mr-1 text-green-500" />
                  {stats?.failedJobs || 0} failed
                </div>
              </CardContent>
            </Card>

            <Card variant="elevated" className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-500/20 to-transparent rounded-full blur-xl" />
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <LucideFileSpreadsheet className="h-4 w-4 text-green-500" />
                  API Usage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {Math.round(((stats?.monthlyUsage || 0) / (stats?.monthlyLimit || 1)) * 100)}%
                </div>
                <div className="w-full bg-muted rounded-full h-1.5 mt-2">
                  <div
                    className="bg-gradient-to-r from-green-500 to-teal-500 h-1.5 rounded-full"
                    style={{ width: `${Math.min(((stats?.monthlyUsage || 0) / (stats?.monthlyLimit || 1)) * 100, 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Additional Enterprise Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card variant="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{(stats?.monthlyUsage || 0).toLocaleString()}</div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats?.successRate || 0}%</div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Estimated Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(stats?.estimatedCost || 0).toFixed(2)}</div>
              </CardContent>
            </Card>

            <Card variant="glass">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg Execution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.avgExecutionTime || 0}ms</div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Jobs */}
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Recent Jobs</CardTitle>
                  <CardDescription>Your most recent scraping jobs and their status</CardDescription>
                </div>
                <Link href="/dashboard/scrapers">
                  <Button variant="ghost" size="sm" className="gap-1 group">
                    View All
                    <LucideArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentJobs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <LucideDatabase className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No jobs created yet. Create your first scraper to get started!</p>
                  </div>
                ) : (
                  recentJobs.map((job) => (
                    <Card key={job.id} variant="glass" className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-md bg-gradient-to-r from-primary/10 to-primary/5">
                            <LucideLayoutGrid className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{job.name}</div>
                            <div className="text-sm text-muted-foreground">{job.url}</div>
                            <div className="flex items-center gap-2 mt-1">
                              <div className={`flex items-center text-sm ${getStatusColor(job.status)}`}>
                                {getStatusIcon(job.status)}
                                <span className="ml-1 capitalize">{job.status.toLowerCase()}</span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Last run: {job.lastRun}
                              </div>
                              {job.dataPoints > 0 && (
                                <div className="text-xs text-muted-foreground">
                                  {job.dataPoints} data points
                                </div>
                              )}
                              {job.errorMessage && (
                                <div className="text-xs text-red-600">
                                  Error: {job.errorMessage}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                        <div>
                          <Link href={`/dashboard/scrapers/${job.id}`}>
                            <Button variant="outline" size="sm">View Details</Button>
                          </Link>
                        </div>
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="gradient" className="flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-orange-500/20 to-transparent rounded-full blur-xl" />
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LucidePlus className="h-5 w-5 text-orange-500" />
                  Create New Scraper
                </CardTitle>
                <CardDescription>Build a new scraper using our no-code builder</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground mb-4">
                  Select elements on any website to extract structured data without writing code.
                </p>
              </CardContent>
              <div className="p-4 pt-0 mt-auto">
                <Link href="/dashboard/scrapers/new">
                  <Button variant="gradient" className="w-full">
                    <LucidePlus className="h-4 w-4 mr-2" />
                    Start Building
                  </Button>
                </Link>
              </div>
            </Card>

            <Card variant="glass" className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LucideFileSpreadsheet className="h-5 w-5 text-blue-500" />
                  Browse Your Data
                </CardTitle>
                <CardDescription>View and download your scraped data</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground mb-4">
                  Access all your scraped data in JSON, CSV, or Excel formats for analysis.
                </p>
              </CardContent>
              <div className="p-4 pt-0 mt-auto">
                <Link href="/dashboard/data">
                  <Button variant="outline" className="w-full">
                    <LucideFileSpreadsheet className="h-4 w-4 mr-2" />
                    View Data
                  </Button>
                </Link>
              </div>
            </Card>

            <Card variant="glass" className="flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LucideCode className="h-5 w-5 text-purple-500" />
                  API Documentation
                </CardTitle>
                <CardDescription>Integrate DataVault Pro with your applications</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground mb-4">
                  Use our RESTful API to programmatically create jobs and access your data.
                </p>
              </CardContent>
              <div className="p-4 pt-0 mt-auto">
                <Link href="/api-reference">
                  <Button variant="outline" className="w-full">
                    <LucideCode className="h-4 w-4 mr-2" />
                    View API Docs
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
