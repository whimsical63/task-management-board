import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { IoCloseSharp } from "react-icons/io5";
import SearchInput from "./search-input";
import { PriorityDropDown } from "../drop-dows/priority-drop-down";
import { StatusDropDown } from "../drop-dows/status-drop-down";
import { DropDownViewColumns } from "../drop-dows/view-columns-drop-down";
import { TasksTable } from "./tasks-table";
import { tasksColumns } from "./tasks-columns";

import PaginationArea from "./pagination/pagination-area";
import { useCheckedPrioritiesStore } from "@/app/hooks/useCheckedPriortiesStore";
import { useCheckedStatusesStore } from "@/app/hooks/useCheckedStatusStore";

import { useTasksDataStore } from "@/app/hooks/useTasksDataStore";
import TableSkeleton from "./TableSkeleton";
import { useEffect, useState } from "react";
import { titleFilter } from "./filters/titleFilter";
import { priorityFilter } from "./filters/priorityFilter";
import { statusFilter } from "./filters/statusFilter";
import { useQueryStore } from "@/app/hooks/useQueryStore";

import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { TasksSelected } from "./tasks-selected";

export default function TasksArea() {
  const { setCheckedPriorities, checkedPriorities } =
    useCheckedPrioritiesStore();
  const { setCheckedStatuses, checkedStatuses } = useCheckedStatusesStore();
  const { tasks } = useTasksDataStore();

  const { query } = useQueryStore();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 8,
  });
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: tasks || [],
    columns: tasksColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      rowSelection,
      pagination,
      sorting,
    },
    filterFns: { titleFilter, priorityFilter, statusFilter }, // Include the filterFns property here
  });

  useEffect(() => {
    const newFilters: ColumnFiltersState = [];

    if (query) {
      newFilters.push({ id: "title", value: query });
    }

    if (checkedPriorities.length > 0) {
      newFilters.push({ id: "priority", value: checkedPriorities });
    }

    if (checkedStatuses.length > 0) {
      newFilters.push({ id: "status", value: checkedStatuses });
    }

    console.log(newFilters);

    setColumnFilters(newFilters);
  }, [query, checkedPriorities, checkedStatuses]);

  const selectedTasks = Object.keys(rowSelection)
    .map(Number)
    .map((index) => tasks?.[index]);

  return (
    <div className="px-7 mt-5">
      <Card>
        {/* card header */}
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SearchInput />
              {/* status drop down */}
              <StatusDropDown />
              {/* priority drop down */}
              <PriorityDropDown />

              {(checkedPriorities.length !== 0 ||
                checkedStatuses.length !== 0) && (
                <>
                  <Button
                    onClick={() => {
                      setCheckedPriorities([]);
                      setCheckedStatuses([]);
                    }}
                    variant={"ghost"}
                    className="h-10"
                  >
                    <span>Reset</span>
                    <IoCloseSharp />
                  </Button>
                </>
              )}
            </div>

            {/* DropDownViewColumns */}
            <DropDownViewColumns table={table} />
          </div>
        </CardHeader>
        <TasksSelected
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          selectedTasks={selectedTasks}
        />
        <CardContent>
          {!tasks ? (
            <TableSkeleton />
          ) : (
            <TasksTable table={table} columns={tasksColumns} />
          )}
        </CardContent>
        <CardFooter>
          <PaginationArea
            pagination={pagination}
            setPagination={setPagination}
            table={table}
          />
        </CardFooter>
      </Card>
    </div>
  );
}
