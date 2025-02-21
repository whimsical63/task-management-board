"use client";

import { Priority, Status, Task } from "@/app/data/tasks-data";
import { Badge } from "@/components/ui/badge";
import { Column, ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpCircle,
  CheckCircle2,
  Circle,
  HelpCircle,
  XCircle,
} from "lucide-react";

import { IoMdArrowUp } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { IoArrowDown } from "react-icons/io5";

import { Star } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

import { ArrowUpDown } from "lucide-react";
import { IoMdArrowDown } from "react-icons/io";
import { GrHide } from "react-icons/gr";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTasksDataStore } from "@/app/hooks/useTasksDataStore";
import { TaskDropDown } from "../drop-dows/tasks-drop-down.tsx/tasks-drop-down";
import { useOpenDialogStore } from "@/app/hooks/useOpenDialogStore";

function renderStatusIcons(status: Status) {
  switch (status) {
    case "Backlog":
      return HelpCircle;
    case "Canceled":
      return XCircle;
    case "Done":
      return CheckCircle2;
    case "In Progress":
      return ArrowUpCircle;
    case "Todo":
      return Circle;
    default:
      break;
  }
}

function renderPriorityIcons(priority: Priority) {
  switch (priority) {
    case "Low":
      return IoArrowDown;
    case "Medium":
      return IoArrowBack;
    case "High":
      return IoMdArrowUp;

    default:
      break;
  }
}

function formatDate(date: Date): string {
  // Extract date parts
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  // Add ordinal suffix
  const suffix =
    day % 10 === 1 && day !== 11
      ? "st"
      : day % 10 === 2 && day !== 12
      ? "nd"
      : day % 10 === 3 && day !== 13
      ? "rd"
      : "th";

  return `${day}${suffix} ${month} ${year}`;
}

type SortableHeaderProps = {
  column: Column<Task, unknown>; // Specify the type of data
  label: string;
};

const SortableHeader: React.FC<SortableHeaderProps> = ({ column, label }) => {
  const isSorted = column.getIsSorted();
  const SortingIcon =
    isSorted === "asc"
      ? IoMdArrowUp
      : isSorted === "desc"
      ? IoMdArrowDown
      : ArrowUpDown;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="" asChild>
        <div
          className={`flex items-start py-[14px] select-none cursor-pointer  p-2 gap-1 ${
            isSorted && "text-primary"
          }`}
          aria-label={`Sort by ${label}`}
        >
          {label}
          <SortingIcon className=" h-4 w-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" side="bottom" className="poppins">
        <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
          <IoMdArrowUp className="mr-2 h-4 w-4" />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
          <IoMdArrowDown className="mr-2 h-4 w-4" />
          Desc
        </DropdownMenuItem>
        {/* only show the hide button for the other elements than the title */}
        {label !== "Title" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                column.toggleVisibility();
              }}
            >
              <GrHide className="mr-2 size-7 text-opacity-90" />
              Hide
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const tasksColumns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "taskId",
    header: "Task",
  },
  {
    accessorKey: "isFavorite",
    header: "",
    cell: ({ row }) => {
      const FavoriteIcon = row.original.isFavorite && Star;
      return FavoriteIcon && <FavoriteIcon size={14} />;
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => <SortableHeader column={column} label="Title" />,
    cell: ({ row }) => {
      const taskLabel = row.original.label;
      const taskTitle = row.original.title;
      return (
        <div className="flex items-center gap-2">
          <Badge variant={"outline"}>{taskLabel}</Badge>
          <span>{taskTitle}</span>
        </div>
      );
    },
    filterFn: "titleFilter",
  },
  {
    accessorKey: "status",
    header: ({ column }) => <SortableHeader column={column} label="Status" />,
    cell: ({ row }) => {
      const StatusIcon = renderStatusIcons(row.original.status);
      const status = row.original.status;
      return (
        <div className="flex items-center gap-2 text-sm">
          {StatusIcon && (
            <StatusIcon size={17} className="text-gray-600 opacity-95" />
          )}

          <span>{status}</span>
        </div>
      );
    },
    filterFn: "statusFilter",
  },
  {
    accessorKey: "priority",
    header: ({ column }) => <SortableHeader column={column} label="Priority" />,
    cell: ({ row }) => {
      const PriorityIcon = renderPriorityIcons(row.original.priority);
      const priority = row.original.priority;
      return (
        <div>
          {PriorityIcon && (
            <div className="flex items-center gap-2 text-sm">
              <PriorityIcon className="text-gray-600 opacity-95" />
              {priority}
            </div>
          )}
        </div>
      );
    },
    filterFn: "priorityFilter",
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <SortableHeader column={column} label="Created At" />
    ),
    cell: ({ row }) => {
      const date = row.original.createdAt;
      const formattedDate = formatDate(date);

      return formattedDate;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return <ShowTaskDropDown task={row.original} />;
    },
  },
];

function ShowTaskDropDown({ task }: { task: Task }) {
  const { setSelectedTask } = useTasksDataStore();
  const { isOpen } = useOpenDialogStore();

  return (
    <TaskDropDown
      onOpen={() => setSelectedTask(task)}
      //only if the dialog is open, don't set the selected task as null, when the drop down is closed
      onClose={() => {
        if (!isOpen) {
          setSelectedTask(null);
        }
      }}
    />
  );
}
