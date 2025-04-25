"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { PencilRuler } from "lucide-react";
import { useState } from "react";
import { editAudio } from "@/lib/actions/admin/audio-actions";
import { toast } from "sonner";
import { useAdminStore } from "@/store/use-admin-store";

interface EditAudioModalProps {
  audio: {
    id: number;
    title: string;
    file_path: string;
  };
}

export const EditAudioModal = ({ audio }: EditAudioModalProps) => {
  const [title, setTitle] = useState(audio.title);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const audios = useAdminStore((s) => s.audios);
  const setAudios = useAdminStore((s) => s.setAudios);

  const handleSave = async () => {
    setLoading(true);
    const res = await editAudio(audio.id, { title });

    if (res.success) {
      toast.success(res.message);
      setAudios(audios.map((a) => (a.id === audio.id ? { ...a, title } : a)));
    } else {
      toast.error(res.message);
    }

    setLoading(false);
    setOpen(false);
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
          <DialogTitle>Editar Áudio</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-semibold block mb-1">Título</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-semibold block mb-1">
              Caminho do arquivo
            </label>
            <Input disabled value={audio.file_path} />
          </div>
        </div>
        <DialogFooter className="mt-4">
          <DialogClose asChild>
            <Button variant="ghost">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleSave} disabled={loading}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
