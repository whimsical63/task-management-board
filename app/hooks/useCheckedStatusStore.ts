import { create } from "zustand";
import { Status } from "../data/tasks-data";

interface useCheckedStatusesStoreInterface {
  checkedStatuses: Status[];
  setCheckedStatuses: (statusesProp: Status[]) => void;
}

export const useCheckedStatusesStore = create<useCheckedStatusesStoreInterface>(
  (set) => ({
    checkedStatuses: [],
    setCheckedStatuses: (statuses) => set({ checkedStatuses: statuses }),
  })
);
