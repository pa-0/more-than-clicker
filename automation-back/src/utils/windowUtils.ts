import { windowManager } from "node-window-manager";
import robot from "robotjs";
import { setTimeout } from "timers/promises";

export const getWindowByTitle = (title: string) => {
  let windows = windowManager.getWindows();
  let window = windows.find((w) =>
    w.getTitle().toLowerCase().includes(title.toLowerCase())
  );
  return window;
};

export const getWindowByPath = (path: string) => {
  let windows = windowManager.getWindows();
  let window = windows.find((w) =>
    w.path.toLowerCase().includes(path.toLowerCase())
  );
  return window;
};

export const getCurrentWindow = () => {
  const window = windowManager.getActiveWindow();
  console.log(window);
};

export const windowToFront = async (window: any) => {
  window.maximize();
  await setTimeout(1000);
  window.bringToTop();
};

export const openPowerShell = async () => {
  robot.keyToggle("command", "down");
  robot.typeString("r");
  robot.keyToggle("command", "up");
  robot.typeString("cmd");
  robot.keyTap("enter");
  await setTimeout(1000);
  robot.typeString("powershell.exe -ExecutionPolicy bypass");
  robot.keyTap("enter");
};
