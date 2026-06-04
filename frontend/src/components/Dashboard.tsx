import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { memoryService, agentService, automationService, alertService } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const layers = [
  { id: 1, name: 'Conectores de Datos', status: 'Activo', color: 'bg-blue-500' },
  { id: 2, name: 'Motor de Comprensión', status: 'Aprendiendo', color: 'bg-green-500' },
  { id: 3, name: 'Memoria Empresarial', status: 'Estable', color: 'bg-purple-500' },
  { id: 4, name: 'Motor de IA (Cerebro)', status: 'Online', color: 'bg-red-500' },
  { id: 5, name: 'Analizador de BD', status: 'Mapeando', color: 'bg-orange-500' },
  { id: 6, name: 'Simulación Estratégica', status: 'Listo', color: 'bg-teal-500' },
  { id: 7, name: 'Sistema de Automatización', status: 'Supervisado', color: 'bg-indigo-500' },
  { id: 8, name: 'Secretaria y Agentes', status: 'Activo', color: 'bg-pink-500' },
];

const healthData = [
  { name: 'Lun', valor: 65 },
  { name: 'Mar', valor: 68 },
  { name: 'Mie', valor: 75 },
  { name: 'Jue', valor: 72 },
  { name: 'Vie', valor: 85 },
  { name: 'Sab', valor: 82 },
  { name: 'Dom', valor: 90 },
];

export const Dashboard: React.FC = () => {
  const { data: memories } = useQuery({
    queryKey: ['memories'],
    queryFn: () => memoryService.getMemories(),
  });

  const { data: agents } = useQuery({
    queryKey: ['agents'],
    queryFn: () => agentService.getAgents(),
  });

  const { data: rules } = useQuery({
    queryKey: ['rules'],
    queryFn: () => automationService.getRules(),
  });

  const { data: alerts } = useQuery({
    queryKey: ['alerts'],
    queryFn: () => alertService.getAlerts(),
  });

  const learningMemories = (memories as any)?.filter((m: any) => m.type === 'LEARNING').slice(0, 3) || [];
  const unreadAlerts = (alerts as any)?.filter((a: any) => !a.isRead) || [];

  return (
    <div className="p-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Control Inteligente</h1>
        <div className="flex items-center space-x-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
          </span>
          <span className="text-sm font-bold text-green-600 uppercase">Sistema Online</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {layers.map((layer) => (
          <div key={layer.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
            <div>
              <span className={`inline-block w-3 h-3 rounded-full ${layer.color} mr-2`}></span>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Capa {layer.id}</h3>
              <p className="text-lg font-bold text-gray-800 mt-1">{layer.name}</p>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400">Estado</span>
              <span className="text-xs font-bold px-2 py-1 bg-gray-50 rounded text-gray-600">{layer.status}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-400 uppercase mb-1">Memoria</p>
          <div className="flex items-baseline space-x-2">
            <p className="text-3xl font-bold text-blue-600">{(memories as any)?.length || 0}</p>
            <span className="text-xs text-blue-400 font-bold">+2 hoy</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">Decisiones y eventos registrados</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-400 uppercase mb-1">Agentes</p>
          <p className="text-3xl font-bold text-green-600">{(agents as any)?.length || 0}</p>
          <p className="text-xs text-gray-400 mt-1">Especialistas IA coordinados</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-400 uppercase mb-1">Alertas Proactivas</p>
          <p className={`text-3xl font-bold ${unreadAlerts.length > 0 ? 'text-red-600' : 'text-slate-600'}`}>
            {unreadAlerts.length}
          </p>
          <p className="text-xs text-gray-400 mt-1">Pendientes de revisión</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
          <h2 className="text-xl font-bold mb-6">Salud Empresarial (Smart Index)</h2>
          <div className="flex-1 min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthData}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis hide domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="valor" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-blue-600 uppercase">Análisis de Tendencia</p>
              <p className="text-sm text-blue-800 font-medium">Crecimiento estructural detectado (+12% esta semana)</p>
            </div>
            <span className="text-2xl">📈</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Alertas Recientes del Cerebro</h2>
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
            {unreadAlerts.length > 0 ? unreadAlerts.map((a: any) => (
              <div key={a.id} className={`p-4 rounded-lg border-l-4 ${
                a.severity === 'CRITICAL' ? 'bg-red-50 border-red-500' :
                a.severity === 'WARNING' ? 'bg-yellow-50 border-yellow-500' : 'bg-blue-50 border-blue-500'
              }`}>
                <div className="flex justify-between items-start">
                  <p className="text-sm font-bold text-slate-800">{a.title}</p>
                  <span className="text-[10px] text-gray-400">{new Date(a.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{a.description}</p>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center py-12 text-gray-400">
                <div className="text-4xl mb-2">🛡️</div>
                <p className="text-sm">No hay alertas críticas en este momento.</p>
                <p className="text-xs">El sistema monitorea tu operación 24/7.</p>
              </div>
            )}
          </div>

          <h2 className="text-xl font-bold mb-4 mt-8">Aprendizaje del Sistema</h2>
          <div className="space-y-3">
            {learningMemories.length > 0 ? learningMemories.map((m: any) => (
              <div key={m.id} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-lg">
                <span className="text-lg">💡</span>
                <div>
                  <p className="text-sm font-bold text-slate-700">{m.title}</p>
                  <p className="text-xs text-slate-500 line-clamp-1">{m.content}</p>
                </div>
              </div>
            )) : (
              <p className="text-xs text-gray-400 italic px-2">Esperando nuevos aprendizajes...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
