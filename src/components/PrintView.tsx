import { DocumentState, CapaPage, RostoPage, TextoPage } from '../types';
import { isPreTextualPage } from '../utils/sumario';

function CapaPrint({ page }: { page: CapaPage }) {
  return (
    <div className="flex flex-col h-full text-center text-black font-bold text-[14pt] leading-[1.5] relative select-text">
      {/* Logo Eterj */}
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
        <div className="w-full text-center uppercase tracking-wide">
          {page.institution || 'ESCOLA TÉCNICA DO RIO DE JANEIRO'}
        </div>
        <div className="flex flex-col items-center space-y-1">
          <div className="font-bold uppercase text-[12pt] tracking-wide text-black mb-1">NOMES</div>
          <div className="w-full text-center uppercase leading-[1.4] whitespace-pre-wrap font-bold text-[12pt]">
            {page.author || ''}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center space-y-4">
        <div className="w-full text-center uppercase font-bold text-[16pt] leading-[1.3] whitespace-pre-wrap">
          {page.title || ''}
        </div>
        {page.subtitle && (
          <div className="w-full text-center font-normal text-[13pt] text-black">
            {page.subtitle}
          </div>
        )}
      </div>

      <div className="space-y-[12px] pb-[10px]">
        <div className="w-full text-center uppercase font-bold">
          {page.city || 'RIO DE JANEIRO - RJ'}
        </div>
        <div className="w-full text-center uppercase font-bold">
          {page.year || '2024'}
        </div>
      </div>
    </div>
  );
}

function RostoPrint({ page }: { page: RostoPage }) {
  return (
    <div className="flex flex-col h-full text-center text-black leading-[1.5] relative select-text">
      <div className="flex flex-col items-center space-y-1 pt-[10px]">
        <div className="font-bold uppercase text-[12pt] tracking-wide text-black mb-1">NOMES</div>
        <div className="w-full text-center font-normal text-[13pt] uppercase leading-[1.4] whitespace-pre-wrap">
          {page.author || ''}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center pt-[100px]">
        <div className="w-full text-center font-bold text-[15pt] uppercase leading-[1.3] whitespace-pre-wrap">
          {page.title || ''}
        </div>
        {page.subtitle && (
          <div className="w-full text-center font-normal text-[13pt] mt-2">
            {page.subtitle}
          </div>
        )}
        
        <div className="w-full flex justify-end mt-[70px]">
          {/* 8cm from left margin ≈ 303px width */}
          <div style={{ width: '303px' }} className="text-left">
            <div className="w-full text-justify font-normal text-[11pt] leading-[1.2] whitespace-pre-wrap">
              {page.note || ''}
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-[12px] pb-[10px]">
        <div className="w-full text-center font-bold text-[13pt] uppercase">
          {page.city || 'RIO DE JANEIRO - RJ'}
        </div>
        <div className="w-full text-center font-bold text-[13pt] uppercase">
          {page.year || '2024'}
        </div>
      </div>
    </div>
  );
}

function TextoPrint({ page }: { page: TextoPage }) {
  const isNumbered = /^[0-9]/.test(page.heading || '');
  const isResumo = page.heading?.includes('RESUMO') || page.heading?.includes('ABSTRACT');
  
  const headingAlignment = isNumbered ? 'text-left' : 'text-center';
  const contentSize = isResumo ? 'text-[10pt]' : 'text-[12pt]';
  const contentLeading = isResumo ? 'leading-[1.15]' : 'leading-[1.5]';

  return (
    <div className={`flex flex-col h-full text-black ${contentSize} ${contentLeading} relative select-text`}>
      {/* Logo Eterj */}
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
        <div className={`w-full font-bold uppercase mb-[1.5em] mt-[30px] ${headingAlignment} tracking-wide text-[12pt]`}>
          {page.heading}
        </div>
      )}

      <div className="abnt-editor w-full flex-1 text-justify overflow-hidden whitespace-pre-wrap text-black">
        {page.content || ''}
      </div>
    </div>
  );
}

export function PrintView({ docState }: { docState: DocumentState }) {
  return (
    <div 
      id="print-container" 
      className="w-[794px] bg-white text-black"
      style={{
        fontFamily: docState.fontFamily === 'Arial' ? 'Arial, sans-serif' : '"Times New Roman", serif'
      }}
    >
      {docState.pages.map((page, index) => {
        const pageNumber = index + 1;
        const isPreTextual = isPreTextualPage(page);
        const showPageNumber = !isPreTextual;

        return (
          <div 
            key={page.id} 
            className="abnt-pdf-page abnt-page-break page-break-after-always bg-white relative overflow-hidden shrink-0"
            style={{ 
              width: '794px', 
              height: '1123px',
              pageBreakAfter: 'always',
              breakAfter: 'page',
              position: 'relative'
            }}
          >
            {/* ABNT Page Number (2cm from top, 2cm from right on textual pages) */}
            {showPageNumber && (
              <div 
                className="absolute text-[10pt] text-black font-normal select-none pointer-events-none"
                style={{
                  top: '40px',
                  right: '76px',
                  zIndex: 20
                }}
              >
                {pageNumber}
              </div>
            )}

            {/* Content Area within ABNT Margins (3cm top, 3cm left, 2cm right, 2cm bottom) */}
            <div 
              className="absolute"
              style={{
                top: '113px',
                left: '113px',
                right: '76px',
                bottom: '76px',
                zIndex: 10
              }}
            >
              {page.type === 'capa' && <CapaPrint page={page} />}
              {page.type === 'rosto' && <RostoPrint page={page} />}
              {page.type === 'texto' && <TextoPrint page={page} />}
            </div>

            {/* Render Draggable Images Layer for Print */}
            {page.images?.map(image => (
              <img
                key={image.id}
                src={image.src}
                alt="imagem"
                className="absolute object-contain pointer-events-none"
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                style={{
                  left: `${image.x}px`,
                  top: `${image.y}px`,
                  width: `${image.width}px`,
                  height: `${image.height}px`,
                  zIndex: 100,
                }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
