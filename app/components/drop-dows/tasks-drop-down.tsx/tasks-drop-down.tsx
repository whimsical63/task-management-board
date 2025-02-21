"use client"; // Marks this as a Client Component in Next.js
import { useEffect, useState } from "react"; // Import useState for managing state
import { Trash } from "lucide-react"; // Import icons from Lucide
import { BsThreeDots } from "react-icons/bs"; // Import three dots icon from React Icons
import { Button } from "@/components/ui/button"; // Import custom Button component
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"; // Import DropdownMenu components
import { MENU_ITEMS } from "./constants";
import { MenuItem } from "./menu-items";
import { LabelSubMenu } from "./sub-label-menu";
import { MenuItemType } from "./types";
import { useTasksDataStore } from "@/app/hooks/useTasksDataStore";
import { Label, Task } from "@/app/data/tasks-data";
import { toast } from "@/hooks/use-toast";

// Main TaskDropDown component
export function TaskDropDown({
  onOpen,
  onClose,
}: {
  onOpen: () => void;
  onClose: () => void;
}) {
  // selected label
  const [selectedLabel, setSelectedLabel] = useState("Bug");
  // selected task
  const { selectedTask, updateTasks } = useTasksDataStore();
  const { tasks } = useTasksDataStore();

  //menu items array sate
  const [menuItemsArray, setMenuItemsArray] =
    useState<MenuItemType[]>(MENU_ITEMS);

  // Update menu items based on selectedTask's isFavorite property
  useEffect(() => {
    setMenuItemsArray((prev) =>
      prev.map((item) => {
        if (item.kind === "favorite") {
          return {
            ...item,
            label: selectedTask?.isFavorite ? "Unfavorite" : "Favorite",
          };
        }
        return item;
      })
    );
  }, [selectedTask]);

  //update the selected label based on the label property in the selected task
  useEffect(() => {
    if (selectedTask) {
      setSelectedLabel(selectedTask.label);
    }
  }, [selectedTask]);

  // Function to handle label clicks
  const clickedLabelItem = async (newLabel: string) => {
    // Validate the new label
    const validLabels: Label[] = ["Bug", "Documentation", "Feature"];
    if (!validLabels.includes(newLabel as Label)) {
      console.error(`The type ${newLabel} is incorrect`);
      return;
    }

    // Update the task's label in the data store
    if (selectedTask && tasks) {
      const updatedTask: Task = {
        ...selectedTask,
        label: newLabel as Label,
      };

      // Create a new tasks array with the updated task
      const updateTasksArray = tasks.map((task) =>
        task.taskId === selectedTask.taskId ? updatedTask : task
      );

      try {
        // Save the updated tasks array to the data store
        const result = await updateTasks(updateTasksArray);

        toast({
          variant: result.success ? "default" : "destructive",
          title: result.success
            ? `[${selectedTask.taskId}] Updated Successfully!`
            : `[${selectedTask.taskId}] Updated Failed!`,
          description: result.message,
        });
      } catch (error) {
        console.error("Failed to update tasks:", error);
      }
    }
  };

  return (
    <DropdownMenu
      onOpenChange={(open: boolean) => (open ? onOpen() : onClose())}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <BsThreeDots /> {/* Three dots icon for the dropdown trigger */}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 poppins">
        <DropdownMenuGroup>
          {menuItemsArray.map(
            (
              item // Map over menu items
            ) => (
              <MenuItem
                key={item.label}
                kind={item.kind}
                Icon={item.icon}
                label={item.label}
                shortcut={item.shortcut}
              />
            )
          )}
        </DropdownMenuGroup>
        <DropdownMenuSeparator /> {/* Separator between menu groups */}
        <DropdownMenuGroup>
          <LabelSubMenu
            onClickedLabelItem={clickedLabelItem}
            value={selectedLabel}
            onValueChange={setSelectedLabel} // Pass state and setter to LabelSubMenu
          />
        </DropdownMenuGroup>
        <DropdownMenuSeparator /> {/* Separator between menu groups */}
        {/* Delete menu item with red text */}
        <MenuItem
          Icon={Trash}
          kind="delete"
          label="Delete"
          shortcut="⇧⌘Q"
          className="text-red-500"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
