import type { NextPage } from "next";
import React from "react";
import JSONInput from "react-json-editor-ajrm";
import { WS } from "utils/websocket";
//@ts-ignore
import locale from "react-json-editor-ajrm/locale/en";

const Edit: NextPage = () => {
  const [updatedTime, setUpdatedTime] = React.useState<string>();
  const [json, setJson] = React.useState<{}>();
  const [updatedJson, setUpdatedJson] = React.useState<{}>();
  const [error, setError] = React.useState<boolean>(true);
  const [socket, setSocket] = React.useState<WS>();
  const ip = `:4321`;

  React.useEffect(() => {
    if (!socket) setSocket(WS.getInstance(ip));
  }, []);

  React.useEffect(() => {
    if (socket) {
      socket.emit("getAllHubs", {});
      socket?.on("allHubs", (myHubsStorage: any) => {
        setJson(myHubsStorage);
      });
      socket.on("setAllHubsDone", (json: string) => {
        const now = new Date();
        setUpdatedTime(
          `Updated: ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`
        );
      });
      return () => {
        socket.off("allHubs");
        socket.off("setAllHubsDone");
      };
    }
  }, [socket]);

  const updateJson = async (newJson: string) => {
    console.log(newJson.toString());
    socket?.emit("setAllHubs", newJson);
  };

  return (
    <>
      <JSONInput
        id=""
        placeholder={json || {}}
        theme="background_warning"
        locale={locale}
        height="90vh"
        width="100%"
        onChange={(content: { json: string; error: boolean }) => {
          !content.error && setUpdatedJson(content.json.toString());
          setError(content.error);
        }}
      />
      <div
        style={{
          textAlign: "center",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          width: "100vw",
          height: "10vh",
        }}
      >
        <div>
          <button
            disabled={error}
            style={{ width: "30vw" }}
            onClick={(e: any) => {
              updateJson(updatedJson.toString());
            }}
          >
            {updatedTime ? updatedTime : "Save"}
          </button>
          <button
            style={{ width: "30vw" }}
            onClick={(e: any) => {
              e.preventDefault();
              window.location.href = "/";
            }}
          >
            Back
          </button>
        </div>
      </div>
    </>
  );
};

export default Edit;
