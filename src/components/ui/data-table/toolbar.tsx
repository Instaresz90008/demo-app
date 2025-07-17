
import { Table } from "@tanstack/react-table"
import { X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./view-options"
import { DataTableFacetedFilter } from "./faceted-filter"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  filterableColumns?: {
    id: string
    title: string
    options: {
      value: string
      label: string
    }[]
  }[]
  searchableColumns?: {
    id: string
    title: string
  }[]
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns = [],
  searchableColumns = [],
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumns.length > 0 && (
          <Input
            placeholder="Search"
            value={
              (table.getState().columnFilters.find((filter) => {
                return filter.id === searchableColumns[0].id
              })?.value as string) ?? ""
            }
            onChange={(event) => {
              table.getColumn(searchableColumns[0].id)?.setFilterValue(event.target.value)
            }}
            className="max-w-xs bg-card/50 border-border/30 text-foreground"
          />
        )}
        <div className="flex flex-1 items-center space-x-2">
          {filterableColumns.length > 0 && table.getColumn(filterableColumns[0].id) && (
            <DataTableFacetedFilter
              column={table.getColumn(filterableColumns[0].id)}
              title={filterableColumns[0].title}
              options={filterableColumns[0].options}
            />
          )}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3 text-foreground border-none hover:bg-primary/20"
            >
              Reset
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex-1 flex justify-end">
          <DataTableViewOptions table={table} />
        </div>
      </div>
    </div>
  )
}
