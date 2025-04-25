"use client";

import { useAlbumStore } from "@/store/use-album-store";
import { forwardRef } from "react";
import HTMLFlipBook from "react-pageflip";
import { StickerPhrase } from "./sticker-phrase";
import { useStickerStore } from "@/store/use-stickers-store";
import { StickerSlot } from "./sticker-slot";
import Image from "next/image";

const PageCover = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  (props, ref) => {
    return (
      <div className="bg-[#2f2045]" ref={ref} data-density="hard">
        <div className="flex justify-center items-center h-full w-full p-6">
          {props.children}
        </div>
      </div>
    );
  }
);

const Page = forwardRef<HTMLDivElement, { children: React.ReactNode }>(
  (props, ref) => {
    return (
      <div className="bg-[#FEFFED]" ref={ref}>
        <div className="w-full h-full flex flex-col gap-6 px-6 sm:px-10 md:px-20 lg:px-28 py-6 items-center justify-center">
          {props.children}
        </div>
      </div>
    );
  }
);

PageCover.displayName = "PageCover";
Page.displayName = "Page";

export default function AlbumViewer() {
  const pages = useAlbumStore((state) => state.pages);
  const userStickers = useStickerStore((s) => s.userStickers);
  const lastPastedId = useStickerStore((s) => s.lastPastedId);

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <HTMLFlipBook
        width={550}
        height={650}
        minWidth={315}
        maxWidth={1000}
        minHeight={420}
        maxHeight={1350}
        showCover={true}
        flippingTime={700}
        style={{}}
        maxShadowOpacity={0.5}
        className=""
        startPage={0}
        size="stretch"
        drawShadow={true}
        usePortrait={true}
        startZIndex={0}
        autoSize={true}
        mobileScrollSupport={true}
        clickEventForward={true}
        useMouseEvents={true}
        swipeDistance={300}
        showPageCorners={true}
        disableFlipByClick={false}
      >
        <PageCover>
          <Image
            width={1024}
            height={1024}
            priority
            src="/objects/cover.svg"
            className="w-full object-contain"
            alt=""
          />
        </PageCover>

        {pages.map((page) => (
          <Page key={page.placeId}>
            {Array.from({ length: Math.ceil(page.stickers.length / 2) }).map(
              (_, rowIndex) => {
                const start = rowIndex * 2;
                const pair = page.stickers.slice(start, start + 2);

                const formatStickerId = (id: string | number) => {
                  const num = Number(id);
                  if (num < 10) return `00${num}`;
                  if (num < 100) return `0${num}`;
                  return `${num}`;
                };

                return (
                  <div
                    key={rowIndex}
                    className="w-full flex flex-col items-center justify-center gap-2"
                  >
                    <div className="w-full flex justify-center">
                      {pair.map((sticker) => {
                        const isColada = userStickers.some(
                          (entry) =>
                            String(entry.sticker_id) === String(sticker.id) &&
                            entry.is_pasted
                        );

                        return (
                          <StickerSlot key={sticker.id} stickerId={sticker.id}>
                            <>
                              {isColada ? (
                                <Image
                                  fill
                                  src={`https://zsgevfhnkqpyzzpunduf.supabase.co/storage/v1/object/public/stickers/place-${sticker.place_id}/${sticker.image_url}`}
                                  alt={sticker.name}
                                  className={`w-full h-full object-contain transition ${
                                    String(lastPastedId) === String(sticker.id)
                                      ? "animate-sticker-paste"
                                      : ""
                                  }`}
                                />
                              ) : (
                                <>
                                  <div className="absolute w-full bg-white h-0.5"></div>
                                  <div className="absolute h-full bg-white w-0.5"></div>
                                  <div className="w-1/2 aspect-square bg-black z-10 flex items-center justify-center font-[Roboto] text-white text-xl">
                                    {formatStickerId(sticker.id)}
                                  </div>
                                </>
                              )}
                            </>
                          </StickerSlot>
                        );
                      })}
                    </div>
                    <StickerPhrase pair={pair} />
                  </div>
                );
              }
            )}
          </Page>
        ))}

        <PageCover>
          <Image
            width={1024}
            height={1024}
            src="/objects/back-cover.svg"
            className="h-full object-contain"
            alt=""
          />
        </PageCover>
      </HTMLFlipBook>
    </div>
  );
}
