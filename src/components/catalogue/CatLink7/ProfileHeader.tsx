
import React from 'react';
import { MapPin, Globe, Instagram, Twitter, Facebook, Heart, Share, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Star } from 'lucide-react';

interface ProfileHeaderProps {
  providerName: string;
  catalogueName?: string;
  servicesCount: number;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ 
  providerName, 
  catalogueName = "Service Catalogue",
  servicesCount
}) => {
  return (
    <>
      {/* Cover Image - Premium Gradient Background */}
      <div 
        className="h-40 rounded-t-xl bg-gradient-to-r from-purple-400 via-pink-500 to-red-500"
        aria-hidden="true"
      />
      
      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-lg relative -mt-16 mx-5">
        <div className="flex flex-col items-center px-4 pt-10 pb-6">
          {/* Avatar */}
          <Avatar className="h-28 w-28 border-4 border-white shadow-lg absolute -top-14">
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-500 text-white text-2xl">
              {providerName.split(' ').map(name => name[0]).join('')}
            </AvatarFallback>
            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(providerName)}`} alt={providerName} />
          </Avatar>
          
          {/* Status Badge */}
          <Badge className="absolute top-6 right-6 bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5 animate-pulse"></span>
              Available
            </span>
          </Badge>
          
          {/* Profile Name & Description */}
          <div className="mt-14 text-center">
            <h1 className="text-2xl font-bold text-gray-800">{providerName}</h1>
            <h2 className="text-purple-600 font-medium">{catalogueName}</h2>
            <p className="text-gray-500 mt-2 max-w-md text-sm">
              Professional services tailored to meet your needs. Expertise you can trust, service you'll remember.
            </p>
            
            {/* Social Icons */}
            <div className="flex justify-center gap-3 mt-3">
              <Button variant="outline" size="sm" className="rounded-full w-8 h-8 p-0">
                <Globe className="h-3.5 w-3.5 text-gray-600" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-full w-8 h-8 p-0">
                <Instagram className="h-3.5 w-3.5 text-gray-600" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-full w-8 h-8 p-0">
                <Twitter className="h-3.5 w-3.5 text-gray-600" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-full w-8 h-8 p-0">
                <Facebook className="h-3.5 w-3.5 text-gray-600" />
              </Button>
            </div>
          </div>
          
          {/* Statistics */}
          <div className="grid grid-cols-3 gap-8 w-full max-w-md mt-6 px-6">
            <div className="flex flex-col items-center">
              <span className="font-bold text-xl text-gray-800">{servicesCount}</span>
              <span className="text-xs text-gray-500">Services</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center">
                <span className="font-bold text-xl text-gray-800">5.0</span>
                <Star className="h-3.5 w-3.5 ml-1 text-yellow-400 fill-yellow-400" />
              </div>
              <span className="text-xs text-gray-500">Rating</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="font-bold text-xl text-gray-800">100%</span>
              <span className="text-xs text-gray-500">Response</span>
            </div>
          </div>
          
          {/* Location */}
          <div className="flex items-center mt-6 text-sm text-gray-500">
            <MapPin className="h-3.5 w-3.5 mr-1.5" />
            San Francisco, CA
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2 px-4 pb-6 justify-center">
          <Button variant="default" size="sm" className="rounded-full px-5 bg-purple-600 hover:bg-purple-700">
            <MessageSquare className="h-3.5 w-3.5 mr-1.5" />
            Contact
          </Button>
          <Button variant="outline" size="sm" className="rounded-full px-5">
            <Heart className="h-3.5 w-3.5 mr-1.5" />
            Save
          </Button>
          <Button variant="outline" size="sm" className="rounded-full px-5">
            <Share className="h-3.5 w-3.5 mr-1.5" />
            Share
          </Button>
        </div>
      </div>
    </>
  );
};

export default ProfileHeader;
