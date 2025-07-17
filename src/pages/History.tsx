
import React from 'react';
import { useNavigate } from 'react-router-dom';
import HistoryTable from '@/components/event-management/HistoryTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, History as HistoryIcon, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';

const History = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start gap-6">
        <div className="flex items-start gap-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/event-management')}
            className="flex items-center gap-2 px-4 py-2 hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Events
          </Button>
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-3 tracking-tight">
              <div className="p-2 bg-primary/10 rounded-lg">
                <HistoryIcon className="h-8 w-8 text-primary" />
              </div>
              Event History
            </h1>
            <p className="text-muted-foreground text-lg">
              View all historical events, bookings, and completed appointments
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card text-card-foreground border-border hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3 px-6 pt-6">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Total Completed
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-foreground">18</div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Successfully completed events
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3 px-6 pt-6">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Total Cancelled
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-foreground">4</div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Events cancelled by clients
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card text-card-foreground border-border hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-3 px-6 pt-6">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              No-Shows
            </CardTitle>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-foreground">2</div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Clients who didn't show up
            </p>
          </CardContent>
        </Card>
      </div>

      {/* History Table */}
      <Card className="bg-card text-card-foreground border-border shadow-sm">
        <CardHeader className="px-6 py-4 border-b border-border">
          <CardTitle className="text-xl font-semibold">Historical Events</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <HistoryTable />
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
