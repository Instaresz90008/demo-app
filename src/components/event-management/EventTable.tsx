
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
import EventToolbar from "./EventToolbar";
import { EVENTS } from "./data/mockData";
import { getEventColumns } from "./data/columns";
import { Sparkles } from "lucide-react";

// Modal imports
import ViewEventModal from "./modals/ViewEventModal";
import EditEventModal from "./modals/EditEventModal";
import eventApi from "@/services/api/eventApi";
import { useToast } from "@/hooks/use-toast";

const EventTable: React.FC = () => {
  const [data, setData] = useState(EVENTS);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  // Search & filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");
  const [meetingTypeFilter, setMeetingTypeFilter] = useState("");

  // Modal logic
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoadingId, setDeleteLoadingId] = useState<string | null>(null);

  const { toast } = useToast();

  // Filtered Data
  const filteredData = useMemo(() => {
    return data.filter(ev =>
      (!searchQuery ||
        ev.clientName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ev.serviceName?.toLowerCase().includes(searchQuery.toLowerCase())
      ) &&
      (!statusFilter || ev.status === statusFilter) &&
      (!serviceFilter || ev.serviceName === serviceFilter) &&
      (!meetingTypeFilter || ev.meetingType === meetingTypeFilter)
    );
  }, [data, searchQuery, statusFilter, serviceFilter, meetingTypeFilter]);

  // Use updated columns: pass CRUD handlers
  const columns = useMemo(() =>
    getEventColumns({
      onView: (ev) => {
        setSelectedEvent(ev);
        setViewOpen(true);
      },
      onEdit: (ev) => {
        setSelectedEvent(ev);
        setEditOpen(true);
      },
      onDelete: async (ev) => {
        if (window.confirm("Are you sure you want to delete this event?")) {
          setDeleteLoadingId(ev.id);
          try {
            await eventApi.delete(ev.id);
            setData(d => d.filter(e => e.id !== ev.id));
            toast({ title: "Deleted!", description: "Event deleted successfully." });
          } catch (err: any) {
            toast({ title: "Error", description: err?.message || "Could not delete event." });
          }
          setDeleteLoadingId(null);
        }
      },
    }), []
  );

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

  // Modal submit for Edit
  const handleEditSubmit = async (updatedEvent: any) => {
    setEditLoading(true);
    try {
      const saved = await eventApi.update(updatedEvent);
      setData((prev) =>
        prev.map(e => (e.id === saved.id ? { ...saved } : e))
      );
      setEditOpen(false);
      toast({ title: "Event updated!", description: `Event ${saved.id} updated.` });
    } catch (err: any) {
      toast({ title: "Update failed", description: err?.message || "Update failed" });
    }
    setEditLoading(false);
  };

  return (
    <div className="w-full">
      {/* Enhanced Toolbar - removed onCreateEvent prop */}
      <EventToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        serviceFilter={serviceFilter}
        setServiceFilter={setServiceFilter}
        meetingTypeFilter={meetingTypeFilter}
        setMeetingTypeFilter={setMeetingTypeFilter}
      />
      
      {/* Table Container */}
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
                    data-state={row.getIsSelected() && "selected"}
                    className={`
                      border-b border-border transition-all duration-200 cursor-pointer group
                      hover:bg-muted/50 hover:shadow-md
                      ${idx % 2 === 1 ? "bg-muted/20" : "bg-background"}
                    `}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell 
                        key={cell.id} 
                        className="py-4 px-6 group-hover:text-foreground transition-colors"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center py-12">
                    <div className="flex flex-col items-center justify-center space-y-3 text-muted-foreground">
                      <div className="p-3 bg-muted rounded-full">
                        <Sparkles className="h-8 w-8 text-primary" />
                      </div>
                      <div className="text-lg font-medium text-foreground">
                        No events found
                      </div>
                      <span className="text-sm text-muted-foreground">
                        Try adjusting your filters.
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

      {/* MODALS */}
      <ViewEventModal
        open={viewOpen}
        onOpenChange={setViewOpen}
        event={selectedEvent}
      />
      <EditEventModal
        open={editOpen}
        onOpenChange={(open) => { setEditOpen(open); if (!open) setSelectedEvent(null); }}
        event={selectedEvent}
        onSubmit={handleEditSubmit}
        loading={editLoading}
      />
    </div>
  );
};

export default EventTable;
