import { Page } from '../types';

export interface SumarioItem {
  title: string;
  pageNumber: number;
  isSubSection?: boolean;
}

export const PRE_TEXTUAL_NAMES = [
  'capa',
  'folha de rosto',
  'dedicatória',
  'dedicatoria',
  'dedicatória(s)',
  'agradecimento',
  'agradecimentos',
  'agradecimento(s)',
  'epígrafe',
  'epigrafe',
  'resumo',
  'resumo na língua vernácula',
  'abstract',
  'resumo em língua estrangeira (abstract)',
  'lista de ilustrações',
  'lista de tabelas',
  'lista de abreviaturas e siglas',
  'lista de símbolos',
  'sumário',
  'sumario'
];

export function isPreTextualPage(page: Page): boolean {
  if (page.type === 'capa' || page.type === 'rosto') return true;
  const pageNameLower = (page.name || '').trim().toLowerCase();
  const headingLower = (page.type === 'texto' && page.heading ? page.heading : '').trim().toLowerCase();

  return PRE_TEXTUAL_NAMES.some(
    (name) => pageNameLower === name || headingLower === name || pageNameLower.includes(name)
  );
}

/**
 * Calculates page numbers and generates ABNT Sumário entries automatically based on document pages.
 */
export function generateSumarioEntries(pages: Page[]): SumarioItem[] {
  const items: SumarioItem[] = [];

  // ABNT Rule:
  // Capa is page 1 (not numbered).
  // Folha de Rosto = page 2 (counted, unnumbered)
  // ...
  // Numbering starts being displayed on the first textual element (usually Introdução).
  //
  // Let's calculate page index for each page in document order.
  let currentPageNum = 1;

  pages.forEach((page) => {
    const pageNameLower = (page.name || '').trim().toLowerCase();
    const headingLower = (page.type === 'texto' && page.heading ? page.heading : '').trim().toLowerCase();

    // Check if this page is pre-textual
    const isPreTextual = isPreTextualPage(page);

    if (!isPreTextual) {
      // Determine title to display in Sumário
      let mainTitle = '';
      if (page.type === 'texto' && page.heading) {
        mainTitle = page.heading.trim();
      } else {
        mainTitle = page.name.trim().toUpperCase();
      }

      if (mainTitle) {
        items.push({
          title: mainTitle,
          pageNumber: currentPageNum,
          isSubSection: false,
        });
      }

      // Check content for sub-headings (e.g., "2.1 Fundamentação Teórica")
      if (page.type === 'texto' && page.content) {
        const lines = page.content.split('\n');
        lines.forEach((line) => {
          const trimmed = line.trim();
          // Regex matching numbered sub-sections like "2.1 Title" or "2.1.1 Title"
          if (/^\d+\.\d+(\.\d+)?\s+[A-Z0-9À-Ú]/.test(trimmed)) {
            // Avoid adding main heading if repeated
            if (trimmed.toUpperCase() !== mainTitle.toUpperCase()) {
              items.push({
                title: trimmed,
                pageNumber: currentPageNum,
                isSubSection: true,
              });
            }
          }
        });
      }
    }

    currentPageNum++;
  });

  return items;
}

/**
 * Automatically syncs Sumário content with all pages in document order.
 */
export function syncSumarioPages(pages: Page[]): Page[] {
  const sumarioPageIndex = pages.findIndex(
    (p) => (p.name || '').trim().toLowerCase() === 'sumário' || (p.name || '').trim().toLowerCase() === 'sumario'
  );

  if (sumarioPageIndex === -1) return pages;

  const entries = generateSumarioEntries(pages);
  const formattedText = formatSumarioText(entries);

  return pages.map((page, index) => {
    if (index === sumarioPageIndex && page.type === 'texto') {
      return {
        ...page,
        content: formattedText,
      };
    }
    return page;
  });
}

/**
 * Formats the items into ABNT dot-aligned text string for the Sumário page.
 */
export function formatSumarioText(items: SumarioItem[]): string {
  if (items.length === 0) {
    return '1 INTRODUÇÃO ............................................................................................ 9\n2 DESENVOLVIMENTO ................................................................................... 10\n3 CONCLUSÃO .............................................................................................. 11\nREFERÊNCIAS ................................................................................................ 12';
  }

  const DOT_LINE_LENGTH = 75;

  return items
    .map((item) => {
      const indent = item.isSubSection ? '  ' : '';
      const rawTitle = `${indent}${item.title}`;
      const pageStr = `${item.pageNumber}`;
      
      const dotsNeeded = Math.max(5, DOT_LINE_LENGTH - rawTitle.length - pageStr.length);
      const dots = '.'.repeat(dotsNeeded);

      return `${rawTitle} ${dots} ${pageStr}`;
    })
    .join('\n');
}
