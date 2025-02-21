"use client";

import * as React from "react";

import { BiColumns } from "react-icons/bi";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Task } from "@/app/data/tasks-data";
import { Table } from "@tanstack/react-table";
import { useTasksDataStore } from "@/app/hooks/useTasksDataStore";

export function DropDownViewColumns({ table }: { table: Table<Task> }) {
  // access to the tasks array
  const { tasks } = useTasksDataStore();
  //
  const columnsToHide = ["priority", "status", "createdAt"];
  // jsx
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          disabled={!tasks}
          variant="outline"
          className="h-11 px-8 poppins"
        >
          <BiColumns />
          <span>View</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="poppins">
        {table
          .getAllColumns()
          .filter(
            (column) => column.getCanHide() && columnsToHide.includes(column.id)
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
