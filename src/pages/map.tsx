"use client";

import { motion } from "motion/react";
import { Lock } from "lucide-react";
import Image from "next/image";

const Map = () => {
  return (
    <>
      <motion.button
        className="absolute right-0 bottom-80 md:bottom-96 z-10 cursor-pointer"
        initial={{ scale: 1, rotateY: 180 }}
        whileHover={{ scale: 1.1 }}
      >
        <Image
          width={1024}
          height={1024}
          priority
          src="/objects/map.png"
          alt="Mapa"
          className="brightness-10 w-48 md:w-64 drop-shadow-md/50"
        />
        <Lock className="text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </motion.button>
    </>
  );
};

export default Map;
