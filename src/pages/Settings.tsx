import { useState, useEffect } from 'react';
import { Moon, Sun, Save, School, Mail, Phone, MapPin, Loader2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useSchoolSettings, useUpdateSchoolSettings } from '@/hooks/useSchoolSettings';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function Settings() {
  const { signOut, user } = useAuth();
  const { data: settings, isLoading } = useSchoolSettings();
  const updateSettings = useUpdateSchoolSettings();

  const [isDark, setIsDark] = useState(false);
  const [schoolInfo, setSchoolInfo] = useState({
    school_name: '',
    school_email: '',
    school_phone: '',
    school_address: '',
    school_description: '',
  });

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains('dark');
    setIsDark(isDarkMode);
  }, []);

  useEffect(() => {
    if (settings) {
      setSchoolInfo({
        school_name: settings.school_name || '',
        school_email: settings.school_email || '',
        school_phone: settings.school_phone || '',
        school_address: settings.school_address || '',
        school_description: settings.school_description || '',
      });
    }
  }, [settings]);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    toast({
      title: 'Theme Updated',
      description: `Switched to ${newDark ? 'dark' : 'light'} mode.`,
    });
  };

  const handleSave = async () => {
    if (!settings?.id) return;
    await updateSettings.mutateAsync({
      id: settings.id,
      ...schoolInfo,
    });
  };

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: 'Signed Out',
      description: 'You have been signed out successfully.',
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in max-w-3xl">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your school settings and preferences
        </p>
      </div>

      {/* User Info */}
      <div className="rounded-2xl border bg-card p-6 card-hover">
        <h2 className="text-xl font-semibold mb-4">Account</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">{user?.email}</p>
            <p className="text-sm text-muted-foreground">
              Logged in as administrator
            </p>
          </div>
          <Button variant="destructive" onClick={handleSignOut} className="gap-2">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Appearance */}
      <div className="rounded-2xl border bg-card p-6 card-hover">
        <h2 className="text-xl font-semibold mb-4">Appearance</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
              {isDark ? (
                <Moon className="h-6 w-6" />
              ) : (
                <Sun className="h-6 w-6" />
              )}
            </div>
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">
                Toggle between light and dark theme
              </p>
            </div>
          </div>
          <Switch checked={isDark} onCheckedChange={toggleTheme} />
        </div>
      </div>

      {/* School Information */}
      <div className="rounded-2xl border bg-card p-6 card-hover">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">School Information</h2>
          <Button onClick={handleSave} className="gap-2" disabled={updateSettings.isPending}>
            {updateSettings.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>

        <div className="space-y-6">
          <div className="grid gap-2">
            <Label htmlFor="school-name" className="flex items-center gap-2">
              <School className="h-4 w-4" />
              School Name
            </Label>
            <Input
              id="school-name"
              value={schoolInfo.school_name}
              onChange={(e) =>
                setSchoolInfo({ ...schoolInfo, school_name: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="school-email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="school-email"
                type="email"
                value={schoolInfo.school_email}
                onChange={(e) =>
                  setSchoolInfo({ ...schoolInfo, school_email: e.target.value })
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="school-phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone
              </Label>
              <Input
                id="school-phone"
                value={schoolInfo.school_phone}
                onChange={(e) =>
                  setSchoolInfo({ ...schoolInfo, school_phone: e.target.value })
                }
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="school-address" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Address
            </Label>
            <Input
              id="school-address"
              value={schoolInfo.school_address}
              onChange={(e) =>
                setSchoolInfo({ ...schoolInfo, school_address: e.target.value })
              }
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="school-description">Description</Label>
            <Textarea
              id="school-description"
              value={schoolInfo.school_description}
              onChange={(e) =>
                setSchoolInfo({ ...schoolInfo, school_description: e.target.value })
              }
              rows={4}
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="rounded-2xl border bg-card p-6 card-hover">
        <h2 className="text-xl font-semibold mb-4">Notifications</h2>
        <div className="space-y-4">
          {[
            { label: 'Email Notifications', description: 'Receive email updates about new enrollments' },
            { label: 'Fee Reminders', description: 'Send automatic fee reminders to parents' },
            { label: 'Attendance Alerts', description: 'Alert when students are marked absent' },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div>
                <p className="font-medium">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Switch defaultChecked={index !== 2} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
