
import { Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface OrganizationBadgeProps {
  organizationName?: string;
  organizationLogo?: string;
  size?: "default" | "large";
}

const OrganizationBadge = ({ organizationName, organizationLogo, size = "default" }: OrganizationBadgeProps) => {
  if (!organizationName) return null;

  return (
    <Badge 
      variant="outline" 
      className={cn(
        "bg-primary/10 text-primary border-primary/20 flex items-center gap-2",
        size === "large" && "text-base py-2 px-4"
      )}
    >
      {organizationLogo ? (
        <img 
          src={organizationLogo} 
          alt={organizationName} 
          className={cn(
            "rounded",
            size === "large" ? "w-6 h-6" : "w-4 h-4"
          )} 
        />
      ) : (
        <Building2 className={cn(
          size === "large" ? "w-5 h-5" : "w-3 h-3"
        )} />
      )}
      <span className={cn(
        "font-medium",
        size === "large" ? "text-base" : "text-xs"
      )}>
        {organizationName}
      </span>
    </Badge>
  );
};

export default OrganizationBadge;
