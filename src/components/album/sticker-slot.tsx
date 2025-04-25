"use client";

import { useDroppable } from "@dnd-kit/core";
import { cn } from "@/lib/utils";

interface StickerSlotProps {
  stickerId: string;
  children: React.ReactNode;
}

export const StickerSlot = ({ stickerId, children }: StickerSlotProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: stickerId,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "aspect-[2/3] max-w-[120px] lg:max-w-[200px] flex-1 bg-black relative flex items-center justify-center transition duration-300",
        isOver ? "ring-2 ring-green-500" : ""
      )}
    >
      {children}
    </div>
  );
};
