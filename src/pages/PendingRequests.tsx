
import React, { useState, useEffect } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Clock, User, Calendar, AlertTriangle, CheckCircle, XCircle, RotateCcw, Search, UserCheck, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { approvePendingRequest, rejectPendingRequest } from '@/store/slices/dashboardSlice';
import { useNavigate } from 'react-router-dom';

const PendingRequests = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { pendingRequests, loading } = useAppSelector(state => state.dashboard);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("");
  const [showProposeModal, setShowProposeModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [proposedDate, setProposedDate] = useState('');
  const [proposedTime, setProposedTime] = useState('');
  const [proposalMessage, setProposalMessage] = useState('');
  const { toast } = useToast();

  // Filter pending requests only (not approved/rejected)
  const activePendingRequests = pendingRequests.filter(req => 
    req.status === 'pending_owner' || req.status === 'pending_client'
  );

  const filteredRequests = activePendingRequests.filter((request) => {
    const searchMatch = !searchQuery || 
      request.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    const statusMatch = !statusFilter || request.status === statusFilter;
    const priorityMatch = !priorityFilter || request.priority === priorityFilter;
    const userTypeMatch = !userTypeFilter || 
      (userTypeFilter === 'platform' && request.isPlatformUser) ||
      (userTypeFilter === 'guest' && !request.isPlatformUser);
    
    return searchMatch && statusMatch && priorityMatch && userTypeMatch;
  });

  const handleAccept = async (requestId: string) => {
    try {
      dispatch(approvePendingRequest(requestId));
      toast({
        title: "Request Accepted",
        description: "The booking request has been approved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve the request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      dispatch(rejectPendingRequest(requestId));
      toast({
        title: "Request Rejected", 
        description: "The booking request has been rejected.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject the request. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleProposeNewTime = (requestId: string) => {
    setSelectedRequest(requestId);
    setShowProposeModal(true);
  };

  const handleProposeConfirm = () => {
    if (!selectedRequest || !proposedDate || !proposedTime) return;
    
    toast({
      title: "New Time Proposed",
      description: `New time proposal sent for ${proposedDate} at ${proposedTime}.`,
    });
    
    setShowProposeModal(false);
    setProposedDate('');
    setProposedTime('');
    setProposalMessage('');
    setSelectedRequest(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300';
      case 'normal': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/20 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/20 dark:text-gray-300';
    }
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending_owner':
        return { text: 'Pending with You', icon: Clock, color: 'text-orange-600' };
      case 'pending_client':
        return { text: 'Pending with Client', icon: User, color: 'text-blue-600' };
      default:
        return { text: 'Unknown', icon: Clock, color: 'text-gray-600' };
    }
  };

  const totalRequests = activePendingRequests.length;
  const urgentRequests = activePendingRequests.filter(req => req.priority === 'urgent').length;
  const platformUsers = activePendingRequests.filter(req => req.isPlatformUser).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="space-y-6 py-6 px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Pending Requests</h1>
              <p className="text-muted-foreground mt-1">
                Manage your booking requests ({totalRequests} pending)
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-card/50 backdrop-blur-sm border-muted">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Pending</p>
                  <p className="text-2xl font-bold text-foreground">{totalRequests}</p>
                </div>
                <Clock className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-muted">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Urgent Requests</p>
                  <p className="text-2xl font-bold text-foreground">{urgentRequests}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-muted">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Platform Users</p>
                  <p className="text-2xl font-bold text-foreground">{platformUsers}</p>
                </div>
                <UserCheck className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-muted">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by client name or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-background/50"
                />
              </div>

              <div className="flex gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] bg-background/50">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="pending_owner">Pending with You</SelectItem>
                    <SelectItem value="pending_client">Pending with Client</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-[120px] bg-background/50">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={userTypeFilter} onValueChange={setUserTypeFilter}>
                  <SelectTrigger className="w-[130px] bg-background/50">
                    <SelectValue placeholder="User Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Users</SelectItem>
                    <SelectItem value="platform">Platform</SelectItem>
                    <SelectItem value="guest">Guest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request, index) => {
              const statusInfo = getStatusInfo(request.status);
              const StatusIcon = statusInfo.icon;

              return (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Card className="bg-card/60 backdrop-blur-sm border-muted hover:shadow-lg transition-all duration-300">
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-foreground">{request.clientName}</h3>
                          <p className="text-muted-foreground">{request.service}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {request.isPlatformUser ? (
                              <UserCheck className="h-4 w-4 text-green-500" />
                            ) : (
                              <User className="h-4 w-4 text-gray-500" />
                            )}
                            <span className="text-xs text-muted-foreground">
                              {request.isPlatformUser ? 'Platform User' : 'Guest User'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>Requested: {request.requestedTime}</span>
                        </div>
                        {request.proposedTime && (
                          <div className="flex items-center gap-2 text-sm">
                            <RotateCcw className="h-4 w-4 text-blue-500" />
                            <span className="text-blue-600">Counter-proposed: {request.proposedTime}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm">
                          <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
                          <span className={statusInfo.color}>{statusInfo.text}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        {request.status === 'pending_owner' ? (
                          <>
                            <Button 
                              size="sm" 
                              variant="default"
                              onClick={() => handleAccept(request.id)}
                              className="flex items-center gap-1"
                              disabled={loading}
                            >
                              <CheckCircle className="h-3 w-3" />
                              Accept
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleReject(request.id)}
                              className="flex items-center gap-1"
                              disabled={loading}
                            >
                              <XCircle className="h-3 w-3" />
                              Reject
                            </Button>
                            <Button 
                              size="sm" 
                              variant="secondary"
                              onClick={() => handleProposeNewTime(request.id)}
                              className="flex items-center gap-1"
                            >
                              <RotateCcw className="h-3 w-3" />
                              Propose New Time
                            </Button>
                          </>
                        ) : (
                          <div className="text-sm text-muted-foreground">
                            Waiting for client response to your counter-proposal...
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="bg-card/60 backdrop-blur-sm rounded-lg p-8 border border-muted">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Pending Requests</h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter || priorityFilter || userTypeFilter
                    ? "No requests match your current filters."
                    : "No pending requests at the moment. All caught up!"}
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      <Dialog open={showProposeModal} onOpenChange={setShowProposeModal}>
        <DialogContent className="sm:max-w-md bg-background border border-border">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              Propose New Time
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="proposedDate">New Date</Label>
                <Input
                  id="proposedDate"
                  type="date"
                  value={proposedDate}
                  onChange={(e) => setProposedDate(e.target.value)}
                  className="bg-background border-border"
                />
              </div>
              <div>
                <Label htmlFor="proposedTime">New Time</Label>
                <Select value={proposedTime} onValueChange={setProposedTime}>
                  <SelectTrigger className="bg-background border-border">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent className="bg-background border-border">
                    {['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'].map((time) => (
                      <SelectItem key={time} value={time}>
                        {time}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label htmlFor="proposalMessage">Message (optional)</Label>
              <Textarea
                id="proposalMessage"
                value={proposalMessage}
                onChange={(e) => setProposalMessage(e.target.value)}
                placeholder="Add a message to explain the new time proposal..."
                className="bg-background border-border"
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowProposeModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleProposeConfirm} disabled={!proposedDate || !proposedTime}>
                <RotateCcw className="h-4 w-4 mr-1" />
                Propose New Time
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PendingRequests;
