import { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  Search, 
  Award, 
  HelpCircle, 
  Send, 
  CheckCircle, 
  XCircle, 
  TrendingUp, 
  Cpu, 
  DollarSign, 
  AlertCircle, 
  RotateCcw, 
  Info, 
  Percent, 
  Compass, 
  ArrowRight, 
  Check, 
  BookMarked,
  Layers,
  Sparkles,
  ChevronRight,
  MessageSquare,
  BookText,
  Home,
  Lock,
  Menu,
  X,
  Trophy,
  GraduationCap,
  Copy,
  FileText,
  ArrowUp
} from 'lucide-react';
import { CHAPTERS, GLOSSARY, Chapter, GlossaryItem } from './data/bsgManual';
import Markdown from 'react-markdown';

// CHAPTER METADATA for beautiful Saas-like chapter introduction headers
const CHAPTER_METADATA: Record<string, { level: 'Principiante' | 'Intermedio' | 'Avanzado'; time: string; objectives: string[] }> = {
  "1-introduccion": {
    level: "Principiante",
    time: "10 min",
    objectives: [
      "Comprender la dinámica de competencia en BSG",
      "Analizar las condiciones iniciales del Año 10",
      "Entender el papel del Lobby Corporativo"
    ]
  },
  "2-mercado-y-canales": {
    level: "Principiante",
    time: "12 min",
    objectives: [
      "Interpretar tasas de crecimiento por región",
      "Evaluar canales: Internet, Mayorista y Marca Privada",
      "Comprender la matriz de aranceles globales"
    ]
  },
  "3-calidad-y-materiales": {
    level: "Intermedio",
    time: "15 min",
    objectives: [
      "Calcular y optimizar el indicador S/Q Rating",
      "Diferenciar materiales estándar y superiores",
      "Gestionar programas de calidad TQM y Seis Sigma"
    ]
  },
  "4-factores-competitivos": {
    level: "Intermedio",
    time: "15 min",
    objectives: [
      "Identificar los 13 factores competitivos clave",
      "Analizar la elasticidad precio y demanda",
      "Optimizar el Conflicto de Canales (Regla del 40%)"
    ]
  },
  "5-tipo-de-cambio": {
    level: "Avanzado",
    time: "18 min",
    objectives: [
      "Comprender el impacto de las fluctuaciones de divisa",
      "Analizar efectos cambiarios entre plantas y mercados",
      "Mitigar riesgos de tipo de cambio en facturación"
    ]
  },
  "6-toma-de-decisiones-rrhh": {
    level: "Intermedio",
    time: "12 min",
    objectives: [
      "Estructurar incentivos de remuneración laboral",
      "Equilibrar productividad, ausentismo y rotación",
      "Reducir costos de producción mediante capacitación"
    ]
  },
  "7-produccion-mejoras-y-plantas": {
    level: "Avanzado",
    time: "20 min",
    objectives: [
      "Evaluar expansiones de espacio físico de plantas",
      "Decidir entre maquinaria Nueva y Restaurada",
      "Implementar las 4 opciones de mejora tecnológica"
    ]
  },
  "8-operaciones-marca-privada": {
    level: "Intermedio",
    time: "15 min",
    objectives: [
      "Dominar las reglas de licitación en Marca Privada",
      "Calcular costos marginales para ofertas rentables",
      "Aprovechar la capacidad ociosa para diluir fijos"
    ]
  },
  "9-finanzas-y-flujo-de-caja": {
    level: "Avanzado",
    time: "22 min",
    objectives: [
      "Administrar la estructura de capital y deuda",
      "Planificar recompras de acciones y dividendos",
      "Evitar préstamos de emergencia por caja negativa"
    ]
  },
  "10-expectativas-y-calificacion": {
    level: "Avanzado",
    time: "15 min",
    objectives: [
      "Analizar los 5 objetivos de desempeño de la junta",
      "Comprender el cálculo del precio de la acción",
      "Optimizar la puntuación en el Scorecard de BSG"
    ]
  }
};

export default function App() {
  // Navigation State - defaults to "welcome" landing page
  const [activeChapterId, setActiveChapterId] = useState<string>('welcome');
  const activeChapter = CHAPTERS.find(c => c.id === activeChapterId) || CHAPTERS[0];
  
  // Mobile responsiveness sidebar state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Custom modal state for success celebration/feedback instead of window.alert
  const [quizSuccessMessage, setQuizSuccessMessage] = useState<string | null>(null);

  // Reference to focus search box from the Welcome page quick action card
  const globalSearchRef = useRef<HTMLInputElement>(null);
  
  // Progress tracking (stored in localStorage)
  const [completedChapters, setCompletedChapters] = useState<string[]>(() => {
    const saved = localStorage.getItem('bsg_completed_chapters');
    return saved ? JSON.parse(saved) : [];
  });

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState<{
    glossary: GlossaryItem[];
    sections: { chapterId: string; chapterTitle: string; sectionTitle: string; content: string }[];
  }>({ glossary: [], sections: [] });

  // Quiz State (tied to active chapter)
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<number, boolean>>({});
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);

  // Chatbot State with exact greeting requested
  const [chatMessages, setChatMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>(() => {
    return [
      { 
        role: 'assistant', 
        content: '¡Hola! Soy tu Tutor BSG. Puedo ayudarte a comprender cualquier concepto del manual oficial. Responderé únicamente utilizando la información contenida en la guía.' 
      }
    ];
  });
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Glossary Overlay state
  const [selectedGlossaryTerm, setSelectedGlossaryTerm] = useState<GlossaryItem | null>(null);
  const [showAllGlossary, setShowAllGlossary] = useState(false);
  const [glossarySearch, setGlossarySearch] = useState('');

  // Persist completed chapters
  const toggleChapterComplete = (id: string) => {
    setCompletedChapters(prev => {
      const updated = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id];
      localStorage.setItem('bsg_completed_chapters', JSON.stringify(updated));
      return updated;
    });
  };

  // Reset active quiz when chapter changes
  useEffect(() => {
    setCurrentQuizIndex(0);
  }, [activeChapterId]);

  // Handle Search input
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ glossary: [], sections: [] });
      return;
    }

    const query = searchQuery.toLowerCase();
    
    // Filter Glossary
    const filteredGlossary = GLOSSARY.filter(item => 
      item.term.toLowerCase().includes(query) || 
      item.definition.toLowerCase().includes(query)
    );

    // Filter Chapter Sections
    const filteredSections: typeof searchResults.sections = [];
    CHAPTERS.forEach(ch => {
      ch.sections.forEach(sec => {
        if (sec.title.toLowerCase().includes(query) || sec.content.toLowerCase().includes(query)) {
          filteredSections.push({
            chapterId: ch.id,
            chapterTitle: ch.title,
            sectionTitle: sec.title,
            content: sec.content
          });
        }
      });
    });

    setSearchResults({
      glossary: filteredGlossary.slice(0, 5),
      sections: filteredSections.slice(0, 5)
    });
  }, [searchQuery]);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, chatLoading]);

  // Send a message to the chatbot
  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || chatInput;
    if (!messageText.trim()) return;

    if (!textToSend) {
      setChatInput('');
    }

    // Add user message
    const updatedMessages = [...chatMessages, { role: 'user' as const, content: messageText }];
    setChatMessages(updatedMessages);
    setChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages })
      });
      const data = await response.json();
      
      if (data.reply) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
      } else if (data.error) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: `⚠️ **Error del asistente**: ${data.error}` }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', content: 'Lo siento, no pude obtener una respuesta válida del servidor.' }]);
      }
    } catch (error: any) {
      console.error(error);
      setChatMessages(prev => [...prev, { role: 'assistant', content: `❌ **Error de conexión**: No se pudo comunicar con el servidor backend para llamar a Gemini. Detalles: ${error.message}` }]);
    } finally {
      setChatLoading(false);
    }
  };

  // Preset FAQs for instant click
  const PRESET_FAQS = [
    "¿Qué es el EPS?",
    "¿Qué significa el S/Q?",
    "¿Qué es el ROE?",
    "¿Cómo funciona Producción?",
    "¿Cómo interpretar los reportes?"
  ];

  const handleSelectSearchResult = (item: any, type: 'glossary' | 'section') => {
    setSearchQuery('');
    setShowSearchResults(false);
    if (type === 'glossary') {
      setSelectedGlossaryTerm(item);
    } else {
      setActiveChapterId(item.chapterId);
      // Wait for navigation and scroll to content top
      setTimeout(() => {
        document.getElementById('main-article-content')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const currentProgressPercent = Math.round((completedChapters.length / CHAPTERS.length) * 100);

  // Render diagram helper based on type
  const renderDiagram = (type: string, sectionTitle: string) => {
    if (type === 'grid') {
      return (
        <div id={`diagram-${type}`} className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <div className="p-4 bg-azul-noche border border-indigo-custom/30 rounded-xl text-center shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <span className="text-lavanda-custom font-bold text-lg">US$ 442.2M</span>
            <p className="text-slate-300 text-[11px] uppercase tracking-wider mt-1">Ventas Año 10</p>
          </div>
          <div className="p-4 bg-azul-noche border border-indigo-custom/30 rounded-xl text-center shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <span className="text-lavanda-custom font-bold text-lg">US$ 2.00</span>
            <p className="text-slate-300 text-[11px] uppercase tracking-wider mt-1">EPS Inicial</p>
          </div>
          <div className="p-4 bg-azul-noche border border-indigo-custom/30 rounded-xl text-center shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <span className="text-lavanda-custom font-bold text-lg">US$ 30.00</span>
            <p className="text-slate-300 text-[11px] uppercase tracking-wider mt-1">Precio Acción</p>
          </div>
          <div className="p-4 bg-azul-noche border border-indigo-custom/30 rounded-xl text-center shadow-md hover:-translate-y-0.5 transition-all duration-300">
            <span className="text-lavanda-custom font-bold text-lg">70 Puntos</span>
            <p className="text-slate-300 text-[11px] uppercase tracking-wider mt-1">Calif. Imagen</p>
          </div>
        </div>
      );
    }

    if (type === 'comparison') {
      return (
        <div id={`diagram-${type}`} className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
          <div className="p-5 bg-azul-noche border border-indigo-custom/20 rounded-xl hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 bg-indigo-custom rounded text-white text-xs font-bold">N.A.</span>
              <h4 className="font-bold text-white text-sm">Planta Norteamérica</h4>
            </div>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>• Capacidad física: hasta 5,000,000 pares.</li>
              <li>• Maquinaria comprada: 4,000,000 pares.</li>
              <li>• Maquinaria original 100% Nueva en Año 5.</li>
            </ul>
          </div>
          <div className="p-5 bg-azul-noche border border-lavanda-custom/20 rounded-xl hover:-translate-y-0.5 transition-all duration-300">
            <div className="flex items-center gap-2 mb-2">
              <span className="p-1.5 bg-lavanda-custom rounded text-azul-noche text-xs font-bold">A.P.</span>
              <h4 className="font-bold text-white text-sm">Planta Asia-Pacífico</h4>
            </div>
            <ul className="text-xs text-slate-300 space-y-1">
              <li>• Capacidad física: hasta 6,000,000 pares.</li>
              <li>• Maquinaria comprada: 4,000,000 pares.</li>
              <li>• Maquinaria original 100% Restaurada en Año 5.</li>
            </ul>
          </div>
        </div>
      );
    }

    if (type === 'formula') {
      return (
        <div id={`diagram-${type}`} className="bg-azul-noche border border-indigo-custom/30 text-white rounded-xl p-5 my-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 text-indigo-custom/20 font-bold opacity-30 text-6xl select-none font-sans">%</div>
          <h4 className="text-lavanda-custom font-bold text-xs uppercase tracking-wider mb-2">Fórmula de Volatilidad de Precios</h4>
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-azul-profundo rounded border border-indigo-custom/20">
              <span className="text-rosa-custom font-bold">Precio Estándar (+):</span> Sube <span className="font-bold text-white">2%</span> por cada <span className="font-bold text-white">1%</span> de demanda de material superior por encima del <span className="font-bold text-white">60%</span>.
            </div>
            <div className="p-3 bg-azul-profundo rounded border border-indigo-custom/20">
              <span className="text-lavanda-custom font-bold">Precio Superior (-):</span> Baja <span className="font-bold text-white">0.5%</span> por cada <span className="font-bold text-white">1%</span> de demanda inferior al <span className="font-bold text-white">40%</span>.
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div id="geometric-balance-app" className="w-full min-h-screen bg-bg-principal flex overflow-hidden font-sans text-white">
      
      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" 
          onClick={() => setIsMobileSidebarOpen(false)} 
        />
      )}

      {/* Sidebar: Chapter Navigation */}
      <aside 
        id="nav-sidebar" 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-bg-sidebar flex flex-col border-r border-indigo-custom/10 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } flex-shrink-0 text-white`}
      >
        {/* Sidebar Header / Welcome Widget */}
        <div className="p-5 border-b border-indigo-custom/10 bg-black/10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-btn-principal rounded-xl flex items-center justify-center font-bold text-white text-lg tracking-wider shadow-lg shadow-black/30 border border-lavanda-custom/20">
                BSG
              </div>
              <div>
                <h1 className="text-white font-bold text-sm leading-tight">Master Class</h1>
                <p className="text-lavanda-custom text-[9px] uppercase tracking-widest font-semibold mt-0.5">Civil Industrial</p>
              </div>
            </div>
            {/* Close Mobile Sidebar button */}
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="bg-slate-800/60 p-3 rounded-xl border border-blue-400/15 mt-4">
            <div className="flex items-center gap-2 text-blue-400 mb-1">
              <GraduationCap className="w-4 h-4" />
              <span className="text-white text-[11px] font-bold uppercase tracking-wider">Guía del Gerente</span>
            </div>
            <p className="text-[10px] text-slate-300 leading-normal">
              Domina el simulador con explicaciones claras, estrategias y tutor inteligente.
            </p>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-bg-tarjeta">
          
          {/* General Section */}
          <div className="space-y-1">
            <p className="text-[9px] text-slate-400 uppercase tracking-widest font-bold px-3 mb-1">General</p>
            <button
              onClick={() => {
                setActiveChapterId('welcome');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center gap-2.5 transition-all duration-200 cursor-pointer ${
                activeChapterId === 'welcome'
                  ? 'bg-[#2563EB] text-white font-bold shadow-lg shadow-blue-600/15 border border-blue-400/20'
                  : 'text-slate-300 hover:text-white hover:bg-[#3B82F6]/35'
              }`}
            >
              <Home className={`w-4 h-4 ${activeChapterId === 'welcome' ? 'text-white' : 'text-blue-400'}`} />
              <span className="font-medium">Página principal</span>
            </button>

            <button
              onClick={() => {
                setActiveChapterId('tutor');
                setIsMobileSidebarOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center gap-2.5 transition-all duration-200 cursor-pointer mt-1 ${
                activeChapterId === 'tutor'
                  ? 'bg-[#2563EB] text-white font-bold shadow-lg shadow-blue-600/15 border border-blue-400/20'
                  : 'text-slate-300 hover:text-white hover:bg-[#3B82F6]/35'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${activeChapterId === 'tutor' ? 'text-white' : 'text-blue-400'}`} />
              <span className="font-medium">Tutor Inteligente (Chat)</span>
            </button>
          </div>

          {/* Chapters Section */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center px-3 mb-1">
              <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">Capítulos</span>
              <span className="text-[9px] text-lavanda-custom font-semibold">10 Temas</span>
            </div>
            <ul className="space-y-1">
              {CHAPTERS.map((ch, idx) => {
                const isActive = ch.id === activeChapterId;
                const isDone = completedChapters.includes(ch.id);
                
                // Set the status text & color mapping requested
                let statusLabel = "";
                let statusBadgeColor = "";
                if (isDone) {
                  statusLabel = "✅ Capítulo completado";
                  statusBadgeColor = "text-confirmacion bg-confirmacion/10";
                } else if (isActive) {
                  statusLabel = "📖 En estudio";
                  statusBadgeColor = "text-lavanda-custom bg-lavanda-custom/10 border border-lavanda-custom/20";
                } else {
                  statusLabel = "🔒 Pendiente";
                  statusBadgeColor = "text-slate-400 bg-slate-400/5";
                }

                return (
                  <li key={ch.id}>
                    <button 
                      onClick={() => {
                        setActiveChapterId(ch.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex flex-col gap-1 transition-all duration-200 group ${
                        isActive 
                          ? 'bg-[#2563EB] text-white font-bold shadow-lg shadow-blue-600/15 border border-blue-400/25' 
                          : 'text-slate-300 hover:text-white hover:bg-[#3B82F6]/35'
                      }`}
                      title={statusLabel}
                    >
                      <div className="w-full flex items-center justify-between gap-1">
                        <div className="flex items-center gap-2 truncate">
                          <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-extrabold transition-all ${
                            isActive 
                              ? 'bg-white text-[#2563EB]' 
                              : 'bg-slate-700 text-slate-300 group-hover:text-white group-hover:bg-[#2563EB]'
                          }`}>
                            {idx + 1}
                          </span>
                          <span className="truncate font-medium">{ch.title.split('. ')[1]}</span>
                        </div>
                        {isDone && (
                          <span className="flex-shrink-0">
                            <CheckCircle className="w-3.5 h-3.5 text-confirmacion" />
                          </span>
                        )}
                      </div>
                      
                      {/* Sub-label reflecting exact dynamic study status */}
                      <div className="flex items-center justify-between mt-0.5 pl-7">
                        <span className={`text-[8px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider ${statusBadgeColor}`}>
                          {isDone ? "Listo" : isActive ? "En estudio" : "Pendiente"}
                        </span>
                        <span className="text-[9px] text-slate-400 group-hover:text-slate-300 transition-colors">
                          {CHAPTER_METADATA[ch.id]?.time || "15 min"}
                        </span>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="pt-2">
            <button 
              onClick={() => {
                setGlossarySearch('');
                setShowAllGlossary(true);
                setIsMobileSidebarOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-[#3B82F6]/35 flex items-center gap-2 transition-all duration-200 border border-blue-400/10 bg-slate-800/40"
            >
              <BookText className="w-4 h-4 text-amber-500" />
              <span className="font-medium">Glosario Técnico Completo</span>
            </button>
          </div>
        </nav>

        {/* Persistent Progress Footer */}
        <div className="p-4 bg-black/20 border-t border-slate-700/50 mt-auto">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-blue-400 font-extrabold shadow-sm">
              %
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center text-[10px] text-slate-300 uppercase tracking-wider font-bold">
                <span>Tu Progreso</span>
                <span className="text-confirmacion font-extrabold">{currentProgressPercent}%</span>
              </div>
              <div className="w-full h-2 bg-black/30 rounded-full mt-1.5 overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-confirmacion rounded-full transition-all duration-500" 
                  style={{ width: `${currentProgressPercent}%` }}
                ></div>
              </div>
              <p className="text-[9px] text-slate-400 mt-1 truncate">
                {completedChapters.length} de {CHAPTERS.length} capítulos listos
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-[#F8FAFC]">
        
        
        {/* Top Header / Global Search */}
        <header className="h-16 bg-white border-b border-[#E5E7EB] px-4 md:px-8 flex items-center justify-between flex-shrink-0 gap-4 shadow-sm z-10">
          
          {/* Mobile Sidebar Toggle Hamburger */}
          <button 
            onClick={() => setIsMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 transition-all flex items-center justify-center flex-shrink-0 cursor-pointer"
            title="Abrir menú"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Global Search */}
          <div className="flex-1 max-w-md relative">
            <div className="relative">
              <span className="absolute inset-y-0 left-3.5 flex items-center text-blue-600 pointer-events-none">
                <Search className="w-4 h-4" />
              </span>
              <input 
                ref={globalSearchRef}
                type="text" 
                placeholder="Buscar en el manual (ROE, S/Q, EPS, Canales...)" 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-[#E5E7EB] rounded-xl text-xs md:text-sm text-[#111827] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all placeholder-slate-400"
              />
            </div>

            {/* Search Results Dropdown Popover */}
            {showSearchResults && searchQuery.trim() && (
              <div id="search-popover" className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-[#E5E7EB] z-50 max-h-96 overflow-y-auto p-2">
                <div className="p-2 border-b border-slate-100 flex justify-between items-center text-xs text-blue-600 font-bold">
                  <span>Resultados de Búsqueda</span>
                  <button onClick={() => setShowSearchResults(false)} className="text-slate-500 hover:text-slate-800 transition-colors cursor-pointer">Cerrar</button>
                </div>
                
                {searchResults.glossary.length === 0 && searchResults.sections.length === 0 ? (
                  <div className="p-4 text-center text-slate-500 text-xs flex flex-col items-center gap-1">
                    <AlertCircle className="w-5 h-5 text-blue-500" />
                    No se encontraron coincidencias exactas para "{searchQuery}".
                  </div>
                ) : (
                  <div className="p-1 space-y-3">
                    {/* Glossary Items Matches */}
                    {searchResults.glossary.length > 0 && (
                      <div>
                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider px-2 py-1">Conceptos en Glosario</p>
                        <ul className="space-y-0.5">
                          {searchResults.glossary.map((item, idx) => (
                            <li key={`s-g-${idx}`}>
                              <button 
                                onClick={() => handleSelectSearchResult(item, 'glossary')}
                                className="w-full text-left p-2 hover:bg-slate-50 rounded-lg transition-colors flex items-start gap-2.5 cursor-pointer"
                              >
                                <Info className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs font-bold text-slate-900">{item.term}</p>
                                  <p className="text-[11px] text-slate-500 line-clamp-1">{item.definition}</p>
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
 
                    {/* Section Matches */}
                    {searchResults.sections.length > 0 && (
                      <div>
                        <p className="text-[10px] text-amber-600 font-bold uppercase tracking-wider px-2 py-1">Contenido en Capítulos</p>
                        <ul className="space-y-0.5">
                          {searchResults.sections.map((item, idx) => (
                            <li key={`s-s-${idx}`}>
                              <button 
                                onClick={() => handleSelectSearchResult(item, 'section')}
                                className="w-full text-left p-2 hover:bg-slate-50 rounded-lg transition-colors flex items-start gap-2.5 cursor-pointer"
                              >
                                <BookOpen className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-900">{item.sectionTitle}</p>
                                  <p className="text-[10px] text-slate-400 truncate">{item.chapterTitle}</p>
                                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.content}</p>
                                </div>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Top Course Progress Bar Widget */}
          <div className="hidden xl:flex items-center gap-3.5 px-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-[11px] flex-shrink-0 shadow-inner">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Compass className="w-4 h-4 text-emerald-500 animate-spin-slow" />
              <span className="font-bold">Progreso del curso:</span>
            </div>
            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden border border-slate-300/40 relative">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${currentProgressPercent}%` }}
              ></div>
            </div>
            <span className="text-emerald-600 font-extrabold">{currentProgressPercent}%</span>
            <span className="text-slate-300 font-bold">|</span>
            <span className="text-slate-600 font-medium">{completedChapters.length} de {CHAPTERS.length} capítulos</span>
          </div>

          {/* Right Header Navigation Actions */}
          <div className="flex gap-2 md:gap-3 items-center flex-shrink-0">
            <button 
              onClick={() => {
                setGlossarySearch('');
                setShowAllGlossary(true);
              }}
              className="px-3.5 py-2 text-xs font-bold text-[#2563EB] bg-white border border-[#2563EB] hover:bg-[#2563EB]/5 rounded-full transition-all duration-200 active:scale-95 flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#2563EB]" />
              <span className="hidden sm:inline">Glosario ({GLOSSARY.length})</span>
              <span className="sm:hidden">Glosario</span>
            </button>

            {activeChapterId !== 'welcome' && (
              <button 
                onClick={() => toggleChapterComplete(activeChapter.id)}
                className={`px-3.5 py-2 text-xs font-bold rounded-full transition-all duration-200 active:scale-95 flex items-center gap-1.5 shadow-sm cursor-pointer ${
                  completedChapters.includes(activeChapter.id)
                    ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100/80 border border-emerald-300 font-extrabold'
                    : 'bg-[#2563EB] hover:bg-[#3B82F6] text-white font-bold'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>{completedChapters.includes(activeChapter.id) ? 'Capítulo Terminado' : 'Marcar Completado'}</span>
              </button>
            )}
          </div>
        </header>

        {/* Content Section Area Container */}
        <div id="main-grid-container" className="flex-1 overflow-hidden bg-[#F8FAFC] flex flex-col h-full">
          {activeChapterId === 'tutor' ? (
            /* Full-page Chat View (ChatGPT/Claude experience) */
            <div className="flex-1 flex flex-col h-full min-h-0 p-4 md:p-6 lg:p-8">
              <div className="flex-1 flex flex-col h-full bg-white border border-[#E5E7EB] rounded-2xl shadow-md overflow-hidden relative">
                {/* Chat Header */}
                <div className="p-5 border-b border-[#E5E7EB] bg-slate-50/80 flex items-center justify-between flex-shrink-0 flex-wrap gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100 text-[#2563EB]">
                      <Sparkles className="w-5 h-5 text-[#2563EB] animate-pulse" />
                    </div>
                    <div>
                      <h2 className="text-slate-900 font-sans font-extrabold text-sm md:text-base flex items-center gap-2">
                        Tutor Inteligente Guía BSG
                        <span className="hidden sm:inline text-[9px] bg-blue-100 text-[#2563EB] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border border-blue-200">MODO CHAT-FULL</span>
                      </h2>
                      <p className="text-[10px] md:text-xs text-slate-500 leading-normal flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-ping"></span>
                        Basado exclusivamente en la Guía del Gerente oficial • Respuestas claras y estructuradas
                      </p>
                    </div>
                  </div>
                  
                  {/* Navigation & Control Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        const container = document.getElementById('chat-messages-scroll-area');
                        container?.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl transition-all text-xs flex items-center gap-1.5 cursor-pointer font-medium"
                      title="Volver al inicio de la conversación"
                    >
                      <ArrowUp className="w-3.5 h-3.5 text-blue-500" />
                      <span className="hidden md:inline">Volver al inicio</span>
                    </button>
 
                    <button 
                      onClick={() => {
                        setChatMessages([
                          { 
                            role: 'assistant', 
                            content: 'Conversación reiniciada. ¿En qué regla o fórmula de la Guía del Gerente te puedo asistir ahora?' 
                          }
                        ]);
                      }}
                      className="px-3 py-2 bg-white hover:bg-red-50 text-slate-700 hover:text-red-600 border border-slate-200 hover:border-red-100 rounded-xl transition-all text-xs flex items-center gap-1.5 cursor-pointer font-medium"
                      title="Reiniciar chat"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-red-500" />
                      <span className="hidden md:inline">Reiniciar chat</span>
                    </button>
                  </div>
                </div>
 
                {/* Conversation Viewport (practically full height) */}
                <div 
                  id="chat-messages-scroll-area" 
                  className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 bg-slate-50/50 scrollbar-thin"
                >
                  <div className="max-w-[950px] mx-auto w-full space-y-6">
                    {chatMessages.map((msg, idx) => {
                      const isAssistant = msg.role === 'assistant';
                      return (
                        <div 
                          key={`chat-msg-${idx}`}
                          className={`flex ${isAssistant ? 'justify-start' : 'justify-end'} animate-fade-in`}
                        >
                          <div className={`w-full max-w-4xl rounded-2xl p-5 md:p-6 shadow-sm border leading-relaxed relative ${
                            isAssistant 
                              ? 'bg-white text-slate-800 border-[#E5E7EB] rounded-tl-none' 
                              : 'bg-[#EFF6FF] text-[#1E40AF] rounded-tr-none border border-[#BFDBFE] max-w-2xl ml-auto'
                          }`}>
                            {/* Message Identity Badge */}
                            <div className={`flex items-center justify-between border-b pb-3 mb-4 ${
                              isAssistant ? 'border-slate-100' : 'border-blue-200/50'
                            }`}>
                              <div className="flex items-center gap-2">
                                {isAssistant ? (
                                  <>
                                    <div className="w-6 h-6 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-[#2563EB]">
                                      <Sparkles className="w-3.5 h-3.5" />
                                    </div>
                                    <span className="text-xs font-bold text-slate-900 tracking-wide uppercase">Tutor BSG</span>
                                  </>
                                ) : (
                                  <>
                                    <span className="text-xs font-bold text-[#1E40AF] tracking-wide uppercase">Tú (Gerente)</span>
                                  </>
                                )}
                              </div>
                              
                              {/* Action Buttons for Assistant Message */}
                              {isAssistant && (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(msg.content);
                                      setCopiedIndex(idx);
                                      setTimeout(() => setCopiedIndex(null), 2000);
                                    }}
                                    className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition-all text-[10px] flex items-center gap-1 cursor-pointer font-medium"
                                    title="Copiar respuesta"
                                  >
                                    <Copy className="w-3 h-3 text-blue-500" />
                                    <span>{copiedIndex === idx ? '¡Copiado!' : 'Copiar'}</span>
                                  </button>
 
                                  <button
                                    onClick={() => {
                                      const element = document.createElement("a");
                                      const file = new Blob([msg.content], { type: 'text/markdown;charset=utf-8' });
                                      element.href = URL.createObjectURL(file);
                                      element.download = `respuesta-tutor-bsg-${idx + 1}.md`;
                                      document.body.appendChild(element);
                                      element.click();
                                      document.body.removeChild(element);
                                    }}
                                    className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg transition-all text-[10px] flex items-center gap-1 cursor-pointer font-medium"
                                    title="Exportar como Markdown"
                                  >
                                    <FileText className="w-3 h-3 text-amber-500" />
                                    <span>Exportar</span>
                                  </button>
                                </div>
                              )}
                            </div>
 
                            {/* Body Content */}
                            {isAssistant ? (
                              <div className="markdown-body prose max-w-none text-xs md:text-sm leading-relaxed space-y-4">
                                <Markdown
                                  components={{
                                    h1: ({ children }) => <h1 className="text-sm md:text-base font-extrabold text-slate-900 mt-4 mb-2 tracking-tight flex items-center gap-2 border-b border-slate-100 pb-1">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-xs md:text-sm font-bold text-blue-600 mt-3 mb-1.5 tracking-tight">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-xs font-bold text-slate-800 mt-2.5 mb-1">{children}</h3>,
                                    p: ({ children }) => <p className="text-slate-700 leading-relaxed mb-3 text-xs md:text-sm">{children}</p>,
                                    ul: ({ children }) => <ul className="list-disc pl-5 space-y-1.5 mb-4 text-xs md:text-sm text-slate-700">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal pl-5 space-y-1.5 mb-4 text-xs md:text-sm text-slate-700">{children}</ol>,
                                    li: ({ children }) => <li className="marker:text-blue-500 leading-relaxed">{children}</li>,
                                    blockquote: ({ children }) => <blockquote className="border-l-4 border-amber-500 bg-amber-50/50 p-3.5 my-4 rounded-r-xl italic text-slate-700 text-xs md:text-sm">{children}</blockquote>,
                                    hr: () => <hr className="border-t border-slate-200 my-5" />,
                                    table: ({ children }) => (
                                      <div className="overflow-x-auto my-5 rounded-xl border border-slate-200 bg-white shadow-inner">
                                        <table className="min-w-full divide-y divide-slate-200 text-xs md:text-sm">{children}</table>
                                      </div>
                                    ),
                                    thead: ({ children }) => <thead className="bg-slate-50 text-blue-600 font-bold">{children}</thead>,
                                    tbody: ({ children }) => <tbody className="divide-y divide-slate-100 bg-white">{children}</tbody>,
                                    tr: ({ children }) => <tr className="hover:bg-slate-50 transition-colors">{children}</tr>,
                                    th: ({ children }) => <th className="px-4 py-2.5 text-left text-xs uppercase tracking-wider font-extrabold border-b border-slate-200">{children}</th>,
                                    td: ({ children }) => <td className="px-4 py-2.5 text-slate-700 leading-normal border-b border-slate-100">{children}</td>,
                                    code: ({ children }) => <code className="bg-slate-100 px-1.5 py-0.5 rounded text-red-600 font-mono text-xs border border-slate-200">{children}</code>
                                  }}
                                >
                                  {msg.content}
                                </Markdown>
                              </div>
                            ) : (
                              <p className="text-xs md:text-sm leading-relaxed text-[#1E3A8A] whitespace-pre-line font-medium">{msg.content}</p>
                            )}
                          </div>
                        </div>
                      );
                    })}
 
                    {/* Loading Indicator */}
                    {chatLoading && (
                      <div className="flex justify-start animate-pulse">
                        <div className="bg-white border border-[#E5E7EB] rounded-2xl rounded-tl-none p-5 max-w-xl w-full flex flex-col gap-3 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500"></span>
                            </div>
                            <span className="text-xs font-bold text-slate-950 tracking-wide uppercase">Tutor Inteligente BSG</span>
                          </div>
                          <div className="flex items-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-200">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                            <span className="text-xs text-slate-600 font-semibold">El Tutor BSG está analizando la Guía del Gerente...</span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={chatEndRef} />
                  </div>
                </div>
 
                {/* Preset Suggestion FAQs on top of text box */}
                <div className="px-4 md:px-8 py-2.5 border-t border-slate-200 bg-slate-50/80 flex-shrink-0">
                  <div className="max-w-[950px] mx-auto w-full">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">Consultas instantáneas de ejemplo:</p>
                    <div className="flex gap-2 overflow-x-auto pb-1.5 no-scrollbar scrollbar-none">
                      {PRESET_FAQS.map((faq, idx) => (
                        <button
                          key={`preset-faq-${idx}`}
                          onClick={() => handleSendMessage(faq)}
                          className="whitespace-nowrap px-3.5 py-1.5 bg-white hover:bg-[#2563EB]/5 text-slate-700 hover:text-[#2563EB] border border-slate-200 hover:border-[#2563EB]/40 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95 animate-fade-in shadow-sm"
                        >
                          🔍 {faq}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
 
                {/* Sticky / Fixed Bottom Text Input Area */}
                <div className="p-4 md:p-6 border-t border-slate-200 bg-white/95 backdrop-blur-md flex-shrink-0">
                  <div className="max-w-[950px] mx-auto w-full relative">
                    <div className="flex gap-3 items-end bg-slate-50 border border-slate-200 focus-within:border-[#2563EB] focus-within:bg-white rounded-2xl p-2.5 transition-all focus-within:ring-2 focus-within:ring-[#2563EB]/10 shadow-inner">
                      <textarea
                        id="chat-input-field"
                        placeholder="Haz una pregunta detallada sobre fórmulas, reglas, aranceles, compensaciones o estrategias del manual..."
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                          }
                        }}
                        rows={2}
                        className="flex-1 bg-transparent text-[#111827] placeholder-slate-400 text-xs md:text-sm focus:outline-none resize-none px-2 py-1 leading-relaxed"
                      />
                      <button 
                        onClick={() => handleSendMessage()}
                        className="px-4 py-2.5 bg-[#2563EB] hover:bg-[#3B82F6] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                        title="Enviar consulta"
                      >
                        <Send className="w-3.5 h-3.5 text-white" />
                        <span className="hidden sm:inline">Enviar</span>
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 mt-1.5 pl-2 font-medium">
                      Presiona <kbd className="bg-slate-100 px-1 py-0.5 rounded border border-slate-200 text-slate-600 font-mono">Enter</kbd> para enviar • <kbd className="bg-slate-100 px-1 py-0.5 rounded border border-slate-200 text-slate-600 font-mono">Shift + Enter</kbd> para salto de línea
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full p-6 md:p-8 grid grid-cols-12 gap-6 md:gap-8 overflow-hidden">
              {/* Left Column: Interactive Study Reader (now takes full 12 columns for comfortable wide reading!) */}
              <div className="col-span-12 flex flex-col h-full overflow-hidden">
            
            {/* Breadcrumb Info */}
            <nav id="breadcrumbs" className="flex items-center text-[10px] text-slate-400 uppercase tracking-widest font-bold mb-3 flex-shrink-0">
              <span>GUÍA BSG</span>
              <span className="mx-2 text-indigo-custom">/</span>
              {activeChapterId === 'welcome' ? (
                <span className="text-lavanda-custom">BIENVENIDA E INICIO</span>
              ) : (
                <>
                  <span>CAPÍTULO {activeChapter.title.split('. ')[0]}</span>
                  <span className="mx-2 text-indigo-custom">/</span>
                  <span className="text-lavanda-custom">{activeChapter.subtitle}</span>
                </>
              )}
            </nav>

            {/* Core Article Reader Card */}
            <article 
              id="main-article-content" 
              className="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm overflow-y-auto p-6 md:p-10 flex-1 flex flex-col min-h-0"
            >
              
              {activeChapterId === 'welcome' ? (
                <div className="space-y-6 flex-1 flex flex-col justify-between">
                  <div className="space-y-6">
                    {/* Welcome Card */}
                    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/40 rounded-2xl p-6 md:p-8 border border-slate-200 shadow-sm relative overflow-hidden">
                      {/* Decorative elements */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                      <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl -ml-20 -mb-20 pointer-events-none"></div>
                      
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#2563EB] text-[10px] uppercase tracking-widest font-bold w-fit mb-4">
                        <Sparkles className="w-3.5 h-3.5" />
                        Herramienta Interactiva de Aprendizaje
                      </div>
                      
                      <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-slate-900 leading-tight tracking-tight mb-3">
                        Guía de Aprendizaje BSG
                      </h2>
                      
                      <p className="text-slate-600 text-sm md:text-base leading-relaxed max-w-3xl">
                        Aprende a comprender el funcionamiento de <strong className="text-slate-900 font-bold">The Business Strategy Game</strong> mediante explicaciones claras, ejemplos y un tutor inteligente basado en la Guía Oficial del Gerente.
                      </p>
                    </div>

                    {/* Popular Concepts Bar */}
                    <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-200/60 shadow-inner">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                        <Search className="w-3.5 h-3.5 text-blue-500" />
                        Conceptos Populares (Haz clic para buscar al instante):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { text: "⭐ S/Q Rating", query: "S/Q" },
                          { text: "💰 EPS", query: "EPS" },
                          { text: "📈 ROE", query: "ROE" },
                          { text: "🏭 Producción", query: "Producción" },
                          { text: "🌍 Mercado Mundial", query: "Mercado Mundial" },
                          { text: "📦 Inventario", query: "Inventario" }
                        ].map((tag) => (
                          <button
                            key={tag.query}
                            onClick={() => {
                              setSearchQuery(tag.query);
                              setShowSearchResults(true);
                              globalSearchRef.current?.focus();
                            }}
                            className="px-3 py-1.5 rounded-lg bg-white text-xs text-slate-700 hover:text-[#2563EB] hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all shadow-sm active:scale-95 flex items-center gap-1 cursor-pointer font-medium"
                          >
                            {tag.text}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Grid of 4 Quick Access Buttons styled as elegant cards */}
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-4">Secciones de la Plataforma</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        <button 
                          onClick={() => {
                            setActiveChapterId(CHAPTERS[0].id);
                            setCurrentQuizIndex(0);
                          }}
                          className="text-left bg-white hover:bg-slate-50 p-5 rounded-2xl border border-slate-200 transition-all hover:border-blue-300 group hover:-translate-y-1 hover:shadow-md shadow-sm flex items-start gap-4 cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 font-bold flex-shrink-0 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-[#2563EB] transition-colors flex items-center gap-1">
                              Explorar Manual
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </h3>
                            <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                              Navega por los 10 capítulos del manual explicados de forma interactiva con diagramas y tablas técnicas.
                            </p>
                          </div>
                        </button>

                        <button 
                          onClick={() => {
                            setActiveChapterId('tutor');
                          }}
                          className="text-left bg-white hover:bg-slate-50 p-5 rounded-2xl border border-slate-200 transition-all hover:border-amber-300 group hover:-translate-y-1 hover:shadow-md shadow-sm flex items-start gap-4 cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 font-bold flex-shrink-0 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                            <Sparkles className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-amber-600 transition-colors flex items-center gap-1">
                              Tutor BSG
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </h3>
                            <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                              Asistente de IA dedicado a responder dudas técnicas basándose exclusivamente en el manual del simulador.
                            </p>
                          </div>
                        </button>

                        <button 
                          onClick={() => {
                            globalSearchRef.current?.focus();
                          }}
                          className="text-left bg-white hover:bg-slate-50 p-5 rounded-2xl border border-slate-200 transition-all hover:border-rose-300 group hover:-translate-y-1 hover:shadow-md shadow-sm flex items-start gap-4 cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 font-bold flex-shrink-0 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                            <Search className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-rose-600 transition-colors flex items-center gap-1">
                              Buscar Conceptos
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </h3>
                            <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                              Utiliza el buscador predictivo para localizar cualquier término del manual y sus fundamentos de inmediato.
                            </p>
                          </div>
                        </button>

                        <button 
                          onClick={() => {
                            setActiveChapterId(CHAPTERS[0].id);
                            setCurrentQuizIndex(0);
                            setTimeout(() => {
                              document.getElementById('quiz-block')?.scrollIntoView({ behavior: 'smooth' });
                            }, 300);
                          }}
                          className="text-left bg-white hover:bg-slate-50 p-5 rounded-2xl border border-slate-200 transition-all hover:border-emerald-300 group hover:-translate-y-1 hover:shadow-md shadow-sm flex items-start gap-4 cursor-pointer"
                        >
                          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 font-bold flex-shrink-0 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                            <Award className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-extrabold text-slate-900 text-sm group-hover:text-emerald-600 transition-colors flex items-center gap-1">
                              Evaluar Conocimientos
                              <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                            </h3>
                            <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                              Resuelve los test oficiales de cada capítulo y mide tu nivel de preparación estratégica para el juego de simulación.
                            </p>
                          </div>
                        </button>

                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-blue-50/40 border border-blue-100/50 rounded-xl text-center text-xs text-slate-500 mt-6 font-medium">
                    🎓 Desarrollado especialmente para Estudiantes de <strong className="text-slate-800">Ingeniería Civil Industrial</strong> para acelerar el aprendizaje estratégico en BSG.
                  </div>
                </div>
              ) : (
                <>
                  {/* Header Title Section */}
                  <div className="border-b border-slate-200 pb-5 mb-6 flex-shrink-0">
                    <h2 className="text-2xl md:text-3xl font-sans font-extrabold text-slate-900 leading-tight tracking-tight">
                      {activeChapter.title}
                    </h2>
                    <p className="text-slate-600 text-sm mt-1.5 font-medium">
                      {activeChapter.subtitle}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3.5">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200">
                        <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                        Estudio Dirigido
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200">
                        <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                        Exclusivo Manual Oficial
                      </span>
                      {completedChapters.includes(activeChapter.id) && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          Completado
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Chapter introduction Technical Card (Level, Time, Objectives) */}
                  {(() => {
                    const meta = CHAPTER_METADATA[activeChapter.id];
                    if (!meta) return null;
                    return (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-inner">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                            <Award className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Nivel del Capítulo</p>
                            <span className={`text-xs font-bold ${
                              meta.level === 'Avanzado' ? 'text-rose-600' : meta.level === 'Intermedio' ? 'text-blue-600' : 'text-emerald-600'
                            }`}>
                              {meta.level}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                            <Compass className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Tiempo Estimado</p>
                            <span className="text-xs text-slate-700 font-bold">
                              {meta.time} de lectura
                            </span>
                          </div>
                        </div>

                        <div className="md:border-l md:border-slate-200 md:pl-4">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-1 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-blue-500" />
                            Objetivos de Aprendizaje
                          </p>
                          <ul className="text-[10px] text-slate-600 space-y-1 font-medium">
                            {meta.objectives.map((obj, oIdx) => (
                              <li key={oIdx} className="flex items-start gap-1 leading-normal">
                                <span className="text-emerald-600">✓</span>
                                <span>{obj}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Core Text Prose */}
                  <div className="space-y-6 text-sm text-slate-700 leading-relaxed flex-1">
                    
                    {/* Executive Summary */}
                    <div id="executive-summary" className="bg-slate-50 border-l-4 border-blue-500 p-4 rounded-r-lg font-medium italic text-slate-700 mb-4 shadow-inner">
                      "{activeChapter.summary}"
                    </div>

                    {/* Iterate sections */}
                    {activeChapter.sections.map((sec, sIdx) => (
                      <section key={`sec-${sIdx}`} className="space-y-3.5 pt-6 border-t border-slate-200 first:border-0 first:pt-0">
                    <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                      <span className="w-1 h-4 bg-blue-600 rounded"></span>
                      {sec.title}
                    </h3>
                    
                    <p className="text-slate-600 leading-relaxed text-xs md:text-sm">
                      {sec.content}
                    </p>

                    {/* Bullet list if any */}
                    {sec.bullets && sec.bullets.length > 0 && (
                      <ul className="space-y-1.5 pl-5 list-disc text-xs md:text-sm text-slate-600">
                        {sec.bullets.map((b, bIdx) => (
                          <li key={`bullet-${bIdx}`}>{b}</li>
                        ))}
                      </ul>
                    )}

                    {/* Table renderer if any */}
                    {sec.table && (
                      <div className="overflow-x-auto my-4 border border-slate-200 rounded-xl shadow-md">
                        <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
                          <thead className="bg-slate-50 text-blue-600 uppercase font-bold">
                            <tr>
                              {sec.table.headers.map((h, hIdx) => (
                                <th key={`th-${hIdx}`} className="px-4 py-2.5 font-extrabold">{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 bg-white text-slate-700">
                            {sec.table.rows.map((row, rIdx) => (
                              <tr key={`tr-${rIdx}`} className="hover:bg-slate-50/50 transition-colors">
                                {row.map((cell, cellIdx) => (
                                  <td key={`cell-${cellIdx}`} className="px-4 py-2.5 font-semibold">{cell}</td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                        {sec.table.caption && (
                          <div className="p-2 bg-slate-50 border-t border-slate-200/60 text-[10px] text-slate-500 text-center italic font-medium">
                            {sec.table.caption}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Optional diagram rendered in bsg style */}
                    {sec.diagramType && renderDiagram(sec.diagramType, sec.title)}

                    {/* Advice tips if any */}
                    {sec.tips && sec.tips.length > 0 && sec.tips.map((tipText, tIdx) => {
                      const lower = tipText.toLowerCase();
                      let cardTitle = "Consejo Técnico";
                      let borderStyle = "border-blue-500";
                      let textAccentColor = "text-blue-600";
                      let bgStyle = "bg-blue-50/50";
                      let cardIcon = <AlertCircle className="w-5 h-5 text-blue-500" />;

                      if (lower.includes("cuidado") || lower.includes("atención") || lower.includes("evita") || lower.includes("error") || lower.includes("riesgo") || lower.includes("atencion")) {
                        cardTitle = "Error Frecuente";
                        borderStyle = "border-red-500";
                        textAccentColor = "text-red-600";
                        bgStyle = "bg-red-50";
                        cardIcon = <AlertCircle className="w-5 h-5 text-red-500" />;
                      } else if (lower.includes("clave") || lower.includes("importante") || lower.includes("esencial") || lower.includes("fundamental") || lower.includes("es vital")) {
                        cardTitle = "Concepto Importante";
                        borderStyle = "border-amber-500";
                        textAccentColor = "text-amber-600";
                        bgStyle = "bg-amber-50";
                        cardIcon = <Award className="w-5 h-5 text-amber-500" />;
                      } else if (lower.includes("ejemplo") || lower.includes("definición") || lower.includes("significa") || lower.includes("consiste") || lower.includes("fórmula")) {
                        cardTitle = "Definición / Ejemplo";
                        borderStyle = "border-blue-500";
                        textAccentColor = "text-blue-600";
                        bgStyle = "bg-blue-50/50";
                        cardIcon = <BookOpen className="w-5 h-5 text-blue-500" />;
                      }

                      return (
                        <div key={`tip-${tIdx}`} className={`p-4 ${bgStyle} rounded-xl border-l-4 ${borderStyle} flex gap-3.5 my-4 shadow-sm`}>
                          <div className="flex-shrink-0 mt-0.5">
                            {cardIcon}
                          </div>
                          <div>
                            <h4 className={`${textAccentColor} font-extrabold text-xs uppercase tracking-wider mb-1`}>
                              {cardTitle}
                            </h4>
                            <p className="text-slate-700 text-xs leading-relaxed font-medium">
                              {tipText}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </section>
                ))}

                {/* Chapter Quiz Card block */}
                {activeChapter.quiz && activeChapter.quiz.length > 0 && (
                  <div id="quiz-block" className="mt-8 pt-8 border-t border-slate-200">
                    <div className="p-5 md:p-6 bg-slate-50/50 rounded-2xl border border-slate-200 shadow-inner">
                      
                      <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3.5 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Award className="w-5 h-5 text-blue-600" />
                          <h4 className="font-extrabold text-slate-900 text-sm uppercase tracking-wider">Cuestionario del Capítulo</h4>
                        </div>
                        <span className="text-xs text-[#2563EB] font-extrabold">
                          Pregunta {currentQuizIndex + 1} de {activeChapter.quiz.length}
                        </span>
                      </div>

                      {/* Quiz Multi-step content */}
                      {(() => {
                        const questionObj = activeChapter.quiz[currentQuizIndex];
                        const chosenAnswer = quizAnswers[questionObj.id];
                        const isSubmitted = quizSubmitted[questionObj.id];

                        return (
                          <div className="space-y-4">
                            <p className="text-slate-900 font-extrabold text-xs md:text-sm leading-relaxed">
                              {questionObj.question}
                            </p>

                            <div className="space-y-2">
                              {questionObj.options.map((option, oIdx) => {
                                const isSelected = chosenAnswer === oIdx;
                                const isCorrect = oIdx === questionObj.correctAnswerIndex;
                                
                                let optionStyle = 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700';
                                if (isSubmitted) {
                                  if (isCorrect) {
                                    optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-semibold shadow-sm shadow-emerald-50';
                                  } else if (isSelected) {
                                    optionStyle = 'bg-rose-50 border-rose-400 text-rose-900 font-medium';
                                  } else {
                                    optionStyle = 'opacity-65 bg-slate-100 border-slate-200 text-slate-500';
                                  }
                                } else if (isSelected) {
                                  optionStyle = 'border-blue-500 bg-blue-50/50 text-blue-900 font-bold';
                                }

                                return (
                                  <button
                                    key={`opt-${oIdx}`}
                                    disabled={isSubmitted}
                                    onClick={() => setQuizAnswers(prev => ({ ...prev, [questionObj.id]: oIdx }))}
                                    className={`w-full text-left px-4 py-3 rounded-lg border text-xs flex items-start gap-2.5 transition-all outline-none cursor-pointer ${optionStyle}`}
                                  >
                                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold mt-0.5 flex-shrink-0 ${
                                      isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                                    }`}>
                                      {String.fromCharCode(65 + oIdx)}
                                    </span>
                                    <span className="flex-1 leading-relaxed">{option}</span>
                                    {isSubmitted && isCorrect && <CheckCircle className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />}
                                    {isSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-rose-600 mt-0.5 flex-shrink-0" />}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Submit & Navigation Button */}
                            <div className="flex justify-between items-center pt-2 flex-wrap gap-2">
                              {!isSubmitted ? (
                                <button
                                  disabled={chosenAnswer === undefined}
                                  onClick={() => setQuizSubmitted(prev => ({ ...prev, [questionObj.id]: true }))}
                                  className="px-5 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1d4ed8] disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all active:scale-95 shadow-sm cursor-pointer"
                                >
                                  Verificar Respuesta
                                </button>
                              ) : (
                                <div className="text-xs">
                                  {chosenAnswer === questionObj.correctAnswerIndex ? (
                                    <span className="text-emerald-800 font-semibold flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1.5 rounded border border-emerald-200 shadow-sm text-xs">
                                      ✨ ¡Excelente! Respuesta correcta.
                                    </span>
                                  ) : (
                                    <span className="text-rose-800 font-semibold flex items-center gap-1.5 bg-rose-50 px-2.5 py-1.5 rounded border border-rose-200 shadow-sm text-xs">
                                      ❌ Respuesta Incorrecta.
                                    </span>
                                  )}
                                </div>
                              )}

                              <div className="flex gap-2">
                                <button
                                  onClick={() => {
                                    // Reset question
                                    setQuizAnswers(prev => {
                                      const u = { ...prev };
                                      delete u[questionObj.id];
                                      return u;
                                    });
                                    setQuizSubmitted(prev => {
                                      const u = { ...prev };
                                      delete u[questionObj.id];
                                      return u;
                                    });
                                  }}
                                  className="p-2 text-xs text-slate-600 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg cursor-pointer"
                                  title="Reiniciar esta pregunta"
                                >
                                  <RotateCcw className="w-4 h-4" />
                                </button>

                                {currentQuizIndex < activeChapter.quiz.length - 1 ? (
                                  <button
                                    onClick={() => setCurrentQuizIndex(prev => prev + 1)}
                                    className="px-4 py-2 text-xs font-semibold text-blue-600 bg-white hover:bg-blue-50 border border-blue-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                                  >
                                    Siguiente Pregunta
                                    <ArrowRight className="w-3.5 h-3.5" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      // Complete chapter progress
                                      if (!completedChapters.includes(activeChapter.id)) {
                                        toggleChapterComplete(activeChapter.id);
                                      }
                                      setQuizSuccessMessage(`🏆 ¡Has finalizado el cuestionario del capítulo "${activeChapter.title.split('. ')[1]}" con éxito! Tu progreso se ha guardado de forma permanente.`);
                                    }}
                                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm cursor-pointer"
                                  >
                                    Finalizar Capítulo
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Detailed explanation when submitted */}
                            {isSubmitted && (
                              <div className="mt-4 p-4 bg-blue-50/50 border-l-4 border-blue-500 rounded-r-xl shadow-sm">
                                <h5 className="font-extrabold text-blue-800 text-xs mb-1 uppercase tracking-wider">Fundamentación Oficial</h5>
                                <p className="text-slate-700 text-xs leading-relaxed font-medium">
                                  {questionObj.explanation}
                                </p>
                              </div>
                            )}

                          </div>
                        );
                      })()}

                    </div>
                  </div>
                )}

                {/* Related Resources Section */}
                {activeChapterId !== 'welcome' && (
                  <div id="related-resources-block" className="mt-8 pt-8 border-t border-slate-200">
                    <h4 className="font-extrabold text-slate-400 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-600" />
                      Recursos de Estudio Relacionados
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Siguiente Capítulo */}
                      {(() => {
                        const curIdx = CHAPTERS.findIndex(c => c.id === activeChapterId);
                        const nextCh = curIdx < CHAPTERS.length - 1 ? CHAPTERS[curIdx + 1] : null;
                        
                        return (
                          <button
                            onClick={() => {
                              if (nextCh) {
                                setActiveChapterId(nextCh.id);
                              } else {
                                setActiveChapterId('welcome');
                              }
                              document.getElementById('main-article-content')?.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="text-left p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all duration-200 group flex flex-col justify-between min-h-[110px] cursor-pointer shadow-sm"
                          >
                            <span className="text-[10px] text-blue-600 font-extrabold uppercase tracking-wider flex items-center gap-1">
                              {nextCh ? "Siguiente Capítulo" : "¡Manual Completado!"}
                            </span>
                            <span className="text-slate-900 font-extrabold text-xs group-hover:text-[#2563EB] transition-colors mt-1.5 leading-normal">
                              {nextCh ? `${nextCh.title.split('. ')[1]}` : "Volver a la Bienvenida de la Guía"}
                            </span>
                            <span className="text-[9px] text-slate-400 mt-2 flex items-center gap-1 group-hover:text-slate-600">
                              {nextCh ? "Comenzar próxima lectura" : "Ir a la pantalla de bienvenida"}
                              <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                            </span>
                          </button>
                        );
                      })()}

                      {/* Conceptos Relacionados */}
                      {(() => {
                        const curIdx = CHAPTERS.findIndex(c => c.id === activeChapterId);
                        const relatedItem1 = GLOSSARY[(curIdx * 2) % GLOSSARY.length] || GLOSSARY[0];
                        const relatedItem2 = GLOSSARY[(curIdx * 2 + 1) % GLOSSARY.length] || GLOSSARY[1];
                        
                        return (
                          <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col justify-between min-h-[110px] shadow-sm">
                            <span className="text-[10px] text-amber-600 font-extrabold uppercase tracking-wider">
                              Conceptos Relacionados
                            </span>
                            <div className="flex flex-col gap-1.5 mt-1.5">
                              <button
                                onClick={() => setSelectedGlossaryTerm(relatedItem1)}
                                className="text-left text-xs font-bold text-slate-700 hover:text-[#2563EB] truncate flex items-center gap-1 cursor-pointer"
                              >
                                🔍 {relatedItem1.term}
                              </button>
                              <button
                                onClick={() => setSelectedGlossaryTerm(relatedItem2)}
                                className="text-left text-xs font-bold text-slate-700 hover:text-[#2563EB] truncate flex items-center gap-1 cursor-pointer"
                              >
                                🔍 {relatedItem2.term}
                              </button>
                            </div>
                            <span className="text-[9px] text-slate-400 mt-2">
                              Haz clic para ver sus definiciones oficiales
                            </span>
                          </div>
                        );
                      })()}

                      {/* Preguntar al Tutor sobre este tema */}
                      <button
                        onClick={() => {
                          const text = `¿Me podrías dar un resumen estratégico detallado sobre el capítulo "${activeChapter.title}"?`;
                          setActiveChapterId('tutor');
                          handleSendMessage(text);
                        }}
                        className="text-left p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-emerald-300 transition-all duration-200 group flex flex-col justify-between min-h-[110px] cursor-pointer shadow-sm"
                      >
                        <span className="text-[10px] text-emerald-600 font-extrabold uppercase tracking-wider flex items-center gap-1">
                          Consultar al Tutor
                        </span>
                        <span className="text-slate-900 font-extrabold text-xs group-hover:text-emerald-600 transition-colors mt-1.5 leading-normal">
                          Preguntar sobre "{activeChapter.title.split('. ')[1]}"
                        </span>
                        <span className="text-[9px] text-slate-400 mt-2 flex items-center gap-1 group-hover:text-slate-600">
                          Generar resumen estratégico de IA
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </button>

                      {/* Ir al Cuestionario del Capítulo */}
                      <button
                        onClick={() => {
                          document.getElementById('quiz-block')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="text-left p-4 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-blue-300 transition-all duration-200 group flex flex-col justify-between min-h-[110px] cursor-pointer shadow-sm"
                      >
                        <span className="text-[10px] text-[#2563EB] font-extrabold uppercase tracking-wider flex items-center gap-1">
                          Test de Evaluación
                        </span>
                        <span className="text-slate-900 font-extrabold text-xs group-hover:text-[#2563EB] transition-colors mt-1.5 leading-normal">
                          Test de preparación oficial del capítulo
                        </span>
                        <span className="text-[9px] text-slate-400 mt-2 flex items-center gap-1 group-hover:text-slate-600">
                          Poner a prueba tus conocimientos
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </button>

                    </div>
                  </div>
                )}

              </div>
              
              </>
              )}
            </article>
          </div>

        </div>
      )}
    </div>
      {selectedGlossaryTerm && (
        <div id="glossary-term-modal" className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-slate-500 font-extrabold uppercase tracking-wider">Detalle del Glosario</span>
              </div>
              <button 
                onClick={() => setSelectedGlossaryTerm(null)}
                className="text-slate-400 hover:text-slate-800 text-sm font-bold p-1 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-4">
              <h4 className="text-slate-950 font-sans font-extrabold text-xl leading-snug">
                {selectedGlossaryTerm.term}
              </h4>
              <p className="text-slate-700 text-xs md:text-sm leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {selectedGlossaryTerm.definition}
              </p>
              
              <div className="flex gap-2 pt-2 justify-end">
                <button
                  onClick={() => {
                    setActiveChapterId('tutor');
                    handleSendMessage(`Explícame en detalle: ${selectedGlossaryTerm.term}`);
                    setSelectedGlossaryTerm(null);
                  }}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1d4ed8] rounded-lg flex items-center gap-1 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  Preguntar al Asistente IA
                </button>
                <button
                  onClick={() => setSelectedGlossaryTerm(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Glosario Completo Modal Overlay */}
      {showAllGlossary && (
        <div id="glossary-complete-modal" className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-3xl w-full h-[85vh] flex flex-col overflow-hidden">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-50/50 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <BookText className="w-5 h-5 text-blue-600" />
                <div>
                  <h4 className="text-slate-900 font-extrabold text-sm uppercase tracking-wider">Glosario Técnico Completo</h4>
                  <p className="text-[10px] text-slate-500">Términos esenciales de la Guía del Gerente de BSG</p>
                </div>
              </div>
              <button 
                onClick={() => setShowAllGlossary(false)}
                className="text-slate-400 hover:text-slate-800 text-lg font-bold p-1 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Search filter */}
            <div className="p-4 border-b border-slate-200 bg-slate-50/20 flex-shrink-0">
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-blue-500 pointer-events-none">
                  <Search className="w-4 h-4" />
                </span>
                <input 
                  type="text" 
                  placeholder="Filtrar términos (ej: ROE, S/Q, Aranceles...)" 
                  value={glossarySearch}
                  onChange={(e) => setGlossarySearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all placeholder-slate-400"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {(() => {
                const filtered = GLOSSARY.filter(item => 
                  item.term.toLowerCase().includes(glossarySearch.toLowerCase()) || 
                  item.definition.toLowerCase().includes(glossarySearch.toLowerCase())
                );

                if (filtered.length === 0) {
                  return (
                    <div className="p-8 text-center text-slate-500 text-xs flex flex-col items-center gap-1">
                      <AlertCircle className="w-6 h-6 text-blue-500" />
                      No se encontraron términos para "{glossarySearch}".
                    </div>
                  );
                }

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filtered.map((item, idx) => (
                      <div 
                        key={`gl-${idx}`} 
                        className="p-4 bg-white border border-slate-200/80 rounded-xl hover:border-blue-300 hover:bg-slate-50/40 transition-all flex flex-col justify-between"
                      >
                        <div>
                          <h5 className="font-extrabold text-slate-900 text-xs md:text-sm">{item.term}</h5>
                          <p className="text-slate-600 text-[11px] md:text-xs leading-relaxed mt-1.5">
                            {item.definition}
                          </p>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100 flex justify-end">
                          <button
                            onClick={() => {
                              setActiveChapterId('tutor');
                              handleSendMessage(`Explícame el concepto: ${item.term}`);
                              setShowAllGlossary(false);
                            }}
                            className="text-[10px] text-blue-600 hover:text-[#2563EB] font-bold uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer"
                          >
                            Preguntar Asistente IA →
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex justify-end flex-shrink-0">
              <button
                onClick={() => setShowAllGlossary(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors cursor-pointer"
              >
                Cerrar Glosario
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Quiz Success Celebration Modal */}
      {quizSuccessMessage && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md flex items-center justify-center z-[100] p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 text-center shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl"></div>
            
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mx-auto mb-4 text-emerald-600">
              <Award className="w-8 h-8 animate-bounce" />
            </div>
            
            <h3 className="text-xl font-sans font-extrabold text-slate-950 mb-2">¡Felicitaciones!</h3>
            <p className="text-slate-600 text-xs md:text-sm leading-relaxed mb-6">
              {quizSuccessMessage}
            </p>
            
            <button
              onClick={() => setQuizSuccessMessage(null)}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
            >
              Entendido, continuar estudiando
            </button>
          </div>
        </div>
      )}

    </div>
  </div>
  );
}
