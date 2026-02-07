import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface SchoolSettings {
  id: string;
  school_name: string;
  school_email: string | null;
  school_phone: string | null;
  school_address: string | null;
  school_description: string | null;
  created_at: string;
  updated_at: string;
}

export interface SchoolSettingsInput {
  school_name: string;
  school_email?: string;
  school_phone?: string;
  school_address?: string;
  school_description?: string;
}

export function useSchoolSettings() {
  return useQuery({
    queryKey: ['school_settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('school_settings')
        .select('*')
        .limit(1)
        .maybeSingle();
      
      if (error) throw error;
      return data as SchoolSettings | null;
    },
  });
}

export function useUpdateSchoolSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...settings }: SchoolSettingsInput & { id: string }) => {
      const { data, error } = await supabase
        .from('school_settings')
        .update(settings)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['school_settings'] });
      toast({ title: 'Settings Saved', description: 'School information has been updated successfully.' });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });
}
