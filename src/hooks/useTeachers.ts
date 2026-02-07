import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  phone: string | null;
  experience: string | null;
  avatar: string | null;
  created_at: string;
  updated_at: string;
}

export interface TeacherInput {
  name: string;
  email: string;
  subject: string;
  phone?: string;
  experience?: string;
  avatar?: string;
}

export function useTeachers() {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Teacher[];
    },
  });
}

export function useAddTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (teacher: TeacherInput) => {
      const { data, error } = await supabase
        .from('teachers')
        .insert([{
          ...teacher,
          avatar: teacher.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.name.replace(/\s/g, '')}`,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast({ title: 'Teacher Added', description: 'Teacher has been added successfully.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...teacher }: TeacherInput & { id: string }) => {
      const { data, error } = await supabase
        .from('teachers')
        .update(teacher)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast({ title: 'Teacher Updated', description: 'Teacher information has been updated.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteTeacher() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('teachers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teachers'] });
      toast({ title: 'Teacher Deleted', description: 'Teacher has been removed.', variant: 'destructive' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}
