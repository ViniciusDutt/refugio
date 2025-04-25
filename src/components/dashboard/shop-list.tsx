"use client";

import { EllipsisVertical, Eye, EyeOff, Trash2 } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { Button } from "@/components/ui/button";
import { useAdminStore } from "@/store/use-admin-store";
import { toast } from "sonner";
import {
  addShopItem,
  deleteShopItem,
  toggleShopItemStatus,
} from "@/lib/actions/admin/shop-actions";
import { EditShopModal } from "./edit-shop-modal";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useRedeemedStore } from "@/store/use-redeemed-store";

interface ShopListProps {
  section: "ativas" | "concluidas" | "nova";
}

const ShopList = ({ section }: ShopListProps) => {
  const items = useAdminStore((s) => s.shop);
  const redeemedItems = useRedeemedStore((s) => s.redeemedItems);
  const [name, setName] = useState("");
  const [cost, setCost] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [category, setCategory] = useState("");

  const filtered = items.filter((item) => {
    const isAudio = item.category === "audios";
    if (isAudio) return false;

    const wasRedeemed = redeemedItems.includes(item.id);

    if (section === "concluidas") return wasRedeemed;
    if (section === "ativas") return !wasRedeemed;
    return false;
  });

  const handleToggle = async (id: number, current: boolean) => {
    const res = await toggleShopItemStatus(id, current);
    toast[res.success ? "success" : "error"](res.message);

    if (res.success) {
      useAdminStore.setState((state) => ({
        shop: state.shop.map((item) =>
          item.id === id ? { ...item, available: !current } : item
        ),
      }));
    }
  };

  const handleDelete = async (id: number) => {
    const res = await deleteShopItem(id);
    toast[res.success ? "success" : "error"](res.message);

    if (res.success) {
      useAdminStore.setState((state) => ({
        shop: state.shop.filter((item) => item.id !== id),
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || isNaN(cost) || !imageUrl) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    const res = await addShopItem({
      name,
      cost,
      description,
      image_url: imageUrl,
      category: category,
    });

    toast[res.success ? "success" : "error"](res.message);

    if (res.success && res.item) {
      useAdminStore.setState((state) => ({
        shop: [res.item, ...state.shop],
      }));

      setName("");
      setCost(0);
      setDescription("");
      setImageUrl("");
      setCategory("");
    }
  };

  if (section === "nova") {
    return (
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Nome do item"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-9/12 border rounded px-3 py-2"
          />
          <Input
            type="number"
            placeholder="Custo"
            value={cost}
            onChange={(e) => setCost(Number(e.target.value))}
            className="w-3/12 border rounded px-3 py-2"
          />
        </div>

        <Input
          type="text"
          placeholder="URL da imagem"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />

        <Select value={category} onValueChange={(value) => setCategory(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="presentes" className="font-[Roboto]">
              Presentes
            </SelectItem>
            <SelectItem value="outros" className="font-[Roboto]">
              Outros
            </SelectItem>
          </SelectContent>
        </Select>

        <Textarea
          placeholder="Descrição"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-2 resize-none"
        />

        <Button
          type="submit"
          className="cursor-pointer bg-primary text-white px-4 py-2 rounded hover:bg-primary/90"
        >
          Adicionar Item
        </Button>
      </form>
    );
  }

  return (
    <ul className="space-y-2">
      {filtered.map((item) => (
        <li
          key={item.id}
          className="py-2 border-b flex justify-between items-center"
        >
          <span className={item.available === false ? "opacity-50 italic" : ""}>
            {item.name}
            {item.available === false && (
              <span className="text-destructive text-sm ml-2">Desativado</span>
            )}
          </span>
          <Popover>
            <PopoverTrigger>
              <EllipsisVertical className="cursor-pointer" />
            </PopoverTrigger>
            <PopoverContent className="flex flex-col gap-2 w-full items-baseline font-[Roboto]">
              <EditShopModal item={item} />
              <Button
                variant="ghost"
                className="w-full flex justify-start"
                onClick={() => handleToggle(item.id, item.available)}
              >
                {item.available ? (
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
                      Deseja mesmo excluir este item?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não poderá ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-transparent">
                      Cancelar
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-destructive text-white hover:bg-destructive/90"
                      onClick={() => handleDelete(item.id)}
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

export default ShopList;
