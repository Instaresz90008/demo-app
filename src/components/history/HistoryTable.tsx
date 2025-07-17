
import React, { useMemo } from "react";
import { GlobalDataTable } from "@/components/global/GlobalDataTable";
import { HISTORY_DATA } from "./data/mockData";
import { getHistoryColumns } from "./data/columns";
import { filterableColumns, searchableColumns } from "./data/filters";

const HistoryTable: React.FC = () => {
  const columns = useMemo(() => getHistoryColumns(), []);
  
  return (
    <div className="enhanced-card rounded-lg border border-purple-500/30">
      <GlobalDataTable
        columns={columns}
        data={HISTORY_DATA}
        filterableColumns={filterableColumns}
        searchableColumns={searchableColumns}
        enableExport={true}
        enableColumnVisibility={true}
        searchPlaceholder="Search booking history..."
      />
    </div>
  );
};

export default HistoryTable;
