import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { format } from 'date-fns';

export interface AttendanceRecord {
  id: string;
  student_id: string;
  attendance_date: string;
  status: 'Present' | 'Absent' | 'Late';
  created_at: string;
}

export function useAttendance(date: Date) {
  const dateStr = format(date, 'yyyy-MM-dd');
  
  return useQuery({
    queryKey: ['attendance', dateStr],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('attendance_date', dateStr);
      
      if (error) throw error;
      return data as AttendanceRecord[];
    },
  });
}

export function useSaveAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      date, 
      records 
    }: { 
      date: Date; 
      records: { student_id: string; status: 'Present' | 'Absent' | 'Late' }[] 
    }) => {
      const dateStr = format(date, 'yyyy-MM-dd');
      
      // Upsert attendance records
      const { error } = await supabase
        .from('attendance')
        .upsert(
          records.map(r => ({
            student_id: r.student_id,
            attendance_date: dateStr,
            status: r.status,
          })),
          { onConflict: 'student_id,attendance_date' }
        );
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['attendance', format(variables.date, 'yyyy-MM-dd')] });
      toast({ title: 'Attendance Saved', description: `Attendance for ${format(variables.date, 'PPP')} has been saved.` });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}
