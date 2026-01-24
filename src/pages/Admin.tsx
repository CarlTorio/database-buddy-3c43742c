import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Users, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, Search, Download, Eye, ArrowLeft, History, Phone, CreditCard, Wallet, Gift, Copy, UserCheck, FileText, MessageSquare, RefreshCw, Receipt, ExternalLink, UserPlus, Banknote, Link2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BookingHistory from '@/components/BookingHistory';
import PatientRecords from '@/components/PatientRecords';
import AddBookingDialog from '@/components/AddBookingDialog';
import LinkToPatientDialog from '@/components/LinkToPatientDialog';
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
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [selectedBookingForLink, setSelectedBookingForLink] = useState<Booking | null>(null);

  // Fetch data from database
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBookings(data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load data');
    } finally {
      setIsLoading(false);
    }
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
          membership_expiry_date: expiryDate.toISOString()
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

  // Compute membership distribution (placeholder data)
  const membershipDistribution = [
    { name: 'Green', value: 0, color: 'hsl(var(--green-600))' },
    { name: 'Gold', value: 0, color: 'hsl(var(--accent))' },
    { name: 'Platinum', value: 0, color: 'hsl(var(--muted-foreground))' },
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

      const { error } = await supabase
        .from('members')
        .update({ 
          status: 'active',
          membership_start_date: new Date().toISOString(),
          membership_expiry_date: expiryDate.toISOString()
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

      // Automatically create patient record for the confirmed member with member_id link
      if (member) {
        // First check if patient with this email already exists
        const { data: existingPatient } = await supabase
          .from('patient_records')
          .select('id')
          .eq('email', member.email.toLowerCase().trim())
          .maybeSingle();

        if (existingPatient) {
          // Update existing patient with member link
          await supabase
            .from('patient_records')
            .update({
              member_id: id,
              membership: member.membership_type,
              membership_join_date: new Date().toISOString().split('T')[0],
              membership_expiry_date: expiryDate.toISOString().split('T')[0],
              membership_status: 'active',
            })
            .eq('id', existingPatient.id);
        } else {
          // Create new patient record
          const { error: patientError } = await supabase
            .from('patient_records')
            .insert({
              name: member.name,
              email: member.email.toLowerCase().trim(),
              contact_number: member.phone || null,
              membership: member.membership_type,
              member_id: id,
              source: 'membership',
              membership_join_date: new Date().toISOString().split('T')[0],
              membership_expiry_date: expiryDate.toISOString().split('T')[0],
              membership_status: 'active',
            });

          if (patientError) {
            console.error('Error creating patient record:', patientError);
          }
        }
      }

      toast.success(`${member?.name || 'Member'} confirmed successfully!`);
      fetchPendingMembers();
      fetchMembers();
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

  // Open link dialog for a booking
  const handleAddToRecord = (booking: Booking) => {
    setSelectedBookingForLink(booking);
    setLinkDialogOpen(true);
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
      case 'confirmed':
      case 'active': return 'bg-transparent text-blue-700';
      case 'pending': return 'text-muted-foreground';
      case 'cancelled': return 'text-destructive';
      case 'no-show': return 'text-orange-700';
      case 'expiring': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, gradient }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-elevated transition-all duration-300">
        <div className={`absolute inset-0 opacity-10 ${gradient}`} />
        <CardContent className="p-6 relative">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground font-medium">{title}</p>
              <p className="text-3xl font-display font-bold text-foreground">{value}</p>
              {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
            </div>
            <div className={`p-3 rounded-xl ${gradient}`}>
              <Icon className="h-6 w-6 text-white" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl font-semibold text-foreground">Dashboard Overview</h2>
        <p className="text-sm text-muted-foreground">Last updated: Just now</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={DollarSign} title="Total Sales" value={`₱${totalSales.toLocaleString()}`} subtitle="Based on membership payments" gradient="gradient-accent" />
        <StatCard icon={Users} title="Total Members" value={totalMembers} subtitle="Active memberships" gradient="bg-green-600" />
        <StatCard icon={Clock} title="For Confirmation" value={pendingConfirmations} subtitle="Awaiting confirmation" gradient="bg-amber-500" />
        <StatCard icon={Calendar} title="Active Bookings" value={activeBookings} subtitle="This week" gradient="bg-sage-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-display text-lg">Revenue Trend (Membership)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlySales}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `₱${(value/1000)}k`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`₱${value.toLocaleString()}`, 'Revenue']}
                />
                <Line type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" strokeWidth={3} dot={{ fill: 'hsl(var(--accent))' }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="font-display text-lg">Membership Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={membershipDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {membershipDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#22c55e' : index === 1 ? '#d4a574' : '#6b7280'} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderBookings = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold text-foreground">Bookings Management</h2>
        <div className="flex gap-3 flex-wrap">
          <AddBookingDialog onBookingAdded={fetchData} />
          <Button variant="outline" className="gap-2" onClick={fetchData}>
            <RefreshCw className="h-4 w-4" />
            Reload
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => setShowBookingHistory(true)}>
            <History className="h-4 w-4" />
            Booking History
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Data
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
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search bookings..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
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

          <div className="overflow-x-auto">
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
                        {booking.patient_id ? (
                          <Badge variant="secondary" className="gap-1 text-green-700 bg-green-100 hover:bg-green-100">
                            <CheckCircle2 className="h-3 w-3" />
                            Linked
                          </Badge>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => handleAddToRecord(booking)}
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


  const renderMembers = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold text-foreground">Members Database</h2>
        <div className="flex gap-3 flex-wrap">
          <Button 
            className="gap-2 bg-accent hover:bg-accent/90"
            onClick={() => setShowRegisterMember(true)}
          >
            <UserPlus className="h-4 w-4" />
            Register Member
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => { fetchMembers(); toast.success('Members database reloaded'); }}>
            <RefreshCw className="h-4 w-4" />
            Reload
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 relative"
            onClick={() => setShowForConfirmation(true)}
          >
            <UserCheck className="h-4 w-4" />
            For Confirmation
            {pendingConfirmations > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center">
                {pendingConfirmations}
              </span>
            )}
          </Button>
          <Button 
            variant="outline" 
            className="gap-2 relative"
            onClick={() => { fetchRejectedMembers(); setShowRejectionHistory(true); }}
          >
            <History className="h-4 w-4" />
            Rejection History
            {rejectedMembers.length > 0 && (
              <span className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-muted-foreground text-white text-xs flex items-center justify-center">
                {rejectedMembers.length}
              </span>
            )}
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Members
          </Button>
        </div>
      </div>

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
        <CardContent className="p-6">
          <div className="mb-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
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
                {activeMembers.map(member => {
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

      <Dialog open={!!selectedMember} onOpenChange={() => setSelectedMember(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-xl">Member Details</DialogTitle>
          </DialogHeader>
          {selectedMember && (
            <div className="grid grid-cols-2 gap-4 py-4">
              <div>
                <p className="text-xs text-muted-foreground">Full Name</p>
                <p className="font-medium">{selectedMember.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Membership Type</p>
                <Badge variant="outline" className={getMembershipColor(selectedMember.membership_type)}>
                  {selectedMember.membership_type}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm">{selectedMember.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm">{selectedMember.phone || '—'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Membership Start</p>
                <p className="text-sm">
                  {selectedMember.membership_start_date 
                    ? new Date(selectedMember.membership_start_date).toLocaleDateString() 
                    : new Date(selectedMember.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Membership Expiry</p>
                <p className="text-sm">
                  {selectedMember.membership_expiry_date 
                    ? new Date(selectedMember.membership_expiry_date).toLocaleDateString() 
                    : '—'}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge className={getStatusColor(selectedMember.status)}>
                  {selectedMember.status}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Membership Fee</p>
                <p className="font-medium">₱{(membershipPrices[selectedMember.membership_type] || 0).toLocaleString()}</p>
              </div>

              {/* Referral Section */}
              <div className="col-span-2 border-t border-border pt-4 mt-2">
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  <Gift className="h-3 w-3" /> Referral Information
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Referral Code</p>
                    {selectedMember.referral_code ? (
                      <div className="flex items-center gap-2">
                        <code className="font-mono font-medium bg-muted px-2 py-1 rounded text-sm">{selectedMember.referral_code}</code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => copyToClipboard(selectedMember.referral_code)}
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
                    <p className="font-medium text-accent">{selectedMember.referral_count || 0}</p>
                  </div>
                </div>
              </div>

              {/* Payment Section */}
              <div className="col-span-2 border-t border-border pt-4 mt-2">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <CreditCard className="h-3 w-3" /> Payment Information
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1 h-7 text-xs"
                    onClick={() => fetchTransactionHistory(selectedMember.id, selectedMember.name)}
                  >
                    <History className="h-3 w-3" />
                    View History
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Payment Method</p>
                    <div className="flex items-center gap-1 mt-1">
                      {getPaymentMethodIcon(selectedMember.payment_method || selectedMember.payment_method_type)}
                      <p className="font-medium capitalize">
                        {getPaymentMethodLabel(selectedMember.payment_method || selectedMember.payment_method_type)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment Status</p>
                    <Badge 
                      variant="outline" 
                      className={`mt-1 ${selectedMember.payment_status === 'paid' || selectedMember.payment_status === 'completed' ? 'bg-green-500/10 text-green-600 border-green-500/30' : 'bg-amber-500/10 text-amber-600 border-amber-500/30'}`}
                    >
                      {selectedMember.payment_status === 'paid' || selectedMember.payment_status === 'completed' ? 'Paid' : selectedMember.payment_status || 'Pending'}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Amount Paid</p>
                    <p className="font-medium">
                      {selectedMember.amount_paid ? `₱${Number(selectedMember.amount_paid).toLocaleString()}` : '—'}
                    </p>
                  </div>
                  {(selectedMember.stripe_payment_intent_id || selectedMember.stripe_customer_id) && (
                    <div className="col-span-2 bg-muted/30 rounded-lg p-2">
                      <p className="text-xs text-muted-foreground mb-1">Stripe Integration (Ready)</p>
                      {selectedMember.stripe_payment_intent_id && (
                        <p className="text-xs font-mono text-muted-foreground">Intent: {selectedMember.stripe_payment_intent_id}</p>
                      )}
                      {selectedMember.stripe_customer_id && (
                        <p className="text-xs font-mono text-muted-foreground">Customer: {selectedMember.stripe_customer_id}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

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

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'patient-records', label: 'Patient Records' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'members', label: 'Members' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-soft">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <img src="https://i.imgur.com/9beP2dq.png" alt="Hilomè" className="h-8" />
                <span className="font-display text-xl font-semibold text-foreground">Admin Portal</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden md:block">Admin User</span>
              <div className="h-9 w-9 rounded-full gradient-accent flex items-center justify-center text-white font-medium">
                A
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-4">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 border-b-2 transition-all whitespace-nowrap relative text-center ${
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
      <main className="container mx-auto px-4 py-8">
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

export default HilomeAdminDashboard;
