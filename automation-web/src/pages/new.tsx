import React, { useState } from "react";
import { ACTION, GLOBALS } from "../../@types/enums";
import { Task } from "../../@types/interfaces";
import {
  Button,
  TextField,
  Container,
  Card,
  MenuItem,
} from "@material-ui/core";
import { NextPage } from "next";
import { WS } from "utils/websocket";
import { useRouter } from "next/router";
import Head from "next/head";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const New: NextPage = () => {
  const router = useRouter();
  const { hub } = router.query;
  const [socket, setSocket] = React.useState<WS>();
  const ip = `:4321`;

  React.useEffect(() => {
    if (!socket) setSocket(WS.getInstance(ip));
  }, []);

  const [name, setName] = React.useState<string>("");
  const [actionType, setActionType] = React.useState<any>();
  const [actionContent, setActionContent] = React.useState<string>("");
  const actionTypes: { value: string; label: string }[] = [];
  const [state, setState] = useState<{ actions: Task["automationSequence"] }>({
    actions: [],
  });
  Object.values(ACTION).map((a) => actionTypes.push({ value: a, label: a }));

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const actions: any[] = reorder(
      state.actions,
      result.source.index,
      result.destination.index
    );

    setState({ actions });
  }

  const onUploadClick = () => {
    if (name == "") {
      console.log("Something bad");
    } else {
      if (confirm("This will be uploaded and visible for all. Are you sure?")) {
        let raw = JSON.stringify({
          _id: Math.random().toString(36).substr(2, 9),
          name: name,
          automationSequence: state.actions,
        });
        socket?.emit("newTask", { hub: hub, task: raw });
        let rawToFetch = JSON.stringify({
          name: name,
          automationSequence: state.actions,
        });
        fetch(`${GLOBALS.API_HOST}/tasks`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: rawToFetch,
        }).then((res) => {
          console.log(res.json());
          window.location.href = `/hub?name=${hub}`;
        });
      }
    }
  };

  const onAddClick = () => {
    if (name == "") {
      console.log("Something bad");
    } else {
      let raw = JSON.stringify({
        _id: Math.random().toString(36).substr(2, 9),
        name: name,
        automationSequence: state.actions,
      });
      socket?.emit("newTask", { hub: hub, task: raw });
    }
  };

  const onAddActionClick = () => {
    setState({
      actions: [
        ...state.actions,
        {
          id: Math.random().toString(36).substr(2, 9),
          action: actionType,
          actionContent,
        },
      ],
    });
  };

  const trySequence = () => {
    socket?.emit("seq", { automationSequence: state.actions });
  };

  function Action({ action, index }) {
    return (
      <Draggable draggableId={action.id} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {action.action}: {action.actionContent}
            <span
              style={{ paddingLeft: 10 }}
              onClick={() => {
                const newState = state.actions;
                newState.splice(index, 1);
                console.log(newState);
                setState({ actions: newState });
              }}
            >
              ❌
            </span>
          </div>
        )}
      </Draggable>
    );
  }

  const ActionList = React.memo(function ActionList({ actions }: any) {
    return actions.map((action: any, index: number) => (
      <div key={action.id} id={action.id} style={{ paddingBottom: 10 }}>
        <Action action={action} index={index} key={action.id} />
      </div>
    ));
  });

  return (
    <div>
      <Head>
        <title>New Task - AutomationHubs</title>
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
              <h3>New Automation Task:</h3>
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
          <Card style={{ margin: "10px", padding: "10px", width: "Auto" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
              }}
            >
              <TextField
                select
                label="Action"
                value={actionType}
                onChange={(e) => {
                  setActionType(e.target.value);
                  setActionContent("");
                }}
                style={{ width: "50%" }}
              >
                {actionTypes.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Action Content"
                onChange={(e) =>
                  setActionContent(
                    actionType == "keyTap" ||
                      actionType == "keyPush" ||
                      actionType == "keyRelease"
                      ? e.target.value.toLowerCase()
                      : actionType == "delay"
                      ? e.target.value.replace(/\D/g, "")
                      : e.target.value
                  )
                }
                value={actionContent}
                style={{ width: "100%" }}
                required
              />
              <Button
                color="default"
                variant="contained"
                style={{
                  color: "white",
                  margin: "10px",
                  backgroundColor: "rgba(0,0,0,0.3)",
                }}
                onClick={onAddActionClick}
              >
                ADD
              </Button>
            </div>
          </Card>
          <Card style={{ margin: "10px", padding: "0rem", width: "Auto" }}>
            <h3>Sequence:</h3>
            {
              <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="list">
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                      <ActionList actions={state.actions} />
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            }
          </Card>
          <Button
            color="default"
            variant="contained"
            onClick={(e: any) => {
              e.preventDefault();
              window.history.back();
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
            onClick={() => trySequence()}
            style={{
              color: "white",
              margin: "10px",
              width: "30%",
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          >
            TRY
          </Button>
          <Button
            color="default"
            variant="contained"
            onClick={onUploadClick}
            style={{
              color: "white",
              margin: "10px",
              width: "40%",
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          >
            UPLOAD & ADD
          </Button>
          <Button
            color="default"
            variant="contained"
            onClick={(e) => {
              onAddClick();
              e.preventDefault();
              window.location.href = `/hub?name=${hub}`;
            }}
            style={{
              color: "white",
              margin: "10px",
              width: "40%",
              backgroundColor: "rgba(0,0,0,0.3)",
            }}
          >
            ADD TO HUB
          </Button>
        </Container>
      </div>
    </div>
  );
};

export default New;
