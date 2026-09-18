export interface BudgetItem {
  id: string;
  material: string;
  unitPrice: string | number;
  quantity: string | number;
}

export function parseNumber(val: string | number | undefined | null): number {
  if (val === undefined || val === null) return 0;
  if (typeof val === 'number') {
    return isNaN(val) ? 0 : val;
  }
  const str = String(val).trim();
  if (!str) return 0;

  // Remove currency symbol, whitespace
  let clean = str.replace(/R\$/gi, '').replace(/\s+/g, '');

  // Handle both Brazilian (1.250,50) and English (1,250.50)
  if (clean.includes(',') && clean.includes('.')) {
    // If dot comes before comma (1.234,56)
    if (clean.indexOf('.') < clean.indexOf(',')) {
      clean = clean.replace(/\./g, '').replace(',', '.');
    } else {
      // (1,234.56)
      clean = clean.replace(/,/g, '');
    }
  } else if (clean.includes(',')) {
    clean = clean.replace(',', '.');
  }

  // Remove anything that isn't digit or dot or minus
  clean = clean.replace(/[^0-9.-]/g, '');

  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
}

export function calculateRowTotal(item: BudgetItem): number {
  const price = parseNumber(item.unitPrice);
  const qty = parseNumber(item.quantity);
  return Math.max(0, price * qty);
}

export function calculateTotalBudget(items: BudgetItem[]): number {
  if (!items || !Array.isArray(items)) return 0;
  return items.reduce((acc, curr) => acc + calculateRowTotal(curr), 0);
}

export function formatBRL(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return 'R$ 0,00';
  }
  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function formatCurrencyValueOnly(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '0,00';
  }
  return amount.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export const DEFAULT_BUDGET_ITEMS: BudgetItem[] = [
  { id: 'item-1', material: 'Sensor de chama', unitPrice: '12,50', quantity: '4' },
  { id: 'item-2', material: "Bombas d'água", unitPrice: '12,90', quantity: '1' },
  { id: 'item-3', material: 'Motor com roda', unitPrice: '17,50', quantity: '2' },
  { id: 'item-4', material: 'Madeira + corte', unitPrice: '20,00', quantity: '6' },
  { id: 'item-5', material: 'Tinta spray', unitPrice: '20,00', quantity: '1' },
  { id: 'item-6', material: 'Dobradiça + fecho', unitPrice: '12,15', quantity: '1' },
  { id: 'item-7', material: 'Caixas de MDF', unitPrice: '4,30', quantity: '2' },
  { id: 'item-8', material: 'Brocas', unitPrice: '3,00', quantity: '3' },
  { id: 'item-9', material: 'Transistor 7805', unitPrice: '2,46', quantity: '1' },
  { id: 'item-10', material: 'Modulo relé', unitPrice: '10,90', quantity: '1' },
  { id: 'item-11', material: 'Mangueira metro', unitPrice: '6,00', quantity: '1' },
  { id: 'item-12', material: 'Roda giratória', unitPrice: '5,00', quantity: '1' },
  { id: 'item-13', material: 'CI L293D', unitPrice: '13,23', quantity: '3' },
  { id: 'item-14', material: 'Borne', unitPrice: '7,20', quantity: '3' },
  { id: 'item-15', material: 'Servo', unitPrice: '23,20', quantity: '1' },
  { id: 'item-16', material: 'Relatório (encadernação)', unitPrice: '50,00', quantity: '1' },
  { id: 'item-17', material: 'Banner (impressão)', unitPrice: '80,00', quantity: '1' },
];
