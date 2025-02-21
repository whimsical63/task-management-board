import { Copy, Edit2, Star } from "lucide-react";
import { MenuItemType } from "./types";

export const MENU_ITEMS: MenuItemType[] = [
  {
    icon: Edit2,
    label: "Edit",
    kind: "edit",
    shortcut: "⇧⌘E",
  },
  {
    icon: Copy,
    label: "Make a Copy",
    kind: "copy",
    shortcut: "⌘C",
  },
  {
    icon: Star,
    label: "Favorite",
    kind: "favorite",
    shortcut: "⌘S",
  },
];

// Label options configuration
export const LABEL_OPTIONS = ["Bug", "Feature", "Documentation"];
