
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, LogOut, Palette, Clock } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ProfileData {
  fullName: string;
  roleTitle: string;
  industry: 'tech' | 'healthcare' | 'wellness' | 'legal' | 'education' | 'creative';
}

const industryLabels = {
  tech: { icon: '💻', label: 'Tech & Product' },
  healthcare: { icon: '🩺', label: 'Doctors & Medical' },
  wellness: { icon: '🧘', label: 'Fitness & Lifestyle' },
  legal: { icon: '⚖️', label: 'Law & Advisors' },
  education: { icon: '📚', label: 'Tutors & Educators' },
  creative: { icon: '🎨', label: 'Freelancers & Artists' }
};

export const ProfileDropdown: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState<ProfileData | null>(null);
  const [currentTimezone, setCurrentTimezone] = useState<string>('');
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      try {
        setUserProfile(JSON.parse(savedProfile));
      } catch (error) {
        console.error('Error parsing user profile:', error);
      }
    }

    // Get current timezone and time
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setCurrentTimezone(timezone);

    // Update time every second
    const updateTime = () => {
      const now = new Date();
      const timeString = now.toLocaleTimeString('en-US', {
        timeZone: timezone,
        hour12: true,
        hour: '2-digit',
        minute: '2-digit'
      });
      setCurrentTime(timeString);
    };

    updateTime();
    const timeInterval = setInterval(updateTime, 1000);

    return () => clearInterval(timeInterval);
  }, []);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const displayName = userProfile?.fullName || user.name || 'User';
  const industryInfo = userProfile ? industryLabels[userProfile.industry] : null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-80 p-0 border border-border bg-background shadow-lg z-50" 
        align="end" 
        sideOffset={8}
      >
        <div className="flex items-center gap-3 p-4 border-b border-border bg-muted/50">
          <Avatar className="h-14 w-14">
            <AvatarImage src="" alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              {displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col space-y-1 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              {industryInfo && <span className="text-lg">{industryInfo.icon}</span>}
              <p className="font-semibold text-base truncate text-foreground">{displayName}</p>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {user.email}
            </p>
            {userProfile && (
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">
                  {userProfile.roleTitle} | {industryInfo?.label}
                </p>
              </div>
            )}
            <p className="text-xs text-muted-foreground capitalize bg-secondary px-2 py-1 rounded-full inline-block w-fit">
              {user.planType} Plan
            </p>
          </div>
        </div>

        {/* Timezone Section */}
        <div className="p-4 bg-muted/30 border-b border-border">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Application Timezone</span>
          </div>
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground">{currentTimezone}</p>
            <p className="text-sm font-semibold text-foreground">{currentTime}</p>
          </div>
        </div>
        
        <DropdownMenuSeparator className="border-border" />
        
        <div className="p-2 bg-background">
          <DropdownMenuItem 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted focus:bg-muted"
          >
            <User className="h-4 w-4" />
            <span className="font-medium">Profile</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem 
            onClick={() => navigate('/settings')}
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer hover:bg-muted focus:bg-muted"
          >
            <Settings className="h-4 w-4" />
            <span className="font-medium">Settings</span>
          </DropdownMenuItem>
        </div>
        
        <DropdownMenuSeparator className="border-border" />
        
        <div className="p-4 bg-background">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Palette className="h-4 w-4" />
              <span className="font-medium">Theme</span>
            </div>
            <ThemeToggle />
          </div>
          <p className="text-xs text-muted-foreground">Ultra-simplified dual theme system</p>
        </div>
        
        <DropdownMenuSeparator className="border-border" />
        
        <div className="p-2 bg-background">
          <DropdownMenuItem 
            onClick={handleLogout}
            className="flex items-center gap-3 p-3 rounded-lg cursor-pointer text-red-600 hover:bg-red-50 focus:bg-red-50 dark:hover:bg-red-900/20 dark:focus:bg-red-900/20"
          >
            <LogOut className="h-4 w-4" />
            <span className="font-medium">Log out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
