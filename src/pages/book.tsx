"use client";

import { X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import AlbumViewer from "@/components/album/album-viewer";
import { DndContext, DragEndEvent, DragOverlay } from "@dnd-kit/core";
import { updateStickerPasted } from "@/store/update-sticker-pasted";
import { useStickerStore } from "@/store/use-stickers-store";
import { useAlbumStore } from "@/store/use-album-store";
import { StickerPack } from "@/components/album/sticker-pack";
import { MultipleDailyPacks } from "@/components/album/multiple-daily-packs";
import Image from "next/image";

const Book = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const pages = useAlbumStore((s) => s.pages);
  const allStickers = pages.flatMap((page) => page.stickers);
  const activeSticker = allStickers.find(
    (s) => String(s.id) === String(activeId)
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveId(null);

    if (!over) return;

    const draggedId = active.id.toString();
    const targetId = over.id.toString();

    if (draggedId === targetId) {
      useStickerStore.getState().addPastedSticker(draggedId);
      await updateStickerPasted(draggedId);
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="absolute left-6 md:left-1/2 md:-translate-x-1/2 -rotate-16 rotate-x-24 bottom-56 md:bottom-72 z-10 cursor-pointer"
        whileHover={{ scale: 1.1, rotate: -1 }}
      >
        <Image
          width={1024}
          height={1024}
          src="/objects/book.png"
          alt="Álbum"
          className=" w-48 md:w-64 drop-shadow-md/50"
        />
      </motion.button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 touch-none"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative rounded-xl shadow-lg w-full h-[85vh] flex flex-col md:flex-row gap-4"
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-8 right-2 z-10 cursor-pointer"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <DndContext
              onDragStart={(e) => setActiveId(e.active.id.toString())}
              onDragEnd={handleDragEnd}
              onDragCancel={() => setActiveId(null)}
            >
              <div className="w-full md:w-[40%] h-40 lg:h-full items-center justify-center flex lg:flex-col gap-4">
                <MultipleDailyPacks />
                <StickerPack />
              </div>

              <AlbumViewer />

              <DragOverlay>
                {activeSticker && (
                  <div className="fixed w-20 aspect-[2/3] top-0 left-0 z-[9999] pointer-events-none">
                    <Image
                      fill
                      priority
                      src={`https://zsgevfhnkqpyzzpunduf.supabase.co/storage/v1/object/public/stickers/place-${activeSticker.place_id}/${activeSticker.image_url}`}
                      alt={activeSticker.name}
                      className="w-full h-full object-cover rounded shadow-lg"
                    />
                  </div>
                )}
              </DragOverlay>
            </DndContext>
          </div>
        </div>
      )}
    </>
  );
};

export default Book;
