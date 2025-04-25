"use client";

import { useState, useTransition } from "react";
import { loginAdmin } from "@/lib/actions/admin/admin-login";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const [errorMsg, setErrorMsg] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (formData: FormData) => {
    setErrorMsg("");
    startTransition(async () => {
      const res = await loginAdmin(formData);
      if (res?.error) setErrorMsg(res.error);
    });
  };

  return (
    <main className="font-[Roboto] min-h-screen flex items-center justify-center bg-zinc-900 px-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-xl space-y-6">
        <h1 className="text-2xl font-bold text-center">
          Painel Administrativo
        </h1>

        <form action={handleSubmit} className="space-y-4">
          <Input name="email" type="email" placeholder="E-mail" required />
          <Input name="password" type="password" placeholder="Senha" required />

          {errorMsg && (
            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Entrando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </main>
  );
}
