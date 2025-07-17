
import React from "react";
import { Edit, Trash2, Eye } from "lucide-react";
import { DataTableColumnHeader } from "@/components/ui/data-table/column";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Event } from "./mockData";

// The following will be injected by parent, but left as-is for current usage
const getStatusBadgeClass = (status: string): string => {
  switch (status) {
    case "Scheduled":
      return "status-scheduled";
    case "Cancelled":
      return "status-cancelled";
    case "Completed":
      return "status-completed";
    case "No-Show":
      return "status-no-show";
    default:
      return "bg-gray-100 text-gray-800 border-gray-300";
  }
};

export const getEventColumns = ({
  onView,
  onEdit,
  onDelete,
}: {
  onView: (event: Event) => void;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}) => [
  {
    accessorKey: "id",
    header: ({ column }: any) => <DataTableColumnHeader column={column} title="Event ID" />,
    cell: ({ row }: any) => <div className="font-medium">{row.getValue("id")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "serviceName",
    header: ({ column }: any) => <DataTableColumnHeader column={column} title="Service Name" />,
    enableSorting: true,
  },
  {
    accessorKey: "clientName",
    header: ({ column }: any) => <DataTableColumnHeader column={column} title="Client Name" />,
    enableSorting: true,
  },
  {
    accessorKey: "contactNumber",
    header: ({ column }: any) => <DataTableColumnHeader column={column} title="Contact Number" />,
    enableSorting: true,
  },
  {
    accessorKey: "appointmentDate",
    header: ({ column }: any) => <DataTableColumnHeader column={column} title="Date" />,
    enableSorting: true,
  },
  {
    accessorKey: "startTime",
    header: ({ column }: any) => <DataTableColumnHeader column={column} title="Start Time" />,
    enableSorting: true,
  },
  {
    accessorKey: "endTime",
    header: ({ column }: any) => <DataTableColumnHeader column={column} title="End Time" />,
    enableSorting: true,
  },
  {
    accessorKey: "meetingType",
    header: ({ column }: any) => <DataTableColumnHeader column={column} title="Meeting Type" />,
    enableSorting: true,
  },
  {
    accessorKey: "clientTimeZone",
    header: ({ column }: any) => <DataTableColumnHeader column={column} title="Client Time Zone" />,
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: ({ column }: any) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }: any) => {
      const status = row.getValue("status") as string;
      return (
        <Badge className={getStatusBadgeClass(status)}>
          {status}
        </Badge>
      );
    },
    enableSorting: true,
  },
  {
    id: "actions",
    cell: ({ row }: any) => {
      const event = row.original as Event;
      return (
        <div className="flex items-center justify-end space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onView(event)}
            title="View details"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-blue-600"
            onClick={() => onEdit(event)}
            title="Edit event"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-red-600"
            onClick={() => onDelete(event)}
            title="Delete event"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];
