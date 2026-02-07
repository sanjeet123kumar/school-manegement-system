import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from '@/components/ui/sheet';

/**
 * Layout component - Main app structure with responsive sidebar
 * 
 * Responsive behavior:
 * - Desktop (>768px): Shows permanent sidebar, collapsible by user
 * - Mobile (<768px): Sidebar becomes a sheet/drawer, triggered by menu button in navbar
 * 
 * The main content area shifts based on sidebar state to avoid overlapping content.
 */
export function Layout() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  /**
   * Check window size and update layout mode.
   * On mobile, sidebar is always "collapsed" by default (shown as sheet instead).
   */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar - visible on larger screens */}
      {!isMobile && (
        <Sidebar
          isCollapsed={isCollapsed}
          onToggle={() => setIsCollapsed(!isCollapsed)}
        />
      )}

      {/* Mobile Sidebar - sheet drawer for smaller screens */}
      {isMobile && (
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetContent side="left" className="p-0 w-[260px]">
            <Sidebar isCollapsed={false} onToggle={() => setMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>
      )}

      {/* Main Content Area */}
      <div
        className={cn(
          'min-h-screen transition-all duration-300',
          // On desktop, shift content left based on sidebar width
          // On mobile, no shift needed since sidebar is a sheet
          !isMobile && (isCollapsed ? 'ml-[70px]' : 'ml-[260px]')
        )}
      >
        <Navbar
          onMenuClick={() => setMobileMenuOpen(true)}
          isMobile={isMobile}
        />
        <main className="p-4 md:p-6 lg:p-8">
          {/* Page content rendered via React Router outlet */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}
