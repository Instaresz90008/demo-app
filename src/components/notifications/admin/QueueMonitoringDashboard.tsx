
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertTriangle, BarChart3, Clock, CheckCircle, XCircle, RotateCcw, Trash2, RefreshCw } from 'lucide-react';
import { QueueMetrics, DeadLetterQueueItem } from '@/types/notificationQueue';
import { queueManager } from '@/services/notificationQueue/QueueManager';
import { useToast } from '@/hooks/use-toast';

export const QueueMonitoringDashboard: React.FC = () => {
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<QueueMetrics>({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    deadLetterQueue: 0,
    avgProcessingTime: 0,
    successRate: 0
  });
  const [deadLetterQueue, setDeadLetterQueue] = useState<DeadLetterQueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    try {
      const newMetrics = queueManager.getMetrics();
      const dlq = queueManager.getDeadLetterQueue();
      
      setMetrics(newMetrics);
      setDeadLetterQueue(dlq);
    } catch (error) {
      console.error('Failed to load queue data:', error);
    }
  };

  const handleRetryJob = async (jobId: string) => {
    setIsLoading(true);
    try {
      const success = await queueManager.retryFromDeadLetterQueue(jobId);
      if (success) {
        toast({
          title: "Job Retried",
          description: "Job has been moved back to the processing queue",
        });
        loadData();
      } else {
        toast({
          title: "Retry Failed",
          description: "Unable to retry this job",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to retry job",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismissJob = async (jobId: string) => {
    setIsLoading(true);
    try {
      const success = await queueManager.dismissFromDeadLetterQueue(jobId, 'Manually dismissed by admin');
      if (success) {
        toast({
          title: "Job Dismissed",
          description: "Job has been permanently dismissed",
        });
        loadData();
      } else {
        toast({
          title: "Dismiss Failed",
          description: "Unable to dismiss this job",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to dismiss job",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'processing': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      case 'retrying': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-blue-500';
      case 'low': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Queue Monitoring Dashboard</h2>
          <p className="text-muted-foreground">Monitor notification queue performance and manage failed jobs</p>
        </div>
        <Button onClick={loadData} className="gap-2" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.total}</div>
            <p className="text-xs text-muted-foreground">
              {metrics.pending} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.successRate.toFixed(1)}%</div>
            <Progress value={metrics.successRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Processing Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgProcessingTime.toFixed(0)}ms</div>
            <p className="text-xs text-muted-foreground">
              Per job average
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dead Letter Queue</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{metrics.deadLetterQueue}</div>
            <p className="text-xs text-muted-foreground">
              Failed jobs
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Queue Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Queue Status Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-yellow-600">{metrics.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">{metrics.processing}</div>
              <div className="text-sm text-muted-foreground">Processing</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">{metrics.completed}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-red-600">{metrics.failed}</div>
              <div className="text-sm text-muted-foreground">Failed</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-orange-600">{metrics.deadLetterQueue}</div>
              <div className="text-sm text-muted-foreground">Dead Letter</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dead Letter Queue Management */}
      <Tabs defaultValue="dlq">
        <TabsList>
          <TabsTrigger value="dlq">Dead Letter Queue ({deadLetterQueue.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="dlq">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                Failed Jobs Management
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deadLetterQueue.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No Failed Jobs</h3>
                  <p className="text-muted-foreground">All notifications are processing successfully!</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Job ID</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Channel</TableHead>
                      <TableHead>Failed At</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deadLetterQueue.map((item) => (
                      <TableRow key={item.originalJob.id}>
                        <TableCell className="font-mono text-xs">
                          {item.originalJob.id.slice(-8)}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{item.originalJob.type}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(item.originalJob.priority)}`} />
                            <span className="capitalize">{item.originalJob.priority}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{item.originalJob.channel}</Badge>
                        </TableCell>
                        <TableCell className="text-xs">
                          {item.failedAt.toLocaleString()}
                        </TableCell>
                        <TableCell className="max-w-xs truncate text-xs">
                          {item.failureReason}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            {item.canRetry && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRetryJob(item.originalJob.id)}
                                disabled={isLoading}
                                className="gap-1"
                              >
                                <RotateCcw className="h-3 w-3" />
                                Retry
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDismissJob(item.originalJob.id)}
                              disabled={isLoading}
                              className="gap-1"
                            >
                              <Trash2 className="h-3 w-3" />
                              Dismiss
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
