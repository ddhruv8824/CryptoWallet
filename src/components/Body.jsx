import React, { useState, useEffect } from "react";
import MetallicPaint, {
  parseLogoImage,
} from "../blocks/Backgrounds/MetallicPaint";
import logo from "../assets/images/ethereum-svgrepo-com.svg";

const Body = () => {
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    async function loadDefaultImage() {
      try {
        const response = await fetch(logo);
        const blob = await response.blob();
        const file = new File([blob], "default.png", { type: blob.type });

        const parsedData = await parseLogoImage(file);
        setImageData(parsedData?.imageData ?? null);
      } catch (err) {
        console.error("Error loading default image:", err);
      }
    }

    loadDefaultImage();
  }, []);

  return (
    <div className="flex border border-white w-full h-[400px]">
      <div className="border border-white w-1/2 h-full">
        <MetallicPaint
          imageData={imageData ?? new ImageData(1, 1)}
          params={{
            edge: 2,
            patternBlur: 0.005,
            patternScale: 2,
            refraction: 0.015,
            speed: 0.3,
            liquid: 0.07,
          }}
        />
      </div>

      <div className="border border-black w-1/2 h-full"></div>
    </div>
  );
};

export default Body;
