
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Calendar, DollarSign, Users, Clock, XCircle, Target, Repeat, Trophy, Activity, AlertCircle } from 'lucide-react';

// Mock data for analytics
const kpiData = {
  totalBookings: { value: 1247, trend: 12.5, period: 'vs last month' },
  revenueGenerated: { value: 24750, trend: 8.3, period: 'vs last month' },
  conversionRate: { value: 15.8, trend: -2.1, period: 'vs last month' },
  averageLeadTime: { value: 4.2, trend: 0.5, period: 'days' },
  cancellationRate: { value: 8.5, trend: -1.2, period: 'vs last month' },
  slotUtilization: { value: 78.6, trend: 5.2, period: 'vs last month' },
  repeatBookingRate: { value: 34.7, trend: 4.1, period: 'vs last month' },
  revenuePerService: { value: 198.5, trend: 6.8, period: 'avg per service' }
};

const timeSlotData = [
  { time: '9:00 AM', bookings: 45, utilization: 85 },
  { time: '10:00 AM', bookings: 52, utilization: 92 },
  { time: '11:00 AM', bookings: 38, utilization: 78 },
  { time: '2:00 PM', bookings: 61, utilization: 98 },
  { time: '3:00 PM', bookings: 48, utilization: 86 },
  { time: '4:00 PM', bookings: 35, utilization: 72 }
];

const revenueByServiceData = [
  { service: 'Legal Consultation', revenue: 8500, bookings: 85 },
  { service: 'Financial Planning', revenue: 6200, bookings: 62 },
  { service: 'Career Counseling', revenue: 4100, bookings: 102 },
  { service: 'Technical Support', revenue: 3200, bookings: 128 }
];

const cancellationReasonsData = [
  { reason: 'Schedule Conflict', count: 45, percentage: 35 },
  { reason: 'Emergency', count: 28, percentage: 22 },
  { reason: 'Technical Issues', count: 20, percentage: 15 },
  { reason: 'No Show', count: 18, percentage: 14 },
  { reason: 'Other', count: 17, percentage: 14 }
];

const monthlyTrendData = [
  { month: 'Jan', bookings: 98, revenue: 19600, conversion: 14.2 },
  { month: 'Feb', bookings: 112, revenue: 22400, conversion: 15.8 },
  { month: 'Mar', bookings: 125, revenue: 25000, conversion: 16.1 },
  { month: 'Apr', bookings: 134, revenue: 26800, conversion: 17.2 },
  { month: 'May', bookings: 128, revenue: 25600, conversion: 15.9 },
  { month: 'Jun', bookings: 147, revenue: 29400, conversion: 18.1 }
];

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const getTrendIcon = (trend: number) => {
  if (trend > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
  if (trend < 0) return <TrendingDown className="h-4 w-4 text-red-600" />;
  return <Minus className="h-4 w-4 text-gray-400" />;
};

const getTrendColor = (trend: number) => {
  if (trend > 0) return 'text-green-600 bg-green-50 border-green-200';
  if (trend < 0) return 'text-red-600 bg-red-50 border-red-200';
  return 'text-gray-600 bg-gray-50 border-gray-200';
};

const ServiceAnalytics = () => {
  const [dateRange, setDateRange] = useState('30d');

  return (
    <Layout title="Service Analytics">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-white">
        <div className="content-container px-6 py-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-xl shadow-lg">
                    <BarChart className="h-7 w-7 text-white" />
                  </div>
                  Service Analytics
                </h1>
                <p className="text-muted-foreground mt-2 text-lg">Comprehensive insights into your service performance</p>
              </div>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-48">
                  <Calendar className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-lg border-blue-200 bg-gradient-to-tr from-white to-blue-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                      <p className="text-3xl font-bold">{kpiData.totalBookings.value.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-blue-100 rounded-full">
                      <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {getTrendIcon(kpiData.totalBookings.trend)}
                    <Badge className={getTrendColor(kpiData.totalBookings.trend)}>
                      {Math.abs(kpiData.totalBookings.trend)}% {kpiData.totalBookings.period}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-green-200 bg-gradient-to-tr from-white to-green-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Revenue Generated</p>
                      <p className="text-3xl font-bold">${kpiData.revenueGenerated.value.toLocaleString()}</p>
                    </div>
                    <div className="p-3 bg-green-100 rounded-full">
                      <DollarSign className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {getTrendIcon(kpiData.revenueGenerated.trend)}
                    <Badge className={getTrendColor(kpiData.revenueGenerated.trend)}>
                      {Math.abs(kpiData.revenueGenerated.trend)}% {kpiData.revenueGenerated.period}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-purple-200 bg-gradient-to-tr from-white to-purple-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Conversion Rate</p>
                      <p className="text-3xl font-bold">{kpiData.conversionRate.value}%</p>
                    </div>
                    <div className="p-3 bg-purple-100 rounded-full">
                      <Target className="h-6 w-6 text-purple-600" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {getTrendIcon(kpiData.conversionRate.trend)}
                    <Badge className={getTrendColor(kpiData.conversionRate.trend)}>
                      {Math.abs(kpiData.conversionRate.trend)}% {kpiData.conversionRate.period}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-orange-200 bg-gradient-to-tr from-white to-orange-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Avg Lead Time</p>
                      <p className="text-3xl font-bold">{kpiData.averageLeadTime.value}</p>
                    </div>
                    <div className="p-3 bg-orange-100 rounded-full">
                      <Clock className="h-6 w-6 text-orange-600" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {getTrendIcon(kpiData.averageLeadTime.trend)}
                    <Badge className={getTrendColor(kpiData.averageLeadTime.trend)}>
                      {Math.abs(kpiData.averageLeadTime.trend)} {kpiData.averageLeadTime.period}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Secondary KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="shadow-lg border-red-200 bg-gradient-to-tr from-white to-red-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Cancellation Rate</p>
                      <p className="text-3xl font-bold">{kpiData.cancellationRate.value}%</p>
                    </div>
                    <div className="p-3 bg-red-100 rounded-full">
                      <XCircle className="h-6 w-6 text-red-600" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {getTrendIcon(kpiData.cancellationRate.trend)}
                    <Badge className={getTrendColor(kpiData.cancellationRate.trend)}>
                      {Math.abs(kpiData.cancellationRate.trend)}% {kpiData.cancellationRate.period}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-indigo-200 bg-gradient-to-tr from-white to-indigo-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Slot Utilization</p>
                      <p className="text-3xl font-bold">{kpiData.slotUtilization.value}%</p>
                    </div>
                    <div className="p-3 bg-indigo-100 rounded-full">
                      <Activity className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {getTrendIcon(kpiData.slotUtilization.trend)}
                    <Badge className={getTrendColor(kpiData.slotUtilization.trend)}>
                      {Math.abs(kpiData.slotUtilization.trend)}% {kpiData.slotUtilization.period}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-cyan-200 bg-gradient-to-tr from-white to-cyan-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Repeat Booking Rate</p>
                      <p className="text-3xl font-bold">{kpiData.repeatBookingRate.value}%</p>
                    </div>
                    <div className="p-3 bg-cyan-100 rounded-full">
                      <Repeat className="h-6 w-6 text-cyan-600" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {getTrendIcon(kpiData.repeatBookingRate.trend)}
                    <Badge className={getTrendColor(kpiData.repeatBookingRate.trend)}>
                      {Math.abs(kpiData.repeatBookingRate.trend)}% {kpiData.repeatBookingRate.period}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-teal-200 bg-gradient-to-tr from-white to-teal-50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Revenue/Service</p>
                      <p className="text-3xl font-bold">${kpiData.revenuePerService.value}</p>
                    </div>
                    <div className="p-3 bg-teal-100 rounded-full">
                      <Trophy className="h-6 w-6 text-teal-600" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    {getTrendIcon(kpiData.revenuePerService.trend)}
                    <Badge className={getTrendColor(kpiData.revenuePerService.trend)}>
                      {Math.abs(kpiData.revenuePerService.trend)}% {kpiData.revenuePerService.period}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts Section */}
            <Tabs defaultValue="trends" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="detailed">Detailed</TabsTrigger>
              </TabsList>

              <TabsContent value="trends" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Monthly Booking Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <AreaChart data={monthlyTrendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Area type="monotone" dataKey="bookings" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Revenue Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyTrendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Top Performing Time Slots</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={timeSlotData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="time" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="bookings" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Revenue by Service</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={revenueByServiceData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="service" angle={-45} textAnchor="end" height={100} />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="revenue" fill="#f59e0b" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Cancellation Reasons</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={cancellationReasonsData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ reason, percentage }) => `${reason}: ${percentage}%`}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="count"
                          >
                            {cancellationReasonsData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Conversion Rate Trends</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlyTrendData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="conversion" stroke="#ef4444" strokeWidth={3} />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="detailed" className="space-y-6">
                <div className="grid grid-cols-1 gap-6">
                  <Card className="shadow-lg">
                    <CardHeader>
                      <CardTitle>Detailed Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {cancellationReasonsData.map((reason, index) => (
                          <div key={reason.reason} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                              />
                              <span className="font-medium">{reason.reason}</span>
                            </div>
                            <div className="flex items-center gap-4">
                              <Badge variant="outline">{reason.count} incidents</Badge>
                              <span className="text-sm text-muted-foreground">{reason.percentage}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ServiceAnalytics;
