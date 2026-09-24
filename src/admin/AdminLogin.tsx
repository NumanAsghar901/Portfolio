import React, { useState } from 'react';
import { Lock, Mail, ArrowLeft, ShieldCheck, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: () => void;
  onBackToPortfolio: () => void;
}

export default function AdminLogin({ onLoginSuccess, onBackToPortfolio }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const normalizedEmail = email.trim().toLowerCase();
      // Required credentials: numanasghar901@gmail.com and fastiansnu@123
      if (normalizedEmail === 'numanasghar901@gmail.com' && password === 'fastiansnu@123') {
        sessionStorage.setItem('portfolio_admin_auth', 'true');
        localStorage.setItem('portfolio_admin_last_login', new Date().toISOString());
        onLoginSuccess();
      } else {
        setError('Invalid admin credentials. Please verify your email and password.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#090c12] text-zinc-100 flex flex-col justify-center items-center px-4 relative overflow-hidden font-sans selection:bg-yellow-500 selection:text-black">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-yellow-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none" />

      {/* Back button */}
      <button
        onClick={onBackToPortfolio}
        className="absolute top-6 left-6 flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors text-sm font-medium py-2 px-3 rounded-lg hover:bg-zinc-800/50"
      >
        <ArrowLeft size={16} />
        <span>Return to Portfolio</span>
      </button>

      <div className="w-full max-w-md bg-[#111722]/90 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-8 shadow-2xl relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-yellow-500/10 border border-yellow-500/25 flex items-center justify-center text-yellow-400 mb-4 shadow-lg shadow-yellow-500/10">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Admin Authentication</h1>
          <p className="text-zinc-400 text-xs mt-1.5">
            Log in to manage portfolio content, CV upload, and projects
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center space-x-2.5">
            <AlertCircle size={16} className="shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="numanasghar901@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:border-yellow-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full pl-10 pr-10 py-3 rounded-xl bg-zinc-900/80 border border-zinc-800 text-zinc-100 placeholder-zinc-500 text-sm focus:border-yellow-500 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-sm tracking-wide transition-all shadow-lg shadow-yellow-500/20 flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
          >
            {isLoading ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Verifying...</span>
              </span>
            ) : (
              <span>Unlock Admin Dashboard</span>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-zinc-800/80 text-center">
          <p className="text-[11px] text-zinc-500">
            Authorized administrator session only.
          </p>
        </div>
      </div>
    </div>
  );
}
