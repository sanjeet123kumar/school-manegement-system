import { Users, GraduationCap, School, TrendingUp, Loader2 } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { AttendanceChart } from '@/components/dashboard/AttendanceChart';
import { StudentDistributionChart } from '@/components/dashboard/StudentDistributionChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { useDashboardStats } from '@/hooks/useDashboardStats';

/**
 * Dashboard page - Main overview of the school system
 * 
 * Displays:
 * 1. Key metrics (total students, teachers, classes, attendance rate)
 * 2. Visual charts showing attendance trends and student distribution
 * 3. Recent activity log
 * 4. Financial summary (fees collected vs pending)
 * 
 * The component fetches data via the useDashboardStats hook which automatically
 * handles loading, caching, and error states.
 */
export default function Dashboard() {
  const { data: stats, isLoading } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Welcome back! Here's an overview of your school.
        </p>
      </div>

      {/* Key Metrics Grid - Four stat cards showing main KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents || 0}
          icon={Users}
          color="primary"
          delay={0}
        />
        <StatCard
          title="Total Teachers"
          value={stats?.totalTeachers || 0}
          icon={GraduationCap}
          color="accent"
          delay={100}
        />
        <StatCard
          title="Total Classes"
          value={stats?.totalClasses || 0}
          icon={School}
          color="info"
          delay={200}
        />
        <StatCard
          title="Attendance Rate"
          value={stats?.attendanceRate || 0}
          icon={TrendingUp}
          color="warning"
          suffix="%"
          delay={300}
        />
      </div>

      {/* Charts Row - Visual representations of data trends */}
      <div className="grid gap-6 lg:grid-cols-2">
        <AttendanceChart />
        <StudentDistributionChart />
      </div>

      {/* Activity & Financial Summary - Recent activities and fee stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        <div className="rounded-2xl border bg-card p-6 card-hover">
          <div className="mb-6">
            <h3 className="text-lg font-semibold">Quick Stats</h3>
            <p className="text-sm text-muted-foreground">Financial overview</p>
          </div>
          <div className="space-y-4">
            {/* Green card: Money collected successfully */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-success/10 border border-success/20">
              <span className="text-sm">Fees Collected</span>
              <span className="font-bold text-success">${(stats?.totalCollected || 0).toLocaleString()}</span>
            </div>
            {/* Yellow card: Money still pending */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-warning/10 border border-warning/20">
              <span className="text-sm">Pending Fees</span>
              <span className="font-bold text-warning">${(stats?.totalPending || 0).toLocaleString()}</span>
            </div>
            {/* Blue card: Number of unpaid fee records */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-primary/10 border border-primary/20">
              <span className="text-sm">Pending Records</span>
              <span className="font-bold text-primary">{stats?.pendingFees || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
