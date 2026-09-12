import { useState, type FormEvent } from 'react';
import { 
  Home as HomeIcon, 
  Lightbulb, 
  FileBox, 
  Users, 
  Image as ImageIcon, 
  Trash2, 
  Search,
  LayoutGrid,
  List,
  X,
  Download,
  FileText,
  Sparkles,
  CheckCircle2,
  Copy,
  Bot,
  Check,
  Plus
} from 'lucide-react';
import { DevBlock, PreMountedData } from '../App';

interface Props {
  onCreateManual: () => void;
  onCreatePreMounted: (data?: PreMountedData) => void;
}

export function Home({ onCreateManual, onCreatePreMounted }: Props) {
  const [showNewModal, setShowNewModal] = useState(false);
  const [showPreMountedModal, setShowPreMountedModal] = useState(false);
  const [activeTab, setActiveTab] = useState('inicio');

  // Pre-Mounted Form States
  const [institution, setInstitution] = useState('ESCOLA TÉCNICA DO RIO DE JANEIRO');
  const [author, setAuthor] = useState('DANILO SUPELETO\nFELIPE GÓES\nISABEL SOARES\nKAUÃ LIMA\nMIGUEL DO CARMO\nMIGUEL GONÇALVES\nTURMA: 1221');
  const [title, setTitle] = useState('ROBÔ DE COMBATE A INCÊNDIOS (CARRINHO BOMBEIRO)');
  const [subtitle, setSubtitle] = useState('Relatório da Feira de Ciências e Informação Profissional 2024');
  const [note, setNote] = useState('Relatório final, apresentado à Escola Técnica do Rio de Janeiro, como parte das exigências para obtenção da nota da Feira de Ciências e Informação Profissional.\n\nProfessores Orientadores:\nConteúdo: Nome, Titulação.\nMetodologia: Nome, Titulação.');
  const [city, setCity] = useState('RIO DE JANEIRO - RJ');
  const [year, setYear] = useState('2024');
  
  // Optional content fields
  const [dedicatoria, setDedicatoria] = useState('');
  const [agradecimentos, setAgradecimentos] = useState('');
  const [epigrafe, setEpigrafe] = useState('');
  const [resumo, setResumo] = useState('');
  const [abstractText, setAbstractText] = useState('');
  const [introducao, setIntroducao] = useState('');
  const [devBlocks, setDevBlocks] = useState<DevBlock[]>([
    { id: 'dev-2', number: '2', title: '', content: '' }
  ]);
  const [conclusao, setConclusao] = useState('');
  const [referencias, setReferencias] = useState('');
  const [anexos, setAnexos] = useState('');

  const [promptCopied, setPromptCopied] = useState(false);

  const handleAddSubDev = () => {
    const nextSubNum = `2.${devBlocks.length}`;
    setDevBlocks(prev => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        number: nextSubNum,
        title: '',
        content: '',
      },
    ]);
  };

  const handleRemoveDevBlock = (id: string) => {
    if (devBlocks.length <= 1) return;
    setDevBlocks(prev => {
      const filtered = prev.filter(b => b.id !== id);
      return filtered.map((block, idx) => {
        if (idx === 0) return { ...block, number: '2' };
        return { ...block, number: `2.${idx}` };
      });
    });
  };

  const handleUpdateDevBlock = (id: string, field: 'title' | 'content', val: string) => {
    setDevBlocks(prev => prev.map(b => b.id === id ? { ...b, [field]: val } : b));
  };

  const aiPrompt = `Aja como um especialista em trabalhos acadêmicos ABNT. Preciso que você crie o conteúdo completo para o meu relatório acadêmico/escolar.

O tema do meu trabalho é: [INSERIR SEU TEMA AQUI]

Gere os seguintes textos separados, mantendo linguagem formal, acadêmica e impessoal (terceira pessoa), prontos para eu copiar e colar diretamente nas abas correspondentes:

1. Dedicatória (curta)
2. Agradecimentos (professores, instituição, família)
3. Epígrafe (uma citação relacionada ao tema com o autor)
4. Resumo (150 a 250 palavras) e Palavras-chave
5. Abstract (tradução exata do resumo) e Keywords
6. Introdução (contextualização e objetivo)
7. Desenvolvimento (Divida em blocos numerados claros para preenchimento):
   - Bloco 2: [Texto introdutório do Desenvolvimento]
   - Bloco 2.1: [Título do Subtópico 1] -> [Texto detalhado do subtópico 1]
   - Bloco 2.2: [Título do Subtópico 2] -> [Texto detalhado do subtópico 2]
   - Bloco 2.3: [Título do Subtópico 3] -> [Texto detalhado do subtópico 3]
8. Conclusão (fechamento dos resultados e aprendizados)
9. Referências (crie 3 a 5 referências no padrão ABNT relacionadas ao tema)
10. Anexos (texto sugerindo quais anexos fariam sentido incluir)`;

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(aiPrompt);
    setPromptCopied(true);
    setTimeout(() => setPromptCopied(false), 2000);
  };

  const handleStartPreMounted = (e?: FormEvent) => {
    if (e) e.preventDefault();

    const joinedDev = devBlocks
      .filter(b => b.content.trim() || b.title.trim())
      .map(b => {
        if (b.number === '2') return b.content.trim();
        const header = `${b.number} ${b.title ? b.title.toUpperCase() : ''}`.trim();
        return header ? `${header}\n${b.content.trim()}` : b.content.trim();
      })
      .filter(Boolean)
      .join('\n\n');

    onCreatePreMounted({
      institution: institution.trim() || undefined,
      author: author.trim() || undefined,
      title: title.trim() || undefined,
      subtitle: subtitle.trim() || undefined,
      note: note.trim() || undefined,
      city: city.trim() || undefined,
      year: year.trim() || undefined,
      dedicatoria: dedicatoria.trim() || undefined,
      agradecimentos: agradecimentos.trim() || undefined,
      epigrafe: epigrafe.trim() || undefined,
      resumo: resumo.trim() || undefined,
      abstract: abstractText.trim() || undefined,
      introducao: introducao.trim() || undefined,
      desenvolvimento: joinedDev || undefined,
      desenvolvimentos: devBlocks,
      conclusao: conclusao.trim() || undefined,
      referencias: referencias.trim() || undefined,
      anexos: anexos.trim() || undefined,
    });
  };

  const navItems = [
    { id: 'inicio', label: 'Início', icon: HomeIcon },
    { id: 'aprendizado', label: 'Aprendizado', icon: Lightbulb },
  ];

  const fileItems = [
    { id: 'seus-arquivos', label: 'Seus arquivos', icon: FileBox },
    { id: 'compartilhado', label: 'Compartilhado com você', icon: Users },
    { id: 'lightroom', label: 'Fotos do Lightroom', icon: ImageIcon },
    { id: 'excluido', label: 'Excluído', icon: Trash2 },
  ];

  return (
    <div className="flex-1 bg-[#1e1e1e] text-zinc-300 flex flex-col md:flex-row overflow-y-auto md:overflow-hidden">
      
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-[#181818] border-b md:border-b-0 md:border-r border-[#2d2d2d] flex flex-col py-4 md:py-6 px-4 shrink-0">
        <div className="space-y-2.5 mb-6 md:mb-8">
          <button 
            onClick={() => setShowNewModal(true)}
            className="w-full bg-[#1473e6] hover:bg-[#105cba] text-white rounded-full py-2.5 px-4 font-medium transition-colors text-sm flex items-center justify-center space-x-2 shadow-sm"
          >
            <span>Novo arquivo</span>
          </button>

          <button 
            onClick={() => setShowPreMountedModal(true)}
            className="w-full bg-[#262626] hover:bg-[#323232] border border-[#00c8ff]/40 text-[#00c8ff] hover:text-white rounded-full py-2.5 px-4 font-medium transition-all text-sm flex items-center justify-center space-x-2 shadow-sm"
          >
            <FileText size={16} />
            <span>Relatório pré-montado</span>
          </button>

          <button 
            onClick={() => setShowNewModal(true)}
            className="w-full border border-[#404040] hover:bg-[#2d2d2d] text-white rounded-full py-2 px-4 font-medium transition-colors text-sm"
          >
            Abrir
          </button>
        </div>

        <div className="flex md:flex-col space-x-2 md:space-x-0 md:space-y-1 mb-4 md:mb-8 overflow-x-auto">
          {navItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center space-x-2 md:space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === item.id ? 'bg-[#2d2d2d] text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="hidden md:block text-xs font-semibold text-zinc-500 mb-3 px-3">
          ARQUIVOS
        </div>
        <div className="hidden md:block space-y-1">
          {fileItems.map(item => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === item.id ? 'bg-[#2d2d2d] text-white' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-4 sm:p-6 md:p-10 max-w-[1200px] mx-auto w-full">
          
          <div className="mb-6 md:mb-12">
            <h1 className="text-2xl sm:text-3xl font-light text-white mb-2">Boas-vindas ao Relatorio Eterj VTNC</h1>
            <p className="text-sm sm:text-base text-zinc-400">Crie trabalhos acadêmicos perfeitamente formatados.</p>
          </div>

          {/* Quick Action Banner */}
          <div className="mb-8 p-4 sm:p-6 bg-gradient-to-r from-[#1c2936] to-[#1a1a24] border border-[#00c8ff]/30 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center space-x-2 text-[#00c8ff] font-semibold text-xs sm:text-sm">
                <Sparkles size={16} />
                <span>RELATÓRIO PRÉ-MONTADO (MODELO ABNT)</span>
              </div>
              <h2 className="text-base sm:text-lg font-medium text-white">Monte seu relatório completo em 1 clique</h2>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Inclui Capa, Folha de Rosto, Dedicatória, Agradecimentos, Epígrafe, Resumo, Abstract, Sumário, Introdução, Desenvolvimento, Conclusão, Referências e Anexos organizados!
              </p>
            </div>
            <button 
              onClick={() => setShowPreMountedModal(true)}
              className="w-full md:w-auto px-5 py-2.5 bg-[#1473e6] hover:bg-[#105cba] text-white font-medium text-sm rounded-full transition-all shadow-md flex items-center justify-center space-x-2 shrink-0"
            >
              <FileText size={16} />
              <span>Criar Relatório Pré-Montado</span>
            </button>
          </div>

          {/* AI Prompt Banner */}
          <div className="mb-8 p-4 sm:p-5 bg-[#262626] border border-[#404040] rounded-xl shadow-sm">
            <div className="flex items-center space-x-2 text-zinc-200 font-medium text-sm mb-2">
              <Bot size={18} className="text-[#10a37f]" />
              <h3>Use Inteligência Artificial para gerar seus textos</h3>
            </div>
            <p className="text-xs sm:text-sm text-zinc-400 mb-4">
              Copie o prompt perfeito abaixo e cole no ChatGPT, Gemini ou Claude para gerar todos os textos do seu relatório formatados de acordo com o tema. Depois é só colar no modal acima!
            </p>
            <div className="relative group">
              <div className="bg-[#1e1e1e] border border-[#333] rounded-lg p-3 sm:p-4 text-xs text-zinc-300 font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">
                {aiPrompt}
              </div>
              <button 
                onClick={handleCopyPrompt}
                className="absolute top-2 right-2 p-1.5 sm:p-2 bg-[#2d2d2d] hover:bg-[#404040] text-zinc-200 rounded-md transition-colors shadow-sm flex items-center space-x-1 sm:space-x-2"
                title="Copiar prompt"
              >
                {promptCopied ? (
                  <>
                    <Check size={14} className="text-green-400" />
                    <span className="text-xs font-medium text-green-400 hidden sm:inline">Copiado!</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span className="text-xs font-medium hidden sm:inline">Copiar prompt</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#2d2d2d] pb-4 gap-4">
              <div className="flex items-center space-x-6 text-sm font-medium">
                <button className="text-white border-b-2 border-white pb-4 -mb-[17px]">Recentes</button>
              </div>
              <div className="flex items-center space-x-3 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input 
                    type="text" 
                    placeholder="Pesquisar..." 
                    className="bg-[#2d2d2d] border-none rounded-full py-1 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#1473e6] text-white w-full sm:w-48 h-8"
                  />
                </div>
                <div className="flex items-center space-x-1 border border-[#404040] rounded-md p-0.5">
                  <button className="p-1 bg-[#404040] rounded text-white"><LayoutGrid size={16} /></button>
                  <button className="p-1 text-zinc-400 hover:text-white"><List size={16} /></button>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-6">
              {/* Empty state for recents */}
              <div className="col-span-full flex flex-col items-center justify-center h-48 sm:h-64 text-zinc-500 space-y-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 border-2 border-dashed border-[#404040] rounded-lg flex items-center justify-center">
                  <span className="text-xs">Nenhum</span>
                </div>
                <p className="text-sm">Nenhum arquivo recente.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Modal - Relatório Pré-Montado */}
      {showPreMountedModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-[#262626] border border-[#404040] rounded-xl w-full max-w-[650px] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-[#383838] bg-[#1e1e1e] shrink-0">
              <div className="flex items-center space-x-2">
                <FileText className="text-[#00c8ff]" size={20} />
                <h2 className="text-white font-medium text-sm sm:text-base">Relatório Pré-Montado (ABNT)</h2>
              </div>
              <button onClick={() => setShowPreMountedModal(false)} className="text-zinc-400 hover:text-white transition-colors p-1">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleStartPreMounted} className="p-4 sm:p-6 space-y-4 text-sm overflow-y-auto flex-1">
              <div className="p-3 bg-[#1e2836] border border-[#00c8ff]/30 rounded-lg text-xs text-zinc-300 space-y-1">
                <p className="font-semibold text-[#00c8ff] flex items-center space-x-1">
                  <CheckCircle2 size={14} className="mr-1 shrink-0" />
                  <span>Estrutura que será criada automaticamente:</span>
                </p>
                <p className="text-zinc-400 leading-relaxed text-[11px] sm:text-xs">
                  Capa • Folha de Rosto • Dedicatória • Agradecimentos • Epígrafe • Resumo • Abstract • Sumário • Introdução • Desenvolvimento • Conclusão • Referências • Anexos
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Nome da Instituição / Escola <span className="text-zinc-500 font-normal">(opcional)</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: ESCOLA TÉCNICA ETERJ" 
                    value={institution} 
                    onChange={e => setInstitution(e.target.value)}
                    className="w-full bg-[#1b1b1b] border border-[#404040] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00c8ff]"
                  />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Nomes dos Alunos / Autores <span className="text-zinc-500 font-normal">(opcional)</span>
                    </label>
                    <textarea 
                      placeholder="Ex: JOÃO DA SILVA" 
                      value={author} 
                      onChange={e => setAuthor(e.target.value)}
                      rows={4}
                      className="w-full bg-[#1b1b1b] border border-[#404040] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00c8ff] resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Título do Trabalho <span className="text-zinc-500 font-normal">(opcional)</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ex: RELATÓRIO TÉCNICO EXPERIMENTAL" 
                      value={title} 
                      onChange={e => setTitle(e.target.value)}
                      className="w-full bg-[#1b1b1b] border border-[#404040] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00c8ff]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Subtítulo <span className="text-zinc-500 font-normal">(opcional)</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="Ex: Análise das Práticas Laboratoriais" 
                    value={subtitle} 
                    onChange={e => setSubtitle(e.target.value)}
                    className="w-full bg-[#1b1b1b] border border-[#404040] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00c8ff]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Nota Indicativa (Folha de Rosto) <span className="text-zinc-500 font-normal">(opcional)</span>
                  </label>
                  <textarea 
                    placeholder="Ex: Trabalho de Conclusão de Curso..." 
                    value={note} 
                    onChange={e => setNote(e.target.value)}
                    rows={4}
                    className="w-full bg-[#1b1b1b] border border-[#404040] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00c8ff] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Cidade <span className="text-zinc-500 font-normal">(opcional)</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ex: RIO DE JANEIRO" 
                      value={city} 
                      onChange={e => setCity(e.target.value)}
                      className="w-full bg-[#1b1b1b] border border-[#404040] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00c8ff]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-zinc-300 mb-1">
                      Ano <span className="text-zinc-500 font-normal">(opcional)</span>
                    </label>
                    <input 
                      type="text" 
                      placeholder="Ex: 2026" 
                      value={year} 
                      onChange={e => setYear(e.target.value)}
                      className="w-full bg-[#1b1b1b] border border-[#404040] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00c8ff]"
                    />
                  </div>
                </div>

                <div className="pt-4 pb-2">
                  <h3 className="text-sm font-semibold text-[#00c8ff] mb-4 border-b border-[#383838] pb-2">Conteúdo do Relatório</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Dedicatória <span className="text-zinc-500 font-normal">(opcional)</span>
                      </label>
                      <textarea value={dedicatoria} onChange={e => setDedicatoria(e.target.value)} rows={2} className="w-full bg-[#1b1b1b] border border-[#404040] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00c8ff] resize-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Agradecimentos <span className="text-zinc-500 font-normal">(opcional)</span>
                      </label>
                      <textarea value={agradecimentos} onChange={e => setAgradecimentos(e.target.value)} rows={2} className="w-full bg-[#1b1b1b] border border-[#404040] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00c8ff] resize-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Epígrafe <span className="text-zinc-500 font-normal">(opcional)</span>
                      </label>
                      <textarea value={epigrafe} onChange={e => setEpigrafe(e.target.value)} rows={2} className="w-full bg-[#1b1b1b] border border-[#404040] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00c8ff] resize-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Resumo <span className="text-zinc-500 font-normal">(opcional)</span>
                      </label>
                      <textarea value={resumo} onChange={e => setResumo(e.target.value)} rows={4} className="w-full bg-[#1b1b1b] border border-[#404040] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00c8ff] resize-y" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Abstract <span className="text-zinc-500 font-normal">(opcional)</span>
                      </label>
                      <textarea value={abstractText} onChange={e => setAbstractText(e.target.value)} rows={4} className="w-full bg-[#1b1b1b] border border-[#404040] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00c8ff] resize-y" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Introdução <span className="text-zinc-500 font-normal">(opcional)</span>
                      </label>
                      <textarea value={introducao} onChange={e => setIntroducao(e.target.value)} rows={6} className="w-full bg-[#1b1b1b] border border-[#404040] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00c8ff] resize-y" />
                    </div>
                    {/* Seção Desenvolvimento com Subtópicos Dinâmicos */}
                    <div className="space-y-3 bg-[#171717] p-3 sm:p-4 rounded-xl border border-[#333]">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#2d2d2d] pb-2.5">
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">Desenvolvimento</span>
                            <span className="px-1.5 py-0.5 rounded bg-[#00c8ff]/20 text-[#00c8ff] text-[10px] font-mono font-bold">
                              Seção 2
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5">
                            O tópico 2 é o principal. Adicione subtópicos (2.1, 2.2, etc.) clicando no botão ao lado.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={handleAddSubDev}
                          className="self-start sm:self-auto flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#00c8ff]/15 hover:bg-[#00c8ff]/25 border border-[#00c8ff]/40 text-[#00c8ff] hover:text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
                        >
                          <Plus size={14} />
                          <span>Adicionar 2.{devBlocks.length}</span>
                        </button>
                      </div>

                      <div className="space-y-3 pt-1">
                        {devBlocks.map((block, idx) => {
                          const isMain = idx === 0;
                          return (
                            <div
                              key={block.id}
                              className={`p-3 rounded-lg border transition-all ${
                                isMain
                                  ? 'bg-[#1e1e1e] border-[#383838]'
                                  : 'bg-[#222222] border-[#00c8ff]/30'
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center space-x-2 flex-1 mr-2">
                                  <span className="px-2 py-0.5 rounded bg-[#00c8ff]/20 text-[#00c8ff] text-xs font-bold font-mono">
                                    {block.number}
                                  </span>
                                  {isMain ? (
                                    <span className="text-xs font-medium text-zinc-200">
                                      Desenvolvimento Principal (2)
                                    </span>
                                  ) : (
                                    <input
                                      type="text"
                                      placeholder={`Título do subtópico ${block.number} (ex: Funcionamento do Circuito)`}
                                      value={block.title}
                                      onChange={e => handleUpdateDevBlock(block.id, 'title', e.target.value)}
                                      className="flex-1 bg-[#181818] border border-[#404040] rounded px-2.5 py-1 text-white text-xs focus:outline-none focus:border-[#00c8ff]"
                                    />
                                  )}
                                </div>
                                {!isMain && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveDevBlock(block.id)}
                                    title="Remover este subtópico"
                                    className="text-zinc-500 hover:text-red-400 p-1 transition-colors rounded cursor-pointer"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                )}
                              </div>
                              <textarea
                                value={block.content}
                                onChange={e => handleUpdateDevBlock(block.id, 'content', e.target.value)}
                                rows={isMain ? 6 : 4}
                                placeholder={
                                  isMain
                                    ? "Digite o texto inicial da seção 2 do desenvolvimento..."
                                    : `Digite o conteúdo para o subtópico ${block.number}...`
                                }
                                className="w-full bg-[#181818] border border-[#404040] rounded-lg px-3 py-2 text-white text-xs sm:text-sm focus:outline-none focus:border-[#00c8ff] resize-y"
                              />
                            </div>
                          );
                        })}
                      </div>

                      {devBlocks.length > 0 && (
                        <div className="flex justify-end pt-1">
                          <button
                            type="button"
                            onClick={handleAddSubDev}
                            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#262626] hover:bg-[#333] border border-[#404040] text-zinc-300 hover:text-white text-xs font-medium transition-all cursor-pointer"
                          >
                            <Plus size={13} />
                            <span>+ Adicionar 2.{devBlocks.length}</span>
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Conclusão <span className="text-zinc-500 font-normal">(opcional)</span>
                      </label>
                      <textarea value={conclusao} onChange={e => setConclusao(e.target.value)} rows={6} className="w-full bg-[#1b1b1b] border border-[#404040] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00c8ff] resize-y" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Referências <span className="text-zinc-500 font-normal">(opcional)</span>
                      </label>
                      <textarea value={referencias} onChange={e => setReferencias(e.target.value)} rows={4} className="w-full bg-[#1b1b1b] border border-[#404040] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00c8ff] resize-y" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-zinc-300 mb-1">
                        Anexos <span className="text-zinc-500 font-normal">(opcional)</span>
                      </label>
                      <textarea value={anexos} onChange={e => setAnexos(e.target.value)} rows={3} className="w-full bg-[#1b1b1b] border border-[#404040] rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[#00c8ff] resize-y" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 pt-4 border-t border-[#383838]">
                <button 
                  type="button" 
                  onClick={() => setShowPreMountedModal(false)}
                  className="px-4 py-2.5 rounded-full border border-[#555] text-white hover:bg-[#323232] text-xs sm:text-sm font-medium transition-colors text-center"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-[#1473e6] hover:bg-[#105cba] text-white text-xs sm:text-sm font-medium transition-colors shadow-md flex items-center justify-center space-x-2"
                >
                  <span>Criar Relatório Pré-Montado</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Document Modal */}
      {showNewModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-[#2b2b2b] rounded-xl w-full max-w-[900px] shadow-2xl flex flex-col h-auto md:h-[600px] max-h-[92vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#404040] bg-[#1e1e1e] shrink-0">
              <h2 className="text-white text-sm font-medium">Novo documento</h2>
              <button onClick={() => setShowNewModal(false)} className="text-zinc-400 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex flex-col md:flex-row flex-1 overflow-y-auto md:overflow-hidden">
              {/* Modal Main */}
              <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto">
                <div className="flex items-center space-x-4 text-xs sm:text-sm border-b border-[#404040] pb-2 mb-4">
                  <button className="text-white border-b-2 border-white pb-2 font-medium">Recente</button>
                  <button className="text-zinc-400 hover:text-zinc-200 pb-2">Salvo</button>
                  <button className="text-zinc-400 hover:text-zinc-200 pb-2">Impressão</button>
                </div>
                
                <h3 className="text-xs font-semibold text-zinc-400 mb-3 uppercase">Opções de Predefinição</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4">
                  <button 
                    onClick={() => {
                      setShowNewModal(false);
                      setShowPreMountedModal(true);
                    }}
                    className="flex flex-col items-center justify-center p-4 border-2 border-[#00c8ff] rounded-lg bg-[#212b38] group transition-all text-center hover:scale-[1.01]"
                  >
                    <div className="w-12 h-16 bg-[#182332] border border-[#00c8ff]/40 rounded-sm mb-2 shadow-sm relative flex flex-col items-center justify-center">
                      <span className="text-[10px] text-[#00c8ff] font-serif font-bold">ABNT</span>
                      <div className="w-6 h-0.5 bg-[#00c8ff]/60 my-0.5"></div>
                      <div className="w-4 h-0.5 bg-[#00c8ff]/40"></div>
                    </div>
                    <span className="text-sm text-white font-medium">Relatório Pré-Montado</span>
                    <span className="text-xs text-[#00c8ff] mt-1 font-semibold">Recomendado ABNT</span>
                  </button>

                  <button 
                    onClick={onCreateManual}
                    className="flex flex-col items-center justify-center p-4 border border-[#404040] hover:border-zinc-500 rounded-lg bg-[#323232] group transition-colors text-center"
                  >
                    <div className="w-12 h-16 bg-white rounded-sm mb-2 shadow-sm relative flex items-center justify-center">
                      <div className="text-[#2b2b2b] font-serif font-bold text-base">A4</div>
                    </div>
                    <span className="text-sm text-white font-medium">Documento em Branco</span>
                    <span className="text-xs text-zinc-400 mt-1">210 x 297 mm</span>
                  </button>
                </div>

                <div className="md:hidden mt-6 pt-4 border-t border-[#404040] flex gap-2">
                  <button onClick={() => setShowNewModal(false)} className="flex-1 py-2 rounded-full border border-[#555] text-white text-xs font-medium">
                    Fechar
                  </button>
                  <button onClick={onCreateManual} className="flex-1 py-2 rounded-full bg-[#1473e6] text-white text-xs font-medium">
                    Criar em Branco
                  </button>
                </div>
              </div>

              {/* Modal Right Sidebar (Hidden on mobile for better usability) */}
              <div className="hidden md:flex w-72 bg-[#323232] border-l border-[#404040] flex-col p-6 shrink-0">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-white font-medium text-xs tracking-wider">DETALHES DA PREDEFINIÇÃO</h3>
                  <button className="text-zinc-400 hover:text-white"><Download size={16} /></button>
                </div>

                <div className="space-y-4 flex-1">
                  <div>
                    <input type="text" defaultValue="Relatório ABNT" className="w-full bg-[#1e1e1e] border border-[#555] rounded px-3 py-1.5 text-sm text-white focus:outline-none focus:border-[#1473e6]" />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Largura</label>
                      <input type="text" defaultValue="210" disabled className="w-full bg-[#1e1e1e] border border-[#555] rounded px-3 py-1.5 text-sm text-zinc-400 cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">&nbsp;</label>
                      <select disabled className="w-full bg-[#1e1e1e] border border-[#555] rounded px-2 py-1.5 text-sm text-zinc-400 cursor-not-allowed">
                        <option>Milímetros</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Altura</label>
                      <input type="text" defaultValue="297" disabled className="w-full bg-[#1e1e1e] border border-[#555] rounded px-3 py-1.5 text-sm text-zinc-400 cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-[11px] text-zinc-400 mb-1">Orientação</label>
                      <div className="flex space-x-1">
                        <button disabled className="flex-1 bg-[#404040] border border-[#1473e6] rounded py-1 flex justify-center text-[#1473e6] cursor-not-allowed">
                           <div className="w-3 h-4 border-2 border-current rounded-sm"></div>
                        </button>
                        <button disabled className="flex-1 bg-[#1e1e1e] border border-[#555] rounded py-1 flex justify-center text-zinc-400 cursor-not-allowed">
                           <div className="w-4 h-3 border-2 border-current rounded-sm"></div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-3 pt-6 mt-6 border-t border-[#404040]">
                  <button onClick={() => setShowNewModal(false)} className="flex-1 py-1.5 rounded-full border border-[#555] text-white hover:bg-[#404040] text-sm font-medium transition-colors">
                    Fechar
                  </button>
                  <button onClick={onCreateManual} className="flex-1 py-1.5 rounded-full bg-[#1473e6] hover:bg-[#105cba] text-white text-sm font-medium transition-colors">
                    Criar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


