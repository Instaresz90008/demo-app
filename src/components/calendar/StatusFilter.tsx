
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";

interface StatusFilterProps {
  options: { value: string | null; label: string }[];
  selected: string | null;
  onChange: (status: string | null) => void;
}

const StatusFilter = ({ options, selected, onChange }: StatusFilterProps) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="sm" className="flex items-center gap-1 border-purple-500/40 text-purple-300 hover:bg-purple-600/20">
        <Filter className="h-3.5 w-3.5" />
        <span>Status</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="p-1 min-w-[10rem]">
      {options.map(opt => (
        <DropdownMenuItem key={opt.value ?? "all"} className={selected === opt.value ? "bg-purple-100 text-purple-900" : ""} onClick={() => onChange(opt.value)}>
          {opt.label}
        </DropdownMenuItem>
      ))}
    </DropdownMenuContent>
  </DropdownMenu>
);

export default StatusFilter;
