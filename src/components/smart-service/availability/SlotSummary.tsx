
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

interface Slot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable?: boolean;
}

interface SlotSummaryProps {
  slots: Slot[];
  onContinue: () => void;
  onBack?: () => void;
}

const SlotSummary: React.FC<SlotSummaryProps> = ({ slots, onContinue, onBack }) => {
  const totalSlots = slots.length;
  const previewSlots = slots.slice(0, 7);
  
  // Group slots by date for better visualization
  const slotsByDate = previewSlots.reduce((acc, slot) => {
    const date = slot.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(slot);
    return acc;
  }, {} as Record<string, Slot[]>);

  const dateStats = Object.keys(slotsByDate).map(date => ({
    date,
    count: slotsByDate[date].length,
    slots: slotsByDate[date]
  }));

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Slot Generation Complete
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">{totalSlots}</div>
              <div className="text-sm text-muted-foreground">Total Slots Created</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{dateStats.length}</div>
              <div className="text-sm text-muted-foreground">Days Covered</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round(totalSlots / dateStats.length) || 0}
              </div>
              <div className="text-sm text-muted-foreground">Avg Slots/Day</div>
            </div>
          </div>

          {/* Preview Slots */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              Preview of Generated Slots
              <Badge variant="secondary">{previewSlots.length} of {totalSlots}</Badge>
            </h4>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {dateStats.map(({ date, count, slots }) => (
                <div key={date} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <h5 className="font-medium">
                      {format(new Date(date), 'EEEE, MMM dd, yyyy')}
                    </h5>
                    <Badge variant="outline">{count} slots</Badge>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {slots.map((slot) => (
                      <div
                        key={slot.id}
                        className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded"
                      >
                        <Clock className="h-3 w-3" />
                        {slot.startTime} - {slot.endTime}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {totalSlots > 7 && (
              <div className="mt-3 text-center text-sm text-muted-foreground">
                And {totalSlots - 7} more slots...
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                Back to Setup
              </Button>
            )}
            <Button onClick={onContinue} className="ml-auto">
              Continue to Advanced Settings
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SlotSummary;
