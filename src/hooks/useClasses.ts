import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface ClassInfo {
  id: string;
  name: string;
  section: string;
  room: string | null;
  schedule: string | null;
  class_teacher_id: string | null;
  created_at: string;
  updated_at: string;
  teacher?: {
    id: string;
    name: string;
  } | null;
}

export interface ClassInput {
  name: string;
  section: string;
  room?: string;
  schedule?: string;
  class_teacher_id?: string | null;
}

export function useClasses() {
  return useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classes')
        .select(`
          *,
          teacher:teachers(id, name)
        `)
        .order('name');
      
      if (error) throw error;
      return data as ClassInfo[];
    },
  });
}

export function useAddClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (classInfo: ClassInput) => {
      const { data, error } = await supabase
        .from('classes')
        .insert([classInfo])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast({ title: 'Class Added', description: 'Class has been added successfully.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...classInfo }: ClassInput & { id: string }) => {
      const { data, error } = await supabase
        .from('classes')
        .update(classInfo)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast({ title: 'Class Updated', description: 'Class information has been updated.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useDeleteClass() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('classes')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['classes'] });
      toast({ title: 'Class Deleted', description: 'Class has been removed.', variant: 'destructive' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}
