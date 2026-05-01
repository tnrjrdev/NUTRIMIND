import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../../services/api';

// ─── Validation helpers ────────────────────────────────────────────────────────

function validateEmail(value: string) {
  if (!value) return 'E-mail é obrigatório.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
    return 'Informe um e-mail válido.';
  return '';
}

function validateName(value: string) {
  if (!value.trim()) return 'Nome é obrigatório.';
  if (value.trim().length < 2) return 'Nome deve ter ao menos 2 caracteres.';
  return '';
}

function validatePassword(value: string) {
  if (!value) return 'Senha é obrigatória.';
  if (value.length < 6) return 'Senha deve ter ao menos 6 caracteres.';
  return '';
}

function validateConfirmPassword(password: string, confirm: string) {
  if (!confirm) return 'Confirme sua senha.';
  if (password !== confirm) return 'As senhas não conferem.';
  return '';
}

// ─── Password strength ─────────────────────────────────────────────────────────

function getPasswordStrength(password: string): {
  level: 0 | 1 | 2 | 3 | 4;
  label: string;
  color: string;
} {
  if (!password) return { level: 0, label: '', color: '' };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

  const levels = [
    { level: 0, label: '', color: '' },
    { level: 1, label: 'Fraca', color: 'bg-red-400' },
    { level: 2, label: 'Regular', color: 'bg-orange-400' },
    { level: 3, label: 'Boa', color: 'bg-yellow-400' },
    { level: 4, label: 'Forte', color: 'bg-emerald-500' },
  ] as const;

  return levels[score] ?? levels[1];
}

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

type FieldProps = {
  id: string;
  label: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  onBlur?: () => void;
  error: string;
  touched: boolean;
  placeholder?: string;
  maxLength?: number;
  autoComplete?: string;
  endAdornment?: React.ReactNode;
};

function Field({
  id, label, type = 'text', value, onChange, onBlur, error, touched,
  placeholder, maxLength, autoComplete, endAdornment,
}: FieldProps) {
  const hasError = touched && !!error;
  const isValid = touched && !error && value.length > 0;

  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-slate-500"
      >
        {label}
      </label>
      <div
        className={`relative flex items-center rounded-[20px] border px-4 py-2 shadow-sm transition-all duration-200 ${
          hasError
            ? 'border-red-300 bg-red-50 ring-2 ring-red-100'
            : isValid
            ? 'border-emerald-300 bg-white ring-2 ring-emerald-100'
            : 'border-slate-200 bg-slate-100 focus-within:border-emerald-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100'
        }`}
      >
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          autoComplete={autoComplete}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${id}-error` : undefined}
          className="w-full flex-1 border-none bg-transparent py-0.5 pr-2 text-sm leading-5 text-slate-900 outline-none placeholder:text-slate-400"
          required
        />
        {endAdornment && <span className="ml-1 shrink-0">{endAdornment}</span>}
        {!endAdornment && isValid && (
          <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
      {hasError && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
          <svg viewBox="0 0 24 24" className="h-3 w-3 shrink-0" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Main component ────────────────────────────────────────────────────────────

export function RegisterPage() {
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [touched, setTouched] = useState({
    nome: false,
    email: false,
    password: false,
    confirmPassword: false,
  });

  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const errors = {
    nome: validateName(nome),
    email: validateEmail(email),
    password: validatePassword(password),
    confirmPassword: validateConfirmPassword(password, confirmPassword),
  };

  const passwordStrength = getPasswordStrength(password);
  const isFormValid = Object.values(errors).every((e) => !e);

  const touch = useCallback((field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTouched({ nome: true, email: true, password: true, confirmPassword: true });
    setApiError('');

    if (!isFormValid) return;

    setLoading(true);
    try {
      await api.post('/usuarios/registro', {
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        senha: password,
      });
      setSuccess(true);
    } catch (err: any) {
      if (err.response?.data?.message) {
        setApiError(err.response.data.message);
      } else {
        setApiError('Não foi possível concluir o cadastro.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#f8f5ef] flex items-center justify-center px-4 py-10">
        <div className="w-full max-w-sm rounded-[44px] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.14)] p-10 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Conta criada!</h2>
          <p className="mt-2 text-sm text-slate-500">Seu cadastro foi realizado com sucesso.</p>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="mt-6 w-full rounded-[18px] bg-emerald-500 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_25px_rgba(16,185,129,0.25)] transition hover:bg-emerald-600"
          >
            Entrar agora
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ef] flex items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-[1320px] overflow-hidden rounded-[44px] bg-white shadow-[0_30px_90px_rgba(15,23,42,0.14)] md:grid-cols-[1fr_1fr]">
        {/* Form side */}
        <div className="flex items-center justify-center px-6 py-10 sm:px-12 sm:py-14">
          <div className="w-full max-w-[340px]">
            {/* Logo */}
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full border border-[#b78b03]/25 bg-[#fbf2d5] text-emerald-500 shadow-sm">
                <svg viewBox="0 0 64 64" className="h-6 w-6" fill="currentColor">
                  <path d="M32 4c-8.3 0-15 6.7-15 15 0 2 .4 4 1.1 5.8C13.8 25.7 10 31.4 10 37.8c0 9.4 7.6 17 17 17 1.9 0 3.8-.3 5.5-.8 1.5 1 3.4 1.6 5.4 1.6 5.9 0 10.8-3.8 12.6-9.1 1.6-4.6 1.2-9.7-1-14.1C55.3 29 60 23 60 16 60 8.1 51.9 4 44 4c-3.9 0-7.7 1.6-10.4 4.4C31.7 5.6 33.8 4 32 4z" />
                </svg>
              </div>
              <h1 className="text-[2.1rem] font-light tracking-[0.22em] text-emerald-500">nutrimind</h1>
              <p className="mt-1 text-[0.65rem] uppercase tracking-[0.3em] text-slate-500">por TINA HARTMANN</p>
              <p className="mt-2 text-sm text-slate-500">Crie sua conta para acessar o painel.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3" noValidate>
              <Field
                id="register-nome"
                label="Nome completo"
                value={nome}
                onChange={setNome}
                onBlur={() => touch('nome')}
                error={errors.nome}
                touched={touched.nome}
                placeholder="Seu nome"
                autoComplete="name"
              />
              <Field
                id="register-email"
                label="E-mail"
                type="email"
                value={email}
                onChange={setEmail}
                onBlur={() => touch('email')}
                error={errors.email}
                touched={touched.email}
                placeholder="seu@email.com"
                autoComplete="email"
              />
              <Field
                id="register-password"
                label="Senha"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={setPassword}
                onBlur={() => touch('password')}
                error={errors.password}
                touched={touched.password}
                placeholder="Mínimo 6 caracteres"
                autoComplete="new-password"
                endAdornment={
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-600 transition hover:bg-slate-50"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                }
              />

              {/* Strength meter */}
              {password.length > 0 && (
                <div className="px-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= passwordStrength.level ? passwordStrength.color : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                  {passwordStrength.label && (
                    <p className="mt-1 text-[11px] text-slate-400">
                      Força da senha:{' '}
                      <span
                        className={`font-semibold ${
                          passwordStrength.level <= 1
                            ? 'text-red-500'
                            : passwordStrength.level === 2
                            ? 'text-orange-500'
                            : passwordStrength.level === 3
                            ? 'text-yellow-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {passwordStrength.label}
                      </span>
                    </p>
                  )}
                </div>
              )}

              <Field
                id="register-confirm-password"
                label="Confirmar senha"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={setConfirmPassword}
                onBlur={() => touch('confirmPassword')}
                error={errors.confirmPassword}
                touched={touched.confirmPassword}
                placeholder="Repita a senha"
                autoComplete="new-password"
              />

              {/* API error */}
              {apiError && (
                <div role="alert" className="flex items-start gap-2 rounded-[16px] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                  <svg viewBox="0 0 24 24" className="mt-0.5 h-4 w-4 shrink-0" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                  </svg>
                  {apiError}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-[18px] bg-emerald-500 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.12em] text-white shadow-[0_12px_25px_rgba(16,185,129,0.25)] transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    Criando conta...
                  </>
                ) : (
                  'Criar conta'
                )}
              </button>
            </form>

            <p className="mt-5 text-center text-sm text-slate-500">
              Já tem conta?{' '}
              <Link to="/login" className="font-semibold text-emerald-500 hover:underline">
                Entrar
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
              "Cuide da sua saúde com inteligência e dados que fazem sentido."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
