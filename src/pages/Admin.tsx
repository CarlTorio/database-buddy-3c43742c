import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Users, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, Search, Download, Eye, ArrowLeft, History, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import BookingHistory from '@/components/BookingHistory';

const HilomeAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedMember, setSelectedMember] = useState<any>(null);
  const [showBookingHistory, setShowBookingHistory] = useState(false);

  const membershipPrices: Record<string, number> = {
    Green: 8888,
    Gold: 19888,
    Platinum: 38888
  };

  const [bookings, setBookings] = useState([
    { id: 1, name: 'Maria Santos', email: 'maria@email.com', phone: '0917-123-4567', date: '2026-01-20', time: '10:00 AM', membership: 'Gold', status: 'confirmed' },
    { id: 2, name: 'Juan Dela Cruz', email: 'juan@email.com', phone: '0918-234-5678', date: '2026-01-21', time: '2:00 PM', membership: 'Platinum', status: 'pending' },
    { id: 3, name: 'Ana Reyes', email: 'ana@email.com', phone: '0919-345-6789', date: '2026-01-22', time: '11:00 AM', membership: 'Green', status: 'confirmed' },
  ]);

  const [applications, setApplications] = useState([
    { id: 1, name: 'Carlos Rivera', email: 'carlos@email.com', phone: '0920-456-7890', membership: 'Gold', amount: 19888, status: 'pending', appliedDate: '2026-01-10' },
    { id: 2, name: 'Sofia Gonzales', email: 'sofia@email.com', phone: '0921-567-8901', membership: 'Platinum', amount: 38888, status: 'pending', appliedDate: '2026-01-12' },
  ]);

  const [members, setMembers] = useState([
    { id: 1, name: 'Isabella Torres', email: 'isabella@email.com', phone: '0922-678-9012', membership: 'Gold', joinDate: '2025-07-15', lastPayment: '2025-07-15', expirationDate: '2026-07-15', daysRemaining: 182, totalPaid: 19888, status: 'active' },
    { id: 2, name: 'Miguel Castro', email: 'miguel@email.com', phone: '0923-789-0123', membership: 'Platinum', joinDate: '2025-09-01', lastPayment: '2025-09-01', expirationDate: '2026-09-01', daysRemaining: 230, totalPaid: 38888, status: 'active' },
    { id: 3, name: 'Gabriela Mendoza', email: 'gab@email.com', phone: '0924-890-1234', membership: 'Green', joinDate: '2025-10-20', lastPayment: '2025-10-20', expirationDate: '2026-10-20', daysRemaining: 279, totalPaid: 8888, status: 'active' },
    { id: 4, name: 'Ricardo Lopez', email: 'ricardo@email.com', phone: '0925-901-2345', membership: 'Gold', joinDate: '2025-12-01', lastPayment: '2025-12-01', expirationDate: '2026-01-25', daysRemaining: 11, totalPaid: 19888, status: 'expiring' },
  ]);

  // Compute dashboard data dynamically
  const totalSales = members.reduce((sum, member) => sum + (member.totalPaid || membershipPrices[member.membership] || 0), 0);
  const totalMembers = members.length;
  const pendingApplications = applications.filter(app => app.status === 'pending').length;
  const activeBookings = bookings.length;

  // Compute membership distribution dynamically
  const membershipDistribution = [
    { name: 'Green', value: members.filter(m => m.membership === 'Green').length, color: 'hsl(var(--green-600))' },
    { name: 'Gold', value: members.filter(m => m.membership === 'Gold').length, color: 'hsl(var(--accent))' },
    { name: 'Platinum', value: members.filter(m => m.membership === 'Platinum').length, color: 'hsl(var(--muted-foreground))' },
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

  const handleApproveApplication = (id: number) => {
    const app = applications.find(a => a.id === id);
    if (!app) return;
    
    setApplications(applications.filter(a => a.id !== id));
    
    const newMember = {
      id: members.length + 1,
      name: app.name,
      email: app.email,
      phone: app.phone,
      membership: app.membership,
      joinDate: new Date().toISOString().split('T')[0],
      lastPayment: new Date().toISOString().split('T')[0],
      expirationDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
      daysRemaining: 365,
      totalPaid: app.amount,
      status: 'active'
    };
    
    setMembers([...members, newMember]);
  };

  const handleRejectApplication = (id: number) => {
    setApplications(applications.map(a => 
      a.id === id ? { ...a, status: 'rejected' } : a
    ));
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
    switch (status) {
      case 'confirmed':
      case 'active': return 'bg-green-500/20 text-green-700';
      case 'pending': return 'bg-accent/20 text-accent';
      case 'expiring': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted text-muted-foreground';
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
        <StatCard icon={Clock} title="Pending Applications" value={pendingApplications} subtitle="Awaiting review" gradient="bg-amber-500" />
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
        <div className="flex gap-3">
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
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
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
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Membership</th>
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
                    booking.phone.includes(searchTerm)
                  )
                  .map(booking => (
                  <tr key={booking.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-2 font-medium">{booking.name}</td>
                    <td className="py-4 px-2">
                      <p className="text-sm">{booking.email}</p>
                      <p className="text-xs text-muted-foreground">{booking.phone}</p>
                    </td>
                    <td className="py-4 px-2">
                      <p className="text-sm">{booking.date}</p>
                      <p className="text-xs text-muted-foreground">{booking.time}</p>
                    </td>
                    <td className="py-4 px-2">
                      <Badge variant="outline" className={getMembershipColor(booking.membership)}>
                        {booking.membership}
                      </Badge>
                    </td>
                    <td className="py-4 px-2">
                      <Badge className={getStatusColor(booking.status)}>
                        {booking.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        asChild
                      >
                        <a href={`tel:${booking.phone.replace(/-/g, '')}`}>
                          <Phone className="h-4 w-4" />
                          Call
                        </a>
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
  );

  const renderApplications = () => (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-semibold text-foreground">Membership Applications</h2>

      <div className="grid gap-4">
        {applications.filter(app => app.status === 'pending').map(app => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-card transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-2">
                    <h3 className="font-display text-lg font-semibold">{app.name}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>Email: {app.email}</span>
                      <span>Phone: {app.phone}</span>
                      <span>Applied: {app.appliedDate}</span>
                    </div>
                    <Badge variant="outline" className={getMembershipColor(app.membership)}>
                      {app.membership} - ₱{app.amount.toLocaleString()}
                    </Badge>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      asChild
                    >
                      <a href={`tel:${app.phone.replace(/-/g, '')}`}>
                        <Phone className="h-4 w-4" />
                        Call
                      </a>
                    </Button>
                    <Button 
                      onClick={() => handleApproveApplication(app.id)}
                      className="gap-2 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve
                    </Button>
                    <Button 
                      onClick={() => handleRejectApplication(app.id)}
                      variant="destructive"
                      className="gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Canceled
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
        
        {applications.filter(app => app.status === 'pending').length === 0 && (
          <Card className="border-border/50 bg-card/80">
            <CardContent className="p-12 text-center">
              <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
              <p className="text-muted-foreground">No pending applications</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const renderMembers = () => (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="font-display text-2xl font-semibold text-foreground">Members Database</h2>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export Members
        </Button>
      </div>

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
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Join Date</th>
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Expiration</th>
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Days Left</th>
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="text-left py-4 px-2 text-sm font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {members.map(member => (
                  <tr key={member.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-4 px-2">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </td>
                    <td className="py-4 px-2">
                      <Badge variant="outline" className={getMembershipColor(member.membership)}>
                        {member.membership}
                      </Badge>
                    </td>
                    <td className="py-4 px-2 text-sm">{member.joinDate}</td>
                    <td className="py-4 px-2 text-sm">{member.expirationDate}</td>
                    <td className="py-4 px-2">
                      <span className={`text-sm font-medium ${member.daysRemaining <= 30 ? 'text-destructive' : 'text-green-600'}`}>
                        {member.daysRemaining} days
                      </span>
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
                ))}
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
                <Badge variant="outline" className={getMembershipColor(selectedMember.membership)}>
                  {selectedMember.membership}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm">{selectedMember.email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm">{selectedMember.phone}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Join Date</p>
                <p className="text-sm">{selectedMember.joinDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Expiration Date</p>
                <p className="text-sm">{selectedMember.expirationDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Days Remaining</p>
                <p className={`font-medium ${selectedMember.daysRemaining <= 30 ? 'text-destructive' : 'text-green-600'}`}>
                  {selectedMember.daysRemaining} days
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Paid</p>
                <p className="font-medium">₱{selectedMember.totalPaid.toLocaleString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'applications', label: 'Applications', badge: pendingApplications },
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
                {tab.badge && tab.badge > 0 && (
                  <span className="absolute top-2 ml-1 h-5 w-5 rounded-full bg-destructive text-white text-xs flex items-center justify-center inline-flex">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'bookings' && renderBookings()}
        {activeTab === 'applications' && renderApplications()}
        {activeTab === 'members' && renderMembers()}
      </main>
    </div>
  );
};

export default HilomeAdminDashboard;
