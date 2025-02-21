import { Card } from "@/components/ui/card";
import React, { ReactNode, useMemo } from "react";
import { FaTasks, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import { useTasksDataStore } from "../hooks/useTasksDataStore";

type SingleCard = {
  title: string;
  kind: "total" | "completed" | "high";
  count: number;
  icon: ReactNode;
};

// Array of task statistics cards
const statCardsArray: SingleCard[] = [
  {
    title: "Total Tasks",
    count: 0,
    kind: "total",
    icon: <FaTasks />,
  },
  {
    title: "Completed Tasks",
    kind: "completed",
    count: 0,
    icon: <FaCheckCircle />,
  },
  {
    title: "High Priority Tasks",
    kind: "high",
    count: 0,
    icon: <FaExclamationTriangle />,
  },
];

export default function StatCards() {
  //access to the tasks array
  const { tasks } = useTasksDataStore();

  //use the useMemo hook to update the count propreties
  const countStatsCards: SingleCard[] = useMemo(() => {
    //if the tasks in null, return the statCardsArray array
    if (!tasks) {
      return statCardsArray;
    }

    return statCardsArray.map((card) => {
      switch (card.kind) {
        // total case
        case "total":
          return { ...card, count: tasks.length };
        // completed case
        case "completed":
          return {
            ...card,
            count: tasks.filter((task) => task.status === "Done").length,
          };
        // high case
        case "high":
          return {
            ...card,
            count: tasks.filter((task) => task.priority === "High").length,
          };

        // otherwise return the card state in the array
        default:
          return card;
      }
    });
  }, [tasks]);

  return (
    <div className="grid grid-cols-3 max-sm:grid-cols-1 mt-7 gap-6 p-6">
      {countStatsCards.map((stat, index) => (
        <SingleStatCard key={index} SingleCard={stat} />
      ))}
    </div>
  );
}

function SingleStatCard({ SingleCard }: { SingleCard: SingleCard }) {
  return (
    <Card className="p-4 flex flex-col gap-2 shadow-none">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-slate-600">
          {SingleCard.title}
        </span>
        <div className="size-7 rounded-md flex items-center justify-center text-sm bg-primary/25 font-bold text-primary">
          {SingleCard.icon}
        </div>
      </div>

      {/* Value */}
      <div className="text-3xl font-bold">{SingleCard.count}</div>
    </Card>
  );
}
