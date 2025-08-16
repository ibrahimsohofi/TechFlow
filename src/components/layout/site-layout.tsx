import { ReactNode } from 'react';
import { Navbar } from './navbar';
import { Footer } from './footer';

interface SiteLayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

export function SiteLayout({ children, hideFooter = false }: SiteLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pt-16">
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
}
