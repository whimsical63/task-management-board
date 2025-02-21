import { FilterFn } from "@tanstack/react-table";
import { Task } from "@/app/data/tasks-data";

export const titleFilter: FilterFn<Task> = (row, _, filterValue) => {
  const title: string = row.getValue("title") || "";
  const query = String(filterValue).toLowerCase();
  return title.toLowerCase().includes(query);
};
