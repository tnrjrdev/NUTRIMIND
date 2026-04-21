export function AdminDashboardPage() {
  return (
    <div>
      <h3 className="text-2xl font-semibold text-gray-800 mb-6">Visão Geral</h3>
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-slate-100 p-8 flex flex-col items-center justify-center min-h-[400px]">
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#fbf2d5] text-emerald-500 shadow-inner">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h4 className="text-xl font-medium text-slate-800 mb-2">Seja bem-vinda ao seu painel Nutrimind!</h4>
        <p className="text-base text-slate-500 max-w-md mx-auto text-center leading-relaxed">
          Utilize o menu de navegação à esquerda para cadastrar, editar e gerenciar todos os módulos, categorias e conteúdos que serão exibidos no seu aplicativo.
        </p>
      </div>
    </div>
  );
}
