
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Settings, LogOut, Camera } from "lucide-react";
import { useState } from "react";
// Theme system removed - using simple light theme
import { cn } from "@/lib/utils";

interface UserProfileProps {
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  isActive?: boolean;
}

const UserProfile = ({ 
  userName = "User", 
  userEmail = "user@example.com", 
  userAvatar, 
  isActive = true 
}: UserProfileProps) => {
  const [imageError, setImageError] = useState(false);
  // Simple light theme only
  const isSimple = true;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  const handleImageUpload = () => {
    // Placeholder for image upload functionality
    console.log("Image upload triggered");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-auto p-0">
          <div className="relative">
            <Avatar className={cn(
              "h-8 w-8 border-2 transition-all hover:border-primary/50 cursor-pointer",
              isActive && "ring-2 ring-primary/20 ring-offset-2 ring-offset-background"
            )}>
              <AvatarImage 
                src={imageError ? undefined : userAvatar} 
                onError={() => setImageError(true)}
              />
              <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            {isActive && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full animate-pulse" />
            )}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className={cn(
          "w-56 profile-dropdown",
          isSimple 
            ? "bg-background border shadow-lg" 
            : "bg-background border shadow-xl"
        )}
      >
        <div className="p-2 bg-background">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={imageError ? undefined : userAvatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate text-foreground">{userName}</p>
              <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
            </div>
          </div>
        </div>
        <DropdownMenuSeparator />
        <div className="bg-background">
          <DropdownMenuItem onClick={handleImageUpload}>
            <Camera className="h-4 w-4 mr-2" />
            Update Avatar
          </DropdownMenuItem>
          <DropdownMenuItem>
            <User className="h-4 w-4 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </DropdownMenuItem>
        </div>
        <DropdownMenuSeparator />
        <div className="bg-background">
          <DropdownMenuItem className="text-red-600">
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
