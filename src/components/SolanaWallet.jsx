import { useState, useEffect } from "react";
import { mnemonicToSeed } from "bip39";
import { derivePath } from "ed25519-hd-key";
import React from "react";
import {
  Keypair,
  Connection,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  PublicKey,
} from "@solana/web3.js";
import nacl from "tweetnacl";

const SolanaWallet = ({ mnemonic }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wallets, setWallets] = useState([]);
  const [balances, setBalances] = useState({});
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");
  const [transactions, setTransactions] = useState([]);

  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  const addWallet = async () => {
    try {
      const seed = await mnemonicToSeed(mnemonic);
      const path = `m/44'/501'/${currentIndex}'/0'`;
      const derivedSeed = derivePath(path, seed.toString("hex")).key;
      const secret = nacl.sign.keyPair.fromSeed(derivedSeed).secretKey;
      const keypair = Keypair.fromSecretKey(secret);
      setWallets([
        ...wallets,
        { publicKey: keypair.publicKey, secretKey: secret },
      ]);
      setCurrentIndex(currentIndex + 1);

      const balance = await connection.getBalance(keypair.publicKey);
      setBalances((prev) => ({
        ...prev,
        [keypair.publicKey.toBase58()]: balance / 1e9,
      }));
    } catch (err) {
      setError("Error adding wallet: " + err.message);
    }
  };

  const sendSol = async (publicKey, secretKey) => {
    if (!recipient || !amount) {
      setError("Please fill all fields");
      return;
    }
    try {
      const keypair = Keypair.fromSecretKey(secretKey);
      const toPublicKey = new PublicKey(recipient);
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: keypair.publicKey,
          toPubkey: toPublicKey,
          lamports: amount * 1e9,
        })
      );
      const signature = await sendAndConfirmTransaction(
        connection,
        transaction,
        [keypair]
      );
      setTransactions((prev) => [
        ...prev,
        {
          signature,
          from: keypair.publicKey.toBase58(),
          to: recipient,
          amount,
        },
      ]);
      setError("");
      setRecipient("");
      setAmount("");

      const balance = await connection.getBalance(keypair.publicKey);
      setBalances((prev) => ({
        ...prev,
        [keypair.publicKey.toBase58()]: balance / 1e9,
      }));
    } catch (err) {
      setError("Error sending SOL: " + err.message);
    }
  };

  useEffect(() => {
    const fetchBalances = async () => {
      const newBalances = {};
      for (const wallet of wallets) {
        const balance = await connection.getBalance(wallet.publicKey);
        newBalances[wallet.publicKey.toBase58()] = balance / 1e9;
      }
      setBalances(newBalances);
    };
    if (wallets.length > 0) fetchBalances();
  }, [wallets]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-blue-600 mb-4">
        Solana Wallets
      </h2>
      <button
        onClick={addWallet}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition mb-4"
      >
        Add SOL Wallet
      </button>
      {wallets.map((wallet, i) => (
        <div key={i} className="bg-gray-50 p-4 rounded-lg mb-4">
          <p className="text-sm text-gray-800 break-all">
            <strong>Address:</strong> {wallet.publicKey.toBase58()}
          </p>
          <p className="text-lg font-semibold text-gray-800">
            Balance: {balances[wallet.publicKey.toBase58()] || "0"} SOL
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
              placeholder="Amount (SOL)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 mb-2 border rounded-lg"
            />
            <button
              onClick={() => sendSol(wallet.publicKey, wallet.secretKey)}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Send SOL
            </button>
          </div>
        </div>
      ))}
      {transactions.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg text-gray-600">Recent Transactions</h3>
          {transactions.map((tx, i) => (
            <div key={i} className="bg-gray-50 p-2 rounded-lg mb-2">
              <p className="text-sm">Signature: {tx.signature}</p>
              <p className="text-sm">To: {tx.to}</p>
              <p className="text-sm">Amount: {tx.amount} SOL</p>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default SolanaWallet;
