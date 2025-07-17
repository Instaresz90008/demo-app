import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QrCode, Copy, Share, ExternalLink, Users, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QuickBookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuickBookingModal = ({ open, onOpenChange }: QuickBookingModalProps) => {
  const { toast } = useToast();

  const allBookingLinks = [
    {
      id: '1',
      name: '30-min Strategy Chat',
      url: 'justbook.com/anilkumar/30-min-strategy-chat',
      qrCode: '/api/placeholder/150/150',
      status: 'active',
      bookings: 12,
      duration: '30 min'
    },
    {
      id: '2', 
      name: '60-min Consultation',
      url: 'justbook.com/anilkumar/60-min-consultation',
      qrCode: '/api/placeholder/150/150',
      status: 'active',
      bookings: 8,
      duration: '60 min'
    },
    {
      id: '3',
      name: '15-min Quick Call',
      url: 'justbook.com/anilkumar/15-min-quick-call', 
      qrCode: '/api/placeholder/150/150',
      status: 'active',
      bookings: 25,
      duration: '15 min'
    },
    {
      id: '4',
      name: 'Demo Session',
      url: 'justbook.com/anilkumar/demo-session',
      qrCode: '/api/placeholder/150/150',
      status: 'paused',
      bookings: 5,
      duration: '45 min'
    }
  ];

  // Filter to show only active booking links
  const bookingLinks = allBookingLinks.filter(link => link.status === 'active');

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(`https://${url}`);
    toast({
      title: "Link Copied",
      description: "Booking link has been copied to clipboard",
    });
  };

  const handleShare = (name: string, url: string) => {
    if (navigator.share) {
      navigator.share({
        title: `Book ${name}`,
        url: `https://${url}`
      });
    } else {
      handleCopyLink(url);
    }
  };

  const handleOpenLink = (url: string) => {
    window.open(`https://${url}`, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-5xl bg-background border border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Quick Booking Links & QR Codes
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4 max-h-[70vh] overflow-y-auto">
          {bookingLinks.map((link) => (
            <Card key={link.id} className="bg-card border border-border hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{link.name}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={link.status === 'active' ? 'default' : 'secondary'} className="text-xs">
                        {link.status}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {link.duration}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Users className="h-3 w-3 mr-1" />
                        {link.bookings} bookings
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  {/* QR Code */}
                  <div className="flex-shrink-0">
                    <div className="w-24 h-24 bg-muted border border-border rounded-lg flex items-center justify-center">
                      <QrCode className="h-12 w-12 text-muted-foreground" />
                    </div>
                  </div>
                  
                  {/* URL and Actions */}
                  <div className="flex-1 space-y-3">
                    <div className="text-xs text-muted-foreground break-all bg-muted p-2 rounded">
                      {link.url}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-8"
                        onClick={() => handleCopyLink(link.url)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-8"
                        onClick={() => handleShare(link.name, link.url)}
                      >
                        <Share className="h-3 w-3 mr-1" />
                        Share
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-8 col-span-2"
                        onClick={() => handleOpenLink(link.url)}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open Link
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickBookingModal;