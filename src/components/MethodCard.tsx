import { useState } from "react";
import { 
  Sparkles, Video, Briefcase, Check, Copy, ExternalLink, 
  ChevronDown, ChevronUp, Clock, Target, Award, ShieldAlert, BookOpen, Camera
} from "lucide-react";
import { Method } from "../types";

interface MethodCardProps {
  method: Method;
  completedSteps: string[];
  onToggleStep: (methodId: string, stepId: string) => void;
}

export default function MethodCard({ method, completedSteps, onToggleStep }: MethodCardProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [copiedStepId, setCopiedStepId] = useState<string | null>(null);

  // Compute stats
  const totalSteps = method.steps.length;
  const completedCount = method.steps.filter(s => completedSteps.includes(s.id)).length;
  const progressPercent = Math.round((completedCount / totalSteps) * 100);

  const handleCopyPrompt = (stepId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStepId(stepId);
    setTimeout(() => {
      setCopiedStepId(null);
    }, 2000);
  };

  // Get difficulty color classes
  const getDifficultyStyles = (diff: string) => {
    switch (diff) {
      case "Fácil":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Médio":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "Avançado":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  // Dynamic Icon rendering helper
  const renderIcon = (iconName: string) => {
    const props = { className: "w-6 h-6 text-emerald-400 shrink-0" };
    switch (iconName) {
      case "Sparkles":
        return <Sparkles {...props} />;
      case "Video":
        return <Video {...props} />;
      case "Briefcase":
        return <Briefcase {...props} />;
      case "BookOpen":
        return <BookOpen {...props} />;
      case "Camera":
        return <Camera {...props} />;
      default:
        return <Sparkles {...props} />;
    }
  };

  return (
    <div id={`method-container-${method.id}`} className="bg-slate-900/40 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 hover:border-slate-700/60">
      {/* Method Header (Always Visible) */}
      <div 
        id={`method-header-${method.id}`}
        onClick={() => setIsOpen(!isOpen)}
        className="p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 cursor-pointer select-none hover:bg-slate-800/10 transition-colors"
      >
        <div className="flex gap-4 items-start">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 shrink-0">
            {renderIcon(method.iconName)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="text-slate-500 font-mono text-xs">{method.category}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-medium border ${getDifficultyStyles(method.difficulty)}`}>
                {method.difficulty}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">{method.title}</h2>
            <p className="text-slate-400 text-sm mt-0.5 line-clamp-2 md:line-clamp-1">{method.subtitle}</p>
          </div>
        </div>

        {/* Quick parameters & indicator */}
        <div className="flex items-center justify-between w-full md:w-auto gap-6 border-t md:border-t-0 border-slate-800 pt-4 md:pt-0 shrink-0">
          <div className="flex gap-6">
            <div className="text-left">
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Rendimento Estimado</span>
              <span className="text-emerald-400 font-mono font-bold text-sm md:text-base">{method.estimatedIncome}</span>
            </div>
            <div className="text-left">
              <span className="text-slate-500 text-[10px] uppercase font-mono block">Tempo de Execução</span>
              <span className="text-slate-300 font-mono text-sm md:text-base flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {method.duration}
              </span>
            </div>
          </div>
          
          <div className="text-slate-400 p-1.5 rounded-lg bg-slate-950/60 border border-slate-850 hover:bg-slate-800">
            {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Expandable Body */}
      {isOpen && (
        <div id={`method-body-${method.id}`} className="px-6 pb-8 md:px-8 md:pb-10 border-t border-slate-800/60 pt-6 space-y-8">
          
          {/* Method Description & General Progress */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            <div className="md:col-span-2 space-y-2">
              <h3 className="text-sm font-semibold text-slate-300">Resumo da Estratégia</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{method.description}</p>
            </div>
            <div className="md:col-span-2 bg-slate-950/50 p-5 rounded-xl border border-slate-850 space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-medium">Progresso do Método</span>
                <span className="text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded">
                  {completedCount}/{totalSteps} Passos Concluídos
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>

              <div className="flex justify-between text-[11px] text-slate-500">
                <span>Início</span>
                <span>{progressPercent}% Concluído</span>
                <span>Faturamento</span>
              </div>
            </div>
          </div>

          {/* Interactive Steps Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-300 tracking-tight flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400" />
              Guia Passo a Passo de Execução
            </h3>

            <div className="grid grid-cols-1 gap-4">
              {method.steps.map((step, idx) => {
                const isStepCompleted = completedSteps.includes(step.id);
                return (
                  <div 
                    id={`step-card-${step.id}`}
                    key={step.id} 
                    className={`p-5 rounded-xl border transition-all duration-300 ${
                      isStepCompleted 
                        ? "bg-emerald-500/[0.02] border-emerald-500/30" 
                        : "bg-slate-950/40 border-slate-850 hover:border-slate-800"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex gap-3.5 items-start">
                        {/* Checkbox button */}
                        <button
                          id={`step-toggle-${step.id}`}
                          onClick={() => onToggleStep(method.id, step.id)}
                          className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center shrink-0 border transition-all ${
                            isStepCompleted 
                              ? "bg-emerald-500 border-emerald-400 text-slate-950" 
                              : "border-slate-700 bg-slate-900 hover:border-emerald-500/50 text-transparent"
                          }`}
                        >
                          <Check className="w-4 h-4 stroke-[3]" />
                        </button>
                        
                        <div className="space-y-1">
                          <h4 className={`text-base font-bold transition-all ${isStepCompleted ? "text-slate-400 line-through" : "text-white"}`}>
                            {step.title}
                          </h4>
                          <p className="text-slate-400 text-sm leading-relaxed">{step.description}</p>
                        </div>
                      </div>

                      {/* Right side helper action buttons */}
                      {step.actionLink && (
                        <a
                          id={`step-link-${step.id}`}
                          href={step.actionLink}
                          target="_blank"
                          rel="noreferrer"
                          className="sm:self-start inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold font-mono bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white transition-all border border-slate-700/60 hover:border-slate-650 shrink-0 shadow-sm"
                        >
                          <span>{step.linkText || "Acessar"}</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    {/* Copyable Prompt Container */}
                    {step.promptText && (
                      <div className="mt-4 pl-0 sm:pl-9">
                        <div className="bg-slate-950 rounded-lg border border-slate-800/80 p-4 relative group">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Copie este Prompt de IA</span>
                            <button
                              id={`step-copy-${step.id}`}
                              onClick={() => handleCopyPrompt(step.id, step.promptText!)}
                              className="text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 px-2.5 py-1 rounded-md text-xs font-mono flex items-center gap-1.5 border border-slate-800 transition-colors"
                            >
                              {copiedStepId === step.id ? (
                                <>
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                  <span className="text-emerald-400">Copiado!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  <span>Copiar Prompt</span>
                                </>
                              )}
                            </button>
                          </div>
                          <p className="text-slate-300 font-mono text-xs leading-relaxed select-all whitespace-pre-wrap">
                            "{step.promptText}"
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Golden Tips (Dicas de Ouro) */}
          <div className="bg-gradient-to-br from-amber-500/[0.03] to-amber-500/[0.01] border border-amber-500/10 p-5 rounded-xl space-y-3">
            <h4 className="text-sm font-bold text-amber-400 tracking-tight flex items-center gap-2">
              <Target className="w-4 h-4" />
              💡 Segredos para Maximizar seus Lucros (Dicas de Ouro)
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {method.tips.map((tip, idx) => (
                <li key={idx} className="text-xs text-slate-400 flex gap-2.5 leading-relaxed">
                  <span className="text-amber-500 font-bold font-mono shrink-0">0{idx + 1}.</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      )}
    </div>
  );
}
