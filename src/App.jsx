import React, { useRef } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Header from "./components/Header";
import Body from "./components/Body";
import WalletManager from "./components/WalletManager";
import TradingDashBoard from "./components/TradingDashBoard";

function App() {
  const componentTwoRef = useRef(null);

  const handleScrollToComponentTwo = () => {
    componentTwoRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <>
    
      <Header scrollToComponentTwo={handleScrollToComponentTwo} />
      <Body ref={componentTwoRef} />
      <TradingDashBoard />
    </>
  );
}

export default App;
