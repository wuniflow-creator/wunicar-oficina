"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Resumo = { carrosHoje: number; emExecucao: number; recebidoMes: number; aReceber: number; despesas: number };

export default function Painel() {
  const [resumo, setResumo] = useState<Resumo | null>(null);

  useEffect(() => {
    async function carregar() {
      const hoje = new Date().toISOString().slice(0, 10);
      const { count: carrosHoje } = await supabase.from("agenda").select("*", { count: "exact", head: true }).eq("data", hoje);
      const { count: emExecucao } = await supabase.from("ordens_servico").select("*", { count: "exact", head: true }).eq("status", "em_andamento");
      const { data: despesasRows } = await supabase.from("despesas").select("valor");
      const despesas = (despesasRows ?? []).reduce((s, d) => s + Number(d.valor), 0);
      setResumo({ carrosHoje: carrosHoje ?? 0, emExecucao: emExecucao ?? 0, recebidoMes: 0, aReceber: 0, despesas });
    }
    carregar();
  }, []);

  const cards = [
    { label: "Carros hoje", valor: resumo?.carrosHoje ?? "—" },
    { label: "Em execução", valor: resumo?.emExecucao ?? "—" },
    { label: "Recebido no mês", valor: `R$ ${resumo?.recebidoMes ?? 0}` },
    { label: "A receber", valor: `R$ ${resumo?.aReceber ?? 0}` },
    { label: "Despesas", valor: `R$ ${resumo?.despesas ?? 0}` },
  ];

  return <div><h2 className="text-xl font-semibold mb-4">Painel da oficina</h2><div className="grid grid-cols-2 md:grid-cols-3 gap-4">{cards.map((c) => <div key={c.label} className="bg-white/5 rounded-lg p-4 border border-white/10"><p className="text-xs text-white/50">{c.label}</p><p className="text-2xl font-bold mt-1">{c.valor}</p></div>)}</div></div>;
}
