import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, Calendar, User, Phone, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Patient {
  id: string;
  name: string;
  email: string;
  contact_number: string;
  membership: string;
  status: string;
  preferred_date: string;
  preferred_time: string;
  message: string | null;
  created_at: string;
  updated_at: string;
}

const PatientRecords = () => {
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch patients from bookings table
  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Error fetching patients:', error);
      toast({
        title: "Error",
        description: "Failed to load patient records",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getMembershipColor = (membership: string | null): string => {
    switch (membership?.toLowerCase()) {
      case 'green member': return 'bg-green-100 text-green-800';
      case 'gold member': return 'bg-yellow-100 text-yellow-800';
      case 'platinum member': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const openDetail = (patient: Patient) => {
    setSelectedPatient(patient);
    setViewMode('detail');
  };

  const closeDetail = () => {
    setViewMode('list');
    setSelectedPatient(null);
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contact_number.includes(searchTerm) ||
    p.membership.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (viewMode === 'detail' && selectedPatient) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={closeDetail}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <h2 className="font-display text-2xl font-semibold text-foreground">
          Patient Details
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium text-foreground">Personal Info</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                  <p className="font-medium">{selectedPatient.name}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                  <p className="text-sm">{selectedPatient.email}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Contact Number</label>
                  <p className="text-sm">{selectedPatient.contact_number}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Info */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-medium text-foreground">Booking Info</h3>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Preferred Date</label>
                  <p className="text-sm">{formatDate(selectedPatient.preferred_date)}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Preferred Time</label>
                  <p className="text-sm">{selectedPatient.preferred_time}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                  <Badge className={getStatusColor(selectedPatient.status)}>
                    {selectedPatient.status}
                  </Badge>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Membership</label>
                  <Badge className={getMembershipColor(selectedPatient.membership)}>
                    {selectedPatient.membership}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {selectedPatient.message && (
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="font-medium text-foreground mb-2">Message</h3>
              <p className="text-sm text-muted-foreground">{selectedPatient.message}</p>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold text-foreground">Patient Records</h2>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-2 opacity-30" />
              <p className="text-sm">No patient records found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Contact</th>
                    <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Membership</th>
                    <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Last Booking</th>
                    <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPatients.map(patient => (
                    <tr key={patient.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-2">
                        <p className="font-medium">{patient.name}</p>
                        <p className="text-xs text-muted-foreground">{patient.email}</p>
                      </td>
                      <td className="py-4 px-2 text-sm">{patient.contact_number}</td>
                      <td className="py-4 px-2">
                        <Badge className={getMembershipColor(patient.membership)}>
                          {patient.membership}
                        </Badge>
                      </td>
                      <td className="py-4 px-2 text-sm">
                        {formatDate(patient.preferred_date)}
                      </td>
                      <td className="py-4 px-2">
                        <Badge className={getStatusColor(patient.status)}>
                          {patient.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDetail(patient)}
                          className="gap-2"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientRecords;
