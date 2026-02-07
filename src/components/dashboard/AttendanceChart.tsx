import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { useMonthlyAttendance } from '@/hooks/useDashboardStats';

export function AttendanceChart() {
  const { data: monthlyAttendance = [] } = useMonthlyAttendance();

  // Use data from API or show placeholder data
  const chartData = monthlyAttendance.length > 0 
    ? monthlyAttendance 
    : [
        { month: 'Jan', present: 0, absent: 0 },
        { month: 'Feb', present: 0, absent: 0 },
        { month: 'Mar', present: 0, absent: 0 },
      ];

  return (
    <div className="rounded-2xl border bg-card p-6 card-hover">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Monthly Attendance</h3>
        <p className="text-sm text-muted-foreground">
          Attendance rate over the last 6 months
        </p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barGap={8}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis
              dataKey="month"
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis
              className="text-xs"
              tick={{ fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.75rem',
              }}
            />
            <Legend />
            <Bar
              dataKey="present"
              name="Present"
              fill="hsl(var(--success))"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="absent"
              name="Absent"
              fill="hsl(var(--destructive))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
