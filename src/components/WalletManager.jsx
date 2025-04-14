import { useState } from "react";
import EthWallet from "./EthWallet";
import SolanaWallet from "./SolanaWallet";
import { validateMnemonic, generateMnemonic } from "bip39";
import React from "react";

const WalletManager = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [password, setPassword] = useState("");
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [error, setError] = useState("");
  const [hasStarted, setHasStarted] = useState(false);

  const createWallet = () => {
    const newMnemonic = generateMnemonic(); // 128-bit, 12 words
    if (!validateMnemonic(newMnemonic)) {
      setError("Failed to generate valid mnemonic");
      return;
    }
    setMnemonic(newMnemonic);
    setHasStarted(true);
    setError("");
  };

  const unlockWallet = () => {
    if (!password) {
      setError("Please enter a password");
      return;
    }
    setIsUnlocked(true);
    setError("");
  };

  const copyMnemonic = () => {
    navigator.clipboard.writeText(mnemonic);
    alert("Mnemonic copied to clipboard! Save it securely.");
  };

  return (
    <div className="bg-white bg-opacity-95 rounded-2xl p-8 shadow-xl max-w-2xl w-full z-10">
      <h1 className="text-2xl font-bold text-blue-600 mb-6">Crypto Wallet</h1>
      {!isUnlocked ? (
        <div>
          {!hasStarted ? (
            <button
              onClick={createWallet}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition w-full"
            >
              Create New Wallet
            </button>
          ) : (
            <>
              <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-800 font-semibold mb-2">
                  Your Mnemonic Phrase:
                </p>
                <p className="text-gray-600 break-words">{mnemonic}</p>
                <button
                  onClick={copyMnemonic}
                  className="mt-2 bg-blue-500 text-white px-4 py-1 rounded-lg hover:bg-blue-600 transition"
                >
                  Copy Mnemonic
                </button>
                <p className="text-red-500 text-sm mt-2">
                  <strong>Warning:</strong> Save this mnemonic offline. Never
                  share it. You’ll need it to recover your wallet.
                </p>
              </div>
              <input
                type="password"
                placeholder="Set a Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 mb-4 border rounded-lg"
              />
              <button
                onClick={unlockWallet}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition w-full"
              >
                Unlock Wallet
              </button>
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </>
          )}
          <p className="text-sm text-gray-600 mt-4">
            <strong>Warning:</strong> This is a demo—use testnets only.
          </p>
        </div>
      ) : (
        <>
          <EthWallet mnemonic={mnemonic} password={password} />
          <SolanaWallet mnemonic={mnemonic} password={password} />
        </>
      )}
    </div>
  );
};

export default WalletManager;
