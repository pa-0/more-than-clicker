import server from "./socketServer/index";
import os from "os";
import { GLOBALS } from "./@types/enums";

server();
//@ts-ignore
let networkInterfaces = Object.values(os.networkInterfaces())
  //@ts-ignore
  .reduce((r, a) => {
    //@ts-ignore
    r = r.concat(a);
    return r;
  }, [])
  //@ts-ignore
  .filter(({ family, address }) => {
    return family.toLowerCase().indexOf("v4") >= 0 && address !== "127.0.0.1";
  })
  //@ts-ignore
  .map(({ address }) => address);
let ipAddresses = networkInterfaces.join(`:${GLOBALS.SERVER_PORT}, `);
console.log(
  `Try to reach with local device at: ${
    networkInterfaces.length == 1
      ? ipAddresses + ":" + GLOBALS.SERVER_PORT
      : ipAddresses
  }`
);
