import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QrCode, Copy, Share } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface QRModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QRModal = ({ open, onOpenChange }: QRModalProps) => {
  const { toast } = useToast();

  const bookingLinks = [
    {
      id: '1',
      name: '30-min Strategy Chat',
      url: 'justbook.com/anilkumar/30-min-strategy-chat',
      qrCode: '/api/placeholder/150/150'
    },
    {
      id: '2', 
      name: '60-min Consultation',
      url: 'justbook.com/anilkumar/60-min-consultation',
      qrCode: '/api/placeholder/150/150'
    },
    {
      id: '3',
      name: '15-min Quick Call',
      url: 'justbook.com/anilkumar/15-min-quick-call', 
      qrCode: '/api/placeholder/150/150'
    }
  ];

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl bg-background border border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Booking Link QR Codes
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
          {bookingLinks.map((link) => (
            <Card key={link.id} className="text-center bg-card border border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{link.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* QR Code Placeholder */}
                <div className="mx-auto w-32 h-32 bg-muted border border-border rounded-lg flex items-center justify-center">
                  <QrCode className="h-16 w-16 text-muted-foreground" />
                </div>
                
                {/* URL */}
                <div className="text-xs text-muted-foreground break-all px-2">
                  {link.url}
                </div>
                
                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleCopyLink(link.url)}
                  >
                    <Copy className="h-3 w-3 mr-1" />
                    Copy
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleShare(link.name, link.url)}
                  >
                    <Share className="h-3 w-3 mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRModal;