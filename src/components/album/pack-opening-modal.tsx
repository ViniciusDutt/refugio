"use client";

import { motion, AnimatePresence } from "motion/react";
import { Sticker } from "@/types/types";
import { useEffect, useState } from "react";
import { useStickerStore } from "@/store/use-stickers-store";
import { addUserStickersToDB } from "@/lib/actions/add-user-stickers";
import { markDailyPackAsClaimed } from "@/lib/actions/daily-packs";
import Image from "next/image";

interface PackOpeningModalProps {
  isOpen: boolean;
  onClose: () => void;
  pack: {
    id: number;
    stickers: Sticker[];
  };
}

const rarityColor = {
  common: "border-gray-400",
  rare: "border-blue-400",
  epic: "border-purple-500",
  legendary: "border-yellow-400",
};

const PackOpeningModal = ({ isOpen, onClose, pack }: PackOpeningModalProps) => {
  const [revealed, setRevealed] = useState<number>(0);
  const [alreadyAdded, setAlreadyAdded] = useState(false);

  const currentUserStickers = useStickerStore((s) => s.userStickers);
  const appendUserStickers = useStickerStore((s) => s.appendUserStickers);
  const removePackByIndex = useStickerStore((s) => s.removePackByIndex);

  useEffect(() => {
    if (isOpen) {
      setRevealed(0);
      setAlreadyAdded(false);
      const interval = setInterval(() => {
        setRevealed((prev) => {
          const next = prev + 1;
          if (next > pack.stickers.length) {
            clearInterval(interval);
            return prev;
          }
          return next;
        });
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isOpen, pack.stickers.length]);

  useEffect(() => {
    if (revealed === pack.stickers.length && !alreadyAdded) {
      const newEntries = pack.stickers
        .filter(
          (s, i) =>
            !currentUserStickers.some((u) => u.sticker_id === s.id) &&
            !pack.stickers.slice(0, i).some((prev) => prev.id === s.id)
        )
        .map((s) => ({
          sticker_id: s.id,
          is_pasted: false,
          source: "daily",
        }));

      if (newEntries.length > 0) {
        appendUserStickers(newEntries);
        addUserStickersToDB(
          newEntries.map(({ sticker_id, source }) => ({
            sticker_id: Number(sticker_id),
            source,
          }))
        );
      }

      setTimeout(() => {
        markDailyPackAsClaimed(pack.id).then(() => {
          removePackByIndex(0);
        });
      }, 2000);
      setAlreadyAdded(true);
    }
  }, [
    revealed,
    alreadyAdded,
    pack,
    currentUserStickers,
    appendUserStickers,
    removePackByIndex,
  ]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 z-[999] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div
            className="relative w-full max-w-3xl flex flex-wrap justify-center gap-4"
            onClick={(e) => e.stopPropagation()}
          >
            {pack.stickers.slice(0, revealed).map((sticker, index) => (
              <motion.div
                key={sticker.id}
                className={`relative w-28 aspect-[2/3] border-4 rounded-xl overflow-hidden shadow-lg ${
                  rarityColor[sticker.rarity]
                }`}
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 300,
                }}
              >
                <Image
                  fill
                  priority
                  src={`https://zsgevfhnkqpyzzpunduf.supabase.co/storage/v1/object/public/stickers/place-${sticker.place_id}/${sticker.image_url}`}
                  alt={sticker.name}
                  className="w-full h-full object-cover"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default PackOpeningModal;
