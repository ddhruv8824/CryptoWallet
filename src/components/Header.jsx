import React from "react";
import Iridescence from "../blocks/Backgrounds/Iridescence";
import Navbar from "./Navbar";
import TextPressure from "../blocks/Backgrounds/TextPressure";
import ScrollReveal from "../blocks/Backgrounds/ScrollReveal";
import DecryptedText from "../blocks/Backgrounds/DecryptedText";
import ShinyText from "../blocks/Backgrounds/ShinyText";
const Header = () => {
  return (
    <div className="relative w-full">
      {/* Navbar on top */}
      <Navbar />

      {/* Header with Iridescent Semicircle */}
      <header className="relative w-full h-[800px] overflow-hidden rounded-b-[100%] z-0">
        <Iridescence
          color={[1, 1, 1]}
          mouseReact={true}
          amplitude={0.1}
          speed={0.1}
          className="absolute inset-0 z-0"
        />
        <div className="relative z-10 flex flex-col justify-center items-center h-full">
          <div style={{ position: "relative", height: "300px" }}>
            <TextPressure
              text="Connect to web3"
              flex={true}
              alpha={false}
              stroke={false}
              width={true}
              weight={true}
              italic={true}
              textColor="#000000"
              strokeColor="#ff0000"
              minFontSize={150}
            />
          </div>
          <div className="w-[800px] mt-[-100px]">
            <DecryptedText
              text="Web3 gives you more tools to efficiently manage your wealth. Access DeFi and other dApps on multiple networks including Ethereum, Solana, and Arbitrum."
              animateOn="view"
              className="text-2xl "
              encryptedClassName="text-2xl"
              revealDirection="center"
              speed={100}
              maxIterations={10}
            />
          </div>

          <button className=" mt-[100px] flex items-center justify-center px-8 py-3 bg-gradient-to-r from-gray-800 to-black text-white rounded-xl w-[300px] h-[60px] shadow-lg hover:scale-105 transition-transform duration-300">
            <ShinyText
              text="Create Wallet"
              disabled={false}
              speed={3}
              className="text-2xl"
            />
          </button>
        </div>
      </header>
    </div>
  );
};

export default Header;
