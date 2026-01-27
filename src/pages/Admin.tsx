import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Users, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, Search, Download, Eye, ArrowLeft, History, Phone, CreditCard, Wallet, Gift, Copy, UserCheck, FileText, MessageSquare, RefreshCw, Receipt, ExternalLink, UserPlus, Banknote, Link2, CheckCircle2, Trash2, Loader2, LogOut, Settings, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BookingHistory from '@/components/BookingHistory';
import PatientRecords from '@/components/PatientRecords';
import AddBookingDialog from '@/components/AddBookingDialog';
import LinkToPatientDialog from '@/components/LinkToPatientDialog';
import MemberBenefitsSection from '@/components/MemberBenefitsSection';
import MemberDetailsView from '@/components/MemberDetailsView';
import AdminAuth, { clearAdminAuth } from '@/components/AdminAuth';
import AdminSettingsDialog from '@/components/AdminSettingsDialog';
import ExpiredMembersDialog from '@/components/ExpiredMembersDialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const HilomeAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  const [showForConfirmation, setShowForConfirmation] = useState(false);
  const [showRejectionHistory, setShowRejectionHistory] = useState(false);
  const [rejectedMembers, setRejectedMembers] = useState<any[]>([]);
  const [selectedBookingMessage, setSelectedBookingMessage] = useState<{name: string; message: string} | null>(null);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [selectedMemberTransactions, setSelectedMemberTransactions] = useState<any[]>([]);
  const [transactionMemberName, setTransactionMemberName] = useState('');
  const [showRegisterMember, setShowRegisterMember] = useState(false);
  const [showAdminSettings, setShowAdminSettings] = useState(false);
  const [showExpiredMembers, setShowExpiredMembers] = useState(false);
  const [registerFormData, setRegisterFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membership_type: 'Green',
    payment_method: 'cash',
    referral_code: ''
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [members, setMembers] = useState<any[]>([]);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);

  const membershipPrices: Record<string, number> = {
    Green: 8888,
    GREEN: 8888,
    Gold: 19888,
    GOLD: 18888,
    Platinum: 38888,
    PLATINUM: 38888
  };

  interface Booking {
    id: string;
    name: string;
    email: string;
    contact_number: string;
    preferred_date: string;
    preferred_time: string;
    membership: string;
    status: string;
    message: string | null;
    created_at: string;
    updated_at: string;
    patient_id: string | null;
    member_id: string | null;
  }

  // Helper to calculate days left until expiry
  const calculateDaysLeft = (expiryDate: string | null): number | null => {
    if (!expiryDate) return null;
    const expiry = new Date(expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Referral code copied!');
  };

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addedToRecord, setAddedToRecord] = useState<Set<string>>(new Set());
  const [existingPatientEmails, setExistingPatientEmails] = useState<Set<string>>(new Set());
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedBookingForLink, setSelectedBookingForLink] = useState<Booking | null>(null);

  // Fetch existing patient emails
  const fetchExistingPatientEmails = async () => {
    try {
      const { data, error } = await supabase
        .from('patient_records')
        .select('email');

      if (error) throw error;

      const emails = new Set((data || []).map(p => p.email.toLowerCase().trim()));
      setExistingPatientEmails(emails);
    } catch (error) {
      console.error('Error fetching patient emails:', error);
    }
  };

  // Fetch data from database - only pending bookings, sorted by nearest date
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .eq('status', 'pending')
        .order('preferred_date', { ascending: true });

      if (error) throw error;

      setBookings(data || []);
      await fetchExistingPatientEmails();
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  // Add booking to patient records
  const handleAddToPatientRecord = async (booking: Booking) => {
    try {
      const { error } = await supabase
        .from('patient_records')
        .insert({
          name: booking.name,
          email: booking.email.toLowerCase().trim(),
          contact_number: booking.contact_number,
          booking_id: booking.id,
          preferred_date: booking.preferred_date,
          preferred_time: booking.preferred_time,
          message: booking.message,
          source: 'booking'
        });

      if (error) throw error;

      // Update local state
      setAddedToRecord(prev => new Set([...prev, booking.id]));
      setExistingPatientEmails(prev => new Set([...prev, booking.email.toLowerCase().trim()]));
      
      // Update booking with patient link
      const { data: patientData } = await supabase
        .from('patient_records')
        .select('id')
        .eq('email', booking.email.toLowerCase().trim())
        .maybeSingle();

      if (patientData) {
        await supabase
          .from('bookings')
          .update({ patient_id: patientData.id })
          .eq('id', booking.id);
      }

      toast.success(`${booking.name} added to patient records!`);
      fetchData();
    } catch (error) {
      console.error('Error adding to patient record:', error);
      toast.error('Failed to add to patient records');
    }
  };

  // Check if email already has a patient record
  const hasPatientRecord = (email: string) => {
    return existingPatientEmails.has(email.toLowerCase().trim());
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Payment method display helper
  const getPaymentMethodIcon = (method: string) => {
    switch (method?.toLowerCase()) {
      case 'gcash': return <Wallet className="h-4 w-4 text-blue-500" />;
      case 'card': 
      case 'stripe': return <CreditCard className="h-4 w-4 text-purple-500" />;
      case 'bank_transfer': return <DollarSign className="h-4 w-4 text-green-500" />;
      default: return <DollarSign className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPaymentMethodLabel = (method: string, isWalkIn: boolean = false) => {
    switch (method?.toLowerCase()) {
      case 'gcash': return 'GCash';
      case 'card': return 'Card';
      case 'stripe': return 'Stripe';
      case 'bank_transfer': return 'Bank Transfer';
      case 'cash': return isWalkIn ? 'Cash' : 'Online Payment';
      default: return method || 'Online Payment';
    }
  };

  // Fetch transaction history for a member
  const fetchTransactionHistory = async (memberId: string, memberName: string) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('member_id', memberId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setSelectedMemberTransactions(data || []);
      setTransactionMemberName(memberName);
      setShowTransactionHistory(true);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transaction history');
    }
  };

  // Pending members for confirmation - filter from database
  const [pendingMembersData, setPendingMembersData] = useState<any[]>([]);
  
  // Fetch pending members from database
  const fetchPendingMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPendingMembersData(data || []);
    } catch (error) {
      console.error('Error fetching pending members:', error);
    }
  };

  // Fetch rejected members from database
  const fetchRejectedMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .eq('status', 'rejected')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setRejectedMembers(data || []);
    } catch (error) {
      console.error('Error fetching rejected members:', error);
    }
  };

  useEffect(() => {
    fetchPendingMembers();
    fetchRejectedMembers();
  }, []);

  // Use database pending members only (no sample data)
  const pendingMembers = pendingMembersData;

  // Fetch members from database
  const fetchMembers = async () => {
    setIsLoadingMembers(true);
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast.error('Failed to load members');
    } finally {
      setIsLoadingMembers(false);
    }
  };

  // Register walk-in member
  const handleRegisterMember = async () => {
    if (!registerFormData.name || !registerFormData.email || !registerFormData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsRegistering(true);
    try {
      const membershipPrice = membershipPrices[registerFormData.membership_type] || 0;
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      // If referral code is provided, validate it and get the referrer
      let referrerId: string | null = null;
      if (registerFormData.referral_code) {
        const { data: referrer, error: referrerError } = await supabase
          .from('members')
          .select('id, referral_code, referral_count')
          .eq('referral_code', registerFormData.referral_code.toUpperCase())
          .eq('status', 'active')
          .maybeSingle();

        if (referrerError) {
          console.error('Error checking referral code:', referrerError);
        }

        if (!referrer) {
          toast.error('Invalid referral code. Please check and try again.');
          setIsRegistering(false);
          return;
        }

        referrerId = referrer.id;
      }

      // Generate referral code for the new member
      const referralCode = generateReferralCode(registerFormData.name);
      
      // Insert the new member
      const { data: newMember, error } = await supabase
        .from('members')
        .insert({
          name: registerFormData.name,
          email: registerFormData.email.toLowerCase().trim(),
          phone: registerFormData.phone,
          membership_type: registerFormData.membership_type,
          payment_method: registerFormData.payment_method,
          payment_status: 'paid',
          amount_paid: membershipPrice,
          referred_by: registerFormData.referral_code?.toUpperCase() || null,
          status: 'active',
          is_walk_in: true,
          membership_expiry_date: expiryDate.toISOString(),
          referral_code: referralCode
        })
        .select('id')
        .single();

      if (error) throw error;

      // Automatically create patient record for the walk-in member with member_id link
      const { error: patientError } = await supabase
        .from('patient_records')
        .insert({
          name: registerFormData.name,
          email: registerFormData.email.toLowerCase().trim(),
          contact_number: registerFormData.phone || null,
          membership: registerFormData.membership_type,
          member_id: newMember?.id || null,
          source: 'membership',
          membership_join_date: new Date().toISOString().split('T')[0],
          membership_expiry_date: expiryDate.toISOString().split('T')[0],
          membership_status: 'active',
        });

      if (patientError) {
        console.error('Error creating patient record:', patientError);
      }

      // If referral code was used, increment the referrer's referral_count
      if (referrerId) {
        // Fetch current count and increment
        const { data: currentMember } = await supabase
          .from('members')
          .select('referral_count')
          .eq('id', referrerId)
          .single();
        
        if (currentMember) {
          await supabase
            .from('members')
            .update({ referral_count: (currentMember.referral_count || 0) + 1 })
            .eq('id', referrerId);
        }
        
        toast.success(`${registerFormData.name} registered! Referral point added to ${registerFormData.referral_code}.`);
      } else {
        toast.success(`${registerFormData.name} registered as ${registerFormData.membership_type} member!`);
      }

      setShowRegisterMember(false);
      setRegisterFormData({
        name: '',
        email: '',
        phone: '',
        membership_type: 'Green',
        payment_method: 'cash',
        referral_code: ''
      });
      
      // Refresh members list
      fetchMembers();
    } catch (error) {
      console.error('Error registering member:', error);
      toast.error('Failed to register member');
    } finally {
      setIsRegistering(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Use fetched members - filter to show only active members
  const activeMembers = members.filter(m => m.status === 'active');

  // Compute dashboard data dynamically
  const totalSales = activeMembers.reduce((sum, m) => sum + (membershipPrices[m.membership_type] || 0), 0);
  const totalMembers = activeMembers.length;
  const pendingConfirmations = pendingMembers.length;
  const activeBookings = bookings.length;

  // Compute membership distribution from actual members data
  const greenCount = activeMembers.filter(m => m.membership_type?.toLowerCase() === 'green').length;
  const goldCount = activeMembers.filter(m => m.membership_type?.toLowerCase() === 'gold').length;
  const platinumCount = activeMembers.filter(m => m.membership_type?.toLowerCase() === 'platinum').length;
  
  const membershipDistribution = [
    { name: 'Green', value: greenCount || 1, color: '#22c55e' },
    { name: 'Gold', value: goldCount || 1, color: '#d4a574' },
    { name: 'Platinum', value: platinumCount || 1, color: '#6b7280' },
  ];

  // Revenue trend showing membership revenue per month
  const monthlySales = [
    { month: 'Jul', revenue: 8888 },
    { month: 'Aug', revenue: 19888 },
    { month: 'Sep', revenue: 8888 },
    { month: 'Oct', revenue: 38888 },
    { month: 'Nov', revenue: 19888 },
    { month: 'Dec', revenue: 8888 },
    { month: 'Jan', revenue: totalSales },
  ];

  // Confirm member - change status to active
  const handleConfirmMember = async (id: string) => {
    try {
      const member = pendingMembers.find(m => m.id === id);
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1);

      const referralCode = member ? generateReferralCode(member.name) : generateReferralCode('MEM');
      
      const { error } = await supabase
        .from('members')
        .update({ 
          status: 'active',
          membership_start_date: new Date().toISOString(),
          membership_expiry_date: expiryDate.toISOString(),
          referral_code: referralCode
        })
        .eq('id', id);

      if (error) throw error;

      // If member was referred, increment referrer's count
      if (member?.referred_by) {
        const { data: referrer } = await supabase
          .from('members')
          .select('id, referral_count')
          .eq('referral_code', member.referred_by)
          .maybeSingle();

        if (referrer) {
          await supabase
            .from('members')
            .update({ referral_count: (referrer.referral_count || 0) + 1 })
            .eq('id', referrer.id);
        }
      }

      // Note: Patient record is now created/updated automatically by the database trigger
      // when member status changes to 'active'

      toast.success(`${member?.name || 'Member'} confirmed successfully!`);
      fetchPendingMembers();
      fetchMembers();
      
      // Navigate to Members tab to show the confirmed member
      setActiveTab('members');
      setShowForConfirmation(false);
    } catch (error) {
      console.error('Error confirming member:', error);
      toast.error('Failed to confirm member');
    }
  };

  // Reject member - change status to rejected
  const handleRejectPendingMember = async (id: string) => {
    try {
      const member = pendingMembers.find(m => m.id === id);
      
      const { error } = await supabase
        .from('members')
        .update({ status: 'rejected' })
        .eq('id', id);

      if (error) throw error;

      toast.success(`${member?.name || 'Member'} rejected and moved to history`);
      fetchPendingMembers();
      fetchRejectedMembers();
      fetchMembers();
    } catch (error) {
      console.error('Error rejecting member:', error);
      toast.error('Failed to reject member');
    }
  };

  // Update booking status
  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev => 
        prev.map(b => b.id === bookingId ? { ...b, status: newStatus } : b)
      );
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  // Open link dialog for a booking (legacy - now redirects to new function)
  const handleAddToRecord = (booking: Booking) => {
    handleAddToPatientRecord(booking);
  };

  // Called when a booking is successfully linked
  const handleBookingLinked = () => {
    fetchData(); // Refresh bookings to get updated patient_id
  };


  const getMembershipColor = (membership: string) => {
    switch (membership) {
      case 'Green': return 'bg-green-500/20 text-green-700 border-green-500/30';
      case 'Gold': return 'bg-accent/20 text-accent border-accent/30';
      case 'Platinum': return 'bg-muted text-muted-foreground border-muted-foreground/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'text-green-700';
      case 'confirmed': return 'bg-transparent text-blue-700';
      case 'active': return 'bg-green-100 text-green-700 border-green-300';
      case 'pending': return 'text-muted-foreground';
      case 'cancelled': return 'text-destructive';
      case 'no-show': return 'text-orange-700';
      case 'expiring': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  // Delete booking function
  const handleDeleteBooking = async (bookingId: string, bookingName: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (error) throw error;

      setBookings(prev => prev.filter(b => b.id !== bookingId));
      toast.success(`Booking for ${bookingName} deleted`);
    } catch (error) {
      console.error('Error deleting booking:', error);
      toast.error('Failed to delete booking');
    }
  };

  // Generate a unique referral code
  const generateReferralCode = (name: string) => {
    const prefix = name.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, 'X');
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}${randomPart}`;
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, gradient }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-elevated transition-all duration-300">
        <div className={`absolute inset-0 opacity-10 ${gradient}`} />
        <CardContent className="p-2.5 sm:p-6 relative">
          <div className="flex items-start justify-between gap-1.5 sm:gap-2">
            <div className="space-y-0.5 sm:space-y-2 min-w-0 flex-1">
              <p className="text-[10px] sm:text-sm text-muted-foreground font-medium leading-tight">{title}</p>
              <p className="text-base sm:text-3xl font-display font-bold text-foreground break-words leading-tight">{value}</p>
              {subtitle && <p className="text-[9px] sm:text-xs text-muted-foreground leading-tight">{subtitle}</p>}
            </div>
            <div className={`p-1.5 sm:p-3 rounded-lg sm:rounded-xl ${gradient} flex-shrink-0`}>
              <Icon className="h-3.5 w-3.5 sm:h-6 sm:w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderDashboard = () => (
    <div className="space-y-3 sm:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
        <h2 className="font-display text-lg sm:text-2xl font-semibold text-foreground">Dashboard Overview</h2>
        <p className="text-[10px] sm:text-sm text-muted-foreground">Last updated: Just now</p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">
        <StatCard icon={DollarSign} title="Total Sales" value={`₱${totalSales.toLocaleString()}`} subtitle="Membership payments" gradient="gradient-accent" />
        <StatCard icon={Users} title="Members" value={totalMembers} subtitle="Active" gradient="bg-green-600" />
        <StatCard icon={Clock} title="Pending" value={pendingConfirmations} subtitle="For confirmation" gradient="bg-amber-500" />
        <StatCard icon={Calendar} title="Bookings" value={activeBookings} subtitle="Active" gradient="bg-sage-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-6">
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="p-2.5 sm:p-6 pb-1 sm:pb-4">
            <CardTitle className="font-display text-sm sm:text-lg">Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-6 pt-0">
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <div className="min-w-[300px]">
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={monthlySales}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={10} tick={{ fontSize: 10 }} />
                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tick={{ fontSize: 10 }} tickFormatter={(value) => `₱${(value/1000)}k`} width={45} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                        fontSize: '12px'
                      }}
                      formatter={(value: number) => [`₱${value.toLocaleString()}`, 'Revenue']}
                    />
                    <Line type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={2} dot={{ fill: 'hsl(var(--accent))', r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader className="p-2.5 sm:p-6 pb-1 sm:pb-4">
            <CardTitle className="font-display text-sm sm:text-lg">Membership Distribution</CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-6 pt-0">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={membershipDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {membershipDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#22c55e' : index === 1 ? '#d4a574' : '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-2 sm:space-y-6">
      <div className="flex flex-col gap-2 sm:gap-4">
        <h2 className="font-display text-lg sm:text-2xl font-semibold text-foreground">Bookings</h2>
        <div className="grid grid-cols-4 sm:flex gap-1.5 sm:gap-3 sm:flex-wrap">
          <AddBookingDialog onBookingAdded={fetchData} />
          <Button variant="outline" className="gap-1 sm:gap-2 h-9 sm:h-10 text-[10px] sm:text-sm px-2 sm:px-4" onClick={fetchData}>
            <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Reload</span>
          </Button>
          <Button variant="outline" className="gap-1 sm:gap-2 h-9 sm:h-10 text-[10px] sm:text-sm px-2 sm:px-4" onClick={() => setShowBookingHistory(true)}>
            <History className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Booking </span>History
          </Button>
          <Button variant="outline" className="gap-1 sm:gap-2 h-9 sm:h-10 text-[10px] sm:text-sm px-2 sm:px-4">
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </div>
      
      <BookingHistory open={showBookingHistory} onOpenChange={setShowBookingHistory} />
      <LinkToPatientDialog 
        open={linkDialogOpen} 
        onOpenChange={setLinkDialogOpen} 
        booking={selectedBookingForLink} 
        onLinked={handleBookingLinked} 
      />

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-2 sm:p-6">
          <div className="flex flex-col gap-2 sm:gap-3 mb-2 sm:mb-6">
            <div className="relative w-full">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 sm:pl-10 h-9 sm:h-10 text-sm"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px] h-9 sm:h-10 text-sm">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="no-show">No-show</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Card Layout */}
          <div className="block sm:hidden space-y-2">
            {bookings
              .filter(booking => filterStatus === 'all' || booking.status === filterStatus)
              .filter(booking => 
                booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                booking.contact_number.includes(searchTerm)
              )
              .map(booking => (
              <Card key={booking.id} className="border-border/50">
                <CardContent className="p-2.5 space-y-2">
                  <div className="flex items-start justify-between gap-1">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-xs">{booking.name}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{booking.email}</p>
                      <p className="text-[10px] text-muted-foreground">{booking.contact_number}</p>
                    </div>
                    <Select 
                      value={booking.status} 
                      onValueChange={(value) => handleStatusChange(booking.id, value)}
                    >
                      <SelectTrigger className="w-[85px] h-7 text-[10px]">
                        <span className={`font-medium capitalize ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                        <SelectItem value="no-show">No-show</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Calendar className="h-2.5 w-2.5" />
                    <span>{booking.preferred_date}</span>
                    <Clock className="h-2.5 w-2.5 ml-1" />
                    <span>{booking.preferred_time}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1 h-8 text-[10px] flex-1 min-w-0 px-2"
                      asChild
                    >
                      <a href={`tel:${booking.contact_number.replace(/-/g, '')}`}>
                        <Phone className="h-3 w-3" />
                        Call
                      </a>
                    </Button>
                    {booking.patient_id || addedToRecord.has(booking.id) ? (
                      <Badge variant="secondary" className="gap-1 text-green-700 bg-green-100 h-8 px-2 text-[10px]">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Added
                      </Badge>
                    ) : hasPatientRecord(booking.email) ? (
                      <Badge variant="secondary" className="gap-1 text-muted-foreground bg-muted h-8 px-2 text-[10px]">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        Record
                      </Badge>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 h-8 text-[10px] flex-1 min-w-0 px-2"
                        onClick={() => handleAddToPatientRecord(booking)}
                      >
                        <FileText className="h-3 w-3" />
                        Add
                      </Button>
                    )}
                    {booking.message && (
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelectedBookingMessage({ name: booking.name, message: booking.message! })}
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="mx-4 max-w-[calc(100vw-2rem)]">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Booking</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete the booking for <strong>{booking.name}</strong>?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
                          <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteBooking(booking.id, booking.name)} 
                            className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Name</th>
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Contact</th>
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Date & Time</th>
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings
                  .filter(booking => filterStatus === 'all' || booking.status === filterStatus)
                  .filter(booking => 
                    booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    booking.contact_number.includes(searchTerm)
                  )
                  .map(booking => (
                  <tr key={booking.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-2 font-medium">{booking.name}</td>
                    <td className="py-4 px-2">
                      <p className="text-sm">{booking.email}</p>
                      <p className="text-xs text-muted-foreground">{booking.contact_number}</p>
                    </td>
                    <td className="py-4 px-2">
                      <p className="text-sm">{booking.preferred_date}</p>
                      <p className="text-xs text-muted-foreground">{booking.preferred_time}</p>
                    </td>
                    <td className="py-4 px-2">
                      <Select 
                        value={booking.status} 
                        onValueChange={(value) => handleStatusChange(booking.id, value)}
                      >
                        <SelectTrigger className="w-[130px] h-8 border-none bg-transparent">
                          <span className={`font-medium capitalize ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                          <SelectItem value="no-show">No-show</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="py-4 px-2">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          asChild
                        >
                          <a href={`tel:${booking.contact_number.replace(/-/g, '')}`}>
                            <Phone className="h-4 w-4" />
                            Call
                          </a>
                        </Button>
                        {booking.patient_id || addedToRecord.has(booking.id) ? (
                          <Badge variant="secondary" className="gap-1 text-green-700 bg-green-100 hover:bg-green-100">
                            <CheckCircle2 className="h-3 w-3" />
                            Added
                          </Badge>
                        ) : hasPatientRecord(booking.email) ? (
                          <Badge variant="secondary" className="gap-1 text-muted-foreground bg-muted hover:bg-muted">
                            <CheckCircle2 className="h-3 w-3" />
                            Has Record
                          </Badge>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleAddToPatientRecord(booking)}
                          >
                            <FileText className="h-4 w-4" />
                            Add to Record
                          </Button>
                        )}
                        {booking.message && (
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => setSelectedBookingMessage({ name: booking.name, message: booking.message! })}
                          >
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Booking</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete the booking for <strong>{booking.name}</strong>? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction 
                                onClick={() => handleDeleteBooking(booking.id, booking.name)} 
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Message dialog for bookings
  const renderMessageDialog = () => (
    <Dialog open={!!selectedBookingMessage} onOpenChange={() => setSelectedBookingMessage(null)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-lg">Message from {selectedBookingMessage?.name}</DialogTitle>
        </DialogHeader>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-foreground">{selectedBookingMessage?.message}</p>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => setSelectedBookingMessage(null)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );


  const renderMembers = () => {
    // If a member is selected, show full-page detail view
    if (selectedMember) {
      return (
        <MemberDetailsView
          member={selectedMember}
          onBack={() => setSelectedMember(null)}
          onViewTransactions={fetchTransactionHistory}
          membershipPrices={membershipPrices}
          getMembershipColor={getMembershipColor}
          getStatusColor={getStatusColor}
          getPaymentMethodIcon={getPaymentMethodIcon}
          getPaymentMethodLabel={getPaymentMethodLabel}
          onUpdate={fetchMembers}
        />
      );
    }

    return (
    <div className="space-y-2 sm:space-y-6">
      <div className="flex flex-col gap-2 sm:gap-4">
        <h2 className="font-display text-lg sm:text-2xl font-semibold text-foreground">Members</h2>
        <div className="grid grid-cols-3 sm:flex gap-1.5 sm:gap-3 sm:flex-wrap">
          <Button 
            className="gap-1 sm:gap-2 bg-accent hover:bg-accent/90 h-9 sm:h-10 text-[10px] sm:text-sm col-span-3 sm:col-span-1 px-2 sm:px-4"
            onClick={() => setShowRegisterMember(true)}
          >
            <UserPlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            Register Member
          </Button>
          <Button variant="outline" className="gap-1 h-9 sm:h-10 text-[10px] sm:text-sm px-2 sm:px-4" onClick={() => { fetchMembers(); toast.success('Members database reloaded'); }}>
            <RefreshCw className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Reload</span>
          </Button>
          <Button 
            variant="outline" 
            className="gap-1 relative h-9 sm:h-10 text-[10px] sm:text-sm px-2 sm:px-4"
            onClick={() => setShowForConfirmation(true)}
          >
            <UserCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">For </span>Confirm
            {pendingConfirmations > 0 && (
              <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-destructive text-white text-[9px] sm:text-xs flex items-center justify-center">
                {pendingConfirmations}
              </span>
            )}
          </Button>
          <Button 
            variant="outline" 
            className="gap-1 relative h-9 sm:h-10 text-[10px] sm:text-sm px-2 sm:px-4"
            onClick={() => { fetchRejectedMembers(); setShowRejectionHistory(true); }}
          >
            <History className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Rejection </span>History
            {rejectedMembers.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 sm:-top-2 sm:-right-2 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-muted-foreground text-white text-[9px] sm:text-xs flex items-center justify-center">
                {rejectedMembers.length}
              </span>
            )}
          </Button>
          <Button variant="outline" className="gap-1 h-9 sm:h-10 text-[10px] sm:text-sm px-2 sm:px-4">
            <Download className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button 
            variant="outline" 
            className="gap-1 relative h-9 sm:h-10 text-[10px] sm:text-sm px-2 sm:px-4 border-destructive/50 text-destructive hover:bg-destructive/10"
            onClick={() => setShowExpiredMembers(true)}
          >
            <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Expired</span>
          </Button>
        </div>
      </div>

      {/* Admin Settings Dialog */}
      <AdminSettingsDialog 
        open={showAdminSettings} 
        onOpenChange={setShowAdminSettings} 
      />

      {/* Expired Members Dialog */}
      <ExpiredMembersDialog 
        open={showExpiredMembers} 
        onOpenChange={setShowExpiredMembers}
        onMemberRenewed={fetchMembers}
      />

      {/* For Confirmation Dialog */}
      <Dialog open={showForConfirmation} onOpenChange={setShowForConfirmation}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-accent" />
              For Confirmation ({pendingConfirmations})
            </DialogTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                fetchPendingMembers();
                toast.success("Pending confirmations updated");
              }}
              className="ml-auto mr-8"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Reload
            </Button>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {pendingMembers.length > 0 ? (
              pendingMembers.map(member => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-border/50 bg-card/80">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="font-medium">{member.name}</h3>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                          {member.phone && (
                            <p className="text-xs text-muted-foreground">{member.phone}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className={getMembershipColor(member.membership_type)}>
                              {member.membership_type}
                            </Badge>
                            <span className="text-sm font-medium">
                              ₱{(membershipPrices[member.membership_type] || 0).toLocaleString()}
                            </span>
                          </div>
                          {member.payment_method && (
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1">
                                {getPaymentMethodIcon(member.payment_method)}
                                <span className="text-xs font-medium">{getPaymentMethodLabel(member.payment_method)}</span>
                              </div>
                              <Badge 
                                variant="outline" 
                                className={member.payment_status === 'paid' ? 'bg-green-500/10 text-green-600 border-green-500/30' : 'bg-amber-500/10 text-amber-600 border-amber-500/30'}
                              >
                                {member.payment_status === 'paid' ? 'Paid' : 'Pending'}
                              </Badge>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Date: {new Date(member.created_at).toLocaleDateString()}
                          </p>
                          {/* Referral info */}
                          <div className="flex items-center gap-4 mt-2">
                            {member.referred_by && (
                              <div className="flex items-center gap-1">
                                <Gift className="h-3 w-3 text-accent" />
                                <span className="text-xs text-muted-foreground">
                                  Referred by: <span className="font-medium text-foreground">{member.referred_by_name}</span>
                                  <span className="text-muted-foreground/70 ml-1">({member.referred_by})</span>
                                </span>
                              </div>
                            )}
                            {member.referral_count > 0 && (
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3 text-green-500" />
                                <span className="text-xs text-muted-foreground">
                                  Referrals: <span className="font-medium text-green-600">{member.referral_count}</span>
                                </span>
                              </div>
                            )}
                          </div>
                          {/* Stripe info - shows when connected */}
                          {member.stripe_payment_intent_id && (
                            <div className="mt-2 p-2 bg-muted/30 rounded-md">
                              <p className="text-xs text-muted-foreground flex items-center gap-1">
                                <CreditCard className="h-3 w-3" /> Stripe Payment
                              </p>
                              <p className="text-xs font-mono text-muted-foreground truncate">
                                {member.stripe_payment_intent_id}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          {/* Receipt button - shows when Stripe receipt available */}
                          {member.stripe_receipt_url && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-1"
                              asChild
                            >
                              <a href={member.stripe_receipt_url} target="_blank" rel="noopener noreferrer">
                                <Receipt className="h-4 w-4" />
                                Receipt
                                <ExternalLink className="h-3 w-3" />
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            asChild
                          >
                            <a href={`tel:${(member.phone || '').replace(/-/g, '')}`}>
                              <Phone className="h-4 w-4" />
                              Call
                            </a>
                          </Button>
                          <Button 
                            onClick={() => handleConfirmMember(member.id)}
                            size="sm"
                            className="gap-1 bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="h-4 w-4" />
                            Confirm
                          </Button>
                          <Button 
                            onClick={() => handleRejectPendingMember(member.id)}
                            variant="destructive"
                            size="sm"
                            className="gap-1"
                          >
                            <XCircle className="h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                <p className="text-muted-foreground">No pending confirmations</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Rejection History Dialog */}
      <Dialog open={showRejectionHistory} onOpenChange={setShowRejectionHistory}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader className="flex flex-row items-center justify-between">
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <History className="h-5 w-5 text-muted-foreground" />
              Rejection History ({rejectedMembers.length})
            </DialogTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                fetchRejectedMembers();
                toast.success("Rejection history updated");
              }}
              className="ml-auto mr-8"
            >
              <RefreshCw className="h-4 w-4 mr-1" />
              Reload
            </Button>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {rejectedMembers.length > 0 ? (
              rejectedMembers.map(member => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-border/50 bg-card/80 opacity-75">
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{member.name}</h3>
                            <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                              Rejected
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{member.email}</p>
                          {member.phone && (
                            <p className="text-xs text-muted-foreground">{member.phone}</p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="outline" className={getMembershipColor(member.membership_type)}>
                              {member.membership_type}
                            </Badge>
                            <span className="text-sm font-medium">
                              ₱{(membershipPrices[member.membership_type] || 0).toLocaleString()}
                            </span>
                          </div>
                          {member.payment_method && (
                            <div className="flex items-center gap-3 mt-2">
                              <div className="flex items-center gap-1">
                                {getPaymentMethodIcon(member.payment_method)}
                                <span className="text-xs font-medium">{getPaymentMethodLabel(member.payment_method)}</span>
                              </div>
                            </div>
                          )}
                          <p className="text-xs text-muted-foreground mt-1">
                            Applied: {new Date(member.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-destructive/80 mt-1">
                            Rejected: {new Date(member.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2 flex-shrink-0">
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1"
                            onClick={async () => {
                              try {
                                const expiryDate = new Date();
                                expiryDate.setFullYear(expiryDate.getFullYear() + 1);
                                
                                const { error } = await supabase
                                  .from('members')
                                  .update({ 
                                    status: 'active',
                                    membership_start_date: new Date().toISOString(),
                                    membership_expiry_date: expiryDate.toISOString()
                                  })
                                  .eq('id', member.id);

                                if (error) throw error;

                                toast.success(`${member.name} has been restored as active member!`);
                                fetchRejectedMembers();
                                fetchMembers();
                              } catch (error) {
                                console.error('Error restoring member:', error);
                                toast.error('Failed to restore member');
                              }
                            }}
                          >
                            <CheckCircle className="h-4 w-4" />
                            Restore
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            className="gap-1"
                            onClick={async () => {
                              try {
                                const { error } = await supabase
                                  .from('members')
                                  .delete()
                                  .eq('id', member.id);

                                if (error) throw error;

                                toast.success(`${member.name} permanently deleted`);
                                fetchRejectedMembers();
                              } catch (error) {
                                console.error('Error deleting member:', error);
                                toast.error('Failed to delete member');
                              }
                            }}
                          >
                            <XCircle className="h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No rejected members in history</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Register Member Dialog - For Walk-in Clients */}
      <Dialog open={showRegisterMember} onOpenChange={setShowRegisterMember}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <UserPlus className="h-5 w-5 text-accent" />
              Register Walk-in Member
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name <span className="text-destructive">*</span></label>
                <Input
                  placeholder="Enter full name"
                  value={registerFormData.name}
                  onChange={(e) => setRegisterFormData(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Contact Number <span className="text-destructive">*</span></label>
                <Input
                  placeholder="09XX XXX XXXX"
                  value={registerFormData.phone}
                  onChange={(e) => setRegisterFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address <span className="text-destructive">*</span></label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={registerFormData.email}
                onChange={(e) => setRegisterFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Membership Type <span className="text-destructive">*</span></label>
                <Select 
                  value={registerFormData.membership_type}
                  onValueChange={(value) => setRegisterFormData(prev => ({ ...prev, membership_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select membership" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Green">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Green - ₱8,888
                      </div>
                    </SelectItem>
                    <SelectItem value="Gold">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        Gold - ₱18,888
                      </div>
                    </SelectItem>
                    <SelectItem value="Platinum">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-slate-400"></span>
                        Platinum - ₱38,888
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Method <span className="text-destructive">*</span></label>
                <Select 
                  value={registerFormData.payment_method}
                  onValueChange={(value) => setRegisterFormData(prev => ({ ...prev, payment_method: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">
                      <div className="flex items-center gap-2">
                        <Banknote className="h-4 w-4 text-green-600" />
                        Cash
                      </div>
                    </SelectItem>
                    <SelectItem value="gcash">
                      <div className="flex items-center gap-2">
                        <Wallet className="h-4 w-4 text-blue-500" />
                        GCash
                      </div>
                    </SelectItem>
                    <SelectItem value="card">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-purple-500" />
                        Card
                      </div>
                    </SelectItem>
                    <SelectItem value="bank_transfer">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-green-500" />
                        Bank Transfer
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1.5">
                <Gift className="h-3.5 w-3.5 text-accent" />
                Referral Code <span className="text-muted-foreground">(optional)</span>
              </label>
              <Input
                placeholder="Enter referral code"
                value={registerFormData.referral_code}
                onChange={(e) => setRegisterFormData(prev => ({ ...prev, referral_code: e.target.value.toUpperCase() }))}
                maxLength={10}
                className="uppercase"
              />
            </div>

            {/* Summary */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="font-medium text-sm">Registration Summary</h4>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Membership</span>
                <Badge variant="outline" className={getMembershipColor(registerFormData.membership_type)}>
                  {registerFormData.membership_type}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold">₱{(membershipPrices[registerFormData.membership_type] || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment</span>
                <div className="flex items-center gap-1">
                  {registerFormData.payment_method === 'cash' && <Banknote className="h-3.5 w-3.5 text-green-600" />}
                  {registerFormData.payment_method === 'gcash' && <Wallet className="h-3.5 w-3.5 text-blue-500" />}
                  {registerFormData.payment_method === 'card' && <CreditCard className="h-3.5 w-3.5 text-purple-500" />}
                  {registerFormData.payment_method === 'bank_transfer' && <DollarSign className="h-3.5 w-3.5 text-green-500" />}
                  <span className="font-medium">{getPaymentMethodLabel(registerFormData.payment_method, true)}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => {
                  setShowRegisterMember(false);
                  setRegisterFormData({
                    name: '',
                    email: '',
                    phone: '',
                    membership_type: 'Green',
                    payment_method: 'cash',
                    referral_code: ''
                  });
                }}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-accent hover:bg-accent/90 gap-2"
                disabled={!registerFormData.name || !registerFormData.email || !registerFormData.phone || isRegistering}
                onClick={handleRegisterMember}
              >
                {isRegistering ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4" />
                    Register Member
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
        <CardContent className="p-2 sm:p-6">
          <div className="mb-2 sm:mb-6">
            <div className="relative w-full sm:max-w-md">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 sm:pl-10 h-9 sm:h-10 text-sm"
              />
            </div>
          </div>

          {/* Mobile Card Layout */}
          <div className="block sm:hidden space-y-2">
            {activeMembers
              .filter(member => 
                member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                member.email.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map(member => {
                const daysLeft = calculateDaysLeft(member.membership_expiry_date);
                return (
                  <Card key={member.id} className="border-border/50">
                    <CardContent className="p-2.5 space-y-1.5">
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-xs">{member.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{member.email}</p>
                        </div>
                        <Badge variant="outline" className={`${getMembershipColor(member.membership_type)} text-[10px] px-1.5 py-0.5`}>
                          {member.membership_type}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-2.5 w-2.5 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            {member.membership_start_date 
                              ? new Date(member.membership_start_date).toLocaleDateString()
                              : new Date(member.created_at).toLocaleDateString()
                            }
                          </span>
                        </div>
                        {daysLeft !== null && (
                          <span className={`font-medium ${daysLeft <= 30 ? 'text-destructive' : daysLeft <= 90 ? 'text-amber-500' : 'text-green-600'}`}>
                            {daysLeft > 0 ? `${daysLeft}d` : 'Exp'}
                          </span>
                        )}
                        <Badge className={`${getStatusColor(member.status)} text-[10px] px-1.5 py-0`}>
                          {member.status}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {member.referral_code && (
                            <div className="flex items-center gap-0.5">
                              <code className="text-[10px] font-mono bg-muted px-1 py-0.5 rounded">{member.referral_code}</code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5"
                                onClick={() => copyToClipboard(member.referral_code!)}
                              >
                                <Copy className="h-2.5 w-2.5" />
                              </Button>
                            </div>
                          )}
                          <div className="flex items-center gap-0.5">
                            <Gift className="h-2.5 w-2.5 text-accent" />
                            <span className="text-[10px] font-medium">{member.referral_count || 0}</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 gap-1 text-[10px] px-2"
                          onClick={() => setSelectedMember(member)}
                        >
                          <Eye className="h-3 w-3" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Member</th>
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Membership</th>
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Referral Code</th>
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Referrals</th>
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Join Date</th>
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Days Left</th>
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {activeMembers
                  .filter(member => 
                    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    member.email.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map(member => {
                    const daysLeft = calculateDaysLeft(member.membership_expiry_date);
                    return (
                      <tr key={member.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-2">
                          <p className="font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </td>
                        <td className="py-4 px-2">
                          <Badge variant="outline" className={getMembershipColor(member.membership_type)}>
                            {member.membership_type}
                          </Badge>
                        </td>
                        <td className="py-4 px-2">
                          {member.referral_code ? (
                            <div className="flex items-center gap-1">
                              <code className="text-xs font-mono bg-muted px-2 py-1 rounded">{member.referral_code}</code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => copyToClipboard(member.referral_code!)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-4 px-2">
                          <div className="flex items-center gap-1">
                            <Gift className="h-4 w-4 text-accent" />
                            <span className="text-sm font-medium">{member.referral_count || 0}</span>
                          </div>
                        </td>
                        <td className="py-4 px-2 text-sm">
                          {member.membership_start_date 
                            ? new Date(member.membership_start_date).toLocaleDateString()
                            : new Date(member.created_at).toLocaleDateString()
                          }
                        </td>
                        <td className="py-4 px-2">
                          {daysLeft !== null ? (
                            <span className={`text-sm font-medium ${daysLeft <= 30 ? 'text-destructive' : daysLeft <= 90 ? 'text-amber-500' : 'text-green-600'}`}>
                              {daysLeft > 0 ? `${daysLeft} days` : 'Expired'}
                            </span>
                          ) : (
                            <span className="text-sm text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="py-4 px-2">
                          <Badge className={getStatusColor(member.status)}>
                            {member.status}
                          </Badge>
                        </td>
                        <td className="py-4 px-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedMember(member)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>


      {/* Transaction History Dialog */}
      <Dialog open={showTransactionHistory} onOpenChange={setShowTransactionHistory}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-xl flex items-center gap-2">
              <History className="h-5 w-5 text-accent" />
              Transaction History
            </DialogTitle>
            <p className="text-sm text-muted-foreground">{transactionMemberName}</p>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {selectedMemberTransactions.length > 0 ? (
              selectedMemberTransactions.map(tx => (
                <Card key={tx.id} className="border-border/50">
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getPaymentMethodIcon(tx.payment_method)}
                        <div>
                          <p className="text-sm font-medium capitalize">{tx.description || tx.transaction_type?.replace('_', ' ')}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(tx.created_at).toLocaleDateString()} at {new Date(tx.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₱{Number(tx.amount).toLocaleString()}</p>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${tx.payment_status === 'completed' ? 'bg-green-500/10 text-green-600 border-green-500/30' : tx.payment_status === 'failed' ? 'bg-red-500/10 text-red-600 border-red-500/30' : 'bg-amber-500/10 text-amber-600 border-amber-500/30'}`}
                        >
                          {tx.payment_status}
                        </Badge>
                      </div>
                    </div>
                    {(tx.stripe_payment_intent_id || tx.stripe_receipt_url) && (
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/50">
                        <p className="text-xs font-mono text-muted-foreground truncate flex-1">
                          {tx.stripe_payment_intent_id && `Stripe: ${tx.stripe_payment_intent_id}`}
                        </p>
                        {tx.stripe_receipt_url && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1 h-6 text-xs"
                            asChild
                          >
                            <a href={tx.stripe_receipt_url} target="_blank" rel="noopener noreferrer">
                              <Receipt className="h-3 w-3" />
                              View Receipt
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No transactions found</p>
                <p className="text-xs text-muted-foreground mt-1">Transactions will appear here when payments are recorded</p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
    );
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'patient-records', label: 'Records' },
    { id: 'members', label: 'Members' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-soft">
        <div className="container mx-auto px-2 sm:px-4 py-2 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" onClick={() => navigate('/')}>
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
              <div className="flex items-center gap-2 sm:gap-3">
                <img src="https://i.imgur.com/9beP2dq.png" alt="Hilomè" className="h-6 sm:h-8" />
                <span className="font-display text-base sm:text-xl font-semibold text-foreground">Admin</span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <span className="text-sm text-muted-foreground hidden md:block">Dr. Herbert Ryan Cruz</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="relative focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full">
                    <img 
                      src="/dr-herbert-cruz.jpg" 
                      alt="Dr. Herbert Ryan Cruz" 
                      className="h-7 w-7 sm:h-9 sm:w-9 rounded-full object-cover border-2 border-primary/20 hover:border-primary/50 transition-colors cursor-pointer"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => setShowAdminSettings(true)} className="cursor-pointer">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => {
                      clearAdminAuth();
                      window.location.reload();
                    }}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-card border-b border-border">
        <div className="container mx-auto px-1 sm:px-4">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 sm:py-4 px-2 sm:px-6 border-b-2 transition-all whitespace-nowrap relative text-center flex-1 min-w-[60px] text-[11px] sm:text-sm ${
                  index < tabs.length - 1 ? 'border-r border-border' : ''
                } ${
                  activeTab === tab.id
                    ? 'border-b-accent text-accent font-medium'
                    : 'border-b-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-2 sm:px-4 py-2 sm:py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'patient-records' && <PatientRecords />}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'members' && renderMembers()}
      </main>

      {/* Message Dialog */}
      {renderMessageDialog()}
    </div>
  );
};

// Wrap the dashboard with authentication
const AdminPage = () => (
  <AdminAuth>
    <HilomeAdminDashboard />
  </AdminAuth>
);

export default AdminPage;
