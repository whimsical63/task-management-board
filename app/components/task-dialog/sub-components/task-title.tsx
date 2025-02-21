import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import { useFormContext } from "react-hook-form";
import { TaskFormData } from "../task-dialog-schema";

export default function TaskTitle() {
  const {
    register,
    formState: { errors },
  } = useFormContext<TaskFormData>();
  return (
    <div className="flex flex-col gap-2">
      <Label className="opacity-75 text-sm font-medium">Task Title</Label>
      <Input placeholder="Study..." {...register("title")} className="h-11" />
      {errors.title && (
        <p className="text-red-500 text-sm">{errors.title.message}</p>
      )}
    </div>
  );
}
