import { useState } from 'react';
import { Search, Download, Filter, DollarSign, CheckCircle, Clock, AlertCircle, Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useFees, useAddFee, useMarkFeePaid } from '@/hooks/useFees';
import { useStudents } from '@/hooks/useStudents';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const statusConfig = {
  Paid: { icon: CheckCircle, class: 'badge-success', color: 'text-success' },
  Pending: { icon: Clock, class: 'badge-warning', color: 'text-warning' },
  Overdue: { icon: AlertCircle, class: 'badge-destructive', color: 'text-destructive' },
};

export default function Fees() {
  const { data: fees = [], isLoading } = useFees();
  const { data: students = [] } = useStudents();
  const addFee = useAddFee();
  const markFeePaid = useMarkFeePaid();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    student_id: '',
    amount: '',
    due_date: '',
    description: '',
  });

  const filteredRecords = fees.filter((record) => {
    const matchesSearch =
      record.student?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || record.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCollected = fees
    .filter((r) => r.status === 'Paid')
    .reduce((sum, r) => sum + Number(r.amount), 0);
  const totalPending = fees
    .filter((r) => r.status !== 'Paid')
    .reduce((sum, r) => sum + Number(r.amount), 0);

  // Generate chart data
  const chartData = [
    { name: 'Collected', amount: totalCollected, fill: 'hsl(var(--success))' },
    { name: 'Pending', amount: totalPending, fill: 'hsl(var(--warning))' },
  ];

  const handleAddFee = async () => {
    await addFee.mutateAsync({
      student_id: formData.student_id,
      amount: parseFloat(formData.amount),
      due_date: formData.due_date,
      description: formData.description,
    });
    setIsAddDialogOpen(false);
    setFormData({ student_id: '', amount: '', due_date: '', description: '' });
  };

  const handleMarkPaid = async (feeId: string) => {
    await markFeePaid.mutateAsync(feeId);
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
          <h1 className="text-3xl font-bold tracking-tight">Fees</h1>
          <p className="text-muted-foreground mt-1">
            Manage fee collection and payments
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-primary shadow-glow">
            <Plus className="h-4 w-4 mr-2" />
            Add Fee
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card p-6 card-hover">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success">
              <DollarSign className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Collected</p>
              <p className="text-2xl font-bold">${totalCollected.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-6 card-hover">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-warning/10 text-warning">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pending Amount</p>
              <p className="text-2xl font-bold">${totalPending.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border bg-card p-6 card-hover">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Collection Rate</p>
              <p className="text-2xl font-bold">
                {totalCollected + totalPending > 0
                  ? Math.round((totalCollected / (totalCollected + totalPending)) * 100)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="rounded-2xl border bg-card p-6 card-hover">
        <div className="mb-6">
          <h3 className="text-lg font-semibold">Fee Collection Overview</h3>
          <p className="text-sm text-muted-foreground">Collected vs pending</p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '0.75rem',
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`]}
              />
              <Bar dataKey="amount" name="Amount" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by student name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Fee Records Table */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Student</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredRecords.map((record, index) => {
              const StatusIcon = statusConfig[record.status].icon;
              return (
                <TableRow
                  key={record.id}
                  className="table-row-hover animate-fade-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <TableCell className="font-medium">
                    {record.student?.name || 'Unknown'}
                  </TableCell>
                  <TableCell>{record.description || '-'}</TableCell>
                  <TableCell className="font-semibold">
                    ${Number(record.amount).toLocaleString()}
                  </TableCell>
                  <TableCell>{record.due_date}</TableCell>
                  <TableCell>
                    <Badge className={`gap-1 ${statusConfig[record.status].class}`}>
                      <StatusIcon className="h-3 w-3" />
                      {record.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {record.status !== 'Paid' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleMarkPaid(record.id)}
                        disabled={markFeePaid.isPending}
                      >
                        Mark Paid
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        {filteredRecords.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No fee records found. Add a fee record to get started.
          </div>
        )}
      </div>

      {/* Add Fee Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add Fee Record</DialogTitle>
            <DialogDescription>
              Create a new fee record for a student.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="student">Student</Label>
              <Select
                value={formData.student_id}
                onValueChange={(value) => setFormData({ ...formData, student_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map((student) => (
                    <SelectItem key={student.id} value={student.id}>
                      {student.name} - {student.roll_number}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="5000"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="due_date">Due Date</Label>
                <Input
                  id="due_date"
                  type="date"
                  value={formData.due_date}
                  onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tuition Fee - Q1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddFee} disabled={addFee.isPending}>
              {addFee.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Fee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
