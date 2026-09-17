import { useState, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { Toolbar } from './components/Toolbar';
import { RightPanel } from './components/RightPanel';
import { Canvas } from './components/Canvas';
import { PrintView } from './components/PrintView';
import { Home } from './components/Home';
import { DocumentState, Page, PageType } from './types';
import { syncSumarioPages } from './utils/sumario';
import { calculateTextLines } from './utils/pageCapacity';
import { SAMPLE_ROBOT_IMAGE, SAMPLE_CIRCUIT_IMAGE } from './assets/sampleImages';

import { Layers, FilePlus, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

export interface DevBlock {
  id: string;
  number: string;
  title: string;
  content: string;
}

export interface PreMountedData {
  institution?: string;
  author?: string;
  title?: string;
  subtitle?: string;
  note?: string;
  city?: string;
  year?: string;
  dedicatoria?: string;
  agradecimentos?: string;
  epigrafe?: string;
  resumo?: string;
  abstract?: string;
  introducao?: string;
  desenvolvimento?: string;
  desenvolvimentos?: DevBlock[];
  conclusao?: string;
  referencias?: string;
  anexos?: string;
}

const initialPages: Page[] = [
  {
    id: generateId(),
    type: 'capa',
    name: 'Capa',
    institution: '',
    author: '',
    title: '',
    subtitle: '',
    city: '',
    year: '',
  },
];

export default function App() {
  const [view, setView] = useState<'home' | 'editor'>('home');
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [docState, setDocState] = useState<DocumentState>({
    fontFamily: 'Arial',
    pages: initialPages,
    activePageId: initialPages[0].id,
  });

  useEffect(() => {
    setDocState((prev) => ({
      ...prev,
      pages: syncSumarioPages(prev.pages, { force: true }),
    }));
  }, []);

  const handleCreateManual = () => {
    setDocState({
      fontFamily: 'Arial',
      pages: initialPages,
      activePageId: initialPages[0].id,
    });
    setView('editor');
  };

  const handleCreatePreMounted = (data?: PreMountedData) => {
    const institution = data?.institution || 'ESCOLA TÉCNICA DO RIO DE JANEIRO';
    const author = data?.author || 'DANILO SUPELETO\nFELIPE GÓES\nISABEL SOARES\nKAUÃ LIMA\nMIGUEL DO CARMO\nMIGUEL GONÇALVES\nTURMA: 1221';
    const title = data?.title || 'ROBÔ DE COMBATE A INCÊNDIOS (CARRINHO BOMBEIRO)';
    const subtitle = data?.subtitle || 'Relatório da Feira de Ciências e Informação Profissional 2024';
    const note = data?.note || 'Relatório final, apresentado à Escola Técnica do Rio de Janeiro, como parte das exigências para obtenção da nota da Feira de Ciências e Informação Profissional.\n\nProfessores Orientadores:\nConteúdo: Nome, Titulação.\nMetodologia: Nome, Titulação.';
    const city = data?.city || 'RIO DE JANEIRO - RJ';
    const year = data?.year || '2024';

    const capaId = generateId();
    const rostoId = generateId();
    const dedId = generateId();
    const agradId = generateId();
    const epigId = generateId();
    const resumoId = generateId();
    const abstractId = generateId();
    const sumarioId = generateId();
    const introId = generateId();
    const devId = generateId();
    const dev2Id = generateId();
    const conclId = generateId();
    const refId = generateId();
    const anexoId = generateId();

    const devPages: Page[] = [];
    const hasCustomDev = (data?.desenvolvimentos && data.desenvolvimentos.some(b => b.content.trim() || b.title.trim())) || data?.desenvolvimento;

    if (hasCustomDev) {
      if (data?.desenvolvimentos && data.desenvolvimentos.length > 0) {
        const validBlocks = data.desenvolvimentos.filter(b => b.content.trim() || b.title.trim());
        const mainBlock = data.desenvolvimentos.find(b => b.number === '2') || validBlocks[0];
        const mainTitle = (mainBlock?.title || '').trim() || 'Desenvolvimento Principal';
        const mainHeading = mainTitle.toUpperCase().startsWith('2')
          ? mainTitle.toUpperCase()
          : `2 ${mainTitle.toUpperCase()}`;
        
        if (validBlocks.length === 0) {
          devPages.push({
            id: devId,
            type: 'texto',
            name: mainTitle,
            heading: mainHeading,
            content: '',
          });
        } else {
          let currentContent = '';
          let currentHeading = mainHeading;
          let currentPageName = mainTitle;
          let isFirstPage = true;

          validBlocks.forEach((block, idx) => {
            const isMainBlock = block.number === '2';
            const blockHeader = isMainBlock 
              ? '' 
              : `${block.number} ${block.title ? block.title.toUpperCase() : ''}`.trim();
            const blockFullText = blockHeader ? `${blockHeader}\n${block.content.trim()}` : block.content.trim();

            if (!blockFullText) return;

            const headingLines = isFirstPage ? 2 : (currentHeading ? 2 : 0);
            const currentLines = calculateTextLines(currentContent);
            const blockLines = calculateTextLines(blockFullText) + (currentContent.length > 0 ? 1 : 0);
            // In ABNT 12pt with 1.5 line-height, a standard page accommodates ~36-38 lines
            const wouldExceed = currentContent.length > 0 && (headingLines + currentLines + blockLines > 36);

            if (wouldExceed) {
              devPages.push({
                id: isFirstPage ? devId : generateId(),
                type: 'texto',
                name: currentPageName,
                heading: isFirstPage ? mainHeading : currentHeading,
                content: currentContent.trim(),
              });

              isFirstPage = false;
              currentContent = blockFullText;
              currentHeading = blockHeader || `2.${idx} ${mainTitle.toUpperCase()}`;
              currentPageName = block.title ? `${block.number} ${block.title}` : `Desenvolvimento ${block.number}`;
            } else {
              if (currentContent.length > 0) {
                currentContent += '\n\n' + blockFullText;
              } else {
                currentContent = blockFullText;
                if (!isFirstPage && blockHeader) {
                  currentHeading = blockHeader;
                  currentPageName = block.title ? `${block.number} ${block.title}` : `Desenvolvimento ${block.number}`;
                }
              }
            }
          });

          if (currentContent.trim()) {
            devPages.push({
              id: isFirstPage ? devId : generateId(),
              type: 'texto',
              name: currentPageName,
              heading: isFirstPage ? mainHeading : currentHeading,
              content: currentContent.trim(),
            });
          }
        }
      } else if (data?.desenvolvimento) {
        devPages.push({
          id: devId,
          type: 'texto',
          name: 'Desenvolvimento Principal',
          heading: '2 DESENVOLVIMENTO PRINCIPAL',
          content: data.desenvolvimento,
        });
      }
    } else {
      devPages.push(
        {
          id: devId,
          type: 'texto',
          name: 'Desenvolvimento Principal',
          heading: '2 DESENVOLVIMENTO PRINCIPAL',
          content: '2.1 O que é o robô de combate a incêndios\nConsiste em um dispositivo eletrônico e autônomo que detecta o fogo e se dirige a ele por meio de um comando gerado pelos sensores de chama e pelo Arduino. O Arduino processa as informações dos sensores e envia os comandos apropriados para as rodas, permitindo que o carrinho se mova para frente e para trás conforme necessário.\n\n2.2 Objetivo do projeto\nO principal objetivo é proporcionar um auxílio eficaz no combate a incêndios domésticos, além de ser adaptável para grandes incêndios em colaboração com bombeiros, utilizando materiais mais resistentes e sensores mais robustos. A intenção é desenvolver um dispositivo capaz de conter a propagação do fogo, prevenindo possíveis incêndios e, assim, potencialmente salvando vidas.',
          images: [
            {
              id: 'img-robot-1',
              src: SAMPLE_ROBOT_IMAGE,
              x: 180,
              y: 350,
              width: 320,
              height: 200
            }
          ]
        },
        {
          id: dev2Id,
          type: 'texto',
          name: 'Componentes e Circuito',
          heading: '2.3 Vantagens, Desvantagens e Construção Técnica',
          content: '2.3.1 Vantagens\nUma de suas grandes vantagens é a ação sem a influência do ser humano, por mais que seja um protótipo é automático, então não precisa que alguém o controle para que faça sua movimentação, outra vantagem é que não precisa ficar ligado diretamente na tomada, pois não usa mais de 12V esse protótipo.\n\n2.3.2 Desvantagens\nAlgumas das vantagens estão ligadas às baterias e a água jorrada pelo robô. Em questão da bateria, é utilizada uma bateria de 9V para ligar todo o circuito, podemos usar uma bateria recarregável, porém teríamos de carregar o tempo todo. Já a questão da água, é relacionada ao recipiente para armazená-la pois se usar um tamanho muito pequeno fica pouca água e teria que reabastecer o tempo todo, agora se for muito grande fica muito pesado e assim fazendo o robô tendo uma certa dificuldade de locomoção.\n\n2.4 Construção técnica\nA construção técnica do projeto é constituída por apenas um circuito principal baseado em arduino, que é alimentado por uma fonte de 12V.\n\n2.4.1 Circuito principal\nO circuito principal está localizado dentro do carrinho e possui o objetivo de fazer o acionamento do projeto. A seguir, veja a função de cada componente no circuito:',
          images: [
            {
              id: 'img-circuit-1',
              src: SAMPLE_CIRCUIT_IMAGE,
              x: 150,
              y: 520,
              width: 360,
              height: 250
            }
          ]
        }
      );
    }

    const pages: Page[] = [
      {
        id: capaId,
        type: 'capa',
        name: 'Capa',
        institution,
        author,
        title,
        subtitle,
        city,
        year,
      },
      {
        id: rostoId,
        type: 'rosto',
        name: 'Folha de Rosto',
        author,
        title,
        subtitle,
        note,
        city,
        year,
      },
      {
        id: dedId,
        type: 'texto',
        name: 'Dedicatória',
        heading: 'DEDICATÓRIA',
        content: data?.dedicatoria || 'Dedico este trabalho a todos os meus familiares, professores e colegas de curso que me apoiaram durante o processo de aprendizagem.',
      },
      {
        id: agradId,
        type: 'texto',
        name: 'Agradecimentos',
        heading: 'AGRADECIMENTOS',
        content: data?.agradecimentos || 'Agradeço à instituição, aos meus professores e a todos que contribuíram direta ou indiretamente para a realização deste relatório.',
      },
      {
        id: epigId,
        type: 'texto',
        name: 'Epígrafe',
        heading: 'EPÍGRAFE',
        content: data?.epigrafe || '"A mente que se abre a uma nova idéia jamais voltará ao seu tamanho original."\n— Albert Einstein',
      },
      {
        id: resumoId,
        type: 'texto',
        name: 'Resumo',
        heading: 'RESUMO',
        content: data?.resumo || 'O objetivo deste relatório é fornecer uma visão detalhada sobre o robô de combate a incêndios. O projeto envolve a construção de um veículo autônomo capaz de se deslocar automaticamente e manualmente através de uma chave liga e desliga. O robô é equipado com sensores na parte frontal, incluindo três sensores de chama, um sensor de gás e fumaça, e um sensor ultrassônico. Esses sensores trabalham continuamente para detectar fogo e fumaça. Quando o robô identifica um incêndio, ele se direciona automaticamente para o local e realiza a extinção do fogo de forma independente.\n\nPalavras-chave: Incêndio, robô, carro',
      },
      {
        id: abstractId,
        type: 'texto',
        name: 'Abstract',
        heading: 'ABSTRACT',
        content: data?.abstract || 'The purpose of this report is to provide a detailed overview of the fire-fighting robot. The project involves building an autonomous vehicle capable of moving both automatically and manually via a power switch. The robot is equipped with front-facing sensors, including three flame detectors, one gas and smoke sensor, and one ultrasonic sensor. These sensors continuously work to detect fire and smoke. When the robot identifies a fire, it automatically navigates to the location and extinguishes the fire independently.\n\nKeywords: Fire, robot, car',
      },
      {
        id: sumarioId,
        type: 'texto',
        name: 'Sumário',
        heading: 'SUMÁRIO',
        content: '1 INTRODUÇÃO ............................................................................................ 6\n2 DESENVOLVIMENTO ................................................................................... 7\n  2.1 O que é o robô? .............................................................................. 7\n  2.2 Objetivo do projeto .......................................................................... 7\n  2.3 Vantagens e desvantagens .......................................................... 8\n    2.3.1 Vantagens ................................................................................... 8\n    2.3.2 Desvantagens ............................................................................... 8\n  2.4 Construção técnica ....................................................................... 8\n    2.4.1 Circuito principal ................................................................. 8\n  2.5 Funcionamento do projeto .......................................................... 14\n  2.6 Produtos similares existentes no mercado ................................... 14\n  2.7 Custo do projeto ......................................................................... 15\n3 CONCLUSÃO .............................................................................................. 16\n4 ANEXOS ................................................................................................. 19\n5 PLANO DE ORÇAMENTOS .................................................................. 17\n6 TABELA DE PRAZOS ................................................................. 18\n7 REFERÊNCIAS ................................................................................. 20',
      },
      {
        id: introId,
        type: 'texto',
        name: 'Introdução',
        heading: '1 INTRODUÇÃO',
        content: data?.introducao || 'De acordo com o National Crime Records Bureau (NCRB), estima-se que mais de 1,2 mortes foram causadas por acidentes de incêndio na Índia entre 2010-2014. Em caso de incêndio, para resgatar pessoas e apagar o fogo somos obrigados a utilizar recursos humanos que não são seguros. Com o avanço da tecnologia principalmente na Robótica é muito possível substituir humanos por robôs no combate ao incêndio. Isto melhoraria a eficiência dos bombeiros e também os impediria de arriscar vidas humanas. O robô de combate a incêndios é baseado em arduino e detecta o fogo automaticamente e em seguida aciona uma bomba d\'água para apagá-lo, o robô se move em direção ao fogo, e aciona a bomba pra apagá-lo.',
      },
      ...devPages,
      {
        id: conclId,
        type: 'texto',
        name: 'Conclusão',
        heading: '3 CONCLUSÃO',
        content: data?.conclusao || 'O desenvolvimento do robô de combate a incêndios demonstrou a viabilidade e a eficácia da utilização de sistemas embarcados baseados em Arduino na automação de processos de segurança. O protótipo cumpriu os objetivos propostos de detecção rápida de focos de incêndio e acionamento autônomo da bomba d\'água, minimizando riscos humanos em situações críticas.',
      },
      {
        id: refId,
        type: 'texto',
        name: 'Referências',
        heading: 'REFERÊNCIAS',
        content: data?.referencias || 'ASSOCIAÇÃO BRASILEIRA DE NORMAS TÉCNICAS. NBR 14724: Informação e documentação — Trabalhos acadêmicos — Apresentação. Rio de Janeiro: ABNT, 2011.\n\nNATIONAL CRIME RECORDS BUREAU (NCRB). Accident deaths and suicides in India. New Delhi: Ministry of Home Affairs, 2014.\n\nSLATER, J. Programming Arduino with Interactive Sensors. New York: Tech Books, 2018.',
      },
      {
        id: anexoId,
        type: 'texto',
        name: 'Anexos',
        heading: 'ANEXOS',
        content: data?.anexos || 'ANEXO A — Diagrama esquemático detalhado e tabela de custos dos componentes do robô de combate a incêndios.',
      },
    ];

    const syncedPages = syncSumarioPages(pages);

    setDocState({
      fontFamily: 'Arial',
      pages: syncedPages,
      activePageId: capaId,
    });
    setView('editor');
  };

  const addPage = (name: string, type: PageType) => {
    let newPage: Page;
    const id = generateId();
    let displayName = name;

    if (name === 'Resumo na língua vernácula') displayName = 'Resumo';
    else if (name === 'Resumo em língua estrangeira (Abstract)') displayName = 'Abstract';
    else if (name === 'Dedicatória(s)') displayName = 'Dedicatória';
    else if (name === 'Agradecimento(s)') displayName = 'Agradecimentos';
    else if (name === 'Anexo(s)') displayName = 'Anexos';
    else if (name === 'Apêndice(s)') displayName = 'Apêndices';

    if (type === 'capa') {
      newPage = { id, type: 'capa', name: displayName, institution: '', author: '', title: '', subtitle: '', city: '', year: '' };
    } else if (type === 'rosto') {
      newPage = { id, type: 'rosto', name: displayName, author: '', title: '', subtitle: '', note: 'Relatório final apresentado à Escola Técnica do Rio de Janeiro como parte dos requisitos acadêmicos.', city: '', year: '' };
    } else {
      let heading = displayName.toUpperCase();
      if (displayName === 'Desenvolvimento' || displayName === 'Desenvolvimento Principal') {
        displayName = 'Desenvolvimento Principal';
        heading = '2 DESENVOLVIMENTO PRINCIPAL';
      }
      else if (displayName === 'Introdução') heading = '1 INTRODUÇÃO';
      else if (displayName === 'Conclusão') heading = '3 CONCLUSÃO';
      else if (displayName === 'Resumo') heading = 'RESUMO';
      else if (displayName === 'Abstract') heading = 'ABSTRACT';
      else if (displayName === 'Dedicatória') heading = 'DEDICATÓRIA';
      else if (displayName === 'Agradecimentos') heading = 'AGRADECIMENTOS';
      else if (displayName === 'Epígrafe') heading = 'EPÍGRAFE';
      else if (displayName === 'Sumário') heading = 'SUMÁRIO';
      else if (displayName === 'Referências') heading = 'REFERÊNCIAS';
      else if (displayName === 'Anexos') heading = 'ANEXOS';
      else if (displayName === 'Apêndices') heading = 'APÊNDICES';

      newPage = { id, type: 'texto', name: displayName, heading, content: '' };
    }
    setDocState((prev) => {
      let insertIdx = prev.pages.length;
      if (displayName.toLowerCase().includes('desenvolvimento') || displayName.startsWith('2')) {
        const lastDevIdx = prev.pages.map(p => 
          p.name.toLowerCase().includes('desenvolvimento') || 
          (p.type === 'texto' && p.heading?.startsWith('2')) ||
          p.name.startsWith('2')
        ).lastIndexOf(true);

        if (lastDevIdx !== -1) {
          insertIdx = lastDevIdx + 1;
        } else {
          const introIdx = prev.pages.findIndex(p => 
            p.name.toLowerCase().includes('introdução') || 
            (p.type === 'texto' && p.heading?.startsWith('1'))
          );
          if (introIdx !== -1) insertIdx = introIdx + 1;
        }
      }

      const updatedPages = [...prev.pages];
      updatedPages.splice(insertIdx, 0, newPage);
      return {
        ...prev,
        pages: syncSumarioPages(updatedPages),
        activePageId: id,
      };
    });
  };

  const updatePage = (id: string, updates: Partial<Page>) => {
    setDocState((prev) => {
      const activeIdx = prev.pages.findIndex((p) => p.id === id);
      const updatedPages = prev.pages.map((p) => (p.id === id ? { ...p, ...updates } as Page : p));
      return {
        ...prev,
        pages: syncSumarioPages(updatedPages, { ignoreIfEditingIndex: activeIdx }),
      };
    });
  };

  const handleExportPDF = async () => {
    setIsGeneratingPDF(true);

    try {
      // 1. Aguarda o React renderizar o DOM com o wrapper de exportação
      await new Promise((resolve) => setTimeout(resolve, 350));

      const wrapper = document.getElementById('print-export-wrapper');
      if (wrapper) {
        // Garante que todas as imagens no documento estejam totalmente carregadas e decodificadas
        const imgs = Array.from(wrapper.querySelectorAll<HTMLImageElement>('img'));
        await Promise.all(
          imgs.map((img) => {
            if (img.complete && img.naturalWidth > 0) return Promise.resolve();
            return new Promise<void>((resolve) => {
              img.onload = () => resolve();
              img.onerror = () => resolve();
              setTimeout(resolve, 3000);
            });
          })
        );
      }

      // Pequena pausa para garantir pintura e layout estabilizados
      await new Promise((resolve) => setTimeout(resolve, 150));

      const pageElements = Array.from(document.querySelectorAll<HTMLElement>('.abnt-pdf-page'));
      if (pageElements.length === 0) {
        setIsGeneratingPDF(false);
        window.print();
        return;
      }

      const pdf = new jsPDF({
        unit: 'mm',
        format: 'a4',
        orientation: 'portrait'
      });

      for (let i = 0; i < pageElements.length; i++) {
        if (i > 0) {
          pdf.addPage('a4', 'portrait');
        }
        const pageEl = pageElements[i];
        const canvas = await html2canvas(pageEl, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          logging: false,
          width: 794,
          height: 1123,
          windowWidth: 794,
          backgroundColor: '#ffffff',
          imageTimeout: 15000,
          scrollX: 0,
          scrollY: 0,
        });
        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
      }

      const fileName = `Relatorio_ETERJ_${new Date().getTime()}.pdf`;

      if (Capacitor.isNativePlatform()) {
        const pdfDataUri = pdf.output('datauristring');
        const base64Data = pdfDataUri.split(',')[1];
        
        await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Documents
        });
        
        alert('✅ PDF salvo com sucesso na sua pasta de Documentos!');
      } else {
        pdf.save(fileName);
      }
    } catch (err: any) {
      console.error('PDF Generation error:', err);
      // Remove o modal de carregamento imediatamente para não aparecer na impressão nem travar a tela
      setIsGeneratingPDF(false);
      await new Promise((resolve) => setTimeout(resolve, 200));

      const fallback = window.confirm('Houve um imprevisto no download direto. Deseja abrir a janela de impressão para Salvar como PDF?');
      if (fallback) {
        window.print();
      }
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleSyncSumario = () => {
    setDocState((prev) => ({
      ...prev,
      pages: syncSumarioPages(prev.pages, { force: true }),
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-[#262626] text-zinc-300 font-sans overflow-hidden">
      {isGeneratingPDF && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 print:hidden pointer-events-none select-none">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin print:hidden"></div>
          <p className="text-white font-medium animate-pulse print:hidden">Gerando seu PDF ABNT...</p>
          <p className="text-zinc-400 text-xs print:hidden">Isso pode levar alguns segundos dependendo do tamanho.</p>
        </div>
      )}
      <div className="print:hidden">
        <TopBar onHome={() => setView('home')} onExportPDF={handleExportPDF} onPrint={handlePrint} />
      </div>
      {view === 'home' ? (
        <div className="print:hidden flex-1 overflow-auto">
          <Home 
            onCreateManual={handleCreateManual} 
            onCreatePreMounted={handleCreatePreMounted}
          />
        </div>
      ) : (
        <div className="print:hidden flex flex-1 overflow-hidden relative">
          <Toolbar onAddPage={() => addPage('Nova Página', 'texto')} onExportPDF={handleExportPDF} />
          
          <div className="flex-1 flex flex-col h-full overflow-hidden relative">
            <Canvas docState={docState} onUpdatePage={updatePage} onSyncSumario={handleSyncSumario} />

            {/* Mobile Bottom Control Bar */}
            <div className="md:hidden bg-[#2a2a2a] border-t border-[#1e1e1e] px-3 py-2 flex items-center justify-between z-20 shrink-0">
              <button
                onClick={() => setMobilePanelOpen(true)}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#383838] hover:bg-[#404040] text-zinc-200 text-xs font-medium rounded-lg border border-[#484848] transition-colors"
              >
                <Layers size={14} className="text-cyan-400" />
                <span>Páginas ({docState.pages.length})</span>
              </button>

              <button
                onClick={() => addPage('Nova Página', 'texto')}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#383838] hover:bg-[#404040] text-zinc-200 text-xs font-medium rounded-lg border border-[#484848] transition-colors"
              >
                <FilePlus size={14} className="text-cyan-400" />
                <span>+ Página</span>
              </button>

              <button
                onClick={handleExportPDF}
                className="flex items-center space-x-1 px-3 py-1.5 bg-[#1473e6] hover:bg-[#105cba] text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
              >
                <Download size={14} />
                <span>PDF</span>
              </button>
            </div>
          </div>

          {/* Desktop RightPanel */}
          <div className="hidden md:block">
            <RightPanel docState={docState} setDocState={setDocState} onAddPage={addPage} onUpdatePage={updatePage} />
          </div>

          {/* Mobile RightPanel Slide-over Drawer */}
          {mobilePanelOpen && (
            <div className="md:hidden fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex justify-end">
              <div className="w-4/5 max-w-xs h-full bg-[#323232] shadow-2xl flex flex-col">
                <RightPanel 
                  docState={docState} 
                  setDocState={setDocState} 
                  onAddPage={addPage} 
                  onUpdatePage={updatePage}
                  className="h-full border-none"
                  onCloseMobile={() => setMobilePanelOpen(false)}
                />
              </div>
            </div>
          )}
        </div>
      )}
      {/* Container de Impressão e Captura de PDF */}
      <div 
        id="print-export-wrapper" 
        className={isGeneratingPDF ? 'fixed top-0 left-0 z-40 bg-white pointer-events-none' : 'hidden print:block'}
        style={{ width: '794px', minWidth: '794px' }}
      >
        <PrintView docState={docState} />
      </div>
    </div>
  );
}

