import React, { useState, useEffect } from 'react';
import { Search, Download, Eye, User, ArrowLeft, Loader2, Plus, Edit2, Save, X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';
import AddPatientDialog from '@/components/AddPatientDialog';

interface MedicalRecord {
  id: string;
  date: string;
  notes: string;
}

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
  date_of_birth: string | null;
  age: number | null;
  gender: string | null;
  emergency_contact: string | null;
  membership_join_date: string | null;
  membership_expiry_date: string | null;
  membership_status: string | null;
  medical_records: MedicalRecord[];
  is_member: boolean;
}

const PatientRecords = () => {
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPatient, setEditedPatient] = useState<Patient | null>(null);
  const [newMedicalNote, setNewMedicalNote] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      // Fetch patient records
      const { data: patientData, error: patientError } = await supabase
        .from('patient_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (patientError) throw patientError;

      // Fetch all active members to check membership by email
      const { data: membersData, error: membersError } = await supabase
        .from('members')
        .select('email, membership_type, membership_expiry_date, status')
        .eq('status', 'active');

      if (membersError) throw membersError;

      // Create a map of member emails for quick lookup
      const memberEmailMap = new Map(
        (membersData || []).map(m => [m.email.toLowerCase().trim(), m])
      );
      
      const patientRecords: Patient[] = (patientData || []).map(record => {
        // Check if this patient has a matching active member
        const matchedMember = memberEmailMap.get(record.email.toLowerCase().trim());
        const isMember = !!matchedMember;
        
        return {
          id: record.id,
          name: record.name,
          email: record.email,
          contact_number: record.contact_number || '',
          membership: isMember ? matchedMember.membership_type : record.membership || '',
          status: 'active',
          preferred_date: record.preferred_date || '',
          preferred_time: record.preferred_time || '',
          message: record.message,
          created_at: record.created_at,
          updated_at: record.updated_at,
          date_of_birth: record.date_of_birth,
          age: record.age,
          gender: record.gender,
          emergency_contact: record.emergency_contact,
          membership_join_date: record.membership_join_date,
          membership_expiry_date: isMember ? matchedMember.membership_expiry_date : record.membership_expiry_date,
          membership_status: isMember ? 'active' : record.membership_status,
          medical_records: Array.isArray(record.medical_records) 
            ? (record.medical_records as unknown as MedicalRecord[]) 
            : [],
          is_member: isMember,
        };
      });
      
      setPatients(patientRecords);
    } catch (error) {
      console.error('Error fetching patients:', error);
      setPatients([]);
      toast({
        title: "Error",
        description: "Failed to load patient records",
        variant: "destructive",
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

  const formatShortDate = (dateString: string | null): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const calculateDaysLeft = (expiryDate: string | null): string => {
    if (!expiryDate) return '';
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `${diffDays} Days` : 'Expired';
  };

  const getMembershipColor = (membership: string | null): string => {
    switch (membership?.toLowerCase()) {
      case 'green': 
      case 'green member': return 'bg-green-100 text-green-800';
      case 'gold': 
      case 'gold member': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': 
      case 'platinum member': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const openDetail = (patient: Patient) => {
    setSelectedPatient(patient);
    setEditedPatient({ ...patient });
    setViewMode('detail');
    setIsEditing(false);
  };

  const closeDetail = () => {
    setViewMode('list');
    setSelectedPatient(null);
    setEditedPatient(null);
    setIsEditing(false);
    setNewMedicalNote('');
  };

  const handleEditToggle = () => {
    if (isEditing) {
      setEditedPatient(selectedPatient ? { ...selectedPatient } : null);
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: keyof Patient, value: string | number | null) => {
    if (editedPatient) {
      setEditedPatient({ ...editedPatient, [field]: value });
    }
  };

  const handleSave = async () => {
    if (!editedPatient) return;
    
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('patient_records')
        .update({
          name: editedPatient.name,
          email: editedPatient.email,
          contact_number: editedPatient.contact_number || null,
          date_of_birth: editedPatient.date_of_birth || null,
          age: editedPatient.age || null,
          gender: editedPatient.gender || null,
          emergency_contact: editedPatient.emergency_contact || null,
          membership: editedPatient.membership || null,
          membership_join_date: editedPatient.membership_join_date || null,
          membership_expiry_date: editedPatient.membership_expiry_date || null,
          membership_status: editedPatient.membership_status || null,
          medical_records: editedPatient.medical_records as unknown as Json,
          updated_at: new Date().toISOString(),
        })
        .eq('id', editedPatient.id);

      if (error) throw error;

      setSelectedPatient(editedPatient);
      setIsEditing(false);
      fetchPatients();
      
      toast({
        title: "Success",
        description: "Patient record updated successfully",
      });
    } catch (error) {
      console.error('Error updating patient:', error);
      toast({
        title: "Error",
        description: "Failed to update patient record",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddMedicalRecord = async () => {
    if (!editedPatient || !newMedicalNote.trim()) {
      console.log('Cannot add medical record - missing data:', { editedPatient: !!editedPatient, note: newMedicalNote });
      return;
    }

    const newRecord: MedicalRecord = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      notes: newMedicalNote.trim(),
    };

    const updatedMedicalRecords = [...editedPatient.medical_records, newRecord];
    
    console.log('Saving medical record:', { patientId: editedPatient.id, newRecord, updatedMedicalRecords });
    
    setIsSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-mutations', {
        body: {
          action: 'append_medical_record',
          patientId: editedPatient.id,
          record: newRecord,
        },
      });

      if (error) {
        console.error('Function error saving medical record:', error);
        throw error;
      }

      console.log('Medical record saved successfully:', data);

      const updatedPatient = { ...editedPatient, medical_records: updatedMedicalRecords };
      setEditedPatient(updatedPatient);
      setSelectedPatient(updatedPatient);
      setNewMedicalNote('');
      fetchPatients();
      
      toast({
        title: "Success",
        description: "Medical record added successfully",
      });
    } catch (error) {
      console.error('Error adding medical record:', error);
      toast({
        title: "Error",
        description: "Failed to add medical record",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeletePatient = async () => {
    if (!selectedPatient) return;
    
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('patient_records')
        .delete()
        .eq('id', selectedPatient.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Patient record deleted successfully",
      });
      
      closeDetail();
      fetchPatients();
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast({
        title: "Error",
        description: "Failed to delete patient record",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.contact_number || '').includes(searchTerm) ||
    (p.membership || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (viewMode === 'detail' && selectedPatient && editedPatient) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={closeDetail}
            className="gap-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleEditToggle}
                  className="gap-2"
                  disabled={isSaving}
                >
                  <X className="h-4 w-4" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="gap-2"
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                  Save
                </Button>
              </>
            ) : (
              <>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="gap-2"
                      disabled={isDeleting}
                    >
                      {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Patient Record</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete the record for <strong>{selectedPatient.name}</strong>? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeletePatient} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <Button
                  variant="outline"
                  onClick={handleEditToggle}
                  className="gap-2"
                >
                  <Edit2 className="h-4 w-4" />
                  Edit
                </Button>
              </>
            )}
          </div>
        </div>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardContent className="p-6">
            <h2 className="font-display text-xl font-semibold text-center mb-6 border-b pb-4">
              Full Record
            </h2>

            {/* Personal Info & Contacts Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Personal Info */}
              <div className="border-r-0 md:border-r border-border/50 pr-0 md:pr-6">
                <h3 className="font-medium text-foreground mb-4 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Info
                </h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">Name:</span>
                    <span className="text-sm col-span-2">
                      {isEditing ? (
                        <Input
                          value={editedPatient.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="h-8"
                        />
                      ) : (
                        editedPatient.name
                      )}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">Date of Birth:</span>
                    <span className="text-sm col-span-2">
                      {isEditing ? (
                        <Input
                          type="date"
                          value={editedPatient.date_of_birth || ''}
                          onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                          className="h-8"
                        />
                      ) : (
                        editedPatient.date_of_birth ? formatDate(editedPatient.date_of_birth) : ''
                      )}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">Age:</span>
                    <span className="text-sm col-span-2">
                      {isEditing ? (
                        <Input
                          type="number"
                          value={editedPatient.age || ''}
                          onChange={(e) => handleInputChange('age', e.target.value ? parseInt(e.target.value) : null)}
                          className="h-8"
                        />
                      ) : (
                        editedPatient.age || ''
                      )}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">Gender:</span>
                    <span className="text-sm col-span-2">
                      {isEditing ? (
                        <Input
                          value={editedPatient.gender || ''}
                          onChange={(e) => handleInputChange('gender', e.target.value)}
                          placeholder="Male / Female"
                          className="h-8"
                        />
                      ) : (
                        editedPatient.gender || ''
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contacts */}
              <div>
                <h3 className="font-medium text-foreground mb-4">Contacts</h3>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">Mobile No.:</span>
                    <span className="text-sm col-span-2">
                      {isEditing ? (
                        <Input
                          value={editedPatient.contact_number}
                          onChange={(e) => handleInputChange('contact_number', e.target.value)}
                          className="h-8"
                        />
                      ) : (
                        editedPatient.contact_number || ''
                      )}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">Email:</span>
                    <span className="text-sm col-span-2">
                      {isEditing ? (
                        <Input
                          type="email"
                          value={editedPatient.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="h-8"
                        />
                      ) : (
                        editedPatient.email
                      )}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <span className="text-sm text-muted-foreground">Emergency Contact:</span>
                    <span className="text-sm col-span-2">
                      {isEditing ? (
                        <Input
                          value={editedPatient.emergency_contact || ''}
                          onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                          className="h-8"
                        />
                      ) : (
                        editedPatient.emergency_contact || ''
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Membership Section */}
            <div className="mb-6">
              <h3 className="font-medium text-foreground mb-4 text-center">Membership</h3>
              {editedPatient.is_member && editedPatient.membership ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-center py-2 px-3 font-medium text-muted-foreground">Membership</th>
                        <th className="text-center py-2 px-3 font-medium text-muted-foreground">Join Date</th>
                        <th className="text-center py-2 px-3 font-medium text-muted-foreground">Expiration</th>
                        <th className="text-center py-2 px-3 font-medium text-muted-foreground">Days Left</th>
                        <th className="text-center py-2 px-3 font-medium text-muted-foreground">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-center py-3 px-3">
                          {isEditing ? (
                            <Input
                              value={editedPatient.membership || ''}
                              onChange={(e) => handleInputChange('membership', e.target.value)}
                              className="h-8 text-center"
                            />
                          ) : (
                            <Badge className={getMembershipColor(editedPatient.membership)}>
                              {editedPatient.membership}
                            </Badge>
                          )}
                        </td>
                        <td className="text-center py-3 px-3">
                          {isEditing ? (
                            <Input
                              type="date"
                              value={editedPatient.membership_join_date?.split('T')[0] || ''}
                              onChange={(e) => handleInputChange('membership_join_date', e.target.value)}
                              className="h-8"
                            />
                          ) : (
                            formatShortDate(editedPatient.membership_join_date)
                          )}
                        </td>
                        <td className="text-center py-3 px-3">
                          {isEditing ? (
                            <Input
                              type="date"
                              value={editedPatient.membership_expiry_date?.split('T')[0] || ''}
                              onChange={(e) => handleInputChange('membership_expiry_date', e.target.value)}
                              className="h-8"
                            />
                          ) : (
                            formatShortDate(editedPatient.membership_expiry_date)
                          )}
                        </td>
                        <td className="text-center py-3 px-3">
                          {calculateDaysLeft(editedPatient.membership_expiry_date)}
                        </td>
                        <td className="text-center py-3 px-3">
                          {isEditing ? (
                            <Input
                              value={editedPatient.membership_status || ''}
                              onChange={(e) => handleInputChange('membership_status', e.target.value)}
                              placeholder="Active"
                              className="h-8 text-center"
                            />
                          ) : (
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {editedPatient.membership_status || 'Active'}
                            </Badge>
                          )}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <Badge variant="outline" className="bg-muted text-muted-foreground border-muted-foreground/30">
                    Non-member
                  </Badge>
                </div>
              )}
            </div>

            <Separator className="my-6" />

            {/* Medical Records Section */}
            <div>
              <h3 className="font-medium text-foreground mb-4 text-center">Medical Records</h3>
              
              {/* Timeline of medical records */}
              <div className="space-y-4 mb-6">
                {editedPatient.medical_records.length > 0 ? (
                  editedPatient.medical_records.map((record) => (
                    <div key={record.id} className="flex gap-4 items-start">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-primary border-2 border-primary" />
                        <div className="w-0.5 h-full bg-border flex-1 min-h-[20px]" />
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="text-xs text-muted-foreground mb-1">
                          {formatDate(record.date)}
                        </p>
                        <div className="bg-muted/50 rounded-lg p-3 border border-border/50">
                          <p className="text-sm">{record.notes}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No medical records yet
                  </p>
                )}
              </div>

              {/* Add new medical record */}
              <div className="border-t border-border/50 pt-4">
                <div className="flex items-start gap-4">
                  <div className="flex flex-col items-center">
                    <Plus className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <Textarea
                      placeholder="Add notes about patient visit or recent treatment..."
                      value={newMedicalNote}
                      onChange={(e) => setNewMedicalNote(e.target.value)}
                      className="min-h-[80px]"
                    />
                    <Button
                      onClick={handleAddMedicalRecord}
                      disabled={!newMedicalNote.trim() || isSaving}
                      size="sm"
                      className="gap-2"
                    >
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-2 sm:space-y-6 relative z-0">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
        <h2 className="font-display text-lg sm:text-2xl font-semibold text-foreground">Patient Records</h2>
        <div className="flex gap-1.5 sm:gap-3">
          <AddPatientDialog onPatientAdded={fetchPatients} />
        </div>
      </div>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-2 sm:p-6">
          <div className="flex flex-col md:flex-row gap-2 sm:gap-4 mb-2 sm:mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 sm:pl-10 h-9 sm:h-10 text-sm"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-6 sm:py-8">
              <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-6 sm:py-8 text-muted-foreground">
              <User className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-2 opacity-30" />
              <p className="text-xs sm:text-sm">No patient records found.</p>
            </div>
          ) : (
            <>
              {/* Mobile Card Layout - Only show Name and View button */}
              <div className="block sm:hidden space-y-1.5">
                {filteredPatients.map(patient => (
                  <div 
                    key={patient.id} 
                    className="flex items-center justify-between p-2 bg-muted/30 rounded-lg border border-border/50"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-xs truncate">{patient.name}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openDetail(patient)}
                      className="gap-1 h-7 ml-2 flex-shrink-0 text-[10px] px-2"
                    >
                      <Eye className="h-3 w-3" />
                      View
                    </Button>
                  </div>
                ))}
              </div>

              {/* Desktop Table Layout */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Name</th>
                      <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Contact</th>
                      <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Last Visit</th>
                      <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPatients.map(patient => (
                      <tr key={patient.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-2">
                          <p className="font-medium">{patient.name}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[200px]">{patient.email}</p>
                        </td>
                        <td className="py-4 px-2 text-sm">{patient.contact_number}</td>
                        <td className="py-4 px-2 text-sm">
                          {patient.medical_records.length > 0
                            ? formatDate(patient.medical_records[patient.medical_records.length - 1]?.date)
                            : formatDate(patient.updated_at)
                          }
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
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientRecords;
