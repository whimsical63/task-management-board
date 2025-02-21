"use client";

import * as React from "react";
import {
  ArrowUpCircle,
  CheckCircle2,
  Circle,
  HelpCircle,
  LucideIcon,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { GoPlusCircle } from "react-icons/go";
import { Checkbox } from "@/components/ui/checkbox";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { Status } from "@/app/data/tasks-data";
import { useCheckedStatusesStore } from "@/app/hooks/useCheckedStatusStore";
import { useTasksDataStore } from "@/app/hooks/useTasksDataStore";

type SingleStatusItem = {
  value: string;
  label: string;
  icon: LucideIcon;
  count: number;
};

const statusesArray: SingleStatusItem[] = [
  {
    value: "backlog",
    label: "Backlog",
    icon: HelpCircle,
    count: 0,
  },
  {
    value: "todo",
    label: "Todo",
    icon: Circle,
    count: 0,
  },
  {
    value: "in progress",
    label: "In Progress",
    icon: ArrowUpCircle,
    count: 0,
  },
  {
    value: "done",
    label: "Done",
    icon: CheckCircle2,
    count: 0,
  },
  {
    value: "canceled",
    label: "Canceled",
    icon: XCircle,
    count: 0,
  },
];

export function StatusDropDown() {
  //state to open the drop down
  const [open, setOpen] = React.useState(false);
  //state to save the checked status

  //
  const { checkedStatuses, setCheckedStatuses } = useCheckedStatusesStore();

  const { tasks } = useTasksDataStore();
  //access to the tasks array

  function updateTheCheckedStatus(label: string) {
    //create an array of valid statuses
    const validStatuses: Status[] = [
      "Backlog",
      "Canceled",
      "Done",
      "In Progress",
      "Todo",
    ];

    //
    if (!validStatuses.includes(label as Status)) {
      console.error(`The type ${label} does not match the status types!`);
      return;
    }

    //safely cast the value as a status type
    const castedStatus = label as Status;

    const newCheckedStatuses: Status[] = checkedStatuses.includes(
      castedStatus as Status
    )
      ? checkedStatuses.filter((s) => s !== castedStatus)
      : [...checkedStatuses, castedStatus];

    setCheckedStatuses(newCheckedStatuses);
  }

  const countStatuses: SingleStatusItem[] = React.useMemo(() => {
    if (!tasks) return statusesArray;

    return statusesArray.map((status) => {
      switch (status.value) {
        // backlog option
        case "backlog":
          return {
            ...status,
            count: tasks.filter((task) => task.status === "Backlog").length,
          };
        // to do option
        case "todo":
          return {
            ...status,
            count: tasks.filter((task) => task.status === "Todo").length,
          };
        // canceled option
        case "canceled":
          return {
            ...status,
            count: tasks.filter((task) => task.status === "Canceled").length,
          };
        // done option
        case "done":
          return {
            ...status,
            count: tasks.filter((task) => task.status === "Done").length,
          };
        // in progress option
        case "in progress":
          return {
            ...status,
            count: tasks.filter((task) => task.status === "In Progress").length,
          };

        default:
          return status;
      }
    });
  }, [tasks]);

  function ShowCheckedStatuses() {
    // get the length of items checked
    const checkedStatusesLength = checkedStatuses.length;

    //if it is more than 0
    if (checkedStatusesLength > 0) {
      //see if there's less than two elements, show the two tags checked
      if (checkedStatusesLength <= 2) {
        return (
          <>
            {/* Separator */}
            <Separator
              orientation="vertical"
              className="h-6 border-l border-gray-300"
            />

            {/* Badges */}
            <div className="flex items-center gap-2">
              {checkedStatuses.map((status, index) => (
                <Badge key={index} variant={"secondary"}>
                  {status}
                </Badge>
              ))}
            </div>
          </>
        );
      } else {
        // when it is more than 3 items, show 3 selected
        return <Badge variant={"secondary"}>3 Selected</Badge>;
      }
    }
  }

  return (
    <div className="flex items-center space-x-4">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            size="sm"
            disabled={!tasks}
            variant={"outline"}
            className=" h-10 justify-start border-dashed px-5"
          >
            <div className="flex items-center gap-4">
              {/* Status Label */}
              <div className="flex items-center gap-2">
                <GoPlusCircle />
                <span>Status</span>
              </div>

              {/* show the checked statuses */}
              <ShowCheckedStatuses />
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 poppins" side="bottom" align="center">
          <Command>
            <CommandInput placeholder="Change status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {countStatuses.map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.value}
                    className="flex justify-between"
                    onSelect={() => updateTheCheckedStatus(status.label)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={checkedStatuses.includes(
                          status.label as Status
                        )}
                      />

                      {/* item icon */}
                      <status.icon />
                      {/* item label */}
                      <span>{status.label}</span>
                    </div>

                    <pre>{status.count}</pre>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
