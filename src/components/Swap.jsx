import React, { useState } from "react";
import { ArrowDownCircle, ChevronDown } from "lucide-react";

function Swap() {
  const [sellAmount, setSellAmount] = useState("0");
  const [buyAmount, setBuyAmount] = useState("0");

  return (
    <div className=" bg-black text-white relative overflow-hidden">
      {/* Main content */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-bold mb-2">Swap anytime,anywhere</h1>

      </div>
      {/* Swap form */}
      <div className="w-full max-w-md bg-gray-900 rounded-3xl p-4 backdrop-blur-lg">
        {/* Sell section */}
        <div className="mb-2">
          <div className="text-gray-400 text-sm mb-2">Sell</div>
          <div className="bg-gray-800 rounded-2xl p-4 flex items-center">
            <input
              type="number"
              value={sellAmount}
              onChange={(e) => setSellAmount(e.target.value)}
              className="bg-transparent text-2xl w-full focus:outline-none"
              placeholder="0"
            />
            <button className="flex items-center bg-gray-700 rounded-xl px-3 py-2 ml-2">
              <img
                src="https://images.unsplash.com/photo-1622630998477-20aa696ecb05?w=32&h=32&fit=crop&crop=faces&q=80"
                alt="ETH"
                className="w-6 h-6 rounded-full mr-2"
              />
              <span>ETH</span>
              <ChevronDown className="ml-2" size={20} />
            </button>
          </div>
          <div className="text-right text-gray-500 text-sm mt-1">$0.00</div>
        </div>

        {/* Swap direction button */}
        <div className="flex justify-center -my-2 relative z-10">
          <button className="bg-gray-800 p-2 rounded-xl">
            <ArrowDownCircle size={24} />
          </button>
        </div>

        {/* Buy section */}
        <div className="mt-2">
          <div className="text-gray-400 text-sm mb-2">Buy</div>
          <div className="bg-gray-800 rounded-2xl p-4 flex items-center">
            <input
              type="number"
              value={buyAmount}
              onChange={(e) => setBuyAmount(e.target.value)}
              className="bg-transparent text-2xl w-full focus:outline-none"
              placeholder="0"
            />
            <button className="flex items-center bg-gray-700 rounded-xl px-3 py-2 ml-2">
              <span>Select token</span>
              <ChevronDown className="ml-2" size={20} />
            </button>
          </div>
          <div className="text-right text-gray-500 text-sm mt-1">$0.00</div>
        </div>

        {/* Action button */}
        <button className="w-full bg-pink-600 hover:bg-pink-700 text-white rounded-xl py-4 mt-4 font-medium transition-colors">
          Get started
        </button>
      </div>

      {/* Footer text */}
      <p className="text-gray-400 text-center mt-8 max-w-md">
        The largest onchain marketplace. Buy and sell crypto on Ethereum and 11+
        other chains.
      </p>
    </div>
  );
}

export default Swap;
