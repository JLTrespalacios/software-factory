import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Box, Globe, Smartphone, Server, Cloud, Database, Cpu, Target, Users, TrendingUp, Lightbulb, Briefcase, Rocket } from 'lucide-react';

interface IntakeFormProps {
  onStart: (data: any) => void;
}

export const IntakeForm: React.FC<IntakeFormProps> = ({ onStart }) => {
  const [projectName, setProjectName] = useState('');
  const [projectType, setProjectType] = useState<string | null>(null);
  const [problemType, setProblemType] = useState<string | null>(null);
  const [targetUser, setTargetUser] = useState<string | null>(null);
  const [businessGoal, setBusinessGoal] = useState<string[]>([]);
  const [marketModel, setMarketModel] = useState<string | null>(null);
  const [innovationLevel, setInnovationLevel] = useState<string | null>(null);

  const toggleBusinessGoal = (goal: string) => {
    setBusinessGoal(prev => 
      prev.includes(goal) ? prev.filter(g => g !== goal) : [...prev, goal]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectName && projectType && problemType && targetUser && businessGoal.length > 0 && marketModel && innovationLevel) {
      onStart({ 
        projectName, 
        projectType, 
        problemType,
        targetUser,
        businessGoal,
        marketModel,
        innovationLevel
      });
    }
  };

  const isFormValid = projectName && projectType && problemType && targetUser && businessGoal.length > 0 && marketModel && innovationLevel;

  return (
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative z-50 w-full max-w-4xl max-h-[90vh] overflow-y-auto custom-scrollbar"
    >
      {/* Glass Panel */}
      <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] -z-10" />
      
      {/* Decorator Lines */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-cyan-500 rounded-tl-lg pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-cyan-500 rounded-br-lg pointer-events-none" />

      <form onSubmit={handleSubmit} className="relative p-8 space-y-8 bg-[#0F172A] rounded-2xl border border-slate-700">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
            <Box className="w-8 h-8 text-cyan-400" />
            INTAKE MACHINE V2.0
          </h2>
          <p className="text-slate-400 text-sm tracking-widest uppercase mt-2">Configuración Avanzada de Estrategia de Producto</p>
          <button 
            type="button"
            onClick={() => {
                setProjectName('Factory Demo App');
                setProjectType('saas');
                setProblemType('Automatizar Procesos');
                setTargetUser('b2b_corp');
                setBusinessGoal(['Optimizar Ops', 'Escalar Negocio']);
                setMarketModel('Producto Propio');
                setInnovationLevel('disruptive');
            }}
            className="mt-4 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs rounded border border-slate-600 transition-colors"
          >
            [DEV] Cargar Datos Demo
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* 1. TIPO DE PRODUCTO */}
          <div className="space-y-3">
            <label className="text-xs text-blue-400 font-mono uppercase font-bold flex items-center gap-2">
              <Box className="w-4 h-4" /> 1. Tipo de Producto (Arquitectura)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'web', icon: Globe, label: 'Web App' },
                { id: 'mobile', icon: Smartphone, label: 'Mobile App' },
                { id: 'api', icon: Server, label: 'API / Backend' },
                { id: 'saas', icon: Cloud, label: 'SaaS Platform' },
                { id: 'internal', icon: Database, label: 'Software Interno' },
                { id: 'mvp', icon: Rocket, label: 'Prototipo / MVP' }
              ].map((type) => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setProjectType(type.id)}
                  className={`flex items-center gap-2 p-3 rounded-lg border text-left transition-all ${
                    projectType === type.id 
                      ? 'bg-blue-500/20 border-blue-500 text-blue-300 shadow-[0_0_10px_rgba(59,130,246,0.3)]' 
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:border-slate-500 hover:text-slate-200'
                  }`}
                >
                  <type.icon className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-bold">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. PROBLEMA PRINCIPAL */}
          <div className="space-y-3">
            <label className="text-xs text-orange-400 font-mono uppercase font-bold flex items-center gap-2">
              <Target className="w-4 h-4" /> 2. Problema a Resolver
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Aumentar Ventas', 'Reducir Costos', 'Automatizar Procesos', 
                'Mejorar UX Cliente', 'Cumplimiento Legal', 'Análisis de Datos',
                'Escalabilidad', 'Innovación'
              ].map((prob) => (
                <button
                  key={prob}
                  type="button"
                  onClick={() => setProblemType(prob)}
                  className={`p-2 rounded-lg border text-xs font-medium transition-all ${
                    problemType === prob
                      ? 'bg-orange-500/20 border-orange-500 text-orange-300'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {prob}
                </button>
              ))}
            </div>
          </div>

          {/* 3. USUARIO FINAL */}
          <div className="space-y-3">
            <label className="text-xs text-red-400 font-mono uppercase font-bold flex items-center gap-2">
              <Users className="w-4 h-4" /> 3. Usuario Final Objetivo
            </label>
            <select 
              value={targetUser || ''}
              onChange={(e) => setTargetUser(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all text-sm"
            >
              <option value="" disabled className="bg-slate-900 text-white">Seleccionar Segmento...</option>
              <option value="b2c_mass" className="bg-slate-900 text-white">Usuario Final Masivo (B2C)</option>
              <option value="b2b_corp" className="bg-slate-900 text-white">Empresa / Corporativo (B2B)</option>
              <option value="internal_team" className="bg-slate-900 text-white">Equipos Internos / Empleados</option>
              <option value="freelancers" className="bg-slate-900 text-white">Freelancers / Profesionales</option>
            </select>
            <div className="flex gap-2 mt-2">
               <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded">Volumen: 1k - 10k users</span>
               <span className="text-[10px] text-slate-500 bg-slate-800 px-2 py-1 rounded">Nivel: Intermedio</span>
            </div>
          </div>

          {/* 4. OBJETIVO DE NEGOCIO (Multi-select) */}
          <div className="space-y-3">
            <label className="text-xs text-yellow-400 font-mono uppercase font-bold flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> 4. Objetivos Estratégicos
            </label>
            <div className="flex flex-wrap gap-2">
              {['Ingresos Directos', 'Optimizar Ops', 'Validar Idea', 'Escalar Negocio', 'Digitalizar', 'Diferenciación'].map((goal) => (
                <button
                  key={goal}
                  type="button"
                  onClick={() => toggleBusinessGoal(goal)}
                  className={`px-3 py-1.5 rounded-full border text-[11px] font-bold transition-all ${
                    businessGoal.includes(goal)
                      ? 'bg-yellow-500/20 border-yellow-500 text-yellow-300'
                      : 'bg-slate-800/30 border-slate-700 text-slate-500 hover:border-slate-500'
                  }`}
                >
                  {goal}
                </button>
              ))}
            </div>
          </div>

          {/* 5. MODELO DE MERCADO */}
          <div className="space-y-3">
            <label className="text-xs text-purple-400 font-mono uppercase font-bold flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> 5. Modelo de Mercado
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'Producto Propio', 'Para Clientes', 'Licenciamiento / White-label', 
                'Software Interno', 'Startup Venture'
              ].map((model) => (
                <button
                  key={model}
                  type="button"
                  onClick={() => setMarketModel(model)}
                  className={`p-2 rounded-lg border text-xs font-medium text-left transition-all ${
                    marketModel === model
                      ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                      : 'bg-slate-800/50 border-slate-700 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {model}
                </button>
              ))}
            </div>
          </div>

          {/* 6. NIVEL DE INNOVACIÓN */}
          <div className="space-y-3">
            <label className="text-xs text-green-400 font-mono uppercase font-bold flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> 6. Nivel de Innovación
            </label>
            <div className="flex gap-2">
              {[
                { id: 'standard', label: 'Estándar' },
                { id: 'competitive', label: 'Competitivo' },
                { id: 'disruptive', label: 'Disruptivo' }
              ].map((level) => (
                <button
                  key={level.id}
                  type="button"
                  onClick={() => setInnovationLevel(level.id)}
                  className={`flex-1 py-2 rounded-lg border text-xs font-bold transition-all ${
                    innovationLevel === level.id
                      ? 'bg-green-500/20 border-green-500 text-green-300 shadow-[0_0_10px_rgba(34,197,94,0.3)]'
                      : 'bg-slate-800/50 border-slate-700 text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Project Name & Submit */}
        <div className="pt-6 border-t border-slate-700 space-y-4">
          <div className="space-y-2">
            <label className="text-xs text-slate-400 font-mono uppercase">Nombre del Proyecto</label>
            <input 
              type="text" 
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Ej: SuperApp FinTech 2026..."
              className="w-full bg-slate-900 border border-slate-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 transition-all"
            />
          </div>

          <button 
            type="submit"
            disabled={!isFormValid}
            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all text-lg tracking-widest ${
              isFormValid
                ? 'bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-[1.01] hover:shadow-[0_0_50px_rgba(59,130,246,0.7)]'
                : 'bg-slate-800 text-slate-600 cursor-not-allowed border border-slate-700'
            }`}
          >
            <Cpu className={`w-6 h-6 ${isFormValid ? 'animate-pulse' : ''}`} />
            {isFormValid ? 'INICIAR PROCESO DE FABRICACIÓN' : 'COMPLETE TODOS LOS CAMPOS REQUERIDOS'}
          </button>
        </div>

      </form>
    </motion.div>
  );
};
