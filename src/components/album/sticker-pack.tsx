"use client";

import { useStickerStore } from "@/store/use-stickers-store";
import { useAlbumStore } from "@/store/use-album-store";
import { DraggableSticker } from "./draggable-sticker";
import { useMemo } from "react";
import { useDndMonitor } from "@dnd-kit/core";

export const StickerPack = () => {
  const userStickers = useStickerStore((s) => s.userStickers);
  const pages = useAlbumStore((s) => s.pages);
  const activeId = useStickerStore((s) => s.activeDraggingId);
  const setActiveDraggingId = useStickerStore((s) => s.setActiveDraggingId);

  useDndMonitor({
    onDragStart(event) {
      setActiveDraggingId(event.active.id.toString());
    },
    onDragEnd() {
      setActiveDraggingId(null);
    },
    onDragCancel() {
      setActiveDraggingId(null);
    },
  });

  const availableStickers = useMemo(() => {
    return userStickers.filter((s) => !s.is_pasted);
  }, [userStickers]);

  const allStickers = pages.flatMap((page) => page.stickers);

  const stickersToRender = availableStickers
    .map((us) =>
      allStickers.find((s) => String(s.id) === String(us.sticker_id))
    )
    .filter(Boolean);

  if (!stickersToRender.length) {
    return (
      <div className="flex-1 w-full text-sm bg-black/50 rounded-2xl text-gray-400 p-4 text-center italic h-40 flex items-center justify-center">
        Nenhuma figurinha disponível para colar.
      </div>
    );
  }

  return (
    <div className="relative flex-1 h-40 w-full p-4 bg-black/50 rounded-xl overflow-hidden flex items-center justify-center select-none">
      {stickersToRender
        .filter((sticker) => String(sticker!.id) !== String(activeId))
        .map((sticker, index) => {
          const rotation = Math.floor(Math.random() * 13) - 6;
          const offsetX = Math.floor(Math.random() * 10) - 5;
          const offsetY = Math.floor(Math.random() * 10) - 5;

          return (
            <div
              key={sticker!.id}
              className="absolute"
              style={{
                top: `calc(50% + ${offsetY}px)`,
                left: `calc(50% + ${offsetX}px)`,
                transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
                zIndex: index + 1,
              }}
            >
              <DraggableSticker
                id={sticker!.id}
                imageUrl={`https://zsgevfhnkqpyzzpunduf.supabase.co/storage/v1/object/public/stickers/place-${
                  sticker!.place_id
                }/${sticker!.image_url}`}
              />
            </div>
          );
        })}
    </div>
  );
};
