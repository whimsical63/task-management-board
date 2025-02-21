import { FilterFn } from "@tanstack/react-table";
import { Task } from "@/app/data/tasks-data";

export const priorityFilter: FilterFn<Task> = (
  row,
  columnId,
  filterValue: string
) => {
  const priority: string = row.getValue(columnId);
  return filterValue.includes(priority);
};
