import { useState } from 'react';
import { Plus, Search, Mail, Phone, Edit, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useTeachers, useAddTeacher, useUpdateTeacher, useDeleteTeacher, Teacher } from '@/hooks/useTeachers';

export default function Teachers() {
  const { data: teachers = [], isLoading } = useTeachers();
  const addTeacher = useAddTeacher();
  const updateTeacher = useUpdateTeacher();
  const deleteTeacher = useDeleteTeacher();

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    experience: '',
  });

  const filteredTeachers = teachers.filter(
    (teacher) =>
      teacher.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      teacher.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddTeacher = async () => {
    await addTeacher.mutateAsync({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      experience: formData.experience,
    });
    setIsAddDialogOpen(false);
    setFormData({ name: '', email: '', phone: '', subject: '', experience: '' });
  };

  const handleEditTeacher = async () => {
    if (!selectedTeacher) return;
    await updateTeacher.mutateAsync({
      id: selectedTeacher.id,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      subject: formData.subject,
      experience: formData.experience,
    });
    setIsEditDialogOpen(false);
    setSelectedTeacher(null);
  };

  const handleDeleteTeacher = async (teacher: Teacher) => {
    await deleteTeacher.mutateAsync(teacher.id);
  };

  const openEditDialog = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      phone: teacher.phone || '',
      subject: teacher.subject,
      experience: teacher.experience || '',
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
          <h1 className="text-3xl font-bold tracking-tight">Teachers</h1>
          <p className="text-muted-foreground mt-1">
            Manage faculty members and staff
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-primary hover:bg-primary/90 shadow-glow"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Teacher
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Teachers Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTeachers.map((teacher, index) => (
          <div
            key={teacher.id}
            className="group relative rounded-2xl border bg-card p-6 card-hover animate-fade-in"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Actions */}
            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => openEditDialog(teacher)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive"
                onClick={() => handleDeleteTeacher(teacher)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Profile */}
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 border-4 border-primary/20 mb-4">
                <AvatarImage src={teacher.avatar || undefined} />
                <AvatarFallback className="text-lg bg-primary/10 text-primary">
                  {teacher.name.split(' ').map((n) => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-semibold">{teacher.name}</h3>
              <p className="text-sm text-primary font-medium">{teacher.subject}</p>
              <Badge className="mt-2 badge-success">Active</Badge>
            </div>

            {/* Info */}
            <div className="mt-6 space-y-3 pt-4 border-t border-border">
              <div className="flex items-center gap-3 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground truncate">{teacher.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">{teacher.phone || '-'}</span>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-center">
              <div className="rounded-lg bg-muted/50 p-2">
                <p className="text-xs text-muted-foreground">Experience</p>
                <p className="font-semibold text-sm">{teacher.experience || '-'}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2">
                <p className="text-xs text-muted-foreground">Joined</p>
                <p className="font-semibold text-sm">{new Date(teacher.created_at).getFullYear()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredTeachers.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No teachers found. Add your first teacher to get started.
        </div>
      )}

      {/* Add Teacher Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Teacher</DialogTitle>
            <DialogDescription>
              Enter the teacher details below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Dr. John Smith"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Mathematics"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="experience">Experience</Label>
                <Input
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  placeholder="10 years"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddTeacher} disabled={addTeacher.isPending}>
              {addTeacher.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Teacher
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Teacher Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Teacher</DialogTitle>
            <DialogDescription>
              Update teacher information.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Full Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Phone</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Subject</Label>
                <Input
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Experience</Label>
                <Input
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTeacher} disabled={updateTeacher.isPending}>
              {updateTeacher.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
