"use client";

import { Sticker } from "@/types/types";
import { useStickerStore } from "@/store/use-stickers-store";

interface StickerPhraseProps {
  pair: Sticker[];
}

export const StickerPhrase = ({ pair }: StickerPhraseProps) => {
  const isStickerPasted = useStickerStore((s) => s.isStickerPasted);

  const [left, right] = pair;

  const isLeftColada = isStickerPasted(left.id);
  const isRightColada = right ? isStickerPasted(right.id) : false;

  const leftText = left.name || "";
  const rightText = right?.name || "";

  if (isLeftColada && isRightColada) {
    return (
      <p className="max-w-md text-center text-sm text-gray-600 italic">
        {leftText}{" "}
        {rightText.startsWith("...") ? rightText.slice(3) : rightText}
      </p>
    );
  }

  if (isLeftColada && !isRightColada) {
    return (
      <p className="max-w-md text-center text-sm text-gray-400 italic">
        {leftText}...
      </p>
    );
  }

  if (!isLeftColada && isRightColada) {
    return (
      <p className="max-w-md text-center text-sm text-gray-400 italic">
        ...{rightText}
      </p>
    );
  }

  return null;
};
