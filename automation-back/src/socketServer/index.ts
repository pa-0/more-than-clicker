import express from "express";
import cors from "cors";
import * as path from "path";
import { handler } from "./handler";
import { GLOBALS } from "../@types/enums";
import { Task, Hub } from "../@types/interfaces";
import { promises as fs } from "fs";

export default () => {
  const app = express();
  app.use(cors());

  const localHubsFile = path.resolve("./hubs.json");

  const writeToFile = async (fileName: string, data: any) => {
    let json = JSON.stringify(data);
    fs.writeFile(fileName, json);
  };

  const readFromFile = (fileName: string) => {
    return new Promise((resolve, reject) => {
      fs.readFile(fileName)
        .then((data) => {
          let json = JSON.parse(data.toString());
          resolve(json);
        })
        .catch((err) => {});
    });
  };

  let myHubsStorage: Hub[] = [
    {
      name: "Main",
      tasks: [],
    },
  ];

  const prepare = async () => {
    try {
      const data = (await readFromFile(localHubsFile)) as Hub[];
      if (data.length > 0) {
        myHubsStorage = data;
      }
    } catch (e) {}
    await writeToFile(localHubsFile, myHubsStorage);
    let hubs = await readFromFile(localHubsFile);
    myHubsStorage = hubs as Hub[];
  };

  prepare();

  let http = require("http").Server(app);
  let io = require("socket.io")(http, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  console.log(
    "Ensure website (out) directory is available regarding path:",
    path.resolve("./out")
  );

  app.use(express.static(path.resolve("./out")));

  app.get("/new", (req, res) => {
    res.sendFile(path.resolve("./out/new.html"));
  });
  app.get("/all", (req, res) => {
    res.sendFile(path.resolve("./out/all.html"));
  });
  app.get("/hub", (req, res) => {
    res.sendFile(path.resolve("./out/hub.html"));
  });
  app.get("/newHub", (req, res) => {
    res.sendFile(path.resolve("./out/newHub.html"));
  });
  app.get("/edit", (req, res) => {
    res.sendFile(path.resolve("./out/edit.html"));
  });

  // SOCKETS
  io.on("connection", function (socket: any) {
    const https = require("https");
    const url = `${GLOBALS.API_HOST}/tasks/`;
    https
      .get(url, (res: any) => {
        let data = "";
        res.on("data", (chunk: any) => {
          data += chunk;
        });
        res.on("end", () => {
          if (data !== "") {
            const finalData = JSON.parse(data);
            io.emit("tasks", finalData);
          }
        });
      })
      .on("error", (err: { message: any }) => {
        console.log(err.message);
      });

    // EDIT HUBS JSON
    socket.on("getAllHubs", (id: string) => {
      socket.emit("allHubs", myHubsStorage);
    });
    socket.on("setAllHubs", (json: string) => {
      myHubsStorage = JSON.parse(json);
      writeToFile(localHubsFile, myHubsStorage);
      socket.emit("setAllHubsDone", true);
    });

    // NEW HUB
    socket.on("newHub", (id: string) => {
      myHubsStorage.push({ _id: id, name: id, tasks: [] });
      writeToFile(localHubsFile, myHubsStorage);
    });

    // REMOVE HUB
    socket.on("removeHub", (id: string) => {
      const temphub: Hub[] = [];
      myHubsStorage.forEach((item) => {
        item.name != id && temphub.push(item);
      });
      myHubsStorage = temphub;
      writeToFile(localHubsFile, myHubsStorage);
    });

    // GET HUB TASKS
    socket.on("getHubTasks", (id: string) => {
      const tasks = myHubsStorage.filter((item) => item.name == id)[0].tasks;
      socket.emit("hubTasks", tasks);
    });

    // GET HUBS
    socket.on("getMyHubs", (id: string) => {
      socket.emit("myHubs", myHubsStorage);
    });

    // ADD TASK TO HUB
    socket.on("add", ({ hub, cmd }: { hub: string; cmd: string }) => {
      const https = require("https");
      const url = `${GLOBALS.API_HOST}/tasks/${cmd}`;
      https
        .get(url, (res: any) => {
          let data = "";
          res.on("data", (chunk: any) => {
            data += chunk;
          });
          res.on("end", () => {
            const finalData = JSON.parse(data);
            const hubTasks =
              myHubsStorage.filter((item) => item.name == hub)[0].tasks || [];
            hubTasks.push(finalData);
            console.log(hubTasks);
            writeToFile(localHubsFile, myHubsStorage);
          });
        })
        .on("error", (err: { message: any }) => {
          console.log(err.message);
        });
    });

    // CREATE NEW TASK
    socket.on("newTask", ({ hub, task }: { hub: string; task: string }) => {
      console.log("HUB", hub);
      const finalData = JSON.parse(task);
      const hubTasks =
        myHubsStorage.filter((item) => item.name == hub)[0].tasks || [];
      hubTasks.push(finalData);
      console.log(hubTasks);
      writeToFile(localHubsFile, myHubsStorage);
    });

    // REMOVE TASK FROM HUB
    socket.on("removeFromHub", ({ hub, cmd }: { hub: string; cmd: string }) => {
      console.log("Hub", hub);
      const currenthub =
        myHubsStorage.filter((item) => item.name == hub)[0] || {};
      currenthub.tasks =
        currenthub.tasks && currenthub.tasks.filter((e) => e.name != cmd);
      console.log("tasksAfter", currenthub);
      writeToFile(localHubsFile, myHubsStorage);
    });

    // TRY TASK
    socket.on("seq", ({ automationSequence }: { automationSequence: any }) => {
      const temp: Task = {
        _id: "temp",
        name: "temp",
        automationSequence,
      };
      handler(temp);
    });

    // RUN COMMAND
    socket.on("cmd", ({ hub, cmd }: { hub: string; cmd: string }) => {
      const currenthub =
        myHubsStorage.filter((item) => item.name == hub)[0] || {};
      const mytask =
        currenthub.tasks && currenthub.tasks.filter((e) => e.name == cmd)[0];
      mytask && handler(mytask);
    });
  });

  http.listen(GLOBALS.SERVER_PORT, function () {
    console.log(
      `listening on ${GLOBALS.SERVER_PORT}, try: ${GLOBALS.HOST}:${GLOBALS.SERVER_PORT}`
    );
  });
};
