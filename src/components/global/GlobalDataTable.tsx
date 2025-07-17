
import React from 'react';
import { useFeature } from '@/hooks/useFeature';
import { useAccessControl } from '@/context/AccessControlContext';
import { DataTable } from '@/components/ui/data-table/data-table';
import { ColumnDef } from '@tanstack/react-table';
import { cn } from '@/lib/utils';

interface GlobalDataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData>[];
  loading?: boolean;
  featureKey?: string;
  requiredRoles?: string[];
  onRowClick?: (row: TData) => void;
  className?: string;
  filterableColumns?: {
    id: string;
    title: string;
    options: {
      value: string;
      label: string;
    }[];
  }[];
  searchableColumns?: {
    id: string;
    title: string;
  }[];
  enableExport?: boolean;
  enableColumnVisibility?: boolean;
  searchPlaceholder?: string;
}

export const GlobalDataTable = <TData,>({
  data,
  columns,
  loading = false,
  featureKey,
  requiredRoles,
  onRowClick,
  className,
  filterableColumns,
  searchableColumns,
  enableExport,
  enableColumnVisibility,
  searchPlaceholder
}: GlobalDataTableProps<TData>) => {
  const { canAccess } = useFeature();
  const { getCurrentUser } = useAccessControl();
  
  const currentUser = getCurrentUser();
  const userRoles = currentUser?.roles || [];

  // Check feature access
  const hasFeatureAccess = featureKey ? canAccess(featureKey) : true;
  
  // Check role access
  const hasRoleAccess = requiredRoles ? requiredRoles.some(role => userRoles.includes(role)) : true;

  if (!hasFeatureAccess || !hasRoleAccess) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)}>
      <DataTable
        columns={columns}
        data={data}
        filterableColumns={filterableColumns}
        searchableColumns={searchableColumns}
      />
    </div>
  );
};

export default GlobalDataTable;
