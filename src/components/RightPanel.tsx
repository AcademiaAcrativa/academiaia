import { useState } from 'react';
import type { DragEvent, Dispatch, SetStateAction, ChangeEvent } from 'react';
import { DocumentState, PageType, Page, TextoPage } from '../types';
import { Layers, Type, FilePlus2, Trash2, Image as ImageIcon, Edit2, Check, RefreshCw, BookOpen, Plus, AlertCircle, CheckCircle2, Calculator } from 'lucide-react';
import { syncSumarioPages } from '../utils/sumario';
import { analyzePageCapacity, willSubDevelopmentFit, getNextDevelopmentNumber } from '../utils/pageCapacity';

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
      'Introdução', 'Desenvolvimento Principal', 'Conclusão', 'Plano de Orçamentos'
  ]},
  { group: 'Elementos Pós-textuais', items: [
      'Referências', 'Glossário', 'Apêndice(s)', 'Anexo(s)'
  ]}
];

export function RightPanel({ docState, setDocState, onAddPage, onUpdatePage, className = '', onCloseMobile }: Props) {
  const [draggedIdx, setDraggedIdx] = useState<number | null>(null);
  const [editingPageId, setEditingPageId] = useState<string | null>(null);
  const [editingPageName, setEditingPageName] = useState('');

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

  // Development & Subsections Management
  const [devNumber, setDevNumber] = useState('');
  const [devTitle, setDevTitle] = useState('');
  const [devContent, setDevContent] = useState('');

  const activePage = docState.pages.find(p => p.id === docState.activePageId);
  const isDevActive = activePage && activePage.type === 'texto' && (
    activePage.name.toLowerCase().includes('desenvolvimento') ||
    activePage.heading?.startsWith('2') ||
    activePage.name.startsWith('2')
  );

  const targetDevPage = (isDevActive ? activePage : docState.pages.filter(p => 
    p.type === 'texto' && (
      p.name.toLowerCase().includes('desenvolvimento') ||
      p.heading?.startsWith('2') ||
      p.name.startsWith('2')
    )
  ).slice(-1)[0]) || (activePage?.type === 'texto' ? activePage : undefined);

  const suggestedNumber = getNextDevelopmentNumber(docState.pages);
  const effectiveNumber = devNumber.trim() || suggestedNumber;

  const targetCapacity = targetDevPage ? analyzePageCapacity(targetDevPage) : null;
  const fitAnalysis = targetDevPage 
    ? willSubDevelopmentFit(targetDevPage, {
        number: effectiveNumber,
        title: devTitle,
        content: devContent
      })
    : null;

  const handleInsertDevelopment = () => {
    if (!devTitle.trim() && !devContent.trim()) return;

    const num = effectiveNumber;
    const title = devTitle.trim();
    const content = devContent.trim();
    const header = `${num} ${title ? title.toUpperCase() : ''}`.trim();

    // Check if it fits on the current development sheet
    if (fitAnalysis?.fitsOnCurrentPage && targetDevPage && targetDevPage.type === 'texto') {
      // Append to the SAME sheet (mesma folha)
      const currentContent = (targetDevPage as TextoPage).content || '';
      const prefix = currentContent.trim() ? '\n\n' : '';
      const blockText = header ? `${header}${content ? '\n' + content : ''}` : content;
      const newContent = currentContent + prefix + blockText;

      const updatedPages = docState.pages.map(p => 
        p.id === targetDevPage.id ? { ...p, content: newContent } : p
      );
      const synced = syncSumarioPages(updatedPages);
      setDocState({
        ...docState,
        pages: synced,
        activePageId: targetDevPage.id
      });
    } else {
      // Goes to a NEW sheet (outra folha) because space was exceeded or no dev page existed
      const newId = Math.random().toString(36).substring(2, 9);
      const newPage: TextoPage = {
        id: newId,
        type: 'texto',
        name: `${num} ${title || 'Desenvolvimento'}`,
        heading: header || `${num} DESENVOLVIMENTO`,
        content: content
      };

      let insertIdx = docState.pages.length;
      if (targetDevPage) {
        const idx = docState.pages.findIndex(p => p.id === targetDevPage.id);
        if (idx !== -1) insertIdx = idx + 1;
      }

      const updatedPages = [...docState.pages];
      updatedPages.splice(insertIdx, 0, newPage);
      const synced = syncSumarioPages(updatedPages);
      setDocState({
        ...docState,
        pages: synced,
        activePageId: newId
      });
    }

    // Reset inputs
    setDevTitle('');
    setDevContent('');
    setDevNumber('');
  };

  const handleForceNewDevPage = () => {
    const num = effectiveNumber;
    const title = devTitle.trim();
    const content = devContent.trim();
    const newId = Math.random().toString(36).substring(2, 9);
    const header = `${num} ${title ? title.toUpperCase() : ''}`.trim();
    const newPage: TextoPage = {
      id: newId,
      type: 'texto',
      name: `${num} ${title || 'Desenvolvimento'}`,
      heading: header || `${num} DESENVOLVIMENTO`,
      content: content
    };

    let insertIdx = docState.pages.length;
    if (targetDevPage) {
      const idx = docState.pages.findIndex(p => p.id === targetDevPage.id);
      if (idx !== -1) insertIdx = idx + 1;
    }

    const updatedPages = [...docState.pages];
    updatedPages.splice(insertIdx, 0, newPage);
    const synced = syncSumarioPages(updatedPages);
    setDocState({
      ...docState,
      pages: synced,
      activePageId: newId
    });

    setDevTitle('');
    setDevContent('');
    setDevNumber('');
  };

  const handleAddCustomPage = () => {
    if (customPageName.trim()) {
      const activeP = docState.pages.find(p => p.id === docState.activePageId);
      
      if (activeP && activeP.type === 'texto') {
        // Appends to the active text page to keep it in the same layer as normal for subtitles
        const currentContent = activeP.content || '';
        const prefix = currentContent.trim() ? '\n\n' : '';
        const subtitleText = customPageName.trim().toUpperCase();
        
        onUpdatePage(activeP.id, { 
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
                    const isTabela = val.toLowerCase().includes('orçamento') || val.toLowerCase().includes('orcamento') || val.toLowerCase().includes('tabela');
                    onAddPage(val, isCapa ? 'capa' : isRosto ? 'rosto' : isTabela ? 'tabela' : 'texto');
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

      {/* Desenvolvimento & Subtópicos Panel */}
      <div className="flex-none flex flex-col border-b border-[#1e1e1e]">
        <div className="h-8 bg-[#2e2e2e] flex items-center justify-between px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-300">
          <div className="flex items-center">
            <BookOpen size={14} className="mr-2 text-cyan-400" />
            <span>Desenvolvimento (2.x)</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono font-bold">
            {effectiveNumber}
          </span>
        </div>

        <div className="p-3 space-y-2.5">
          {/* Status da Folha Atual */}
          {targetCapacity && (
            <div className="bg-[#242424] border border-[#383838] rounded-md p-2 space-y-1.5">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-400 font-medium truncate max-w-[150px]">
                  {targetDevPage?.name || 'Folha de Desenvolvimento'}
                </span>
                <span className={targetCapacity.linesRemaining <= 3 ? "text-amber-400 font-bold" : "text-emerald-400 font-semibold"}>
                  {targetCapacity.linesUsed}/{targetCapacity.maxLines} linhas
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="w-full bg-[#181818] h-1.5 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${
                    targetCapacity.linesRemaining <= 3 
                      ? 'bg-amber-500' 
                      : targetCapacity.percentageUsed > 70 
                        ? 'bg-yellow-500' 
                        : 'bg-emerald-500'
                  }`}
                  style={{ width: `${targetCapacity.percentageUsed}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-zinc-400">
                <span>Espaço disponível:</span>
                <span className="font-semibold text-zinc-300">{targetCapacity.linesRemaining} linhas livres</span>
              </div>
            </div>
          )}

          {/* Form inputs */}
          <div className="space-y-1.5">
            <div className="flex items-center space-x-1.5">
              <input
                type="text"
                value={devNumber}
                onChange={e => setDevNumber(e.target.value)}
                placeholder={suggestedNumber}
                title="Número do subtópico (ex: 2.1, 2.2, 2.3)"
                className="w-16 bg-[#1e1e1e] border border-[#404040] rounded px-2 py-1.5 text-zinc-200 focus:outline-none focus:border-cyan-500/50 text-[11px] font-mono font-bold text-center"
              />
              <input
                type="text"
                value={devTitle}
                onChange={e => setDevTitle(e.target.value)}
                placeholder="Título (ex: Objetivo do Projeto)"
                className="flex-1 bg-[#1e1e1e] border border-[#404040] rounded px-2 py-1.5 text-zinc-200 focus:outline-none focus:border-cyan-500/50 text-[11px]"
              />
            </div>

            <textarea
              value={devContent}
              onChange={e => setDevContent(e.target.value)}
              rows={3}
              placeholder="Conteúdo do subtópico (opcional)..."
              className="w-full bg-[#1e1e1e] border border-[#404040] rounded px-2 py-1.5 text-zinc-200 focus:outline-none focus:border-cyan-500/50 text-[11px] resize-y placeholder:text-zinc-500"
            />
          </div>

          {/* Cálculo e Análise se vai caber */}
          {fitAnalysis && (
            <div className={`p-2 rounded border text-[11px] space-y-1 transition-all ${
              fitAnalysis.fitsOnCurrentPage
                ? 'bg-emerald-950/30 border-emerald-800/60 text-emerald-200'
                : 'bg-amber-950/30 border-amber-800/60 text-amber-200'
            }`}>
              <div className="flex items-center space-x-1.5 font-bold">
                {fitAnalysis.fitsOnCurrentPage ? (
                  <>
                    <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
                    <span>Cabe na folha atual (mesma folha)</span>
                  </>
                ) : (
                  <>
                    <AlertCircle size={13} className="text-amber-400 shrink-0" />
                    <span>Irá para outra folha (sem espaço)</span>
                  </>
                )}
              </div>
              <p className="text-[10px] opacity-90 leading-tight">
                {fitAnalysis.fitsOnCurrentPage 
                  ? `Ocupará ~${fitAnalysis.linesNeeded} linhas. A folha atual tem ${fitAnalysis.linesRemainingBefore} livres (restarão ~${fitAnalysis.linesRemainingAfter} linhas).`
                  : `Ocupará ~${fitAnalysis.linesNeeded} linhas, mas a folha atual tem apenas ${fitAnalysis.linesRemainingBefore} livres. Uma nova folha será gerada automaticamente.`
                }
              </p>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex flex-col space-y-1.5">
            <button
              onClick={handleInsertDevelopment}
              disabled={!devTitle.trim() && !devContent.trim()}
              className="w-full py-1.5 px-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded text-xs font-bold transition-colors flex items-center justify-center space-x-1 shadow-sm cursor-pointer"
            >
              <Plus size={14} />
              <span>Inserir {effectiveNumber}</span>
            </button>
            <button
              onClick={handleForceNewDevPage}
              disabled={!devTitle.trim() && !devContent.trim()}
              title="Cria uma nova folha de desenvolvimento separada em sequência"
              className="w-full py-1 bg-[#262626] hover:bg-[#333] border border-[#404040] disabled:opacity-40 text-zinc-300 hover:text-white rounded text-[11px] font-medium transition-colors cursor-pointer"
            >
              Forçar Nova Folha Separada
            </button>
          </div>
        </div>
      </div>

      {/* Upload Image & Subtitle Panel */}
      <div className="flex-none flex flex-col border-b border-[#1e1e1e]">
        <div className="h-8 bg-[#2e2e2e] flex items-center px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          <ImageIcon size={14} className="mr-2" />
          Inserções Adicionais
        </div>
        <div className="p-3 grid grid-cols-2 gap-3">
          {/* Adicionar Subtítulo Livre */}
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
              className="w-full py-1.5 bg-[#404040] hover:bg-[#505050] disabled:opacity-50 text-white rounded text-xs font-bold transition-colors cursor-pointer"
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

        {/* Botão dedicado para Plano de Orçamentos com cálculo automático */}
        <div className="px-3 pb-3">
          <button
            type="button"
            onClick={() => onAddPage('Plano de Orçamentos', 'tabela')}
            className="w-full py-2 px-3 bg-gradient-to-r from-blue-900/60 to-cyan-900/60 hover:from-blue-800/80 hover:to-cyan-800/80 border border-cyan-500/40 rounded text-xs font-semibold text-cyan-200 hover:text-white flex items-center justify-center space-x-2 transition-all shadow-sm cursor-pointer"
            title="Criar folha com tabela de plano de orçamento com cálculos automáticos"
          >
            <Calculator size={14} className="text-cyan-400" />
            <span>+ Plano de Orçamentos (Tabela)</span>
          </button>
        </div>
      </div>

      {/* Layers Panel */}
      <div className="flex-none flex flex-col">
        <div className="flex-none h-8 bg-[#2e2e2e] flex items-center justify-between px-3 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
          <div className="flex items-center">
            <Layers size={14} className="mr-2" />
            <span>Camadas (Folhas)</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setDocState((prev) => ({
                ...prev,
                pages: syncSumarioPages(prev.pages, { force: true }),
              }));
            }}
            className="flex items-center space-x-1 text-[10px] text-cyan-400 hover:text-cyan-300 transition-colors normal-case font-medium cursor-pointer"
            title="Recalcular e sincronizar pontinhos e páginas do Sumário"
          >
            <RefreshCw size={11} />
            <span>Sincronizar Sumário</span>
          </button>
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
                <FilePlus2 size={15} className="mr-2 text-cyan-400 shrink-0" />
                {editingPageId === page.id ? (
                  <div className="flex items-center space-x-1 flex-1 min-w-0" onClick={(e) => e.stopPropagation()}>
                    <input
                      autoFocus
                      type="text"
                      value={editingPageName}
                      onChange={(e) => setEditingPageName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (editingPageName.trim()) {
                            onUpdatePage(page.id, { name: editingPageName.trim() });
                          }
                          setEditingPageId(null);
                        } else if (e.key === 'Escape') {
                          setEditingPageId(null);
                        }
                      }}
                      className="bg-[#181818] border border-cyan-500 rounded px-1.5 py-0.5 text-white text-xs w-full focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (editingPageName.trim()) {
                          onUpdatePage(page.id, { name: editingPageName.trim() });
                        }
                        setEditingPageId(null);
                      }}
                      className="text-cyan-400 hover:text-white p-1 rounded transition-colors"
                      title="Confirmar"
                    >
                      <Check size={13} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center min-w-0 flex-1 group/title">
                    <span 
                      className="truncate select-none font-medium" 
                      title="Clique duas vezes para renomear"
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        setEditingPageId(page.id);
                        setEditingPageName(page.name);
                      }}
                    >
                      {index + 1}. {page.name}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingPageId(page.id);
                        setEditingPageName(page.name);
                      }}
                      title="Renomear nome da página"
                      className="ml-1.5 opacity-0 group-hover/title:opacity-100 group-hover:opacity-80 text-zinc-400 hover:text-cyan-400 p-0.5 rounded transition-opacity"
                    >
                      <Edit2 size={11} />
                    </button>
                  </div>
                )}
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
