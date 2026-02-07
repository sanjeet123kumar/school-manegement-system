import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Student {
  id: string;
  name: string;
  email: string;
  roll_number: string;
  class_id: string | null;
  section: string;
  guardian_name: string | null;
  guardian_phone: string | null;
  address: string | null;
  avatar: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentInput {
  name: string;
  email: string;
  roll_number: string;
  class_id?: string | null;
  section: string;
  guardian_name?: string;
  guardian_phone?: string;
  address?: string;
  avatar?: string;
}

export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('name');
      
      if (error) throw error;
      return data as Student[];
    },
  });
}

export function useAddStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (student: StudentInput) => {
      const { data, error } = await supabase
        .from('students')
        .insert([{
          ...student,
          avatar: student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name.replace(/\s/g, '')}`,
        }])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({ title: 'Student Added', description: 'Student has been added successfully.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...student }: StudentInput & { id: string }) => {
      const { data, error } = await supabase
        .from('students')
        .update(student)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({ title: 'Student Updated', description: 'Student information has been updated.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['students'] });
      toast({ title: 'Student Deleted', description: 'Student has been removed.', variant: 'destructive' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}
