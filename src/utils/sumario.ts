import { Page } from '../types';

export interface SumarioItem {
  title: string;
  pageNumber: number;
  level: number;
  isSubSection?: boolean;
}

export interface ParsedSumarioLine {
  id: string;
  raw: string;
  isEntry: boolean;
  title: string;
  pageNumber: string;
  level: number;
  isPrimary: boolean;
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

export function isSumarioPage(page?: { name?: string; heading?: string; type?: string }): boolean {
  if (!page) return false;
  const pageNameLower = (page.name || '').trim().toLowerCase();
  const headingLower = (page.heading || '').trim().toLowerCase();
  return (
    pageNameLower === 'sumário' ||
    pageNameLower === 'sumario' ||
    headingLower === 'sumário' ||
    headingLower === 'sumario'
  );
}

/**
 * Extracts a clean topic title from a line of text that starts with a section number.
 * Preserves the full section title without cutting or truncating words.
 */
export function extractCleanSubSection(rawLine: string): { title: string; level: number } | null {
  const trimmed = rawLine.trim();
  // Match lines starting with numbers like "2.1", "2.3.1", "2.4.1"
  const match = trimmed.match(/^(\d+(\.\d+)+)\s*[-–—:]?\s*(.+)$/);
  if (!match) return null;

  const num = match[1];
  let rest = match[3].trim();

  // If a line is an inline paragraph (e.g. "2.1 Vantagens. Esta pesquisa aborda..."),
  // only separate the title if there is an explicit sentence terminator (. followed by space and another sentence)
  // and the line is long.
  if (rest.length > 90 && /\.\s+[A-ZÀ-Ú]/.test(rest)) {
    rest = rest.split(/\.\s+/)[0].trim();
  }

  // Remove any trailing dots or dashes from manual typing
  rest = rest.replace(/[\.\s\-_–—]+$/, '').trim();

  if (!rest) return null;

  const dotCount = (num.match(/\./g) || []).length;
  const level = dotCount + 1; // 2.1 = level 2, 2.3.1 = level 3

  return {
    title: `${num} ${rest}`,
    level
  };
}

/**
 * Calculates page numbers and generates ABNT Sumário entries automatically based on document pages.
 */
export function generateSumarioEntries(pages: Page[]): SumarioItem[] {
  const items: SumarioItem[] = [];

  // ABNT Rule:
  // Capa is page 1 (counted, unnumbered).
  // Folha de Rosto = page 2 (counted, unnumbered)...
  // Numbering starts being displayed on the first textual element (usually Introdução).
  let currentPageNum = 1;

  pages.forEach((page) => {
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
        let mainLevel = 1;
        const mainMatch = mainTitle.match(/^(\d+(\.\d+)*)/);
        if (mainMatch) {
          const dotCount = (mainMatch[1].match(/\./g) || []).length;
          mainLevel = dotCount + 1;
        }

        items.push({
          title: mainTitle,
          pageNumber: currentPageNum,
          level: mainLevel,
          isSubSection: mainLevel > 1,
        });
      }

      // Check content for sub-headings (e.g., "2.1 Fundamentação Teórica" or "2.3.1 Vantagens")
      if (page.type === 'texto' && page.content) {
        const lines = page.content.split('\n');
        lines.forEach((line) => {
          const parsed = extractCleanSubSection(line);
          if (parsed) {
            // Avoid adding main heading if repeated
            if (parsed.title.toUpperCase() !== mainTitle.toUpperCase()) {
              items.push({
                title: parsed.title,
                pageNumber: currentPageNum,
                level: parsed.level,
                isSubSection: parsed.level > 1,
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
export function syncSumarioPages(pages: Page[], options?: { force?: boolean; ignoreIfEditingIndex?: number }): Page[] {
  const sumarioPageIndex = pages.findIndex(
    (p) => (p.name || '').trim().toLowerCase() === 'sumário' || (p.name || '').trim().toLowerCase() === 'sumario'
  );

  if (sumarioPageIndex === -1) return pages;

  if (options?.ignoreIfEditingIndex === sumarioPageIndex && !options?.force) {
    return pages;
  }

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

  const DOT_LINE_LENGTH = 72;

  return items
    .map((item) => {
      // Level 1: no indent. Level 2: 2 spaces. Level 3+: 4 spaces.
      let indent = '';
      if (item.level === 2) {
        indent = '  ';
      } else if (item.level >= 3) {
        indent = '    ';
      } else if (item.isSubSection) {
        indent = '  ';
      }

      const rawTitle = `${indent}${item.title}`;
      const pageStr = `${item.pageNumber}`;
      
      const dotsNeeded = Math.max(4, DOT_LINE_LENGTH - rawTitle.length - pageStr.length);
      const dots = '.'.repeat(dotsNeeded);

      return `${rawTitle} ${dots} ${pageStr}`;
    })
    .join('\n');
}

/**
 * Parses raw text from a Sumário page into structured items for pixel-perfect ABNT rendering.
 * Supports any spacing or dots format.
 */
export function parseSumarioContent(content: string): ParsedSumarioLine[] {
  if (!content) return [];
  const lines = content.split('\n');

  return lines.map((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return {
        id: `sum-line-${idx}`,
        raw: '',
        isEntry: false,
        title: '',
        pageNumber: '',
        level: 1,
        isPrimary: false,
      };
    }

    // Match section line ending with a page number
    // Extracts the page number at the end and safely removes the dot leader
    const pageNumMatch = line.match(/[\.\s\-_–—]+(\d+)\s*$/);
    if (pageNumMatch) {
      const pageNumber = pageNumMatch[1];
      const beforePage = line.slice(0, line.length - pageNumMatch[0].length);
      const titleWithIndent = beforePage.replace(/[\.\s\-_–—]+$/, '');
      const indentMatch = titleWithIndent.match(/^(\s*)/);
      const indent = indentMatch ? indentMatch[1] : '';
      const title = titleWithIndent.trim();

      if (title) {
        // Determine level:
        let level = 1;
        const leadingSpaces = indent.length;
        if (leadingSpaces >= 4) {
          level = 3;
        } else if (leadingSpaces >= 2) {
          level = 2;
        } else {
          const numMatch = title.match(/^(\d+(\.\d+)+)/);
          if (numMatch) {
            const dots = (numMatch[1].match(/\./g) || []).length;
            level = dots + 1;
          }
        }

        // In ABNT, primary elements (Level 1) are bold uppercase
        const isPrimary = level === 1 && (
          /^\d+\s+[A-ZÀ-Ú]/.test(title) ||
          !/^\d/.test(title)
        );

        return {
          id: `sum-line-${idx}`,
          raw: line,
          isEntry: true,
          title,
          pageNumber,
          level,
          isPrimary,
        };
      }
    }

    // Line with text but no ending page number (e.g. standalone heading or note)
    return {
      id: `sum-line-${idx}`,
      raw: line,
      isEntry: false,
      title: trimmed,
      pageNumber: '',
      level: 1,
      isPrimary: true,
    };
  });
}

/**
 * Rebuilds plain text content from parsed lines when user updates in structured editor.
 */
export function rebuildSumarioContent(lines: ParsedSumarioLine[]): string {
  const DOT_LINE_LENGTH = 70;
  return lines
    .map((line) => {
      if (!line.isEntry) {
        return line.title || line.raw || '';
      }
      const indent = line.level === 2 ? '  ' : line.level >= 3 ? '    ' : '';
      const rawTitle = `${indent}${line.title}`;
      const pageStr = `${line.pageNumber}`;
      const dotsNeeded = Math.max(4, DOT_LINE_LENGTH - rawTitle.length - pageStr.length);
      const dots = '.'.repeat(dotsNeeded);
      return `${rawTitle} ${dots} ${pageStr}`;
    })
    .join('\n');
}

