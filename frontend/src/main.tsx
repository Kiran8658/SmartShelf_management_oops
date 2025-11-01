// src/main.tsx

// ✅ 1️⃣ Extend global Window interface for future flags
declare global {
  interface Window {
    __reactRouterFuture?: {
      v7_startTransition?: boolean;
      v7_relativeSplatPath?: boolean;
    };
  }
}

// ✅ 2️⃣ Opt-in to React Router v7 behavior BEFORE any routing imports
window.__reactRouterFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

// ✅ 3️⃣ Now import React and your app
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// ✅ 4️⃣ Render the App
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
