"use client";

import {
  EllipsisVertical,
  Eye,
  EyeOff,
  Trash2,
  Play,
  Pause,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "../ui/button";
import { useAdminStore } from "@/store/use-admin-store";
import { useRedeemedAudiosStore } from "@/store/use-redeemed-audios-store";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import {
  toggleAudioStatus,
  deleteAudio,
  addAudio,
} from "@/lib/actions/admin/audio-actions";
import { toast } from "sonner";
import { EditAudioModal } from "./edit-audio-modal";
import { AdminAudio, AdminShopItem } from "@/types/types";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface AudioListProps {
  section: "ativas" | "concluidas" | "nova";
}

const AudioList = ({ section }: AudioListProps) => {
  const audios = useAdminStore((s) => s.audios);
  const redeemedAudios = useRedeemedAudiosStore((s) => s.redeemedAudios);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [cost, setCost] = useState<number>(0);
  const [category, setCategory] = useState("");

  const redeemedAudioIds = redeemedAudios.map((a) => a.id);

  const filtered =
    section === "concluidas"
      ? audios.filter((audio) => redeemedAudioIds.includes(audio.id))
      : section === "ativas"
      ? audios.filter((audio) => !redeemedAudioIds.includes(audio.id))
      : [];

  const handlePlay = (audio: AdminAudio) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (playingId === audio.id) {
      setPlayingId(null);
    } else {
      const newAudio = new Audio(
        `https://zsgevfhnkqpyzzpunduf.supabase.co/storage/v1/object/public/audios/${audio.file_path}`
      );
      audioRef.current = newAudio;
      audioRef.current.play();
      setPlayingId(audio.id);
      newAudio.onended = () => setPlayingId(null);
    }
  };

  const toggleAndUpdate = async (id: number, current: boolean) => {
    const res = await toggleAudioStatus(id, !current);
    toast(res.message);

    if (res.success) {
      useAdminStore.setState((state) => ({
        audios: state.audios.map((audio) =>
          audio.id === id ? { ...audio, available: !current } : audio
        ),
      }));
    }
  };

  const handleDelete = async (id: number, filePath: string) => {
    const res = await deleteAudio(id, filePath);
    if (res.success) {
      toast.success("Áudio excluído com sucesso!");
      useAdminStore.setState((state) => ({
        audios: state.audios.filter((a) => a.id !== id),
      }));
    } else {
      toast.error(res.message);
    }
  };

  if (section === "nova") {
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!file || !title) {
        toast.error("Preencha o título e selecione um arquivo.");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("file", file);
      formData.append("category", category);
      formData.append("cost", cost.toString());

      const res = await addAudio(formData);

      if (!res.success) {
        toast.error(res.message);
        return;
      }

      if (res.audio && res.shop) {
        useAdminStore.setState((state) => ({
          audios: [...state.audios, res.audio as AdminAudio],
          shop: [...state.shop, res.shop as AdminShopItem],
        }));
        toast.success("Áudio adicionado com sucesso!");
      }

      setTitle("");
      setCost(0);
      setFile(null);
      setCategory("");
    };

    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Título do áudio"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <Input
          type="file"
          accept="audio/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          className="w-full border rounded px-3 py-2"
        />

        <Select value={category} onValueChange={(value) => setCategory(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="comedia" className="font-[Roboto]">
              Comédia
            </SelectItem>
            <SelectItem value="romantico" className="font-[Roboto]">
              Romântico
            </SelectItem>
            <SelectItem value="musica" className="font-[Roboto]">
              Música
            </SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Custo"
          value={cost}
          onChange={(e) => setCost(Number(e.target.value))}
          className="w-full border rounded px-3 py-2"
        />

        <Button
          type="submit"
          className="cursor-pointer bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          Adicionar Áudio
        </Button>
      </form>
    );
  }

  return (
    <ul className="space-y-2">
      {filtered.map((audio) => (
        <li
          key={audio.id}
          className="py-2 border-b flex justify-between items-center"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => handlePlay(audio)}
              className="cursor-pointer text-muted-foreground hover:text-primary transition"
            >
              {playingId === audio.id ? (
                <Pause fill="currentColor" className="w-5 h-5" />
              ) : (
                <Play fill="currentColor" className="w-5 h-5" />
              )}
            </button>

            <div
              className={cn(
                "flex items-center gap-4",
                audio.available === false && "opacity-50 italic"
              )}
            >
              <span>{audio.title}</span>
              {audio.available === false && (
                <span className="text-xs text-destructive font-semibold">
                  Desativado
                </span>
              )}
            </div>
          </div>

          <Popover>
            <PopoverTrigger>
              <EllipsisVertical className="cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-2 w-full items-baseline font-[Roboto]">
              <EditAudioModal audio={audio} />

              <Button
                variant="ghost"
                className="w-full flex justify-start"
                onClick={() => toggleAndUpdate(audio.id, audio.available)}
              >
                {audio.available ? (
                  <>
                    <EyeOff className="mr-2 w-4 h-4" />
                    Desativar
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 w-4 h-4" />
                    Ativar
                  </>
                )}
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full flex justify-start text-destructive hover:text-destructive"
                  >
                    <Trash2 className="mr-2 w-4 h-4" /> Excluir
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Tem certeza que deseja excluir?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não poderá ser desfeita. O áudio será
                      permanentemente excluído do sistema.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-transparent">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(audio.id, audio.file_path)}
                      className="bg-destructive text-white hover:bg-destructive/90"
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

export default AudioList;
