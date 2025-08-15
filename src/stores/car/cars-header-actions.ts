import { atom } from "jotai";

export type CarsHeaderActions = "delete-many" | null;

export const carsHeaderActionsStore = atom<CarsHeaderActions>(null);
