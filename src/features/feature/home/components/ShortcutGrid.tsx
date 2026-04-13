import type { MenuShortcut } from "../types/home.types";
import { ShortcutItem } from "./ShortcutItem";

type ShortcutGridProps = {
  items: MenuShortcut[];
};

export function ShortcutGrid({ items }: ShortcutGridProps) {
  return (
    <section className="rounded-[32px] bg-[#f7f4ec] p-5 shadow-[0_14px_40px_rgba(41,55,93,0.05)] ring-1 ring-slate-200 sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#977d1d]">Atalhos</p>
          <p className="mt-1 text-sm text-[#5f636c]">Acesse suas funções mais usadas rapidamente.</p>
        </div>
        <span className="rounded-full bg-[#e4d8ab] px-3 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-[#6e5516]">
          {items.length} itens
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <ShortcutItem key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}