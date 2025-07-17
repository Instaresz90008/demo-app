
import React, { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, Search, Filter, Mail, Phone, Calendar, MapPin, Building } from 'lucide-react';
import { motion } from 'framer-motion';

const UniqueClientsReport = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");

  // Mock data for unique clients
  const uniqueClients = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1-555-0123',
      company: 'Tech Solutions Inc',
      totalBookings: 8,
      lastBooking: '2024-01-15',
      status: 'active',
      location: 'New York, NY',
      totalRevenue: 2400
    },
    {
      id: '2',
      name: 'Michael Brown',
      email: 'michael.brown@company.com',
      phone: '+1-555-0456',
      company: 'Global Enterprises',
      totalBookings: 12,
      lastBooking: '2024-01-10',
      status: 'active',
      location: 'Los Angeles, CA',
      totalRevenue: 3600
    },
    {
      id: '3',
      name: 'Emma Davis',
      email: 'emma.davis@startup.io',
      phone: '+1-555-0789',
      company: 'Innovation Labs',
      totalBookings: 5,
      lastBooking: '2023-12-20',
      status: 'inactive',
      location: 'San Francisco, CA',
      totalRevenue: 1500
    },
    {
      id: '4',
      name: 'David Wilson',
      email: 'david.wilson@corp.com',
      phone: '+1-555-0321',
      company: 'Wilson Corp',
      totalBookings: 15,
      lastBooking: '2024-01-12',
      status: 'active',
      location: 'Chicago, IL',
      totalRevenue: 4500
    },
    {
      id: '5',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@business.com',
      phone: '+1-555-0654',
      company: 'Anderson Business Solutions',
      totalBookings: 6,
      lastBooking: '2024-01-08',
      status: 'active',
      location: 'Houston, TX',
      totalRevenue: 1800
    }
  ];

  const filteredClients = uniqueClients.filter((client) => {
    const searchMatch = !searchQuery || 
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase());
    
    const statusMatch = !statusFilter || client.status === statusFilter;
    
    return searchMatch && statusMatch;
  });

  const sortedClients = [...filteredClients].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'bookings':
        return b.totalBookings - a.totalBookings;
      case 'revenue':
        return b.totalRevenue - a.totalRevenue;
      case 'lastBooking':
        return new Date(b.lastBooking).getTime() - new Date(a.lastBooking).getTime();
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300';
      case 'inactive': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/20 dark:text-gray-300';
    }
  };

  const totalClients = uniqueClients.length;
  const activeClients = uniqueClients.filter(client => client.status === 'active').length;
  const totalRevenue = uniqueClients.reduce((sum, client) => sum + client.totalRevenue, 0);
  const totalBookings = uniqueClients.reduce((sum, client) => sum + client.totalBookings, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background dark:from-background dark:via-muted/10 dark:to-background">
        <div className="space-y-6 py-6">
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-start"
          >
            <div>
              <h1 className="text-3xl font-bold text-foreground">Unique Clients Report</h1>
              <p className="text-muted-foreground mt-1">
                Detailed analysis of your unique client base ({totalClients} total clients)
              </p>
            </div>
          </motion.div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-card/50 backdrop-blur-sm border-muted">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Clients</p>
                    <p className="text-2xl font-bold text-foreground">{totalClients}</p>
                  </div>
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-muted">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Clients</p>
                    <p className="text-2xl font-bold text-foreground">{activeClients}</p>
                  </div>
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-muted">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                    <p className="text-2xl font-bold text-foreground">{totalBookings}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-purple-500" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card/50 backdrop-blur-sm border-muted">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground">${totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-green-600 font-bold text-sm">$</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-muted">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name, email, or company..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-background/50"
                    />
                  </div>

                  {/* Filters */}
                  <div className="flex gap-2">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[140px] bg-background/50">
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-[140px] bg-background/50">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="name">Name</SelectItem>
                        <SelectItem value="bookings">Bookings</SelectItem>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="lastBooking">Last Booking</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Clients List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sortedClients.map((client, index) => (
              <motion.div
                key={client.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.05 }}
              >
                <Card className="bg-card/60 backdrop-blur-sm border-muted hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-foreground">{client.name}</h3>
                        <p className="text-muted-foreground flex items-center mt-1">
                          <Building className="h-4 w-4 mr-1" />
                          {client.company}
                        </p>
                      </div>
                      <Badge className={getStatusColor(client.status)}>
                        {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{client.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{client.location}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-border">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="font-semibold text-lg text-foreground">{client.totalBookings}</p>
                          <p className="text-xs text-muted-foreground">Bookings</p>
                        </div>
                        <div>
                          <p className="font-semibold text-lg text-foreground">${client.totalRevenue.toLocaleString()}</p>
                          <p className="text-xs text-muted-foreground">Revenue</p>
                        </div>
                        <div>
                          <p className="font-semibold text-lg text-foreground">{new Date(client.lastBooking).toLocaleDateString()}</p>
                          <p className="text-xs text-muted-foreground">Last Booking</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {sortedClients.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="bg-card/60 backdrop-blur-sm rounded-lg p-8 border border-muted">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Clients Found</h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter
                    ? "No clients match your current filters."
                    : "No unique clients data available at the moment."}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>
  );
};

export default UniqueClientsReport;
