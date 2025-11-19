import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Builder from "./Builder.jsx";
import ChatPage from "./ChatPage.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Builder />} />
        <Route path="/chat/:slug" element={<ChatPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);