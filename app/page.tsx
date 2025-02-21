"use client";

import { useTheme } from "next-themes";
import Navbar from "./components/nav-bar";
import StatCards from "./components/stats-cards";
import TasksArea from "./components/task-area/tasks-area";
import { useTasksDataStore } from "./hooks/useTasksDataStore";
import { useEffect } from "react";

export default function Home() {
  // use theme hook
  const { theme } = useTheme();
  const { fetchTasks } = useTasksDataStore();

  //call the method to simulate the fetching of data
  useEffect(() => {
    fetchTasks();
  }, []);

  //save the color based on the theme state
  const bgColor = theme === "dark" ? "bg-black" : "bg-slate-50";

  //jsx
  return (
    <div className={`poppins min-h-screen ${bgColor}`}>
      <Navbar />
      <StatCards />
      <TasksArea />
    </div>
  );
}
