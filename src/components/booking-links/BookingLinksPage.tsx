
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Link, 
  Copy, 
  Eye, 
  Settings,
  Plus,
  Share2,
  Calendar,
  Clock,
  Users
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const BookingLinksPage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const bookingLinks = [
    {
      id: 1,
      name: "30min Consultation",
      url: "https://jusbook.app/book/john-doe/consultation-30min",
      isActive: true,
      bookings: 24,
      lastBooked: "2 hours ago",
      duration: "30 min"
    },
    {
      id: 2,
      name: "Strategy Session",
      url: "https://jusbook.app/book/john-doe/strategy-session",
      isActive: true,
      bookings: 12,
      lastBooked: "1 day ago",
      duration: "60 min"
    },
    {
      id: 3,
      name: "Quick Chat",
      url: "https://jusbook.app/book/john-doe/quick-chat",
      isActive: false,
      bookings: 8,
      lastBooked: "3 days ago",
      duration: "15 min"
    }
  ];

  const filteredLinks = bookingLinks.filter(link =>
    link.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "Booking link has been copied to clipboard.",
    });
  };

  const handleShareLink = (url: string) => {
    if (navigator.share) {
      navigator.share({
        title: 'Book a meeting with me',
        url: url,
      });
    } else {
      handleCopyLink(url);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Booking Links</h1>
          <p className="text-muted-foreground">
            Create and manage your public booking links
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create New Link
        </Button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search booking links..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Links</CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookingLinks.length}</div>
            <p className="text-xs text-muted-foreground">
              Active booking links
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookingLinks.reduce((sum, link) => sum + link.bookings, 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              All time bookings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Links</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bookingLinks.filter(link => link.isActive).length}
            </div>
            <p className="text-xs text-muted-foreground">
              Currently active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Booking Links */}
      <div className="grid gap-6">
        {filteredLinks.map((link) => (
          <Card key={link.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg">{link.name}</CardTitle>
                  <Badge variant={link.isActive ? "default" : "secondary"}>
                    {link.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(link.url, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    Edit
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                <Link className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-mono flex-1">{link.url}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyLink(link.url)}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-4 w-4" />
                  Copy
                </Button>
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleShareLink(link.url)}
                  className="flex items-center gap-1"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{link.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{link.bookings} bookings</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>Last: {link.lastBooked}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BookingLinksPage;
