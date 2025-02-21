import { z } from "zod";

export type Label = "Bug" | "Feature" | "Documentation";
export type Priority = "Low" | "Medium" | "High";

// Define the schema
export const taskFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title is too long"),
  status: z.enum(["Backlog", "Todo", "In Progress", "Done", "Canceled"]),
  priority: z.enum(["Low", "Medium", "High"]),
  label: z.enum(["Bug", "Documentation", "Feature"]),
});

// Infer the type from the schema
export type TaskFormData = z.infer<typeof taskFormSchema>;
