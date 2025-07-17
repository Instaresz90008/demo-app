
import * as React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Search, Calendar, History, Settings, User, BarChart3, BookOpen, Mic, Users, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,  
  PopoverTrigger,
} from "@/components/ui/popover";

const navigationItems = [
  { title: "Dashboard", path: "/dashboard", keywords: ["home", "dashboard", "main"], icon: BarChart3 },
  { title: "Calendar", path: "/calendar", keywords: ["calendar", "schedule", "appointments"], icon: Calendar },
  { title: "Event Management", path: "/event-management", keywords: ["events", "meetings", "manage"], icon: Calendar },
  { title: "History", path: "/history", keywords: ["history", "past", "bookings"], icon: History },
  { title: "Booking Link", path: "/booking-links", keywords: ["booking", "link", "share"], icon: BookOpen },
  { title: "Catalogue", path: "/catalogue", keywords: ["catalogue", "services", "offerings"], icon: BookOpen },
  { title: "Slot Broadcast", path: "/slot-broadcast", keywords: ["slots", "booking", "availability", "broadcast"], icon: Calendar },
  { title: "Manage Services", path: "/manage-services", keywords: ["services", "manage", "create"], icon: Settings },
  { title: "Voice Assistant", path: "/voice-assistant", keywords: ["voice", "assistant", "ai", "tara"], icon: Mic },
  { title: "Team Management", path: "/team-management", keywords: ["team", "members", "users"], icon: Users },
  { title: "Org Settings", path: "/org-settings", keywords: ["org", "organization", "settings"], icon: Shield },
  { title: "Platform Settings", path: "/platform-settings", keywords: ["platform", "admin", "system"], icon: Shield },
  { title: "Proxy Access", path: "/proxy-sessions", keywords: ["proxy", "session", "user", "switch", "start proxy"], icon: Users },
  { title: "Profile", path: "/profile", keywords: ["profile", "account", "user"], icon: User },
  { title: "Settings", path: "/settings", keywords: ["preferences", "config", "account", "settings"], icon: Settings }
];

const CommandSearch: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isFocused, setIsFocused] = React.useState(false);
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filteredItems = React.useMemo(() => {
    if (searchTerm.length < 1) return [];
    
    return navigationItems
      .filter(item => {
        const lowerSearch = searchTerm.toLowerCase();
        return (
          item.title.toLowerCase().includes(lowerSearch) ||
          item.keywords.some(k => k.includes(lowerSearch))
        );
      })
      .slice(0, 8);
  }, [searchTerm]);

  const handleSelect = React.useCallback((path: string) => {
    navigate(path);
    setOpen(false);
    setSearchTerm("");
    inputRef.current?.blur();
  }, [navigate]);

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent) => {
    if (!open || filteredItems.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredItems.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        handleSelect(filteredItems[selectedIndex].path);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setSearchTerm("");
      inputRef.current?.blur();
    }
  }, [open, filteredItems, selectedIndex, handleSelect]);

  React.useEffect(() => {
    const handleGlobalShortcut = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !e.metaKey && !e.ctrlKey)) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleGlobalShortcut);
    return () => document.removeEventListener("keydown", handleGlobalShortcut);
  }, []);

  React.useEffect(() => {
    if (searchTerm.length >= 1) {
      setOpen(true);
      setSelectedIndex(0);
    } else {
      setOpen(false);
    }
  }, [searchTerm]);

  return (
    <div className="relative w-full">
      <Popover open={open && filteredItems.length > 0} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className={cn(
            "relative w-full transition-all duration-200",
            isFocused ? "opacity-100" : "opacity-90"
          )}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search pages, events, history... (Press / or Ctrl+K)"
              className="pl-10 pr-4 py-2 h-10 border rounded-lg text-sm bg-background shadow-sm focus:shadow-md transition-shadow"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={handleKeyDown}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[400px] border shadow-lg" align="start" sideOffset={5}>
          <Command>
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Navigation">
                {filteredItems.map((item, index) => (
                  <CommandItem
                    key={item.path}
                    onSelect={() => handleSelect(item.path)}
                    className={cn(
                      index === selectedIndex && "bg-accent text-accent-foreground",
                      "cursor-pointer flex items-center gap-2 py-2"
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CommandSearch;
