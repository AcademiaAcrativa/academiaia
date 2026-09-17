import { Page, TextoPage } from '../types';

export const A4_PAGE_LINE_HEIGHT_PX = 24; // 12pt font with 1.5 line-height = 24px
export const A4_CONTENT_HEIGHT_PX = 934;  // 1123px - 113px top - 76px bottom
export const A4_MAX_PAGE_LINES = Math.floor(A4_CONTENT_HEIGHT_PX / A4_PAGE_LINE_HEIGHT_PX); // 38 lines
export const A4_HEADING_LINES = 2; // Bold uppercase heading + bottom margin = ~48px = 2 lines
export const A4_AVG_CHARS_PER_LINE = 72; // Average characters per line in 12pt ABNT text area (605px width)

export interface LineCapacityAnalysis {
  maxLines: number;
  linesUsed: number;
  linesRemaining: number;
  isFull: boolean;
  imagesLines: number;
  headingLines: number;
  textLines: number;
  percentageUsed: number;
}

/**
 * Calculates how many lines of text a given string occupies in 12pt font with 605px line width.
 * Accounts for explicit line breaks and word wrapping.
 */
export function calculateTextLines(text: string): number {
  if (!text || !text.trim()) return 0;

  const rawParagraphs = text.split('\n');
  let totalLines = 0;

  for (let i = 0; i < rawParagraphs.length; i++) {
    const p = rawParagraphs[i];
    if (p.trim().length === 0) {
      // Empty line / paragraph separator
      totalLines += 1;
    } else {
      // Paragraph with content:
      // Minimum 1 line, plus extra lines based on character width
      const pLines = Math.max(1, Math.ceil(p.trim().length / A4_AVG_CHARS_PER_LINE));
      totalLines += pLines;
    }
  }

  return totalLines;
}

/**
 * Analyzes the line capacity of an existing page.
 */
export function analyzePageCapacity(page: Page): LineCapacityAnalysis {
  let headingLines = 0;
  let textLines = 0;
  let imagesLines = 0;

  if (page.type === 'texto') {
    const textoPage = page as TextoPage;
    if (textoPage.heading && textoPage.heading.trim()) {
      headingLines = A4_HEADING_LINES;
    }
    textLines = calculateTextLines(textoPage.content || '');
  }

  if (page.images && page.images.length > 0) {
    const totalImageHeight = page.images.reduce((sum, img) => sum + (img.height || 150) + 20, 0);
    imagesLines = Math.ceil(totalImageHeight / A4_PAGE_LINE_HEIGHT_PX);
  }

  const linesUsed = headingLines + textLines + imagesLines;
  const maxLines = A4_MAX_PAGE_LINES;
  const linesRemaining = Math.max(0, maxLines - linesUsed);
  const isFull = linesRemaining <= 0;
  const percentageUsed = Math.min(100, Math.round((linesUsed / maxLines) * 100));

  return {
    maxLines,
    linesUsed,
    linesRemaining,
    isFull,
    imagesLines,
    headingLines,
    textLines,
    percentageUsed,
  };
}

export interface SubDevelopmentFitResult {
  linesNeeded: number;
  fitsOnCurrentPage: boolean;
  linesUsedBefore: number;
  linesRemainingBefore: number;
  linesRemainingAfter: number;
  explanation: string;
}

/**
 * Tests whether a new development block (title + content) will fit in the specified page.
 */
export function willSubDevelopmentFit(
  page: Page,
  subDev: { number?: string; title: string; content: string }
): SubDevelopmentFitResult {
  const currentAnalysis = analyzePageCapacity(page);
  
  // Format the header line (e.g. "2.2 OBJETIVO DO PROJETO")
  const numStr = (subDev.number || '').trim();
  const titleStr = subDev.title.trim().toUpperCase();
  const header = numStr && titleStr ? `${numStr} ${titleStr}` : numStr || titleStr;

  let linesNeeded = 0;
  // If the page already has content, we need a blank line before the new subtitle (1 line)
  if (page.type === 'texto' && (page as TextoPage).content && (page as TextoPage).content.trim()) {
    linesNeeded += 1;
  }
  // Subtitle itself (1 line)
  if (header) {
    linesNeeded += 1;
  }
  // Subtitle content lines
  if (subDev.content && subDev.content.trim()) {
    linesNeeded += calculateTextLines(subDev.content);
  } else {
    // Empty initial content placeholder
    linesNeeded += 1;
  }

  const fitsOnCurrentPage = linesNeeded <= currentAnalysis.linesRemaining;
  const linesRemainingAfter = Math.max(0, currentAnalysis.linesRemaining - linesNeeded);

  const explanation = fitsOnCurrentPage
    ? `Cabe na mesma folha: ocupa ~${linesNeeded} linhas e a folha atual ainda tem ${currentAnalysis.linesRemaining} linhas disponíveis.`
    : `Não cabe na folha atual: necessita de ~${linesNeeded} linhas, mas restam apenas ${currentAnalysis.linesRemaining} linhas na folha atual. Irá para a próxima folha.`;

  return {
    linesNeeded,
    fitsOnCurrentPage,
    linesUsedBefore: currentAnalysis.linesUsed,
    linesRemainingBefore: currentAnalysis.linesRemaining,
    linesRemainingAfter,
    explanation,
  };
}

/**
 * Finds the next available development section number based on existing pages and their contents.
 * (e.g. if 2.1 and 2.2 exist, returns "2.3")
 */
export function getNextDevelopmentNumber(pages: Page[]): string {
  const existingSubNumbers: number[] = [];

  pages.forEach((page) => {
    if (page.type !== 'texto') return;
    const fullText = `${page.name} ${page.heading || ''} ${page.content || ''}`;
    
    // Match patterns like "2.1", "2.2", "2.14"
    const regex = /\b2\.(\d+)\b/g;
    let match;
    while ((match = regex.exec(fullText)) !== null) {
      const num = parseInt(match[1], 10);
      if (!isNaN(num) && !existingSubNumbers.includes(num)) {
        existingSubNumbers.push(num);
      }
    }
  });

  if (existingSubNumbers.length === 0) {
    return '2.1';
  }

  const maxNum = Math.max(...existingSubNumbers);
  return `2.${maxNum + 1}`;
}
