import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useStudents } from '@/hooks/useStudents';
import { useClasses } from '@/hooks/useClasses';
import { useAttendance, useSaveAttendance } from '@/hooks/useAttendance';
import { cn } from '@/lib/utils';

interface AttendanceState {
  [key: string]: 'Present' | 'Absent' | 'Late';
}

export default function Attendance() {
  const [date, setDate] = useState<Date>(new Date());
  const [classFilter, setClassFilter] = useState<string>('all');
  
  const { data: students = [], isLoading: loadingStudents } = useStudents();
  const { data: classes = [] } = useClasses();
  const { data: attendanceRecords = [], isLoading: loadingAttendance } = useAttendance(date);
  const saveAttendance = useSaveAttendance();

  // Initialize attendance state from database records
  const [localAttendance, setLocalAttendance] = useState<AttendanceState>({});

  // Merge database records with local state
  const attendance = useMemo(() => {
    const dbAttendance: AttendanceState = {};
    attendanceRecords.forEach(record => {
      dbAttendance[record.student_id] = record.status;
    });
    return { ...dbAttendance, ...localAttendance };
  }, [attendanceRecords, localAttendance]);

  const filteredStudents = students.filter(
    (student) => classFilter === 'all' || student.class_id === classFilter
  );

  const toggleAttendance = (studentId: string) => {
    const currentStatus = attendance[studentId] || 'Absent';
    const newStatus = currentStatus === 'Present' ? 'Absent' : 'Present';
    setLocalAttendance(prev => ({ ...prev, [studentId]: newStatus }));
  };

  const handleSave = async () => {
    const records = filteredStudents.map(student => ({
      student_id: student.id,
      status: attendance[student.id] || ('Absent' as const),
    }));
    await saveAttendance.mutateAsync({ date, records });
    setLocalAttendance({});
  };

  const presentCount = filteredStudents.filter(s => attendance[s.id] === 'Present').length;
  const absentCount = filteredStudents.filter(s => attendance[s.id] !== 'Present').length;
  const attendanceRate = filteredStudents.length > 0 
    ? Math.round((presentCount / filteredStudents.length) * 100) 
    : 0;

  const getClassName = (classId: string | null) => {
    if (!classId) return 'Unassigned';
    const classInfo = classes.find(c => c.id === classId);
    return classInfo ? `${classInfo.name}-${classInfo.section}` : 'Unknown';
  };

  if (loadingStudents || loadingAttendance) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground mt-1">
            Mark and manage daily attendance
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button onClick={handleSave} className="bg-primary shadow-glow" disabled={saveAttendance.isPending}>
            {saveAttendance.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Attendance
          </Button>
        </div>
      </div>

      {/* Filters & Stats */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                'w-full sm:w-[240px] justify-start text-left font-normal',
                !date && 'text-muted-foreground'
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, 'PPP') : 'Pick a date'}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(d) => {
                if (d) {
                  setDate(d);
                  setLocalAttendance({});
                }
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        <Select value={classFilter} onValueChange={setClassFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            {classes.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name} - {c.section}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-4 ml-auto">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-success/10 border border-success/20">
            <span className="text-sm text-muted-foreground">Present:</span>
            <span className="font-bold text-success">{presentCount}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/10 border border-destructive/20">
            <span className="text-sm text-muted-foreground">Absent:</span>
            <span className="font-bold text-destructive">{absentCount}</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20">
            <span className="text-sm text-muted-foreground">Rate:</span>
            <span className="font-bold text-primary">{attendanceRate}%</span>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Student</TableHead>
              <TableHead>Roll No.</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Mark Attendance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student, index) => (
              <TableRow
                key={student.id}
                className="table-row-hover animate-fade-in"
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border-2 border-primary/20">
                      <AvatarImage src={student.avatar || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {student.name.split(' ').map((n) => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {student.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="font-mono">{student.roll_number}</TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    {getClassName(student.class_id)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      attendance[student.id] === 'Present'
                        ? 'badge-success'
                        : 'badge-destructive'
                    }
                  >
                    {attendance[student.id] || 'Absent'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Absent</span>
                    <Switch
                      checked={attendance[student.id] === 'Present'}
                      onCheckedChange={() => toggleAttendance(student.id)}
                      className="data-[state=checked]:bg-success"
                    />
                    <span className="text-sm text-muted-foreground">Present</span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredStudents.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No students found. Add students first to mark attendance.
          </div>
        )}
      </div>
    </div>
  );
}
