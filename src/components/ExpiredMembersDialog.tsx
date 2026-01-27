import React, { useState, useEffect } from 'react';
import { Clock, RefreshCw, Phone, Mail, CheckCircle, AlertTriangle, Calendar, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface ExpiredMembersDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMemberRenewed: () => void;
}

interface ExpiredMember {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  membership_type: string;
  membership_start_date: string;
  membership_expiry_date: string | null;
  status: string;
  referral_code: string | null;
  created_at: string;
}

const membershipPrices: Record<string, number> = {
  Green: 8888,
  Gold: 18888,
  Platinum: 38888,
};

const ExpiredMembersDialog = ({ open, onOpenChange, onMemberRenewed }: ExpiredMembersDialogProps) => {
  const [expiredMembers, setExpiredMembers] = useState<ExpiredMember[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [renewingId, setRenewingId] = useState<string | null>(null);
  const [upgradeSelections, setUpgradeSelections] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      fetchExpiredMembers();
    }
  }, [open]);

  const fetchExpiredMembers = async () => {
    setIsLoading(true);
    try {
      const today = new Date().toISOString();
      
      // Fetch members with expired status OR where expiry date has passed
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .or(`status.eq.expired,membership_expiry_date.lt.${today}`)
        .order('membership_expiry_date', { ascending: true });

      if (error) throw error;
      
      // Filter to only show those that are actually expired or past expiry
      const expired = (data || []).filter(m => {
        if (m.status === 'expired') return true;
        if (m.membership_expiry_date) {
          return new Date(m.membership_expiry_date) < new Date();
        }
        return false;
      });
      
      setExpiredMembers(expired);
      
      // Initialize upgrade selections with current membership type
      const selections: Record<string, string> = {};
      expired.forEach(m => {
        selections[m.id] = m.membership_type;
      });
      setUpgradeSelections(selections);
    } catch (error) {
      console.error('Error fetching expired members:', error);
      toast.error('Failed to load expired members');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRenewMembership = async (member: ExpiredMember) => {
    setRenewingId(member.id);
    try {
      const newMembershipType = upgradeSelections[member.id] || member.membership_type;
      const newExpiryDate = new Date();
      newExpiryDate.setFullYear(newExpiryDate.getFullYear() + 1);
      
      // Update member status and expiry date
      const { error } = await supabase
        .from('members')
        .update({
          status: 'active',
          membership_type: newMembershipType,
          membership_start_date: new Date().toISOString().split('T')[0],
          membership_expiry_date: newExpiryDate.toISOString(),
          payment_status: 'paid',
        })
        .eq('id', member.id);

      if (error) throw error;

      // Update patient record if exists
      await supabase
        .from('patient_records')
        .update({
          membership: newMembershipType,
          membership_status: 'active',
          membership_expiry_date: newExpiryDate.toISOString().split('T')[0],
        })
        .eq('member_id', member.id);

      // Create transaction record for renewal
      await supabase
        .from('transactions')
        .insert({
          member_id: member.id,
          amount: membershipPrices[newMembershipType] || 0,
          transaction_type: 'membership_renewal',
          payment_status: 'completed',
          payment_method: 'cash',
          description: `${newMembershipType} membership renewal`,
        });

      toast.success(`${member.name}'s membership renewed successfully!`);
      fetchExpiredMembers();
      onMemberRenewed();
    } catch (error) {
      console.error('Error renewing membership:', error);
      toast.error('Failed to renew membership');
    } finally {
      setRenewingId(null);
    }
  };

  const getDaysExpired = (expiryDate: string | null): number => {
    if (!expiryDate) return 0;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = today.getTime() - expiry.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getMembershipColor = (membership: string) => {
    switch (membership) {
      case 'Green': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'Gold': return 'bg-amber-500/20 text-amber-700 border-amber-500/30';
      case 'Platinum': return 'bg-slate-500/20 text-slate-700 border-slate-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            <Clock className="h-5 w-5 text-destructive" />
            Expired Members ({expiredMembers.length})
          </DialogTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchExpiredMembers}
            disabled={isLoading}
            className="ml-auto mr-8"
          >
            <RefreshCw className={`h-4 w-4 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
            Reload
          </Button>
        </DialogHeader>

        {/* Info Card */}
        <div className="bg-muted/50 rounded-lg p-4 space-y-2 text-sm">
          <h4 className="font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            What Happens When Membership Expires
          </h4>
          <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-2">
            <li>Status automatically changes: <Badge variant="outline" className="text-green-600 mx-1">active</Badge> → <Badge variant="outline" className="text-destructive mx-1">expired</Badge></li>
            <li>Member loses access to benefits</li>
            <li>Patient record remains (for history)</li>
          </ul>
        </div>

        <div className="space-y-4 py-4">
          {isLoading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-8 w-8 mx-auto text-muted-foreground animate-spin mb-4" />
              <p className="text-muted-foreground">Loading expired members...</p>
            </div>
          ) : expiredMembers.length > 0 ? (
            expiredMembers.map(member => {
              const daysExpired = getDaysExpired(member.membership_expiry_date);
              return (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-destructive/30 bg-card/80">
                    <CardContent className="p-4">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="font-medium">{member.name}</h3>
                            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                              Expired {daysExpired > 0 ? `${daysExpired} days ago` : 'today'}
                            </Badge>
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {member.email}
                            </span>
                            {member.phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {member.phone}
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 flex-wrap">
                            <Badge variant="outline" className={getMembershipColor(member.membership_type)}>
                              {member.membership_type}
                            </Badge>
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Expired: {member.membership_expiry_date 
                                ? new Date(member.membership_expiry_date).toLocaleDateString() 
                                : 'N/A'}
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                          {/* Contact buttons */}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              asChild
                            >
                              <a href={`mailto:${member.email}`}>
                                <Mail className="h-4 w-4" />
                                Email
                              </a>
                            </Button>
                            {member.phone && (
                              <Button
                                variant="outline"
                                size="sm"
                                className="gap-1"
                                asChild
                              >
                                <a href={`tel:${member.phone.replace(/-/g, '')}`}>
                                  <Phone className="h-4 w-4" />
                                  Call
                                </a>
                              </Button>
                            )}
                          </div>

                          {/* Renewal section */}
                          <div className="flex items-center gap-2">
                            <Select
                              value={upgradeSelections[member.id] || member.membership_type}
                              onValueChange={(value) => setUpgradeSelections(prev => ({ ...prev, [member.id]: value }))}
                            >
                              <SelectTrigger className="w-[130px] h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Green">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                    Green
                                  </div>
                                </SelectItem>
                                <SelectItem value="Gold">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                                    Gold
                                  </div>
                                </SelectItem>
                                <SelectItem value="Platinum">
                                  <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                                    Platinum
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            
                            <Button
                              onClick={() => handleRenewMembership(member)}
                              disabled={renewingId === member.id}
                              size="sm"
                              className="gap-1 bg-green-600 hover:bg-green-700"
                            >
                              {renewingId === member.id ? (
                                <>
                                  <RefreshCw className="h-4 w-4 animate-spin" />
                                  Renewing...
                                </>
                              ) : (
                                <>
                                  <CheckCircle className="h-4 w-4" />
                                  Renew
                                </>
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Upgrade indicator */}
                      {upgradeSelections[member.id] && upgradeSelections[member.id] !== member.membership_type && (
                        <div className="mt-3 pt-3 border-t border-border/50 flex items-center gap-2 text-sm">
                          <TrendingUp className="h-4 w-4 text-green-500" />
                          <span className="text-muted-foreground">Upgrading to</span>
                          <Badge variant="outline" className={getMembershipColor(upgradeSelections[member.id])}>
                            {upgradeSelections[member.id]}
                          </Badge>
                          <span className="text-muted-foreground">-</span>
                          <span className="font-medium">₱{membershipPrices[upgradeSelections[member.id]]?.toLocaleString()}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <p className="text-muted-foreground">No expired members</p>
              <p className="text-xs text-muted-foreground mt-1">All memberships are currently active</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExpiredMembersDialog;
