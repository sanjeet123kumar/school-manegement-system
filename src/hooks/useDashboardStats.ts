import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format, subDays } from 'date-fns';

/**
 * useDashboardStats - Custom hook to fetch dashboard statistics
 * 
 * Returns key metrics for the dashboard:
 * - Total student, teacher, class counts
 * - Today's attendance rate (percentage of present students)
 * - Fee collection stats (total collected, pending, number of pending records)
 * 
 * This hook uses TanStack Query to:
 * 1. Cache results until the cache is invalidated
 * 2. Handle loading and error states automatically
 * 3. Enable background refetching
 * 4. Provide stale-while-revalidate behavior
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard_stats'],
    queryFn: async () => {
      // Fetch all statistics in parallel for better performance
      const [studentsRes, teachersRes, classesRes, todayAttendanceRes, feesRes] = await Promise.all([
        // Get total student count
        supabase.from('students').select('id', { count: 'exact', head: true }),
        // Get total teacher count
        supabase.from('teachers').select('id', { count: 'exact', head: true }),
        // Get total class count
        supabase.from('classes').select('id', { count: 'exact', head: true }),
        // Get today's attendance records to calculate attendance rate
        supabase.from('attendance').select('status').eq('attendance_date', format(new Date(), 'yyyy-MM-dd')),
        // Get all fees for financial summary
        supabase.from('fees').select('status, amount'),
      ]);

      const totalStudents = studentsRes.count || 0;
      const totalTeachers = teachersRes.count || 0;
      const totalClasses = classesRes.count || 0;

      // Calculate today's attendance rate
      const todayAttendance = todayAttendanceRes.data || [];
      const presentCount = todayAttendance.filter(a => a.status === 'Present').length;
      const attendanceRate = todayAttendance.length > 0 
        ? Math.round((presentCount / todayAttendance.length) * 100) 
        : 0;

      // Calculate fee statistics
      const fees = feesRes.data || [];
      const pendingFees = fees.filter(f => f.status !== 'Paid').length;
      const totalCollected = fees
        .filter(f => f.status === 'Paid')
        .reduce((sum, f) => sum + Number(f.amount), 0);
      const totalPending = fees
        .filter(f => f.status !== 'Paid')
        .reduce((sum, f) => sum + Number(f.amount), 0);

      return {
        totalStudents,
        totalTeachers,
        totalClasses,
        attendanceRate,
        pendingFees,
        totalCollected,
        totalPending,
      };
    },
  });
}

export function useMonthlyAttendance() {
  return useQuery({
    queryKey: ['monthly_attendance'],
    queryFn: async () => {
      // Get last 6 months of attendance data
      const sixMonthsAgo = format(subDays(new Date(), 180), 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('attendance')
        .select('attendance_date, status')
        .gte('attendance_date', sixMonthsAgo);
      
      if (error) throw error;

      // Group by month
      const monthlyData: { [key: string]: { present: number; absent: number } } = {};
      
      (data || []).forEach(record => {
        const month = format(new Date(record.attendance_date), 'MMM');
        if (!monthlyData[month]) {
          monthlyData[month] = { present: 0, absent: 0 };
        }
        if (record.status === 'Present') {
          monthlyData[month].present++;
        } else {
          monthlyData[month].absent++;
        }
      });

      return Object.entries(monthlyData).map(([month, data]) => ({
        month,
        present: data.present,
        absent: data.absent,
      }));
    },
  });
}

export function useStudentDistribution() {
  return useQuery({
    queryKey: ['student_distribution'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select('name, students:students(id)');
      
      if (error) throw error;

      const distribution = (data || []).reduce((acc: { [key: string]: number }, classInfo) => {
        const className = classInfo.name;
        const studentCount = Array.isArray(classInfo.students) ? classInfo.students.length : 0;
        acc[className] = (acc[className] || 0) + studentCount;
        return acc;
      }, {});

      const colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
      
      return Object.entries(distribution).map(([name, students], index) => ({
        name,
        students,
        fill: colors[index % colors.length],
      }));
    },
  });
}
