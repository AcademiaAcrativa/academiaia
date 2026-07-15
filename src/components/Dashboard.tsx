import { useState, useEffect } from "react";
import { 
  LogOut, Sparkles, BookOpen, Target, Landmark, 
  TrendingUp, Award, Zap, HelpCircle, CheckCircle2 
} from "lucide-react";
import { User, UserProgress } from "../types";
import { METHODS } from "../data";
import MethodCard from "./MethodCard";
import IncomeCalculator from "./IncomeCalculator";
import AIToolsLibrary from "./AIToolsLibrary";
import MarketingDigital from "./MarketingDigital";

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

export default function Dashboard({ user, onLogout }: DashboardProps) {
  // Load progress from localStorage on mount
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const stored = localStorage.getItem(`academia_ia_progress_${user.id}`);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error("Failed to load progress:", e);
    }
    return {
      userId: user.id,
      completedSteps: {
        "infoprodutos-ia": [],
        "videos-virais-ia": [],
        "landing-pages-local": [],
        "vender-ebooks-ia": [],
        "gestao-social-media-ia": [],
        "melhorar-fotos-delivery": [],
        "criacao-voiceovers-ia": [],
        "chatbots-ia-atendimento": []
      }
    };
  });

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`academia_ia_progress_${user.id}`, JSON.stringify(progress));
  }, [progress, user.id]);

  const handleToggleStep = (methodId: string, stepId: string) => {
    setProgress((prev) => {
      const currentSteps = prev.completedSteps[methodId] || [];
      const updatedSteps = currentSteps.includes(stepId)
        ? currentSteps.filter((id) => id !== stepId)
        : [...currentSteps, stepId];

      return {
        ...prev,
        completedSteps: {
          ...prev.completedSteps,
          [methodId]: updatedSteps
        }
      };
    });
  };

  // Calculations for overall stats
  const totalStepsInAcademy = METHODS.reduce((acc, curr) => acc + curr.steps.length, 0);
  
  let totalCompletedInAcademy = 0;
  if (progress && progress.completedSteps) {
    const keys = Object.keys(progress.completedSteps);
    for (let i = 0; i < keys.length; i++) {
      const stepsList = progress.completedSteps[keys[i]] as string[] | undefined;
      if (stepsList) {
        totalCompletedInAcademy += stepsList.length;
      }
    }
  }

  const overallProgressPercent = Math.round((totalCompletedInAcademy / totalStepsInAcademy) * 100);

  // Dynamic ranking based on progress
  const getRank = (completedCount: number) => {
    if (completedCount === 0) return { name: "Iniciante", color: "text-slate-400 bg-slate-900 border-slate-800" };
    if (completedCount <= 3) return { name: "Bronze - Aprendiz", color: "text-amber-500 bg-amber-500/10 border-amber-500/20" };
    if (completedCount <= 6) return { name: "Prata - Empreendedor", color: "text-slate-300 bg-slate-100/10 border-slate-300/20" };
    if (completedCount < 9) return { name: "Ouro - Gestor IA", color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20" };
    return { name: "Diamante - Mestre do Lucro", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20 shadow-cyan-500/10" };
  };

  const rank = getRank(totalCompletedInAcademy);

  return (
    <div id="dashboard-page-container" className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between relative">
      
      {/* Decorative ambient radial lighting */}
      <div className="absolute top-[5%] right-[5%] w-[40%] h-[40%] bg-emerald-500/5 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[5%] w-[40%] h-[40%] bg-teal-500/5 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Primary Dashboard Navbar */}
      <header className="sticky top-0 bg-slate-950/80 border-b border-slate-900 px-6 py-4 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2.5">
            <div className="bg-emerald-500 p-2 rounded-lg text-slate-950">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-white text-base block">
                ACADEMIA <span className="text-emerald-400">IA LUCRATIVA</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500 tracking-wider uppercase block">Área de Membros Premium</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* User Greeting Info */}
            <div className="text-right hidden md:block">
              <span className="text-xs text-slate-400 font-medium block">Olá, {user.name}</span>
              <span className="text-[10px] text-slate-500 font-mono block">{user.email}</span>
            </div>

            {/* Logout button */}
            <button
              id="dashboard-logout-btn"
              onClick={onLogout}
              className="px-3.5 py-1.8 rounded-lg bg-slate-900 border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-400 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Contents */}
      <main className="max-w-7xl mx-auto px-6 py-8 flex-1 w-full space-y-10 z-10">
        
        {/* Welcome Block and Stats Grid */}
        <section id="dashboard-welcome-section" className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Welcome Message */}
          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 p-6 md:p-8 rounded-2xl flex flex-col justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono rounded-full font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Acesso Premium Ativo
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Seu Futuro Financeiro com IA Começa Aqui
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Navegue pelos métodos selecionados abaixo. Cada método possui etapas interativas detalhadas, links rápidos para as ferramentas e prompts prontos para copiar.
              </p>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-800/80 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-mono uppercase">Seu Nível:</span>
                <span className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold border ${rank.color}`}>
                  {rank.name}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500">Membro desde {new Date(user.createdAt).toLocaleDateString("pt-BR")}</span>
            </div>
          </div>

          {/* Core Analytics Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Stat 1: Overall completion progress */}
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-mono uppercase tracking-wider block">Progresso Geral</span>
                  <span className="text-3xl font-extrabold text-white tracking-tight block">
                    {overallProgressPercent}%
                  </span>
                </div>
                <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-lg border border-emerald-500/20">
                  <Award className="w-5 h-5" />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${overallProgressPercent}%` }}
                  ></div>
                </div>
                <span className="text-[10px] font-mono text-slate-500 block">
                  {totalCompletedInAcademy} de {totalStepsInAcademy} etapas completadas no portal
                </span>
              </div>
            </div>

            {/* Stat 2: Active Income potential */}
            <div className="bg-slate-900/60 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <span className="text-xs text-slate-500 font-mono uppercase tracking-wider block">Potencial de Ganho</span>
                  <span className="text-2xl font-bold text-emerald-400 font-mono tracking-tight block">
                    R$ 6.500+/mês
                  </span>
                </div>
                <div className="bg-emerald-500/10 text-emerald-400 p-2 rounded-lg border border-emerald-500/20">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>

              <p className="text-xs text-slate-400 mt-4 leading-relaxed">
                Potencial acumulado estimado ao aplicar os 3 métodos em paralelo de forma consistente.
              </p>
            </div>

          </div>

        </section>

        {/* Methods guides heading */}
        <div className="space-y-2 text-left pt-2 border-t border-slate-900">
          <span className="text-emerald-400 font-mono text-xs uppercase tracking-wider font-semibold block">Nossos Guias Práticos</span>
          <h2 className="text-2xl font-black text-white tracking-tight">Métodos Passo a Passo de IA</h2>
          <p className="text-slate-400 text-sm max-w-2xl">
            Escolha um dos métodos validados abaixo para começar. Conclua os passos na ordem indicada para garantir os melhores resultados.
          </p>
        </div>

        {/* Dynamic Methods Render Block */}
        <section id="methods-grid-section" className="space-y-6">
          {METHODS.map((method) => (
            <div key={method.id}>
              <MethodCard
                method={method}
                completedSteps={progress.completedSteps[method.id] || []}
                onToggleStep={handleToggleStep}
              />
            </div>
          ))}
        </section>

        {/* Marketing Digital & Vendas section */}
        <section id="marketing-digital-hub-section" className="pt-2 border-t border-slate-900">
          <MarketingDigital />
        </section>

        {/* 80 AI Tools Library Section */}
        <section id="ai-tools-library-section" className="pt-2 border-t border-slate-900">
          <AIToolsLibrary />
        </section>

        {/* Revenue simulation calculator */}
        <section id="revenue-calculator-container" className="pt-2 border-t border-slate-900">
          <IncomeCalculator />
        </section>

        {/* Extra helpful tools/FAQ block */}
        <section id="resources-faq-section" className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          
          {/* Box 1: Core AI prompts cheatsheet */}
          <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              Kit de Ferramentas Recomendadas
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Para acelerar sua jornada, mantenha essas ferramentas salvas nos seus favoritos. Elas são gratuitas ou oferecem excelentes planos de entrada:
            </p>

            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                <span className="font-semibold text-slate-200">Lovable.dev</span>
                <span className="text-slate-500 text-[10px] font-mono">Criação visual de apps</span>
              </div>
              <div className="flex justify-between items-center text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                <span className="font-semibold text-slate-200">Kirvano.com</span>
                <span className="text-slate-500 text-[10px] font-mono">Checkout e entrega digital</span>
              </div>
              <div className="flex justify-between items-center text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                <span className="font-semibold text-slate-200">ElevenLabs.io</span>
                <span className="text-slate-500 text-[10px] font-mono">Narração realista por IA</span>
              </div>
              <div className="flex justify-between items-center text-xs bg-slate-950 p-2.5 rounded-lg border border-slate-850">
                <span className="font-semibold text-slate-200">CapCut / v0.dev</span>
                <span className="text-slate-500 text-[10px] font-mono">Edição e Web Interfaces</span>
              </div>
            </div>
          </div>

          {/* Box 2: FAQ */}
          <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-2xl space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-emerald-400" />
              Dúvidas Frequentes (FAQ)
            </h3>
            
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <h4 className="font-bold text-slate-200">Preciso saber programar para o Método 1?</h4>
                <p className="text-slate-400 leading-relaxed">Absolutamente não! O Lovable foi feito para construir softwares através de comandos de texto em linguagem natural. Você só precisa dizer o que quer.</p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-200">Como funciona o recebimento das vendas na Kirvano?</h4>
                <p className="text-slate-400 leading-relaxed">A Kirvano processa pagamentos via Pix e Cartão de Crédito de forma transparente. O saldo fica disponível em poucos dias diretamente na sua conta bancária cadastrada.</p>
              </div>

              <div className="space-y-1">
                <h4 className="font-bold text-slate-200">Quanto tempo leva para ver os primeiros resultados?</h4>
                <p className="text-slate-400 leading-relaxed">Se você aplicar o Passo 3 do Método 3, ou publicar seus primeiros 5 vídeos curtos do Método 2, é comum ver engajamento e vendas nas primeiras 72 horas.</p>
              </div>
            </div>
          </div>

        </section>

      </main>

      {/* Footer copyright */}
      <footer className="w-full max-w-7xl mx-auto px-6 py-6 border-t border-slate-900/80 text-center text-slate-500 text-[11px] font-mono mt-12">
        © 2026 Academia IA Lucrativa. Todos os direitos reservados. Métodos educenciais desenvolvidos com foco em engenharia de prompt e no-code.
      </footer>

    </div>
  );
}
