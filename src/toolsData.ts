export interface AITool {
  name: string;
  description: string;
  recommendation: string; // How/when to use it
  url?: string;
}

export interface ToolCategory {
  title: string;
  icon: string; // Lucide icon name
  description: string;
  tools: AITool[];
}

export const AI_TOOLS_DIRECTORY: ToolCategory[] = [
  {
    title: "Ideias e Pesquisa",
    icon: "Lightbulb",
    description: "Ferramentas para brainstorming de negócios, geração de ideias de conteúdo e pesquisas aprofundadas com fontes confiáveis.",
    tools: [
      {
        name: "ChatGPT",
        description: "A IA conversacional mais famosa do mundo para geração de textos, códigos e ideias.",
        recommendation: "Use para criar roteiros de vídeos, sumários de e-books e ideias iniciais de micro-aplicativos.",
        url: "https://chatgpt.com"
      },
      {
        name: "Gemini",
        description: "Inteligência artificial do Google integrada com dados atualizados da web em tempo real.",
        recommendation: "Excelente para análises de mercado precisas e redação criativa de alta qualidade.",
        url: "https://gemini.google.com"
      },
      {
        name: "Bing Chat (Copilot)",
        description: "Buscador inteligente da Microsoft baseado nas tecnologias de ponta da OpenAI.",
        recommendation: "Ótimo para encontrar referências gratuitas, imagens e dados recentes da web com citações.",
        url: "https://copilot.microsoft.com"
      },
      {
        name: "Perplexity",
        description: "Um buscador em formato de conversação que responde perguntas fornecendo fontes e referências diretas.",
        recommendation: "Use para validar ideias de negócios e coletar dados estatísticos reais de mercado sem fake news.",
        url: "https://www.perplexity.ai"
      },
      {
        name: "Claude",
        description: "IA desenvolvida pela Anthropic, extremamente refinada para redação de textos longos e raciocínio lógico estruturado.",
        recommendation: "Melhor opção para revisar a escrita de e-books completos e refinar códigos complexos.",
        url: "https://claude.ai"
      }
    ]
  },
  {
    title: "Website Builders",
    icon: "Globe",
    description: "Criação instantânea de sites, landing pages e estruturas de vendas completas sem programar.",
    tools: [
      {
        name: "Dora",
        description: "Criação de sites 3D avançados e animações interativas surpreendentes através de prompts.",
        recommendation: "Use para criar páginas de vendas de altíssimo valor percebido e design futurista.",
        url: "https://www.dora.run"
      },
      {
        name: "Durable",
        description: "Gera um site comercial completo com imagens, textos e formulários em menos de 30 segundos.",
        recommendation: "Ideal para criar landing pages de teste rápidas para prospectar clientes locais no Google Maps.",
        url: "https://durable.co"
      },
      {
        name: "Wegic",
        description: "Plataforma interativa baseada em chat para design de páginas de forma colaborativa com IA.",
        recommendation: "Use para ajustar o visual de portfólios conversando diretamente com o assistente de design.",
        url: "https://wegic.ai"
      },
      {
        name: "Framer",
        description: "Gera designs e converte layouts diretamente do Figma em sites responsivos com animações ultra-fluidas.",
        recommendation: "Perfeito para criar landing pages profissionais para infoprodutos e agências digitais.",
        url: "https://www.framer.com"
      },
      {
        name: "10Web",
        description: "Reconstrói qualquer site existente dentro do ecossistema WordPress utilizando inteligência artificial.",
        recommendation: "Ideal para migrar e otimizar páginas lentas de clientes para WordPress em minutos.",
        url: "https://10web.io"
      }
    ]
  },
  {
    title: "Escrita de Copys",
    icon: "PenTool",
    description: "Criação de anúncios, e-mails de vendas estruturados e cartas de vendas persuasivas de alta conversão.",
    tools: [
      {
        name: "Jasper",
        description: "Uma das principais IAs corporativas de copy, treinada especificamente com modelos de marketing de sucesso.",
        recommendation: "Escreva e-mails de vendas, posts promocionais e copys de anúncios que convertem cliques em compras.",
        url: "https://www.jasper.ai"
      },
      {
        name: "Rytr",
        description: "Assistente de escrita rápido e acessível que ajuda a gerar copys em mais de 30 idiomas e toneladas de tons de voz.",
        recommendation: "Excelente para descrições de produtos na Kirvano e títulos chamativos de vídeos virais.",
        url: "https://rytr.me"
      },
      {
        name: "Textblaze",
        description: "Automatiza a inserção de templates de texto inteligentes em qualquer site ou aplicativo utilizando atalhos de teclado.",
        recommendation: "Perfeito para salvar scripts prontos de atendimento no WhatsApp de clientes e acelerar o suporte.",
        url: "https://blaze.today"
      },
      {
        name: "Sudowrite",
        description: "A IA de escrita criativa favorita de romancistas e escritores de e-books de ficção e não-ficção.",
        recommendation: "Use para dar mais profundidade, drama ou detalhamento aos capítulos de e-books de história ou fantasia.",
        url: "https://www.sudowrite.com"
      },
      {
        name: "Writesonic",
        description: "Especialista em criar artigos otimizados para SEO e copies longas para páginas de vendas focadas em conversão.",
        recommendation: "Ideal para estruturar páginas de captura completas com ganchos de persuasão inteligentes.",
        url: "https://writesonic.com"
      }
    ]
  },
  {
    title: "Produtividade & Reuniões",
    icon: "Calendar",
    description: "Gravação, transcrição e resumos inteligentes automáticos para poupar horas de trabalho manual.",
    tools: [
      {
        name: "Tldv",
        description: "Grava, transcreve e resume reuniões do Google Meet, Zoom e Teams de forma totalmente automatizada.",
        recommendation: "Compartilhe resumos em tópicos e as tomadas de decisões importantes de reuniões com os seus clientes web.",
        url: "https://tldv.io"
      },
      {
        name: "Krisp",
        description: "Cancelamento de ruído de fundo em tempo real baseado em IA para chamadas de áudio e vídeo de voz límpida.",
        recommendation: "Essencial para reuniões de fechamento de contratos de R$ 1.500 no Zoom mesmo com barulho em casa.",
        url: "https://krisp.ai"
      },
      {
        name: "Otter",
        description: "Transcritor inteligente que gera notas de reuniões de negócios em tempo real, identificando os oradores.",
        recommendation: "Transforme consultorias gravadas com clientes em rascunhos de guias práticos rapidamente.",
        url: "https://otter.ai"
      },
      {
        name: "Avoma",
        description: "Assistente de reuniões para equipes de vendas que analisa insights, dores do cliente e termos mais citados.",
        recommendation: "Use para refinar seus discursos de vendas de páginas web compreendendo o que o cliente mais valoriza.",
        url: "https://www.avoma.com"
      },
      {
        name: "Fireflies",
        description: "Pesquisa por termos dentro de gravações de voz e transcreve conversas em relatórios executivos acionáveis.",
        recommendation: "Use para extrair o briefing de reuniões longas de forma ultra-rápida.",
        url: "https://fireflies.ai"
      }
    ]
  },
  {
    title: "Assistentes & Chatbots",
    icon: "MessageSquare",
    description: "IAs de suporte ao cliente, extensões de navegadores e portais de múltiplos modelos.",
    tools: [
      {
        name: "Monica AI",
        description: "Extensão tudo-em-um para o navegador que funciona como um copiloto em qualquer site.",
        recommendation: "Traduza páginas, crie resumos rápidos de vídeos do YouTube e redija e-mails instantaneamente no Chrome.",
        url: "https://monica.im"
      },
      {
        name: "MaxiAI.me",
        description: "Extensão focada em privacidade para ler, resumir e reescrever e-mails e páginas web no navegador.",
        recommendation: "Otimize sua leitura diária de notícias de tendências de mercado e novas IAs sem perder tempo.",
        url: "https://maxiai.me"
      },
      {
        name: "Poe",
        description: "Portal que reúne os principais modelos de IA do mercado (GPT-4o, Claude 3.5, Gemini) em uma única assinatura.",
        recommendation: "Crie robôs personalizados (bots de chat) com suas próprias regras e venda o acesso ou uso desses bots.",
        url: "https://poe.com"
      },
      {
        name: "Copilot",
        description: "Assistente oficial da Microsoft integrado nativamente ao ecossistema Windows e aplicativos Office.",
        recommendation: "Crie planilhas, refine slides de propostas de serviços de forma automatizada no Word e Excel.",
        url: "https://copilot.microsoft.com"
      },
      {
        name: "Liner",
        description: "Ferramenta de busca de IA recomendada para estudantes e pesquisadores focada em sintetizar artigos longos da web.",
        recommendation: "Extremamente útil para garimpar dados acadêmicos e técnicos para construir e-books especializados.",
        url: "https://getliner.com"
      }
    ]
  },
  {
    title: "Marketing & Anúncios",
    icon: "Target",
    description: "Criação de campanhas completas, criativos de anúncios chamativos e otimização de mídias.",
    tools: [
      {
        name: "AdCopy",
        description: "Gerador de copies persuasivas focadas especificamente em anúncios de conversão para Facebook e Google Ads.",
        recommendation: "Gere variações de textos de anúncios em segundos e teste quais trazem mais vendas na Kirvano.",
        url: "https://adcopy.ai"
      },
      {
        name: "Predis AI",
        description: "Gera posts completos para redes sociais: imagem, legenda, hashtags e vídeo em lote com apenas um comando.",
        recommendation: "Automatize a criação de posts do Instagram de negócios locais de forma profissional.",
        url: "https://predis.ai"
      },
      {
        name: "Howler AI",
        description: "Robô inteligente de prospecção e envio automatizado de e-mails de vendas personalizados para empresas.",
        recommendation: "Perfeito para automatizar a captação de clientes de desenvolvimento web e design.",
        url: "https://www.howler.ai"
      },
      {
        name: "Bardeen AI",
        description: "Cria fluxos de automação de tarefas repetitivas diretamente no seu navegador, conectando apps sem código.",
        recommendation: "Extraia leads do LinkedIn e do Google Maps e salve em uma planilha para prospecção fria no WhatsApp.",
        url: "https://www.bardeen.ai"
      },
      {
        name: "AdCreative",
        description: "Gera imagens de anúncios focadas em conversão e banners comerciais validados por pontuações de IA.",
        recommendation: "Desenvolva banners promocionais de alta qualidade visual para os aplicativos que você colocar na Kirvano.",
        url: "https://www.adcreative.ai"
      }
    ]
  },
  {
    title: "Áudio & Vídeo",
    icon: "Video",
    description: "Ferramentas de transcrição reversa, clones de voz, geradores de dublagem e narrações realistas.",
    tools: [
      {
        name: "FluentlyAI",
        description: "Gera dublagens e traduções de vídeos preservando o tom de voz original do palestrante de forma limpa.",
        recommendation: "Use para adaptar vídeos virais gringos para o mercado brasileiro de forma instantânea.",
        url: "https://fluentlyai.com"
      },
      {
        name: "Descript",
        description: "Editor de vídeo inovador baseado em texto: edite o áudio ou vídeo simplesmente excluindo ou reescrevendo o texto da transcrição.",
        recommendation: "Crie cortes rápidos removendo silêncios e vícios de linguagem ('hã', 'tipo') automaticamente.",
        url: "https://www.descript.com"
      },
      {
        name: "Rev AI",
        description: "Ferramentas poderosas de reconhecimento de voz por IA com as menores taxas de erro do mercado global.",
        recommendation: "Crie legendas precisas para arquivos de áudio extensos com marcadores de tempo exatos.",
        url: "https://www.rev.ai"
      },
      {
        name: "Clipto",
        description: "Extrai rapidamente falas e legendas de vídeos das redes sociais e as transforma em formato de texto editável.",
        recommendation: "Use para extrair o roteiro de vídeos que viralizaram e recriar versões aprimoradas para seus canais.",
        url: "https://clipto.pro"
      },
      {
        name: "TextCortex",
        description: "Assistente de copy integrado com foco em simplificar o fluxo de redação de artigos de blogs de nichos de mercado.",
        recommendation: "Adapte o tom das narrações de seus vídeos curtos para torná-las mais intrigantes ou cômicas.",
        url: "https://textcortex.com"
      }
    ]
  },
  {
    title: "Texto para Voz & Música",
    icon: "Volume2",
    description: "Criação de áudio, clonagem vocal e trilhas sonoras autorais inteligentes isentas de direitos autorais.",
    tools: [
      {
        name: "Udio",
        description: "IA avançada que gera músicas completas em qualquer estilo, incluindo vocais, letras e melodias excelentes.",
        recommendation: "Crie músicas de fundo viciantes e exclusivas para trilhas de Reels e TikToks virais.",
        url: "https://www.udio.com"
      },
      {
        name: "Suno AI",
        description: "Gera trilhas sonoras incríveis e músicas completas a partir de uma descrição em texto curta.",
        recommendation: "Crie vinhetas, jingles ou fundos musicais temáticos para prender a atenção do leitor nos seus vídeos dark.",
        url: "https://suno.com"
      },
      {
        name: "Deepgram",
        description: "API de altíssima velocidade para conversão de fala em texto e texto em fala com baixa latência.",
        recommendation: "Excelente para desenvolvedores que desejam integrar conversação por voz em tempo real em seus apps.",
        url: "https://deepgram.com"
      },
      {
        name: "Speechify",
        description: "Lê qualquer PDF, livro ou artigo web em voz alta com vozes premium e naturais (incluindo celebridades).",
        recommendation: "Escute seus e-books gerados por IA para garantir que a leitura flua de forma natural e gostosa.",
        url: "https://speechify.com"
      },
      {
        name: "ElevenLabs",
        description: "A melhor plataforma de texto para voz e clonagem de voz ultra-realista do mundo com entonações dramáticas.",
        recommendation: "Essencial para gerar a locução profissional dos seus canais dark do YouTube Shorts e TikTok.",
        url: "https://elevenlabs.io"
      }
    ]
  },
  {
    title: "UI/UX & Design Web",
    icon: "Layout",
    description: "Criação de protótipos de interfaces, seleção de cores automáticas e fluxos de telas.",
    tools: [
      {
        name: "Galileo AI",
        description: "Gera interfaces de aplicativos e sites editáveis em Figma a partir de uma breve descrição por texto.",
        recommendation: "Use para conseguir designs de alta fidelidade e referências profissionais para seus apps do Lovable.",
        url: "https://www.usegalileo.ai"
      },
      {
        name: "Khroma",
        description: "IA de cores para designers que aprende suas preferências e gera paletas de cores infinitas e harmoniosas.",
        recommendation: "Use para escolher as combinações de cores perfeitas (como o verde e slate deste portal) para suas landing pages.",
        url: "https://www.khroma.co"
      },
      {
        name: "Uizard",
        description: "Transforme rascunhos feitos à mão em um caderno em telas digitais de aplicativos e sites interativos.",
        recommendation: "Fotografe ideias de telas de clientes, suba no Uizard e apresente um protótipo visualmente deslumbrante.",
        url: "https://uizard.io"
      },
      {
        name: "Visily",
        description: "Desenvolve wireframes e diagramas de fluxo de design de alta conversão de forma rápida e intuitiva.",
        recommendation: "Perfeito para criar o esqueleto estrutural de um e-commerce antes de iniciar o desenvolvimento.",
        url: "https://www.visily.ai"
      },
      {
        name: "VisualEyes",
        description: "Simula testes de mapa de calor usando IA para prever onde os usuários focarão a atenção na tela do site.",
        recommendation: "Otimize a posição do botão de compra da Kirvano nas suas páginas web para maximizar cliques.",
        url: "https://www.visualeyes.design"
      }
    ]
  },
  {
    title: "Geração de Imagens",
    icon: "Image",
    description: "Criação de fotos realistas, ilustrações premium e artes 3D exclusivas.",
    tools: [
      {
        name: "Dzine (Stylar)",
        description: "Gera e edita imagens controlando perfeitamente a posição de objetos e estilos artísticos específicos.",
        recommendation: "Excelente para colocar rostos idênticos em diferentes cenários para criar influenciadores virtuais de IA.",
        url: "https://www.dzine.ai"
      },
      {
        name: "Freepik AI",
        description: "Gerador de imagens ultra-rápido integrado com ferramentas de edição vetorial direto no navegador.",
        recommendation: "Encontre e gere ilustrações premium de alta resolução para emoldurar o cabeçalho dos seus e-books.",
        url: "https://www.freepik.com"
      },
      {
        name: "Phygital+",
        description: "Ferramenta de arte em IA baseada em nós que junta modelos como Midjourney e Stable Diffusion em uma tela infinita.",
        recommendation: "Crie designs industriais ou fusões de fotos de produtos para criar anúncios realistas.",
        url: "https://phygital.plus"
      },
      {
        name: "DALL-E 3",
        description: "O poderoso gerador de imagens da OpenAI, nativo no ChatGPT Plus, excelente para entender prompts complexos.",
        recommendation: "Crie ilustrações conceituais de alta qualidade com textos legíveis embutidos na imagem.",
        url: "https://openai.com/dall-e-3"
      },
      {
        name: "Bing Image Creator",
        description: "Acesso gratuito e rápido ao modelo DALL-E 3 fornecido pela Microsoft em seu hub de criação.",
        recommendation: "A melhor alternativa sem custos para gerar capas e planos de fundo decorativos de alta qualidade.",
        url: "https://www.bing.com/create"
      }
    ]
  },
  {
    title: "Geração de Vídeos",
    icon: "Clapperboard",
    description: "Crie avatares falantes realistas, animações promocionais e vídeos de alta conversão.",
    tools: [
      {
        name: "Pictory",
        description: "Transforma roteiros e artigos longos em vídeos curtos com trechos de estoque e legendas sincronizadas automáticas.",
        recommendation: "Crie canais de cortes ou resumos de notícias no piloto automático apenas colando textos de blogs.",
        url: "https://pictory.ai"
      },
      {
        name: "HeyGen",
        description: "A melhor plataforma para criar apresentadores virtuais humanos digitais que falam qualquer texto de forma realista.",
        recommendation: "Use para criar vídeos de vendas sem precisar aparecer ou contratar atores profissionais caros.",
        url: "https://www.heygen.com"
      },
      {
        name: "Nullface.AI",
        description: "Criação rápida de vídeos sem rosto para canais dark focados em engajamento vertical do TikTok.",
        recommendation: "Excelente para automatizar a produção de reels sobre fatos de curiosidades e segredos históricos.",
        url: "https://nullface.ai"
      },
      {
        name: "Invideo AI",
        description: "Gera o vídeo completo com roteiro, trilha sonora, clipes de vídeo e narração de voz realista com apenas um prompt.",
        recommendation: "Use para produzir canais dark inteiros de forma instantânea para YouTube Shorts e Reels.",
        url: "https://invideo.io"
      },
      {
        name: "Synthesia",
        description: "Plataforma de vídeo corporativa com avatares de IA de ponta para treinamentos empresariais e apresentações institucionais.",
        recommendation: "Venda serviços de criação de vídeos de treinamento de funcionários para clínicas locais na sua cidade.",
        url: "https://www.synthesia.io"
      }
    ]
  },
  {
    title: "Criação de Marcas & Design",
    icon: "Palette",
    description: "Geração de logotipos profissionais, remoção de fundos e branding inteligente.",
    tools: [
      {
        name: "Looka",
        description: "Gera identidades visuais completas, marcas e cartões de visita profissionais em segundos com base nas suas preferências.",
        recommendation: "Use para vender pacotes de identidade visual para novos profissionais liberais que fecharem sites com você.",
        url: "https://looka.com"
      },
      {
        name: "Clipdrop",
        description: "Ferramentas incríveis da Stability AI para remover fundos, remover objetos indesejados e reiluminar fotos de forma mágica.",
        recommendation: "Melhore as fotos enviadas por clientes locais de seus estabelecimentos para colocar no site.",
        url: "https://clipdrop.co"
      },
      {
        name: "Autodraw",
        description: "Ferramenta gratuita do Google que prevê seus rascunhos simples e os substitui por ícones limpos e profissionais.",
        recommendation: "Crie ilustrações rápidas e limpas de diagramas para emoldurar nos seus e-books digitais.",
        url: "https://www.autodraw.com"
      },
      {
        name: "Vance AI",
        description: "Restauração, ampliação e nitidez de imagens pixeladas ou antigas com apenas um clique.",
        recommendation: "Aumente a resolução de logotipos antigos de clientes locais antes de construir a landing page deles.",
        url: "https://vanceai.com"
      },
      {
        name: "Designs AI",
        description: "Suíte integrada que gera logotipos, vídeos, banners para redes sociais e narrações em uma plataforma unificada.",
        recommendation: "Use para simplificar o seu fluxo de criação de campanhas de tráfego pago na internet.",
        url: "https://designs.ai"
      }
    ]
  },
  {
    title: "Apresentações Impactantes",
    icon: "Presentation",
    description: "Geração de slides profissionais com design moderno, gráficos e narrativas persuasivas.",
    tools: [
      {
        name: "Beautiful.ai",
        description: "Designers inteligentes que estruturam as informações de seus slides perfeitamente em layouts harmônicos automáticos.",
        recommendation: "Ideal para apresentar suas propostas comerciais de sites e fechar contratos de R$ 1.500 com empresários.",
        url: "https://www.beautiful.ai"
      },
      {
        name: "Slidebean",
        description: "Gera pitch decks profissionais focados em captação de recursos e vendas estruturadas automaticamente.",
        recommendation: "Excelente para apresentar planos de expansão comercial para donos de grandes franquias locais.",
        url: "https://slidebean.com"
      },
      {
        name: "Pitch",
        description: "Criação colaborativa de apresentações ricas com layouts inovadores, gráficos animados e integrações completas.",
        recommendation: "Desenvolva portfólios corporativos deslumbrantes para atrair novos clientes liberais.",
        url: "https://pitch.com"
      },
      {
        name: "Gamma",
        description: "Gera apresentações, documentos estruturados ou páginas web inteiras prontas para apresentação em segundos com IA.",
        recommendation: "Peça para gerar o roteiro e slides de uma proposta de consultoria de marketing digital para fechar serviços no Maps.",
        url: "https://gamma.app"
      },
      {
        name: "Tome",
        description: "Geração narrativa e visual de apresentações com foco em storytelling e layouts dinâmicos interativos.",
        recommendation: "Ideal para formatar guias de treinamento visual para novos parceiros de infoprodutos.",
        url: "https://tome.app"
      }
    ]
  },
  {
    title: "Automação de Vendas",
    icon: "Cpu",
    description: "Automação de e-mails, triagem de leads, qualificação automática e disparo de ofertas.",
    tools: [
      {
        name: "Phrasee",
        description: "Otimiza e escreve mensagens de campanhas por IA gerando as melhores taxas de abertura de e-mails e cliques.",
        recommendation: "Escreva e-mails de recuperação de carrinho abandonado para seus compradores na plataforma Kirvano.",
        url: "https://phrasee.co"
      },
      {
        name: "Outreach",
        description: "Plataforma avançada de inteligência em vendas que mapeia o melhor momento e script para abordar cada lead.",
        recommendation: "Organize sua agência de sites controlando os contatos feitos no WhatsApp e e-mail de empresários.",
        url: "https://www.outreach.io"
      },
      {
        name: "ClickUp AI",
        description: "Suíte de gestão que ajuda a resumir tarefas, documentar reuniões e gerenciar cronogramas no piloto automático.",
        recommendation: "Excelente para organizar sua rotina de criação de e-books e desenvolvimento de landing pages.",
        url: "https://clickup.com"
      },
      {
        name: "Drift",
        description: "Robôs inteligentes de conversação focados em qualificar visitantes de sites e agendar reuniões com consultores reais.",
        recommendation: "Ofereça e integre esse serviço opcional de chatbot de triagem nas landing pages que você vender.",
        url: "https://www.drift.com"
      },
      {
        name: "Emplifi",
        description: "Plataforma de gerenciamento de redes sociais com automação de interações, respostas rápidas e SAC Inteligente.",
        recommendation: "Use para gerenciar múltiplas marcas de clientes em paralelo sem perder o controle dos directs.",
        url: "https://emplifi.io"
      }
    ]
  },
  {
    title: "Blogging & SEO",
    icon: "FileText",
    description: "Geração de artigos otimizados para mecanismos de buscas, reescrita de textos e blogs.",
    tools: [
      {
        name: "Katteb",
        description: "Gera artigos cheios de fatos reais e revisados em tempo real com fontes de dados verificáveis de alta confiabilidade.",
        recommendation: "Escreva resenhas ou conteúdos informativos detalhados para compor os capítulos finais dos seus e-books.",
        url: "https://www.katteb.com"
      },
      {
        name: "Rewording",
        description: "Reescreve parágrafos e otimiza textos acadêmicos ou comerciais para deixá-los com mais clareza e ritmo de leitura.",
        recommendation: "Use para dar um toque mais natural e humanizado aos roteiros curtos criados por robôs.",
        url: "https://rewording.io"
      },
      {
        name: "Elephas",
        description: "Escritor pessoal de IA para Mac integrado com todos os seus aplicativos do computador (e-mails, Word, chats).",
        recommendation: "Excelente para redigir respostas rápidas e profissionais para clientes de design no WhatsApp Desktop.",
        url: "https://elephas.app"
      },
      {
        name: "Junia AI",
        description: "Plataforma completa de SEO que cria artigos longos e estruturados prontos para ranquear no topo do Google em minutos.",
        recommendation: "Use para criar páginas de atração de tráfego orgânico para vender seus infoprodutos sem anúncios.",
        url: "https://www.junia.ai"
      },
      {
        name: "Journalist AI",
        description: "Gera e publica de forma totalmente automatizada artigos de alta relevância no seu blog WordPress ou Shopify diariamente.",
        recommendation: "Crie um blog de nicho (ex: emagrecimento) e venda espaço de anúncio ou links de afiliado.",
        url: "https://www.tryjournalist.com"
      }
    ]
  },
  {
    title: "Detectores & Corretores",
    icon: "ShieldAlert",
    description: "Detecção de textos gerados por robôs, humanizadores de conteúdo e correção gramatical sofisticada.",
    tools: [
      {
        name: "GPTZero",
        description: "A ferramenta de classificação mais precisa para identificar se um texto foi escrito por ChatGPT ou por um humano.",
        recommendation: "Use para testar e humanizar seus e-books para garantir que fiquem impossíveis de serem detectados.",
        url: "https://gptzero.me"
      },
      {
        name: "Wordtune",
        description: "Sugere palavras alternativas e tons de frases em tempo real para deixar sua escrita mais profissional e fluida.",
        recommendation: "Otimize os e-mails de captação que você envia para médicos e empresários locais.",
        url: "https://www.wordtune.com"
      },
      {
        name: "Copyleaks",
        description: "Detecta plágio e textos gerados por inteligência artificial em múltiplos formatos e dezenas de idiomas.",
        recommendation: "Garanta a autenticidade dos seus guias e e-books antes de subir na plataforma Kirvano.",
        url: "https://copyleaks.com"
      },
      {
        name: "BypassGPT",
        description: "Humanizador inteligente de textos gerados por IA que reescreve o conteúdo para torná-lo indetectável por classificadores.",
        recommendation: "Use para converter textos do ChatGPT em artigos de leitura extremamente natural e humanizada.",
        url: "https://bypassgpt.com"
      },
      {
        name: "Grammarly",
        description: "O corretor gramatical, estilístico e ortográfico inteligente mais popular e poderoso da internet.",
        recommendation: "Essencial para revisar todas as páginas do site dos seus clientes antes de entregar e faturar o serviço.",
        url: "https://www.grammarly.com"
      }
    ]
  }
];
