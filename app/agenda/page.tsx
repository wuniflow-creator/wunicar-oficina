"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Item = { id: string; data: string; horario: string; status: string };

export default function Agenda() {
  const [itens, setItens] = useState<Item[]>([]);
  useEffect(() => { supabase.from("agenda").select("*").order("data").order("horario").then(({ data }) => setItens(data ?? [])); }, []);
  return <div><h2 className="text-xl font-semibold mb-4">Agenda de atendimentos</h2><table className="w-full text-sm border-collapse"><thead><tr className="text-left text-white/50 border-b border-white/10"><th className="py-2">Data</th><th>Horário</th><th>Status</th></tr></thead><tbody>{itens.map((i) => <tr key={i.id} className="border-b border-white/5"><td className="py-2">{i.data}</td><td>{i.horario}</td><td>{i.status}</td></tr>)}{itens.length === 0 && <tr><td colSpan={3} className="py-6 text-center text-white/30">Nenhum agendamento ainda</td></tr>}</tbody></table></div>;
}
