import "../styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div
      style={{
        backgroundColor: "#474747",
        minHeight: "100vh",
        color: "white",
      }}
    >
      <Component {...pageProps} />
    </div>
  );
}
export default MyApp;
