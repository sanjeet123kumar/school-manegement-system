import { UserPlus, DollarSign, Calendar, BookOpen, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStudents } from '@/hooks/useStudents';
import { useTeachers } from '@/hooks/useTeachers';
import { useFees } from '@/hooks/useFees';
import { formatDistanceToNow } from 'date-fns';

export function RecentActivity() {
  const { data: students = [] } = useStudents();
  const { data: teachers = [] } = useTeachers();
  const { data: fees = [] } = useFees();

  // Create activity list from recent data
  const activities = [
    ...students.slice(0, 3).map((student) => ({
      id: `student-${student.id}`,
      icon: UserPlus,
      title: 'New student enrolled',
      description: `${student.name} was added to the system`,
      time: formatDistanceToNow(new Date(student.created_at), { addSuffix: true }),
      color: 'bg-primary/10 text-primary',
    })),
    ...teachers.slice(0, 2).map((teacher) => ({
      id: `teacher-${teacher.id}`,
      icon: GraduationCap,
      title: 'Teacher joined',
      description: `${teacher.name} - ${teacher.subject}`,
      time: formatDistanceToNow(new Date(teacher.created_at), { addSuffix: true }),
      color: 'bg-accent/10 text-accent',
    })),
    ...fees.filter(f => f.status === 'Paid').slice(0, 2).map((fee) => ({
      id: `fee-${fee.id}`,
      icon: DollarSign,
      title: 'Fee payment received',
      description: `$${Number(fee.amount).toLocaleString()} from ${fee.student?.name || 'Unknown'}`,
      time: fee.paid_date ? formatDistanceToNow(new Date(fee.paid_date), { addSuffix: true }) : 'Recently',
      color: 'bg-success/10 text-success',
    })),
  ].sort((a, b) => 0).slice(0, 5);

  return (
    <div className="rounded-2xl border bg-card p-6 card-hover">
      <div className="mb-6">
        <h3 className="text-lg font-semibold">Recent Activity</h3>
        <p className="text-sm text-muted-foreground">Latest updates and actions</p>
      </div>
      {activities.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No recent activity. Start by adding students, teachers, or classes.
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="flex items-start gap-4 p-3 rounded-xl transition-colors hover:bg-muted/50 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-xl',
                  activity.color
                )}
              >
                <activity.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{activity.title}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {activity.description}
                </p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {activity.time}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
