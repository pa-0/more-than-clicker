import React from "react";
import { ACTION } from "../../@types/enums";
import { Button, TextField, Container, Card } from "@material-ui/core";
import { NextPage } from "next";
import { WS } from "utils/websocket";
import Head from "next/head";

const NewHub: NextPage = () => {
  const [socket, setSocket] = React.useState<WS>();
  const ip = `:4321`;

  React.useEffect(() => {
    if (!socket) setSocket(WS.getInstance(ip));
  }, []);

  const [name, setName] = React.useState<string>("");

  const actionTypes: { value: string; label: string }[] = [];
  Object.values(ACTION).forEach((a) =>
    actionTypes.push({ value: a, label: a })
  );

  const onUploadClick = (e: any) => {
    if (name == "") {
      console.log("Something bad");
    } else {
      socket?.emit("newHub", name);
      e.preventDefault();
      window.location.href = `/`;
    }
  };

  return (
    <div>
      <Head>
        <title>New Hub - AutomationHubs</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div
        style={{
          textAlign: "center",
        }}
      >
        <Container style={{ padding: "5px", overflowY: "auto" }}>
          <div style={{ padding: 10, cursor: "pointer" }}>
            <Card style={{ padding: "0rem", width: "Auto" }}>
              <h3>New Automation Hub:</h3>
            </Card>
          </div>
          <Card style={{ margin: "10px", padding: "10px", width: "Auto" }}>
            <TextField
              label="title"
              onChange={(e) => setName(e.target.value)}
              value={name}
              style={{ width: "100%" }}
              required
            />
          </Card>
          <Button
            color="default"
            variant="contained"
            onClick={(e: any) => {
              e.preventDefault();
              window.location.href = "/";
            }}
            style={{
              color: "white",
              margin: "10px",
              width: "10%",
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          >
            BACK
          </Button>
          <Button
            color="default"
            variant="contained"
            onClick={onUploadClick}
            style={{
              color: "white",
              margin: "10px",
              width: "30%",
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          >
            SAVE
          </Button>
        </Container>
      </div>
    </div>
  );
};

export default NewHub;
