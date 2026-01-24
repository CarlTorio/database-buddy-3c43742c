import React, { useState, useEffect } from 'react';
import { Check, Plus, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Benefit {
  id: string;
  benefit_name: string;
  benefit_type: string;
  total_quantity: number;
  description: string | null;
}

interface BenefitClaim {
  id: string;
  benefit_id: string;
  session_number: number;
  claimed_at: string;
}

interface ReferralReward {
  id: string;
  reward_name: string;
  claimed: boolean;
  claimed_at: string | null;
}

interface MemberBenefitsSectionProps {
  memberId: string;
  membershipType: string;
  onUpdate?: () => void;
}

const MemberBenefitsSection: React.FC<MemberBenefitsSectionProps> = ({
  memberId,
  membershipType,
  onUpdate
}) => {
  const [benefits, setBenefits] = useState<Benefit[]>([]);
  const [claims, setClaims] = useState<BenefitClaim[]>([]);
  const [referralRewards, setReferralRewards] = useState<ReferralReward[]>([]);
  const [newRewardName, setNewRewardName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingReward, setIsAddingReward] = useState(false);

  // Fetch benefits and claims
  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch membership benefits for this tier
      const { data: benefitsData, error: benefitsError } = await supabase
        .from('membership_benefits')
        .select('*')
        .ilike('membership_type', membershipType);

      if (benefitsError) throw benefitsError;

      // Fetch member's claims
      const { data: claimsData, error: claimsError } = await supabase
        .from('member_benefit_claims')
        .select('*')
        .eq('member_id', memberId);

      if (claimsError) throw claimsError;

      // Fetch referral rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('referral_rewards')
        .select('*')
        .eq('member_id', memberId)
        .order('created_at', { ascending: false });

      if (rewardsError) throw rewardsError;

      setBenefits(benefitsData || []);
      setClaims(claimsData || []);
      setReferralRewards(rewardsData || []);
    } catch (error) {
      console.error('Error fetching benefits:', error);
      toast.error('Failed to load benefits');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (memberId && membershipType) {
      fetchData();
    }
  }, [memberId, membershipType]);

  // Toggle claim for a specific session
  const toggleClaim = async (benefitId: string, sessionNumber: number) => {
    const existingClaim = claims.find(
      c => c.benefit_id === benefitId && c.session_number === sessionNumber
    );

    try {
      if (existingClaim) {
        // Remove claim (unclaim)
        const { error } = await supabase
          .from('member_benefit_claims')
          .delete()
          .eq('id', existingClaim.id);

        if (error) throw error;
        
        setClaims(prev => prev.filter(c => c.id !== existingClaim.id));
        toast.success('Benefit unclaimed');
      } else {
        // Add claim
        const { data, error } = await supabase
          .from('member_benefit_claims')
          .insert({
            member_id: memberId,
            benefit_id: benefitId,
            session_number: sessionNumber,
            claimed_by: 'Admin'
          })
          .select()
          .single();

        if (error) throw error;
        
        setClaims(prev => [...prev, data]);
        toast.success('Benefit claimed!');
      }
      
      onUpdate?.();
    } catch (error) {
      console.error('Error toggling claim:', error);
      toast.error('Failed to update claim');
    }
  };

  // Check if a specific session is claimed
  const isSessionClaimed = (benefitId: string, sessionNumber: number) => {
    return claims.some(
      c => c.benefit_id === benefitId && c.session_number === sessionNumber
    );
  };

  // Get claimed count for a benefit
  const getClaimedCount = (benefitId: string) => {
    return claims.filter(c => c.benefit_id === benefitId).length;
  };

  // Add referral reward
  const handleAddReward = async () => {
    if (!newRewardName.trim()) {
      toast.error('Please enter a reward name');
      return;
    }

    setIsAddingReward(true);
    try {
      const { data, error } = await supabase
        .from('referral_rewards')
        .insert({
          member_id: memberId,
          reward_name: newRewardName.trim()
        })
        .select()
        .single();

      if (error) throw error;

      setReferralRewards(prev => [data, ...prev]);
      setNewRewardName('');
      toast.success('Reward added!');
      onUpdate?.();
    } catch (error) {
      console.error('Error adding reward:', error);
      toast.error('Failed to add reward');
    } finally {
      setIsAddingReward(false);
    }
  };

  // Toggle referral reward claimed status
  const toggleRewardClaimed = async (rewardId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('referral_rewards')
        .update({
          claimed: !currentStatus,
          claimed_at: !currentStatus ? new Date().toISOString() : null,
          claimed_by: !currentStatus ? 'Admin' : null
        })
        .eq('id', rewardId);

      if (error) throw error;

      setReferralRewards(prev =>
        prev.map(r =>
          r.id === rewardId
            ? { ...r, claimed: !currentStatus, claimed_at: !currentStatus ? new Date().toISOString() : null }
            : r
        )
      );
      
      toast.success(currentStatus ? 'Reward unclaimed' : 'Reward claimed!');
      onUpdate?.();
    } catch (error) {
      console.error('Error toggling reward:', error);
      toast.error('Failed to update reward');
    }
  };

  const claimableBenefits = benefits.filter(b => b.benefit_type === 'claimable');
  const inclusionBenefits = benefits.filter(b => b.benefit_type === 'inclusion');

  if (isLoading) {
    return (
      <div className="col-span-2 border-t border-border pt-4 mt-2">
        <p className="text-xs text-muted-foreground">Loading benefits...</p>
      </div>
    );
  }

  return (
    <>
      {/* Membership Inclusions */}
      {inclusionBenefits.length > 0 && (
        <div className="col-span-2 border-t border-border pt-4 mt-2">
          <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
            <Sparkles className="h-3 w-3" /> Membership Inclusions
          </p>
          <div className="flex flex-wrap gap-2">
            {inclusionBenefits.map(benefit => (
              <Badge 
                key={benefit.id} 
                variant="secondary"
                className="bg-accent/10 text-accent border-accent/30"
              >
                <Check className="h-3 w-3 mr-1" />
                {benefit.benefit_name}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Claimable Benefits */}
      {claimableBenefits.length > 0 && (
        <div className="col-span-2 border-t border-border pt-4 mt-2">
          <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
            <Gift className="h-3 w-3" /> Claimable Benefits
          </p>
          <div className="space-y-3">
            {claimableBenefits.map(benefit => {
              const claimedCount = getClaimedCount(benefit.id);
              const sessions = Array.from({ length: benefit.total_quantity }, (_, i) => i + 1);
              
              return (
                <div key={benefit.id} className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{benefit.benefit_name}</span>
                    <span className="text-xs text-muted-foreground">
                      {claimedCount}/{benefit.total_quantity} claimed
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sessions.map(sessionNum => {
                      const isClaimed = isSessionClaimed(benefit.id, sessionNum);
                      return (
                        <button
                          key={sessionNum}
                          onClick={() => toggleClaim(benefit.id, sessionNum)}
                          className={`
                            w-8 h-8 rounded-full border-2 flex items-center justify-center
                            transition-all duration-200 hover:scale-110
                            ${isClaimed 
                              ? 'bg-green-500 border-green-500 text-white' 
                              : 'border-border bg-background hover:border-accent'
                            }
                          `}
                          title={`Session ${sessionNum}: ${isClaimed ? 'Click to unclaim' : 'Click to claim'}`}
                        >
                          {isClaimed ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <span className="text-xs text-muted-foreground">{sessionNum}</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Referral Rewards */}
      <div className="col-span-2 border-t border-border pt-4 mt-2">
        <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
          <Gift className="h-3 w-3" /> Referral Rewards
        </p>
        
        {/* Add new reward */}
        <div className="flex gap-2 mb-3">
          <Input
            placeholder="Enter reward (e.g., Free Massage)"
            value={newRewardName}
            onChange={(e) => setNewRewardName(e.target.value)}
            className="text-sm h-8"
            onKeyDown={(e) => e.key === 'Enter' && handleAddReward()}
          />
          <Button
            size="sm"
            onClick={handleAddReward}
            disabled={isAddingReward || !newRewardName.trim()}
            className="h-8 px-3"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Rewards list */}
        {referralRewards.length > 0 ? (
          <div className="space-y-2">
            {referralRewards.map(reward => (
              <div
                key={reward.id}
                className={`
                  flex items-center justify-between p-2 rounded-lg border
                  ${reward.claimed 
                    ? 'bg-green-500/10 border-green-500/30' 
                    : 'bg-muted/30 border-border'
                  }
                `}
              >
                <span className={`text-sm ${reward.claimed ? 'line-through text-muted-foreground' : ''}`}>
                  {reward.reward_name}
                </span>
                <button
                  onClick={() => toggleRewardClaimed(reward.id, reward.claimed)}
                  className={`
                    w-6 h-6 rounded-full border-2 flex items-center justify-center
                    transition-all duration-200 hover:scale-110
                    ${reward.claimed 
                      ? 'bg-green-500 border-green-500 text-white' 
                      : 'border-border bg-background hover:border-accent'
                    }
                  `}
                  title={reward.claimed ? 'Click to unclaim' : 'Click to claim'}
                >
                  {reward.claimed && <Check className="h-3 w-3" />}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground text-center py-2">
            No referral rewards yet
          </p>
        )}
      </div>
    </>
  );
};

export default MemberBenefitsSection;
