import { Task } from "@/app/data/tasks-data";
import { useTasksDataStoreInterface } from "@/app/hooks/useTasksDataStore";

import { Kind } from "./types";

import { Toast, ToasterToast } from "@/hooks/use-toast";
import { generateRandomThreeDigitNumber } from "@/app/functions/generateRandomNumbers";

export async function handleMenuItemClick(
  kind: Kind,
  tasks: Task[] | null,
  selectedTask: Task | null,
  updateTasks: useTasksDataStoreInterface["updateTasks"],
  toast: ({ ...props }: Toast) => {
    id: string;
    dismiss: () => void;
    update: (props: ToasterToast) => void;
  },
  setIsOpen: (isOpen: boolean) => void
) {
  if (!tasks || !selectedTask) return;

  switch (kind) {
    case "edit":
      // open the dialog
      setIsOpen(true);
      break;
    case "favorite":
      const taskToUpdate: Task = {
        ...selectedTask,
        isFavorite: !selectedTask.isFavorite,
      };
      const updateTasksArray = tasks.map((task) =>
        task.taskId === selectedTask.taskId ? taskToUpdate : task
      );
      const favoriteResult = await updateTasks(updateTasksArray);
      if (!favoriteResult.success) {
        toast({
          variant: "destructive",
          title: "Operation Failed!",
          description: "Something went wrong!",
        });
      } else {
        toast({
          variant: "default",
          title: "Task updated!",
          description: favoriteResult.message,
        });
      }

      break;
    case "copy":
      const copiedTask: Task = {
        ...selectedTask,
        taskId: `task-${generateRandomThreeDigitNumber()}`,
        title: `${selectedTask.title} (copy)`,
        createdAt: new Date(),
      };
      const addCopiedTask = [...tasks, copiedTask];
      const result = await updateTasks(addCopiedTask, "copy");
      toast({
        variant: result.success ? "default" : "destructive",
        title: result.success ? "Copy Successful!" : "Copy Failed!",
        description: result.message,
      });

      break;

    case "delete":
      const deleteTasksArray = tasks.filter(
        (task) => task.taskId !== selectedTask.taskId
      );
      const deleteResult = await updateTasks(deleteTasksArray, "delete");
      toast({
        variant: deleteResult.success ? "default" : "destructive",
        title: deleteResult.success
          ? "Deletion Successful!"
          : "Deletion Failed!",
        description: deleteResult.message,
      });
      break;

    default:
      break;
  }
}
