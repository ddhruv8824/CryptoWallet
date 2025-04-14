import { useState } from "react";
import React from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Body from "./components/Body";
import WalletManager from "./components/WalletManager";
import TradingDashBoard from "./components/TradingDashBoard";

function App() {
  return (
    <>
      <Header />
      <Body />
      <TradingDashBoard />
    </>
  );
}

export default App;
