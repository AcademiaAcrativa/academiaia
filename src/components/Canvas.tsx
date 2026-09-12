import React, { useState, useRef, useEffect } from 'react';
import { DocumentState, Page, DocumentImage } from '../types';
import { CapaEditor, RostoEditor, TextoEditor } from './PageTemplates';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { isPreTextualPage } from '../utils/sumario';

interface Props {
  docState: DocumentState;
  onUpdatePage: (id: string, updates: Partial<Page>) => void;
}

interface DraggableImageProps {
  key?: React.Key;
  image: DocumentImage;
  scale: number;
  onUpdate: (img: DocumentImage) => void;
  onDelete: () => void;
}

function DraggableImage({ 
  image, 
  scale,
  onUpdate,
  onDelete 
}: DraggableImageProps) {
  const [selected, setSelected] = useState(false);

  const handleDragStart = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType !== 'touch' && e.button !== -1) return;
    e.stopPropagation();
    setSelected(true);
    
    try {
      (e.target as Element).setPointerCapture(e.pointerId);
    } catch (err) {}

    const startX = e.clientX;
    const startY = e.clientY;
    const startPosX = image.x;
    const startPosY = image.y;

    const handlePointerMove = (ev: PointerEvent) => {
      const dx = (ev.clientX - startX) / scale;
      const dy = (ev.clientY - startY) / scale;
      onUpdate({ ...image, x: startPosX + dx, y: startPosY + dy });
    };

    const handlePointerUp = (ev: PointerEvent) => {
      try {
        (e.target as Element).releasePointerCapture(ev.pointerId);
      } catch (err) {}
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const handleResizeStart = (e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType !== 'touch' && e.button !== -1) return;
    e.stopPropagation();
    
    try {
      (e.target as Element).setPointerCapture(e.pointerId);
    } catch (err) {}

    const startX = e.clientX;
    const startW = image.width;
    const startH = image.height;
    const aspect = startW / startH;

    const handlePointerMove = (ev: PointerEvent) => {
      const dx = (ev.clientX - startX) / scale;
      const newW = Math.max(20, startW + dx);
      const newH = newW / aspect; 
      onUpdate({ ...image, width: newW, height: newH });
    };

    const handlePointerUp = (ev: PointerEvent) => {
      try {
        (e.target as Element).releasePointerCapture(ev.pointerId);
      } catch (err) {}
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  useEffect(() => {
    if (!selected) return;
    const handleClickOutside = () => setSelected(false);
    window.addEventListener('pointerdown', handleClickOutside);
    return () => window.removeEventListener('pointerdown', handleClickOutside);
  }, [selected]);

  return (
    <div
      className={`absolute cursor-move select-none ${selected ? 'ring-2 ring-cyan-500' : ''}`}
      style={{
        left: image.x,
        top: image.y,
        width: image.width,
        height: image.height,
        zIndex: 100,
        touchAction: 'none'
      }}
      onPointerDown={handleDragStart}
    >
      <img src={image.src} alt="simbolo" className="w-full h-full object-contain pointer-events-none" referrerPolicy="no-referrer" />
      
      {selected && (
        <>
          <div 
            className="absolute -bottom-2 -right-2 w-4 h-4 bg-cyan-500 rounded-full cursor-nwse-resize print:hidden"
            onPointerDown={handleResizeStart}
          />
          <button 
            className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs print:hidden z-10 hover:bg-red-600 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            onPointerDown={(e) => e.stopPropagation()}
          >
            ✕
          </button>
        </>
      )}
    </div>
  );
}

export function Canvas({ docState, onUpdatePage }: Props) {
  const activePageIdx = docState.pages.findIndex(p => p.id === docState.activePageId);
  const activePage = activePageIdx !== -1 ? docState.pages[activePageIdx] : docState.pages[0];
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number>(1);
  const [autoFit, setAutoFit] = useState<boolean>(true);

  const pageNumber = activePageIdx !== -1 ? activePageIdx + 1 : 1;
  const showPageNumber = activePage ? !isPreTextualPage(activePage) : false;

  // Auto-fit scale on mount and window resize (especially critical for cellphones / mobile viewports)
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth;
      if (containerWidth > 0) {
        // Leave 16px padding on mobile (8px left, 8px right), 48px on desktop
        const padding = window.innerWidth < 640 ? 16 : 48;
        const availableWidth = Math.max(200, containerWidth - padding);
        const targetScale = Math.max(0.2, Math.min(1.2, availableWidth / 794));
        if (autoFit) {
          setScale(Number(targetScale.toFixed(2)));
        }
      }
    };

    updateScale();

    const handleResize = () => updateScale();
    window.addEventListener('resize', handleResize);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      ro = new ResizeObserver(updateScale);
      ro.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (ro) ro.disconnect();
    };
  }, [autoFit]);

  if (!activePage) return null;

  const handleZoomIn = () => {
    setAutoFit(false);
    setScale(prev => Math.min(2, Number((prev + 0.15).toFixed(2))));
  };

  const handleZoomOut = () => {
    setAutoFit(false);
    setScale(prev => Math.max(0.25, Number((prev - 0.15).toFixed(2))));
  };

  const handleResetFit = () => {
    setAutoFit(true);
    if (containerRef.current) {
      const containerWidth = containerRef.current.clientWidth;
      const padding = window.innerWidth < 640 ? 16 : 48;
      const availableWidth = Math.max(200, containerWidth - padding);
      const targetScale = Math.max(0.2, Math.min(1.2, availableWidth / 794));
      setScale(Number(targetScale.toFixed(2)));
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 bg-[#1e1e1e] overflow-x-auto overflow-y-auto relative flex flex-col items-center justify-start p-2 sm:p-6 md:p-8 print:hidden select-none"
    >
      {/* Zoom Toolbar Controls (Mobile & Desktop Friendly) */}
      <div className="sticky top-2 z-40 mb-3 bg-[#2a2a2a]/95 backdrop-blur border border-[#404040] rounded-full px-2.5 py-1 sm:px-3 sm:py-1.5 flex items-center space-x-2 sm:space-x-3 text-xs text-zinc-300 shadow-xl shrink-0">
        <button 
          onClick={handleZoomOut} 
          className="p-1 hover:text-white hover:bg-[#383838] rounded-full transition-colors"
          title="Diminuir Zoom"
        >
          <ZoomOut size={15} />
        </button>
        <span className="font-mono text-[10px] sm:text-[11px] min-w-[38px] text-center text-cyan-400 font-semibold">
          {Math.round(scale * 100)}%
        </span>
        <button 
          onClick={handleZoomIn} 
          className="p-1 hover:text-white hover:bg-[#383838] rounded-full transition-colors"
          title="Aumentar Zoom"
        >
          <ZoomIn size={15} />
        </button>
        <div className="h-3 w-[1px] bg-[#454545]" />
        <button 
          onClick={handleResetFit} 
          className={`flex items-center space-x-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full transition-colors text-[10px] sm:text-[11px] ${
            autoFit ? 'bg-cyan-500/20 text-cyan-400 font-medium' : 'hover:bg-[#383838] text-zinc-400'
          }`}
          title="Ajustar à Tela do Celular / Monitor"
        >
          <Maximize2 size={12} />
          <span>Ajustar Tela</span>
        </button>
      </div>

      {/* Scaled A4 Container - Exactly dimensioned to prevent overflow & miscentering */}
      <div 
        className="my-auto transition-all duration-150 ease-out shrink-0 relative"
        style={{
          width: `${794 * scale}px`,
          height: `${1123 * scale}px`,
        }}
      >
        <div 
          className="absolute top-0 left-0 bg-white shadow-2xl shadow-black/80 text-black origin-top-left rounded-xs overflow-hidden"
          style={{ 
            width: '794px', 
            height: '1123px',
            transform: `scale(${scale})`,
            fontFamily: docState.fontFamily === 'Arial' ? 'Arial, sans-serif' : '"Times New Roman", serif'
          }}
        >
          {/* Guides (visible only on screen) */}
          <div className="absolute top-0 bottom-0 left-[113px] w-[1px] bg-cyan-400/60 pointer-events-none z-50 mix-blend-difference" />
          <div className="absolute top-0 bottom-0 right-[76px] w-[1px] bg-cyan-400/60 pointer-events-none z-50 mix-blend-difference" />
          <div className="absolute left-0 right-0 top-[113px] h-[1px] bg-cyan-400/60 pointer-events-none z-50 mix-blend-difference" />
          <div className="absolute left-0 right-0 bottom-[76px] h-[1px] bg-cyan-400/60 pointer-events-none z-50 mix-blend-difference" />

          {/* ABNT Page Number (2cm from top, 2cm from right on textual pages) */}
          {showPageNumber && (
            <div 
              className="absolute text-[10pt] text-black font-normal select-none pointer-events-none"
              style={{
                top: '40px',
                right: '76px',
              }}
            >
              {pageNumber}
            </div>
          )}

          {/* Content Area within Margins */}
          <div 
            className="absolute select-text"
            style={{
              top: '113px',
              left: '113px',
              right: '76px',
              bottom: '76px',
            }}
          >
            {activePage.type === 'capa' && (
              <CapaEditor page={activePage} onUpdate={(updates) => onUpdatePage(activePage.id, updates)} />
            )}
            {activePage.type === 'rosto' && (
              <RostoEditor page={activePage} onUpdate={(updates) => onUpdatePage(activePage.id, updates)} />
            )}
            {activePage.type === 'texto' && (
              <TextoEditor page={activePage} onUpdate={(updates) => onUpdatePage(activePage.id, updates)} />
            )}
          </div>

          {/* Draggable Images Layer */}
          {activePage.images?.map(image => (
            <DraggableImage 
              key={image.id}
              image={image}
              scale={scale}
              onUpdate={(updatedImage) => {
                const newImages = activePage.images?.map(img => img.id === image.id ? updatedImage : img) || [];
                onUpdatePage(activePage.id, { images: newImages });
              }}
              onDelete={() => {
                const newImages = activePage.images?.filter(img => img.id !== image.id) || [];
                onUpdatePage(activePage.id, { images: newImages });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

