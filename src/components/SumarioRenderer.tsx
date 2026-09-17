import { useState, useEffect, useRef } from 'react';
import { parseSumarioContent, rebuildSumarioContent, ParsedSumarioLine } from '../utils/sumario';
import { RefreshCw, Plus, Trash2, SlidersHorizontal, Eye, Edit3 } from 'lucide-react';

interface SumarioPrintViewProps {
  content: string;
}

/**
 * Pure, print-ready ABNT Sumário renderer.
 * Guarantees every single line spans 100% of the text width, with section titles on the left,
 * uniform dot leaders in the middle, and page numbers flush against the right margin.
 */
export function SumarioPrintView({ content }: SumarioPrintViewProps) {
  const lines = parseSumarioContent(content);

  return (
    <div className="w-full flex flex-col space-y-0.5 text-black text-[12pt] select-text">
      {lines.map((line) => {
        if (!line.isEntry) {
          if (!line.title && !line.raw) {
            return <div key={line.id} className="h-3" />;
          }
          return (
            <div key={line.id} className="w-full font-bold uppercase text-[12pt] py-1 text-left">
              {line.title || line.raw}
            </div>
          );
        }

        const indentPx = (line.level - 1) * 20;

        return (
          <div
            key={line.id}
            className="w-full flex items-baseline justify-between text-[12pt] leading-[1.8] my-0.5"
          >
            {/* Title / Section Name - Never cut off, with right margin protecting text */}
            <span
              className={`shrink min-w-0 pr-2 break-words ${
                line.isPrimary ? 'font-bold uppercase tracking-wide' : 'font-normal'
              }`}
              style={{ paddingLeft: `${indentPx}px` }}
            >
              {line.title}
            </span>

            {/* Continuous uniform dot leader bridging the full remaining width */}
            <span className="flex-1 min-w-[20px] mx-1 overflow-hidden select-none pointer-events-none self-baseline h-[1.1em] relative">
              <span className="inline-block w-full overflow-hidden whitespace-nowrap text-zinc-900 tracking-[3.5px] font-mono text-[11pt]">
                {'.'.repeat(140)}
              </span>
            </span>

            {/* Page Number (flush right against right margin) */}
            <span
              className={`shrink-0 pl-1.5 tabular-nums text-right ${
                line.isPrimary ? 'font-bold' : 'font-normal'
              }`}
            >
              {line.pageNumber}
            </span>
          </div>
        );
      })}
    </div>
  );
}

interface SumarioEditorViewProps {
  content: string;
  onUpdateContent: (newContent: string) => void;
  onSyncPages?: () => void;
  readOnly?: boolean;
}

/**
 * Interactive ABNT Sumário Editor.
 * Displays visually aligned dot leaders matching print standards, while allowing inline
 * adjustments to titles, levels, and page numbers, or quick synchronization with document pages.
 */
export function SumarioEditorView({
  content,
  onUpdateContent,
  onSyncPages,
  readOnly = false,
}: SumarioEditorViewProps) {
  const [mode, setMode] = useState<'formatted' | 'raw'>('formatted');
  const [lines, setLines] = useState<ParsedSumarioLine[]>(() => parseSumarioContent(content));
  const rawTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync internal structured state when external content changes
  useEffect(() => {
    setLines(parseSumarioContent(content));
  }, [content]);

  const handleUpdateLine = (index: number, updates: Partial<ParsedSumarioLine>) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], ...updates };
    setLines(updated);
    onUpdateContent(rebuildSumarioContent(updated));
  };

  const handleRemoveLine = (index: number) => {
    const updated = lines.filter((_, i) => i !== index);
    setLines(updated);
    onUpdateContent(rebuildSumarioContent(updated));
  };

  const handleAddLine = () => {
    const newLine: ParsedSumarioLine = {
      id: `sum-line-${Date.now()}`,
      raw: '',
      isEntry: true,
      title: 'NOVA SEÇÃO',
      pageNumber: '1',
      level: 1,
      isPrimary: true,
    };
    const updated = [...lines, newLine];
    setLines(updated);
    onUpdateContent(rebuildSumarioContent(updated));
  };

  if (readOnly) {
    return <SumarioPrintView content={content} />;
  }

  return (
    <div className="w-full flex flex-col h-full relative">
      {/* Top Action Toolbar (Interactive on Screen, Excluded from Prints) */}
      <div className="flex-none mb-3 py-1.5 px-2 bg-zinc-100/90 border border-zinc-300 rounded-lg flex items-center justify-between text-xs print:hidden shadow-xs">
        <div className="flex items-center space-x-1.5">
          <button
            type="button"
            onClick={() => setMode('formatted')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              mode === 'formatted'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'bg-white text-zinc-700 hover:bg-zinc-200 border border-zinc-200'
            }`}
            title="Visualização com pontinhos e alinhamento ABNT perfeito"
          >
            <Eye size={13} />
            <span>Alinhado ABNT</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('raw')}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
              mode === 'raw'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'bg-white text-zinc-700 hover:bg-zinc-200 border border-zinc-200'
            }`}
            title="Editar texto corrido do Sumário diretamente"
          >
            <Edit3 size={13} />
            <span>Texto Puro</span>
          </button>
        </div>

        <div className="flex items-center space-x-1.5">
          {onSyncPages && (
            <button
              type="button"
              onClick={onSyncPages}
              className="flex items-center space-x-1 px-2.5 py-1 bg-white hover:bg-cyan-50 text-cyan-700 border border-cyan-300 rounded text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs"
              title="Recalcula e sincroniza todas as páginas e tópicos do documento"
            >
              <RefreshCw size={12} className="animate-spin-once" />
              <span>Sincronizar Páginas</span>
            </button>
          )}
          {mode === 'formatted' && (
            <button
              type="button"
              onClick={handleAddLine}
              className="flex items-center space-x-1 px-2 py-1 bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-300 rounded text-[11px] font-medium transition-colors cursor-pointer"
              title="Adicionar nova linha ao sumário"
            >
              <Plus size={13} />
              <span>Adicionar</span>
            </button>
          )}
        </div>
      </div>

      {/* Content Rendering: Formatted or Raw */}
      {mode === 'formatted' ? (
        <div className="w-full flex-1 flex flex-col space-y-1 text-black text-[12pt] overflow-y-auto">
          {lines.map((line, idx) => {
            if (!line.isEntry) {
              if (!line.title && !line.raw) {
                return <div key={line.id} className="h-3" />;
              }
              return (
                <div key={line.id} className="w-full font-bold uppercase text-[12pt] py-1 text-left flex items-center group">
                  <input
                    value={line.title || line.raw}
                    onChange={(e) => handleUpdateLine(idx, { title: e.target.value, raw: e.target.value })}
                    className="flex-1 font-bold uppercase bg-transparent outline-none border-b border-transparent hover:border-zinc-300 focus:border-cyan-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveLine(idx)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 p-1 transition-opacity cursor-pointer print:hidden"
                    title="Remover linha"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              );
            }

            const indentPx = (line.level - 1) * 20;

            return (
              <div
                key={line.id}
                className="w-full flex items-baseline justify-between text-[12pt] leading-[1.8] group relative hover:bg-cyan-500/5 rounded px-1 -mx-1 transition-colors"
              >
                {/* Level / Indent Button (Screen Only) */}
                <div className="opacity-0 group-hover:opacity-100 absolute -left-6 top-1/2 -translate-y-1/2 flex items-center space-x-0.5 print:hidden">
                  <button
                    type="button"
                    onClick={() => handleUpdateLine(idx, { level: line.level === 3 ? 1 : line.level + 1, isPrimary: line.level + 1 === 1 })}
                    className="text-zinc-400 hover:text-cyan-600 p-0.5 cursor-pointer"
                    title="Alternar nível/recuo (1, 2 ou 3)"
                  >
                    <SlidersHorizontal size={11} />
                  </button>
                </div>

                {/* Section Title - fully visible without cut-offs or artificial max-width constraints */}
                <div
                  className="flex items-baseline shrink min-w-0 pr-2"
                  style={{ paddingLeft: `${indentPx}px` }}
                >
                  <span
                    contentEditable={!readOnly}
                    suppressContentEditableWarning
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        (e.target as HTMLElement).blur();
                      }
                    }}
                    onBlur={(e) => {
                      const newTitle = e.currentTarget.textContent?.trim() || '';
                      handleUpdateLine(idx, {
                        title: newTitle,
                        isPrimary: line.level === 1 && (/^\d+\s+[A-ZÀ-Ú]/.test(newTitle) || !/^\d/.test(newTitle)),
                      });
                    }}
                    className={`bg-transparent outline-none border-b border-transparent hover:border-zinc-300 focus:border-cyan-500 focus:bg-cyan-50/20 rounded-xs px-0.5 transition-colors break-words inline-block ${
                      line.isPrimary ? 'font-bold uppercase tracking-wide' : 'font-normal'
                    }`}
                  >
                    {line.title}
                  </span>
                </div>

                {/* Dotted Leader Line spanning 100% of remaining space */}
                <span className="flex-1 min-w-[20px] mx-1 overflow-hidden select-none pointer-events-none self-baseline h-[1.1em] relative">
                  <span className="inline-block w-full overflow-hidden whitespace-nowrap text-zinc-900 tracking-[3.5px] font-mono text-[11pt]">
                    {'.'.repeat(140)}
                  </span>
                </span>

                {/* Page Number Input */}
                <div className="flex items-baseline shrink-0 space-x-1">
                  <input
                    type="text"
                    value={line.pageNumber}
                    onChange={(e) => handleUpdateLine(idx, { pageNumber: e.target.value.replace(/\D/g, '') || e.target.value })}
                    className={`w-9 text-right bg-transparent outline-none tabular-nums border-b border-transparent hover:border-zinc-300 focus:border-cyan-500 transition-colors ${
                      line.isPrimary ? 'font-bold' : 'font-normal'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveLine(idx)}
                    className="opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 p-0.5 transition-opacity cursor-pointer print:hidden"
                    title="Remover linha"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <textarea
          ref={rawTextareaRef}
          value={content}
          onChange={(e) => onUpdateContent(e.target.value)}
          className="abnt-editor w-full flex-1 text-left bg-transparent outline-none focus:ring-2 focus:ring-cyan-500/50 p-2 border border-zinc-200 rounded font-mono text-[11pt] leading-[1.6] resize-none overflow-y-auto"
          placeholder="Digite o sumário linha por linha (ex: 1 INTRODUÇÃO ... 6)"
        />
      )}
    </div>
  );
}
