import React from 'react';
import { ArrowLeft, Copy, CreditCard, Gift, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MemberBenefitsSection from '@/components/MemberBenefitsSection';
import { toast } from 'sonner';

interface MemberDetailsViewProps {
  member: any;
  onBack: () => void;
  onViewTransactions: (memberId: string, memberName: string) => void;
  membershipPrices: Record<string, number>;
  getMembershipColor: (type: string) => string;
  getStatusColor: (status: string) => string;
  getPaymentMethodIcon: (method: string) => React.ReactNode;
  getPaymentMethodLabel: (method: string, isWalkIn?: boolean) => string;
  onUpdate: () => void;
}

const MemberDetailsView: React.FC<MemberDetailsViewProps> = ({
  member,
  onBack,
  onViewTransactions,
  membershipPrices,
  getMembershipColor,
  getStatusColor,
  getPaymentMethodIcon,
  getPaymentMethodLabel,
  onUpdate
}) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Referral code copied!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-display font-semibold">{member.name}</h2>
          <p className="text-sm text-muted-foreground">{member.email}</p>
        </div>
        <Badge variant="outline" className={`ml-auto ${getMembershipColor(member.membership_type)}`}>
          {member.membership_type} Member
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Member Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="font-medium">{member.phone || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge className={getStatusColor(member.status)}>
                  {member.status}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Membership Start</p>
                <p className="text-sm">
                  {member.membership_start_date 
                    ? new Date(member.membership_start_date).toLocaleDateString() 
                    : new Date(member.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Membership Expiry</p>
                <p className="text-sm">
                  {member.membership_expiry_date 
                    ? new Date(member.membership_expiry_date).toLocaleDateString() 
                    : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Membership Fee</p>
                <p className="font-medium">₱{(membershipPrices[member.membership_type] || 0).toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Walk-in</p>
                <p className="text-sm">{member.is_walk_in ? 'Yes' : 'No'}</p>
              </div>
            </div>

            {/* Referral Section */}
            <div className="border-t pt-4">
              <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                <Gift className="h-3 w-3" /> Referral Information
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Referral Code</p>
                  {member.referral_code ? (
                    <div className="flex items-center gap-2">
                      <code className="font-mono font-medium bg-muted px-2 py-1 rounded text-sm">{member.referral_code}</code>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(member.referral_code)}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm">—</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Referrals</p>
                  <p className="font-medium text-accent">{member.referral_count || 0}</p>
                </div>
                {member.referred_by && (
                  <div className="col-span-2">
                    <p className="text-xs text-muted-foreground">Referred By</p>
                    <code className="font-mono text-sm bg-muted px-2 py-1 rounded">{member.referred_by}</code>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Section */}
            <div className="border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <CreditCard className="h-3 w-3" /> Payment Information
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 h-7 text-xs"
                  onClick={() => onViewTransactions(member.id, member.name)}
                >
                  <History className="h-3 w-3" />
                  View History
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Payment Method</p>
                  <div className="flex items-center gap-1 mt-1">
                    {getPaymentMethodIcon(member.payment_method)}
                    <p className="font-medium capitalize">
                      {getPaymentMethodLabel(member.payment_method, member.is_walk_in)}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Payment Status</p>
                  <Badge 
                    variant="outline" 
                    className={`mt-1 ${member.payment_status === 'paid' || member.payment_status === 'completed' ? 'bg-green-500/10 text-green-600 border-green-500/30' : 'bg-amber-500/10 text-amber-600 border-amber-500/30'}`}
                  >
                    {member.payment_status === 'paid' || member.payment_status === 'completed' ? 'Paid' : member.payment_status || 'Pending'}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Amount Paid</p>
                  <p className="font-medium">
                    {member.amount_paid ? `₱${Number(member.amount_paid).toLocaleString()}` : '—'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Right Column - Benefits */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Membership Benefits & Rewards</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <MemberBenefitsSection
                memberId={member.id}
                membershipType={member.membership_type}
                referralCount={member.referral_count || 0}
                onUpdate={onUpdate}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberDetailsView;
