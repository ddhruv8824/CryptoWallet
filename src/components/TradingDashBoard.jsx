import { useState } from "react";
import { TrendingUp, TrendingDown, Search, Menu } from "lucide-react";
import React from "react";
function TradingDashBoard() {
  const [cryptoData, setCryptoData] = useState([
    {
      id: "bitcoin",
      name: "Bitcoin",
      symbol: "BTC",
      price: 84484.3,
      change24h: 0.83,
      volume24h: 148.2,
      marketCap: 61.8,
    },
    {
      id: "ethereum",
      name: "Ethereum",
      symbol: "ETH",
      price: 1611.25,
      change24h: 1.87,
      volume24h: 49.5,
      marketCap: 14.8,
    },
    {
      id: "solana",
      name: "Solana",
      symbol: "SOL",
      price: 128.36,
      change24h: 3.7,
      volume24h: 134.9,
      marketCap: 24.2,
    },
    {
      id: "bnb",
      name: "BNB",
      symbol: "BNB",
      price: 591.98,
      change24h: 0.63,
      volume24h: 3.2,
      marketCap: 2.3,
    },
  ]);

  return (
    <div className="min-h-screen bg-black w-full text-white">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">New</h2>
            <div className="space-y-4">
              {cryptoData.map((crypto) => (
                <div
                  key={crypto.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/${crypto.symbol.toLowerCase()}.png`}
                      alt={crypto.name}
                      className="w-8 h-8"
                    />
                    <span>{crypto.symbol}</span>
                  </div>
                  <div className="text-right">
                    <div>${crypto.price.toLocaleString()}</div>
                    <div
                      className={
                        crypto.change24h >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {crypto.change24h >= 0 ? "+" : ""}
                      {crypto.change24h}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Top Gainers</h2>
            <div className="space-y-4">
              {cryptoData
                .sort((a, b) => b.change24h - a.change24h)
                .map((crypto) => (
                  <div
                    key={crypto.id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3">
                      <img
                        src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/${crypto.symbol.toLowerCase()}.png`}
                        alt={crypto.name}
                        className="w-8 h-8"
                      />
                      <span>{crypto.symbol}</span>
                    </div>
                    <div className="text-right">
                      <div>${crypto.price.toLocaleString()}</div>
                      <div className="text-green-500">+{crypto.change24h}%</div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Popular</h2>
            <div className="space-y-4">
              {cryptoData.map((crypto) => (
                <div
                  key={crypto.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <img
                      src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/${crypto.symbol.toLowerCase()}.png`}
                      alt={crypto.name}
                      className="w-8 h-8"
                    />
                    <span>{crypto.symbol}</span>
                  </div>
                  <div className="text-right">
                    <div>${crypto.price.toLocaleString()}</div>
                    <div
                      className={
                        crypto.change24h >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {crypto.change24h >= 0 ? "+" : ""}
                      {crypto.change24h}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Market Table */}
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          <div className="flex space-x-4 p-4 border-b border-gray-800">
            <button className="text-white font-medium">Spot</button>
            <button className="text-gray-400 hover:text-white">Futures</button>
            <button className="text-gray-400 hover:text-white">Lending</button>
          </div>
          <table className="w-full">
            <thead>
              <tr className="text-gray-400 text-sm">
                <th className="text-left p-4">Name</th>
                <th className="text-right p-4">Price</th>
                <th className="text-right p-4">24h Volume</th>
                <th className="text-right p-4">Open Interest</th>
                <th className="text-right p-4">24h Change</th>
                <th className="text-right p-4">Last 7 Days</th>
              </tr>
            </thead>
            <tbody>
              {cryptoData.map((crypto) => (
                <tr
                  key={crypto.id}
                  className="border-t border-gray-800 hover:bg-gray-800"
                >
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={`https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/32/color/${crypto.symbol.toLowerCase()}.png`}
                        alt={crypto.name}
                        className="w-8 h-8"
                      />
                      <div>
                        <div className="font-medium">{crypto.symbol}-PERP</div>
                        <div className="text-sm text-gray-400">Perpetual</div>
                      </div>
                    </div>
                  </td>
                  <td className="text-right p-4">
                    ${crypto.price.toLocaleString()}
                  </td>
                  <td className="text-right p-4">${crypto.volume24h}M</td>
                  <td className="text-right p-4">${crypto.marketCap}M</td>
                  <td className="text-right p-4">
                    <span
                      className={
                        crypto.change24h >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    >
                      {crypto.change24h >= 0 ? "+" : ""}
                      {crypto.change24h}%
                    </span>
                  </td>
                  <td className="text-right p-4">
                    {crypto.change24h >= 0 ? (
                      <TrendingUp className="inline text-green-500" size={20} />
                    ) : (
                      <TrendingDown className="inline text-red-500" size={20} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default TradingDashBoard;
