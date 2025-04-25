"use client";

import { useState } from "react";
import { useStickerStore } from "@/store/use-stickers-store";
import PackOpeningModal from "./pack-opening-modal";
import { motion } from "motion/react";

export const DailyPackCard = () => {
  const dailyPacks = useStickerStore((s) => s.dailyPacks);
  const currentPack = dailyPacks[0];
  const [isOpening, setIsOpening] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleOpenPack = () => {
    if (!currentPack || currentPack.stickers.length === 0 || isAnimating)
      return;

    setIsAnimating(true);
    setTimeout(() => {
      setIsOpening(true);
      setIsAnimating(false);
    }, 800);
  };

  const handleCloseModal = () => {
    setIsOpening(false);
  };

  return (
    <>
      <div
        onClick={handleOpenPack}
        className={`flex-1 flex items-center justify-center w-full h-full rounded-2xl p-4 cursor-pointer transition ${
          currentPack?.stickers?.length > 0
            ? "bg-black/50"
            : "bg-black/20 cursor-not-allowed"
        }`}
      >
        {currentPack?.stickers?.length > 0 ? (
          <motion.img
            src="/objects/pack.svg"
            alt="Pacote de figurinhas"
            initial={{ scale: 1, rotate: 0 }}
            animate={
              isAnimating
                ? { scale: 1.2, rotate: [0, 2, -2, 2, -2, 0], opacity: 0 }
                : { scale: 1, rotate: 0, opacity: 1 }
            }
            transition={{ duration: 0.7 }}
            className="w-24 sm:w-28 md:w-32 drop-shadow-xl"
          />
        ) : (
          <span className="text-gray-400 text-sm text-center">
            Nenhum pacote disponível
          </span>
        )}
      </div>

      {currentPack && (
        <PackOpeningModal
          isOpen={isOpening}
          onClose={handleCloseModal}
          pack={currentPack}
        />
      )}
    </>
  );
};
