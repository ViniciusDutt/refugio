"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import Image from "next/image";

interface DraggableStickerProps {
  id: string;
  imageUrl: string;
}

export const DraggableSticker = ({ id, imageUrl }: DraggableStickerProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="w-20 aspect-[2/3] cursor-grab overflow-hidden shadow !z-50"
    >
      <Image
        fill
        priority
        src={imageUrl}
        alt={`Sticker ${id}`}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-1 p-1 py-0 w-full flex justify-center">
        <div className="bg-black/50 px-1 rounded shadow text-[10px] text-white font-[Roboto]">
          {String(id).padStart(3, "0")}
        </div>
      </div>
    </div>
  );
};
