import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, User, Mail, Phone, UserPlus, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Booking {
  id: string;
  name: string;
  email: string;
  contact_number: string;
  membership: string;
  patient_id?: string | null;
}

interface PatientRecord {
  id: string;
  name: string;
  email: string;
  contact_number: string | null;
  membership: string | null;
}

interface LinkToPatientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  booking: Booking | null;
  onLinked: () => void;
}

const LinkToPatientDialog = ({ open, onOpenChange, booking, onLinked }: LinkToPatientDialogProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [existingPatient, setExistingPatient] = useState<PatientRecord | null>(null);
  const [searchComplete, setSearchComplete] = useState(false);

  // Search for existing patient when dialog opens
  useEffect(() => {
    if (open && booking) {
      searchPatientByEmail();
    } else {
      setExistingPatient(null);
      setSearchComplete(false);
    }
  }, [open, booking]);

  const searchPatientByEmail = async () => {
    if (!booking) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('patient_records')
        .select('id, name, email, contact_number, membership')
        .eq('email', booking.email.toLowerCase().trim())
        .maybeSingle();

      if (error) throw error;

      setExistingPatient(data);
      setSearchComplete(true);
    } catch (error) {
      console.error('Error searching for patient:', error);
      toast.error('Failed to search for patient');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkToExisting = async () => {
    if (!booking || !existingPatient) return;

    setIsProcessing(true);
    try {
      // Link booking to existing patient
      const { error } = await supabase
        .from('bookings')
        .update({ patient_id: existingPatient.id })
        .eq('id', booking.id);

      if (error) throw error;

      toast.success(`Booking linked to ${existingPatient.name}'s patient record`);
      onLinked();
      onOpenChange(false);
    } catch (error) {
      console.error('Error linking booking:', error);
      toast.error('Failed to link booking to patient');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateNewPatient = async () => {
    if (!booking) return;

    setIsProcessing(true);
    try {
      // Create new patient record
      const { data: newPatient, error: createError } = await supabase
        .from('patient_records')
        .insert({
          name: booking.name,
          email: booking.email.toLowerCase().trim(),
          contact_number: booking.contact_number,
          membership: booking.membership || null,
          source: 'booking',
        })
        .select('id')
        .single();

      if (createError) throw createError;

      // Link booking to new patient
      const { error: linkError } = await supabase
        .from('bookings')
        .update({ patient_id: newPatient.id })
        .eq('id', booking.id);

      if (linkError) throw linkError;

      toast.success(`Patient record created and linked for ${booking.name}`);
      onLinked();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating patient:', error);
      toast.error('Failed to create patient record');
    } finally {
      setIsProcessing(false);
    }
  };

  const getMembershipColor = (membership: string | null) => {
    const m = membership?.toLowerCase() || '';
    if (m.includes('green')) return 'bg-green-500/20 text-green-700 border-green-500/30';
    if (m.includes('gold')) return 'bg-amber-500/20 text-amber-700 border-amber-500/30';
    if (m.includes('platinum')) return 'bg-slate-500/20 text-slate-700 border-slate-500/30';
    return 'bg-muted text-muted-foreground';
  };

  const namesMatch = existingPatient?.name?.toLowerCase().trim() === booking?.name?.toLowerCase().trim();

  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            {existingPatient ? (
              <>
                <Link2 className="h-5 w-5 text-primary" />
                Link to Existing Patient?
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5 text-accent" />
                Create New Patient Record?
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {existingPatient 
              ? 'Found an existing patient with this email address.' 
              : 'No existing patient found with this email.'}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-8 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Searching for existing patient...</p>
          </div>
        ) : searchComplete && (
          <div className="space-y-4 py-4">
            {existingPatient ? (
              <>
                {/* Existing Patient Found */}
                <Card className="border-primary/30 bg-primary/5">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{existingPatient.name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {existingPatient.email}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Contact:</span>
                        <p className="font-medium">{existingPatient.contact_number || '—'}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Membership:</span>
                        <div className="mt-1">
                          {existingPatient.membership ? (
                            <Badge variant="outline" className={getMembershipColor(existingPatient.membership)}>
                              {existingPatient.membership}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">Non-member</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Name mismatch warning */}
                {!namesMatch && (
                  <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
                    <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">
                      <p className="font-medium text-amber-800 dark:text-amber-200">Name Mismatch</p>
                      <p className="text-amber-700 dark:text-amber-300">
                        Booking name "<strong>{booking.name}</strong>" differs from patient name "<strong>{existingPatient.name}</strong>". 
                        This may be a typo or nickname.
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
                    Cancel
                  </Button>
                  <Button onClick={handleLinkToExisting} disabled={isProcessing} className="gap-2">
                    {isProcessing ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <Link2 className="h-4 w-4" />
                    )}
                    Link to This Patient
                  </Button>
                </div>
              </>
            ) : (
              <>
                {/* No Patient Found - Create New */}
                <Card className="border-accent/30 bg-accent/5">
                  <CardContent className="p-4 space-y-3">
                    <p className="text-sm text-muted-foreground mb-3">
                      Create new patient record with:
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{booking.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{booking.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{booking.contact_number}</span>
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-sm text-muted-foreground">Membership:</span>
                        {booking.membership && !booking.membership.toLowerCase().includes('non') ? (
                          <Badge variant="outline" className={getMembershipColor(booking.membership)}>
                            {booking.membership}
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">Non-member</span>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isProcessing}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateNewPatient} disabled={isProcessing} className="gap-2 bg-accent hover:bg-accent/90">
                    {isProcessing ? (
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    ) : (
                      <UserPlus className="h-4 w-4" />
                    )}
                    Create Patient Record
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LinkToPatientDialog;
