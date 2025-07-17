
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const HistoryToolbar: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4 bg-card border-b border-border">
      <div className="relative w-full md:w-72">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          type="search"
          placeholder="Search history..."
          className="pl-8 bg-input border-2 border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20"
        />
      </div>
      
      <div className="flex items-center gap-2">
        <Select>
          <SelectTrigger className="w-[140px] bg-input border-2 border-border text-foreground focus:border-primary">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent className="z-[9999] bg-popover border-2 border-border shadow-xl">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
            <SelectItem value="no-show">No-Show</SelectItem>
          </SelectContent>
        </Select>
        
        <Button variant="outline" size="sm" className="flex items-center gap-1 border-2 border-border text-foreground hover:bg-accent hover:text-accent-foreground">
          <Filter className="h-3.5 w-3.5" />
          <span>Filter</span>
        </Button>
        <Button variant="outline" size="sm" className="flex items-center gap-1 border-2 border-border text-foreground hover:bg-accent hover:text-accent-foreground">
          <Download className="h-3.5 w-3.5" />
          <span>Export</span>
        </Button>
      </div>
    </div>
  );
};

export default HistoryToolbar;
