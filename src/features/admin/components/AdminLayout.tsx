import { NavLink, Outlet, useNavigate } from 'react-router-dom';

export function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const navLinks = [
    { to: '/admin/dashboard', label: 'Dashboard' },
    { to: '/admin/usuarios', label: 'Usuários' },
    { to: '/admin/receitas', label: 'Receitas' },
    { to: '/admin/produtos', label: 'Produtos' },
    { to: '/admin/fornecedores', label: 'Fornecedores' },
    { to: '/admin/ifood', label: 'Sugestões iFood' },
    { to: '/admin/chas', label: 'Chás' },
    { to: '/admin/substituicoes', label: 'Lista de Substituição' },
    { to: '/admin/bem-estar', label: 'Bem-Estar' },
    { to: '/admin/dicas', label: 'Dicas' },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-slate-900 flex flex-col text-white">
        <div className="flex flex-col items-center justify-center p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold tracking-[0.2em] text-emerald-500">NUTRIMIND</h1>
          <span className="text-[0.65rem] text-slate-400 mt-1 uppercase tracking-widest">Painel Admin</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `block px-4 py-2 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-emerald-500 text-white font-medium shadow-md shadow-emerald-900/20' : 'text-slate-300 hover:bg-slate-800'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-slate-800 hover:text-red-300 rounded-lg transition-colors"
          >
            Sair do Sistema
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-slate-200 flex justify-between items-center px-8 py-4">
          <h2 className="text-lg font-semibold text-gray-800">Gerenciamento</h2>
          <a href="/" target="_blank" rel="noreferrer" className="text-sm font-medium text-emerald-500 hover:underline">Ver Site (Nova Aba)</a>
        </header>

        <div className="flex-1 overflow-auto p-8 bg-slate-50">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
