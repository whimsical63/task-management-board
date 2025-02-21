"use client";

import * as React from "react";

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

import { IoMdArrowUp } from "react-icons/io";
import { IoArrowBack } from "react-icons/io5";
import { IoArrowDown } from "react-icons/io5";
import { IconType } from "react-icons/lib";

import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

import { Priority } from "@/app/data/tasks-data";
import { useCheckedPrioritiesStore } from "@/app/hooks/useCheckedPriortiesStore";
import { useTasksDataStore } from "@/app/hooks/useTasksDataStore";

type SinglePriorityItem = {
  value: string;
  label: string;
  icon: IconType;
  count: number;
};

const prioritiesArray: SinglePriorityItem[] = [
  {
    value: "low",
    label: "Low",
    icon: IoArrowDown,
    count: 0,
  },
  {
    value: "medium",
    label: "Medium",
    icon: IoArrowBack,
    count: 0,
  },
  {
    value: "high",
    label: "High",
    icon: IoMdArrowUp,
    count: 0,
  },
];

export function PriorityDropDown() {
  // states to open the drop down
  const [open, setOpen] = React.useState(false);

  const { checkedPriorities, setCheckedPriorities } =
    useCheckedPrioritiesStore();

  const { tasks } = useTasksDataStore();

  //function to update the array when a priority is checked
  function updateTheSelection(label: string) {
    //this code will safely take the value from string to a priority type
    //to safely caste it down below, and avoid using a type that is not
    //defined
    //--------------------------------------

    // valid priorities
    const validPriorities: Priority[] = ["Low", "Medium", "High"];

    if (!validPriorities.includes(label as Priority)) {
      console.error("Invalid priority type");
      return;
    }
    //---------------------------------------------

    //cast safely the capitalizedPriority as a priority
    const priority = label as Priority;

    //check if the priority is already added in the array or not to avoid duplicates
    const newCheckedPriorities = checkedPriorities.includes(priority)
      ? checkedPriorities.filter((p) => p !== priority)
      : [...checkedPriorities, priority];

    //update the checkedPriorities state
    setCheckedPriorities(newCheckedPriorities);
  }

  //this useMemo hook is going to be excuted every time the tasks
  //is updated
  const priorityCounts: SinglePriorityItem[] = React.useMemo(() => {
    //if the tasks is null, return statusesArray
    if (!tasks) {
      return prioritiesArray;
    }

    //count the priorities of low, medium, and high
    const countByLow = tasks?.filter((task) => task.priority === "Low").length;
    const countByMedium = tasks?.filter(
      (task) => task.priority === "Medium"
    ).length;
    const countByHigh = tasks?.filter(
      (task) => task.priority === "High"
    ).length;

    //update the count property of the statusArray based on the priority
    //and return it
    return prioritiesArray.map((priority) => {
      switch (priority.value) {
        case "low":
          return { ...priority, count: countByLow };
        case "medium":
          return { ...priority, count: countByMedium };
        case "high":
          return { ...priority, count: countByHigh };
        default:
          return priority;
      }
    });
  }, [tasks]);

  //jsx
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
              {/* Priority Label */}
              <div className="flex items-center gap-2">
                <GoPlusCircle />
                <span>Priority</span>
              </div>

              {checkedPriorities?.length > 0 && (
                <>
                  <Separator
                    orientation="vertical"
                    className="h-6 border-l border-gray-300"
                  />
                  <div className="flex items-center gap-2">
                    {checkedPriorities.map((checkPriority, index) => (
                      <Badge key={index} variant={"secondary"}>
                        {checkPriority}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="p-0 poppins w-52"
          side="bottom"
          align="center"
        >
          <Command>
            <CommandInput placeholder="Change Priority..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {priorityCounts.map((priority) => (
                  <CommandItem
                    key={priority.value}
                    value={priority.value}
                    className="flex justify-between"
                    onSelect={() => updateTheSelection(priority.label)}
                  >
                    <div className="flex items-center gap-3">
                      <Checkbox
                        // update the checked priority to be synchornized with the checkPriorities array
                        checked={checkedPriorities.includes(
                          priority.label as Priority
                        )}
                      />

                      {/* item icon */}
                      <priority.icon />
                      {/* item label */}
                      <span>{priority.label}</span>
                    </div>

                    <pre>{priority.count}</pre>
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
