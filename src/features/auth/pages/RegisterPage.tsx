import { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export function RegisterPage() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('As senhas precisam ser iguais.');
      return;
    }

    setLoading(true);

    try {
      await axios.post('http://localhost:3001/api/usuarios/registro', {
        nome,
        email,
        senha: password,
      });
      setSuccess('Cadastro realizado com sucesso.');
      setNome('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setShowPassword(false);
      setLoading(false);
    } catch (requestError: unknown) {
      if (axios.isAxiosError(requestError)) {
        setError(requestError.response?.data?.message || 'Não foi possível concluir o cadastro.');
      } else {
        setError('Não foi possível concluir o cadastro.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef] flex items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-[1320px] overflow-hidden rounded-[44px] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.14)] md:grid-cols-[1fr_1fr]">
        <div className="flex items-center justify-center px-6 py-10 sm:px-12 sm:py-14">
          <div className="w-full max-w-[320px]">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#b78b03]/25 bg-[#fbf2d5] text-emerald-500 shadow-sm">
                <svg viewBox="0 0 64 64" className="h-6 w-6" fill="currentColor">
                  <path d="M32 4c-8.3 0-15 6.7-15 15 0 2 .4 4 1.1 5.8C13.8 25.7 10 31.4 10 37.8c0 9.4 7.6 17 17 17 1.9 0 3.8-.3 5.5-.8 1.5 1 3.4 1.6 5.4 1.6 5.9 0 10.8-3.8 12.6-9.1 1.6-4.6 1.2-9.7-1-14.1C55.3 29 60 23 60 16 60 8.1 51.9 4 44 4c-3.9 0-7.7 1.6-10.4 4.4C31.7 5.6 33.8 4 32 4z" />
                </svg>
              </div>
              <h1 className="text-[2.1rem] font-light tracking-[0.22em] text-emerald-500">nutrimind</h1>
              <p className="mt-3 text-sm text-slate-500">Crie sua conta para acessar o painel.</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-3">
              <div className="rounded-[24px] border border-slate-200 bg-slate-100 px-4 py-1 shadow-sm">
                <label className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">Nome</label>
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} className="w-full border-none bg-transparent py-0.5 text-sm leading-5 text-slate-900 outline-none" required />
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-100 px-4 py-1 shadow-sm">
                <label className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full border-none bg-transparent py-0.5 text-sm leading-5 text-slate-900 outline-none" required />
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-100 px-4 py-1 shadow-sm">
                <label className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">Senha</label>
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full border-none bg-transparent py-0.5 text-sm leading-5 text-slate-900 outline-none" required />
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-100 px-4 py-1 shadow-sm">
                <label className="mb-1 block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">Confirmar senha</label>
                <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full border-none bg-transparent py-0.5 text-sm leading-5 text-slate-900 outline-none" required />
              </div>

              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={showPassword} onChange={(e) => setShowPassword(e.target.checked)} />
                Mostrar senha
              </label>

              {error && <p className="text-sm text-red-500">{error}</p>}
              {success && <p className="text-sm text-green-600">{success}</p>}

              <button type="submit" disabled={loading} className="mt-3 w-full rounded-[18px] bg-[#b78b03] px-5 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_25px_rgba(183,139,3,0.25)] transition hover:bg-[#9a6c02] disabled:opacity-50">
                {loading ? 'Cadastrando...' : 'Criar conta'}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-slate-500">
              Já tem conta?{' '}
              <Link to="/login" className="font-semibold text-emerald-500 hover:underline">
                Entrar
              </Link>
            </p>
          </div>
        </div>

        <div className="relative hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80"
            alt="Alimentos saudáveis e nutrição"
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
