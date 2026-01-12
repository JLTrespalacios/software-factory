import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  CheckSquare, PieChart, Plus, Trash2, Download, X,
  ChevronRight, CheckCircle2, Loader2, Layers, FileWarning,
  ClipboardList, Zap
} from 'lucide-react';

interface RequirementsConsoleProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (result: any) => void;
  projectData: any;
  color?: string;
}

const API_URL = 'http://localhost:3011/api';

export const RequirementsConsole: React.FC<RequirementsConsoleProps> = ({ isOpen, onClose, onComplete, projectData, color = 'blue' }) => {
  const [activeTab, setActiveTab] = useState('requirements');
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [stakeholders, setStakeholders] = useState<any[]>([]);
  const [elicitation, setElicitation] = useState<any[]>([]);
  const [questions, setQuestions] = useState<any>({});
  const [requirements, setRequirements] = useState<any[]>([]);
  const [qaChecklist, setQaChecklist] = useState<any>({});
  const [techStack, setTechStack] = useState<any>(null);
  const [selectedStack, setSelectedStack] = useState<any>({ languages: [], frameworks: [], tools: [], cloud: [] });
  const [methodologies, setMethodologies] = useState<any[]>([]);
  const [selectedMethodology, setSelectedMethodology] = useState<string | null>(null);
  const [summary, setSummary] = useState<any>(null);

  // Forms State
  const [shForm, setShForm] = useState({ name: '', role: '', interest: '', raci: 'Informed', comments: '' });
  const [showShForm, setShowShForm] = useState(false);
  
  const [actForm, setActForm] = useState({ activity: '', technique: '', participants: '', duration: '', tool: '', deliverable: '' });
  const [showActForm, setShowActForm] = useState(false);

  const [reqForm, setReqForm] = useState({ type: 'Funcional', title: '', description: '', priority: 'MUST', source: '', acceptanceCriteria: '' });
  const [showReqForm, setShowReqForm] = useState(false);

  // Initial Fetch
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [shRes, elRes, qRes, reqRes, qaRes, techRes, selStackRes, methRes, selMethRes, sumRes] = await Promise.all([
        fetch(`${API_URL}/stakeholders`),
        fetch(`${API_URL}/elicitation`),
        fetch(`${API_URL}/questions`),
        fetch(`${API_URL}/requirements`),
        fetch(`${API_URL}/qa`),
        fetch(`${API_URL}/tech-stack`),
        fetch(`${API_URL}/selected-stack`),
        fetch(`${API_URL}/methodologies`),
        fetch(`${API_URL}/selected-methodology`),
        fetch(`${API_URL}/summary`)
      ]);
      
      setStakeholders(await shRes.json());
      setElicitation(await elRes.json());
      setQuestions(await qRes.json());
      setRequirements(await reqRes.json());
      setQaChecklist(await qaRes.json());
      setTechStack(await techRes.json());
      setSelectedStack(await selStackRes.json());
      setMethodologies(await methRes.json());
      const selMeth = await selMethRes.json();
      setSelectedMethodology(selMeth.id);
      setSummary(await sumRes.json());
    } catch (err) {
      console.error("Failed to fetch RE data", err);
    } finally {
      setLoading(false);
    }
  };

  // --- Handlers ---

  const toggleTech = async (category: string, item: string) => {
    const currentList = selectedStack[category] || [];
    const newList = currentList.includes(item) 
        ? currentList.filter((i: string) => i !== item)
        : [...currentList, item];
    
    const newStack = { ...selectedStack, [category]: newList };
    setSelectedStack(newStack); // Optimistic

    await fetch(`${API_URL}/selected-stack`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [category]: newList })
    });
    
    // Refresh summary
    const sumRes = await fetch(`${API_URL}/summary`);
    setSummary(await sumRes.json());
  };

  const selectMethodology = async (id: string) => {
    setSelectedMethodology(id); // Optimistic
    await fetch(`${API_URL}/selected-methodology`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });
    // Refresh summary
    const sumRes = await fetch(`${API_URL}/summary`);
    setSummary(await sumRes.json());
  };

  const addStakeholder = async () => {
    if (!shForm.name) return;
    await fetch(`${API_URL}/stakeholders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(shForm)
    });
    setShForm({ name: '', role: '', interest: '', raci: 'Informed', comments: '' });
    setShowShForm(false);
    fetchData();
  };

  const deleteStakeholder = async (id: string) => {
    await fetch(`${API_URL}/stakeholders/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const addActivity = async () => {
    if (!actForm.activity) return;
    await fetch(`${API_URL}/elicitation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actForm)
    });
    setActForm({ activity: '', technique: '', participants: '', duration: '', tool: '', deliverable: '' });
    setShowActForm(false);
    fetchData();
  };

  const deleteActivity = async (id: string) => {
    await fetch(`${API_URL}/elicitation/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const updateAnswer = async (category: string, id: string, answer: string) => {
    // Optimistic update
    setQuestions((prev: any) => ({
        ...prev,
        [category]: prev[category].map((q: any) => q.id === id ? { ...q, answer } : q)
    }));

    await fetch(`${API_URL}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, id, answer })
    });
    // Background refresh summary logic if needed
  };

  const addRequirement = async () => {
    if (!reqForm.title) return;
    await fetch(`${API_URL}/requirements`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reqForm)
    });
    setReqForm({ type: 'Funcional', title: '', description: '', priority: 'MUST', source: '', acceptanceCriteria: '' });
    setShowReqForm(false);
    fetchData(); // This will also update summary
  };

  const deleteRequirement = async (id: string) => {
    await fetch(`${API_URL}/requirements/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const toggleQaItem = async (key: string) => {
    const newVal = !qaChecklist[key];
    setQaChecklist({...qaChecklist, [key]: newVal}); // Optimistic
    
    await fetch(`${API_URL}/qa`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [key]: newVal })
    });
    // Refresh summary to update estimates based on QA
    const sumRes = await fetch(`${API_URL}/summary`);
    setSummary(await sumRes.json());
  };


    const handleGenerateResults = async () => {
    setLoading(true);
    try {
        const payload = {
            ...projectData?.intake,
            stakeholders,
            elicitation,
            questions,
            requirements,
            qaChecklist,
            selectedStack,
            selectedMethodology
        };

        // Pass the payload to parent to trigger Engine
        if (onComplete) {
            onComplete(payload);
        }
        onClose();

    } catch (e) {
        console.error("Error preparing payload", e);
        alert('Failed to prepare data');
    } finally {
        setLoading(false);
    }
  };

  const handleAutoStart = async () => {
    setLoading(true);
    // Create default payload directly for automatic start
    const defaultPayload = {
        ...projectData?.intake,
        requirements: requirements.length > 0 ? requirements : [{ id: 'REQ-AUTO-1', title: 'Sistema Base', priority: 'MUST', type: 'Funcional', description: 'Generación automática de sistema completo.' }],
        stakeholders: stakeholders.length > 0 ? stakeholders : [{ id: 'SH-AUTO-1', name: 'Admin', role: 'Product Owner' }],
        selectedStack: selectedStack?.languages?.length > 0 ? selectedStack : { languages: ['TypeScript'], frameworks: ['React', 'Node.js'], cloud: ['AWS'], database: ['PostgreSQL'] },
        selectedMethodology: selectedMethodology || 'scrum'
    };
    
    // Simulate a small delay for "Initialization" effect
    await new Promise(r => setTimeout(r, 800));
    
    if (onComplete) {
        onComplete(defaultPayload);
    }
    onClose();
    // setLoading(false); // Component unmounts after onClose
  };

  const handleExportReport = () => {
    const report = {
        project: projectData?.intake?.projectName || 'Software Project',
        date: new Date().toISOString(),
        stakeholders,
        elicitation,
        questions,
        requirements,
        qaChecklist,
        selectedStack,
        selectedMethodology,
        summary
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "requirements_report.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!isOpen) return null;

  const TABS = [
    // { id: 'stakeholders', label: 'Stakeholders (RACI)', icon: Users },
    // { id: 'elicitation', label: 'Plan Elicitación', icon: ClipboardList },
    // { id: 'questions', label: 'Preguntas C-FR-D-Q-R', icon: MessageSquare },
    { id: 'requirements', label: 'Captura Requisitos', icon: FileText },
    { id: 'architecture', label: 'Arquitectura & Stack', icon: Layers },
    { id: 'methodology', label: 'Metodología', icon: CheckSquare },
    // { id: 'traceability', label: 'Trazabilidad', icon: LinkIcon },
    // { id: 'qa', label: 'Checklist QA', icon: CheckSquare },
    // { id: 'cr', label: 'Control Cambios', icon: FileWarning },
    { id: 'summary', label: 'Resumen Ejecutivo', icon: PieChart },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      
      <motion.div 
        className="relative w-full max-w-6xl h-[90vh] bg-[#0F1419] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
      >
        {/* Header */}
        <div className="h-16 border-b border-slate-700 flex items-center justify-between px-6 bg-[#161b22]">
          <div className="flex items-center gap-4">
            <div className={`p-2 bg-${color}-500/10 rounded-lg border border-${color}-500/20`}>
              <ClipboardList className={`w-6 h-6 text-${color}-400`} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">Ingeniería de Requerimientos</h2>
              <p className="text-xs text-slate-400 font-mono">Consola de Gestión Integral • {projectData?.intake?.projectName || 'Nuevo Proyecto'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-64 bg-[#161b22]/50 border-r border-slate-700 overflow-y-auto custom-scrollbar py-4 flex flex-col justify-between">
            <div className="space-y-1">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full px-6 py-3 flex items-center gap-3 text-sm font-medium transition-all border-l-2
                  ${activeTab === tab.id 
                    ? `bg-${color}-500/10 border-${color}-500 text-${color}-400` 
                    : 'border-transparent text-slate-400 hover:text-white hover:bg-slate-800'}
                `}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
            </div>

            <div className="p-4 border-t border-slate-700 mt-4 space-y-3">
               <button 
                  onClick={handleAutoStart}
                  className={`w-full py-3 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 rounded-lg font-bold transition-all flex items-center justify-center gap-2 group`}
                  title="Inicia la fábrica con valores predeterminados"
               >
                  <Zap className="w-5 h-5 group-hover:text-yellow-400" />
                  <span className="group-hover:text-yellow-400">Modo Automático</span>
               </button>

               <button 
                  onClick={handleGenerateResults}
                  className={`w-full py-3 bg-gradient-to-r from-${color}-600 to-${color}-500 hover:from-${color}-500 hover:to-${color}-400 text-white rounded-lg font-bold shadow-lg shadow-${color}-500/20 transition-all flex items-center justify-center gap-2`}
               >
                  <CheckCircle2 className="w-5 h-5" />
                  Generar y Enviar a Producción
               </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-[#0d1117] overflow-y-auto custom-scrollbar p-8">
            {loading ? (
                <div className="flex h-full items-center justify-center">
                    <Loader2 className={`w-10 h-10 text-${color}-500 animate-spin`} />
                </div>
            ) : (
                <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                    className="max-w-5xl mx-auto"
                >
                    {activeTab === 'stakeholders' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">1. Registro de Stakeholders (RACI)</h3>
                                    <p className="text-slate-400 text-sm">Identificación y clasificación de interesados clave.</p>
                                </div>
                                <button 
                                    onClick={() => setShowShForm(!showShForm)}
                                    className={`flex items-center gap-2 px-4 py-2 bg-${color}-600 hover:bg-${color}-500 rounded-lg text-white text-sm font-medium transition-colors`}
                                >
                                    <Plus className="w-4 h-4" /> {showShForm ? 'Cancelar' : 'Añadir Stakeholder'}
                                </button>
                            </div>

                            {showShForm && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 mb-4 grid grid-cols-2 gap-4">
                                    <input placeholder="Nombre" className="bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm" value={shForm.name} onChange={e => setShForm({...shForm, name: e.target.value})} />
                                    <input placeholder="Rol / Cargo" className="bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm" value={shForm.role} onChange={e => setShForm({...shForm, role: e.target.value})} />
                                    <input placeholder="Interés Principal" className="bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm" value={shForm.interest} onChange={e => setShForm({...shForm, interest: e.target.value})} />
                                    <select className="bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm" value={shForm.raci} onChange={e => setShForm({...shForm, raci: e.target.value})}>
                                        <option>Responsible</option>
                                        <option>Accountable</option>
                                        <option>Consulted</option>
                                        <option>Informed</option>
                                    </select>
                                    <input placeholder="Comentarios" className="bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm col-span-2" value={shForm.comments} onChange={e => setShForm({...shForm, comments: e.target.value})} />
                                    <button onClick={addStakeholder} className="col-span-2 bg-green-600 hover:bg-green-500 text-white p-2 rounded text-sm font-bold">Guardar</button>
                                </motion.div>
                            )}

                            <div className="border border-slate-700 rounded-lg overflow-hidden">
                                <table className="w-full text-left text-sm text-slate-300">
                                    <thead className="bg-slate-800 text-slate-200 font-bold">
                                        <tr>
                                            <th className="p-4 border-b border-slate-700">ID</th>
                                            <th className="p-4 border-b border-slate-700">Nombre</th>
                                            <th className="p-4 border-b border-slate-700">Rol / Cargo</th>
                                            <th className="p-4 border-b border-slate-700">Interés</th>
                                            <th className="p-4 border-b border-slate-700">RACI</th>
                                            <th className="p-4 border-b border-slate-700">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {stakeholders.map(sh => (
                                            <tr key={sh.id} className="bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                                                <td className="p-4 font-mono text-xs">{sh.id}</td>
                                                <td className="p-4">{sh.name}</td>
                                                <td className="p-4">{sh.role}</td>
                                                <td className="p-4">{sh.interest}</td>
                                                <td className="p-4"><span className="px-2 py-1 bg-slate-700 rounded text-xs font-bold">{sh.raci}</span></td>
                                                <td className="p-4">
                                                    <button onClick={() => deleteStakeholder(sh.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'elicitation' && (
                        <div className="space-y-6">
                             <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">2. Plan de Elicitación</h3>
                                    <p className="text-slate-400 text-sm">Agenda de actividades.</p>
                                </div>
                                <button 
                                    onClick={() => setShowActForm(!showActForm)}
                                    className={`flex items-center gap-2 px-4 py-2 bg-${color}-600 hover:bg-${color}-500 rounded-lg text-white text-sm font-medium transition-colors`}
                                >
                                    <Plus className="w-4 h-4" /> {showActForm ? 'Cancelar' : 'Añadir Actividad'}
                                </button>
                            </div>

                            {showActForm && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 mb-4 grid grid-cols-2 gap-4">
                                    <input placeholder="Actividad" className="bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm" value={actForm.activity} onChange={e => setActForm({...actForm, activity: e.target.value})} />
                                    <input placeholder="Técnica" className="bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm" value={actForm.technique} onChange={e => setActForm({...actForm, technique: e.target.value})} />
                                    <input placeholder="Participantes" className="bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm" value={actForm.participants} onChange={e => setActForm({...actForm, participants: e.target.value})} />
                                    <input placeholder="Duración" className="bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm" value={actForm.duration} onChange={e => setActForm({...actForm, duration: e.target.value})} />
                                    <input placeholder="Herramienta" className="bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm" value={actForm.tool} onChange={e => setActForm({...actForm, tool: e.target.value})} />
                                    <input placeholder="Entregable" className="bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm" value={actForm.deliverable} onChange={e => setActForm({...actForm, deliverable: e.target.value})} />
                                    <button onClick={addActivity} className={`col-span-2 bg-${color}-600 hover:bg-${color}-500 text-white p-2 rounded text-sm font-bold`}>Guardar</button>
                                </motion.div>
                            )}

                            <div className="border border-slate-700 rounded-lg overflow-hidden">
                                <table className="w-full text-left text-sm text-slate-300">
                                    <thead className="bg-slate-800 text-slate-200 font-bold">
                                        <tr>
                                            <th className="p-4 border-b border-slate-700">Actividad</th>
                                            <th className="p-4 border-b border-slate-700">Técnica</th>
                                            <th className="p-4 border-b border-slate-700">Participantes</th>
                                            <th className="p-4 border-b border-slate-700">Duración</th>
                                            <th className="p-4 border-b border-slate-700">Entregable</th>
                                            <th className="p-4 border-b border-slate-700">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {elicitation.map(act => (
                                            <tr key={act.id} className="hover:bg-slate-800/50 transition-colors">
                                                <td className="p-4 font-medium text-white">{act.activity}</td>
                                                <td className="p-4">{act.technique}</td>
                                                <td className="p-4">{act.participants}</td>
                                                <td className="p-4">{act.duration}</td>
                                                <td className={`p-4 text-${color}-400`}>{act.deliverable}</td>
                                                <td className="p-4">
                                                    <button onClick={() => deleteActivity(act.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'questions' && (
                        <div className="space-y-8">
                            <div className="mb-6">
                                <h3 className="text-2xl font-bold text-white mb-2">3. Bloque de Preguntas C-FR-D-Q-R</h3>
                                <p className="text-slate-400 text-sm">Entrevista estructurada. Tus respuestas influirán en la estimación final.</p>
                            </div>
                            <div className="grid grid-cols-1 gap-6 pb-10">
                                {Object.entries(questions).map(([category, qs]: [string, any]) => (
                                    <div key={category} className={`border rounded-xl p-5 border-${color}-500/30 bg-${color}-500/5`}>
                                        <h4 className={`text-lg font-bold mb-4 text-${color}-400`}>{category} - {
                                            category === 'C' ? 'Contexto' :
                                            category === 'FR' ? 'Funcionales' :
                                            category === 'D' ? 'Datos' :
                                            category === 'Q' ? 'Calidad' : 'Restricciones'
                                        }</h4>
                                        <ul className="space-y-4">
                                            {qs.map((q: any) => (
                                                <li key={q.id} className="space-y-2">
                                                    <p className="text-slate-300 text-sm font-medium">{q.text}</p>
                                                    <textarea 
                                                        className={`w-full bg-black/20 border border-white/10 rounded p-2 text-sm text-white focus:border-${color}-500 outline-none transition-colors`}
                                                        rows={2}
                                                        placeholder="Escribe la respuesta..."
                                                        defaultValue={q.answer}
                                                        onBlur={(e) => updateAnswer(category, q.id, e.target.value)}
                                                    />
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'requirements' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-2">4. Captura de Requisitos</h3>
                                    <p className="text-slate-400 text-sm">Registro formal. Impacta directamente en el costo y tiempo.</p>
                                </div>
                                <button 
                                    onClick={() => setShowReqForm(!showReqForm)}
                                    className={`flex items-center gap-2 px-4 py-2 bg-${color}-600 hover:bg-${color}-500 rounded-lg text-white text-sm font-medium transition-colors`}
                                >
                                    <Plus className="w-4 h-4" /> {showReqForm ? 'Cancelar' : 'Nuevo Requisito'}
                                </button>
                            </div>

                            {showReqForm && (
                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="bg-slate-800/50 p-4 rounded-lg border border-slate-700 mb-4 grid grid-cols-2 gap-4">
                                    <select className="bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm" value={reqForm.type} onChange={e => setReqForm({...reqForm, type: e.target.value})}>
                                        <option className="bg-slate-900 text-white">Funcional</option>
                                        <option className="bg-slate-900 text-white">No Funcional</option>
                                        <option className="bg-slate-900 text-white">Datos</option>
                                        <option className="bg-slate-900 text-white">Calidad</option>
                                        <option className="bg-slate-900 text-white">Restricción</option>
                                    </select>
                                    <select className="bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm" value={reqForm.priority} onChange={e => setReqForm({...reqForm, priority: e.target.value})}>
                                        <option className="bg-slate-900 text-white">MUST</option>
                                        <option className="bg-slate-900 text-white">SHOULD</option>
                                        <option className="bg-slate-900 text-white">COULD</option>
                                        <option className="bg-slate-900 text-white">WONT</option>
                                    </select>
                                    <input placeholder="Título Corto" className="col-span-2 bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm" value={reqForm.title} onChange={e => setReqForm({...reqForm, title: e.target.value})} />
                                    <textarea placeholder="Descripción detallada" className="col-span-2 bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm" rows={2} value={reqForm.description} onChange={e => setReqForm({...reqForm, description: e.target.value})} />
                                    <input placeholder="Fuente (Stakeholder)" className="bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm" value={reqForm.source} onChange={e => setReqForm({...reqForm, source: e.target.value})} />
                                    <textarea placeholder="Criterios de Aceptación" className="col-span-2 bg-slate-900 border border-slate-700 p-2 rounded text-white text-sm" rows={2} value={reqForm.acceptanceCriteria} onChange={e => setReqForm({...reqForm, acceptanceCriteria: e.target.value})} />
                                    
                                    <button onClick={addRequirement} className="col-span-2 bg-green-600 hover:bg-green-500 text-white p-2 rounded text-sm font-bold">Guardar Requisito</button>
                                </motion.div>
                            )}

                            <div className="border border-slate-700 rounded-lg overflow-x-auto">
                                <table className="w-full text-left text-sm text-slate-300 min-w-[1000px]">
                                    <thead className="bg-slate-800 text-slate-200 font-bold">
                                        <tr>
                                            <th className="p-4 border-b border-slate-700 w-24">ID</th>
                                            <th className="p-4 border-b border-slate-700 w-24">Tipo</th>
                                            <th className="p-4 border-b border-slate-700 w-48">Título</th>
                                            <th className="p-4 border-b border-slate-700 min-w-[200px]">Descripción</th>
                                            <th className="p-4 border-b border-slate-700 w-24">Prioridad</th>
                                            <th className="p-4 border-b border-slate-700 w-32">Fuente</th>
                                            <th className="p-4 border-b border-slate-700 w-24">Acción</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {requirements.map(req => (
                                            <tr key={req.id} className="bg-slate-900/50 hover:bg-slate-800/50 transition-colors">
                                                <td className={`p-4 font-mono text-xs text-${color}-400`}>{req.id}</td>
                                                <td className="p-4"><span className="px-2 py-1 bg-white/10 rounded text-xs font-bold">{req.type}</span></td>
                                                <td className="p-4 font-bold text-white">{req.title}</td>
                                                <td className="p-4 text-slate-400">{req.description}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                        req.priority === 'MUST' ? 'bg-red-500/20 text-red-400' :
                                                        req.priority === 'SHOULD' ? 'bg-orange-500/20 text-orange-400' :
                                                        'bg-blue-500/20 text-blue-400'
                                                    }`}>{req.priority}</span>
                                                </td>
                                                <td className="p-4 text-xs">{req.source}</td>
                                                <td className="p-4">
                                                    <button onClick={() => deleteRequirement(req.id)} className="text-red-400 hover:text-red-300"><Trash2 className="w-4 h-4" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'architecture' && techStack && (
                        <div className="space-y-8">
                            <h3 className="text-2xl font-bold text-white mb-2">Arquitectura y Tecnologías Clave</h3>
                            <p className="text-slate-400 text-sm">Selecciona las tecnologías obligatorias para el proyecto. Esto definirá los roles y costos.</p>

                            {/* Languages */}
                            <div className="space-y-4">
                                <h4 className={`text-lg font-semibold text-${color}-400 border-b border-${color}-500/20 pb-2`}>1. Lenguajes de Programación</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {Object.entries(techStack.languages).map(([subcat, items]: [string, any]) => (
                                        <div key={subcat} className="bg-slate-800/30 p-4 rounded-lg border border-slate-700">
                                            <h5 className="text-sm font-bold text-slate-300 uppercase mb-3">{subcat}</h5>
                                            <div className="flex flex-wrap gap-2">
                                                {items.map((item: string) => (
                                                    <button
                                                        key={item}
                                                        onClick={() => toggleTech('languages', item)}
                                                        className={`px-3 py-1 rounded-full text-xs transition-all ${
                                                            selectedStack.languages?.includes(item)
                                                            ? `bg-${color}-500 text-white font-bold shadow-lg shadow-${color}-500/20`
                                                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                                        }`}
                                                    >
                                                        {item}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Frameworks */}
                            <div className="space-y-4">
                                <h4 className={`text-lg font-semibold text-${color}-400 border-b border-${color}-500/20 pb-2`}>2. Frameworks y Librerías</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {Object.entries(techStack.frameworks).map(([subcat, items]: [string, any]) => (
                                        <div key={subcat} className="bg-slate-800/30 p-4 rounded-lg border border-slate-700">
                                            <h5 className="text-sm font-bold text-slate-300 uppercase mb-3">{subcat}</h5>
                                            <div className="flex flex-wrap gap-2">
                                                {items.map((item: string) => (
                                                    <button
                                                        key={item}
                                                        onClick={() => toggleTech('frameworks', item)}
                                                        className={`px-3 py-1 rounded-full text-xs transition-all ${
                                                            selectedStack.frameworks?.includes(item)
                                                            ? `bg-${color}-500 text-white font-bold shadow-lg shadow-${color}-500/20`
                                                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                                        }`}
                                                    >
                                                        {item}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Cloud & DB */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h4 className={`text-lg font-semibold text-${color}-400 border-b border-${color}-500/20 pb-2`}>3. Cloud e Infraestructura</h4>
                                    <div className="space-y-4">
                                        {Object.entries(techStack.cloud).map(([subcat, items]: [string, any]) => (
                                            <div key={subcat}>
                                                <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">{subcat}</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {items.map((item: string) => (
                                                        <button
                                                            key={item}
                                                            onClick={() => toggleTech('cloud', item)}
                                                            className={`px-3 py-1 rounded-full text-xs transition-all ${
                                                                selectedStack.cloud?.includes(item)
                                                                ? `bg-${color}-500 text-white font-bold shadow-lg shadow-${color}-500/20`
                                                                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                                            }`}
                                                        >
                                                            {item}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className={`text-lg font-semibold text-${color}-400 border-b border-${color}-500/20 pb-2`}>4. Bases de Datos</h4>
                                    <div className="space-y-4">
                                        {Object.entries(techStack.databases).map(([subcat, items]: [string, any]) => (
                                            <div key={subcat}>
                                                <h5 className="text-xs font-bold text-slate-500 uppercase mb-2">{subcat}</h5>
                                                <div className="flex flex-wrap gap-2">
                                                    {items.map((item: string) => (
                                                        <button
                                                            key={item}
                                                            onClick={() => toggleTech('database', item)}
                                                            className={`px-3 py-1 rounded-full text-xs transition-all ${
                                                                selectedStack.database?.includes(item)
                                                                ? `bg-${color}-500 text-white font-bold shadow-lg shadow-${color}-500/20`
                                                                : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                                            }`}
                                                        >
                                                            {item}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            
                            {/* Tools & Others */}
                            <div className="space-y-4">
                                <h4 className={`text-lg font-semibold text-${color}-400 border-b border-${color}-500/20 pb-2`}>5. Herramientas y Especializados</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {['devops', 'testing', 'security', 'observability', 'ai', 'integration', 'documentation'].map(cat => (
                                        <div key={cat} className="bg-slate-800/30 p-4 rounded-lg border border-slate-700">
                                            <h5 className="text-sm font-bold text-slate-300 uppercase mb-3">{cat}</h5>
                                            <div className="flex flex-wrap gap-2">
                                                {techStack && techStack[cat] && techStack[cat].map ? techStack[cat].map((item: string) => (
                                                    <button
                                                        key={item}
                                                        onClick={() => toggleTech('tools', item)}
                                                        className={`px-3 py-1 rounded-full text-xs transition-all ${
                                                            selectedStack.tools?.includes(item)
                                                            ? `bg-${color}-500 text-white font-bold shadow-lg shadow-${color}-500/20`
                                                            : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
                                                        }`}
                                                    >
                                                        {item}
                                                    </button>
                                                )) : null}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'methodology' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white mb-2">Selección de Metodología</h3>
                            <p className="text-slate-400 text-sm">La metodología define el ritmo, los roles y los entregables del proyecto.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {methodologies.map(meth => (
                                    <motion.div
                                        key={meth.id}
                                        onClick={() => selectMethodology(meth.id)}
                                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                                            selectedMethodology === meth.id
                                                ? `border-${color}-500 bg-${color}-500/10 shadow-lg shadow-${color}-500/20`
                                                : 'border-slate-700 bg-slate-800/50 hover:border-slate-500'
                                        }`}
                                        whileHover={{ y: -5 }}
                                    >
                                        <h4 className="text-lg font-bold text-white">{meth.name}</h4>
                                        <p className="text-xs text-slate-400 mb-4">{meth.type}</p>
                                        <p className="text-sm text-slate-300 mb-4">{meth.description}</p>
                                        <div className="space-y-2">
                                            {meth.value.map((v: string) => (
                                                <div key={v} className="flex items-center gap-2 text-xs text-slate-400">
                                                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                                                    <span>{v}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'traceability' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white mb-2">5. Matriz de Trazabilidad</h3>
                            <div className="border border-slate-700 rounded-lg overflow-hidden">
                                <table className="w-full text-left text-sm text-slate-300">
                                    <thead className="bg-slate-800 text-slate-200 font-bold">
                                        <tr>
                                            <th className="p-4 border-b border-slate-700">Requisito</th>
                                            <th className="p-4 border-b border-slate-700">Origen</th>
                                            <th className="p-4 border-b border-slate-700">User Story</th>
                                            <th className="p-4 border-b border-slate-700">Test Cases</th>
                                            <th className="p-4 border-b border-slate-700">Código</th>
                                            <th className="p-4 border-b border-slate-700">Estado</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        {requirements && requirements.map(req => (
                                            <tr key={req.id}>
                                                <td className={`p-4 font-mono text-${color}-400`}>{req.id}: {req.title}</td>
                                                <td className="p-4">{req.source}</td>
                                                <td className="p-4 text-xs font-mono">{req.linkedUserStories || '-'}</td>
                                                <td className="p-4 text-xs font-mono">{req.linkedTestCases || '-'}</td>
                                                <td className="p-4 text-xs font-mono text-slate-500">{req.linkedCode || '-'}</td>
                                                <td className="p-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                                        req.status === 'Aprobado' ? 'bg-green-500/20 text-green-400' :
                                                        req.status === 'Implementado' ? `bg-${color}-500/20 text-${color}-400` :
                                                        'bg-yellow-500/20 text-yellow-400'
                                                    }`}>{req.status || 'Pendiente'}</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'qa' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white mb-2">6. Checklist de Calidad</h3>
                            <p className="text-slate-400 text-sm mb-4">Marca los criterios cumplidos. Esto afecta la estimación de riesgo y tiempo.</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {Object.entries(qaChecklist).map(([key, value]: [string, any]) => (
                                    <div 
                                        key={key} 
                                        onClick={() => toggleQaItem(key)}
                                        className={`p-4 border rounded-lg flex items-center gap-4 cursor-pointer transition-all ${
                                            value 
                                            ? 'bg-green-500/10 border-green-500/50' 
                                            : 'bg-slate-800/50 border-slate-700 hover:bg-slate-800'
                                        }`}
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                                            value ? 'bg-green-500 border-green-500' : 'border-slate-500'
                                        }`}>
                                            {value && <CheckCircle2 className="w-4 h-4 text-white" />}
                                        </div>
                                        <h4 className="text-white font-bold capitalize">{key}</h4>
                                        <span className={`ml-auto text-xs font-bold ${value ? 'text-green-400' : 'text-slate-500'}`}>
                                            {value ? 'CUMPLIDO' : 'PENDIENTE'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'cr' && (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-white mb-2">7. Control de Cambios</h3>
                            <div className="p-10 text-center border border-dashed border-slate-700 rounded-xl">
                                <FileWarning className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                                <p className="text-slate-400">No hay solicitudes de cambio pendientes.</p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'summary' && summary && (
                        <div className="space-y-8">
                            <div className="flex justify-between items-center">
                                <h3 className="text-2xl font-bold text-white">8. Resumen Ejecutivo y Estimación</h3>
                                <button 
                                    onClick={handleExportReport}
                                    className={`px-4 py-2 bg-${color}-600 rounded-lg text-white text-sm font-bold flex items-center gap-2 hover:bg-${color}-500 transition-colors`}
                                >
                                    <Download className="w-4 h-4" /> Exportar Informe
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                    <p className="text-slate-400 text-sm mb-1">Total Requisitos</p>
                                    <p className="text-4xl font-bold text-white">{summary.requirementsCount}</p>
                                </div>
                                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                    <p className="text-slate-400 text-sm mb-1">Costo Estimado</p>
                                    <p className="text-4xl font-bold text-green-400">${summary.estimatedCost.toLocaleString()}</p>
                                </div>
                                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                    <p className="text-slate-400 text-sm mb-1">Equipo Recomendado</p>
                                    <p className={`text-4xl font-bold text-${color}-400`}>{summary.recommendedTeam.length} <span className="text-lg text-slate-500">roles</span></p>
                                </div>
                            </div>

                            <div className="bg-slate-900/50 p-8 rounded-xl border border-slate-700">
                                <h4 className="text-xl font-bold text-white mb-6">Comparativa de Tiempo de Desarrollo</h4>
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-slate-400">Desarrollo Tradicional</span>
                                            <span className="text-white font-bold">{summary.traditionalWeeks} semanas</span>
                                        </div>
                                        <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                                            <div className="h-full bg-slate-600 w-full"></div>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className={`text-${color}-400 font-bold`}>Con Software Factory AI</span>
                                            <span className={`text-${color}-400 font-bold`}>{summary.estimatedWeeks} semanas (-40%)</span>
                                        </div>
                                        <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                                            <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(summary.estimatedWeeks / summary.traditionalWeeks) * 100}%` }}
                                                className={`h-full bg-${color}-500 shadow-[0_0_15px] shadow-${color}-500/50`}
                                            ></motion.div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700">
                                <h4 className="text-lg font-bold text-white mb-4">Roles Sugeridos</h4>
                                <div className="flex flex-wrap gap-2">
                                    {summary.recommendedTeam.map((role: string) => (
                                        <span key={role} className={`px-3 py-1 bg-${color}-500/10 border border-${color}-500/30 text-${color}-300 rounded-full text-sm`}>
                                            {role}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end pt-6 border-t border-slate-700">
                                <button
                                    onClick={() => {
                                        if (onComplete) {
                                            onComplete({
                                                requirementsId: `REQ-${Date.now()}`,
                                                domain: projectData?.intake?.projectType || 'General',
                                                constraints: ['time', 'budget'],
                                                riskLevel: 'Medium',
                                                summary: summary,
                                                raw: { requirements, stakeholders, techStack: selectedStack }
                                            });
                                        }
                                        onClose();
                                    }}
                                    className={`px-8 py-4 bg-gradient-to-r from-${color}-600 to-${color}-500 hover:from-${color}-500 hover:to-${color}-400 rounded-xl text-white font-bold text-lg shadow-lg shadow-${color}-500/30 flex items-center gap-3 transition-all transform hover:scale-105`}
                                >
                                    <Layers className="w-6 h-6" />
                                    ENVIAR A PRODUCCIÓN
                                    <ChevronRight className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    )}
                </motion.div>
                </AnimatePresence>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
