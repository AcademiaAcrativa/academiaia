import { useRef, useEffect } from 'react';
import { CapaPage, RostoPage, TextoPage } from '../types';

export function CapaEditor({ page, onUpdate, readOnly = false }: { page: CapaPage, onUpdate: (u: Partial<CapaPage>) => void, readOnly?: boolean }) {
  return (
    <div className="flex flex-col h-full text-center text-black font-bold text-[14pt] leading-[1.5] relative">
      <div className="absolute -top-[113px] left-0 right-0 flex justify-start pointer-events-none">
        <img 
          src="https://res.cloudinary.com/ogrsouif/image/upload/v1788476606/eterj-escola-tecnica-do-rio-de-janeiro.png" 
          alt="Eterj Logo" 
          className="w-[173px] h-[130px] object-contain object-left pointer-events-auto"
          style={{ width: '173px', height: '130px' }}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="space-y-[48px] pt-[20px]">
        <input 
          value={page.institution}
          onChange={(e) => onUpdate({ institution: e.target.value.toUpperCase() })}
          className={`w-full text-center bg-transparent outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-cyan-500/5 transition-all placeholder:text-gray-300 uppercase ${readOnly ? 'pointer-events-none' : ''}`}
          placeholder="NOME DA INSTITUIÇÃO"
          readOnly={readOnly}
        />
        <div className="flex flex-col items-center space-y-1">
          <div className="font-bold uppercase text-[12pt] tracking-wide text-black mb-1">NOMES</div>
          <textarea
            value={page.author}
            onChange={(e) => onUpdate({ author: e.target.value.toUpperCase() })}
            className={`w-full text-center bg-transparent outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-cyan-500/5 transition-all resize-none placeholder:text-gray-300 uppercase leading-[1.4] ${readOnly ? 'pointer-events-none' : ''}`}
            placeholder="NOME DOS AUTORES"
            rows={7}
            readOnly={readOnly}
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <textarea
          value={page.title}
          onChange={(e) => onUpdate({ title: e.target.value.toUpperCase() })}
          className={`w-full text-center bg-transparent outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-cyan-500/5 transition-all resize-none placeholder:text-gray-300 overflow-hidden uppercase ${readOnly ? 'pointer-events-none' : ''}`}
          placeholder="TÍTULO DO TRABALHO"
          rows={3}
          readOnly={readOnly}
        />
        <input 
          value={page.subtitle}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          className={`w-full text-center font-normal bg-transparent outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-cyan-500/5 transition-all placeholder:text-gray-300 ${readOnly ? 'pointer-events-none' : ''}`}
          placeholder="Subtítulo do trabalho (se houver)"
          readOnly={readOnly}
        />
      </div>

      <div className="space-y-[12px]">
        <input 
          value={page.city}
          onChange={(e) => onUpdate({ city: e.target.value })}
          className={`w-full text-center bg-transparent outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-cyan-500/5 transition-all placeholder:text-gray-300 uppercase ${readOnly ? 'pointer-events-none' : ''}`}
          placeholder="CIDADE"
          readOnly={readOnly}
        />
        <input 
          value={page.year}
          onChange={(e) => onUpdate({ year: e.target.value })}
          className={`w-full text-center bg-transparent outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-cyan-500/5 transition-all placeholder:text-gray-300 uppercase ${readOnly ? 'pointer-events-none' : ''}`}
          placeholder="ANO"
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}

export function RostoEditor({ page, onUpdate, readOnly = false }: { page: RostoPage, onUpdate: (u: Partial<RostoPage>) => void, readOnly?: boolean }) {
  return (
    <div className="flex flex-col h-full text-center text-black leading-[1.5]">
      <div className="flex flex-col items-center space-y-1">
        <div className="font-bold uppercase text-[12pt] tracking-wide text-black mb-1">NOMES</div>
        <textarea
          value={page.author}
          onChange={(e) => onUpdate({ author: e.target.value.toUpperCase() })}
          className={`w-full text-center font-normal text-[14pt] uppercase bg-transparent outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-cyan-500/5 transition-all resize-none placeholder:text-gray-300 leading-[1.4] ${readOnly ? 'pointer-events-none' : ''}`}
          placeholder="NOME DOS AUTORES"
          rows={7}
          readOnly={readOnly}
        />
      </div>

      <div className="flex-1 flex flex-col items-center pt-[120px]">
        <textarea
          value={page.title}
          onChange={(e) => onUpdate({ title: e.target.value.toUpperCase() })}
          className={`w-full text-center font-bold text-[14pt] uppercase bg-transparent outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-cyan-500/5 transition-all resize-none placeholder:text-gray-300 ${readOnly ? 'pointer-events-none' : ''}`}
          placeholder="TÍTULO DO TRABALHO"
          rows={2}
          readOnly={readOnly}
        />
        <input
          value={page.subtitle}
          onChange={(e) => onUpdate({ subtitle: e.target.value })}
          className={`w-full text-center font-normal text-[14pt] bg-transparent outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-cyan-500/5 transition-all placeholder:text-gray-300 mt-2 ${readOnly ? 'pointer-events-none' : ''}`}
          placeholder="Subtítulo (se houver)"
          readOnly={readOnly}
        />
        
        <div className="w-full flex justify-end mt-[80px]">
          {/* 8cm from left margin ≈ 302px indent */}
          <div style={{ width: '303px' }} className="text-left">
             <textarea
               value={page.note}
               onChange={(e) => onUpdate({ note: e.target.value })}
               className={`w-full text-justify font-normal text-[12pt] leading-[1.0] bg-transparent outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-cyan-500/5 transition-all resize-none placeholder:text-gray-300 ${readOnly ? 'pointer-events-none' : ''}`}
               placeholder="Nota indicativa (ex: Trabalho de Conclusão de Curso apresentado à...)"
               rows={8}
               readOnly={readOnly}
             />
          </div>
        </div>
      </div>

      <div className="space-y-[12px]">
        <input 
          value={page.city}
          onChange={(e) => onUpdate({ city: e.target.value })}
          className={`w-full text-center font-bold text-[14pt] uppercase bg-transparent outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-cyan-500/5 transition-all placeholder:text-gray-300 ${readOnly ? 'pointer-events-none' : ''}`}
          placeholder="CIDADE"
          readOnly={readOnly}
        />
        <input 
          value={page.year}
          onChange={(e) => onUpdate({ year: e.target.value })}
          className={`w-full text-center font-bold text-[14pt] uppercase bg-transparent outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-cyan-500/5 transition-all placeholder:text-gray-300 ${readOnly ? 'pointer-events-none' : ''}`}
          placeholder="ANO"
          readOnly={readOnly}
        />
      </div>
    </div>
  );
}

export function TextoEditor({ page, onUpdate, readOnly = false }: { page: TextoPage, onUpdate: (u: Partial<TextoPage>) => void, readOnly?: boolean }) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerText !== page.content) {
      contentRef.current.innerText = page.content;
    }
  }, [page.content]);

  const handleBlur = () => {
    if (contentRef.current) {
      onUpdate({ content: contentRef.current.innerText });
    }
  };

  const handleInput = () => {
    if (contentRef.current) {
      onUpdate({ content: contentRef.current.innerText });
    }
  };

  const isNumbered = /^[0-9]/.test(page.heading || '');
  const isResumo = page.heading?.includes('RESUMO') || page.heading?.includes('ABSTRACT');
  
  const headingAlignment = isNumbered ? 'text-left' : 'text-center';
  const contentSize = isResumo ? 'text-[10pt]' : 'text-[12pt]';
  const contentLeading = isResumo ? 'leading-[1.15]' : 'leading-[1.5]';

  return (
    <div className={`flex flex-col h-full text-black ${contentSize} ${contentLeading} relative`}>
      <div className="absolute -top-[113px] left-0 right-0 flex justify-start pointer-events-none">
        <img 
          src="https://res.cloudinary.com/ogrsouif/image/upload/v1788476606/eterj-escola-tecnica-do-rio-de-janeiro.png" 
          alt="Eterj Logo" 
          className="w-[173px] h-[130px] object-contain object-left pointer-events-auto"
          style={{ width: '173px', height: '130px' }}
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </div>
      {page.heading && (
        <input
          value={page.heading}
          onChange={(e) => onUpdate({ heading: e.target.value.toUpperCase() })}
          className={`w-full font-bold uppercase mb-[1.5em] mt-[30px] ${headingAlignment} bg-transparent outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-cyan-500/5 transition-all ${readOnly ? 'pointer-events-none' : ''}`}
          placeholder="TÍTULO DA SEÇÃO"
          readOnly={readOnly}
        />
      )}
      <div
        ref={contentRef}
        contentEditable={!readOnly}
        onBlur={handleBlur}
        onInput={handleInput}
        className={`abnt-editor w-full flex-1 text-justify bg-transparent outline-none focus:ring-2 focus:ring-cyan-500/50 focus:bg-cyan-500/5 transition-all overflow-auto whitespace-pre-wrap ${page.content === '' ? 'empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300' : ''}`}
        data-placeholder="Digite o conteúdo do relatório aqui..."
      />
    </div>
  );
}
