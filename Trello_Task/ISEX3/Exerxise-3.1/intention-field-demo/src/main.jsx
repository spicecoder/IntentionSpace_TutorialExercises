import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { IntentionTunnelProvider } from "./intention-tunnel";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <IntentionTunnelProvider>
      <App />
    </IntentionTunnelProvider>
  </React.StrictMode>
);
