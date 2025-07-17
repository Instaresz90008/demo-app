
import { ColumnDef } from "@tanstack/react-table";
import { 
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table/column";
import { HistoryLog } from "./mockData";

export const getHistoryColumns = (): ColumnDef<HistoryLog>[] => [
  {
    accessorKey: "id",
    header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
    cell: ({ row }) => <div className="font-medium">{row.getValue("id")}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => (
      <div className="flex items-center">
        <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
        {row.getValue("date")}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "time",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Time" />,
    cell: ({ row }) => (
      <div className="flex items-center">
        <Clock className="h-4 w-4 mr-2 text-gray-400" />
        {row.getValue("time")}
      </div>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "action",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Action" />,
    cell: ({ row }) => (
      <Badge className="bg-primary/10 text-primary text-xs">
        {row.getValue("action")}
      </Badge>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "details",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Details" />,
    enableSorting: true,
  },
  {
    accessorKey: "user",
    header: ({ column }) => <DataTableColumnHeader column={column} title="User" />,
    enableSorting: true,
  },
];
