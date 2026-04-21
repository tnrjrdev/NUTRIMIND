export function AppFooter() {
  return (
    <footer className="mt-auto pt-6">
      <div className="rounded-[24px] border border-slate-200 bg-white px-5 py-4 shadow-md shadow-slate-200/30">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-serif text-xl uppercase tracking-[0.04em] text-[#b08f13]">nutrimind</p>
          <p className="text-xs uppercase tracking-[0.2em] text-[#8f7d40]">por Tina Hartmann</p>
        </div>
        <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8b6c08]">
          <span className="rounded-full bg-emerald-100 px-3 py-2">Fluxo protegido</span>
          <span className="rounded-full bg-emerald-100 px-3 py-2">Navegacao unificada</span>
        </div>
      </div>
      </div>
    </footer>
  );
}
