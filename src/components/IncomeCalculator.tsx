import { useState, useEffect } from "react";
import { Coins, TrendingUp, Target, Landmark, ArrowRight } from "lucide-react";

interface CalculatorProps {
  initialMethodId?: string;
}

export default function IncomeCalculator({ initialMethodId = "infoprodutos-ia" }: CalculatorProps) {
  const [methodId, setMethodId] = useState<string>(initialMethodId);
  
  // States for Method 1 (Infoproducts)
  const [m1Price, setM1Price] = useState<number>(37); // R$ 25 to R$ 50
  const [m1Sales, setM1Sales] = useState<number>(100); // sales per month

  // States for Method 2 (Viral Videos)
  const [m2Views, setM2Views] = useState<number>(500); // in thousands (e.g. 500k views per month)
  const [m2Rpm, setM2Rpm] = useState<number>(0.15); // USD RPM (converted to BRL)

  // States for Method 3 (Freelance)
  const [m3Price, setM3Price] = useState<number>(800); // R$ 500 to R$ 1500
  const [m3Clients, setM3Clients] = useState<number>(4); // clients per month

  // States for Method 4 (E-books)
  const [m4Price, setM4Price] = useState<number>(27); // R$ 19 to R$ 39
  const [m4Sales, setM4Sales] = useState<number>(150); // monthly sales

  // States for Method 5 (Social Media)
  const [m5Price, setM5Price] = useState<number>(450); // R$ 300 to R$ 800
  const [m5Clients, setM5Clients] = useState<number>(3); // monthly clients

  // States for Method 6 (Food Photo delivery)
  const [m6Price, setM6Price] = useState<number>(29); // R$ 19 to R$ 49
  const [m6Dishes, setM6Dishes] = useState<number>(100); // monthly optimized photos

  const [monthlyProfit, setMonthlyProfit] = useState<number>(0);

  // US Dollar to BRL exchange rate (fixed simulation value for conversion, e.g., 5.0)
  const USD_TO_BRL = 5.20;

  useEffect(() => {
    if (methodId === "infoprodutos-ia") {
      setMonthlyProfit(m1Price * m1Sales);
    } else if (methodId === "videos-virais-ia") {
      // YouTube Shorts / TikTok pays around $0.02 - $0.04 per 1k views on low end, or $0.10 - $0.30 on TikTok Creativity Program
      // Let's calculate: (views in thousands) * RPM (USD) * USD_TO_BRL
      setMonthlyProfit(m2Views * m2Rpm * USD_TO_BRL);
    } else if (methodId === "landing-pages-local") {
      setMonthlyProfit(m3Price * m3Clients);
    } else if (methodId === "vender-ebooks-ia") {
      setMonthlyProfit(m4Price * m4Sales);
    } else if (methodId === "gestao-social-media-ia") {
      setMonthlyProfit(m5Price * m5Clients);
    } else if (methodId === "melhorar-fotos-delivery") {
      setMonthlyProfit(m6Price * m6Dishes);
    }
  }, [methodId, m1Price, m1Sales, m2Views, m2Rpm, m3Price, m3Clients, m4Price, m4Sales, m5Price, m5Clients, m6Price, m6Dishes]);

  const formatBRL = (val: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(val);
  };

  return (
    <div id="income-calculator-section" className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 md:p-8 backdrop-blur-xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-emerald-400 font-mono text-xs tracking-wider uppercase flex items-center gap-1.5 mb-1">
            <Coins className="w-3.5 h-3.5" />
            Simulador Financeiro
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight">Quanto você pode ganhar?</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            id="calc-method-m1"
            onClick={() => setMethodId("infoprodutos-ia")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              methodId === "infoprodutos-ia"
                ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750"
            }`}
          >
            Método 1 (Infoprodutos)
          </button>
          <button
            id="calc-method-m2"
            onClick={() => setMethodId("videos-virais-ia")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              methodId === "videos-virais-ia"
                ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750"
            }`}
          >
            Método 2 (Canais Dark)
          </button>
          <button
            id="calc-method-m3"
            onClick={() => setMethodId("landing-pages-local")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              methodId === "landing-pages-local"
                ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750"
            }`}
          >
            Método 3 (Páginas Web)
          </button>
          <button
            id="calc-method-m4"
            onClick={() => setMethodId("vender-ebooks-ia")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              methodId === "vender-ebooks-ia"
                ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750"
            }`}
          >
            Método 4 (E-books)
          </button>
          <button
            id="calc-method-m5"
            onClick={() => setMethodId("gestao-social-media-ia")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              methodId === "gestao-social-media-ia"
                ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750"
            }`}
          >
            Método 5 (Social Media)
          </button>
          <button
            id="calc-method-m6"
            onClick={() => setMethodId("melhorar-fotos-delivery")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              methodId === "melhorar-fotos-delivery"
                ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-750"
            }`}
          >
            Método 6 (Cardápios iFood)
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        {/* Sliders Area */}
        <div className="lg:col-span-3 space-y-6">
          {methodId === "infoprodutos-ia" && (
            <>
              {/* Slider 1: Price */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label htmlFor="m1-price-slider" className="text-slate-300 font-medium">Preço do Aplicativo (R$)</label>
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    {formatBRL(m1Price)}
                  </span>
                </div>
                <input
                  id="m1-price-slider"
                  type="range"
                  min="25"
                  max="50"
                  step="1"
                  value={m1Price}
                  onChange={(e) => setM1Price(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                />
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>R$ 25</span>
                  <span>R$ 37 (Médio)</span>
                  <span>R$ 50</span>
                </div>
              </div>

              {/* Slider 2: Sales */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label htmlFor="m1-sales-slider" className="text-slate-300 font-medium">Vendas Mensais Estimadas</label>
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    {m1Sales} vendas
                  </span>
                </div>
                <input
                  id="m1-sales-slider"
                  type="range"
                  min="10"
                  max="500"
                  step="5"
                  value={m1Sales}
                  onChange={(e) => setM1Sales(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                />
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>10</span>
                  <span>250</span>
                  <span>500</span>
                </div>
              </div>
            </>
          )}

          {methodId === "videos-virais-ia" && (
            <>
              {/* Slider 1: Views */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label htmlFor="m2-views-slider" className="text-slate-300 font-medium">Visualizações Mensais Reais (em Milhares)</label>
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    {(m2Views * 1000).toLocaleString("pt-BR")} views
                  </span>
                </div>
                <input
                  id="m2-views-slider"
                  type="range"
                  min="50"
                  max="3000"
                  step="50"
                  value={m2Views}
                  onChange={(e) => setM2Views(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                />
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>50 mil</span>
                  <span>1.5 Milhões</span>
                  <span>3 Milhões</span>
                </div>
              </div>

              {/* Slider 2: RPM */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label htmlFor="m2-rpm-slider" className="text-slate-300 font-medium">RPM estimado por 1k views (em Dólar USD)</label>
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    ${m2Rpm.toFixed(2)} USD (~{(m2Rpm * USD_TO_BRL).toFixed(2)} BRL)
                  </span>
                </div>
                <input
                  id="m2-rpm-slider"
                  type="range"
                  min="0.05"
                  max="0.60"
                  step="0.01"
                  value={m2Rpm}
                  onChange={(e) => setM2Rpm(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                />
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>$0.05</span>
                  <span>$0.30</span>
                  <span>$0.60</span>
                </div>
              </div>
            </>
          )}

          {methodId === "landing-pages-local" && (
            <>
              {/* Slider 1: Website Price */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label htmlFor="m3-price-slider" className="text-slate-300 font-medium">Preço Cobrado por Landing Page (R$)</label>
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    {formatBRL(m3Price)}
                  </span>
                </div>
                <input
                  id="m3-price-slider"
                  type="range"
                  min="500"
                  max="2000"
                  step="50"
                  value={m3Price}
                  onChange={(e) => setM3Price(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                />
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>R$ 500</span>
                  <span>R$ 1.250</span>
                  <span>R$ 2.000</span>
                </div>
              </div>

              {/* Slider 2: Monthly Clients */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label htmlFor="m3-clients-slider" className="text-slate-300 font-medium">Clientes Fechados por Mês</label>
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    {m3Clients} clientes
                  </span>
                </div>
                <input
                  id="m3-clients-slider"
                  type="range"
                  min="1"
                  max="15"
                  step="1"
                  value={m3Clients}
                  onChange={(e) => setM3Clients(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                />
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>1 cliente</span>
                  <span>8 clientes</span>
                  <span>15 clientes</span>
                </div>
              </div>
            </>
          )}

          {methodId === "vender-ebooks-ia" && (
            <>
              {/* Slider 1: E-book Price */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label htmlFor="m4-price-slider" className="text-slate-300 font-medium">Preço do E-book (R$)</label>
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    {formatBRL(m4Price)}
                  </span>
                </div>
                <input
                  id="m4-price-slider"
                  type="range"
                  min="19"
                  max="39"
                  step="1"
                  value={m4Price}
                  onChange={(e) => setM4Price(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                />
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>R$ 19</span>
                  <span>R$ 29 (Ideal)</span>
                  <span>R$ 39</span>
                </div>
              </div>

              {/* Slider 2: E-book Sales */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label htmlFor="m4-sales-slider" className="text-slate-300 font-medium">E-books Vendidos por Mês</label>
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    {m4Sales} e-books
                  </span>
                </div>
                <input
                  id="m4-sales-slider"
                  type="range"
                  min="10"
                  max="500"
                  step="5"
                  value={m4Sales}
                  onChange={(e) => setM4Sales(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                />
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>10</span>
                  <span>250</span>
                  <span>500</span>
                </div>
              </div>
            </>
          )}

          {methodId === "gestao-social-media-ia" && (
            <>
              {/* Slider 1: Social Media Price */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label htmlFor="m5-price-slider" className="text-slate-300 font-medium">Preço da Gestão Mensal (R$)</label>
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    {formatBRL(m5Price)}
                  </span>
                </div>
                <input
                  id="m5-price-slider"
                  type="range"
                  min="300"
                  max="800"
                  step="50"
                  value={m5Price}
                  onChange={(e) => setM5Price(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                />
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>R$ 300</span>
                  <span>R$ 550</span>
                  <span>R$ 800</span>
                </div>
              </div>

              {/* Slider 2: Social Media Clients */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label htmlFor="m5-clients-slider" className="text-slate-300 font-medium">Clientes Ativos</label>
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    {m5Clients} empresas
                  </span>
                </div>
                <input
                  id="m5-clients-slider"
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={m5Clients}
                  onChange={(e) => setM5Clients(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                />
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>1 cliente</span>
                  <span>5 clientes</span>
                  <span>10 clientes</span>
                </div>
              </div>
            </>
          )}

          {methodId === "melhorar-fotos-delivery" && (
            <>
              {/* Slider 1: Delivery Photo Price */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label htmlFor="m6-price-slider" className="text-slate-300 font-medium">Preço por Foto de Prato (R$)</label>
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    {formatBRL(m6Price)}
                  </span>
                </div>
                <input
                  id="m6-price-slider"
                  type="range"
                  min="19"
                  max="49"
                  step="1"
                  value={m6Price}
                  onChange={(e) => setM6Price(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                />
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>R$ 19</span>
                  <span>R$ 34</span>
                  <span>R$ 49</span>
                </div>
              </div>

              {/* Slider 2: Delivery Photo Dishes */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <label htmlFor="m6-dishes-slider" className="text-slate-300 font-medium">Fotos Otimizadas no Mês</label>
                  <span className="font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20">
                    {m6Dishes} pratos
                  </span>
                </div>
                <input
                  id="m6-dishes-slider"
                  type="range"
                  min="10"
                  max="300"
                  step="5"
                  value={m6Dishes}
                  onChange={(e) => setM6Dishes(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-400 focus:outline-none"
                />
                <div className="flex justify-between text-xs text-slate-500 font-mono">
                  <span>10 pratos</span>
                  <span>150 pratos</span>
                  <span>300 pratos</span>
                </div>
              </div>
            </>
          )}

          {/* Actionable insight box */}
          <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
            <Target className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-400 space-y-1">
              <p className="font-semibold text-slate-200">Como atingir essa meta?</p>
              {methodId === "infoprodutos-ia" && (
                <p>
                  Para conseguir {m1Sales} vendas de {formatBRL(m1Price)}, você precisa atrair cerca de {m1Sales * 30} visitantes para sua página de vendas na Kirvano. Isso representa apenas {Math.round((m1Sales * 30) / 30)} cliques por dia, o que é facilmente atingido postando 2 Reels/TikToks orgânicos diariamente!
                </p>
              )}
              {methodId === "videos-virais-ia" && (
                <p>
                  Com {(m2Views * 1000).toLocaleString("pt-BR")} visualizações, seu canal começará a ranquear no algoritmo de canais de cortes e curiosidades. Produza vídeos diários em lote de mistérios ou histórias reais com ganchos fortes!
                </p>
              )}
              {methodId === "landing-pages-local" && (
                <p>
                  Fechar {m3Clients} clientes no mês significa prospectar e enviar 1 proposta simplificada por dia no WhatsApp (30 propostas no mês). Com uma taxa de fechamento conservadora de 13%, você facilmente garante os seus {m3Clients} novos clientes!
                </p>
              )}
              {methodId === "vender-ebooks-ia" && (
                <p>
                  Vender {m4Sales} e-books de {formatBRL(m4Price)} requer apenas {Math.round(m4Sales / 30)} vendas diárias. Criando uma bela capa 3D e postando pequenos trechos ou curiosidades intrigantes do livro no TikTok e Instagram, você atrairá tráfego gratuito altamente qualificado e pronto para comprar!
                </p>
              )}
              {methodId === "gestao-social-media-ia" && (
                <p>
                  Manter {m5Clients} clientes ativos pagando {formatBRL(m5Price)} por mês exige poucas horas de trabalho semanal. Com inteligência artificial gerenciando a redação e geração de artes em lote, você pode agendar o mês inteiro de posts de todos os clientes em um único fim de semana!
                </p>
              )}
              {methodId === "melhorar-fotos-delivery" && (
                <p>
                  Otimizar {m6Dishes} pratos no mês com o valor de {formatBRL(m6Price)} significa atualizar cerca de {Math.round(m6Dishes / 15)} cardápios completos (calculando 15 pratos por restaurante). Basta fechar parcerias com apenas {Math.ceil(m6Dishes / 15)} novos estabelecimentos locais no mês para atingir essa excelente renda extra!
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between h-full min-h-[250px] relative overflow-hidden">
          {/* Subtle neon gradient glow on background */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-4 z-10">
            <span className="text-slate-400 text-xs font-mono tracking-wider uppercase block">Lucro Projetado</span>
            
            <div className="space-y-1">
              <span className="text-slate-500 text-xs font-medium block">Faturamento Mensal</span>
              <span className="text-3xl md:text-4xl font-extrabold text-emerald-400 font-mono tracking-tight block">
                {formatBRL(monthlyProfit)}
              </span>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <Landmark className="w-3.5 h-3.5 text-emerald-500" />
                  Rendimento Anual (Projeção)
                </span>
                <span className="font-mono font-bold text-slate-200">{formatBRL(monthlyProfit * 12)}</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 z-10">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {monthlyProfit < 1500 && "🚀 Excelente para uma renda extra inicial de poucas horas semanais!"}
                {monthlyProfit >= 1500 && monthlyProfit < 5000 && "⭐ Nível de faturamento sólido. Ideal para transição de carreira!"}
                {monthlyProfit >= 5000 && "🔥 Negócio altamente lucrativo rodando de forma profissional!"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
