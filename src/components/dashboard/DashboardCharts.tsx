
import React from "react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { ChartPie, TrendingUp, DollarSign, Sparkles } from "lucide-react";
import { format, subDays } from "date-fns";

// Sample data for the weekly trends chart
const generateWeeklyData = () => {
  return Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    return {
      date: format(date, "MMM dd"),
      bookings: Math.floor(Math.random() * 8) + 1,
      inquiries: Math.floor(Math.random() * 5) + 1
    };
  });
};

// Sample data for the payment chart
const PAYMENT_DATA = [
  { name: 'Mon', revenue: 1200 },
  { name: 'Tue', revenue: 900 },
  { name: 'Wed', revenue: 1500 },
  { name: 'Thu', revenue: 1800 },
  { name: 'Fri', revenue: 2400 },
  { name: 'Sat', revenue: 1300 },
  { name: 'Sun', revenue: 800 },
];

const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA'];

const DashboardCharts = () => {
  const weeklyData = generateWeeklyData();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Weekly Booking Trends Chart */}
      <div className="dashboard-chart relative overflow-hidden p-5 group transition-all duration-300 shadow-lg hover:shadow-xl rounded-3xl animate-reveal">
        {/* Subtle accent overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/10 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
        
        {/* Decorative sparkles */}
        <div className="absolute top-3 right-3 animate-particle-float">
          <Sparkles className="h-4 w-4 text-purple-400/60" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 text-purple-400 mr-2" />
            <h3 className="text-lg font-semibold">
              Weekly Booking Trends
            </h3>
          </div>
          <div className="h-[300px] rounded-2xl p-2 transition-all duration-300 bg-black/20 backdrop-blur-sm">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={weeklyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12, fill: '#e2e8f0' }}
                />
                <YAxis 
                  tick={{ fontSize: 12, fill: '#e2e8f0' }}
                  allowDecimals={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                    borderRadius: '12px',
                    border: 'none',
                    backdropFilter: 'blur(8px)',
                    color: 'white'
                  }} 
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="bookings" 
                  stroke="#9b87f5" 
                  strokeWidth={2} 
                  activeDot={{ r: 6 }} 
                  name="Bookings"
                />
                <Line 
                  type="monotone" 
                  dataKey="inquiries" 
                  stroke="#7E69AB" 
                  strokeWidth={2} 
                  activeDot={{ r: 6 }} 
                  name="Inquiries"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Interactive glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Animated bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>

      {/* Payment Revenue Chart */}
      <div className="dashboard-chart relative overflow-hidden p-5 group transition-all duration-300 shadow-lg hover:shadow-xl rounded-3xl animate-reveal">
        {/* Subtle accent overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/10 opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
        
        {/* Decorative sparkles */}
        <div className="absolute top-3 left-3 animate-particle-float" style={{ animationDelay: '1s' }}>
          <Sparkles className="h-4 w-4 text-purple-400/60" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center mb-4">
            <DollarSign className="h-5 w-5 text-green-400 mr-2" />
            <h3 className="text-lg font-semibold">
              Payment Revenue
            </h3>
          </div>
          <div className="h-[300px] rounded-2xl p-2 transition-all duration-300 bg-black/20 backdrop-blur-sm">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={PAYMENT_DATA}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                <XAxis dataKey="name" tick={{ fill: '#e2e8f0' }} />
                <YAxis 
                  tickFormatter={(value) => `$${value}`}
                  tick={{ fill: '#e2e8f0' }}
                />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Revenue']}
                  contentStyle={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.9)', 
                    borderRadius: '12px',
                    border: 'none',
                    backdropFilter: 'blur(8px)',
                    color: 'white'
                  }}
                />
                <Bar dataKey="revenue" fill="#4ade80" radius={[4, 4, 0, 0]}>
                  {PAYMENT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Interactive glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        
        {/* Animated bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
      </div>
    </div>
  );
};

export default DashboardCharts;
