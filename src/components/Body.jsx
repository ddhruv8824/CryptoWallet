import React, { useState, useEffect, forwardRef, useRef } from "react";
import MetallicPaint, {
  parseLogoImage,
} from "../blocks/Backgrounds/MetallicPaint";
import logoETH from "../assets/images/eth-alt-svgrepo-com.svg";
import logoSOL from "../assets/images/sol-svgrepo-com.svg";
import ShinyText from "../blocks/Backgrounds/ShinyText";
import StarBorder from "../blocks/Backgrounds/StartBorder";
import { toast } from "sonner";
import { derivePath } from "ed25519-hd-key";
import nacl from "tweetnacl";
import { generateMnemonic, mnemonicToSeedSync, validateMnemonic } from "bip39";
import { Keypair } from "@solana/web3.js";
import { motion } from "framer-motion";
import bs58 from "bs58";
import { ethers } from "ethers";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  EyeOff,
  Grid2X2,
  List,
  Trash,
} from "lucide-react";

import { Input } from "./ui/Input";

const Body = forwardRef((props, ref) => {
  const [pathTypes, setPathTypes] = useState("");
  const [wallets, setWallets] = useState([]);
  const [showMnemonic, setShowMnemonic] = useState(false);
  const [mnemonicInput, setMnemonicInput] = useState("");
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState([]);
  const [visiblePhrases, setVisiblePhrases] = useState([]);
  const [gridView, setGridView] = useState(false);
  const [logoData, setLogoData] = useState({ eth: null, sol: null });
  const [animate, setAnimate] = useState(false);
  const containerRef = useRef();
  const pathTypeNames = {
    501: "Solana",
    60: "Ethereum",
  };

  const pathTypeName = pathTypeNames[pathTypes[0]] || "";

  useEffect(() => {
    const storedWallets = localStorage.getItem("wallets");
    const storedMnemonic = localStorage.getItem("mnemonics");
    const storedPathTypes = localStorage.getItem("paths");

    if (storedWallets && storedMnemonic && storedPathTypes) {
      setMnemonicWords(JSON.parse(storedMnemonic));
      setWallets(JSON.parse(storedWallets));
      setPathTypes(JSON.parse(storedPathTypes));
      setVisiblePrivateKeys(JSON.parse(storedWallets).map(() => false));
      setVisiblePhrases(JSON.parse(storedWallets).map(() => false));
    }
  }, []);

  useEffect(() => {
    const loadLogos = async () => {
      const [ethData, solData] = await Promise.all([
        fetchAndParseLogo(logoETH, "ethereum"),
        fetchAndParseLogo(logoSOL, "solana"),
      ]);
      setLogoData({ eth: ethData, sol: solData });
    };

    loadLogos();
  }, []);

  // Intersection Observer to trigger animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true);
        }
      },
      {
        threshold: 0.3,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) observer.unobserve(containerRef.current);
    };
  }, []);

  const handleDeleteWallet = (index) => {
    const updatedWallets = wallets.filter((_, i) => i !== index);
    const updatedPathTypes = pathTypes.filter((_, i) => i !== index);

    setWallets(updatedWallets);
    setPathTypes(updatedPathTypes);
    localStorage.setItem("wallets", JSON.stringify(updatedWallets));
    localStorage.setItem("paths", JSON.stringify(updatedPathTypes));
    setVisiblePrivateKeys(visiblePrivateKeys.filter((_, i) => i !== index));
    setVisiblePhrases(visiblePhrases.filter((_, i) => i !== index));
    toast.success("Wallet deleted successfully!");
  };

  const handleClearWallets = () => {
    localStorage.removeItem("wallets");
    localStorage.removeItem("mnemonics");
    localStorage.removeItem("paths");
    setWallets([]);
    setMnemonicWords([]);
    setPathTypes([]);
    setVisiblePrivateKeys([]);
    setVisiblePhrases([]);
    // toast.success("All wallets cleared.");
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
    toast.success("Copied to clipboard!");
  };

  const togglePrivateKeyVisibility = (index) => {
    setVisiblePrivateKeys(
      visiblePrivateKeys.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  const togglePhraseVisibility = (index) => {
    setVisiblePhrases(
      visiblePhrases.map((visible, i) => (i === index ? !visible : visible))
    );
  };

  const generateWalletFromMnemonic = (pathType, mnemonic, accountIndex) => {
    try {
      const seedBuffer = mnemonicToSeedSync(mnemonic);
      const path = `m/44'/${pathType}'/0'/${accountIndex}'`;
      const { key: derivedSeed } = derivePath(path, seedBuffer.toString("hex"));

      let publicKeyEncoded;
      let privateKeyEncoded;

      if (pathType === "501") {
        // Solana
        const { secretKey } = nacl.sign.keyPair.fromSeed(derivedSeed);
        const keypair = Keypair.fromSecretKey(secretKey);

        privateKeyEncoded = bs58.encode(secretKey);
        publicKeyEncoded = keypair.publicKey.toBase58();
      } else if (pathType === "60") {
        // Ethereum
        const privateKey = Buffer.from(derivedSeed).toString("hex");
        privateKeyEncoded = privateKey;

        const wallet = new ethers.Wallet(privateKey);
        publicKeyEncoded = wallet.address;
      } else {
        toast.error("Unsupported path type.");
        return null;
      }

      return {
        publicKey: publicKeyEncoded,
        privateKey: privateKeyEncoded,
        mnemonic,
        path,
      };
    } catch (error) {
      toast.error("Failed to generate wallet. Please try again.");
      return null;
    }
  };

  const handleGenerateWallet = () => {
    let mnemonic = mnemonicInput.trim();

    if (mnemonic) {
      if (!validateMnemonic(mnemonic)) {
        toast.error("Invalid recovery phrase. Please try again.");
        return;
      }
    } else {
      mnemonic = generateMnemonic();
    }
    const words = mnemonic.split(" ");
    setMnemonicWords(words);

    const wallet = generateWalletFromMnemonic(
      pathTypes[0],
      mnemonic,
      wallets.length
    );
    if (wallet) {
      const updatedWallets = [...wallets, wallet];
      setWallets(updatedWallets);
      localStorage.setItem("wallets", JSON.stringify(updatedWallets));
      localStorage.setItem("mnemonics", JSON.stringify(words));
      localStorage.setItem("paths", JSON.stringify(pathTypes));
      setVisiblePrivateKeys([...visiblePrivateKeys, false]);
      setVisiblePhrases([...visiblePhrases, false]);
      toast.success("Wallet generated successfully!");
    }
  };

  // Metallic Paint
  const fetchAndParseLogo = async (logoPath, name) => {
    try {
      const response = await fetch(logoPath);
      const blob = await response.blob();
      const file = new File([blob], `${name}.svg`, {
        type: "image/svg+xml",
        lastModified: Date.now(),
      });
      const parsed = await parseLogoImage(file);
      return parsed.imageData;
    } catch (error) {
      console.error(`Error processing ${name} logo:`, error);
      return null;
    }
  };

  const handleAddWallet = () => {
    if (!mnemonicWords) {
      toast.error("No mnemonic found. Please generate a wallet first.");
      return;
    }

    const wallet = generateWalletFromMnemonic(
      pathTypes[0],
      mnemonicWords.join(" "),
      wallets.length
    );
    if (wallet) {
      const updatedWallets = [...wallets, wallet];
      const updatedPathType = [pathTypes, pathTypes];
      setWallets(updatedWallets);
      localStorage.setItem("wallets", JSON.stringify(updatedWallets));
      localStorage.setItem("pathTypes", JSON.stringify(updatedPathType));
      setVisiblePrivateKeys([...visiblePrivateKeys, false]);
      setVisiblePhrases([...visiblePhrases, false]);
      toast.success("Wallet generated successfully!");
    }
  };
  return (
    <>
      <div
        className={`flex w-full h-[780px] border transition-opacity duration-1000 ease-out ${
          animate ? "animate-scroll-appear" : "opacity-0"
        }`}
        ref={(el) => {
          containerRef.current = el;
          if (typeof ref === "function") ref(el);
          else if (ref) ref.current = el;
        }}
      >
        <div className="w-1/2 h-full border">
          <div className="w-full h-[80vh] flex">
            <div className="w-1/2 h-full flex items-center justify-center mt-[-100px]">
              {logoData.eth && <MetallicPaint imageData={logoData.eth} />}
            </div>
            <div className="w-1/2 h-full flex items-center justify-center mt-[50px]">
              {logoData.sol && <MetallicPaint imageData={logoData.sol} />}
            </div>
          </div>
        </div>
        <div className="w-1/2 h-[400px] flex items-center flex-col justify-center">
          <StarBorder
            as="button"
            className="mt-[100px] flex items-center justify-center px-8 py-3 bg-gradient-to-r from-gray-800 to-black text-white rounded-xl w-[300px] h-[60px] shadow-lg hover:scale-105 transition-transform duration-300"
            color="cyan"
            speed="5s"
            onClick={() => {
              setPathTypes(["501"]);
              console.log("working");
            }}
          >
            Solana
          </StarBorder>
          <StarBorder
            as="button"
            className="mt-[100px] flex items-center justify-center px-8 py-3 bg-gradient-to-r from-gray-800 to-black text-white rounded-xl w-[300px] h-[60px] shadow-lg hover:scale-105 transition-transform duration-300"
            color="cyan"
            speed="5s"
          >
            Ethereum
          </StarBorder>
        </div>
      </div>
      {pathTypes.length !== 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className="flex flex-col gap-4 my-12"
        >
          <div className="flex flex-col gap-2">
            <h1 className="tracking-tighter text-4xl md:text-5xl font-black">
              Secret Recovery Phrase
            </h1>
            <p className="text-primary/80 font-semibold text-lg md:text-xl">
              Save these words in a safe place.
            </p>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              type="password"
              placeholder="Enter your secret phrase (or leave blank to generate)"
              onChange={(e) => setMnemonicInput(e.target.value)}
              value={mnemonicInput}
            />
            {/* <Button size={"lg"} onClick={() => handleGenerateWallet()}>
              {mnemonicInput ? "Add Wallet" : "Generate Wallet"}
            </Button> */}
          </div>
        </motion.div>
      )}
    </>
  );
});

export default Body;
