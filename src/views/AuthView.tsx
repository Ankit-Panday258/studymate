import React, { useState } from 'react';
import { ArrowLeft, GraduationCap, LoaderCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { authConfigured } from '../services/appwrite';

export const AuthView: React.FC = () => {
  const { login, register, setCurrentPage } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      if (mode === 'register') await register(name.trim(), email.trim(), password);
      else await login(email.trim(), password);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not complete your request. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0f111a] px-5 py-8 text-white flex items-center justify-center">
      <section className="w-full max-w-md">
        <button onClick={() => setCurrentPage('landing')} className="mb-8 inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </button>
        <div className="rounded-3xl border border-slate-700 bg-slate-900/80 p-7 shadow-2xl shadow-purple-950/30 sm:p-9">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-600"><GraduationCap className="h-6 w-6" /></div>
            <div>
              <p className="text-xl font-bold">Study<span className="text-purple-400">Mate</span></p>
              <p className="text-sm text-slate-400">Your study space, ready when you are.</p>
            </div>
          </div>

          <div className="mb-6 grid grid-cols-2 rounded-xl bg-slate-800 p-1 text-sm font-semibold">
            <button type="button" onClick={() => { setMode('login'); setError(''); }} className={`rounded-lg py-2.5 ${mode === 'login' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>Log in</button>
            <button type="button" onClick={() => { setMode('register'); setError(''); }} className={`rounded-lg py-2.5 ${mode === 'register' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'}`}>Create account</button>
          </div>

          {!authConfigured ? (
            <div className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm leading-6 text-amber-100">
              Accounts need an Appwrite project. Add <code className="rounded bg-black/30 px-1">VITE_APPWRITE_ENDPOINT</code> and <code className="rounded bg-black/30 px-1">VITE_APPWRITE_PROJECT_ID</code> to <code className="rounded bg-black/30 px-1">.env.local</code>, then restart the dev server.
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {mode === 'register' && (
                <label className="block space-y-1.5 text-sm font-medium text-slate-200">
                  Name
                  <input autoComplete="name" value={name} onChange={event => setName(event.target.value)} required maxLength={128} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-purple-500" placeholder="Your name" />
                </label>
              )}
              <label className="block space-y-1.5 text-sm font-medium text-slate-200">
                Email
                <input type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} required className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-purple-500" placeholder="you@example.com" />
              </label>
              <label className="block space-y-1.5 text-sm font-medium text-slate-200">
                Password
                <input type="password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} value={password} onChange={event => setPassword(event.target.value)} required minLength={8} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-purple-500" placeholder="At least 8 characters" />
              </label>
              {error && <p role="alert" className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}
              <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-purple-600 px-4 py-3 font-bold text-white transition hover:bg-purple-500 disabled:cursor-wait disabled:opacity-70">
                {busy && <LoaderCircle className="h-4 w-4 animate-spin" />}
                {mode === 'register' ? 'Create account' : 'Log in'}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
};
