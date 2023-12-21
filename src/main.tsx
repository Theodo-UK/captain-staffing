import React from "react";
import ReactDOM from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
//@ts-ignore
import App from "./App.jsx";
import "./styles/index.css";

import "./styles/component/alert.css";
import "./styles/component/app.css";
import "./styles/component/projects.css";
import "./styles/component/staffingTable.css";

import "./styles/generic/btn.css";
import "./styles/generic/loader.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
