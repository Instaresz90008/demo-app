
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Trophy, Share } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from "recharts";

interface PaymentRevenueChartProps {
  data: Array<{ name: string; revenue: number }>;
  showAchievement: boolean;
}

const PaymentRevenueChart: React.FC<PaymentRevenueChartProps> = ({ data, showAchievement }) => {
  const COLORS = ['#9b87f5', '#7E69AB', '#6E59A5', '#D6BCFA'];

  return (
    <Card className="shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center">
            <DollarSign className="h-5 w-5 text-green-400 mr-2" />
            Payment Revenue
          </CardTitle>
          <Button variant="ghost" size="sm">View Report</Button>
        </div>
        <CardDescription>Daily revenue statistics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20, right: 25, left: 20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(value) => `$${value}`} />
              <Tooltip formatter={(value) => [`$${value}`, 'Revenue']} contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
              <Bar dataKey="revenue" fill="#4ade80" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: showAchievement ? 1 : 0 }}
          className="bg-green-50 p-3 rounded-lg border border-green-100 flex justify-between items-center"
        >
          <div className="flex items-center">
            <div className="bg-green-100 p-2 rounded-full mr-2">
              <Trophy className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="font-medium text-green-800">You've unlocked 90% weekly booking capacity 🎯</p>
              <p className="text-xs text-green-600">5 clients booked this week – keep going!</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="border-green-200 text-green-700 hover:bg-green-100">
            Share <Share className="ml-1 h-3.5 w-3.5" />
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
};

export default PaymentRevenueChart;
