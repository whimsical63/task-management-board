import { Task } from "@/app/data/tasks-data";
import { useTasksDataStore } from "@/app/hooks/useTasksDataStore";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Trash2, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

export function TasksSelected({
  rowSelection,
  setRowSelection,
  selectedTasks,
}: {
  rowSelection: Record<number, boolean>;
  setRowSelection: Dispatch<SetStateAction<Record<number, boolean>>>;
  selectedTasks: (Task | undefined)[];
}) {
  //convert the rowSelection into an array
  const rowSelectionArray = Object.keys(rowSelection);
  const { tasks, updateTasks } = useTasksDataStore();
  const { toast } = useToast();

  //if the length is 0 return nothing
  if (rowSelectionArray.length === 0) {
    return;
  }

  async function deleteSelectedTasks() {
    if (tasks) {
      const updateTasksArray = tasks?.filter(
        (task) =>
          !selectedTasks.some(
            (selectedTask) => selectedTask?.taskId === task.taskId
          )
      );

      const result = await updateTasks(updateTasksArray);

      if (result.success) {
        toast({
          variant: result.success ? "default" : "destructive",
          title: result.success
            ? `Tasks have been deleted successfully!`
            : `Failed to delete the selected tasks`,
          description: result.message,
        });
      }

      setRowSelection({});
    }
  }

  //otherwise show the component
  return (
    <div className="px-7  pb-5 pt-2 flex items-center gap-3 ">
      <span className="text-sm text-gray-600">
        {rowSelectionArray.length} Tasks Selected
      </span>
      <div className="flex  items-center pl-3 gap-3">
        <Badge
          variant={"default"}
          className="flex items-center gap-1 shadow-none cursor-pointer select-none"
          onClick={deleteSelectedTasks}
        >
          <Trash2 size={12} />
          <span className="mt-[2px]">Delete All</span>
        </Badge>
        <Badge
          onClick={() => setRowSelection({})}
          variant={"secondary"}
          className="flex items-center gap-1 shadow-none bg-transparent cursor-pointer select-none"
        >
          <X size={13} />
          <span className="mt-[2px]">Clear selection</span>
        </Badge>
      </div>
    </div>
  );
}
