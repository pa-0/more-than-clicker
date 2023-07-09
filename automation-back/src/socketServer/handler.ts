import robotjs from "robotjs";
import { getWindowByTitle, getWindowByPath, getCurrentWindow } from "../utils";
import { Task } from "../@types/interfaces";
import { setTimeout } from "timers/promises";
import { findImage } from "../utils/findImage";

let aspectRatio = 2.0044543429844097;

const handleTask = async (step: any) => {
  switch (step.action) {
    case "keyTap":
      robotjs.keyTap(step.actionContent);
      break;
    case "typeString":
      robotjs.typeString(step.actionContent);
      break;
    case "keyPush":
      robotjs.keyToggle(step.actionContent, "down");
      break;
    case "keyRelease":
      robotjs.keyToggle(step.actionContent, "up");
      break;
    case "delay":
      await setTimeout(Number(step.actionContent));
      break;
    case "getWindowByTitle":
      getWindowByTitle(step.actionContent)?.bringToTop();
      break;
    case "getWindowByPath":
      getWindowByPath(step.actionContent)?.bringToTop();
      break;
    case "getCurrentWindow":
      getCurrentWindow();
      break;
    case "calibrateScreen":
      const img = robotjs.screen.capture();
      console.log(`Screenshot w:${img.width} h:${img.height}`);
      robotjs.moveMouse(0, 0);
      await setTimeout(1000);
      robotjs.moveMouseSmooth(0, img.height);
      await setTimeout(2000);
      const maxPositionH = robotjs.getMousePos().y;
      console.log("MAXH", maxPositionH);
      robotjs.moveMouse(0, 0);
      await setTimeout(1000);
      robotjs.moveMouseSmooth(img.width, 0);
      await setTimeout(2000);
      const maxPositionW = robotjs.getMousePos().x;
      console.log("MAXW", maxPositionW);
      aspectRatio = img.height / maxPositionH;
      console.log("Your aspect ratio:", aspectRatio);
      console.log("maxW with aspect ratio", img.width / aspectRatio);
      break;
    case "setAcpectRatio":
      aspectRatio = Number(step.actionContent);
      break;
    case "moveToImage":
      const imagePos = await findImage(
        aspectRatio,
        `images/${step.actionContent}.png`
      );
      if (imagePos.x && imagePos.y) {
        robotjs.moveMouse(imagePos.x, imagePos.y);
        await setTimeout(500);
      } else {
        console.log("Not found image");
        return false;
      }
      break;
    case "lookForImage":
      let lookedImagePos: { x?: number; y?: number } = {};
      console.log(`Looking for ${step.actionContent}`);
      do {
        lookedImagePos = await findImage(
          aspectRatio,
          `images/${step.actionContent}.png`
        );
      } while (!lookedImagePos.x || !lookedImagePos.y);
      console.log(`Found ${step.actionContent}`);
      break;
    case "lookToMoveToImage":
      let lookImagePos: { x?: number; y?: number } = {};
      console.log(`Looking for ${step.actionContent}`);
      do {
        lookImagePos = await findImage(
          aspectRatio,
          `images/${step.actionContent}.png`
        );
      } while (!lookImagePos.x || !lookImagePos.y);
      console.log(`Found ${step.actionContent}`);
      robotjs.moveMouse(lookImagePos.x, lookImagePos.y);
      await setTimeout(500);
      break;
    case "click":
      robotjs.mouseClick(step.actionContent === "right" ? "right" : "left");
      break;
    case "doubleClick":
      robotjs.mouseClick("left", true);
      break;
    case "mouseScrollX":
      robotjs.scrollMouse(step.actionContent, 0);
      break;
    case "mouseScrollY":
      robotjs.scrollMouse(0, step.actionContent);
      break;
    default:
      console.log("unknown action");
  }
  return true;
};

export const handler = async (data: Task) => {
  for (const step of data.automationSequence) {
    const status = await handleTask(step);
    if (status === false) {
      console.log("Stopped");
      break;
    }
  }
};
