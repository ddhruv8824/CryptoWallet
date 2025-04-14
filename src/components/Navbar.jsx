import React, { useRef } from "react";
import VariableProximity from "../blocks/Backgrounds/VariableProximity";
import TrueFocus from "../blocks/Backgrounds/TrueFocus";
import ShinyText from "../blocks/Backgrounds/ShinyText";

const Navbar = () => {
  const containerRef = useRef(null);

  return (
    <nav className="absolute top-0 left-1/2 transform -translate-x-1/2 z-20 bg-white/80 backdrop-blur-md text-black px-6 py-4 shadow-md w-[1280px] rounded-b-lg mt-[30px]">
      <div className="max-w-7xl mx-auto flex items-center">
        {/* Logo */}
        <div
          ref={containerRef}
          style={{ position: "relative" }}
          className="text-xl font-bold font-display"
        >
          <VariableProximity
            label={"CryptoWallet"}
            className={"variable-proximity-demo"}
            fromFontVariationSettings="'wght' 500, 'opsz' 9"
            toFontVariationSettings="'wght' 1000, 'opsz' 40"
            containerRef={containerRef}
            radius={100}
            falloff="linear"
          />
        </div>

        {/* Buttons aligned to right */}
        <div className="ml-auto flex gap-4 items-center">
          <button className="flex items-center justify-center px-8 py-3 bg-gradient-to-r from-gray-800 to-black text-white rounded-xl w-[80px] h-[40px] shadow-lg hover:scale-105 transition-transform duration-300">
            <ShinyText text="Login" disabled={false} speed={3} />
          </button>
          <button className="flex items-center justify-center px-8 py-3 bg-blue-600 text-white rounded-xl w-[100px] h-[40px] shadow-lg hover:bg-blue-700 hover:scale-105 transition-transform duration-300">
            <ShinyText text="SignUp" disabled={false} speed={3} />
          </button>
        </div>

        {/* Mobile Hamburger (optional) */}
        <div className="md:hidden ml-4">
          <button>
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
