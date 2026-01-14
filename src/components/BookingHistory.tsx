import React, { useState } from 'react';
import { Search, Download, Calendar, Clock, User, Mail, Phone, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface BookingHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BookingHistory = ({ open, onOpenChange }: BookingHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');

  // Historical bookings data
  const [bookingHistory] = useState([
    { 
      id: 1, 
      name: 'Carlos Rivera', 
      email: 'carlos@email.com', 
      phone: '0920-456-7890', 
      date: '2026-01-05', 
      time: '3:00 PM', 
      membership: 'Gold', 
      status: 'completed', 
      service: 'Massage', 
      bookedOn: '2025-12-28 10:00 AM', 
      completedAt: '2026-01-05 4:00 PM',
      notes: 'Client was satisfied with the service'
    },
    { 
      id: 2, 
      name: 'Sofia Gonzales', 
      email: 'sofia@email.com', 
      phone: '0921-567-8901', 
      date: '2026-01-08', 
      time: '1:00 PM', 
      membership: 'Platinum', 
      status: 'completed', 
      service: 'Detox & Slimming', 
      bookedOn: '2026-01-02 11:30 AM', 
      completedAt: '2026-01-08 2:30 PM',
      notes: 'Regular client, requested same therapist next time'
    },
    { 
      id: 3, 
      name: 'Miguel Santos', 
      email: 'miguel@email.com', 
      phone: '0922-678-9012', 
      date: '2026-01-03', 
      time: '10:00 AM', 
      membership: 'Green', 
      status: 'cancelled', 
      service: 'Jacuzzi', 
      bookedOn: '2025-12-30 03:45 PM', 
      cancelledAt: '2026-01-02 09:00 AM', 
      cancellationReason: 'Client requested reschedule due to emergency',
      cancelledBy: 'Client'
    },
    { 
      id: 4, 
      name: 'Isabella Torres', 
      email: 'isabella@email.com', 
      phone: '0923-789-0123', 
      date: '2026-01-10', 
      time: '9:00 AM', 
      membership: 'Gold', 
      status: 'completed', 
      service: 'Body Scrub', 
      bookedOn: '2026-01-05 02:20 PM', 
      completedAt: '2026-01-10 10:30 AM',
      notes: 'First time client, very pleased'
    },
    { 
      id: 5, 
      name: 'Ricardo Lopez', 
      email: 'ricardo@email.com', 
      phone: '0924-890-1234', 
      date: '2025-12-28', 
      time: '4:00 PM', 
      membership: 'Platinum', 
      status: 'completed', 
      service: 'Yoga Session', 
      bookedOn: '2025-12-20 01:00 PM', 
      completedAt: '2025-12-28 5:00 PM',
      notes: 'Booked package of 5 sessions'
    },
    { 
      id: 6, 
      name: 'Gabriela Mendoza', 
      email: 'gab@email.com', 
      phone: '0925-901-2345', 
      date: '2026-01-07', 
      time: '11:30 AM', 
      membership: 'Green', 
      status: 'no-show', 
      service: 'Facial Treatment', 
      bookedOn: '2026-01-01 05:30 PM', 
      noShowAt: '2026-01-07 12:00 PM',
      notes: 'Client did not answer confirmation call'
    },
    { 
      id: 7, 
      name: 'Antonio Cruz', 
      email: 'antonio@email.com', 
      phone: '0926-012-3456', 
      date: '2026-01-04', 
      time: '2:30 PM', 
      membership: 'Gold', 
      status: 'completed', 
      service: 'Ice Bath', 
      bookedOn: '2025-12-29 08:15 AM', 
      completedAt: '2026-01-04 3:15 PM',
      notes: 'Excellent feedback'
    },
    { 
      id: 8, 
      name: 'Lucia Reyes', 
      email: 'lucia@email.com', 
      phone: '0927-123-4567', 
      date: '2025-12-30', 
      time: '5:00 PM', 
      membership: 'Platinum', 
      status: 'cancelled', 
      service: 'Sauna', 
      bookedOn: '2025-12-25 02:00 PM', 
      cancelledAt: '2025-12-29 10:00 AM', 
      cancellationReason: 'Facility maintenance required',
      cancelledBy: 'Admin'
    },
    { 
      id: 9, 
      name: 'Fernando Diaz', 
      email: 'fernando@email.com', 
      phone: '0928-234-5678', 
      date: '2026-01-06', 
      time: '8:00 AM', 
      membership: 'Green', 
      status: 'completed', 
      service: 'Wellness Consultation', 
      bookedOn: '2026-01-03 03:30 PM', 
      completedAt: '2026-01-06 9:00 AM',
      notes: 'Created personalized wellness plan'
    },
    { 
      id: 10, 
      name: 'Carmen Silva', 
      email: 'carmen@email.com', 
      phone: '0929-345-6789', 
      date: '2026-01-09', 
      time: '12:00 PM', 
      membership: 'Gold', 
      status: 'no-show', 
      service: 'Massage', 
      bookedOn: '2026-01-04 11:00 AM', 
      noShowAt: '2026-01-09 12:30 PM',
      notes: 'Second no-show this month'
    },
  ]);

  // Filter bookings
  const filteredBookings = bookingHistory.filter(booking => {
    const matchesSearch = booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    
    let matchesDate = true;
    if (filterDate !== 'all') {
      const bookingDate = new Date(booking.date);
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      if (filterDate === 'week') matchesDate = bookingDate >= weekAgo;
      else if (filterDate === 'month') matchesDate = bookingDate >= monthAgo;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  // Stats
  const totalBookings = bookingHistory.length;
  const completedBookings = bookingHistory.filter(b => b.status === 'completed').length;
  const cancelledBookings = bookingHistory.filter(b => b.status === 'cancelled').length;
  const noShowBookings = bookingHistory.filter(b => b.status === 'no-show').length;

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
      case 'completed': return 'bg-green-500/20 text-green-700';
      case 'cancelled': return 'bg-destructive/20 text-destructive';
      case 'no-show': return 'bg-amber-500/20 text-amber-700';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Booking History</DialogTitle>
          <p className="text-muted-foreground text-sm">View and manage past bookings</p>
        </DialogHeader>


        {/* Filters */}
        <Card className="border-border/50 mt-4">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or service..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="no-show">No Show</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterDate} onValueChange={setFilterDate}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table */}
        <Card className="border-border/50 mt-4">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Client</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Appointment</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Membership</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(booking => (
                    <tr key={booking.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{booking.name}</p>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Mail className="h-3 w-3" />
                              {booking.email}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {booking.phone}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium text-foreground">{booking.date}</p>
                            <p className="text-xs text-muted-foreground">{booking.time}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant="outline" className={getMembershipColor(booking.membership)}>
                          {booking.membership}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
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

            {filteredBookings.length === 0 && (
              <div className="p-12 text-center">
                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground font-medium">No booking history found</p>
                <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export History
          </Button>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingHistory;
