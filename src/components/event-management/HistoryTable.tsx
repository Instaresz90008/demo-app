
import React, { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
  getPaginationRowModel,
  PaginationState,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DataTablePagination } from "@/components/ui/data-table/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, Calendar, Download } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { EnhancedCalendar } from "@/components/ui/enhanced-calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Mock data for history
const HISTORY_DATA = [
  {
    id: "EVT-001",
    serviceName: "Business Consultation",
    clientName: "John Doe",
    contactNumber: "+1-555-123-4567",
    date: "2024-01-15",
    startTime: "10:00",
    endTime: "11:00",
    meetingType: "one-to-one",
    clientTimeZone: "UTC-5 (EST)",
    status: "Completed",
  },
  {
    id: "EVT-002",
    serviceName: "Legal Advice",
    clientName: "Sarah Johnson",
    contactNumber: "+1-555-987-6543",
    date: "2024-01-14",
    startTime: "14:30",
    endTime: "15:30",
    meetingType: "one-to-one",
    clientTimeZone: "UTC-8 (PST)",
    status: "Cancelled",
  },
  {
    id: "EVT-003",
    serviceName: "Team Workshop",
    clientName: "ABC Company",
    contactNumber: "+1-555-456-7890",
    date: "2024-01-12",
    startTime: "09:00",
    endTime: "12:00",
    meetingType: "one-to-many",
    clientTimeZone: "UTC-6 (CST)",
    status: "No-Show",
  },
  {
    id: "EVT-004",
    serviceName: "Financial Planning",
    clientName: "Mike Wilson",
    contactNumber: "+1-555-321-6547",
    date: "2024-01-10",
    startTime: "16:00",
    endTime: "17:00",
    meetingType: "one-to-one",
    clientTimeZone: "UTC-7 (MST)",
    status: "Completed",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "bg-green-100 text-green-800 border-green-200";
    case "Cancelled":
      return "bg-red-100 text-red-800 border-red-200";
    case "No-Show":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const HistoryTable: React.FC = () => {
  const [data] = useState(HISTORY_DATA);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Filters - using 'all' instead of empty string
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [meetingTypeFilter, setMeetingTypeFilter] = useState("all");
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();

  // Columns definition
  const columns = useMemo<ColumnDef<typeof HISTORY_DATA[0]>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Event ID",
        cell: ({ row }) => (
          <span className="font-medium text-primary">{row.getValue("id")}</span>
        ),
      },
      {
        accessorKey: "serviceName",
        header: "Service Name",
      },
      {
        accessorKey: "clientName",
        header: "Client Name",
      },
      {
        accessorKey: "contactNumber",
        header: "Contact Number",
        cell: ({ row }) => (
          <span className="font-mono text-sm">{row.getValue("contactNumber")}</span>
        ),
      },
      {
        accessorKey: "date",
        header: "Date",
        cell: ({ row }) => (
          <span>{format(new Date(row.getValue("date")), "MMM dd, yyyy")}</span>
        ),
      },
      {
        accessorKey: "startTime",
        header: "Start Time",
      },
      {
        accessorKey: "endTime",
        header: "End Time",
      },
      {
        accessorKey: "meetingType",
        header: "Meeting Type",
        cell: ({ row }) => {
          const type = row.getValue("meetingType") as string;
          return (
            <Badge variant="outline" className="capitalize">
              {type.replace("-", " ")}
            </Badge>
          );
        },
      },
      {
        accessorKey: "clientTimeZone",
        header: "Client Time Zone",
        cell: ({ row }) => (
          <span className="text-sm text-muted-foreground">
            {row.getValue("clientTimeZone")}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          return (
            <Badge className={`${getStatusColor(status)} font-medium`}>
              {status}
            </Badge>
          );
        },
      },
    ],
    []
  );

  // Filtered data - fix filter logic to handle 'all' values
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const searchMatch = !searchQuery || 
        item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const statusMatch = statusFilter === "all" || item.status === statusFilter;
      const typeMatch = meetingTypeFilter === "all" || item.meetingType === meetingTypeFilter;
      
      const itemDate = new Date(item.date);
      const fromMatch = !fromDate || itemDate >= fromDate;
      const toMatch = !toDate || itemDate <= toDate;
      
      return searchMatch && statusMatch && typeMatch && fromMatch && toMatch;
    });
  }, [data, searchQuery, statusFilter, meetingTypeFilter, fromDate, toDate]);

  const table = useReactTable({
    data: filteredData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    state: {
      sorting,
      pagination,
    },
  });

  return (
    <div className="w-full">
      {/* Filters Toolbar */}
      <div className="p-6 bg-card border-b border-border">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by client, service, or event ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border focus:border-primary focus:ring-primary/20"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-2 items-center">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>Filters:</span>
            </div>

            {/* Status Filter - fixed to use 'all' instead of empty string */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px] bg-input border-border">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="No-Show">No-Show</SelectItem>
              </SelectContent>
            </Select>

            {/* Meeting Type Filter - fixed to use 'all' instead of empty string */}
            <Select value={meetingTypeFilter} onValueChange={setMeetingTypeFilter}>
              <SelectTrigger className="w-[140px] bg-input border-border">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border z-50">
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="one-to-one">One to One</SelectItem>
                <SelectItem value="one-to-many">One to Many</SelectItem>
                <SelectItem value="many-to-many">Many to Many</SelectItem>
              </SelectContent>
            </Select>

            {/* From Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[140px] justify-start text-left font-normal bg-input border-border",
                    !fromDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, "MMM dd") : "From Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border-border z-50" align="start">
                <EnhancedCalendar
                  mode="single"
                  selected={fromDate}
                  onSelect={setFromDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            {/* To Date */}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[140px] justify-start text-left font-normal bg-input border-border",
                    !toDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, "MMM dd") : "To Date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border-border z-50" align="start">
                <EnhancedCalendar
                  mode="single"
                  selected={toDate}
                  onSelect={setToDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>

            {/* Export Button */}
            <Button variant="outline" className="bg-input border-border">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table className="w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow
                  key={headerGroup.id}
                  className="bg-muted/50 border-b border-border hover:bg-muted/70"
                >
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="font-semibold text-foreground py-4 px-6"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, idx) => (
                  <TableRow
                    key={row.id}
                    className={`
                      border-b border-border transition-all duration-200 hover:bg-muted/50
                      ${idx % 2 === 1 ? "bg-muted/20" : "bg-background"}
                    `}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-4 px-6">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground">
                      <div className="text-lg font-medium text-foreground">
                        No history found
                      </div>
                      <span className="text-sm">
                        Try adjusting your filters or date range.
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex justify-end p-4 bg-muted/30">
          <DataTablePagination table={table} />
        </div>
      </div>
    </div>
  );
};

export default HistoryTable;
