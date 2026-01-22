import React, { useState } from 'react';
import { Search, Download, Plus, Eye, Calendar, User, Phone, FileText, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface MedicalRecord {
  id: number;
  date: string;
  notes: string;
}

interface Patient {
  id: number | null;
  name: string;
  mobile: string;
  email: string;
  dob: string;
  gender: string;
  address: string;
  emergencyContact: string;
  lastVisit: string;
  membership: string;
  joinDate: string;
  expiration: string;
  status: string;
  medicalRecords: MedicalRecord[];
}

const PatientRecords = () => {
  const [viewMode, setViewMode] = useState<'list' | 'full-record'>('list');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 1,
      name: 'John Carl Torlo',
      mobile: '09388497397',
      email: 'johncarltorlo312@gmail.com',
      dob: '2002-04-17',
      gender: 'Male',
      address: '6014 Mandaue City, Philippines',
      emergencyContact: '09398427398',
      lastVisit: '2025-08-07',
      membership: 'Gold',
      joinDate: '2025-04-07',
      expiration: '2026-04-07',
      status: 'Active',
      medicalRecords: [
        {
          id: 1,
          date: '2025-08-20',
          notes: 'Patient came in for relaxation massage. Complained of shoulder tension.'
        }
      ]
    },
    {
      id: 2,
      name: 'Maria Santos',
      mobile: '09171234567',
      email: 'maria.santos@email.com',
      dob: '1995-06-15',
      gender: 'Female',
      address: 'Cebu City',
      emergencyContact: '09281234567',
      lastVisit: '2025-08-15',
      membership: 'Platinum',
      joinDate: '2025-01-15',
      expiration: '2026-01-15',
      status: 'Active',
      medicalRecords: []
    }
  ]);

  const calculateAge = (dob: string): string => {
    if (!dob) return '';
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  const calculateDaysLeft = (expiration: string): number => {
    if (!expiration) return 0;
    const today = new Date();
    const expDate = new Date(expiration);
    const diffTime = expDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const getMembershipColor = (tier: string): string => {
    switch (tier?.toLowerCase()) {
      case 'green': return 'bg-green-100 text-green-800';
      case 'gold': return 'bg-yellow-100 text-yellow-800';
      case 'platinum': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'expired': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getDaysLeftColor = (days: number): string => {
    if (days > 30) return 'text-green-600';
    if (days > 7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const openFullRecord = (patient: Patient) => {
    setSelectedPatient({ ...patient });
    setViewMode('full-record');
  };

  const closeFullRecord = () => {
    setViewMode('list');
    setSelectedPatient(null);
  };

  const savePatientRecord = () => {
    if (selectedPatient) {
      if (selectedPatient.id) {
        setPatients(prev => prev.map(p =>
          p.id === selectedPatient.id ? selectedPatient : p
        ));
      } else {
        setPatients(prev => [...prev, { ...selectedPatient, id: Date.now() }]);
      }
      closeFullRecord();
    }
  };

  const addNewPatient = () => {
    const newPatient: Patient = {
      id: null,
      name: '',
      mobile: '',
      email: '',
      dob: '',
      gender: '',
      address: '',
      emergencyContact: '',
      lastVisit: '',
      membership: '',
      joinDate: '',
      expiration: '',
      status: 'Pending',
      medicalRecords: []
    };
    setSelectedPatient(newPatient);
    setViewMode('full-record');
  };

  const addMedicalRecord = () => {
    if (selectedPatient) {
      const newRecord: MedicalRecord = {
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        notes: ''
      };
      setSelectedPatient({
        ...selectedPatient,
        medicalRecords: [newRecord, ...(selectedPatient.medicalRecords || [])]
      });
    }
  };

  const updateMedicalRecord = (recordId: number, notes: string) => {
    if (selectedPatient) {
      setSelectedPatient({
        ...selectedPatient,
        medicalRecords: selectedPatient.medicalRecords.map(r =>
          r.id === recordId ? { ...r, notes } : r
        )
      });
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.mobile.includes(searchTerm) ||
    p.membership?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (viewMode === 'full-record' && selectedPatient) {
    return (
      <div className="space-y-6">
        <Button
          variant="ghost"
          onClick={closeFullRecord}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <h2 className="font-display text-2xl font-semibold text-foreground">Full Record</h2>

        <div className="space-y-6">
          {/* Personal Info & Contacts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium text-foreground">Personal Info</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs text-muted-foreground mb-1 block">Name</label>
                    <Input
                      value={selectedPatient.name}
                      onChange={(e) => setSelectedPatient({ ...selectedPatient, name: e.target.value })}
                      placeholder="John Carl Torlo"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Date of Birth</label>
                    <Input
                      type="date"
                      value={selectedPatient.dob}
                      onChange={(e) => setSelectedPatient({ ...selectedPatient, dob: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Age</label>
                    <Input
                      value={calculateAge(selectedPatient.dob)}
                      readOnly
                      className="bg-muted"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs text-muted-foreground mb-1 block">Gender</label>
                    <Select
                      value={selectedPatient.gender}
                      onValueChange={(value) => setSelectedPatient({ ...selectedPatient, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contacts */}
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium text-foreground">Contacts</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Mobile No.</label>
                    <Input
                      value={selectedPatient.mobile}
                      onChange={(e) => setSelectedPatient({ ...selectedPatient, mobile: e.target.value })}
                      placeholder="09388497397"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                    <Input
                      type="email"
                      value={selectedPatient.email}
                      onChange={(e) => setSelectedPatient({ ...selectedPatient, email: e.target.value })}
                      placeholder="johncarltorlo312@gmail.com"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Emergency Contact</label>
                    <Input
                      value={selectedPatient.emergencyContact}
                      onChange={(e) => setSelectedPatient({ ...selectedPatient, emergencyContact: e.target.value })}
                      placeholder="09398427398"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Membership */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <h3 className="font-medium text-foreground mb-4">Membership</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Membership</label>
                  <Badge className={getMembershipColor(selectedPatient.membership)}>
                    {selectedPatient.membership || 'None'}
                  </Badge>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Join Date</label>
                  <p className="text-sm font-medium">{formatDate(selectedPatient.joinDate) || '-'}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Expiration</label>
                  <p className="text-sm font-medium">{formatDate(selectedPatient.expiration) || '-'}</p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Days Left</label>
                  <p className={`text-sm font-medium ${getDaysLeftColor(calculateDaysLeft(selectedPatient.expiration))}`}>
                    {selectedPatient.expiration ? `${calculateDaysLeft(selectedPatient.expiration)} days` : '-'}
                  </p>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Status</label>
                  <Badge className={getStatusColor(selectedPatient.status)}>
                    {selectedPatient.status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Medical Records */}
          <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-medium text-foreground">Medical Records</h3>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={addMedicalRecord}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  ADD
                </Button>
              </div>

              <div className="space-y-4">
                {selectedPatient.medicalRecords && selectedPatient.medicalRecords.length > 0 ? (
                  selectedPatient.medicalRecords.map((record) => (
                    <div key={record.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{formatDate(record.date)}</span>
                      </div>
                      <p className="text-xs text-destructive mb-2 uppercase">
                        THIS IS WHERE WILL INPUT THE NOTES ABOUT THE PATIENT VISIT OR RECENT TREATMENT.
                      </p>
                      <Textarea
                        value={record.notes}
                        onChange={(e) => updateMedicalRecord(record.id, e.target.value)}
                        placeholder="Enter treatment notes here..."
                        rows={3}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No medical records yet. Click ADD to create one.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              onClick={savePatientRecord}
              className="px-8 gradient-accent text-accent-foreground"
            >
              SAVE
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold text-foreground">Patient Records Database</h2>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Data
        </Button>
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
            <Button onClick={addNewPatient} className="gap-2 gradient-accent text-accent-foreground">
              <Plus className="h-4 w-4" />
              ADD
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Mobile No.</th>
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Last Visit</th>
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Membership</th>
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-2 font-medium">{patient.name || '-'}</td>
                    <td className="py-4 px-2 text-sm">{patient.mobile || '-'}</td>
                    <td className="py-4 px-2 text-sm">{formatDate(patient.lastVisit) || '-'}</td>
                    <td className="py-4 px-2">
                      {patient.membership ? (
                        <Badge className={getMembershipColor(patient.membership)}>
                          {patient.membership}
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-4 px-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openFullRecord(patient)}
                        className="gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        See all Info
                      </Button>
                    </td>
                  </tr>
                ))}
                {filteredPatients.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatientRecords;
