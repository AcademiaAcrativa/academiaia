import { MousePointer2, Type, Square, Download, Eraser, PenTool, Hand, ZoomIn } from 'lucide-react';

interface Props {
  onAddPage: (type: any) => void;
  onExportPDF: () => void;
}

export function Toolbar({ onAddPage, onExportPDF }: Props) {
  const tools = [
    { icon: MousePointer2, active: true, title: "Mover/Selecionar (V)" },
    { icon: Type, active: false, title: "Ferramenta Texto (T)" },
    { icon: PenTool, active: false, title: "Caneta (P)" },
    { icon: Square, active: false, title: "Forma (U)" },
    { icon: Eraser, active: false, title: "Borracha (E)" },
    { icon: Hand, active: false, title: "Mão (H)" },
    { icon: ZoomIn, active: false, title: "Zoom (Z)" },
  ];

  return (
    <div className="hidden md:flex w-12 bg-[#323232] border-r border-[#1e1e1e] flex-col items-center py-2 space-y-2 print:hidden z-10 relative">
      {tools.map((Tool, i) => (
        <button
          key={i}
          title={Tool.title}
          className={`p-2 rounded-sm transition-colors ${Tool.active ? 'bg-[#1e1e1e] text-white' : 'text-zinc-400 hover:text-white hover:bg-[#404040]'}`}
        >
          <Tool.icon size={18} strokeWidth={1.5} />
        </button>
      ))}
      <div className="flex-1" />
      <button 
        className="p-2 rounded-sm text-zinc-400 hover:text-white hover:bg-[#404040] transition-colors mb-2"
        title="Exportar PDF"
        onClick={onExportPDF}
      >
        <Download size={18} strokeWidth={1.5} />
      </button>
    </div>
  );
}
