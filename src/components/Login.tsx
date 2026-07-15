import { useState, FormEvent } from "react";
import { Mail, Lock, Sparkles, ShieldCheck, TrendingUp, LogIn, AlertCircle } from "lucide-react";
import { User as UserType } from "../types";

interface LoginProps {
  onLoginSuccess: (user: UserType) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAuth = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const enteredUser = email.trim().toLowerCase();
    const enteredPass = password;

    // Basic Validation
    if (!enteredUser || !enteredPass) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    // Specific exclusive credential verification
    if (enteredUser === "compradormilionario178" && enteredPass === "numero155") {
      const activeUser: UserType = {
        id: "premium-user-178",
        name: "Comprador Milionário",
        email: "compradormilionario178",
        createdAt: new Date().toISOString()
      };
      
      setSuccess("Acesso autorizado! Carregando os métodos...");
      setTimeout(() => {
        onLoginSuccess(activeUser);
      }, 800);
    } else {
      setError("Usuário ou senha incorretos. Verifique suas credenciais.");
    }
  };

  const handleQuickDemoAccess = () => {
    setEmail("compradormilionario178");
    setPassword("numero155");
    setError(null);
    setSuccess("Credenciais preenchidas! Clique em 'Acessar Academia' abaixo.");
  };

  return (
    <div id="auth-page-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden font-sans">
      
      {/* Decorative premium radial gradients */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Header section */}
      <header className="w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between border-b border-slate-900 z-10">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-2 rounded-lg text-slate-950 shadow-md shadow-emerald-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-extrabold tracking-tight text-white text-lg">
            ACADEMIA <span className="text-emerald-400">IA LUCRATIVA</span>
          </span>
        </div>
        <div className="text-xs text-slate-500 font-mono hidden sm:flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Área Exclusiva para Compradores Premium</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-7xl mx-auto px-6 py-12 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10">
        
        {/* Left Side: Copywriting & Pitch */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono rounded-full font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            Portal de Treinamento Vip
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Descubra como faturar alto com <span className="text-emerald-400 bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Inteligência Artificial</span>
          </h1>
          <p className="text-slate-400 text-base md:text-lg leading-relaxed max-w-xl">
            Acesse o conteúdo exclusivo da Academia. Aprenda a criar aplicativos lucrativos em minutos, monetizar vídeos automáticos nas redes sociais e prestar serviços de alta conversão.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 max-w-lg">
            <div className="flex gap-3 items-start bg-slate-900/40 p-4 rounded-xl border border-slate-850">
              <div className="bg-slate-950 text-emerald-400 p-2 rounded-lg border border-slate-800">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-200">No-Code Avançado</h3>
                <p className="text-slate-450 text-xs mt-0.5 leading-relaxed">Desenvolva mini-apps funcionais completos apenas descrevendo sua ideia.</p>
              </div>
            </div>

            <div className="flex gap-3 items-start bg-slate-900/40 p-4 rounded-xl border border-slate-850">
              <div className="bg-slate-950 text-emerald-400 p-2 rounded-lg border border-slate-800">
                <LogIn className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-200">Escala de Ganhos</h3>
                <p className="text-slate-450 text-xs mt-0.5 leading-relaxed">Publique seus infoprodutos e canais dark com máxima facilidade de faturamento.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Card */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-2xl backdrop-blur-xl">
            
            {/* Title description of form */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-black text-white tracking-tight">
                Entrar no Portal
              </h2>
              <p className="text-slate-400 text-xs mt-2">
                Acesse com seu usuário premium e senha autorizada para ver seus métodos.
              </p>
            </div>

            {/* Error & Success Messages */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/25 text-red-400 px-4 py-3 rounded-lg text-xs flex items-start gap-2.5 mb-5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 px-4 py-3 rounded-lg text-xs flex items-start gap-2.5 mb-5">
                <ShieldCheck className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{success}</span>
              </div>
            )}

            {/* Actual Auth Form */}
            <form onSubmit={handleAuth} className="space-y-4">
              
              {/* Username field */}
              <div className="space-y-1.5">
                <label htmlFor="auth-username" className="text-xs font-semibold text-slate-300 block">Usuário Premium</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Mail className="w-4 h-4" />
                  </span>
                  <input
                    id="auth-username"
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Digite seu usuário"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all font-sans"
                    autoComplete="off"
                  />
                </div>
              </div>

              {/* Password field */}
              <div className="space-y-1.5">
                <label htmlFor="auth-password" className="text-xs font-semibold text-slate-300 block">Sua Senha</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-500">
                    <Lock className="w-4 h-4" />
                  </span>
                  <input
                    id="auth-password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Digite sua senha"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-650 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all font-sans"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                id="auth-submit-btn"
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-lg hover:shadow-emerald-500/25 flex items-center justify-center gap-2 mt-2 cursor-pointer"
              >
                <span>Acessar Academia</span>
                <Sparkles className="w-4 h-4 fill-slate-950/20" />
              </button>

            </form>

            {/* Quick evaluates test login triggers */}
            <div className="mt-6 pt-5 border-t border-slate-800/80 text-center space-y-3">
              <span className="text-[11px] text-slate-500 font-mono block">Preencher credenciais de acesso premium:</span>
              <button
                id="quick-demo-btn"
                type="button"
                onClick={handleQuickDemoAccess}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-950 hover:bg-slate-850 text-xs font-mono font-bold text-emerald-400 rounded-lg border border-slate-800 hover:border-emerald-500/30 transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                Preenchimento Automático
              </button>
            </div>

          </div>
        </div>
      </main>

      {/* Footer information */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-slate-900/80 text-center text-slate-500 text-[11px] font-mono z-10">
        © 2026 Academia IA Lucrativa. Todos os direitos reservados. Área VIP exclusiva para assinantes autorizados.
      </footer>

    </div>
  );
}
