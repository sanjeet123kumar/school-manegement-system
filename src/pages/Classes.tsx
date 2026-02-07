import { useState } from 'react';
import { Users, MapPin, Clock, User, Plus, Edit, Trash2, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useClasses, useAddClass, useUpdateClass, useDeleteClass, ClassInfo } from '@/hooks/useClasses';
import { useTeachers } from '@/hooks/useTeachers';
import { useStudents } from '@/hooks/useStudents';

export default function Classes() {
  const { data: classes = [], isLoading } = useClasses();
  const { data: teachers = [] } = useTeachers();
  const { data: students = [] } = useStudents();
  const addClass = useAddClass();
  const updateClass = useUpdateClass();
  const deleteClass = useDeleteClass();

  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassInfo | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    section: '',
    room: '',
    schedule: '',
    class_teacher_id: '',
  });

  const getStudentCount = (classId: string) => {
    return students.filter(s => s.class_id === classId).length;
  };

  const handleAddClass = async () => {
    await addClass.mutateAsync({
      name: formData.name,
      section: formData.section,
      room: formData.room,
      schedule: formData.schedule,
      class_teacher_id: formData.class_teacher_id || null,
    });
    setIsAddDialogOpen(false);
    setFormData({ name: '', section: '', room: '', schedule: '', class_teacher_id: '' });
  };

  const handleEditClass = async () => {
    if (!editingClass) return;
    await updateClass.mutateAsync({
      id: editingClass.id,
      name: formData.name,
      section: formData.section,
      room: formData.room,
      schedule: formData.schedule,
      class_teacher_id: formData.class_teacher_id || null,
    });
    setIsEditDialogOpen(false);
    setEditingClass(null);
  };

  const handleDeleteClass = async (classInfo: ClassInfo) => {
    await deleteClass.mutateAsync(classInfo.id);
  };

  const openEditDialog = (classInfo: ClassInfo) => {
    setEditingClass(classInfo);
    setFormData({
      name: classInfo.name,
      section: classInfo.section,
      room: classInfo.room || '',
      schedule: classInfo.schedule || '',
      class_teacher_id: classInfo.class_teacher_id || '',
    });
    setIsEditDialogOpen(true);
  };

  if (isLoading) {
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
          <h1 className="text-3xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground mt-1">
            View and manage all class sections
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-primary hover:bg-primary/90 shadow-glow"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Class
        </Button>
      </div>

      {/* Classes Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {classes.map((classInfo, index) => (
          <div
            key={classInfo.id}
            onClick={() => setSelectedClass(classInfo.id)}
            className={`relative group rounded-2xl border bg-card p-6 cursor-pointer transition-all duration-300 card-hover animate-fade-in ${
              selectedClass === classInfo.id
                ? 'ring-2 ring-primary border-primary'
                : ''
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Actions */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  openEditDialog(classInfo);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteClass(classInfo);
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-xl font-bold">{classInfo.name}</h3>
                <Badge variant="secondary" className="mt-1">
                  Section {classInfo.section}
                </Badge>
              </div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-glow">
                <span className="font-bold">{classInfo.section}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Users className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-muted-foreground">Students</p>
                  <p className="font-semibold">{getStudentCount(classInfo.id)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-muted-foreground">Class Teacher</p>
                  <p className="font-semibold truncate">
                    {classInfo.teacher?.name || 'Not assigned'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info/10 text-info">
                  <MapPin className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-muted-foreground">Room</p>
                  <p className="font-semibold">{classInfo.room || '-'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-warning/10 text-warning">
                  <Clock className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-muted-foreground">Schedule</p>
                  <p className="font-semibold text-xs">{classInfo.schedule || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {classes.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No classes found. Add your first class to get started.
        </div>
      )}

      {/* Add Class Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Class</DialogTitle>
            <DialogDescription>
              Create a new class section.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Class Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Grade 10"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="section">Section</Label>
                <Select
                  value={formData.section}
                  onValueChange={(value) => setFormData({ ...formData, section: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Section" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="teacher">Class Teacher</Label>
              <Select
                value={formData.class_teacher_id}
                onValueChange={(value) => setFormData({ ...formData, class_teacher_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name} - {teacher.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="room">Room</Label>
                <Input
                  id="room"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  placeholder="Room 101"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="schedule">Schedule</Label>
                <Input
                  id="schedule"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  placeholder="Mon-Fri, 8AM-3PM"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddClass} disabled={addClass.isPending}>
              {addClass.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Class
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Class Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Class</DialogTitle>
            <DialogDescription>
              Update class information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Class Name</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Section</Label>
                <Select
                  value={formData.section}
                  onValueChange={(value) => setFormData({ ...formData, section: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A">A</SelectItem>
                    <SelectItem value="B">B</SelectItem>
                    <SelectItem value="C">C</SelectItem>
                    <SelectItem value="D">D</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Class Teacher</Label>
              <Select
                value={formData.class_teacher_id}
                onValueChange={(value) => setFormData({ ...formData, class_teacher_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select teacher" />
                </SelectTrigger>
                <SelectContent>
                  {teachers.map((teacher) => (
                    <SelectItem key={teacher.id} value={teacher.id}>
                      {teacher.name} - {teacher.subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Room</Label>
                <Input
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Schedule</Label>
                <Input
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditClass} disabled={updateClass.isPending}>
              {updateClass.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
