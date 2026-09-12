import { Home, Download } from 'lucide-react';

interface Props {
  onHome?: () => void;
  onExportPDF?: () => void;
}

export function TopBar({ onHome, onExportPDF }: Props) {
  return (
    <div className="h-11 sm:h-10 bg-[#323232] border-b border-[#1e1e1e] flex items-center justify-between px-3 sm:px-4 text-[13px] select-none print:hidden z-30 relative">
      <div className="flex items-center space-x-3 sm:space-x-6">
        <span 
          onClick={onHome}
          className="text-cyan-400 font-bold flex items-center tracking-tight cursor-pointer hover:text-cyan-300 transition-colors"
        >
          <span className="bg-cyan-700/30 text-cyan-400 border border-cyan-500/50 px-1.5 py-0.5 rounded mr-1.5 text-[9px] sm:text-[10px] uppercase font-black tracking-widest shadow-inner">ETERJ</span>
          <span className="text-xs sm:text-sm font-semibold">Relatorio Eterj VTNC</span>
        </span>

        {/* Menu Items for Desktop */}
        <div className="hidden lg:flex space-x-4 text-zinc-400">
          <span className="hover:text-white cursor-pointer transition-colors">Arquivo</span>
          <span className="hover:text-white cursor-pointer transition-colors">Editar</span>
          <span className="hover:text-white cursor-pointer transition-colors">Camada</span>
          <span className="hover:text-white cursor-pointer transition-colors">Tipo</span>
          <span className="hover:text-white cursor-pointer transition-colors">Visualizar</span>
          <span className="hover:text-white cursor-pointer transition-colors">Ajuda</span>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {onHome && (
          <button 
            onClick={onHome}
            className="flex items-center space-x-1.5 px-2.5 py-1 bg-[#262626] hover:bg-[#383838] border border-[#404040] rounded-full text-xs text-zinc-300 hover:text-white transition-colors"
            title="Voltar para a Página Inicial"
          >
            <Home size={13} />
            <span className="hidden sm:inline">Início</span>
          </button>
        )}
        {onExportPDF && (
          <button 
            onClick={onExportPDF}
            className="flex items-center space-x-1.5 px-3 py-1 bg-[#1473e6] hover:bg-[#105cba] rounded-full text-xs text-white font-medium shadow-sm transition-colors"
            title="Baixar PDF do Relatório"
          >
            <Download size={13} />
            <span>Baixar PDF</span>
          </button>
        )}
      </div>
    </div>
  );
}

