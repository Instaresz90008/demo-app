
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EventToolbarProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  statusFilter: string;
  setStatusFilter: (val: string) => void;
  serviceFilter: string;
  setServiceFilter: (val: string) => void;
  meetingTypeFilter: string;
  setMeetingTypeFilter: (val: string) => void;
}

const statusOptions = [
  { label: "All Statuses", value: "all" },
  { label: "Booked", value: "Scheduled" },
  { label: "Cancelled", value: "Cancelled" },
  { label: "Completed", value: "Completed" },
  { label: "No-Show", value: "No-Show" },
];

const serviceOptions = [
  { label: "All Services", value: "all" },
  { label: "Legal Advice", value: "Legal Advice" },
  { label: "Financial Planning", value: "Financial Planning" },
  { label: "Technical Support", value: "Technical Support" },
  { label: "Career Counseling", value: "Career Counseling" },
];

const meetingTypeOptions = [
  { label: "All Types", value: "all" },
  { label: "One to One", value: "one-to-one" },
  { label: "One to Many", value: "one-to-many" },
  { label: "Many to Many", value: "many-to-many" },
];

const EventToolbar: React.FC<EventToolbarProps> = ({
  searchQuery, setSearchQuery,
  statusFilter, setStatusFilter,
  serviceFilter, setServiceFilter,
  meetingTypeFilter, setMeetingTypeFilter,
}) => {
  return (
    <div className="p-6 bg-card border-b border-border">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        {/* Search Section */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events, clients, or services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border focus:border-primary focus:ring-primary/20 text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Filters Section */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Filter className="h-4 w-4" />
            <span>Filters:</span>
          </div>
          
          <Select value={statusFilter || "all"} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] bg-input border-border text-foreground">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              {statusOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value} className="text-popover-foreground">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={serviceFilter || "all"} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-[140px] bg-input border-border text-foreground">
              <SelectValue placeholder="Service" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              {serviceOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value} className="text-popover-foreground">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={meetingTypeFilter || "all"} onValueChange={setMeetingTypeFilter}>
            <SelectTrigger className="w-[120px] bg-input border-border text-foreground">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-popover border-border z-50">
              {meetingTypeOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value} className="text-popover-foreground">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default EventToolbar;
