import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth/context';
import { ThemeProvider } from '@/lib/theme';
import { Toaster } from '@/components/ui/toaster';
import { TutorialProgressProvider } from '@/lib/contexts/tutorial-progress';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DataVault Pro - Enterprise Web Scraping SaaS Platform',
  description: 'Modern web scraping platform with AI-powered automation and real-time analytics',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <ThemeProvider
          defaultTheme="system"
        >
          <AuthProvider>
            <TutorialProgressProvider>
              {children}
              <Toaster />
            </TutorialProgressProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
