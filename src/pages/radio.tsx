"use client";

import { useRadioStore } from "@/store/use-radio-store";
import { X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

const Radio = () => {
  const [isOpen, setIsOpen] = useState(false);
  const audios = useRadioStore((s) => s.audios);

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="absolute -left-4 bottom-96 md:bottom-104 cursor-pointer"
        whileHover={{ scale: 1.1 }}
      >
        <Image
          width={1024}
          height={1024}
          src="/objects/radio.png"
          alt="Radio"
          className="w-56 md:w-64 drop-shadow-md/50"
        />
      </motion.button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[768px] h-4/5 bg-white rounded-2xl p-4"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Radio</h1>
              <X onClick={() => setIsOpen(false)} className="cursor-pointer" />
            </div>
            <hr />

            <div className="flex flex-col gap-2 w-full h-full overflow-y-auto">
              {audios.length === 0 ? (
                <div className="w-full h-full flex flex-col items-center justify-center text-[#3a2b1a]">
                  <div className="animate-pulse text-center">
                    <p className="text-lg mb-2">Sem frequência na rádio...</p>
                    <div className="flex space-x-1 justify-center">
                      <div className="w-2 h-2 bg-[#3a2b1a] rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-[#3a2b1a] rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-[#3a2b1a] rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              ) : (
                audios.map((audio) => (
                  <div
                    key={audio.id}
                    className="flex items-center gap-4 py-4 border-b"
                  >
                    <Image
                      src={`/objects/${audio.category}.png`}
                      alt="Radio"
                      width={96}
                      height={63}
                      className="w-24 md:w-32"
                    />
                    <div className="w-full flex flex-col gap-2">
                      <div className="flex items-center justify-between w-full">
                        <h2 className="font-bold">{audio.title}</h2>
                        <p>{new Date(audio.created_at).toLocaleDateString()}</p>
                      </div>
                      <audio controls src={audio.url} className="w-full h-10" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Radio;
