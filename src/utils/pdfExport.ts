import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas-pro';
import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

/**
 * Converte qualquer imagem externa (se houver CORS) para Base64 DataURL
 * prevenindo que o html2canvas seja bloqueado ou falhe por segurança.
 */
export async function ensureImageAsDataUrl(src: string): Promise<string> {
  if (!src || src.startsWith('data:')) return src;

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.referrerPolicy = 'no-referrer';

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || img.width || 300;
        canvas.height = img.naturalHeight || img.height || 200;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          canvas.width = 0;
          canvas.height = 0;
          return resolve(dataUrl);
        }
      } catch (e) {
        console.warn('Falha ao converter imagem para base64, mantendo src original:', e);
      }
      resolve(src);
    };

    img.onerror = () => {
      console.warn('Erro no carregamento de imagem externa, mantendo src:', src);
      resolve(src);
    };

    img.src = src;
  });
}

/**
 * Gera e baixa o documento ABNT diretamente como PDF.
 * Usa um contêiner de staging isolado página por página:
 * 1. Nunca captura modais, spinners ou botões da interface.
 * 2. Mantém o uso de memória mínimo no celular (libera o canvas após cada página).
 * 3. Garante que cada folha seja renderizada nas exatas dimensões ABNT A4 (794x1123px).
 */
export async function generateDirectPDF(
  wrapperId: string,
  fileName: string,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) {
    throw new Error('Elemento de páginas para exportação não encontrado no DOM.');
  }

  // Coleta as páginas ABNT renderizadas
  const pageElements = Array.from(wrapper.querySelectorAll<HTMLElement>('.abnt-pdf-page'));
  if (pageElements.length === 0) {
    throw new Error('Nenhuma página ABNT encontrada para gerar o PDF.');
  }

  const totalPages = pageElements.length;

  // Cria um contêiner de staging isolado no topo do body (fora do fluxo visual)
  const staging = document.createElement('div');
  staging.id = 'pdf-staging-export-box';
  staging.style.position = 'absolute';
  staging.style.left = '0';
  staging.style.top = '0';
  staging.style.width = '794px';
  staging.style.height = '1123px';
  staging.style.overflow = 'hidden';
  staging.style.backgroundColor = '#ffffff';
  staging.style.zIndex = '-99999';
  staging.style.pointerEvents = 'none';
  staging.style.opacity = '1';
  document.body.appendChild(staging);

  const isMobile = typeof navigator !== 'undefined' && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  // No celular usa escala 1.5 para preservar memória e evitar crash de canvas; no desktop usa 2 para máxima nitidez
  const renderScale = isMobile ? 1.5 : 2;

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  try {
    for (let i = 0; i < totalPages; i++) {
      onProgress?.(i + 1, totalPages);

      const originalPage = pageElements[i];

      // Clona apenas a página atual no staging isolado
      staging.innerHTML = '';
      const clone = originalPage.cloneNode(true) as HTMLElement;
      clone.style.width = '794px';
      clone.style.height = '1123px';
      clone.style.position = 'relative';
      clone.style.margin = '0';
      staging.appendChild(clone);

      // Garante que todas as imagens no clone estejam prontas
      const cloneImgs = Array.from(staging.querySelectorAll<HTMLImageElement>('img'));
      await Promise.all(
        cloneImgs.map((img) => {
          if (img.complete && img.naturalWidth > 0) return Promise.resolve();
          return new Promise<void>((res) => {
            img.onload = () => res();
            img.onerror = () => res();
            setTimeout(res, 2500);
          });
        })
      );

      // Pequena pausa para garantir pintura e layout das fontes
      await new Promise((resolve) => setTimeout(resolve, 60));

      const canvas = await html2canvas(staging, {
        scale: renderScale,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: 1123,
        windowWidth: 794,
        windowHeight: 1123,
        scrollX: 0,
        scrollY: 0,
        imageTimeout: 10000,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.96);

      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');

      // Limpeza imediata da memória de vídeo do canvas
      canvas.width = 0;
      canvas.height = 0;
    }

    // Salva ou baixa o arquivo PDF
    if (Capacitor.isNativePlatform()) {
      const pdfDataUri = pdf.output('datauristring');
      const base64Data = pdfDataUri.split(',')[1];

      await Filesystem.writeFile({
        path: fileName,
        data: base64Data,
        directory: Directory.Documents,
      });

      alert('✅ PDF salvo com sucesso na sua pasta de Documentos!');
    } else {
      const pdfBlob = pdf.output('blob');
      const blobUrl = URL.createObjectURL(pdfBlob);

      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = fileName;
      downloadLink.style.display = 'none';
      document.body.appendChild(downloadLink);
      downloadLink.click();

      // Mantém o Blob URL ativo por 60s para navegadores mobile terminarem o download
      setTimeout(() => {
        if (downloadLink.parentNode) {
          downloadLink.parentNode.removeChild(downloadLink);
        }
        URL.revokeObjectURL(blobUrl);
      }, 60000);
    }
  } finally {
    // Remove o staging element do DOM
    if (staging.parentNode) {
      staging.parentNode.removeChild(staging);
    }
  }
}
