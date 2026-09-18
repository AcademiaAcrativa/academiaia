export type PageType = 'capa' | 'rosto' | 'texto' | 'tabela';
export type FontFamily = 'Arial' | 'Times New Roman';

export interface DocumentImage {
  id: string;
  src: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface BudgetItem {
  id: string;
  material: string;
  unitPrice: string | number;
  quantity: string | number;
}

export interface BasePage {
  id: string;
  type: PageType;
  name: string;
  images?: DocumentImage[];
}

export interface CapaPage extends BasePage {
  type: 'capa';
  institution: string;
  author: string;
  title: string;
  subtitle: string;
  city: string;
  year: string;
}

export interface RostoPage extends BasePage {
  type: 'rosto';
  author: string;
  title: string;
  subtitle: string;
  note: string;
  city: string;
  year: string;
}

export interface TextoPage extends BasePage {
  type: 'texto';
  heading: string;
  content: string;
}

export interface TabelaPage extends BasePage {
  type: 'tabela';
  heading: string;
  items: BudgetItem[];
  notes?: string;
}

export type Page = CapaPage | RostoPage | TextoPage | TabelaPage;

export interface DocumentState {
  fontFamily: FontFamily;
  pages: Page[];
  activePageId: string | null;
}
