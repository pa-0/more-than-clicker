export enum GLOBALS {
  HOST = "http://localhost",
  SERVER_PORT = 4321,
  API_HOST = "https://automation.me365.xyz",
}

export enum ACTION {
  DELAY = "delay",
  KEY_TAP = "keyTap",
  TYPE_STRING = "typeString",
  KEY_PUSH = "keyPush",
  KEY_RELEASE = "keyRelease",
  GET_WINDOW_BY_TITLE = "getWindowByTitle",
  GET_WINDOW_BY_PATH = "getWindowByPath",
  MOVE_TO_IMAGE = "moveToImage",
  LOOK_FOR_IMAGE = "lookForImage",
  LOOK_TO_MOVE_TO = "lookToMoveToImage",
  CLICK = "click",
  DOUBLE_CLICK = "doubleClick",
  MOUSE_SCROLL_X = "mouseScrollX",
  MOUSE_SCROLL_Y = "mouseScrollY",
  CALIBRATE_SCREEN = "calibrateScreen",
  SET_ASPECT_RATIO = "setAcpectRatio",
  GET_CURRENT_WINDOW = "getCurrentWindow",
}
