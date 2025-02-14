/* eslint-disable no-unused-vars */
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import AppHandler from "./context/AppContext";
import QueueStatus from "./components/QueueStatus";
import IndividualStatus from "./components/IndividualStatus";

function App() {
  return (
    <>
      <AppHandler>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />}>
              {" "}
            </Route>
            <Route path="/:collections" element={<QueueStatus />}></Route>
            <Route
              path="/:collections/:status"
              element={<IndividualStatus />}
            ></Route>
          </Routes>
        </BrowserRouter>
      </AppHandler>
    </>
  );
}

export default App;
