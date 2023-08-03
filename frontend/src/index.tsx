import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AuthorizeUser from "./AuthorizeUser";
import NotFound from "./NotFound";
import Dashboard from "./Dashboard";
import SignIn from "./SignIn";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" Component={AuthorizeUser} />
      <Route path="/dashboard" Component={Dashboard} />
      <Route path="/signin" Component={SignIn} />
      <Route Component={NotFound} />
    </Routes>
  </BrowserRouter>
);
