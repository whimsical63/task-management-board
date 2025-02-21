import { FilterFn } from "@tanstack/react-table";
import { Task } from "@/app/data/tasks-data";

export const statusFilter: FilterFn<Task> = (
  row,
  columnId,
  filterValue: string
) => {
  const status: string = row.getValue(columnId);
  return filterValue.includes(status);
};
