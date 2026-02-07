// Mock data for the School Management System

export interface Student {
  id: string;
  name: string;
  email: string;
  class: string;
  section: string;
  rollNumber: string;
  gender: 'Male' | 'Female';
  dateOfBirth: string;
  phone: string;
  address: string;
  avatar: string;
  guardianName: string;
  guardianPhone: string;
  admissionDate: string;
  status: 'Active' | 'Inactive';
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  department: string;
  qualification: string;
  experience: string;
  avatar: string;
  joinDate: string;
  status: 'Active' | 'On Leave' | 'Inactive';
}

export interface ClassInfo {
  id: string;
  name: string;
  section: string;
  totalStudents: number;
  classTeacher: string;
  room: string;
  schedule: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  date: string;
  status: 'Present' | 'Absent' | 'Late';
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  feeType: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: 'Paid' | 'Pending' | 'Overdue';
}

// Generate realistic avatars
const generateAvatar = (name: string, gender: 'Male' | 'Female') => {
  const seed = name.replace(/\s/g, '');
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9`;
};

export const students: Student[] = [
  {
    id: '1',
    name: 'Emma Thompson',
    email: 'emma.thompson@school.edu',
    class: '10',
    section: 'A',
    rollNumber: '1001',
    gender: 'Female',
    dateOfBirth: '2008-03-15',
    phone: '+1 234-567-8901',
    address: '123 Maple Street, Springfield',
    avatar: generateAvatar('Emma Thompson', 'Female'),
    guardianName: 'Michael Thompson',
    guardianPhone: '+1 234-567-8902',
    admissionDate: '2020-06-15',
    status: 'Active',
  },
  {
    id: '2',
    name: 'James Wilson',
    email: 'james.wilson@school.edu',
    class: '10',
    section: 'A',
    rollNumber: '1002',
    gender: 'Male',
    dateOfBirth: '2008-07-22',
    phone: '+1 234-567-8903',
    address: '456 Oak Avenue, Springfield',
    avatar: generateAvatar('James Wilson', 'Male'),
    guardianName: 'Sarah Wilson',
    guardianPhone: '+1 234-567-8904',
    admissionDate: '2020-06-15',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Sophia Martinez',
    email: 'sophia.martinez@school.edu',
    class: '10',
    section: 'B',
    rollNumber: '1003',
    gender: 'Female',
    dateOfBirth: '2008-11-08',
    phone: '+1 234-567-8905',
    address: '789 Pine Road, Springfield',
    avatar: generateAvatar('Sophia Martinez', 'Female'),
    guardianName: 'Carlos Martinez',
    guardianPhone: '+1 234-567-8906',
    admissionDate: '2020-06-16',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Liam Johnson',
    email: 'liam.johnson@school.edu',
    class: '9',
    section: 'A',
    rollNumber: '0901',
    gender: 'Male',
    dateOfBirth: '2009-02-14',
    phone: '+1 234-567-8907',
    address: '321 Elm Street, Springfield',
    avatar: generateAvatar('Liam Johnson', 'Male'),
    guardianName: 'David Johnson',
    guardianPhone: '+1 234-567-8908',
    admissionDate: '2021-06-15',
    status: 'Active',
  },
  {
    id: '5',
    name: 'Olivia Brown',
    email: 'olivia.brown@school.edu',
    class: '9',
    section: 'B',
    rollNumber: '0902',
    gender: 'Female',
    dateOfBirth: '2009-05-30',
    phone: '+1 234-567-8909',
    address: '654 Cedar Lane, Springfield',
    avatar: generateAvatar('Olivia Brown', 'Female'),
    guardianName: 'Jennifer Brown',
    guardianPhone: '+1 234-567-8910',
    admissionDate: '2021-06-15',
    status: 'Active',
  },
  {
    id: '6',
    name: 'Noah Davis',
    email: 'noah.davis@school.edu',
    class: '11',
    section: 'A',
    rollNumber: '1101',
    gender: 'Male',
    dateOfBirth: '2007-09-12',
    phone: '+1 234-567-8911',
    address: '987 Birch Way, Springfield',
    avatar: generateAvatar('Noah Davis', 'Male'),
    guardianName: 'Robert Davis',
    guardianPhone: '+1 234-567-8912',
    admissionDate: '2019-06-15',
    status: 'Active',
  },
  {
    id: '7',
    name: 'Ava Garcia',
    email: 'ava.garcia@school.edu',
    class: '11',
    section: 'B',
    rollNumber: '1102',
    gender: 'Female',
    dateOfBirth: '2007-12-25',
    phone: '+1 234-567-8913',
    address: '147 Willow Drive, Springfield',
    avatar: generateAvatar('Ava Garcia', 'Female'),
    guardianName: 'Maria Garcia',
    guardianPhone: '+1 234-567-8914',
    admissionDate: '2019-06-15',
    status: 'Active',
  },
  {
    id: '8',
    name: 'Ethan Miller',
    email: 'ethan.miller@school.edu',
    class: '12',
    section: 'A',
    rollNumber: '1201',
    gender: 'Male',
    dateOfBirth: '2006-04-18',
    phone: '+1 234-567-8915',
    address: '258 Spruce Court, Springfield',
    avatar: generateAvatar('Ethan Miller', 'Male'),
    guardianName: 'Thomas Miller',
    guardianPhone: '+1 234-567-8916',
    admissionDate: '2018-06-15',
    status: 'Active',
  },
];

export const teachers: Teacher[] = [
  {
    id: '1',
    name: 'Dr. Sarah Anderson',
    email: 'sarah.anderson@school.edu',
    phone: '+1 234-567-9001',
    subject: 'Mathematics',
    department: 'Science',
    qualification: 'Ph.D. in Mathematics',
    experience: '12 years',
    avatar: generateAvatar('Sarah Anderson', 'Female'),
    joinDate: '2012-08-01',
    status: 'Active',
  },
  {
    id: '2',
    name: 'Mr. Robert Chen',
    email: 'robert.chen@school.edu',
    phone: '+1 234-567-9002',
    subject: 'Physics',
    department: 'Science',
    qualification: 'M.Sc. in Physics',
    experience: '8 years',
    avatar: generateAvatar('Robert Chen', 'Male'),
    joinDate: '2016-08-01',
    status: 'Active',
  },
  {
    id: '3',
    name: 'Ms. Emily Parker',
    email: 'emily.parker@school.edu',
    phone: '+1 234-567-9003',
    subject: 'English Literature',
    department: 'Humanities',
    qualification: 'M.A. in English',
    experience: '10 years',
    avatar: generateAvatar('Emily Parker', 'Female'),
    joinDate: '2014-08-01',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Mr. David Kim',
    email: 'david.kim@school.edu',
    phone: '+1 234-567-9004',
    subject: 'Chemistry',
    department: 'Science',
    qualification: 'M.Sc. in Chemistry',
    experience: '6 years',
    avatar: generateAvatar('David Kim', 'Male'),
    joinDate: '2018-08-01',
    status: 'Active',
  },
  {
    id: '5',
    name: 'Mrs. Lisa Taylor',
    email: 'lisa.taylor@school.edu',
    phone: '+1 234-567-9005',
    subject: 'History',
    department: 'Humanities',
    qualification: 'M.A. in History',
    experience: '15 years',
    avatar: generateAvatar('Lisa Taylor', 'Female'),
    joinDate: '2009-08-01',
    status: 'On Leave',
  },
  {
    id: '6',
    name: 'Mr. James Wright',
    email: 'james.wright@school.edu',
    phone: '+1 234-567-9006',
    subject: 'Computer Science',
    department: 'Technology',
    qualification: 'M.Tech in CS',
    experience: '7 years',
    avatar: generateAvatar('James Wright', 'Male'),
    joinDate: '2017-08-01',
    status: 'Active',
  },
];

export const classes: ClassInfo[] = [
  {
    id: '1',
    name: 'Grade 9',
    section: 'A',
    totalStudents: 32,
    classTeacher: 'Dr. Sarah Anderson',
    room: 'Room 101',
    schedule: 'Mon-Fri, 8:00 AM - 3:00 PM',
  },
  {
    id: '2',
    name: 'Grade 9',
    section: 'B',
    totalStudents: 30,
    classTeacher: 'Mr. Robert Chen',
    room: 'Room 102',
    schedule: 'Mon-Fri, 8:00 AM - 3:00 PM',
  },
  {
    id: '3',
    name: 'Grade 10',
    section: 'A',
    totalStudents: 28,
    classTeacher: 'Ms. Emily Parker',
    room: 'Room 201',
    schedule: 'Mon-Fri, 8:00 AM - 3:00 PM',
  },
  {
    id: '4',
    name: 'Grade 10',
    section: 'B',
    totalStudents: 31,
    classTeacher: 'Mr. David Kim',
    room: 'Room 202',
    schedule: 'Mon-Fri, 8:00 AM - 3:00 PM',
  },
  {
    id: '5',
    name: 'Grade 11',
    section: 'A',
    totalStudents: 25,
    classTeacher: 'Mrs. Lisa Taylor',
    room: 'Room 301',
    schedule: 'Mon-Fri, 8:00 AM - 3:00 PM',
  },
  {
    id: '6',
    name: 'Grade 11',
    section: 'B',
    totalStudents: 27,
    classTeacher: 'Mr. James Wright',
    room: 'Room 302',
    schedule: 'Mon-Fri, 8:00 AM - 3:00 PM',
  },
  {
    id: '7',
    name: 'Grade 12',
    section: 'A',
    totalStudents: 24,
    classTeacher: 'Dr. Sarah Anderson',
    room: 'Room 401',
    schedule: 'Mon-Fri, 8:00 AM - 3:00 PM',
  },
  {
    id: '8',
    name: 'Grade 12',
    section: 'B',
    totalStudents: 26,
    classTeacher: 'Mr. Robert Chen',
    room: 'Room 402',
    schedule: 'Mon-Fri, 8:00 AM - 3:00 PM',
  },
];

export const attendanceRecords: AttendanceRecord[] = students.flatMap(student => [
  {
    id: `${student.id}-2024-01-15`,
    studentId: student.id,
    studentName: student.name,
    class: `${student.class}-${student.section}`,
    date: '2024-01-15',
    status: Math.random() > 0.1 ? 'Present' : 'Absent',
  },
  {
    id: `${student.id}-2024-01-16`,
    studentId: student.id,
    studentName: student.name,
    class: `${student.class}-${student.section}`,
    date: '2024-01-16',
    status: Math.random() > 0.15 ? 'Present' : Math.random() > 0.5 ? 'Absent' : 'Late',
  },
]);

export const feeRecords: FeeRecord[] = [
  {
    id: '1',
    studentId: '1',
    studentName: 'Emma Thompson',
    class: '10-A',
    feeType: 'Tuition Fee',
    amount: 5000,
    dueDate: '2024-01-15',
    paidDate: '2024-01-10',
    status: 'Paid',
  },
  {
    id: '2',
    studentId: '2',
    studentName: 'James Wilson',
    class: '10-A',
    feeType: 'Tuition Fee',
    amount: 5000,
    dueDate: '2024-01-15',
    status: 'Pending',
  },
  {
    id: '3',
    studentId: '3',
    studentName: 'Sophia Martinez',
    class: '10-B',
    feeType: 'Tuition Fee',
    amount: 5000,
    dueDate: '2024-01-01',
    status: 'Overdue',
  },
  {
    id: '4',
    studentId: '4',
    studentName: 'Liam Johnson',
    class: '9-A',
    feeType: 'Tuition Fee',
    amount: 4500,
    dueDate: '2024-01-15',
    paidDate: '2024-01-12',
    status: 'Paid',
  },
  {
    id: '5',
    studentId: '5',
    studentName: 'Olivia Brown',
    class: '9-B',
    feeType: 'Lab Fee',
    amount: 1000,
    dueDate: '2024-01-20',
    status: 'Pending',
  },
  {
    id: '6',
    studentId: '6',
    studentName: 'Noah Davis',
    class: '11-A',
    feeType: 'Tuition Fee',
    amount: 5500,
    dueDate: '2024-01-15',
    paidDate: '2024-01-14',
    status: 'Paid',
  },
  {
    id: '7',
    studentId: '7',
    studentName: 'Ava Garcia',
    class: '11-B',
    feeType: 'Sports Fee',
    amount: 800,
    dueDate: '2024-01-10',
    status: 'Overdue',
  },
  {
    id: '8',
    studentId: '8',
    studentName: 'Ethan Miller',
    class: '12-A',
    feeType: 'Tuition Fee',
    amount: 6000,
    dueDate: '2024-01-15',
    paidDate: '2024-01-15',
    status: 'Paid',
  },
];

// Dashboard statistics
export const dashboardStats = {
  totalStudents: 856,
  totalTeachers: 48,
  totalClasses: 24,
  attendanceRate: 94.5,
  pendingFees: 15,
  upcomingEvents: 3,
};

// Monthly attendance data for charts
export const monthlyAttendance = [
  { month: 'Jan', present: 92, absent: 8 },
  { month: 'Feb', present: 95, absent: 5 },
  { month: 'Mar', present: 88, absent: 12 },
  { month: 'Apr', present: 94, absent: 6 },
  { month: 'May', present: 96, absent: 4 },
  { month: 'Jun', present: 93, absent: 7 },
];

// Student distribution by class
export const studentDistribution = [
  { name: 'Grade 9', students: 62, fill: 'hsl(var(--chart-1))' },
  { name: 'Grade 10', students: 59, fill: 'hsl(var(--chart-2))' },
  { name: 'Grade 11', students: 52, fill: 'hsl(var(--chart-3))' },
  { name: 'Grade 12', students: 50, fill: 'hsl(var(--chart-4))' },
];

// Fee collection data
export const feeCollection = [
  { month: 'Jan', collected: 125000, pending: 15000 },
  { month: 'Feb', collected: 130000, pending: 12000 },
  { month: 'Mar', collected: 118000, pending: 22000 },
  { month: 'Apr', collected: 135000, pending: 8000 },
  { month: 'May', collected: 128000, pending: 14000 },
  { month: 'Jun', collected: 132000, pending: 10000 },
];
