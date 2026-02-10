import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, CheckCircle, Search, Eye, ArrowLeft, LogOut, Settings, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import AdminAuth, { clearAdminAuth } from '@/components/AdminAuth';
import AdminSettingsDialog from '@/components/AdminSettingsDialog';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Appointment {
  id: string;
  reference_number: string | null;
  full_name: string;
  phone: string;
  email: string;
  service_category: string | null;
  specific_service: string | null;
  preferred_date: string | null;
  preferred_time: string | null;
  condition_description: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

interface MembershipInquiry {
  id: string;
  reference_number: string | null;
  full_name: string;
  phone: string;
  email: string;
  location: string | null;
  reason_for_joining: string | null;
  how_did_you_hear: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

const HCIAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showAdminSettings, setShowAdminSettings] = useState(false);
  
  // Appointments state
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  
  // Membership inquiries state
  const [inquiries, setInquiries] = useState<MembershipInquiry[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<MembershipInquiry | null>(null);

  // Fetch appointments
  const fetchAppointments = async () => {
    setIsLoadingAppointments(true);
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error('Failed to load appointments');
    } finally {
      setIsLoadingAppointments(false);
    }
  };

  // Fetch inquiries
  const fetchInquiries = async () => {
    setIsLoadingInquiries(true);
    try {
      const { data, error } = await supabase
        .from('membership_inquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setInquiries(data || []);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
      toast.error('Failed to load inquiries');
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
    fetchInquiries();
  }, []);

  // Update appointment status
  const updateAppointmentStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success('Appointment status updated');
      fetchAppointments();
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast.error('Failed to update appointment');
    }
  };

  // Update inquiry status
  const updateInquiryStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('membership_inquiries')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      toast.success('Inquiry status updated');
      fetchInquiries();
      setSelectedInquiry(null);
    } catch (error) {
      console.error('Error updating inquiry:', error);
      toast.error('Failed to update inquiry');
    }
  };

  // Dashboard stats
  const totalAppointments = appointments.length;
  const pendingAppointments = appointments.filter(a => a.status === 'pending').length;
  const confirmedAppointments = appointments.filter(a => a.status === 'confirmed').length;
  const totalInquiries = inquiries.length;

  // Filter appointments
  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.reference_number?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || apt.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Filter inquiries
  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = inq.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inq.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      'no-show': 'bg-gray-100 text-gray-800',
      new: 'bg-purple-100 text-purple-800',
      contacted: 'bg-blue-100 text-blue-800',
      converted: 'bg-green-100 text-green-800',
      declined: 'bg-red-100 text-red-800',
    };
    return <Badge className={styles[status] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
  };

  const handleClearAllData = async () => {
    if (!window.confirm('Are you sure you want to delete ALL appointments and membership inquiries? This cannot be undone.')) return;
    try {
      const { data, error } = await supabase.functions.invoke('admin-mutations', {
        body: { action: 'clear_all_data' },
      });
      if (error) throw error;
      toast.success('All data has been cleared');
      fetchAppointments();
      fetchInquiries();
    } catch (error) {
      console.error('Error clearing data:', error);
      toast.error('Failed to clear data');
    }
  };

  const handleLogout = () => {
    clearAdminAuth();
    navigate('/');
  };

  return (
    <AdminAuth>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-card border-b border-border sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <h1 className="font-display text-xl font-bold text-foreground">
                HCI Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setShowAdminSettings(true)}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-card border-b border-border">
          <div className="container mx-auto px-4">
            <div className="flex gap-4 overflow-x-auto">
              {['dashboard', 'appointments', 'inquiries'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setSearchTerm(''); setFilterStatus('all'); }}
                  className={`px-4 py-3 text-sm font-medium capitalize border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab 
                      ? 'border-primary text-primary' 
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="container mx-auto px-4 py-6">
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="flex justify-end">
                <Button variant="destructive" size="sm" onClick={handleClearAllData} className="gap-2">
                  <Trash2 className="h-4 w-4" />
                  Clear All Data
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{totalAppointments}</p>
                        <p className="text-sm text-muted-foreground">Total Appointments</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <Clock className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{pendingAppointments}</p>
                        <p className="text-sm text-muted-foreground">Pending</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{confirmedAppointments}</p>
                        <p className="text-sm text-muted-foreground">Confirmed</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                        <Users className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{totalInquiries}</p>
                        <p className="text-sm text-muted-foreground">Inquiries</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Appointments */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Recent Appointments</CardTitle>
                  <Button variant="outline" size="sm" onClick={() => setActiveTab('appointments')}>
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {appointments.slice(0, 5).map((apt) => (
                      <div key={apt.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div>
                          <p className="font-medium">{apt.full_name}</p>
                          <p className="text-sm text-muted-foreground">{apt.specific_service || apt.service_category}</p>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(apt.status)}
                          <p className="text-xs text-muted-foreground mt-1">{apt.preferred_date}</p>
                        </div>
                      </div>
                    ))}
                    {appointments.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">No appointments yet</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Appointments Tab */}
          {activeTab === 'appointments' && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search appointments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="confirmed">Confirmed</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={fetchAppointments}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Ref #</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Service</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Schedule</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredAppointments.map((apt) => (
                          <tr key={apt.id} className="hover:bg-muted/30">
                            <td className="px-4 py-3 text-sm">{new Date(apt.created_at).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-sm font-mono">{apt.reference_number}</td>
                            <td className="px-4 py-3 text-sm font-medium">{apt.full_name}</td>
                            <td className="px-4 py-3 text-sm">{apt.specific_service || apt.service_category}</td>
                            <td className="px-4 py-3 text-sm">{apt.preferred_date} {apt.preferred_time}</td>
                            <td className="px-4 py-3">{getStatusBadge(apt.status)}</td>
                            <td className="px-4 py-3">
                              <Button variant="ghost" size="sm" onClick={() => setSelectedAppointment(apt)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Inquiries Tab */}
          {activeTab === 'inquiries' && (
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search inquiries..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="new">New</SelectItem>
                    <SelectItem value="contacted">Contacted</SelectItem>
                    <SelectItem value="converted">Converted</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={fetchInquiries}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Date</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Ref #</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Name</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Email</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Location</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Status</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {filteredInquiries.map((inq) => (
                          <tr key={inq.id} className="hover:bg-muted/30">
                            <td className="px-4 py-3 text-sm">{new Date(inq.created_at).toLocaleDateString()}</td>
                            <td className="px-4 py-3 text-sm font-mono">{inq.reference_number}</td>
                            <td className="px-4 py-3 text-sm font-medium">{inq.full_name}</td>
                            <td className="px-4 py-3 text-sm">{inq.email}</td>
                            <td className="px-4 py-3 text-sm">{inq.location || '-'}</td>
                            <td className="px-4 py-3">{getStatusBadge(inq.status)}</td>
                            <td className="px-4 py-3">
                              <Button variant="ghost" size="sm" onClick={() => setSelectedInquiry(inq)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>

        {/* Appointment Details Dialog */}
        <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Appointment Details</DialogTitle>
            </DialogHeader>
            {selectedAppointment && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Reference</p>
                    <p className="font-mono">{selectedAppointment.reference_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    {getStatusBadge(selectedAppointment.status)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedAppointment.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{selectedAppointment.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{selectedAppointment.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Service Category</p>
                    <p>{selectedAppointment.service_category || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Specific Service</p>
                    <p>{selectedAppointment.specific_service || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Preferred Date</p>
                    <p>{selectedAppointment.preferred_date || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Preferred Time</p>
                    <p>{selectedAppointment.preferred_time || '-'}</p>
                  </div>
                  {selectedAppointment.condition_description && (
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Condition Description</p>
                      <p className="text-sm">{selectedAppointment.condition_description}</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {['pending', 'confirmed', 'completed', 'cancelled', 'no-show'].map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={selectedAppointment.status === status ? 'default' : 'outline'}
                        onClick={() => updateAppointmentStatus(selectedAppointment.id, status)}
                        className="capitalize"
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Inquiry Details Dialog */}
        <Dialog open={!!selectedInquiry} onOpenChange={() => setSelectedInquiry(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Inquiry Details</DialogTitle>
            </DialogHeader>
            {selectedInquiry && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Reference</p>
                    <p className="font-mono">{selectedInquiry.reference_number}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    {getStatusBadge(selectedInquiry.status)}
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Name</p>
                    <p className="font-medium">{selectedInquiry.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p>{selectedInquiry.phone}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p>{selectedInquiry.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p>{selectedInquiry.location || '-'}</p>
                  </div>
                  {selectedInquiry.reason_for_joining && (
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">Reason for Joining</p>
                      <p className="text-sm">{selectedInquiry.reason_for_joining}</p>
                    </div>
                  )}
                  {selectedInquiry.how_did_you_hear && (
                    <div className="col-span-2">
                      <p className="text-sm text-muted-foreground">How did you hear about us?</p>
                      <p className="text-sm capitalize">{selectedInquiry.how_did_you_hear}</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Update Status</p>
                  <div className="flex flex-wrap gap-2">
                    {['new', 'contacted', 'converted', 'declined'].map((status) => (
                      <Button
                        key={status}
                        size="sm"
                        variant={selectedInquiry.status === status ? 'default' : 'outline'}
                        onClick={() => updateInquiryStatus(selectedInquiry.id, status)}
                        className="capitalize"
                      >
                        {status}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Admin Settings Dialog */}
        <AdminSettingsDialog open={showAdminSettings} onOpenChange={setShowAdminSettings} />
      </div>
    </AdminAuth>
  );
};

export default HCIAdminDashboard;
