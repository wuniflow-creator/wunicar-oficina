import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "WuniCard Oficina",
  description: "Gestão inteligente para oficinas mecânicas",
};

const nav = [
  { href: "/", label: "Painel" },
  { href: "/clientes", label: "Clientes" },
  { href: "/agenda", label: "Agenda" },
  { href: "/checklist", label: "Checklist" },
  { href: "/financeiro", label: "Financeiro" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="min-h-screen flex">
          <aside className="w-56 border-r border-white/10 p-4 flex flex-col gap-2">
            <h1 className="text-lg font-bold text-primary mb-4">WuniCard Oficina</h1>
            {nav.map((n) => (
              <Link key={n.href} href={n.href} className="px-3 py-2 rounded hover:bg-white/10 text-sm">
                {n.label}
              </Link>
            ))}
          </aside>
          <main className="flex-1 p-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
