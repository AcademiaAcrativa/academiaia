import { useState } from 'react';
import { TabelaPage, BudgetItem } from '../types';
import { ETERJ_LOGO_BASE64 } from '../assets/eterjLogo';
import { 
  calculateRowTotal, 
  calculateTotalBudget, 
  formatBRL, 
  DEFAULT_BUDGET_ITEMS 
} from '../utils/budgetUtils';
import { Plus, Trash2, RotateCcw, Calculator, ArrowDownUp } from 'lucide-react';

interface EditorProps {
  page: TabelaPage;
  onUpdate: (updates: Partial<TabelaPage>) => void;
}

export function TabelaEditor({ page, onUpdate }: EditorProps) {
  const items = page.items || [];
  const totalBudget = calculateTotalBudget(items);

  const handleUpdateItem = (id: string, field: keyof BudgetItem, value: string) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    onUpdate({ items: updated });
  };

  const handleAddItem = () => {
    const newItem: BudgetItem = {
      id: Math.random().toString(36).substring(2, 9),
      material: '',
      unitPrice: '',
      quantity: '1',
    };
    onUpdate({ items: [...items, newItem] });
  };

  const handleDeleteItem = (id: string) => {
    onUpdate({ items: items.filter((item) => item.id !== id) });
  };

  const handleResetDefaults = () => {
    onUpdate({ items: DEFAULT_BUDGET_ITEMS });
  };

  const handleClearAll = () => {
    onUpdate({ items: [] });
  };

  return (
    <div className="flex flex-col h-full text-black text-[11pt] leading-normal relative select-text">
      {/* Logo Eterj */}
      <div className="absolute -top-[113px] left-0 right-0 flex justify-start pointer-events-none">
        <img 
          src={ETERJ_LOGO_BASE64} 
          alt="Eterj Logo" 
          className="w-[173px] h-[130px] object-contain object-left pointer-events-auto"
          style={{ width: '173px', height: '130px' }}
        />
      </div>

      {/* Heading / Title */}
      <div className="w-full mt-[30px] mb-3">
        <input
          type="text"
          value={page.heading ?? '5 PLANO DE ORÇAMENTOS'}
          onChange={(e) => onUpdate({ heading: e.target.value.toUpperCase() })}
          placeholder="5 PLANO DE ORÇAMENTOS"
          className="w-full font-bold uppercase tracking-wide text-[12pt] bg-transparent border-b border-dashed border-gray-300 hover:border-cyan-500 focus:border-cyan-600 focus:outline-none py-1 text-left text-black"
        />
      </div>

      {/* Info helper banner in editor */}
      <div className="mb-2.5 px-3 py-1.5 bg-blue-50/80 border border-blue-200 rounded-md text-[10px] text-blue-800 flex items-center justify-between print:hidden">
        <div className="flex items-center space-x-1.5">
          <Calculator size={14} className="text-blue-600 shrink-0" />
          <span>
            <strong>Cálculo Automático Ativo:</strong> altere ou apague valores para recalcular automaticamente linha a linha e o total geral.
          </span>
        </div>
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={handleResetDefaults}
            title="Preencher com os materiais do projeto ETERJ"
            className="text-[10px] px-2 py-0.5 bg-white border border-blue-300 rounded hover:bg-blue-100 transition-colors font-medium text-blue-700 cursor-pointer flex items-center space-x-1"
          >
            <RotateCcw size={10} />
            <span>Exemplo ETERJ</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="w-full flex-1 overflow-x-auto pb-4">
        <table className="w-full border-collapse border border-black text-[10pt] font-sans">
          <thead>
            <tr className="bg-gray-100 text-black font-bold">
              <th className="border border-black px-2 py-1.5 text-left w-[42%]">
                Materiais
              </th>
              <th className="border border-black px-2 py-1.5 text-right w-[21%]">
                Preço por unidade (R$)
              </th>
              <th className="border border-black px-2 py-1.5 text-center w-[13%]">
                Quantidade
              </th>
              <th className="border border-black px-2 py-1.5 text-right w-[19%]">
                Valor final (R$)
              </th>
              <th className="border border-black px-1 py-1 text-center w-[5%] print:hidden">
                &nbsp;
              </th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={5} className="border border-black text-center py-6 text-gray-500 italic">
                  Nenhum material adicionado. Clique no botão abaixo para adicionar itens à tabela.
                </td>
              </tr>
            ) : (
              items.map((item, index) => {
                const rowTotal = calculateRowTotal(item);
                return (
                  <tr key={item.id || index} className="hover:bg-cyan-50/40 transition-colors group">
                    {/* Material Name */}
                    <td className="border border-black p-1">
                      <input
                        type="text"
                        value={item.material}
                        onChange={(e) => handleUpdateItem(item.id, 'material', e.target.value)}
                        placeholder="Ex: Sensor de chama"
                        className="w-full bg-transparent px-1.5 py-0.5 focus:outline-none focus:bg-white focus:ring-1 focus:ring-cyan-500 rounded text-[10pt] text-black"
                      />
                    </td>

                    {/* Unit Price */}
                    <td className="border border-black p-1">
                      <div className="flex items-center justify-end space-x-1">
                        <span className="text-gray-500 text-[9pt]">R$</span>
                        <input
                          type="text"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(item.id, 'unitPrice', e.target.value)}
                          placeholder="0,00"
                          className="w-20 text-right bg-transparent px-1 py-0.5 focus:outline-none focus:bg-white focus:ring-1 focus:ring-cyan-500 rounded font-mono text-[10pt] text-black"
                        />
                      </div>
                    </td>

                    {/* Quantity */}
                    <td className="border border-black p-1">
                      <input
                        type="text"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
                        placeholder="1"
                        className="w-full text-center bg-transparent px-1 py-0.5 focus:outline-none focus:bg-white focus:ring-1 focus:ring-cyan-500 rounded font-mono text-[10pt] text-black"
                      />
                    </td>

                    {/* Auto-calculated Total for row */}
                    <td className="border border-black px-2 py-1 text-right font-medium text-black bg-gray-50/50">
                      <span className="font-mono">{formatBRL(rowTotal)}</span>
                    </td>

                    {/* Delete row button */}
                    <td className="border border-black p-0.5 text-center print:hidden">
                      <button
                        type="button"
                        onClick={() => handleDeleteItem(item.id)}
                        className="opacity-20 group-hover:opacity-100 hover:text-red-600 p-1 transition-opacity cursor-pointer text-gray-600"
                        title="Remover linha"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}

            {/* Total Row */}
            <tr className="bg-gray-100 font-bold text-black border-t-2 border-black">
              <td colSpan={3} className="border border-black px-3 py-1.5 text-right uppercase tracking-wider text-[10pt]">
                TOTAL GERAL (R$):
              </td>
              <td className="border border-black px-2 py-1.5 text-right text-[10.5pt] font-mono text-black">
                {formatBRL(totalBudget)}
              </td>
              <td className="border border-black print:hidden bg-gray-100">&nbsp;</td>
            </tr>
          </tbody>
        </table>

        {/* Action buttons */}
        <div className="mt-3 flex items-center justify-between print:hidden">
          <button
            type="button"
            onClick={handleAddItem}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Plus size={14} />
            <span>+ Adicionar Material / Linha</span>
          </button>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-xs text-gray-600 hover:text-black underline cursor-pointer"
            >
              Restaurar Lista Padrão (17 itens)
            </button>
            {items.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs text-red-600 hover:text-red-800 underline cursor-pointer ml-2"
              >
                Limpar Tudo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TabelaPrintView({ page }: { page: TabelaPage }) {
  const items = page.items || [];
  const totalBudget = calculateTotalBudget(items);

  return (
    <div className="flex flex-col h-full text-black text-[12pt] leading-[1.5] relative select-text">
      {/* Logo Eterj */}
      <div className="absolute -top-[113px] left-0 right-0 flex justify-start pointer-events-none">
        <img 
          src={ETERJ_LOGO_BASE64} 
          alt="Eterj Logo" 
          className="w-[173px] h-[130px] object-contain object-left pointer-events-auto"
          style={{ width: '173px', height: '130px' }}
        />
      </div>

      {/* Heading */}
      <div className="w-full font-bold uppercase mb-[1.5em] mt-[30px] text-left tracking-wide text-[12pt]">
        {page.heading || '5 PLANO DE ORÇAMENTOS'}
      </div>

      {/* Static Print Table */}
      <div className="w-full flex-1 overflow-hidden">
        <table 
          className="w-full border-collapse border border-black text-[9.5pt]"
          style={{ borderCollapse: 'collapse' }}
        >
          <thead>
            <tr className="bg-gray-100 text-black font-bold">
              <th className="border border-black px-2 py-1 text-left" style={{ width: '42%', borderWidth: '1px' }}>
                Materiais
              </th>
              <th className="border border-black px-2 py-1 text-center" style={{ width: '22%', borderWidth: '1px' }}>
                Preço por unidade (R$)
              </th>
              <th className="border border-black px-2 py-1 text-center" style={{ width: '14%', borderWidth: '1px' }}>
                Quantidade
              </th>
              <th className="border border-black px-2 py-1 text-center" style={{ width: '22%', borderWidth: '1px' }}>
                Valor final (R$)
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => {
              const rowTotal = calculateRowTotal(item);
              return (
                <tr key={item.id || idx}>
                  <td className="border border-black px-2 py-0.5 text-left" style={{ borderWidth: '1px' }}>
                    {item.material}
                  </td>
                  <td className="border border-black px-2 py-0.5 text-right font-mono" style={{ borderWidth: '1px' }}>
                    {formatBRL(typeof item.unitPrice === 'number' ? item.unitPrice : parseFloat(String(item.unitPrice).replace(',', '.')) || 0)}
                  </td>
                  <td className="border border-black px-2 py-0.5 text-center font-mono" style={{ borderWidth: '1px' }}>
                    {item.quantity}
                  </td>
                  <td className="border border-black px-2 py-0.5 text-right font-mono" style={{ borderWidth: '1px' }}>
                    {formatBRL(rowTotal)}
                  </td>
                </tr>
              );
            })}

            {/* Total Row */}
            <tr className="bg-gray-100 font-bold border-t-2 border-black">
              <td colSpan={3} className="border border-black px-2 py-1 text-right uppercase" style={{ borderWidth: '1px' }}>
                TOTAL GERAL:
              </td>
              <td className="border border-black px-2 py-1 text-right font-mono" style={{ borderWidth: '1px' }}>
                {formatBRL(totalBudget)}
              </td>
            </tr>
          </tbody>
        </table>

        {page.notes && (
          <div className="mt-4 text-[10pt] text-gray-700 italic">
            {page.notes}
          </div>
        )}
      </div>
    </div>
  );
}
