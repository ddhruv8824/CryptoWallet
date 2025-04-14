import React, { useState, useEffect } from "react";
import MetallicPaint, {
  parseLogoImage,
} from "../blocks/Backgrounds/MetallicPaint";
import logo from "../assets/images/ethereum-svgrepo-com.svg";
import Swap from "./Swap";

const Body = () => {
  const [imageData, setImageData] = useState(null);

  const createFileObject = () => {
    fetch(logo)
      .then((response) => response.blob())
      .then((blob) => {
        const newFile = new File([blob], "react.svg", {
          type: "image/svg+xml",
          lastModified: Date.now(),
        });

        parseLogoImage(newFile)
          .then((parsedData) => {
            setImageData(parsedData.imageData);
          })
          .catch((error) => {
            console.error("Error parsing image:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching the logo:", error);
      });
  };

  useEffect(() => {
    createFileObject();
  }, []);
  return (
    <div className="flex border  w-full h-[600px]">
      <div className="border w-1/2 h-full">
        <div style={{ width: "100%", height: "80vh" }}>
          {imageData && <MetallicPaint imageData={imageData} />}
        </div>
      </div>
      <div className="border border-white w-1/2 h-full flex items-center justify-center">
        <Swap />
      </div>
    </div>
  );
};

export default Body;
