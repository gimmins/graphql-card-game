import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WaitRoom } from "./waitroom";
import { GameRoom } from "./gameroom";

export default function Pages() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<WaitRoom />} path="/" />
        <Route element={<GameRoom />} path="/gameroom" />
      </Routes>
    </BrowserRouter>
  );
}
