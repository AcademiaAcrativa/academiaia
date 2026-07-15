import { useState } from "react";
import { 
  Megaphone, Target, ArrowRight, Copy, Check, Sparkles, 
  Flame, MessageSquare, Zap, Users, ShieldCheck, Heart, 
  Coins, Navigation, HelpCircle, UserCheck, PlayCircle
} from "lucide-react";

interface ScriptTemplate {
  title: string;
  trigger: string;
  concept: string;
  text: string;
}

export default function MarketingDigital() {
  const [activeTab, setActiveTab] = useState<"gatilhos" | "copywriting" | "trafego" | "gerador">("gatilhos");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // States for the custom Outreach Pitch Generator
  const [targetBusiness, setTargetBusiness] = useState("Pizzaria do Bairro");
  const [myService, setMyService] = useState("Fotos Premium de Cardápio com IA");
  const [specialistName, setSpecialistName] = useState("Pedro");
  const [painPoint, setPainPoint] = useState("fotos escuras ou sem graça no iFood que reduzem as vendas");

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Mental Triggers data
  const gatilhosList: ScriptTemplate[] = [
    {
      title: "Reciprocidade (Amostra Grátis Perfeita)",
      trigger: "Reciprocidade",
      concept: "As pessoas se sentem obrigadas a retribuir favores. Ao entregar um criativo ou foto otimizada gratuitamente antes de cobrar, você destrói qualquer barreira comercial.",
      text: "Olá, equipe [Empresa]! Vi o cardápio/perfil de vocês e achei o produto excelente. Por profissionalismo, tomei a liberdade de gerar uma versão premium de alta conversão para o seu post principal [ou prato x] de forma 100% gratuita para demonstrar o meu trabalho. Segue a imagem anexa! Podem usar à vontade. Se quiserem que eu cuide dos outros posts para aumentar as vendas, me avisem!"
    },
    {
      title: "Escassez & Urgência (Vagas Limitadas)",
      trigger: "Escassez / Urgência",
      concept: "O que é abundante tem menos valor. Limitar o tempo da proposta ou a quantidade de vagas disponíveis acelera a tomada de decisão do dono da empresa.",
      text: "Olá! Como trabalho de forma personalizada com cada restaurante/loja para garantir o aumento real de vendas, eu só tenho espaço para atender mais 2 clientes da região de [Cidade] neste mês para otimização visual completa. Estou abrindo essa vaga com desconto especial de 40% apenas para quem fechar até esta sexta-feira. Podemos agendar 5 minutos de conversa hoje?"
    },
    {
      title: "Prova Social (Resultados Reais)",
      trigger: "Prova Social",
      concept: "As pessoas seguem a maioria. Mostrar que outros negócios similares aumentaram faturamento ou ganharam tempo valida sua autoridade instantaneamente.",
      text: "Olá, tudo bem? Sabia que hamburguerias locais que atualizaram suas fotos amadoras para imagens gastronômicas profissionais de estúdio (feitas com nossa tecnologia) registraram um aumento médio de 32% no volume de pedidos no iFood já na primeira semana? Eu tenho os modelos prontos para o seu nicho. Vamos conversar sobre como fazer isso no seu cardápio?"
    },
    {
      title: "Autoridade (Especialista focado em Solução)",
      trigger: "Autoridade",
      concept: "Ninguém quer contratar amadores. Posicione-se não como um vendedor de fotos/posts, mas como um especialista em otimização de conversão e atração visual para vendas.",
      text: "Olá, sou [Seu Nome], especialista em design culinário e inteligência visual de vendas para delivery. Analisei sua presença no iFood e identifiquei 3 pontos críticos de atração visual nos seus pratos principais que podem estar fazendo você perder até 4 em cada 10 clientes que visitam sua página. Preparei um relatório visual rápido de melhoria para vocês. Posso enviar no WhatsApp?"
    }
  ];

  // Copywriting formulas
  const copywritingFormulas = [
    {
      name: "Fórmula AIDA (Atenção, Interesse, Desejo, Ação)",
      useCase: "Ideal para páginas de vendas, posts promocionais de alta conversão e anúncios pagos.",
      steps: [
        { label: "Atenção", desc: "Chame o cliente com uma pergunta ou fato chocante.", text: "Você sabia que as pessoas comem primeiro com os olhos?" },
        { label: "Interesse", desc: "Apresente um problema comum e mostre que entende do assunto.", text: "Restaurantes com fotos ruins ou sem imagem no iFood perdem mais de 45% das vendas diárias por falta de atratividade visual." },
        { label: "Desejo", desc: "Apresente sua solução inovadora que gera desejo irresistível.", text: "Nós recriamos todo o seu cardápio com fotografia gastronômica 8K hiper-realista gerada por inteligência artificial, destacando cada detalhe suculento e derretido do seu produto." },
        { label: "Ação", desc: "Chamada clara e direta sem dar margem para hesitação.", text: "Clique no link abaixo e garanta um diagnóstico visual gratuito do seu cardápio hoje mesmo!" }
      ],
      fullPrompt: "Aja como um copywriter profissional especialista em conversão e escreva um anúncio completo usando o modelo AIDA para vender o produto/serviço [Inserir seu produto/serviço] para o público [Inserir público-alvo]."
    },
    {
      name: "Fórmula PAS (Problema, Agitação, Solução)",
      useCase: "A melhor fórmula para vendas diretas de serviços (B2B) e captação rápida de leads frios.",
      steps: [
        { label: "Problema", desc: "Destaque a maior dor ou frustração atual do cliente.", text: "É frustrante passar o dia inteiro com o delivery aberto e receber pouquíssimos pedidos, sabendo que sua comida é maravilhosa." },
        { label: "Agitação", desc: "Aumente a dor, mostrando as consequências de não agir logo.", text: "Enquanto isso, concorrentes piores que você vendem o triplo simplesmente porque usam fotos chamativas de estúdio que parecem dar água na boca." },
        { label: "Solução", desc: "Apresente sua proposta como a ponte de salvação definitiva.", text: "Deixe o design com a nossa inteligência visual. Otimizamos suas fotos e criativos em 24h para você se preocupar apenas em preparar os pedidos." }
      ],
      fullPrompt: "Crie uma copy persuasiva de vendas baseada no framework PAS para o serviço [Inserir serviço], destacando a dor do cliente de [Inserir dor do cliente] e apresentando nossa entrega rápida como a solução ideal."
    }
  ];

  // Generated Pitch based on dynamic states
  const generatedPitchText = `Olá, equipe da ${targetBusiness}! Tudo bem?

Eu sou o ${specialistName} e sou especialista em marketing visual focado em aumento de vendas para negócios de delivery e comércio local.

Estava acompanhando as redes sociais de vocês e o cardápio no iFood e achei excelente a qualidade do produto de vocês! No entanto, como especialista, percebi um detalhe muito importante: vocês possuem alguns pratos com ${painPoint}. 

Pesquisas mostram que fotos gastronômicas de alta definição e bem iluminadas elevam as conversões de pedidos em até 40% nas plataformas de entrega.

Para demonstrar meu trabalho de forma prática e sem compromisso, eu recriei uma foto premium profissional para um dos principais pratos de vocês utilizando nossa ferramenta de estúdio culinário digital (veja em anexo a amostra gratuita!).

Ficou fantástico! Se vocês gostarem e quiserem otimizar as fotos de todo o cardápio de vocês com esse padrão de alta gastronomia para ver o faturamento decolar, posso criar um pacote muito especial esta semana.

Podemos bater um papo rápido de 5 minutos sobre como aplicar essas imagens de dar água na boca no seu cardápio?

Um abraço,
${specialistName}`;

  return (
    <div id="marketing-digital-section" className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-8">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div className="space-y-1.5 text-left">
          <span className="text-emerald-400 font-mono text-xs uppercase tracking-wider font-semibold block flex items-center gap-1.5">
            <Megaphone className="w-4 h-4" />
            Estratégias de Vendas de Alta Conversão
          </span>
          <h2 className="text-xl md:text-2xl font-black text-white tracking-tight">
            Hub de Marketing Digital & Gatilhos de Vendas
          </h2>
          <p className="text-slate-400 text-xs md:text-sm max-w-2xl leading-relaxed">
            Não adianta ter uma ferramenta poderosa se você não souber atrair e fechar com os clientes. Use este guia interativo para impulsionar suas abordagens comerciais e vender seus serviços com IA.
          </p>
        </div>

        {/* Tab Selection buttons */}
        <div className="flex flex-wrap gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/60">
          <button
            id="marketing-tab-gatilhos"
            onClick={() => setActiveTab("gatilhos")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "gatilhos"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Gatilhos Mentais
          </button>
          <button
            id="marketing-tab-copywriting"
            onClick={() => setActiveTab("copywriting")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "copywriting"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Copywriting
          </button>
          <button
            id="marketing-tab-trafego"
            onClick={() => setActiveTab("trafego")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "trafego"
                ? "bg-emerald-500 text-slate-950 shadow"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Tráfego & Dicas
          </button>
          <button
            id="marketing-tab-gerador"
            onClick={() => setActiveTab("gerador")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "gerador"
                ? "bg-emerald-500 text-slate-950 shadow animate-pulse"
                : "text-slate-400 hover:text-white"
            }`}
          >
            Gerador de Script ⚡
          </button>
        </div>
      </div>

      {/* Tab 1: Gatilhos Mentais */}
      {activeTab === "gatilhos" && (
        <div className="space-y-6 text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {gatilhosList.map((g, i) => (
              <div 
                key={i} 
                className="bg-slate-950/40 border border-slate-800/80 p-5 rounded-xl space-y-3 hover:border-slate-700/80 transition-all flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-white font-extrabold text-sm">{g.title}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 uppercase tracking-wider">
                      {g.trigger}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs leading-relaxed">
                    {g.concept}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-900 space-y-2.5">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Modelo de Abordagem:</span>
                    <button
                      onClick={() => handleCopy(g.text, `gatilho-${i}`)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-all cursor-pointer"
                    >
                      {copiedId === `gatilho-${i}` ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Script</span>
                        </>
                      )}
                    </button>
                  </div>
                  <blockquote className="bg-slate-950 p-3 rounded-lg border border-slate-850 text-[11px] text-slate-300 italic leading-relaxed whitespace-pre-wrap select-all font-mono">
                    "{g.text}"
                  </blockquote>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-emerald-500/5 p-4 rounded-xl border border-emerald-500/10 flex gap-3 items-start">
            <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-200 block">Dica de Ouro de Conversão:</span>
              <p className="text-slate-400 text-xs leading-relaxed">
                Ao negociar com empresários locais, <strong>sempre foque no dinheiro que eles estão deixando de ganhar</strong> e não no custo do seu serviço. Mostre que o preço cobrado será pago rapidamente pelo aumento do fluxo de clientes!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Copywriting */}
      {activeTab === "copywriting" && (
        <div className="space-y-6 text-left">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {copywritingFormulas.map((f, i) => (
              <div key={i} className="bg-slate-950/40 border border-slate-800/85 p-6 rounded-xl space-y-4">
                <div className="space-y-1">
                  <span className="text-white font-extrabold text-sm block">{f.name}</span>
                  <p className="text-slate-400 text-xs leading-relaxed font-mono">
                    {f.useCase}
                  </p>
                </div>

                <div className="space-y-3">
                  {f.steps.map((s, idx) => (
                    <div key={idx} className="bg-slate-950/80 p-3 rounded-lg border border-slate-900 flex gap-3 items-start">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-mono text-[10px] text-emerald-400 shrink-0 font-bold">
                        {idx + 1}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold text-slate-300">{s.label}</span>
                          <span className="text-[9px] text-slate-500 italic">({s.desc})</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed font-mono">"{s.text}"</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-900 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-[10px] font-mono text-slate-500 uppercase">Prompt para ChatGPT/Claude:</span>
                    <button
                      onClick={() => handleCopy(f.fullPrompt, `prompt-copy-${i}`)}
                      className="text-xs text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-all cursor-pointer"
                    >
                      {copiedId === `prompt-copy-${i}` ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copiar Prompt</span>
                        </>
                      )}
                    </button>
                  </div>
                  <p className="bg-slate-950 p-3 rounded-lg border border-slate-900 text-[11px] text-slate-400 leading-relaxed font-mono">
                    {f.fullPrompt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Tráfego e Dicas */}
      {activeTab === "trafego" && (
        <div className="space-y-6 text-left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            
            {/* Strategy 1 */}
            <div className="bg-slate-950/40 border border-slate-800 p-5 rounded-xl space-y-3">
              <div className="bg-red-500/10 text-red-400 w-10 h-10 rounded-lg flex items-center justify-center border border-red-500/20">
                <PlayCircle className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Tráfego Orgânico (Vídeos Curtos)</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Poste cortes curtos no <strong>TikTok, Instagram Reels e YouTube Shorts</strong> mostrando o "antes e depois" da IA culinária ou das artes de mídia social. O tráfego orgânico entrega milhares de visualizações gratuitamente quando o roteiro prende a atenção nos primeiros 3 segundos.
              </p>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-[11px] font-mono text-slate-300">
                <span className="text-emerald-400 font-bold block mb-1">Gancho de 3 segundos ideal:</span>
                "Eu usei inteligência artificial para recriar o cardápio da hamburgueria mais amada da minha cidade..."
              </div>
            </div>

            {/* Strategy 2 */}
            <div className="bg-slate-950/40 border border-slate-800 p-5 rounded-xl space-y-3">
              <div className="bg-emerald-500/10 text-emerald-400 w-10 h-10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                <Coins className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Tráfego Pago de Baixo Orçamento</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Use o Gerenciador de Anúncios da Meta para rodar campanhas de <strong>R$ 10,00 por dia</strong> direcionadas para "Proprietários de pequenas empresas" em um raio de 5km na sua cidade. Direcione os cliques para o seu WhatsApp e agende conversas presenciais ou ligações rápidas.
              </p>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-[11px] font-mono text-slate-300">
                <span className="text-emerald-400 font-bold block mb-1">Interesses recomendados:</span>
                • Administradores de páginas do Facebook<br />
                • Proprietários de microempresas<br />
                • Comércio local
              </div>
            </div>

            {/* Strategy 3 */}
            <div className="bg-slate-950/40 border border-slate-800 p-5 rounded-xl space-y-3">
              <div className="bg-cyan-500/10 text-cyan-400 w-10 h-10 rounded-lg flex items-center justify-center border border-cyan-500/20">
                <ArrowRight className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Estratégia do "Cavalo de Tróia"</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                Ofereça uma auditoria gratuita de presença digital para o negócio ou um design avulso grátis. Ao entrar com algo de muito valor imediato e sem cobrar nada, o cliente confia no seu trabalho e você pode vender pacotes recorrentes de R$ 400 a R$ 1.500 mensais com facilidade.
              </p>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900 text-[11px] font-mono text-slate-300">
                <span className="text-emerald-400 font-bold block mb-1">Resultado de Valor:</span>
                Uma única conta recorrente de R$ 500/mês cobre os custos de todas as suas ferramentas e garante seu lucro inicial.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Tab 4: Interactive Script Generator */}
      {activeTab === "gerador" && (
        <div className="space-y-6 text-left">
          <div className="bg-slate-950/80 p-5 rounded-xl border border-slate-800/80">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              Monte Sua Mensagem de Abordagem Altamente Customizada
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Field 1 */}
              <div className="space-y-1.5">
                <label htmlFor="gen-target-business" className="text-xs text-slate-400 font-medium block">Nome do Negócio Alvo</label>
                <input
                  id="gen-target-business"
                  type="text"
                  value={targetBusiness}
                  onChange={(e) => setTargetBusiness(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Ex: Pizzaria Bella Italia"
                />
              </div>

              {/* Field 2 */}
              <div className="space-y-1.5">
                <label htmlFor="gen-specialist-name" className="text-xs text-slate-400 font-medium block">Seu Nome / Nome Comercial</label>
                <input
                  id="gen-specialist-name"
                  type="text"
                  value={specialistName}
                  onChange={(e) => setSpecialistName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Ex: Lucas"
                />
              </div>

              {/* Field 3 */}
              <div className="space-y-1.5">
                <label htmlFor="gen-my-service" className="text-xs text-slate-400 font-medium block">Serviço Que Deseja Oferecer</label>
                <input
                  id="gen-my-service"
                  type="text"
                  value={myService}
                  onChange={(e) => setMyService(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Ex: Novo cardápio gastronômico com IA"
                />
              </div>

              {/* Field 4 */}
              <div className="space-y-1.5">
                <label htmlFor="gen-pain-point" className="text-xs text-slate-400 font-medium block">Ponto Crítico Identificado (A dor do cliente)</label>
                <input
                  id="gen-pain-point"
                  type="text"
                  value={painPoint}
                  onChange={(e) => setPainPoint(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Ex: fotos tremidas ou sem contraste no app de delivery"
                />
              </div>

            </div>
          </div>

          {/* Generated Result Container */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-400 animate-pulse" />
                Sua Mensagem Personalizada Gerada:
              </span>
              <button
                onClick={() => handleCopy(generatedPitchText, "generated-pitch")}
                className="text-xs text-emerald-400 hover:text-emerald-300 font-bold bg-emerald-500/10 px-3 py-1 rounded border border-emerald-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                {copiedId === "generated-pitch" ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copiado para WhatsApp!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copiar Mensagem Pronta</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-xs text-slate-200 font-mono leading-relaxed whitespace-pre-wrap select-all relative overflow-hidden">
              <div className="absolute right-3 top-3 w-4 h-4 rounded-full bg-emerald-500/20 animate-ping pointer-events-none"></div>
              {generatedPitchText}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
