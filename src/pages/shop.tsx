"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useShopStore } from "@/store/use-shop-store";
import { X } from "lucide-react";
import { useUserStore } from "@/store/use-user-store";
import { redeemShopItem } from "@/lib/actions/redeem-shop-item";
import { toast } from "sonner";
import { useRedeemedStore } from "@/store/use-redeemed-store";
import { useRadioStore } from "@/store/use-radio-store";
import { ShopItem } from "@/types/types";
import Image from "next/image";

const Shop = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { items } = useShopStore();
  const redeemedItems = useRedeemedStore((s) => s.redeemedItems);
  const [redeemingItemId, setRedeemingItemId] = useState<number | null>(null);
  const user = useUserStore((s) => s.user);
  const radioReload = useRadioStore((s) => s.reload);

  const categories = [...new Set(items.map((item) => item.category))];

  const handleRedeem = async (item: ShopItem) => {
    setRedeemingItemId(item.id);
    const data = await redeemShopItem(item.id);

    if (data.success) {
      toast.success(data.message);

      useRedeemedStore.setState((state) => ({
        redeemedItems: [...state.redeemedItems, item.id],
      }));

      if (item.category === "audios") {
        await radioReload();
      }
    } else {
      toast.error(data.message);
    }

    setRedeemingItemId(null);
  };

  const genreIcon = (genre: string) => {
    switch (genre) {
      case "audios":
        return "🔊";
      case "presentes":
        return "🎁";
      default:
        return "🛒";
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="absolute bottom-56 md:bottom-72 right-16 z-10 cursor-pointer"
        whileHover={{ scale: 1.1 }}
      >
        <Image
          width={1024}
          height={1024}
          priority
          src="/objects/store.png"
          alt="Missões"
          className="w-24 md:w-32"
        />
      </motion.button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[768px] h-4/5 bg-white rounded-2xl flex flex-col gap-4 p-4"
          >
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold">Loja</h1>
              <p className="font-bold">🪙 {user!.points}</p>
              <X onClick={() => setIsOpen(false)} className="cursor-pointer" />
            </div>

            <Tabs defaultValue={categories[0]} className="w-full">
              <TabsList>
                {categories.map((cat) => (
                  <TabsTrigger key={cat} value={cat} className="capitalize">
                    {genreIcon(cat)}
                  </TabsTrigger>
                ))}
              </TabsList>

              {categories.map((cat) => (
                <TabsContent key={cat} value={cat} className="space-y-4">
                  {items
                    .filter((item) => item.category === cat)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 border-b py-4"
                      >
                        <img
                          src={
                            item.image_url
                              ? item.image_url
                              : `/icons/${item.category}.png`
                          }
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h2 className="font-semibold">{item.name}</h2>
                          <p className="text-sm text-muted-foreground">
                            {item.description}
                          </p>
                        </div>

                        {redeemedItems.includes(item.id) ? (
                          <p className="text-sm font-semibold text-green-600">
                            ✅ Resgatado
                          </p>
                        ) : (
                          <button
                            onClick={() => handleRedeem(item)}
                            disabled={
                              redeemingItemId === item.id ||
                              user!.points < item.cost
                            }
                            className="bg-primary text-white px-4 py-1 rounded hover:bg-primary/80 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            🪙 {item.cost}
                          </button>
                        )}
                      </div>
                    ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      )}
    </>
  );
};

export default Shop;
