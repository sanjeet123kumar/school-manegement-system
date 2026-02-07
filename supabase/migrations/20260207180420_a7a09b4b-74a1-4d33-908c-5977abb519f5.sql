-- Create profiles table for admin users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Create teachers table
CREATE TABLE public.teachers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  subject TEXT NOT NULL,
  phone TEXT,
  experience TEXT,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on teachers
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- Teachers policies (authenticated users only)
CREATE POLICY "Authenticated users can view teachers" ON public.teachers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert teachers" ON public.teachers
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update teachers" ON public.teachers
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete teachers" ON public.teachers
  FOR DELETE TO authenticated USING (true);

-- Create classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  section TEXT NOT NULL,
  room TEXT,
  schedule TEXT,
  class_teacher_id UUID REFERENCES public.teachers(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on classes
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

-- Classes policies
CREATE POLICY "Authenticated users can view classes" ON public.classes
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert classes" ON public.classes
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update classes" ON public.classes
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete classes" ON public.classes
  FOR DELETE TO authenticated USING (true);

-- Create students table
CREATE TABLE public.students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  roll_number TEXT NOT NULL,
  class_id UUID REFERENCES public.classes(id) ON DELETE SET NULL,
  section TEXT NOT NULL,
  guardian_name TEXT,
  guardian_phone TEXT,
  address TEXT,
  avatar TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on students
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;

-- Students policies
CREATE POLICY "Authenticated users can view students" ON public.students
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert students" ON public.students
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update students" ON public.students
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete students" ON public.students
  FOR DELETE TO authenticated USING (true);

-- Create attendance table
CREATE TABLE public.attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL CHECK (status IN ('Present', 'Absent', 'Late')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, attendance_date)
);

-- Enable RLS on attendance
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Attendance policies
CREATE POLICY "Authenticated users can view attendance" ON public.attendance
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert attendance" ON public.attendance
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update attendance" ON public.attendance
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete attendance" ON public.attendance
  FOR DELETE TO authenticated USING (true);

-- Create fees table
CREATE TABLE public.fees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  amount DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Paid', 'Pending', 'Overdue')),
  due_date DATE NOT NULL,
  paid_date DATE,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on fees
ALTER TABLE public.fees ENABLE ROW LEVEL SECURITY;

-- Fees policies
CREATE POLICY "Authenticated users can view fees" ON public.fees
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert fees" ON public.fees
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update fees" ON public.fees
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete fees" ON public.fees
  FOR DELETE TO authenticated USING (true);

-- Create school_settings table (single row)
CREATE TABLE public.school_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_name TEXT NOT NULL DEFAULT 'My School',
  school_email TEXT,
  school_phone TEXT,
  school_address TEXT,
  school_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on school_settings
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;

-- School settings policies
CREATE POLICY "Authenticated users can view school settings" ON public.school_settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert school settings" ON public.school_settings
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update school settings" ON public.school_settings
  FOR UPDATE TO authenticated USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teachers_updated_at
  BEFORE UPDATE ON public.teachers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON public.classes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_students_updated_at
  BEFORE UPDATE ON public.students
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fees_updated_at
  BEFORE UPDATE ON public.fees
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_school_settings_updated_at
  BEFORE UPDATE ON public.school_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for auto profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert default school settings
INSERT INTO public.school_settings (school_name, school_email, school_phone, school_address, school_description)
VALUES ('Springfield Academy', 'info@springfieldacademy.edu', '+1 234-567-8900', '123 Education Lane, Springfield, ST 12345', 'A premier educational institution committed to excellence in learning and character development.');