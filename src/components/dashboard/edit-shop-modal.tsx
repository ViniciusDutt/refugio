"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PencilRuler } from "lucide-react";
import { AdminShopItem } from "@/types/types";
import { editShopItem } from "@/lib/actions/admin/shop-actions";
import { toast } from "sonner";
import { useAdminStore } from "@/store/use-admin-store";

interface Props {
  item: AdminShopItem;
}

export const EditShopModal = ({ item }: Props) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(item.name);
  const [cost, setCost] = useState(item.cost);
  const [description, setDescription] = useState(item.description || "");
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const res = await editShopItem(item.id, {
      name,
      cost,
      description,
    });
    setLoading(false);

    toast[res.success ? "success" : "error"](res.message);

    if (res.success) {
      useAdminStore.setState((state) => ({
        shop: state.shop.map((s) =>
          s.id === item.id ? { ...s, name, cost, description } : s
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
          <DialogTitle>Editar item</DialogTitle>
          <DialogDescription>
            Altere as informações do item abaixo.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nome"
          />
          <Input
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            type="number"
            placeholder="Custo"
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descrição"
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSave} disabled={loading}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
