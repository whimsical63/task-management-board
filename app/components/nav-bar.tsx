"use client";

import { ListTodo } from "lucide-react";

import { useTheme } from "next-themes";
import { ModeToggle } from "../mode-toggle";

import TaskDialog from "./task-dialog/task-dialog";

export default function Navbar() {
  //
  const { theme } = useTheme();

  // color switcher
  //
  const bgColor = theme === "dark" ? "bg-black border-t" : "bg-white";

  //jsx
  return (
    <div
      className={`poppins relative w-full h-[92px]  overflow-hidden   
    flex justify-between items-center px-6 border-b ${bgColor}  `}
    >
      {/* Header with Title and Icon */}
      <AppNameLogo />

      <div className="flex items-center gap-3 justify-center">
        <TaskDialog />
        <ModeToggle />
      </div>
    </div>
  );
}

export function AppNameLogo() {
  return (
    //   main container
    <header className="flex items-center gap-2 left-10 top-8">
      {/* icon wrapper */}
      <div className="size-9 bg-primary rounded-md flex justify-center items-center">
        {/* icon */}
        <ListTodo className="text-white text-xl" aria-hidden="true" />
      </div>

      {/* App name */}
      <h1 className="font-semibold text-2xl font-poppins max-md:hidden">
        LAU Task <span className="font-normal text-primary">Board</span>
      </h1>
    </header>
  );
}
