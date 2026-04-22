import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { setAuthSession } from '../utils/session';

// ─── Sub-components ────────────────────────────────────────────────────────────

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12.5C3.7 8.2 7.7 5.2 12 5.2c4.3 0 8.3 3 10 7.3" />
      <path d="M22 12.5c-1.7 4.3-5.7 7.3-10 7.3-4.3 0-8.3-3-10-7.3" />
      <path d="M1 1l22 22" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1.5 12.5C3.2 8.3 7.2 5.3 12 5.3c4.8 0 8.8 3 10.5 7.2" />
      <path d="M22.5 12.5c-1.7 4.2-5.7 7.2-10.5 7.2-4.8 0-8.8-3-10.5-7.2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

type FieldState = 'idle' | 'focused' | 'error';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  const navigate = useNavigate();

  const emailError =
    emailTouched && !email
      ? 'E-mail é obrigatório.'
      : emailTouched && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? 'Informe um e-mail válido.'
      : '';

  const passwordError =
    passwordTouched && !password ? 'Senha é obrigatória.' : '';

  function getFieldState(hasError: boolean, touched: boolean, value: string): FieldState {
    if (hasError) return 'error';
    if (touched && value) return 'focused';
    return 'idle';
  }

  const emailState = getFieldState(!!emailError, emailTouched, email);
  const passwordState = getFieldState(!!passwordError, passwordTouched, password);

  function fieldClasses(state: FieldState) {
    return `relative rounded-[24px] border px-4 py-1.5 shadow-sm transition-all duration-200 ${
      state === 'error'
        ? 'border-red-300 bg-red-50 ring-2 ring-red-100'
        : state === 'focused'
        ? 'border-emerald-300 bg-white ring-2 ring-emerald-100'
        : 'border-slate-200 bg-slate-100 focus-within:border-emerald-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100'
    }`;
  }

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setEmailTouched(true);
    setPasswordTouched(true);

    if (emailError || passwordError || !email || !password) return;

    setError('');
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3001/api/login', {
        username: email.trim().toLowerCase(),
        password,
      });
      setAuthSession(response.data.token, response.data.user);
      navigate('/home');
    } catch (requestError: unknown) {
      if (axios.isAxiosError(requestError)) {
        const status = requestError.response?.status;
        if (status === 401) {
          setError('E-mail ou senha incorretos. Verifique e tente novamente.');
        } else if (status === 403) {
          setError('Sua conta está inativa. Entre em contato com o suporte.');
        } else {
          setError(requestError.response?.data?.message || 'Não foi possível entrar. Tente novamente.');
        }
      } else {
        setError('Erro de conexão. Verifique sua internet e tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f5ef] flex items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-[1320px] overflow-hidden rounded-[44px] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.14)] md:grid-cols-[1.1fr_0.9fr]">
        {/* Form side */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-12 sm:py-14">
          <div className="w-full max-w-[280px]">
            {/* Logo */}
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#b78b03]/25 bg-[#fbf2d5] text-emerald-500 shadow-sm">
                <svg viewBox="0 0 64 64" className="h-6 w-6" fill="currentColor">
                  <path d="M32 4c-8.3 0-15 6.7-15 15 0 2 .4 4 1.1 5.8C13.8 25.7 10 31.4 10 37.8c0 9.4 7.6 17 17 17 1.9 0 3.8-.3 5.5-.8 1.5 1 3.4 1.6 5.4 1.6 5.9 0 10.8-3.8 12.6-9.1 1.6-4.6 1.2-9.7-1-14.1C55.3 29 60 23 60 16 60 8.1 51.9 4 44 4c-3.9 0-7.7 1.6-10.4 4.4C31.7 5.6 33.8 4 32 4z" />
                </svg>
              </div>
              <h1 className="text-[2.1rem] font-light tracking-[0.22em] text-emerald-500">nutrimind</h1>
              <p className="mt-1 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">por TINA HARTMANN</p>
            </div>

            {/* Global API error */}
            {error && (
              <div
                role="alert"
                className="mb-4 flex items-start gap-2 rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 animate-[fadeIn_0.2s_ease]"
              >
                <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                {error}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-3" noValidate>
              {/* Email field */}
              <div>
                <label htmlFor="login-email" className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                  E-mail
                </label>
                <div className={fieldClasses(emailState)}>
                  <input
                    id="login-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => setEmailTouched(true)}
                    placeholder="seu@email.com"
                    autoComplete="email"
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? 'login-email-error' : undefined}
                    className="w-full border-none bg-transparent py-0.5 text-sm leading-5 text-slate-900 outline-none placeholder:text-slate-400"
                    required
                  />
                </div>
                {emailError && (
                  <p id="login-email-error" role="alert" className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                    <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    {emailError}
                  </p>
                )}
              </div>

              {/* Password field */}
              <div>
                <div className="mb-1.5 flex items-center justify-between">
                  <label htmlFor="login-password" className="block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Senha
                  </label>
                </div>
                <div className={fieldClasses(passwordState)}>
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => setPasswordTouched(true)}
                    placeholder="Sua senha"
                    autoComplete="current-password"
                    aria-invalid={!!passwordError}
                    aria-describedby={passwordError ? 'login-password-error' : undefined}
                    className="w-full border-none bg-transparent pr-10 py-0.5 text-sm leading-5 text-slate-900 outline-none placeholder:text-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                </div>
                {passwordError && (
                  <p id="login-password-error" role="alert" className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
                    <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                    {passwordError}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-[18px] bg-emerald-500 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_25px_rgba(16,185,129,0.25)] transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500">
              Não tem conta?{' '}
              <Link to="/cadastro" className="font-semibold text-emerald-500 hover:underline">
                Cadastre-se
              </Link>
            </p>
          </div>
        </div>

        {/* Image side */}
        <div className="relative hidden md:block">
          <img
            src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1200&q=80"
            alt="Alimentos saudáveis e nutrição"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-emerald-900/40 to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <p className="text-lg font-light italic text-white/90">
              "Nutrição inteligente começa com informação organizada."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
