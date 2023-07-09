import type { NextPage } from "next";
import React from "react";
import { WS } from "utils/websocket";

import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import Grid from "@material-ui/core/Grid";

import { MediaCard } from "../atoms/MediaCard";

import { Hub } from "../../@types/interfaces";
import Head from "next/head";

const Home: NextPage = () => {
  const [socket, setSocket] = React.useState<WS>();
  const [hubs, setHubs] = React.useState<Hub[]>();
  const [remove, setRemove] = React.useState<boolean>(false);
  const ip = `:4321`;

  React.useEffect(() => {
    if (!socket) setSocket(WS.getInstance(ip));
  }, []);

  React.useEffect(() => {
    socket?.emit("getMyHubs", "");
    socket?.on("myHubs", (data: any) => {
      let temp = data.map((hub: Hub, key: number) => (
        <Grid item key={key}>
          <MediaCard
            style={{ border: remove ? "1px solid red" : "none" }}
            id={hub._id}
            title=""
            description={hub.name}
            onClick={(e: any) => {
              remove && socket?.emit("removeHub", hub.name);
              remove && socket?.emit("getMyHubs", "");
              !remove && e.preventDefault();
              !remove && (window.location.href = `/hub?name=${hub.name}`);
            }}
          />
        </Grid>
      ));
      setHubs(temp);
    });
  }, [socket, remove]);

  return (
    <div>
      <Head>
        <title>AutomationHubs</title>
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
              <h3>Automation Hubs:</h3>
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
            {hubs}
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
            <Grid
              item
              key="add"
              onClick={(e: any) => {
                e.preventDefault();
                window.location.href = "/newHub";
              }}
            >
              <MediaCard id={"add"} title="Add new Hub ✨" />
            </Grid>
            <Grid
              item
              key="editAll"
              onClick={(e: any) => {
                e.preventDefault();
                window.location.href = "/edit";
              }}
            >
              <MediaCard id={"editAll"} title="Edit Hubs Json 🔍" />
            </Grid>
          </Grid>
        </Container>
      </div>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          textAlign: "center",
          padding: 5,
        }}
      >
        <a href="https://morethanclicker.com/">
          morethanclicker: docs and more
        </a>
      </div>
    </div>
  );
};

export default Home;
