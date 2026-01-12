import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, Brain, Coins, Network, BrainCircuit, 
  Code, Terminal, ShieldCheck, Tag, Award, 
  Package, Cpu, Activity, Server, X, ChevronRight, 
  RefreshCw, Layers, Monitor,
  CheckCircle2, Target, Calendar, Rocket, Menu,
  AlertCircle, Settings, Download, Pause, Play
} from 'lucide-react';
import { IntakeForm } from './IntakeForm';
import { ThemeSelector } from './ThemeSelector';
import { RequirementsConsole } from './RequirementsConsole';
import { ProjectMonitor } from './ProjectMonitor';
// import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// --- DATA & CONFIGURATION ---

const STAGES = [
  {
    id: 1,
    name: "Ingeniería de Requisitos",
    icon: <Brain className="w-6 h-6" />,
    secondaryIcon: <FileText className="w-4 h-4 opacity-50" />,
    color: "red",
    hex: "#EF4444",
    description: "Convertir ideas en especificaciones claras y medibles.",
    metrics: { label: "Clarity", value: "98%" },
    formConfig: {
      title: "Requerimientos Inteligentes",
      fields: [
        { id: "projectName", label: "Nombre del Proyecto", type: "text", placeholder: "Ej: SuperApp FinTech" },
        { id: "problemDescription", label: "Identificación del Problema", type: "textarea", placeholder: "¿Qué dolor resuelve este software?" },
        { id: "objectives", label: "Objetivos del Negocio", type: "textarea", placeholder: "Metas medibles..." },
        { id: "stakeholders", label: "Stakeholders", type: "text", placeholder: "Interesados clave..." }
      ]
    }
  },
  {
    id: 2,
    name: "Motor de Decisión",
    icon: <Cpu className="w-6 h-6" />,
    secondaryIcon: <BrainCircuit className="w-4 h-4 opacity-50" />,
    color: "orange",
    hex: "#F97316",
    description: "Inteligencia Artificial para seleccionar metodología y stack.",
    metrics: { label: "Decision", value: "Optimal" },
    formConfig: {
      title: "Motor de Decisión",
      fields: [
        { id: "decisionCriteria", label: "Criterios de Decisión", type: "multiselect", options: ["Time-to-Market", "Escalabilidad", "Presupuesto Ajustado", "Seguridad Crítica"] },
        { id: "methodologyPreference", label: "Preferencia Metodológica", type: "select", options: ["Ágil (Scrum/Kanban)", "Tradicional (Waterfall)", "Lean Startup"] },
        { id: "techPreference", label: "Preferencia Tecnológica", type: "select", options: ["Open Source", "Enterprise (Microsoft/Oracle)", "Cloud Native"] },
        { id: "licenseType", label: "Tipo de Licencia", type: "select", options: ["Open Source (MIT)", "Closed Source (Proprietary)"] }
      ]
    }
  },
  {
    id: 3,
    name: "Diseño de Arquitectura",
    icon: <Network className="w-6 h-6" />,
    secondaryIcon: <Layers className="w-4 h-4 opacity-50" />,
    color: "yellow",
    hex: "#EAB308",
    description: "Definir cómo se estructura el software.",
    metrics: { label: "Structure", value: "Solid" },
    formConfig: {
      title: "Arquitectura Inteligente",
      fields: [
        { id: "architectureType", label: "Tipo de Arquitectura", type: "select", options: ["Monolito", "Microservicios", "Event-Driven", "Serverless"] },
        { id: "scalability", label: "Escalabilidad", type: "select", options: ["Vertical", "Horizontal", "Elástica"] },
        { id: "security", label: "Nivel de Seguridad", type: "select", options: ["Estándar", "Alto (Banca/Salud)", "Militar"] },
        { id: "techStack", label: "Stack Tecnológico Sugerido", type: "text", placeholder: "Ej: React, Node, AWS..." }
      ]
    }
  },
  {
    id: 4,
    name: "Diseño UX/UI",
    icon: <Monitor className="w-6 h-6" />,
    secondaryIcon: <Tag className="w-4 h-4 opacity-50" />,
    color: "pink",
    hex: "#EC4899",
    description: "Diseñar cómo se ve y se siente el producto.",
    metrics: { label: "UX Score", value: "A+" },
    formConfig: {
      title: "Experiencia Futurista",
      fields: [
        { id: "designStyle", label: "Estilo de Diseño", type: "select", options: ["Minimalista", "Futurista", "Corporativo", "Lúdico"] },
        { id: "accessibility", label: "Nivel de Accesibilidad", type: "select", options: ["AA", "AAA"] },
        { id: "deviceSupport", label: "Soporte de Dispositivos", type: "multiselect", options: ["Mobile", "Desktop", "Tablet", "Wearables"] },
        { id: "interaction", label: "Complejidad de Interacción", type: "range", min: 1, max: 10 }
      ]
    }
  },
  {
    id: 5,
    name: "Planificación del Desarrollo",
    icon: <Calendar className="w-6 h-6" />,
    secondaryIcon: <Target className="w-4 h-4 opacity-50" />,
    color: "cyan",
    hex: "#06B6D4",
    description: "Convertir diseño en plan ejecutable.",
    metrics: { label: "Plan", value: "Agile" },
    formConfig: {
      title: "Plan de Producción",
      fields: [
        { id: "methodology", label: "Metodología", type: "select", options: ["Scrum", "Kanban", "Waterfall", "Shape Up"] },
        { id: "sprints", label: "Número Estimado de Sprints", type: "number" },
        { id: "teamSize", label: "Tamaño del Equipo", type: "number" },
        { id: "budgetEstimation", label: "Estimación de Presupuesto", type: "number", prefix: "$" }
      ]
    }
  },
  {
    id: 6,
    name: "Construcción (Desarrollo)",
    icon: <Code className="w-6 h-6" />,
    secondaryIcon: <Terminal className="w-4 h-4 opacity-50" />,
    color: "blue",
    hex: "#3B82F6",
    description: "Construir el software con estándares de calidad.",
    metrics: { label: "Code", value: "Clean" },
    formConfig: {
      title: "Ensamblaje de Software",
      fields: [
        { id: "repoUrl", label: "Repositorio", type: "text", placeholder: "git@..." },
        { id: "frontend", label: "Tecnología Frontend", type: "text" },
        { id: "backend", label: "Tecnología Backend", type: "text" },
        { id: "codeQuality", label: "Estándar de Calidad", type: "checkbox", labelRight: "Activar validaciones estrictas (Lint/Sonar)" }
      ]
    }
  },
  {
    id: 7,
    name: "Pruebas y Calidad",
    icon: <ShieldCheck className="w-6 h-6" />,
    secondaryIcon: <CheckCircle2 className="w-4 h-4 opacity-50" />,
    color: "purple",
    hex: "#8B5CF6",
    description: "Garantizar estabilidad y calidad.",
    metrics: { label: "Bugs", value: "0" },
    formConfig: {
      title: "Control de Calidad (QA)",
      fields: [
        { id: "testTypes", label: "Tipos de Pruebas", type: "multiselect", options: ["Unitarias", "Integración", "E2E", "Performance", "Seguridad"] },
        { id: "coverageTarget", label: "Meta de Coverage", type: "range", min: 0, max: 100 },
        { id: "automationLevel", label: "Nivel de Automatización", type: "select", options: ["Manual", "Híbrido", "Full Automático"] }
      ]
    }
  },
  {
    id: 8,
    name: "Despliegue (CI/CD)",
    icon: <Rocket className="w-6 h-6" />,
    secondaryIcon: <Server className="w-4 h-4 opacity-50" />,
    color: "green",
    hex: "#22C55E",
    description: "Poner el software en producción de forma segura.",
    metrics: { label: "Uptime", value: "99.99%" },
    formConfig: {
      title: "Lanzamiento Automático",
      fields: [
        { id: "environment", label: "Entorno Destino", type: "select", options: ["AWS", "Azure", "GCP", "On-Premise"] },
        { id: "containerization", label: "Contenedorización", type: "checkbox", labelRight: "Docker/Kubernetes habilitado" },
        { id: "pipelineStrategy", label: "Estrategia de Despliegue", type: "select", options: ["Blue/Green", "Canary", "Rolling"] }
      ]
    }
  },
  {
    id: 9,
    name: "Monitoreo y Optimización",
    icon: <Activity className="w-6 h-6" />,
    secondaryIcon: <RefreshCw className="w-4 h-4 opacity-50" />,
    color: "emerald",
    hex: "#10B981",
    description: "Mantener y mejorar el software.",
    metrics: { label: "Health", value: "Good" },
    formConfig: {
      title: "Mejora Continua",
      fields: [
        { id: "monitoringTools", label: "Herramientas de Monitoreo", type: "multiselect", options: ["Datadog", "New Relic", "Grafana", "CloudWatch"] },
        { id: "alertThreshold", label: "Umbral de Alerta (Latencia)", type: "range", min: 100, max: 2000 },
        { id: "autoScaling", label: "Auto-Scaling", type: "checkbox", labelRight: "Habilitar escalado automático" }
      ]
    }
  },
  {
    id: 10,
    name: "Peritaje y Valoración",
    icon: <Award className="w-6 h-6" />,
    secondaryIcon: <Coins className="w-4 h-4 opacity-50" />,
    color: "indigo",
    hex: "#6366F1",
    description: "Determinar el valor económico del software.",
    metrics: { label: "Value", value: "$$$" },
    formConfig: {
      title: "Valor de Mercado",
      fields: [
        { id: "marketValue", label: "Valoración de Mercado Estimada", type: "number", prefix: "$" },
        { id: "roi", label: "Retorno de Inversión (ROI)", type: "text", placeholder: "Ej: 150% anual" },
        { id: "scalabilityScore", label: "Puntaje de Escalabilidad", type: "range", min: 1, max: 10 },
        { id: "certification", label: "Certificación de Calidad", type: "checkbox", labelRight: "Emitir certificado digital" }
      ]
    }
  },
  {
    id: 11,
    name: "Entrega Final",
    icon: <Package className="w-6 h-6" />,
    secondaryIcon: <CheckCircle2 className="w-4 h-4 opacity-50" />,
    color: "teal",
    hex: "#14B8A6",
    description: "Empaquetado y certificación final.",
    metrics: { label: "Ready", value: "100%" },
    formConfig: {
      title: "Entrega de Producto",
      fields: [
        { id: "deliveryFormat", label: "Formato de Entrega", type: "select", options: ["Código Fuente (Zip)", "Imagen Docker", "Acceso a Repositorio"] },
        { id: "documentation", label: "Incluir Documentación", type: "checkbox", labelRight: "Manual Técnico y de Usuario" },
        { id: "finalSignOff", label: "Aprobación Final", type: "checkbox", labelRight: "Cliente aprueba conformidad" }
      ]
    }
  }
];

// --- COMPONENTS ---

interface ModalFormProps {
  stage: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  projectData: any;
}

const ModalForm: React.FC<ModalFormProps> = ({ stage, isOpen, onClose, onSave, projectData }) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [suggestion, setSuggestion] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setFormData({});
      
      // Coherence Logic: Generate suggestions based on previous data
      if (projectData) {
        if (stage.id === 2) { // Análisis
            const reqIntel = projectData['intelligence_1'];
            if (reqIntel) {
                setSuggestion(`🧠 AI Analysis: Domain detected as ${reqIntel.domain}. Recommended Risk Level: ${reqIntel.riskLevel}. Suggested Use Cases: ${reqIntel.generatedUseCases?.length || 0} generated.`);
            }
        }
        if (stage.id === 3) { // Arquitectura
            const anaIntel = projectData['intelligence_2'];
            if (anaIntel) {
                setSuggestion(`🏗️ AI Architecture: Recommended Pattern: ${anaIntel.recommendedPattern}. Database: ${anaIntel.database}.`);
            }
        }
        if (stage.id === 4) { // Diseño UX/UI
            const archIntel = projectData['intelligence_3'];
            if (archIntel) {
                setSuggestion(`🎨 AI Design: Style: ${archIntel.style}. Palette: ${archIntel.colorPalette}.`);
            }
        }
        if (stage.id === 6) { // Construcción
            const arch = projectData[3]; // Architecture Stage
            if (arch?.architectureType === 'Microservices') {
                setSuggestion("💡 Suggestion based on Architecture: Use NestJS or Spring Boot for Microservices.");
            } else if (arch?.architectureType === 'Serverless') {
                setSuggestion("💡 Suggestion: Use AWS Lambda / Azure Functions.");
            }
        }
        if (stage.id === 7) { // QA
            const arch = projectData[3];
            if (arch?.security === 'Alto (Banca/Salud)' || arch?.security === 'Militar') {
                setSuggestion("⚠️ High Security Requirement Detected: 'Security Testing' is recommended.");
            }
        }
        if (stage.id === 8) { // Despliegue
            const arch = projectData[3];
            if (arch?.architectureType === 'Microservices') {
                setSuggestion("💡 Microservices detected: Kubernetes (K8s) is recommended.");
            }
        }
      }
    } else {
        setSuggestion(null);
    }
  }, [isOpen, stage.id, projectData]);

  if (!isOpen || !stage.formConfig) return null;

  const handleInputChange = (id: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [id]: value }));
  };

  const handleMultiSelect = (id: string, option: string) => {
    setFormData((prev: any) => {
      const current = prev[id] || [];
      if (current.includes(option)) {
        return { ...prev, [id]: current.filter((item: string) => item !== option) };
      } else {
        return { ...prev, [id]: [...current, option] };
      }
    });
  };

  const handleSave = () => {
    if (onSave) onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div 
        className="relative w-full max-w-2xl bg-[#0F1419] border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
      >
        {/* Header */}
        <div className={`h-2 w-full bg-gradient-to-r from-${stage.color}-500 to-${stage.color}-300`} />
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl bg-${stage.color}-500/10 text-${stage.color}-400 border border-${stage.color}-500/20`}>
              {stage.icon}
            </div>
            <div>
              <h3 className="text-xl font-heading font-bold text-white">{stage.formConfig.title}</h3>
              <p className="text-sm text-slate-400">Ingreso de datos para: {stage.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        {suggestion && (
          <div className="mx-8 mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg flex items-center gap-3">
             <div className="bg-blue-500/20 p-2 rounded-full">
               <Brain className="w-4 h-4 text-blue-400" />
             </div>
             <p className="text-sm text-blue-200 font-mono">{suggestion}</p>
          </div>
        )}

        {/* Form Content */}
        <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
          {stage.formConfig.fields.map((field: any, idx: number) => (
            <div key={field.id} className="space-y-2">
              <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                {field.label}
                {idx === 0 && <span className="text-red-400">*</span>}
              </label>
              
              {field.type === 'text' && (
                <input 
                  type="text" 
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-${stage.color}-500 transition-colors placeholder:text-slate-600`}
                  placeholder={field.placeholder} 
                />
              )}
              
              {field.type === 'number' && (
                <div className="relative">
                  {field.prefix && <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">{field.prefix}</span>}
                  <input 
                    type="number" 
                    value={formData[field.id] || ''}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-${stage.color}-500 transition-colors ${field.prefix ? 'pl-8' : ''}`} 
                    placeholder="0" 
                  />
                </div>
              )}

              {field.type === 'textarea' && (
                <textarea 
                  value={formData[field.id] || ''}
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                  className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-${stage.color}-500 transition-colors h-32 resize-none placeholder:text-slate-600`}
                  placeholder={field.placeholder}
                ></textarea>
              )}

              {field.type === 'select' && (
                 <div className="relative">
                   <select 
                     value={formData[field.id] || ''}
                     onChange={(e) => handleInputChange(field.id, e.target.value)}
                     className={`w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-${stage.color}-500 transition-colors appearance-none cursor-pointer`}
                   >
                     <option value="" disabled>Seleccionar opción...</option>
                     {field.options?.map((opt: any) => <option key={opt} value={opt} className="bg-slate-900">{opt}</option>)}
                   </select>
                   <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 rotate-90 pointer-events-none" />
                 </div>
              )}

              {field.type === 'range' && (
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-500 font-mono">{field.min || 0}</span>
                  <input 
                    type="range" 
                    min={field.min || 0} 
                    max={field.max || 100} 
                    value={formData[field.id] || field.min || 0}
                    onChange={(e) => handleInputChange(field.id, e.target.value)}
                    className={`flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-${stage.color}-500`}
                  />
                  <span className="text-xs text-slate-500 font-mono">{field.max || 100}</span>
                </div>
              )}

              {field.type === 'multiselect' && (
                <div className="grid grid-cols-2 gap-3">
                  {field.options?.map((opt: any) => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer group p-3 rounded-lg bg-black/20 border border-white/5 hover:border-white/20 transition-all">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        (formData[field.id] || []).includes(opt) ? `border-${stage.color}-500 bg-${stage.color}-500/20` : `border-slate-600 group-hover:border-${stage.color}-500`
                      }`}>
                        <input 
                          type="checkbox" 
                          className="hidden" 
                          checked={(formData[field.id] || []).includes(opt)}
                          onChange={() => handleMultiSelect(field.id, opt)}
                        />
                        <div className={`w-2 h-2 bg-${stage.color}-500 rounded-sm transition-opacity ${
                          (formData[field.id] || []).includes(opt) ? 'opacity-100' : 'opacity-0'
                        }`} />
                      </div>
                      <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{opt}</span>
                    </label>
                  ))}
                </div>
              )}

              {field.type === 'checkbox' && (
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    formData[field.id] ? `border-${stage.color}-500 bg-${stage.color}-500/20` : `border-slate-600 group-hover:border-${stage.color}-500`
                  }`}>
                    <input 
                      type="checkbox" 
                      className="hidden" 
                      checked={formData[field.id] || false}
                      onChange={(e) => handleInputChange(field.id, e.target.checked)}
                    />
                    <div className={`w-3 h-3 bg-${stage.color}-500 rounded-sm transition-opacity ${
                      formData[field.id] ? 'opacity-100' : 'opacity-0'
                    }`} />
                  </div>
                  <span className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{field.labelRight}</span>
                </label>
              )}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-white/5 bg-black/20 flex justify-end gap-4">
          <button onClick={onClose} className="px-6 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors text-sm font-medium">
            Cancelar
          </button>
          <button onClick={handleSave} className={`px-6 py-2 rounded-lg bg-${stage.color}-600 hover:bg-${stage.color}-500 text-white shadow-lg shadow-${stage.color}-500/20 transition-all text-sm font-bold tracking-wide`}>
            Guardar Datos
          </button>
        </div>
      </motion.div>
    </div>
  );
};

// ... (Rest of Header, Sidebar, Capsule components remain largely same, will reference them but focus on StationCard update)



const LogEntry = ({ log }: { log: any }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="group relative border-l-2 border-purple-500/50 pl-3 py-1 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div 
        className="flex items-center justify-between mb-1 cursor-pointer select-none"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
            <ChevronRight className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
            <span className="text-[10px] text-slate-500 font-bold tracking-wider">{log.timestamp}</span>
        </div>
        <span className="text-[10px] text-purple-400 font-bold px-1.5 py-0.5 rounded bg-purple-500/10 border border-purple-500/20">
          {log.stage}
        </span>
      </div>
      
      {isExpanded ? (
        <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed font-mono text-[11px] opacity-90 transition-opacity mt-2 block">
            {log.message}
        </pre>
      ) : (
        <div className="text-slate-500 text-[10px] truncate opacity-60 pl-5 cursor-pointer" onClick={() => setIsExpanded(true)}>
           {log.message.split('\n')[0].substring(0, 60)}...
        </div>
      )}
    </div>
  );
};

const Header = ({ systemLoad, onOpenSidebar, onOpenMonitor }: { systemLoad: number, onOpenSidebar: () => void, onOpenMonitor: () => void }) => (
  <header className="fixed top-0 left-0 right-0 z-50 h-16 bg-[#0A0E27]/80 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
        <Cpu className="text-white w-6 h-6" />
      </div>
      <div>
        <h1 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 font-heading uppercase">
          Software Factory
        </h1>
        <div className="flex items-center gap-2 text-[10px] text-slate-400 tracking-widest uppercase">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          System Online
        </div>
      </div>
    </div>

    <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
      <button onClick={onOpenMonitor} className="hover:text-white transition-colors uppercase tracking-wide text-xs flex items-center gap-2 text-blue-400 border border-blue-500/30 px-3 py-1 rounded-full bg-blue-500/10">
          <Monitor className="w-3 h-3" /> Monitor Real-Time
      </button>
      {['Panel', 'Proyectos', 'Informes', 'Ajustes'].map((item) => (
        <button 
            key={item} 
            className="hover:text-white transition-colors uppercase tracking-wide text-xs"
            onClick={item === 'Ajustes' ? onOpenSidebar : undefined}
        >
          {item}
        </button>
      ))}
    </nav>

    <div className="flex items-center gap-6">
      <ThemeSelector />
      <div className="flex flex-col items-end">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">CPU Usage</span>
        <div className="w-32 h-1 bg-slate-800 rounded-full overflow-hidden mt-1">
          <motion.div 
            className="h-full bg-gradient-to-r from-green-400 to-blue-500"
            animate={{ width: `${systemLoad}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
        <img src="https://api.dicebear.com/7.x/bottts/svg?seed=Factory" alt="Avatar" className="w-6 h-6" />
      </div>
    </div>
  </header>
);

const Sidebar = ({ isOpen, toggle, config }: { isOpen: boolean, toggle: () => void, config: any }) => (
  <motion.div 
    className="fixed top-16 right-0 bottom-0 w-80 bg-[#0F1419]/90 backdrop-blur-xl border-l border-white/10 z-40 p-6 flex flex-col gap-6"
    initial={{ x: "100%" }}
    animate={{ x: isOpen ? 0 : "100%" }}
    transition={{ type: "spring", damping: 20 }}
  >
    <div className="flex items-center justify-between border-b border-white/10 pb-4">
      <h2 className="font-heading text-lg font-bold text-white">Configuración</h2>
      <button onClick={toggle} className="p-2 hover:bg-white/5 rounded-full transition-colors">
        <X className="w-5 h-5 text-slate-400" />
      </button>
    </div>

    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-xs text-slate-400 uppercase tracking-wider">Tech Stack</label>
        <div className="flex flex-wrap gap-2">
          {['React', 'Node', 'AWS', 'Python'].map(tech => (
            <span key={tech} className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-mono">
              {tech}
            </span>
          ))}
        </div>
      </div>

      <div className="glass-panel p-4 rounded-xl space-y-3">
        <div className="flex items-center gap-2 text-purple-400">
          <Brain className="w-4 h-4" />
          <span className="font-bold text-sm">IA Advisor Tips</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Se recomienda arquitectura Serverless para reducir costos operativos en un 40% basado en el patrón de tráfico detectado.
        </p>
      </div>

      <div className="space-y-4">
        <label className="text-xs text-slate-400 uppercase tracking-wider">Niveles de Energía</label>
        <div className="space-y-3">
          {['Processing Power', 'Memory Allocation', 'Network Speed'].map((label, i) => (
            <div key={i} className="space-y-1">
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>{label}</span>
                <span>{(80 + i * 5)}%</span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                 <motion.div 
                   className={`h-full bg-gradient-to-r ${i === 0 ? 'from-blue-500 to-cyan-400' : i === 1 ? 'from-purple-500 to-pink-400' : 'from-green-500 to-emerald-400'}`}
                   initial={{ width: 0 }}
                   animate={{ width: `${80 + i * 5}%` }}
                   transition={{ duration: 1, delay: 0.5 + i * 0.2 }}
                 />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
         <div className="flex justify-between items-center text-sm">
           <span className="text-slate-400">Modo Rayos X</span>
           <div className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors ${config.xray ? 'bg-blue-500' : 'bg-slate-700'}`} onClick={config.toggleXray}>
             <motion.div 
               className="absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm"
               animate={{ left: config.xray ? 22 : 4 }}
             />
           </div>
         </div>
      </div>
    </div>
  </motion.div>
);

const Capsule = ({ currentStage, isXray }: { currentStage: number, isXray: boolean }) => {
  // Calculate position: Updated for new card width (360px) + gap-24 (96px)
  const CARD_WIDTH = 360;
  const GAP = 96; 
  const START_OFFSET = 80; 
  
  // Center of the card
  const positionX = START_OFFSET + (currentStage * (CARD_WIDTH + GAP)) + (CARD_WIDTH / 2) - 32; // -32 is half capsule width (w-16 = 64px)

  // Get current stage color
  const stageColor = STAGES[currentStage]?.color || 'blue';
  const stageHex = STAGES[currentStage]?.hex || '#3B82F6';

  return (
    <motion.div
      className="absolute top-1/2 z-30 pointer-events-none"
      animate={{ 
        x: positionX,
        y: 'calc(-50% - 90px)' // Align with Monitor Center (170px) instead of Card Center (260px)
      }}
      transition={{ 
        type: "spring", 
        stiffness: 50, 
        damping: 20,
        mass: 1
      }}
    >
      <div className={`relative w-16 h-16 transition-all duration-500 ${isXray ? 'opacity-90' : 'opacity-100'}`}>
        {/* DATA BOX CONTAINER */}
        <div 
            className={`absolute inset-0 bg-gradient-to-br from-${stageColor}-600 to-${stageColor}-900 rounded-xl border border-${stageColor}-400/50 flex items-center justify-center overflow-hidden z-20 group transition-colors duration-500`}
            style={{ boxShadow: `0 0 30px ${stageHex}99` }}
        >
             
             {/* Inner Cube Face */}
             <div className={`w-10 h-10 bg-[#0F172A] border border-${stageColor}-500/30 flex items-center justify-center shadow-inner transition-colors duration-500`}>
                 <Package className={`w-6 h-6 text-${stageColor}-400 animate-pulse transition-colors duration-500`} />
             </div>

             {/* Scanning Line */}
             <motion.div 
                className="absolute inset-0 bg-white/20"
                animate={{ top: ['-100%', '100%'] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
             />
             
             {/* Corner Accents */}
             <div className="absolute top-0 left-0 w-2 h-2 bg-white/80" />
             <div className="absolute bottom-0 right-0 w-2 h-2 bg-white/80" />
        </div>

        {/* Energy Field / Propulsion */}
        <div className={`absolute -inset-4 bg-${stageColor}-500/20 blur-xl rounded-full animate-pulse -z-10 transition-colors duration-500`} />
        
        {/* Trailing Effect */}
        <motion.div 
            className={`absolute top-1/2 right-full w-20 h-1 bg-gradient-to-l from-${stageColor}-500 to-transparent -translate-y-1/2 blur-sm transition-colors duration-500`}
            animate={{ opacity: [0.5, 1, 0.5], width: [40, 80, 40] }}
            transition={{ duration: 0.5, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
};

const StationCard = ({ stage, isActive, isCompleted, isWaiting, onOpenForm }: { stage: any, isActive: boolean, isCompleted: boolean, isWaiting: boolean, onOpenForm: (stage: any) => void }) => {
  return (
    <motion.div 
      className={`relative w-[360px] h-[520px] flex-shrink-0 transition-all duration-500 z-10 perspective-[1000px]
        ${isActive ? 'scale-105 z-20' : 'scale-100 opacity-80 hover:opacity-100'}
      `}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: stage.id * 0.1 }}
    >
      {/* --- UPPER SECTION: MONITOR HEAD --- */}
      <div className="relative z-20 w-full h-[340px]">
        
        {/* Decorative Top Pipes/Cables */}
        <div className={`absolute -top-4 left-4 right-4 h-8 bg-[#111] rounded-t-2xl border-t border-${stage.color}-900/50 flex justify-center items-center z-0`}>
             <div className={`w-1/2 h-2 bg-${stage.color}-900/30 rounded-full`} />
        </div>
        <div className={`absolute -top-6 -left-2 w-8 h-24 border-l-4 border-t-4 border-${stage.color}-900/50 rounded-tl-3xl opacity-50`} />
        <div className={`absolute -top-6 -right-2 w-8 h-24 border-r-4 border-t-4 border-${stage.color}-900/50 rounded-tr-3xl opacity-50`} />

        {/* Main Bezel Structure */}
        <div className={`absolute inset-0 bg-gradient-to-b from-[#1e293b] to-[#0f172a] rounded-[2.5rem] shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden border border-${stage.color}-900/50`}>
            {/* Metallic Gradient Overlay - Tinted */}
            <div className={`absolute inset-0 bg-gradient-to-br from-${stage.color}-900/20 via-[#0f172a] to-black opacity-90`} />
            
            {/* Edge Highlights */}
            <div className={`absolute inset-[2px] rounded-[2.3rem] border border-${stage.color}-500/10`} />
            
            {/* Side Vents/Grips & Cable Ports */}
            <div className={`absolute top-1/2 -translate-y-1/2 left-0 w-4 h-48 bg-[#0f172a] border-r border-${stage.color}-900/50 flex flex-col justify-between py-4`}>
                 <div className="flex flex-col gap-1 px-1">{[...Array(6)].map((_,i) => <div key={i} className="w-full h-1 bg-black/50" />)}</div>
                 {/* Left Port */}
                 <div className={`w-full h-12 bg-black/80 border-y border-${stage.color}-900/50 relative`}>
                    <div className={`absolute inset-0 bg-${stage.color}-500/20 animate-pulse`} />
                 </div>
                 <div className="flex flex-col gap-1 px-1">{[...Array(6)].map((_,i) => <div key={i} className="w-full h-1 bg-black/50" />)}</div>
            </div>
            <div className={`absolute top-1/2 -translate-y-1/2 right-0 w-4 h-48 bg-[#0f172a] border-l border-${stage.color}-900/50 flex flex-col justify-between py-4`}>
                 <div className="flex flex-col gap-1 px-1">{[...Array(6)].map((_,i) => <div key={i} className="w-full h-1 bg-black/50" />)}</div>
                 {/* Right Port (Output) */}
                 <div className={`w-full h-12 bg-black/80 border-y border-${stage.color}-900/50 relative`}>
                    <div className={`absolute inset-0 bg-${stage.color}-500/20 animate-pulse`} />
                 </div>
                 <div className="flex flex-col gap-1 px-1">{[...Array(6)].map((_,i) => <div key={i} className="w-full h-1 bg-black/50" />)}</div>
            </div>

            {/* SCREEN AREA */}
            <div className={`absolute inset-6 bg-[#050505] rounded-2xl shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] border border-${stage.color}-900/30 overflow-hidden flex flex-col`}>

                {/* Screen Glow Reflection */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/5 blur-3xl rounded-full pointer-events-none" />
                
                {/* Active Neon Border inside screen */}
                <div 
                  className={`absolute inset-0 rounded-2xl border transition-all duration-500 ${isActive ? `border-${stage.color}-500/50` : 'border-transparent'}`} 
                  style={isActive ? { boxShadow: `inset 0 0 30px ${stage.hex}20` } : {}}
                />

                {/* --- SCREEN CONTENT --- */}
                <div className="relative z-10 w-full h-full p-5 flex flex-col justify-between">
                    
                    {/* SPACER / DATA CHANNEL - Absolutely Centered */}
                    <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 h-[80px] flex items-center justify-center z-0 pointer-events-none">
                        {/* Visual guide track */}
                        <div className="absolute inset-x-0 h-16 bg-white/5 border-y border-white/5" />
                        <div className={`w-full h-[1px] border-t border-dashed border-${stage.color}-700/30 relative`} />
                    </div>

                    {/* Top Section: Info */}
                    <div className="relative z-20 flex-1 max-h-[110px] flex flex-col justify-start">
                        {/* Top Row: Icon & Step Counter */}
                        <div className="flex justify-between items-start mb-2">
                            <div className={`p-2 rounded-lg bg-${stage.color}-500/10 border border-${stage.color}-500/20 text-${stage.color}-400`}>
                                {stage.icon}
                            </div>
                            
                            {/* Circular Step Indicator */}
                            <div className="relative w-10 h-10 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="20" cy="20" r="16" fill="none" stroke={`rgba(0,0,0,0.5)`} strokeWidth="2" />
                                    <circle cx="20" cy="20" r="16" fill="none" stroke={stage.hex} strokeWidth="2" strokeOpacity="0.2" />
                                    <motion.circle 
                                        cx="20" cy="20" r="16" fill="none" stroke={stage.hex} strokeWidth="2"
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: isCompleted ? 1 : isActive ? 0.6 : 0 }}
                                        className="drop-shadow-[0_0_4px_currentColor]"
                                    />
                                </svg>
                                <span className={`absolute text-[10px] font-mono font-bold text-${stage.color}-200`}>
                                    {stage.id.toString().padStart(2, '0')}
                                </span>
                            </div>
                        </div>

                        {/* Middle Row: Title */}
                        <div className="space-y-1 overflow-hidden">
                            <h3 className={`text-lg font-bold text-white leading-tight drop-shadow-md truncate`}>
                                {stage.name}
                            </h3>
                        </div>
                    </div>

                    {/* Description: Moved to bottom & Larger */}
                    <div className="relative z-20 mt-auto mb-1 px-1">
                        <p className={`text-sm text-${stage.color}-200/70 font-medium leading-relaxed line-clamp-3 drop-shadow-sm`}>
                            {stage.description}
                        </p>
                    </div>

                    {/* Bottom Row: Status & Action */}
                    <div className={`relative z-20 flex items-center justify-between pt-2 border-t border-${stage.color}-500/20 bg-[#050505]/50 backdrop-blur-sm`}>
                        {/* Status Badge */}
                        <div className={`flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider
                            ${isCompleted ? 'text-green-400' : isActive ? `text-${stage.color}-400` : `text-${stage.color}-700`}
                        `}>
                            {isCompleted ? (
                                <><CheckCircle2 className="w-4 h-4" /> COMPLETED</>
                            ) : isActive ? (
                                isWaiting ? <><AlertCircle className="w-4 h-4 animate-bounce" /> INPUT REQ</> : <><Activity className="w-4 h-4 animate-pulse" /> ACTIVE</>
                            ) : (
                                <><div className="w-2 h-2 rounded-full bg-slate-700" /> STANDBY</>
                            )}
                        </div>

                        {/* Settings/Action Button */}
                        <button 
                            onClick={() => onOpenForm(stage)}
                            className={`p-2 rounded-lg border transition-all hover:scale-105 active:scale-95
                                ${isWaiting 
                                    ? `bg-${stage.color}-500/20 border-${stage.color}-500 text-${stage.color}-400` 
                                    : `bg-${stage.color}-500/5 border-${stage.color}-500/10 text-${stage.color}-600 hover:text-${stage.color}-200 hover:bg-${stage.color}-500/20`}
                            `}
                            style={isWaiting ? { boxShadow: `0 0 15px ${stage.hex}4d` } : {}}
                        >
                            <Settings className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Bottom Panel Details (Chin) */}
            <div className="absolute bottom-3 left-8 right-8 h-1 bg-slate-800 rounded-full overflow-hidden">
                 {isActive && (
                    <motion.div 
                        className={`h-full bg-${stage.color}-500 shadow-[0_0_10px_currentColor]`}
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 2, repeat: Infinity }}
                    />
                 )}
            </div>
        </div>
      </div>

      {/* --- MIDDLE SECTION: NECK/HYDRAULICS --- */}
      <div className="relative z-10 w-[200px] h-[60px] mx-auto -mt-6">
          <div className="absolute inset-0 bg-[#111] border-x border-slate-700" style={{ clipPath: 'polygon(10% 0, 90% 0, 100% 100%, 0% 100%)' }}>
               {/* Piston details */}
               <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-full bg-gradient-to-b from-slate-800 to-black border-x border-slate-700/50 flex flex-col justify-evenly items-center">
                    <div className={`w-12 h-1 bg-${stage.color}-900/50 rounded-full`} />
                    <div className={`w-12 h-1 bg-${stage.color}-900/50 rounded-full`} />
                    <div className={`w-12 h-1 bg-${stage.color}-900/50 rounded-full`} />
               </div>
               {/* Glowing hoses */}
               {isActive && (
                   <>
                    <div className={`absolute left-2 top-0 bottom-0 w-1 bg-${stage.color}-500/50 blur-[1px]`} />
                    <div className={`absolute right-2 top-0 bottom-0 w-1 bg-${stage.color}-500/50 blur-[1px]`} />
                   </>
               )}
          </div>
      </div>

      {/* --- BOTTOM SECTION: HEAVY BASE --- */}
      <div className="relative z-0 w-[300px] h-[100px] mx-auto -mt-2">
           {/* Main Footing Shape */}
           <div className={`absolute inset-0 bg-gradient-to-t from-[#0f172a] to-[#1e293b] rounded-xl border border-${stage.color}-900/50 shadow-2xl transition-all duration-500`}
                style={{ 
                    clipPath: 'polygon(20% 0, 80% 0, 100% 100%, 0% 100%)',
                    boxShadow: `0 0 20px ${stage.hex}30` 
                }}
           >
                {/* Mechanical Details */}
                <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-1/2 h-4 bg-black/50 rounded flex items-center justify-center gap-2 border border-${stage.color}-900/30`}>
                    <div className={`w-2 h-2 rounded-full bg-${stage.color}-500 shadow-[0_0_5px_currentColor]`} />
                    <div className={`h-[1px] flex-1 bg-${stage.color}-900/50`} />
                    <div className={`w-2 h-2 rounded-full bg-${stage.color}-500 shadow-[0_0_5px_currentColor]`} />
                </div>
                
                {/* Permanent Neon Trim at bottom */}
                <div className={`absolute bottom-0 left-[20%] right-[20%] h-[2px] bg-${stage.color}-500 blur-[2px] opacity-80`} />
           </div>
           
           {/* Side Stabilizers (Feet) */}
           <div className={`absolute bottom-0 -left-6 w-16 h-12 bg-[#0f172a] rounded-tl-full border-t border-l border-${stage.color}-900/50 skew-x-12 shadow-lg`} />
           <div className={`absolute bottom-0 -right-6 w-16 h-12 bg-[#0f172a] rounded-tr-full border-t border-r border-${stage.color}-900/50 -skew-x-12 shadow-lg`} />

           {/* Floor Glow - ALWAYS ON */}
           <div className={`absolute -bottom-8 left-1/2 -translate-x-1/2 w-[120%] h-20 bg-${stage.color}-500/20 blur-3xl rounded-full pointer-events-none transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-60'}`} />
      </div>

      {/* --- CONNECTION CABLES (Horizontal) --- */}
      {stage.id < 11 && (
        <div className="absolute top-[170px] -translate-y-1/2 left-full w-[100px] h-12 flex items-center justify-center z-0">
             {/* Main Tube */}
             <div className="w-full h-10 bg-slate-900 rounded-lg border-y border-slate-700 overflow-hidden relative shadow-xl z-10">
                 {/* Glass Reflection */}
                 <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent" />
                 
                 {/* Inner Flow */}
                 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNCIgaGVpZ2h0PSI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxjaXJjbGUgY3g9IjIiIGN5PSIyIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-20" />
                 
                 {isCompleted && (
                     <motion.div 
                        className={`absolute inset-0 bg-gradient-to-r from-transparent via-${stage.color}-500/50 to-transparent blur-sm`}
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                     />
                 )}
             </div>
             
             {/* Connector Rings */}
             <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-2 h-14 bg-slate-700 rounded shadow-lg z-20 border border-${stage.color}-900/50`} />
             <div className={`absolute right-1 top-1/2 -translate-y-1/2 w-2 h-14 bg-slate-700 rounded shadow-lg z-20 border border-${stage.color}-900/50`} />
        </div>
      )}

    </motion.div>
  );
};

export function FactoryAssemblyLine() {
  const [showIntake, setShowIntake] = useState(true);
  const [projectData, setProjectData] = useState<any>({});
  const [currentStage, setCurrentStage] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false); // Start paused until intake
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isXray, setIsXray] = useState(false);
  const [systemLoad, setSystemLoad] = useState(32);
  const [progress, setProgress] = useState(0);
  const [activeModalStage, setActiveModalStage] = useState<any>(null);
  const [completedStages, setCompletedStages] = useState<Record<number, boolean>>({});
  const [showRequirementsConsole, setShowRequirementsConsole] = useState(false);
  const [showMonitor, setShowMonitor] = useState(false);
  const [isConsoleExpanded, setIsConsoleExpanded] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to center the current stage/package
  useEffect(() => {
    if (scrollContainerRef.current) {
      const cardWidth = 360;
      const gap = 96;
      const offset = 80; // Matches START_OFFSET in Capsule
      
      // Calculate the center position of the current card
      const cardCenter = offset + (currentStage * (cardWidth + gap)) + (cardWidth / 2);
      
      // Calculate scroll position to center that point in the container
      const containerWidth = scrollContainerRef.current.clientWidth;
      const scrollLeft = cardCenter - (containerWidth / 2);
      
      scrollContainerRef.current.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
      });
    }
  }, [currentStage]);

  const handleStartProject = (data: any) => {
    // Map Intake data to Project Data structure
    setProjectData((prev: any) => ({ 
        ...prev, 
        intake: data,
        // Pre-fill Stage 1 data from Intake
        1: {
            projectName: data.projectName,
            problemDescription: `Problema Principal: ${data.problemType}`,
            objectives: Array.isArray(data.businessGoal) ? data.businessGoal.join(', ') : data.businessGoal,
            stakeholders: data.targetUser
        }
    }));

    // Start the process but DO NOT mark Stage 1 as complete yet.
    // Instead, open the Requirements Console immediately for the user to review/generate.
    setShowIntake(false);
    setIsProcessing(true);
    setCurrentStage(0); // Ensure we are at Stage 1
    
    // Small delay to allow UI to transition before opening console
    setTimeout(() => {
        setShowRequirementsConsole(true);
    }, 500);
  };

  const handleOpenForm = (stage: any) => {
      // Special handler for Stage 1 (Project Identification) to open Requirements Console
      if (stage.id === 1) {
        setShowRequirementsConsole(true);
      } else {
        setActiveModalStage(stage);
      }
  };

  const [engineLogs, setEngineLogs] = useState<{stage: string, message: string, timestamp: string}[]>([]);
  const [isProcessingEngine, setIsProcessingEngine] = useState(false);

  const processStageWithEngine = async (stageId: number, data: any, shouldMarkComplete: boolean = false) => {
    setIsProcessingEngine(true);
    try {
      const response = await fetch(`http://localhost:3011/api/engine/process/${stageId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      
      if (result.success) {
        const stageName = STAGES.find(s => s.id === stageId)?.name || `Stage ${stageId}`;
        const logEntry = {
          stage: stageName,
          message: JSON.stringify(result.result, null, 2),
          timestamp: new Date().toLocaleTimeString()
        };
        setEngineLogs(prev => [logEntry, ...prev]);
        
        // Store intelligence in project data for future use
        setProjectData((prev: any) => ({ 
          ...prev, 
          [`intelligence_${stageId}`]: result.result 
        }));

        if (shouldMarkComplete) {
            setCompletedStages(prev => ({
                ...prev,
                [stageId]: true
            }));
        }
      }
    } catch (error) {
      console.error("Engine Connection Failed:", error);
      setEngineLogs(prev => [{
        stage: "ERROR",
        message: "Could not connect to Factory Engine. Is the server running?",
        timestamp: new Date().toLocaleTimeString()
      }, ...prev]);
    } finally {
      setIsProcessingEngine(false);
    }
  };

  // --- AUTOMATED PRODUCTION LINE LOGIC ---
  useEffect(() => {
    // Check if we are at a stage that needs automation (Stage 2+)
    // And ensure the previous stage is complete (which it must be for currentStage to have advanced)
    // And ensure THIS stage is not yet complete.
    if (isProcessing && currentStage > 0) {
        const stageId = STAGES[currentStage].id;
        
        if (!completedStages[stageId] && !isProcessingEngine) {
            // Trigger automation with a slight delay for visual pacing
            const timer = setTimeout(() => {
                // Pass empty data or derive from previous stages if needed. 
                // The Server Engine uses the accumulated ProjectState, so sending empty {} is fine for automated steps.
                processStageWithEngine(stageId, {}, true);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }
  }, [currentStage, isProcessing, completedStages, isProcessingEngine]);

  const handleStageComplete = (stageId: number, data: any) => {
    setProjectData((prev: any) => ({ ...prev, [stageId]: data }));
    setCompletedStages(prev => ({
      ...prev,
      [stageId]: true
    }));
    setActiveModalStage(null);
    
    // Trigger Engine Processing
    processStageWithEngine(stageId, data);
  };

   const handleDownloadDelivery = async () => {
    try {
        const projectName = projectData.intake?.projectName?.replace(/\s+/g, '-') || 'SoftwareProject';
        
        // 1. Gather files
        const files: Record<string, string> = {};

        // Add Factory Report
        const metadata = {
            project: projectData.intake,
            timestamp: new Date().toISOString(),
            version: "1.0.0",
            stages: STAGES.map(s => ({
                stage: s.name,
                data: projectData[s.id],
                intelligence: projectData[`intelligence_${s.id}`]
            }))
        };
        files['factory-report.json'] = JSON.stringify(metadata, null, 2);

        // Add Generated Code from Engine
        const generatedFiles = projectData[`intelligence_6`]?.generatedFiles;
        if (generatedFiles) {
            Object.assign(files, generatedFiles);
        } else {
            // Fallback if no code generated (should not happen if flow is correct)
            console.warn("No generated code found in intelligence_6. Adding placeholder.");
            files['README.md'] = `# ${projectName}\nGenerated by Software Factory AI (Placeholder)`;
        }

        // 2. Request Backend Packaging
        const response = await fetch('http://localhost:3011/api/engine/package', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ files, projectName })
        });

        if (!response.ok) throw new Error("Backend packaging failed");

        // 3. Download Blob
        const blob = await response.blob();
        saveAs(blob, `${projectName}.zip`);

    } catch (error) {
        console.error("Failed to generate delivery package", error);
        alert("Error generando el paquete de entrega vía Backend. Ver consola.");
    }
   };

   const downloadRequirements = () => {
    const sections = STAGES.map(stage => {
        const data = projectData[stage.id];
        if (!data) return '';
        let section = `## ${stage.name}\n`;
        Object.entries(data).forEach(([key, value]) => {
            const label = stage.formConfig.fields.find(f => f.id === key)?.label || key;
            section += `- **${label}**: ${Array.isArray(value) ? value.join(', ') : value}\n`;
        });
        return section + '\n';
    }).join('');

    const content = `# REQUERIMIENTOS DEL PROYECTO: ${projectData.intake?.projectName || 'Nuevo Proyecto'}\n\n` +
        `**Tipo:** ${projectData.intake?.projectType || 'N/A'} | **Escala:** ${projectData.intake?.scale || 'N/A'}\n\n` +
        sections;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `REQUERIMIENTOS-${projectData.intake?.projectName || 'PROYECTO'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Simulation Loop
  useEffect(() => {
    if (isProcessing) {
      const interval = setInterval(() => {
        setSystemLoad(prev => Math.min(95, Math.max(20, prev + (Math.random() * 10 - 5))));
      }, 1000);

      const stageTimer = setInterval(() => {
        setCurrentStage(prev => {
          // Check if current stage is completed (form filled)
          const currentStageId = STAGES[prev].id;
          if (!completedStages[currentStageId]) {
            return prev; // Hold position until data is entered
          }

          // Automatic Loop: Stop at end
          if (prev >= STAGES.length - 1) {
            setIsProcessing(false); // Stop the factory
            return prev;
          }
          return prev + 1;
        });
      }, 3000); 

      return () => {
        clearInterval(interval);
        clearInterval(stageTimer);
      };
    }
  }, [isProcessing, completedStages]);

  useEffect(() => {
    setProgress(((currentStage + 1) / STAGES.length) * 100);
  }, [currentStage]);

  const toggleProcessing = () => {
    setIsProcessing(!isProcessing);
  };

  const handleNewProject = () => {
    if (window.confirm("¿Estás seguro de que quieres iniciar un nuevo proyecto? Se perderá el progreso actual.")) {
        setIsProcessing(false);
        setProjectData({});
        setCompletedStages({});
        setCurrentStage(0);
        setEngineLogs([]);
        setShowIntake(true);
        setProgress(0);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0E27] text-white font-sans relative flex flex-col overflow-hidden selection:bg-blue-500/30">
      <div className="stars" />
      
      {showIntake ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0A0E27]">
           <div className="stars" />
           <IntakeForm onStart={handleStartProject} />
        </div>
      ) : (
        <>
          <Header 
            systemLoad={systemLoad} 
            onOpenSidebar={() => setSidebarOpen(true)} 
            onOpenMonitor={() => setShowMonitor(true)}
          />

          <RequirementsConsole 
            isOpen={showRequirementsConsole} 
            onClose={() => setShowRequirementsConsole(false)}
            onComplete={(payload) => {
              handleStageComplete(1, payload);
            }}
            projectData={projectData.intake}
            color={STAGES[0].color}
          />

          <main ref={scrollContainerRef} className="flex-1 relative flex items-center overflow-x-auto custom-scrollbar pt-20 pb-40 perspective-[2000px]">
            {/* Background Grid - Aesthetic */}
            <div className="fixed inset-0 pointer-events-none opacity-20" 
                 style={{ 
                   backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                   backgroundSize: '100px 100px',
                   transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) scale(2)'
                 }} 
            />

            <div className="flex items-center gap-24 pl-20 pr-[450px] min-w-max relative py-20 transform-style-3d">
              
              {/* FACTORY FLOOR PLATFORM */}
              <div className="absolute top-[calc(50%+205px)] -left-[50vw] -right-[50vw] h-[500px] bg-[#050914] border-t border-slate-700/50 z-0 pointer-events-none transform-style-3d overflow-hidden">
                   {/* Main Surface Gradient */}
                   <div className="absolute inset-0 bg-gradient-to-b from-[#0F172A] via-[#050914] to-black opacity-90" />
                   
                   {/* Floor Grid Pattern */}
                   <div className="absolute inset-0 opacity-20" 
                        style={{ 
                          backgroundImage: 'linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
                          backgroundSize: '100px 100px'
                        }} 
                   />

                   {/* Safety Hazard Strip */}
                   <div className="absolute top-0 w-full h-3 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,#fbbf24_20px,#fbbf24_40px)] opacity-10 mix-blend-overlay" />
                   
                   {/* Reflection Glow */}
                   <div className="absolute top-0 w-full h-32 bg-gradient-to-b from-blue-500/5 to-transparent blur-2xl" />
              </div>

              {/* Main Track Line Behind */}
              {/* <div className="absolute top-1/2 left-0 w-full h-2 bg-slate-800/50 -z-10 rounded-full backdrop-blur-sm border-y border-white/5" /> */}

              {STAGES.map((stage, index) => (
                <StationCard 
                  key={stage.id} 
                  stage={stage} 
                  isActive={isProcessing && currentStage === index}
                  isCompleted={currentStage > index || completedStages[stage.id]}
                  isWaiting={isProcessing && currentStage === index && !completedStages[stage.id]}
                  onOpenForm={handleOpenForm}
                />
              ))}

              {isProcessing && (
                <Capsule 
                  currentStage={currentStage} 
                  isXray={isXray}
                />
              )}

            </div>
          </main>

          {/* Factory Intelligence Console - Strategically Placed as HUD */}
          <div 
            className={`fixed right-6 top-24 bottom-48 bg-[#0F1419]/90 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden flex flex-col z-30 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-300 ease-in-out
              ${isConsoleExpanded ? 'w-96 translate-x-0 opacity-100' : 'w-12 h-12 rounded-full !bottom-auto !top-24 translate-x-0 opacity-100 cursor-pointer hover:scale-110'}
            `}
            onClick={() => !isConsoleExpanded && setIsConsoleExpanded(true)}
          >
            {/* Collapsed State Icon */}
            {!isConsoleExpanded && (
              <div className="w-full h-full flex items-center justify-center bg-slate-800 border border-slate-600 rounded-full shadow-lg group">
                <Terminal className="w-5 h-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                <div className="absolute right-full mr-2 px-2 py-1 bg-black/80 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                  Open Intelligence Feed
                </div>
              </div>
            )}

            {/* Expanded Content */}
            {isConsoleExpanded && (
              <>
                {/* Terminal Header */}
                <div className="bg-white/5 p-3 border-b border-white/10 flex items-center justify-between shrink-0">
                  <h3 className="text-xs font-bold text-white flex items-center gap-2 font-heading tracking-wider">
                    <Cpu className="w-4 h-4 text-purple-400" /> 
                    LIVE INTELLIGENCE FEED
                  </h3>
                  <div className="flex items-center gap-2">
                    {isProcessingEngine && (
                        <span className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-purple-500/10 border border-purple-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                          <span className="text-[10px] text-purple-300 font-bold">PROCESSING</span>
                        </span>
                    )}
                    <button 
                      onClick={(e) => { e.stopPropagation(); setIsConsoleExpanded(false); }}
                      className="p-1 rounded-md hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      title="Minimize Console"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Terminal Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs custom-scrollbar scroll-smooth">
                  {engineLogs.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2 opacity-50">
                      <Cpu className="w-8 h-8" />
                      <span>System Ready. Awaiting Input...</span>
                    </div>
                  )}
                  
                  {engineLogs.map((log, i) => (
                    <LogEntry key={i} log={log} />
                  ))}
                  <div ref={(el) => el?.scrollIntoView({ behavior: 'smooth' })} />
                </div>

                {/* Terminal Status Bar */}
                <div className="bg-black/40 p-2 border-t border-white/5 text-[10px] text-slate-500 flex justify-between items-center shrink-0">
                  <span>STATUS: {isProcessingEngine ? 'ACTIVE' : 'IDLE'}</span>
                  <span>MEM: 42%</span>
                </div>
              </>
            )}
          </div>

          {/* Global Progress Timeline */}
          <div className="h-1 bg-slate-800 relative">
            <motion.div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-[0_0_20px_#3b82f6]"
              animate={{ width: `${progress}%` }}
            />
          </div>

          {/* CONTROL MACHINE PANEL - Floating & Elevated - DIGITAL NEON STYLE */}
          <div className="fixed bottom-12 left-0 right-0 flex items-end justify-center z-50 pointer-events-none">
             {/* MAIN CONTROL DECK (PUPITRE) - Digital Interface */}
             <div className="flex items-end gap-12 relative z-20 bg-[#050505]/90 backdrop-blur-xl p-10 pb-6 rounded-[4rem] border border-cyan-500/30 shadow-[0_0_80px_rgba(6,182,212,0.2),inset_0_0_30px_rgba(6,182,212,0.05)] transform translate-y-4 justify-center group min-w-[900px] pointer-events-auto overflow-hidden">
               
               {/* Digital Scanning Line Effect */}
               <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,rgba(6,182,212,0.03)_50%,transparent_100%)] animate-[scan_4s_linear_infinite] pointer-events-none"></div>
               
               {/* Holographic Grid Overlay */}
               <div className="absolute inset-0 rounded-[4rem] overflow-hidden pointer-events-none opacity-20">
                  <div className="w-full h-full bg-[linear-gradient(rgba(6,182,212,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.2)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
               </div>

               {/* Corner Accents */}
               <div className="absolute top-8 left-10 w-4 h-4 border-t-2 border-l-2 border-cyan-400 rounded-tl-lg opacity-60"></div>
               <div className="absolute top-8 right-10 w-4 h-4 border-t-2 border-r-2 border-cyan-400 rounded-tr-lg opacity-60"></div>
               <div className="absolute bottom-6 left-10 w-4 h-4 border-b-2 border-l-2 border-cyan-400 rounded-bl-lg opacity-60"></div>
               <div className="absolute bottom-6 right-10 w-4 h-4 border-b-2 border-r-2 border-cyan-400 rounded-br-lg opacity-60"></div>

               {/* LEFT WING: Monitoring & System */}
               <div className="flex items-end gap-6 mb-4 relative z-10">
                  {/* Integrated Stats - Digital Display */}
                  <div className="flex flex-col gap-2 mr-4 bg-black/40 p-4 rounded-xl border border-cyan-900/50 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] backdrop-blur-sm group/stats hover:border-cyan-500/30 transition-colors">
                     <div className="flex items-center justify-between gap-6 border-b border-cyan-900/30 pb-2">
                       <span className="text-[10px] text-cyan-600/80 uppercase font-bold tracking-widest">Project Value</span>
                       <span className="text-sm font-mono font-bold text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] group-hover/stats:text-cyan-300 transition-colors">$12,450</span>
                     </div>
                     <div className="flex items-center justify-between gap-6">
                       <span className="text-[10px] text-cyan-600/80 uppercase font-bold tracking-widest">Est. Delivery</span>
                       <span className="text-sm font-mono font-bold text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.6)]">2h 15m</span>
                     </div>
                  </div>

                  <button 
                    onClick={handleNewProject}
                    className="group/btn relative w-16 h-16 rounded-xl bg-black/40 border border-slate-700/50 hover:border-cyan-500 hover:bg-cyan-950/20 shadow-[0_0_10px_rgba(0,0,0,0.5)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-95 transition-all duration-300 flex flex-col items-center justify-center gap-1 overflow-hidden"
                    title="Initialize New Sequence"
                  >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1),transparent)] opacity-0 group-hover/btn:opacity-100 transition-opacity"></div>
                    <RefreshCw className="w-6 h-6 text-slate-500 group-hover/btn:text-cyan-400 group-hover/btn:rotate-180 transition-all duration-500 relative z-10" />
                    <span className="text-[8px] font-bold text-slate-600 group-hover/btn:text-cyan-300 uppercase tracking-tighter relative z-10 font-mono">RESET</span>
                  </button>
               </div>

               {/* CENTER: PRIMARY IGNITION - Reactor Core Style */}
              <div className="relative group mb-12 z-30 mx-4">
                 
                 <button 
                   onClick={toggleProcessing}
                   className={`
                     relative w-40 h-40 rounded-full flex flex-col items-center justify-center border-2 transition-all duration-500 transform hover:scale-105 hover:shadow-[0_0_50px_rgba(6,182,212,0.6)]
                     ${!isProcessing 
                       ? 'bg-black/60 border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3),inset_0_0_20px_rgba(6,182,212,0.2)]' 
                       : 'bg-black/60 border-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.4),inset_0_0_30px_rgba(239,68,68,0.2)] animate-pulse'}
                   `}
                 >
                    {/* Inner Core Glow */}
                    <div className={`absolute inset-4 rounded-full blur-md transition-all duration-500 ${!isProcessing ? 'bg-cyan-500/20' : 'bg-red-500/20'}`}></div>
                    
                    {/* Rotating Rings (Digital) */}
                    <div className="absolute inset-2 rounded-full border border-cyan-500/20 border-t-cyan-400/80 animate-[spin_3s_linear_infinite]"></div>
                    <div className="absolute inset-6 rounded-full border border-cyan-500/20 border-b-cyan-400/80 animate-[spin_5s_linear_infinite_reverse]"></div>

                    {isProcessing ? (
                       <div className="relative z-10 flex flex-col items-center">
                         <Pause className="w-14 h-14 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] mb-2" />
                         <span className="text-[10px] font-mono font-bold text-red-400 tracking-[0.3em] uppercase drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">SYSTEM HALT</span>
                       </div>
                     ) : (
                       <div className="relative z-10 flex flex-col items-center">
                         <Play className="w-14 h-14 text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.8)] mb-2 ml-1" />
                         <span className="text-[10px] font-mono font-bold text-cyan-300 tracking-[0.3em] uppercase drop-shadow-[0_0_5px_rgba(34,211,238,0.8)]">ENGAGE</span>
                       </div>
                     )}
                 </button>
               </div>

               {/* RIGHT WING: Operations & Navigation */}
               <div className="flex items-end gap-6 mb-4 relative z-10">
                   {/* Operations Group */}
                   <div className="flex gap-3 bg-black/40 p-2 rounded-2xl border border-cyan-900/30 items-end h-full backdrop-blur-sm">
                      <button 
                        onClick={downloadRequirements}
                        className="group/btn relative w-16 h-16 rounded-xl bg-transparent border border-slate-700/30 hover:border-yellow-500/50 hover:bg-yellow-900/10 shadow-none hover:shadow-[0_0_15px_rgba(234,179,8,0.2)] active:scale-95 transition-all duration-300 flex flex-col items-center justify-center gap-1 overflow-hidden"
                        title="Download Requirements"
                      >
                        <Download className="w-5 h-5 text-slate-500 group-hover/btn:text-yellow-400 transition-colors duration-300" />
                        <span className="text-[8px] font-bold text-slate-600 group-hover/btn:text-yellow-200 uppercase tracking-wide font-mono transition-colors">LOG</span>
                      </button>

                      <button 
                        onClick={handleDownloadDelivery}
                        disabled={currentStage < STAGES.length - 1}
                        className={`
                          relative w-16 h-16 rounded-xl border active:scale-95 transition-all duration-300 flex flex-col items-center justify-center gap-1 overflow-hidden group/btn
                          ${currentStage === STAGES.length - 1 
                            ? 'bg-transparent border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/20 hover:shadow-[0_0_15px_rgba(34,211,238,0.3)]' 
                            : 'bg-transparent border-slate-800 text-slate-700 opacity-50 cursor-not-allowed'}
                        `}
                        title="Deploy Solution"
                      >
                        <Package className="w-5 h-5" />
                        <span className="text-[8px] font-bold uppercase tracking-wide font-mono">DEPLOY</span>
                      </button>
                   </div>

                   {/* Nav Joystick (Digital Orb) */}
                   <div className="flex flex-col items-center gap-2">
                      <div 
                        onClick={() => setSidebarOpen(true)}
                        className="w-16 h-16 rounded-full bg-black/40 border border-slate-700/50 hover:border-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] flex items-center justify-center cursor-pointer transition-all duration-300 group/joy backdrop-blur-md"
                        title="Open System Menu"
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-800/50 shadow-[0_0_10px_rgba(0,0,0,0.8)] group-hover/joy:bg-purple-500/20 group-hover/joy:shadow-[0_0_15px_rgba(168,85,247,0.6)] transition-all flex items-center justify-center">
                             <Menu className="w-4 h-4 text-slate-400 group-hover/joy:text-purple-300" />
                        </div>
                      </div>
                      <span className="text-[8px] font-bold text-slate-600 group-hover/joy:text-purple-400 uppercase tracking-wider font-mono transition-colors">MENU</span>
                   </div>
               </div>

             </div>
          </div>

          <Sidebar 
            isOpen={isSidebarOpen} 
            toggle={() => setSidebarOpen(false)} 
            config={{ xray: isXray, toggleXray: () => setIsXray(!isXray) }} 
          />

          {showMonitor && (
            <div className="fixed inset-0 z-[60] bg-[#0A0E27]/95 backdrop-blur-xl p-6 animate-in fade-in zoom-in-95 duration-300">
                <ProjectMonitor 
                    files={projectData.intelligence_6?.generatedFiles || {}}
                    projectName={projectData.intake?.projectName || 'Project'}
                    qualityReport={projectData.intelligence_7}
                    onClose={() => setShowMonitor(false)}
                />
            </div>
          )}

          {activeModalStage && (
            <ModalForm 
              stage={activeModalStage} 
              isOpen={!!activeModalStage} 
              onClose={() => setActiveModalStage(null)} 
              onSave={(data: any) => handleStageComplete(activeModalStage.id, data)}
              projectData={projectData}
            />
          )}
        </>
      )}
    </div>
  );
}
