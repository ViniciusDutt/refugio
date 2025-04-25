"use client";

import { useMissionsStore } from "@/store/use-missions-store";
import { X } from "lucide-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useState } from "react";

const Missions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const missions = useMissionsStore((s) => s.missions);
  const activeMissions = missions.filter((m) => m.status === "pendente");

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(true)}
        className="font-[Shadows_Into_Light] absolute left-0 bottom-0 rotate-x-45 -skew-x-2 md:-skew-x-6 z-10 cursor-pointer hover:scale-110 transition-all"
      >
        <Image
          width={1024}
          height={1024}
          priority
          src="/objects/clipboard.png"
          alt="Missões"
          className="w-48 md:w-64 drop-shadow-md/50"
        />
        <div className="absolute top-16 left-8 text-left w-8/12">
          <h2 className="font-bold">Missões</h2>
          {activeMissions.slice(0, 3).map((mission) => (
            <div key={mission.id} className="mb-2">
              <p className="font-bold truncate">{mission.missions.title}</p>
              <p className="text-sm truncate">{mission.missions.description}</p>
            </div>
          ))}
        </div>
      </motion.button>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="font-[Shadows_Into_Light] fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[480px] h-4/5 bg-[#C38944] border-4 border-[#d49140] rounded-2xl p-6"
          >
            <div className="absolute left-1/2 -top-4 -translate-x-1/2 bg-[#C38944] w-48 h-16 rounded-[24px_24px_8px_8px] border-b-4 border-t-4 border-b-[#654222] border-t-[#d49140]" />

            <div className="w-full h-full bg-white rounded flex flex-col gap-4 p-4 border-[#654222] border-4">
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Missões</h1>
                <X
                  onClick={() => setIsOpen(false)}
                  className="cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-2 w-full">
                {activeMissions.length === 0 ? (
                  <p className="text-center text-zinc-600">
                    Nenhuma missão ativa no momento.
                  </p>
                ) : (
                  activeMissions.map((mission) => (
                    <div
                      key={mission.id}
                      className="flex items-center justify-between py-2"
                    >
                      <div>
                        <p className="font-bold">{mission.missions.title}</p>
                        <p className="text-sm">
                          {mission.missions.description}
                        </p>
                      </div>
                      <div className="text-end">
                        <p>Recompensa:</p>
                        <p className="font-bold text-sm">
                          🪙 {mission.missions.reward}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Missions;
