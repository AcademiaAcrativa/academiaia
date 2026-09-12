import { DocumentState } from '../types';
import { CapaEditor, RostoEditor, TextoEditor } from './PageTemplates';
import { isPreTextualPage } from '../utils/sumario';

export function PrintView({ docState }: { docState: DocumentState }) {
  return (
    <div id="print-container" className="hidden print:block w-full bg-white absolute top-[-9999px] left-[-9999px] z-[-1] print:static print:z-auto">
      {docState.pages.map((page, index) => {
        const pageNumber = index + 1;
        const isPreTextual = isPreTextualPage(page);
        const showPageNumber = !isPreTextual;

        return (
          <div 
            key={page.id} 
            className="page-break-after-always bg-white relative overflow-hidden"
            style={{ 
              width: '794px', 
              height: '1123px',
              fontFamily: docState.fontFamily === 'Arial' ? 'Arial, sans-serif' : '"Times New Roman", serif'
            }}
          >
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

            <div 
              className="absolute"
              style={{
                top: '113px',
                left: '113px',
                right: '76px',
                bottom: '76px',
              }}
            >
              {page.type === 'capa' && <CapaEditor page={page} onUpdate={() => {}} readOnly />}
              {page.type === 'rosto' && <RostoEditor page={page} onUpdate={() => {}} readOnly />}
              {page.type === 'texto' && <TextoEditor page={page} onUpdate={() => {}} readOnly />}
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
