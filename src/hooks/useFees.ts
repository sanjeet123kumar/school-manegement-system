import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface FeeRecord {
  id: string;
  student_id: string;
  amount: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  due_date: string;
  paid_date: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  student?: {
    id: string;
    name: string;
    section: string;
  } | null;
}

export interface FeeInput {
  student_id: string;
  amount: number;
  status?: 'Paid' | 'Pending' | 'Overdue';
  due_date: string;
  paid_date?: string | null;
  description?: string;
}

export function useFees() {
  return useQuery({
    queryKey: ['fees'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fees')
        .select(`
          *,
          student:students(id, name, section)
        `)
        .order('due_date', { ascending: false });
      
      if (error) throw error;
      return data as FeeRecord[];
    },
  });
}

export function useAddFee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fee: FeeInput) => {
      const { data, error } = await supabase
        .from('fees')
        .insert([fee])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      toast({ title: 'Fee Added', description: 'Fee record has been added successfully.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useUpdateFee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...fee }: FeeInput & { id: string }) => {
      const { data, error } = await supabase
        .from('fees')
        .update(fee)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      toast({ title: 'Fee Updated', description: 'Fee record has been updated.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}

export function useMarkFeePaid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await supabase
        .from('fees')
        .update({ 
          status: 'Paid' as const, 
          paid_date: new Date().toISOString().split('T')[0] 
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fees'] });
      toast({ title: 'Payment Recorded', description: 'Fee has been marked as paid.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}
