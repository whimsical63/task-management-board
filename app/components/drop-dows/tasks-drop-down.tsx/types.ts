import { ToastActionElement } from "@/components/ui/toast";
import { LucideIcon } from "lucide-react";

export type Kind = "edit" | "copy" | "favorite" | "delete";

export interface ToastFunction {
  (props: {
    variant?: "default" | "destructive" | "success" | "info";
    title: string;
    description?: string;
    action?: ToastActionElement;
  }): void;
}

export interface MenuItemType {
  icon: LucideIcon;
  label: string;
  kind: Kind;
  shortcut: string;
}
