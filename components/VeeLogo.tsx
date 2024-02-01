"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Link from "next/link";


const VeeLogo = () => {
  //update the size of the logo when the size of the screen changes
  const [width, setWidth] = useState(0);

  const updateWidth = () => {
    const newWidth = window.innerWidth;
    setWidth(newWidth);
  };

  useEffect(() => {
    window.addEventListener("resize", updateWidth);
    updateWidth();
  }, []);


  return (
    <>
    <div className="bg-blue-500 bg-[#D7AA12]">
      <Link href="/" >
        <Image
          src="/images/logoheader.png"
          alt="Logo"
          width={width < 1024 ? "150" : "250"}
          height={width < 1024 ? "45" : "74"}
          className="relative"
        />
      </Link>
      </div>
      
    </>
  );
};

export default VeeLogo;