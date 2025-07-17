
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Clock, User, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

interface BookingRecord {
  id: string;
  clientName: string;
  clientEmail: string;
  serviceName: string;
  date: string;
  time: string;
  duration: number;
  status: 'completed' | 'upcoming' | 'cancelled' | 'pending';
  cost: number;
}

const BookingHistory = () => {
  const [bookings] = useState<BookingRecord[]>([
    {
      id: '1',
      clientName: 'John Doe',
      clientEmail: 'john@example.com',
      serviceName: 'Business Strategy Session',
      date: '2025-06-10',
      time: '10:00 AM',
      duration: 30,
      status: 'completed',
      cost: 150
    },
    {
      id: '2',
      clientName: 'Jane Smith',
      clientEmail: 'jane@example.com',
      serviceName: 'Technical Review',
      date: '2025-06-13',
      time: '2:00 PM',
      duration: 60,
      status: 'upcoming',
      cost: 250
    },
    {
      id: '3',
      clientName: 'Bob Wilson',
      clientEmail: 'bob@example.com',
      serviceName: 'Business Strategy Session',
      date: '2025-06-12',
      time: '11:00 AM',
      duration: 30,
      status: 'cancelled',
      cost: 150
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/30';
      case 'upcoming': return 'bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30';
      case 'cancelled': return 'bg-red-500/20 text-red-700 dark:text-red-300 border-red-500/30';
      case 'pending': return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-300 border-yellow-500/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.serviceName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Booking History</h1>
        <p className="text-muted-foreground">View and manage all your booking records</p>
      </div>

      <div className="flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="upcoming">Upcoming</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        {filteredBookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{booking.serviceName}</h3>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      <span>{booking.clientName}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(booking.date), 'MMM d, yyyy')}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{booking.time} ({booking.duration}min)</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{booking.clientEmail}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">${booking.cost}</div>
                  <Button variant="outline" size="sm">View Details</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookingHistory;
