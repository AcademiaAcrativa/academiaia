import { useState } from 'react';
import type { DragEvent, Dispatch, SetStateAction, ChangeEvent } from 'react';
import { DocumentState, PageType, Page } from '../types';
import { Layers, Type, FilePlus2, Trash2, Image as ImageIcon } from 'lucide-react';
import { syncSumarioPages } from '../utils/sumario';

interface Props {
  docState: DocumentState;
  setDocState: Dispatch<SetStateAction<DocumentState>>;
  onAddPage: (name: string, type: PageType) => void;
  onUpdatePage: (id: string, updates: Partial<Page>) => void;
  className?: string;
  onCloseMobile?: () => void;
}

const ABNT_SECTIONS = [
  { group: 'Parte Externa', items: ['Capa', 'Lombada'] },
  { group: 'Elementos Pré-textuais', items: [
      'Folha de rosto', 'Dedicatória(s)', 'Agradecimento(s)', 'Epígrafe', 
      'Resumo na língua vernácula', 'Resumo em língua estrangeira (Abstract)', 
      'Lista de ilustrações', 'Lista de tabelas', 'Lista de abreviaturas e siglas', 
      'Lista de símbolos', 'Sumário'
  ]},
  { group: 'Elementos Textuais', items: [
      'Introdução', 'Desenvolvimento', 'Conclusão'
  ]},
  { group: 'Elementos Pós-textuais', items: [
      'Referências', 'Glossário', 'Apêndice(s)', 'Anexo(s)'
  ]}
];

export function RightPanel({ docState, setDocState, onAddPage, onUpdatePage, className = '', onCloseMobile }: Props) {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);

  const handleMovePage = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= docState.pages.length) return;
    const newPages = [...docState.pages];
    const [moved] = newPages.splice(index, 1);
    newPages.splice(targetIdx, 0, moved);
    const syncedPages = syncSumarioPages(newPages);
    setDocState({
      ...docState,
      pages: syncedPages,
    });
  };

  const handleDelete = (id: string) => {
    if (docState.pages.length === 1) return;
    const newPages = syncSumarioPages(docState.pages.filter(p => p.id !== id));
    setDocState({
      ...docState,
      pages: newPages,
      activePageId: docState.activePageId === id ? newPages[0].id : docState.activePageId
    });
  };

  const handleDragStart = (e: DragEvent, index: number) => {
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: DragEvent, dropIdx: number) => {
    e.preventDefault();
    if (draggedIdx === null || draggedIdx === dropIdx) {
      setDraggedIdx(null);
      return;
    }

    const newPages = [...docState.pages];
    const draggedItem = newPages[draggedIdx];
    
    newPages.splice(draggedIdx, 1);
    newPages.splice(dropIdx, 0, draggedItem);

    const syncedPages = syncSumarioPages(newPages);

    setDocState({
      ...docState,
      pages: syncedPages,
    });
    setDraggedIdx(null);
  };

  const handleAddImage = (src: string) => {
    if (!docState.activePageId) return;
    setDocState(prev => {
      const activePageIdx = prev.pages.findIndex(p => p.id === prev.activePageId);
      if (activePageIdx === -1) return prev;
      
      const newPages = [...prev.pages];
      const page = { ...newPages[activePageIdx] };
      
      const newImage = {
        id: Math.random().toString(36).substr(2, 9),
        src,
        x: 320,
        y: 200,
        width: 150,
        height: 150
      };
      
      page.images = [...(page.images || []), newImage];
      newPages[activePageIdx] = page;
      
      return {
        ...prev,
        pages: newPages
      };
    });
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const src = uploadEvent.target?.result as string;
      if (src) {
        handleAddImage(src);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const [customPageName, setCustomPageName] = useState('');

  const handleAddCustomPage = () => {
    if (customPageName.trim()) {
      const activePage = docState.pages.find(p => p.id === docState.activePageId);
      
      if (activePage && activePage.type === 'texto') {
        // Appends to the active text page to keep it in the same layer as normal for subtitles
        const currentContent = activePage.content || '';
        const prefix = currentContent.trim() ? '\n\n' : '';
        const subtitleText = customPageName.trim().toUpperCase();
        
        onUpdatePage(activePage.id, { 
          content: currentContent + prefix + subtitleText + '\n\n'
        });
      } else {
        // Fallback to new layer if not on a text page
        onAddPage(customPageName.trim(), 'texto');
      }
      setCustomPageName('');
    }
  };

  return (
    <div className={`w-full md:w-72 bg-[#323232] border-l border-[#1e1e1e] flex flex-col overflow-y-auto print:hidden z-20 relative ${className}`}>
      {onCloseMobile && (
        <div className="flex-none md:hidden flex justify-between items-center px-3 py-2 bg-[#2a2a2a] border-b border-[#1e1e1e]">
          <span className="text-xs font-bold text-cyan-400 uppercase">Páginas & Configurações</span>
          <button 
              onClick={onCloseMobile}
              className="px-2.5 py-1 bg-[#3a3a3a] text-xs text-zinc-200 rounded-md hover:text-white font-medium"
            >
              Fechar ✕
            </button>
          </div>
        )}
        {/* Properties Panel */}
        <div className="flex-none flex flex-col border-b border-[#1e1e1e]">
          <div className="h-8 bg-[#2e2e2e] flex items-center px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
            <Type size={14} className="mr-2" />
            Propriedades (ABNT)
          </div>
          <div className="p-4 space-y-4 text-sm">
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1.5 uppercase">Fonte do Documento</label>
              <select
                className="w-full bg-[#1e1e1e] border border-[#404040] rounded px-2 py-1.5 text-zinc-200 focus:outline-none focus:border-cyan-500/50 text-[13px]"
                value={docState.fontFamily}
                onChange={(e) => setDocState({ ...docState, fontFamily: e.target.value as any })}
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1.5 uppercase">Tamanho da Fonte</label>
              <div className="w-full bg-[#1e1e1e] border border-[#404040] rounded px-2 py-1.5 text-zinc-500 cursor-not-allowed text-[13px]">
                12 pt (Corpo) / 14 pt (Capa/Títulos)
              </div>
            </div>
            <div>
              <label className="block text-[11px] text-zinc-400 mb-1.5 uppercase">Espaçamento</label>
              <div className="w-full bg-[#1e1e1e] border border-[#404040] rounded px-2 py-1.5 text-zinc-500 cursor-not-allowed text-[13px]">
                1.5 linhas (Padrão)
              </div>
            </div>
            <div className="pt-4 mt-2 border-t border-[#404040]">
              <p className="text-[11px] text-zinc-400 mb-2 uppercase">Adicionar Nova Camada</p>
              <div className="flex space-x-2">
                <select
                  className="flex-1 bg-[#1e1e1e] border border-[#404040] rounded px-2 py-1.5 text-zinc-200 focus:outline-none focus:border-cyan-500/50 text-[13px]"
                  value=""
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) return;
                    const isCapa = val === 'Capa';
                    const isRosto = val === 'Folha de rosto';
                    onAddPage(val, isCapa ? 'capa' : isRosto ? 'rosto' : 'texto');
                  }}
                >
                  <option value="" disabled>Selecione para adicionar...</option>
                  {ABNT_SECTIONS.map((group) => (
                    <optgroup key={group.group} label={group.group}>
                      {group.items.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>
            </div>


          </div>
        </div>

      {/* Upload Image & Subtitle Panel */}
      <div className="flex-none flex flex-col border-b border-[#1e1e1e]">
        <div className="h-8 bg-[#2e2e2e] flex items-center px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          <ImageIcon size={14} className="mr-2" />
          Inserções
        </div>
        <div className="p-3 grid grid-cols-2 gap-3">
          {/* Adicionar Subtítulo */}
          <div className="flex flex-col">
            <p className="text-[10px] text-zinc-400 mb-1.5 uppercase font-medium">Novo Subtítulo</p>
            <input 
              type="text" 
              placeholder="Ex: 2.1 Objetivos"
              value={customPageName}
              onChange={e => setCustomPageName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddCustomPage()}
              className="w-full bg-[#1e1e1e] border border-[#404040] rounded px-2 py-1.5 text-zinc-200 focus:outline-none focus:border-cyan-500/50 text-[11px] mb-1.5"
            />
            <button 
              onClick={handleAddCustomPage}
              disabled={!customPageName.trim()}
              className="w-full py-1.5 bg-[#404040] hover:bg-[#505050] disabled:opacity-50 text-white rounded text-xs font-bold transition-colors"
            >
              Criar
            </button>
          </div>

          {/* Upload de Imagem */}
          <div className="flex flex-col">
            <p className="text-[10px] text-zinc-400 mb-1.5 uppercase font-medium">Adicionar Imagem</p>
            <label className="flex-1 flex flex-col items-center justify-center bg-[#262626] border border-dashed border-[#555] hover:border-cyan-500 rounded cursor-pointer transition-colors group">
              <ImageIcon size={16} className="text-zinc-400 group-hover:text-cyan-400 mb-1 transition-colors" />
              <span className="text-[11px] font-medium text-zinc-200 group-hover:text-cyan-400">+ Imagem</span>
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                onChange={handleFileUpload} 
              />
            </label>
          </div>
        </div>
      </div>

      {/* Layers Panel */}
      <div className="flex-none flex flex-col">
        <div className="flex-none h-8 bg-[#2e2e2e] flex items-center px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          <Layers size={14} className="mr-2" />
          Camadas (Folhas)
        </div>
        <div className="p-2 space-y-1.5 bg-[#262626] pb-6">
          {docState.pages.map((page, index) => (
            <div
              key={page.id}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={() => setDraggedIdx(null)}
              onClick={() => {
                setDocState({ ...docState, activePageId: page.id });
                if (onCloseMobile) onCloseMobile();
              }}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-colors border border-transparent ${
                docState.activePageId === page.id ? 'bg-[#404040] text-white border-cyan-500/40 shadow-sm' : 'text-zinc-300 bg-[#2d2d2d] hover:bg-[#353535]'
              } ${draggedIdx === index ? 'opacity-50' : ''}`}
            >
              <div className="flex items-center text-[13px] flex-1 min-w-0 mr-2">
                <FilePlus2 size={15} className="mr-2.5 text-cyan-400 shrink-0" />
                <span className="truncate select-none font-medium">{index + 1}. {page.name}</span>
              </div>
              <div className="flex items-center space-x-1 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMovePage(index, 'up');
                  }}
                  disabled={index === 0}
                  className="px-2 py-1 bg-[#3a3a3a] text-zinc-300 hover:text-white disabled:opacity-20 rounded text-xs font-bold"
                  title="Mover para cima"
                >
                  ▲
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMovePage(index, 'down');
                  }}
                  disabled={index === docState.pages.length - 1}
                  className="px-2 py-1 bg-[#3a3a3a] text-zinc-300 hover:text-white disabled:opacity-20 rounded text-xs font-bold"
                  title="Mover para baixo"
                >
                  ▼
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(page.id);
                  }}
                  className="p-1.5 bg-[#3a3a3a] text-zinc-300 hover:text-red-400 rounded transition-colors ml-1"
                  title="Excluir"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
