import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
// @ts-expect-error This will be fixed when migrating the rest of the app to TS
import App from "./App.jsx";
import "./styles/main.css";

const isProd = import.meta.env.PROD;
const GOOGLE_CLIENT_ID = isProd ? import.meta.env.VITE_GOOGLE_CLIENT_ID : import.meta.env.VITE_GOOGLE_CLIENT_ID_DEV;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
