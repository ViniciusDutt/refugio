"use client";

import { useState } from "react";
import { PencilRuler } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { editMission } from "@/lib/actions/admin/missions-actions";
import { toast } from "sonner";
import { AdminMission } from "@/types/types";
import { useAdminStore } from "@/store/use-admin-store";

interface Props {
  mission: AdminMission;
}

export const EditMissionModal = ({ mission }: Props) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(mission.missions.title);
  const [description, setDescription] = useState(mission.missions.description);
  const [reward, setReward] = useState(mission.missions.reward);

  const handleSave = async () => {
    const res = await editMission(mission.missions.id, {
      title,
      description,
      reward,
    });

    toast[res.success ? "success" : "error"](res.message);

    if (res.success) {
      useAdminStore.setState((state) => ({
        missions: state.missions.map((m) =>
          m.missions.id === mission.missions.id
            ? {
                ...m,
                missions: {
                  ...m.missions,
                  title,
                  description,
                  reward,
                },
              }
            : m
        ),
      }));

      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full flex justify-start">
          <PencilRuler className="mr-2 w-4 h-4" /> Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white font-[Roboto]">
        <DialogHeader>
          <DialogTitle>Editar missão</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Título"
          />
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição"
          />
          <Input
            type="number"
            value={reward}
            onChange={(e) => setReward(Number(e.target.value))}
            placeholder="Recompensa"
          />
        </div>
        <DialogFooter className="mt-4">
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
