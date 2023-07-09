import { ACTION } from "./enums";
export interface Task {
  _id?: string;
  name: string;
  automationSequence: {
    id: string;
    action: ACTION;
    actionContent: string;
  }[];
}

export interface Hub {
  _id?: string;
  name: string;
  tasks?: Task[];
}
