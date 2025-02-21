import { LucideIcon } from "lucide-react";
import {
  DropdownMenuItem,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { handleMenuItemClick } from "./utils";
import { useTasksDataStore } from "@/app/hooks/useTasksDataStore";
import { useToast } from "@/hooks/use-toast";
import { Kind } from "./types";
import { useOpenDialogStore } from "@/app/hooks/useOpenDialogStore";

export function MenuItem({
  Icon,
  kind,
  label,
  shortcut,
  className,
}: {
  Icon: LucideIcon; // Icon component
  kind: Kind;
  label: string; // Text label
  shortcut: string; // Keyboard shortcut
  className?: string; // Optional className for styling
}) {
  const { tasks, selectedTask, updateTasks } = useTasksDataStore();
  const { toast } = useToast();
  const { setIsOpen } = useOpenDialogStore();

  return (
    <DropdownMenuItem
      onClick={() =>
        handleMenuItemClick(
          kind,
          tasks,
          selectedTask,
          updateTasks,
          toast,
          setIsOpen
        )
      }
    >
      <Icon className={`mr-2 h-4 w-4 ${className}`} /> {/* Render the icon */}
      <span className={`${className}`}>{label}</span> {/* Render the label */}
      {shortcut && ( // Render the shortcut if it exists
        <DropdownMenuShortcut className={`${className}`}>
          {shortcut}
        </DropdownMenuShortcut>
      )}
    </DropdownMenuItem>
  );
}
