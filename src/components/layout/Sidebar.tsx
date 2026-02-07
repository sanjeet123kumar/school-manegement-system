import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  Calendar,
  DollarSign,
  Settings,
  ChevronLeft,
  ChevronRight,
  BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Students', path: '/students' },
  { icon: GraduationCap, label: 'Teachers', path: '/teachers' },
  { icon: School, label: 'Classes', path: '/classes' },
  { icon: Calendar, label: 'Attendance', path: '/attendance' },
  { icon: DollarSign, label: 'Fees', path: '/fees' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar({ isCollapsed, onToggle }: SidebarProps) {
  const location = useLocation();

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen bg-card border-r border-border transition-all duration-300 ease-in-out',
        isCollapsed ? 'w-[70px]' : 'w-[260px]'
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 shadow-glow">
            <BookOpen className="h-5 w-5 text-primary-foreground" />
          </div>
          {!isCollapsed && (
            <span className="font-bold text-lg gradient-text animate-fade-in">
              EduManager
            </span>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className="h-8 w-8 hover:bg-muted"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-col gap-1 p-3 mt-2">
        {menuItems.map((item, index) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;

          const linkContent = (
            <NavLink
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-glow'
                  : 'hover:bg-muted text-muted-foreground hover:text-foreground'
              )}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <Icon
                className={cn(
                  'h-5 w-5 flex-shrink-0 transition-transform duration-200',
                  !isActive && 'group-hover:scale-110'
                )}
              />
              {!isCollapsed && (
                <span className="font-medium text-sm animate-fade-in">
                  {item.label}
                </span>
              )}
            </NavLink>
          );

          if (isCollapsed) {
            return (
              <Tooltip key={item.path} delayDuration={0}>
                <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                <TooltipContent side="right" sideOffset={10}>
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return <div key={item.path}>{linkContent}</div>;
        })}
      </nav>

      {/* Footer */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-4 border border-primary/20">
            <p className="text-xs text-muted-foreground">
              School Management System
            </p>
            <p className="text-xs font-medium mt-1">v1.0.0</p>
          </div>
        </div>
      )}
    </aside>
  );
}
