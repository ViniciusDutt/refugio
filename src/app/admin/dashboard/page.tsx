"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MissionList from "@/components/dashboard/mission-list";
import ShopList from "@/components/dashboard/shop-list";
import AudioList from "@/components/dashboard/audio-list";
import { logoutAdmin } from "@/lib/actions/admin/admin-login";

export default function AdminDashboard() {
  const [missoesSection, setMissoesSection] = useState<
    "ativas" | "concluidas" | "nova"
  >("ativas");
  const [lojaSection, setLojaSection] = useState<
    "ativas" | "concluidas" | "nova"
  >("ativas");
  const [audiosSection, setAudiosSection] = useState<
    "ativas" | "concluidas" | "nova"
  >("ativas");

  return (
    <main
      className={`font-[Roboto] min-h-screen bg-[#f5f5f5] py-10 px-6 md:px-12`}
    >
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-zinc-800">
            Dashboard do Admin
          </h1>
          <Button onClick={logoutAdmin} variant="ghost">
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </Button>
        </div>

        <Tabs defaultValue="missoes" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="missoes">🎯</TabsTrigger>
            <TabsTrigger value="loja">🛒</TabsTrigger>
            <TabsTrigger value="audios">🔊</TabsTrigger>
          </TabsList>

          <TabsContent value="missoes">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Missões</CardTitle>
                <Select
                  value={missoesSection}
                  onValueChange={(value) =>
                    setMissoesSection(value as "ativas" | "concluidas" | "nova")
                  }
                >
                  <SelectTrigger className={`font-[Roboto] w-[192px]`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativas" className="font-[Roboto]">
                      Ativas
                    </SelectItem>
                    <SelectItem value="concluidas" className="font-[Roboto]">
                      Concluídas
                    </SelectItem>
                    <SelectItem value="nova" className="font-[Roboto]">
                      Criar nova
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <MissionList section={missoesSection} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loja">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Loja</CardTitle>
                <Select
                  value={lojaSection}
                  onValueChange={(value) =>
                    setLojaSection(value as "ativas" | "concluidas" | "nova")
                  }
                >
                  <SelectTrigger className="w-[192px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativas" className="font-[Roboto]">
                      Itens disponíveis
                    </SelectItem>
                    <SelectItem value="concluidas" className="font-[Roboto]">
                      Itens resgatados
                    </SelectItem>
                    <SelectItem value="nova" className="font-[Roboto]">
                      Adicionar item
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <ShopList section={lojaSection} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="audios">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle>Áudios</CardTitle>
                <Select
                  value={audiosSection}
                  onValueChange={(value) =>
                    setAudiosSection(value as "ativas" | "concluidas" | "nova")
                  }
                >
                  <SelectTrigger className="w-[192px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ativas" className="font-[Roboto]">
                      Disponíveis
                    </SelectItem>
                    <SelectItem value="concluidas" className="font-[Roboto]">
                      Resgatados
                    </SelectItem>
                    <SelectItem value="nova" className="font-[Roboto]">
                      Adicionar áudio
                    </SelectItem>
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <AudioList section={audiosSection} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
