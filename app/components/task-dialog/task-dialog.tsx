"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import TaskTitle from "./sub-components/task-title";

import TaskStatus from "./sub-components/task-status";
import TaskPriority from "./sub-components/task-priority";

import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TaskFormData, taskFormSchema } from "./task-dialog-schema";
import TaskLabels from "./sub-components/task-labels";
import { generateRandomThreeDigitNumber } from "@/app/functions/generateRandomNumbers";
import { useToast } from "@/hooks/use-toast";
import { Task } from "@/app/data/tasks-data";
import { useEffect, useState } from "react";
import { useTasksDataStore } from "@/app/hooks/useTasksDataStore";
import { Loader2 } from "lucide-react";
import { useOpenDialogStore } from "@/app/hooks/useOpenDialogStore";

export default function TaskDialog() {
  const { addTask, selectedTask, setSelectedTask, updateTasks, tasks } =
    useTasksDataStore();

  const methods = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
    },
  });

  const { handleSubmit, reset, setValue } = methods;

  const { toast } = useToast();
  const { isOpen, setIsOpen } = useOpenDialogStore();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && selectedTask) {
      // Update form values when a task is selected and dialog is open
      setValue("title", selectedTask.title);
      setValue("status", selectedTask.status);
      setValue("priority", selectedTask.priority);
      setValue("label", selectedTask.label);
    }
  }, [isOpen, selectedTask, setValue]);

  const onSubmit = async (data: TaskFormData) => {
    setIsLoading(true);

    if (!selectedTask) {
      const newTask: Task = {
        taskId: `Task-${generateRandomThreeDigitNumber()}`,
        title: data.title,
        status: data.status,
        priority: data.priority,
        label: data.label,
        isFavorite: false,
        createdAt: new Date(),
      };

      try {
        const result = await addTask(newTask);
        toast({
          variant: result.success ? "default" : "destructive",
          title: result.success
            ? `The Task[${newTask.taskId}] Updated Successfully!`
            : `Failed to add the task!`,
          description: result.message,
        });

        reset();
        setIsOpen(false);
      } catch (error) {
        console.log(error);

        toast({
          variant: "destructive",
          title: "Failed to add the task!",
          description: "An unexpected error occurred.",
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      const updateTasksArray = tasks?.map((t) => {
        if (t.taskId === selectedTask.taskId) {
          return {
            ...t,
            title: data.title,
            label: data.label,
            priority: data.priority,
            status: data.status,
          };
        }

        return t;
      });

      if (updateTasksArray) {
        const result = await updateTasks(updateTasksArray, "copy");
        toast({
          variant: result.success ? "default" : "destructive",
          title: result.success ? "Editing successful" : "Failed Failed!",
          description: `Task ${selectedTask.taskId} edited successfully!`,
        });
      }

      setIsLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          setSelectedTask(null);
          reset({ title: "" });
        }
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button>Add New Task</Button>
      </DialogTrigger>
      <DialogContent className="poppins max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {selectedTask ? "Edit Task" : "Add Task"}
          </DialogTitle>
          <DialogDescription>Fill in the form to add a task</DialogDescription>
          <div className="mt-4">
            <Separator className="mt-3" />
          </div>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="my-8">
              <div className="grid grid-cols-2 gap-5">
                <TaskTitle />
                <TaskStatus />
              </div>
              <div className="grid grid-cols-2 gap-5 mt-6">
                <TaskPriority />
                <TaskLabels />
              </div>
            </div>
            <DialogFooter className="mb-4">
              <DialogClose asChild>
                <Button type="button" variant="secondary" className="px-9">
                  Close
                </Button>
              </DialogClose>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {selectedTask ? "Updating Task..." : "Adding Task..."}
                  </>
                ) : selectedTask ? (
                  "Update Task"
                ) : (
                  "Add New Task"
                )}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
