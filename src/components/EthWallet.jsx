import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { mnemonicToSeed } from "bip39";
import { HDNodeWallet } from "ethers";
import React from "react";

const EthWallet = ({ mnemonic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState([]);
  const [balances, setBalances] = useState({});
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState([]);

  const provider = new ethers.JsonRpcProvider(
    "https://sepolia.infura.io/v3/your-infura-key"
  );

  const addWallet = async () => {
    try {
      const seed = await mnemonicToSeed(mnemonic);
      const derivationPath = `m/44'/60'/${currentIndex}'/0'`;
      const hdNode = HDNodeWallet.fromSeed(seed);
      const child = hdNode.derivePath(derivationPath);
      const wallet = new ethers.Wallet(child.privateKey);
      setWallets([
        ...wallets,
        { address: wallet.address, privateKey: child.privateKey },
      ]);
      setCurrentIndex(currentIndex + 1);

      const balanceWei = await provider.getBalance(wallet.address);
      setBalances((prev) => ({
        ...prev,
        [wallet.address]: ethers.formatEther(balanceWei),
      }));
    } catch (err) {
      setError("Error adding wallet: " + err.message);
    }
  };

  const sendEth = async (address, privateKey) => {
    if (!recipient || !amount) {
      setError("Please fill all fields");
      return;
    }
    try {
      const wallet = new ethers.Wallet(privateKey, provider);
      const tx = {
        to: recipient,
        value: ethers.parseEther(amount),
      };
      const txResponse = await wallet.sendTransaction(tx);
      setTransactions((prev) => [
        ...prev,
        { hash: txResponse.hash, from: address, to: recipient, amount },
      ]);
      await txResponse.wait();
      setError("");
      setRecipient("");
      setAmount("");

      const balanceWei = await provider.getBalance(address);
      setBalances((prev) => ({
        ...prev,
        [address]: ethers.formatEther(balanceWei),
      }));
    } catch (err) {
      setError("Error sending ETH: " + err.message);
    }
  };

  useEffect(() => {
    const fetchBalances = async () => {
      const newBalances = {};
      for (const wallet of wallets) {
        const balanceWei = await provider.getBalance(wallet.address);
        newBalances[wallet.address] = ethers.formatEther(balanceWei);
      }
      setBalances(newBalances);
    };
    if (wallets.length > 0) fetchBalances();
  }, [wallets]);

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-blue-600 mb-4">
        Ethereum Wallets
      </h2>
      <button
        onClick={addWallet}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition mb-4"
      >
        Add ETH Wallet
      </button>
      {wallets.map((wallet, i) => (
        <div key={i} className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-800 break-all">
            <strong>Address:</strong> {wallet.address}
          </p>
          <p className="text-lg font-semibold text-gray-800">
            Balance: {balances[wallet.address] || "0"} ETH
          </p>
          <div className="mt-2">
            <input
              type="text"
              placeholder="Recipient Address"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="w-full p-2 mb-2 border rounded-lg"
            />
            <input
              type="text"
              placeholder="Amount (ETH)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 mb-2 border rounded-lg"
            />
            <button
              onClick={() => sendEth(wallet.address, wallet.privateKey)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Send ETH
            </button>
          </div>
        </div>
      ))}
      {transactions.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg text-gray-600">Recent Transactions</h3>
          {transactions.map((tx, i) => (
            <div key={i} className="bg-gray-50 p-2 rounded-lg mb-2">
              <p className="text-sm">Hash: {tx.hash}</p>
              <p className="text-sm">To: {tx.to}</p>
              <p className="text-sm">Amount: {tx.amount} ETH</p>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default EthWallet;
