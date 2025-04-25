"use client";

import { motion } from "motion/react";
import Image from "next/image";

const HunterCard = () => {
  return (
    <motion.button className="absolute right-6 bottom-16 hover:bottom-6 transition-all hover:scale-110 z-10">
      <div className="relative w-24 md:w-32 rotate-x-45 skew-x-2 md:skew-x-8 hover:skew-0 transition-all hover:rotate-x-0">
        <Image
          width={536}
          height={842}
          src="/objects/card.png"
          className="drop-shadow-md/50"
          alt=""
        />
        <Image
          width={1024}
          height={1024}
          src="/hunter.png"
          alt="hunter"
          className="absolute top-5 left-1/2 -translate-x-1/2 aspect-[4/3] object-cover object-top w-3/5"
        />
        <p className="text-left leading-3.5 absolute top-28 md:top-38 left-3 text-[8px] md:text-xs">
          Juliana Alice
          <br />
          Especialista
        </p>
      </div>
    </motion.button>
  );
};

export default HunterCard;
