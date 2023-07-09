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

const Home: NextPage = () => {
  const router = useRouter();
  const { hub } = router.query;
  const [socket, setSocket] = React.useState<WS>();
  const [tasks, setTasks] = React.useState<Task[]>();
  const [taskPreview, setTaskPreview] = React.useState<Task>();
  const ip = `:4321`;

  React.useEffect(() => {
    if (!socket) setSocket(WS.getInstance(ip));
  }, []);

  React.useEffect(() => {
    socket?.on("tasks", (data: any) => {
      let temp = data.map((task: Task, key: number) => (
        <Grid item key={key}>
          <MediaCard
            id={task._id}
            title={task.name}
            description=""
            onClick={(e: any) => {
              setTaskPreview(task);
            }}
          />
        </Grid>
      ));
      setTasks(temp);
    });
  }, [socket, hub]);

  return (
    <div>
      <Head>
        <title>Available tasks - AutomationHubs</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div
        style={{
          textAlign: "center",
          overflow: "hidden",
        }}
      >
        <div>
          {taskPreview && (
            <div
              style={{
                width: "100%",
                height: "100%",
                textAlign: "center",
                position: "fixed",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                top: 0,
                color: "white",
                padding: "10px",
                backgroundColor: "rgba(0, 0, 0, 0.8)",
              }}
            >
              <p
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  padding: "15px",
                  borderRadius: "10px",
                }}
              >
                Steps: <br />
                {taskPreview.automationSequence.map((action: any, key) => {
                  return (
                    <p key={key}>
                      [{action.action}] {action.actionContent}
                    </p>
                  );
                })}
              </p>
              <button
                style={{
                  position: "absolute",
                  bottom: 10,
                  left: 10,
                  width: "40%",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  color: "white",
                  borderRadius: "5px",
                }}
                onClick={(e) => {
                  setTaskPreview(undefined);
                }}
              >
                Close ❌
              </button>
              <button
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  width: "40%",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  color: "white",
                  borderRadius: "5px",
                }}
                onClick={(e) => {
                  socket?.emit("add", { hub: hub, cmd: taskPreview?.name });
                  e.preventDefault();
                  window.location.href = `/hub?name=${hub}`;
                }}
              >
                Add ✅
              </button>
            </div>
          )}
        </div>

        <Container style={{ padding: "5px" }}>
          <div style={{ padding: 10, cursor: "pointer" }}>
            <Card style={{ padding: "0rem", width: "Auto" }}>
              <h3>Automation Hub Available Tasks:</h3>
            </Card>
          </div>
          <Grid
            container
            item
            xs={12}
            spacing={1}
            justifyContent="center"
            alignItems="center"
            style={{
              overflowY: "scroll",
              overflowX: "hidden",
              paddingLeft: "1.6rem",
              maxHeight: "calc(90vh - 10px)",
              width: "110vw",
            }}
          >
            <Grid item>
              <MediaCard
                key="myHub"
                onClick={(e: any) => {
                  e.preventDefault();
                  window.location.href = `/hub?name=${hub}`;
                }}
                id={"myHub"}
                title="Back To Hub 👈"
              />
            </Grid>
            <Grid item>
              <MediaCard
                key="new"
                onClick={(e: any) => {
                  e.preventDefault();
                  window.location.href = `/new?hub=${hub}`;
                }}
                id={"new"}
                title="Create New Task ✨"
              />
            </Grid>
            {tasks}
          </Grid>
        </Container>
      </div>
    </div>
  );
};

export default Home;
