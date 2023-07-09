import robot from "robotjs";

export const openCMD = () => {
  robot.keyToggle("command", "down");
  robot.typeString("r");
  robot.keyToggle("command", "up");
  robot.typeString("cmd");
  robot.keyTap("enter");
};

export const openNotepad = () => {
  robot.keyToggle("command", "down");
  robot.typeString("r");
  robot.keyToggle("command", "up");
  robot.typeString("notepad");
  robot.keyTap("enter");
};
