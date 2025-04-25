export const dynamic = "force-dynamic";
import type { Metadata } from "next";
import { Charm, Roboto, Shadows_Into_Light } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { getAdminData } from "@/lib/actions/admin/get-admin-data";
import { getUserMissions } from "@/lib/actions/get-user-missions";
import { getUnlockedAudios } from "@/lib/actions/get-unlocked-audios";
import { getRedeemedAudiosAdmin } from "@/lib/actions/admin/get-redeemed-audios";
import { getRedeemedItems } from "@/lib/actions/get-redeemed-items";
import { getShopItems } from "@/lib/actions/get-shop-items";
import { getUser } from "@/lib/actions/get-user";
import { ClientInitializer } from "@/components/client-initializer";
import { getAlbumPages } from "@/lib/actions/get-album-pages";
import { getUserStickers } from "@/lib/actions/get-user-stickers";
import {
  generateDailyPackIfNeeded,
  getAvailableDailyPacks,
} from "@/lib/actions/daily-packs";

const charm = Charm({
  subsets: ["latin"],
  variable: "--quintessential",
  weight: "400",
});

export const roboto = Roboto({
  subsets: ["latin"],
  weight: "400",
});

export const shadowsIntoLight = Shadows_Into_Light({
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "Refúgio",
  description: "",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getUser();

  const [
    admin,
    userMissions,
    audios,
    redeemedAudios,
    redeemedItems,
    shopItems,
    albumPages,
    stickers,
    dailyPacks,
  ] = await Promise.all([
    getAdminData(),
    getUserMissions(),
    getUnlockedAudios(),
    getRedeemedAudiosAdmin(),
    getRedeemedItems(),
    getShopItems(),
    getAlbumPages(),
    getUserStickers(),
    getAvailableDailyPacks(),
    generateDailyPackIfNeeded(),
  ]);

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${charm.className} antialiased`}
        suppressHydrationWarning
      >
        <ClientInitializer
          user={user}
          userMissions={userMissions}
          unlockedAudios={audios}
          redeemedAudios={redeemedAudios}
          redeemedItems={redeemedItems}
          shop={shopItems}
          admin={admin}
          albumPages={albumPages}
          userStickers={stickers}
          dailyPacks={dailyPacks}
        />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
