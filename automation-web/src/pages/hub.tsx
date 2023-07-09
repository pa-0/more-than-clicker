import type { NextPage } from "next";
import React from "react";
import { WS } from "utils/websocket";

import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";

import { MediaCard } from "../atoms/MediaCard";

import { Task } from "../../@types/interfaces";
import { useRouter } from "next/router";
import Head from "next/head";

const Hub: NextPage = () => {
  const router = useRouter();
  const { name } = router.query;
  const [socket, setSocket] = React.useState<WS>();
  const [tasks, setTasks] = React.useState<Task[]>();
  const [remove, setRemove] = React.useState<boolean>(false);
  const ip = `:4321`;

  React.useEffect(() => {
    if (!socket) setSocket(WS.getInstance(ip));
  }, []);

  React.useEffect(() => {
    name && socket?.emit("getHubTasks", name);
    socket?.on("hubTasks", (data: any) => {
      let temp = data.map((task: Task, key: number) => (
        <Grid item key={key}>
          <MediaCard
            style={{ border: remove ? "1px solid red" : "none" }}
            id={task._id}
            title=""
            description={task.name}
            onClick={() => {
              remove &&
                socket?.emit("removeFromHub", { hub: name, cmd: task.name });
              remove && socket?.emit("getHubTasks", name);
              !remove && socket?.emit("cmd", { hub: name, cmd: task.name });
            }}
          />
        </Grid>
      ));
      setTasks(temp);
    });
  }, [socket, remove, name]);

  return (
    <div>
      <Head>
        <title>{name} Hub - AutomationHubs</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div
        style={{
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <Container style={{ padding: "5px" }}>
          <div style={{ padding: 10, cursor: "pointer" }}>
            <Card style={{ padding: "0rem", width: "Auto" }}>
              <h3>{name} Hub:</h3>
            </Card>
          </div>
          <Grid
            container
            item
            xs={12}
            spacing={1}
            justifyContent="center"
            alignItems="stretch"
            style={{
              overflowY: "scroll",
              overflowX: "hidden",
              paddingLeft: "1.6rem",
              maxHeight: "calc(90vh - 10px)",
              width: "110vw",
            }}
          >
            <Grid
              item
              key="hubs"
              onClick={(e: any) => {
                e.preventDefault();
                window.location.href = `/`;
              }}
            >
              <MediaCard id={"hubs"} title="Back to Hubs 👈" />
            </Grid>
            <Grid
              item
              key="add"
              onClick={(e: any) => {
                e.preventDefault();
                window.location.href = `/all?hub=${name}`;
              }}
            >
              <MediaCard id={"add"} title="Add Task ✨" />
            </Grid>
            {tasks}
            <Grid
              item
              key="remove"
              onClick={(e: any) => {
                setRemove(!remove);
              }}
            >
              <MediaCard
                id={"remove"}
                title={`Removal mode is ${remove ? "ON" : "OFF"}`}
              />
            </Grid>
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default Hub;
