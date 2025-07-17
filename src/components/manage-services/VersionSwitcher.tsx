
import React from "react";
import { Badge } from "@/components/ui/badge";

const VersionSwitcher = () => {
  const version = 'v1'; // Simple static version

  const getVersionLabel = () => {
    return 'Simplified Mode';
  };

  return (
    <div className="fixed top-20 right-4 z-40">
      <Badge variant="secondary" className="text-xs">
        {getVersionLabel()}
      </Badge>
    </div>
  );
};

export default VersionSwitcher;
