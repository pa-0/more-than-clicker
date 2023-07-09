export interface Task {
  _id: string;
  name: string;
  automationSequence: {
    action:
      | "keyTap"
      | "typeString"
      | "keyPush"
      | "keyRelease"
      | "delay"
      | "getWindowByTitle"
      | "getWindowByPath"
      | "getCurrentWindow";
    actionContent: string;
  }[];
}

export interface Hub {
  _id?: string;
  name: string;
  tasks?: Task[];
}
