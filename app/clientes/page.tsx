"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Cliente = { id: string; nome: string; telefone: string | null; email: string | null };

export default function Clientes() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");

  async function carregar() {
    const { data } = await supabase.from("clientes").select("*").order("created_at", { ascending: false });
    setClientes(data ?? []);
  }
  useEffect(() => { carregar(); }, []);

  async function salvar() {
    if (!nome) return;
    await supabase.from("clientes").insert({ nome, telefone });
    setNome(""); setTelefone(""); carregar();
  }

  return <div><h2 className="text-xl font-semibold mb-4">Clientes</h2><div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6 flex gap-2 flex-wrap"><input className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm flex-1 min-w-[180px]" placeholder="Nome do cliente" value={nome} onChange={(e) => setNome(e.target.value)} /><input className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm flex-1 min-w-[180px]" placeholder="Telefone / WhatsApp" value={telefone} onChange={(e) => setTelefone(e.target.value)} /><button onClick={salvar} className="bg-primary rounded px-4 py-2 text-sm font-medium">Salvar</button></div><div className="space-y-2">{clientes.map((c) => <div key={c.id} className="bg-white/5 border border-white/10 rounded-lg p-3 flex justify-between"><span>{c.nome}</span><span className="text-white/50 text-sm">{c.telefone}</span></div>)}</div></div>;
}
