"use client";

const categorias = [
  { nome: "Motor", itens: ["Óleo do motor", "Filtro de óleo", "Filtro de ar", "Correias"] },
  { nome: "Freios", itens: ["Pastilhas", "Discos", "Fluido de freio", "Mangueiras"] },
  { nome: "Elétrico", itens: ["Bateria", "Faróis", "Painel", "Fiação"] },
  { nome: "Pneus e rodas", itens: ["Calibragem", "Alinhamento", "Balanceamento", "Desgaste"] },
  { nome: "Fluidos", itens: ["Arrefecimento", "Direção hidráulica", "Câmbio"] },
];

export default function Checklist() {
  return <div><h2 className="text-xl font-semibold mb-4">Checklist de execução do serviço</h2><div className="grid md:grid-cols-2 gap-4">{categorias.map((cat) => <div key={cat.nome} className="bg-white/5 border border-white/10 rounded-lg p-4"><h3 className="font-medium mb-2">{cat.nome}</h3><div className="space-y-1">{cat.itens.map((item) => <label key={item} className="flex items-center gap-2 text-sm text-white/80"><input type="checkbox" className="accent-primary" />{item}</label>)}</div></div>)}</div><p className="text-xs text-white/30 mt-4">Checklist visual — para persistir marcações, ligue à tabela checklist_itens.</p></div>;
}
