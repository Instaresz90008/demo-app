
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Sparkles, Plus } from "lucide-react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

interface WeeklyBookingChartProps {
  data: Array<{ date: string; bookings: number; inquiries: number }>;
  onNavigate: (path: string) => void;
}

const WeeklyBookingChart: React.FC<WeeklyBookingChartProps> = ({ data, onNavigate }) => {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <TrendingUp className="h-5 w-5 text-indigo-400 mr-2" />
            Weekly Booking Trends
          </CardTitle>
          <Button variant="ghost" size="sm">View Details</Button>
        </div>
        <CardDescription>Tracking your booking performance</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 25, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              <Legend />
              <Line type="monotone" dataKey="bookings" stroke="#9b87f5" strokeWidth={2} activeDot={{ r: 6 }} name="Bookings" dot={{ stroke: '#9b87f5', strokeWidth: 2, r: 4 }} />
              <Line type="monotone" dataKey="inquiries" stroke="#7E69AB" strokeWidth={2} activeDot={{ r: 6 }} name="Inquiries" dot={{ stroke: '#7E69AB', strokeWidth: 2, r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-indigo-50 mx-6 mb-6 p-3 rounded-lg border border-indigo-100 flex justify-between items-center">
          <div className="flex items-center">
            <Sparkles className="h-5 w-5 text-indigo-600 mr-2" />
            <p className="text-sm font-medium text-indigo-700">Your 4 PM slot is hot right now 🔥</p>
          </div>
          <Button 
            size="sm" 
            variant="outline" 
            className="h-8 border-indigo-200 text-indigo-700 hover:bg-indigo-100"
            onClick={() => onNavigate('/slot-broadcast')}
          >
            Add Slots <Plus className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeeklyBookingChart;
