"use client";

import ContractModal from "@/components/contract-modal";
import HunterCard from "@/components/hunter-card";
import Book from "@/pages/book";
import Map from "@/pages/map";
import Missions from "@/pages/missions";
import Radio from "@/pages/radio";
import Shop from "@/pages/shop";
import { useUserStore } from "@/store/use-user-store";
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const user = useUserStore((s) => s.user);

  if (!user)
    return (
      <div className="relative w-full h-dvh flex flex-col justify-center items-center overflow-hidden">
        <Loader2 className="animate-spin" />
      </div>
    );

  return (
    <div className="relative w-full h-dvh flex flex-col items-center overflow-hidden">
      {!user.contract_accepted && <ContractModal />}

      <Image
        src="/textures/table.png"
        fill
        priority
        className="absolute w-full h-full object-cover z-0"
        alt="Mesa"
      />
      <div className="relative h-full w-full md:w-3xl">
        <Radio />
        <Map />
        <Book />
        <Shop />
        <Missions />
        <HunterCard />
      </div>
    </div>
  );
}
