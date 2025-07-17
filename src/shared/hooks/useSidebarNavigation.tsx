
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, Settings, Bell, Users, HelpCircle, Link, BookOpen, BarChart3 } from "lucide-react";

export const useSidebarNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;
  
  const navigation = [
    { href: "/", icon: <Home className="h-4 w-4" />, label: "Dashboard" },
    { href: "/calendar", icon: <Calendar className="h-4 w-4" />, label: "Calendar" },
    { href: "/event-management", icon: <Bell className="h-4 w-4" />, label: "Event Management" },
    { href: "/booking-links", icon: <Link className="h-4 w-4" />, label: "Booking Links" },
    { href: "/reports", icon: <BarChart3 className="h-4 w-4" />, label: "Reports" },
    { href: "/manage-services", icon: <Users className="h-4 w-4" />, label: "Manage Services" },
  ];

  const bottomNavigation = [
    { href: "/help", icon: <HelpCircle className="h-4 w-4" />, label: "Help" },
    { href: "/settings", icon: <Settings className="h-4 w-4" />, label: "Settings" },
  ];
  
  const isActive = (path: string) => {
    if (path === "/" && (currentPath === "/" || currentPath === "/dashboard")) return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };
  
  return {
    navigation,
    bottomNavigation,
    currentPath,
    isActive,
    navigate
  };
};
