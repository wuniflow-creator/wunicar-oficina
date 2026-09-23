"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Despesa = { id: string; descricao: string; categoria: string; valor: number; data: string };

export default function Financeiro() {
  const [despesas, setDespesas] = useState<Despesa[]>([]);
  const [descricao, setDescricao] = useState("");
  const [valor, setValor] = useState("");
  async function carregar() { const { data } = await supabase.from("despesas").select("*").order("data", { ascending: false }); setDespesas(data ?? []); }
  useEffect(() => { carregar(); }, []);
  async function salvar() { if (!descricao || !valor) return; await supabase.from("despesas").insert({ descricao, valor: Number(valor) }); setDescricao(""); setValor(""); carregar(); }
  const total = despesas.reduce((s, d) => s + Number(d.valor), 0);
  return <div><h2 className="text-xl font-semibold mb-4">Financeiro</h2><div className="bg-white/5 border border-white/10 rounded-lg p-4 mb-6 flex gap-2 flex-wrap"><input className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm flex-1 min-w-[180px]" placeholder="Descrição da despesa" value={descricao} onChange={(e) => setDescricao(e.target.value)} /><input className="bg-black/40 border border-white/10 rounded px-3 py-2 text-sm w-32" placeholder="Valor" value={valor} onChange={(e) => setValor(e.target.value)} /><button onClick={salvar} className="bg-primary rounded px-4 py-2 text-sm font-medium">Salvar</button></div><p className="mb-3 text-sm text-white/60">Total de despesas: <span className="text-white font-semibold">R$ {total.toFixed(2)}</span></p><div className="space-y-2">{despesas.map((d) => <div key={d.id} className="bg-white/5 border border-white/10 rounded-lg p-3 flex justify-between text-sm"><span>{d.descricao}</span><span className="text-white/50">R$ {Number(d.valor).toFixed(2)}</span></div>)}</div></div>;
}
