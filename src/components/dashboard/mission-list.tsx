"use client";

import { CircleCheckBig, EllipsisVertical, Trash2 } from "lucide-react";
import { useAdminStore } from "@/store/use-admin-store";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  addMission,
  completeMission,
  deleteMission,
} from "@/lib/actions/admin/missions-actions";
import { toast } from "sonner";
import { EditMissionModal } from "./edit-mission-modal";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface MissionListProps {
  section: "ativas" | "concluidas" | "nova";
}

const MissionList = ({ section }: MissionListProps) => {
  const missions = useAdminStore((s) => s.missions);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [reward, setReward] = useState<number>(0);

  const filtered = missions.filter((m) => {
    if (section === "ativas")
      return m.status === "pendente" && m.missions?.is_active;
    if (section === "concluidas") return m.status !== "pendente";
    return false;
  });

  const handleConclude = async (
    instanceId: number,
    userId: string,
    missionId: number,
    reward: number
  ) => {
    const res = await completeMission(userId, missionId, reward);

    if (res.success) {
      toast.success("Missão concluída com sucesso!");
      useAdminStore.setState((state) => ({
        missions: state.missions.map((m) =>
          m.id === instanceId
            ? {
                ...m,
                status: "concluida",
                completed_at: new Date().toISOString(),
              }
            : m
        ),
      }));
    } else {
      toast.error(res.message);
    }
  };

  const handleDelete = async (missionId: number) => {
    const res = await deleteMission(missionId);

    toast[res.success ? "success" : "error"](res.message);

    if (res.success) {
      useAdminStore.setState((state) => ({
        missions: state.missions.filter((m) => m.missions.id !== missionId),
      }));
    }
  };

  if (section === "nova") {
    const handleCreate = async (e: React.FormEvent) => {
      e.preventDefault();

      if (!title || !description || reward <= 0) {
        toast.error("Preencha todos os campos corretamente.");
        return;
      }

      const res = await addMission(title, description, reward);

      toast[res.success ? "success" : "error"](res.message);

      if (res.success && res.mission) {
        const newMission = {
          id: res.mission.id,
          created_at: res.mission.created_at ?? new Date().toISOString(),
          mission_id: res.mission.id,
          user_id: process.env.USER_ID!,
          status: "pendente",
          completed_at: null,
          missions: {
            id: res.mission.id,
            title: res.mission.title,
            description: res.mission.description,
            reward: res.mission.reward,
            is_active: res.mission.is_active,
          },
        };

        useAdminStore.setState((state) => ({
          missions: [newMission, ...state.missions],
        }));

        setTitle("");
        setDescription("");
        setReward(0);
      }
    };

    return (
      <form className="space-y-4" onSubmit={handleCreate}>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Título da missão"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-9/12 border rounded px-3 py-2"
          />
          <Input
            type="number"
            placeholder="Pontos"
            value={reward}
            onChange={(e) => setReward(Number(e.target.value))}
            className="w-3/12 border rounded px-3 py-2"
          />
        </div>
        <Textarea
          placeholder="Descrição da missão"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2 resize-none"
        />
        <Button
          type="submit"
          className="cursor-pointer bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          Criar Missão
        </Button>
      </form>
    );
  }

  return (
    <ul className="space-y-2">
      {filtered.map((mission) => (
        <li
          key={mission.id}
          className="py-2 border-b flex justify-between items-center"
        >
          <span>{mission.missions.title}</span>
          <Popover>
            <PopoverTrigger>
              <EllipsisVertical className="cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-2 w-full items-baseline font-[Roboto]">
              {mission.status === "pendente" && (
                <Button
                  variant="ghost"
                  className="w-full flex justify-start text-blue-500 hover:text-blue-500"
                  onClick={() =>
                    handleConclude(
                      mission.id,
                      mission.user_id,
                      mission.mission_id,
                      mission.missions.reward
                    )
                  }
                >
                  <CircleCheckBig className="mr-2 w-4 h-4" /> Concluir missão
                </Button>
              )}
              <EditMissionModal mission={mission} />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full flex justify-start text-destructive hover:text-destructive/90"
                  >
                    <Trash2 className="mr-2 w-4 h-4" /> Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Deseja mesmo excluir?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta missão será removida permanentemente do sistema.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-transparent">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-white hover:bg-destructive/90"
                      onClick={() => handleDelete(mission.missions.id)}
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </PopoverContent>
          </Popover>
        </li>
      ))}
    </ul>
  );
};

export default MissionList;
