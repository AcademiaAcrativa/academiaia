import { useState, useMemo } from "react";
import { 
  Search, ExternalLink, Lightbulb, Globe, PenTool, Calendar, 
  MessageSquare, Target, Video, Volume2, Layout, Image, 
  Clapperboard, Palette, Presentation, Cpu, FileText, ShieldAlert, Sparkles
} from "lucide-react";
import { AI_TOOLS_DIRECTORY, ToolCategory, AITool } from "../toolsData";

// Helper to get the correct icon component
const getCategoryIcon = (iconName: string, className: string) => {
  const props = { className };
  switch (iconName) {
    case "Lightbulb": return <Lightbulb {...props} />;
    case "Globe": return <Globe {...props} />;
    case "PenTool": return <PenTool {...props} />;
    case "Calendar": return <Calendar {...props} />;
    case "MessageSquare": return <MessageSquare {...props} />;
    case "Target": return <Target {...props} />;
    case "Video": return <Video {...props} />;
    case "Volume2": return <Volume2 {...props} />;
    case "Layout": return <Layout {...props} />;
    case "Image": return <Image {...props} />;
    case "Clapperboard": return <Clapperboard {...props} />;
    case "Palette": return <Palette {...props} />;
    case "Presentation": return <Presentation {...props} />;
    case "Cpu": return <Cpu {...props} />;
    case "FileText": return <FileText {...props} />;
    case "ShieldAlert": return <ShieldAlert {...props} />;
    default: return <Sparkles {...props} />;
  }
};

export default function AIToolsLibrary() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Filter tools by category and search term
  const filteredCategories = useMemo(() => {
    return AI_TOOLS_DIRECTORY.map(category => {
      // Check if this category is selected (if any)
      if (selectedCategory && category.title !== selectedCategory) {
        return null;
      }

      // Filter tools within this category
      const matchedTools = category.tools.filter(tool => 
        tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tool.recommendation.toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (matchedTools.length === 0) {
        return null;
      }

      return {
        ...category,
        tools: matchedTools
      };
    }).filter((cat): cat is ToolCategory => cat !== null);
  }, [searchTerm, selectedCategory]);

  // Count total matching tools
  const totalToolsCount = useMemo(() => {
    return filteredCategories.reduce((acc, cat) => acc + cat.tools.length, 0);
  }, [filteredCategories]);

  return (
    <div id="ai-tools-library-container" className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono rounded-full font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            Mega Biblioteca de Inteligência Artificial
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            80 Ferramentas de IA Recomendadas
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            Explore a curadoria completa das melhores inteligências artificiais com recomendações estratégicas de monetização.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-80 shrink-0">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-500">
            <Search className="w-4 h-4" />
          </span>
          <input
            id="tools-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar ferramenta ou utilidade..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500/50 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/30 transition-all"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Category Pills Selectors */}
      <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto scrollbar-thin scrollbar-thumb-slate-800">
        <button
          id="category-pill-all"
          onClick={() => setSelectedCategory(null)}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
            selectedCategory === null
              ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
              : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
          }`}
        >
          Todas as Categorias ({searchTerm ? totalToolsCount : 80})
        </button>
        {AI_TOOLS_DIRECTORY.map((cat, i) => {
          const isSelected = selectedCategory === cat.title;
          return (
            <button
              key={cat.title}
              id={`category-pill-${i}`}
              onClick={() => setSelectedCategory(cat.title)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isSelected
                  ? "bg-emerald-500 text-slate-950 shadow-md font-bold"
                  : "bg-slate-950 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700"
              }`}
            >
              {getCategoryIcon(cat.icon, "w-3.5 h-3.5")}
              <span>{cat.title}</span>
            </button>
          );
        })}
      </div>

      {/* Results Count & Alert */}
      {searchTerm && (
        <p className="text-xs text-slate-400 font-mono">
          Encontradas <span className="text-emerald-400 font-bold">{totalToolsCount}</span> correspondências para sua busca.
        </p>
      )}

      {/* Categories & Tools Grid */}
      <div className="space-y-8">
        {filteredCategories.map((cat, i) => (
          <div key={cat.title} className="space-y-4" id={`cat-section-${i}`}>
            
            {/* Category Subheader */}
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800/40">
              <div className="p-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded-lg text-emerald-400">
                {getCategoryIcon(cat.icon, "w-4 h-4")}
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-wide">
                  {cat.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {cat.description}
                </p>
              </div>
            </div>

            {/* Tools Grid within this category */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cat.tools.map((tool, j) => (
                <div 
                  key={tool.name}
                  id={`tool-card-${i}-${j}`}
                  className="bg-slate-950/60 border border-slate-850 hover:border-emerald-500/30 rounded-xl p-5 flex flex-col justify-between transition-all hover:translate-y-[-2px] hover:shadow-lg group"
                >
                  <div className="space-y-3">
                    {/* Tool title and name */}
                    <div className="flex items-center justify-between">
                      <h4 className="text-base font-extrabold text-white group-hover:text-emerald-400 transition-colors">
                        {tool.name}
                      </h4>
                      <span className="text-[10px] font-mono text-slate-600 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                        {cat.title}
                      </span>
                    </div>

                    {/* Tool description */}
                    <p className="text-xs text-slate-400 leading-relaxed min-h-[40px]">
                      {tool.description}
                    </p>

                    {/* Strategy / Recommendation Box */}
                    <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-lg p-3 text-[11px] leading-relaxed text-slate-300">
                      <span className="text-emerald-400 font-bold block mb-1 font-mono uppercase tracking-wider text-[10px] flex items-center gap-1">
                        <Lightbulb className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        Recomendação de Ganho
                      </span>
                      {tool.recommendation}
                    </div>
                  </div>

                  {/* Access Button */}
                  {tool.url && (
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 w-full bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white text-xs font-semibold py-2 px-3 rounded-lg border border-slate-800 hover:border-emerald-500/35 transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Acessar {tool.name}</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400" />
                    </a>
                  )}
                </div>
              ))}
            </div>

          </div>
        ))}

        {filteredCategories.length === 0 && (
          <div className="text-center py-12 bg-slate-950/35 border border-dashed border-slate-800 rounded-xl">
            <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 text-sm font-semibold">Nenhuma IA encontrada para sua pesquisa.</p>
            <p className="text-slate-600 text-xs mt-1">Tente pesquisar termos alternativos ou limpe os filtros acima.</p>
          </div>
        )}
      </div>

    </div>
  );
}
