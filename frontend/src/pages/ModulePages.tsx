import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  memoryService,
  agentService,
  simulationService,
  dbAnalyzerService,
  automationService,
  communicationService,
  businessService,
  secretaryService,
  growthService,
  alertService
} from '../services/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

export const MemoryPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [type, setType] = useState('OPERATIONAL');
  const [tags, setTags] = useState('');

  const queryClient = useQueryClient();

  const { data: memories, isLoading, error } = useQuery({
    queryKey: ['memories'],
    queryFn: () => memoryService.getMemories(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => memoryService.createMemory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      setShowForm(false);
      setTitle('');
      setContent('');
      setTags('');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => memoryService.deleteMemory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({
      title,
      content,
      type,
      tags: tags.split(',').map(t => t.trim()).filter(t => t !== ''),
    });
  };

  return (
    <div className="p-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Memoria Empresarial</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-bold shadow-sm"
        >
          {showForm ? 'Cancelar' : '+ Nueva Entrada'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-blue-100">
          <h2 className="text-xl font-bold mb-4 text-slate-700">Registrar en Memoria</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Título</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                >
                  <option value="OPERATIONAL">Operativa</option>
                  <option value="STRATEGIC">Estratégica</option>
                  <option value="LEARNING">Aprendizaje</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contenido</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              ></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Etiquetas (separadas por coma)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="ventas, cliente, problema"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
              />
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors font-bold disabled:opacity-50"
            >
              {createMutation.isPending ? 'Guardando...' : 'Guardar en Memoria'}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Cargando memoria...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
          Error al cargar la memoria: {(error as Error).message}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(memories as any)?.map((entry: any) => (
            <div key={entry.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative group">
              <button
                onClick={() => { if(confirm('¿Eliminar esta entrada?')) deleteMutation.mutate(entry.id) }}
                className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                🗑️
              </button>
              <div className="flex justify-between items-start mb-4">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  entry.type === 'STRATEGIC' ? 'bg-purple-50 text-purple-600' :
                  entry.type === 'LEARNING' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {entry.type}
                </span>
                <span className="text-[10px] text-gray-400">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-800">{entry.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-4 leading-relaxed">{entry.content}</p>
              <div className="mt-4 flex flex-wrap gap-1">
                {entry.tags?.map((tag: string) => (
                  <span key={tag} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {(!memories || (memories as any).length === 0) && !showForm && (
            <div className="col-span-full py-24 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl bg-white">
              <div className="text-4xl mb-4">🧠</div>
              <p className="text-lg font-medium">No hay registros en la memoria aún.</p>
              <p className="text-sm">Empieza a registrar decisiones y eventos importantes.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const AgentsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('COORDINATOR');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: agents, isLoading, error } = useQuery({
    queryKey: ['agents'],
    queryFn: () => agentService.getAgents(),
  });

  const { data: tasks, isLoading: isLoadingTasks } = useQuery({
    queryKey: ['tasks', selectedAgentId],
    queryFn: () => agentService.getAgentTasks(selectedAgentId!),
    enabled: !!selectedAgentId,
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => agentService.createAgent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agents'] });
      setShowForm(false);
      setName('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate({ name, type });
  };

  return (
    <div className="p-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Agentes IA</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-bold shadow-sm"
        >
          {showForm ? 'Cancelar' : '+ Nuevo Agente'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-green-100">
          <h2 className="text-xl font-bold mb-4 text-slate-700">Contratar Agente IA</h2>
          <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Nombre del Agente</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Agente de Marketing"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
              />
            </div>
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-gray-700">Especialidad</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
              >
                <option value="COORDINATOR">Coordinador Central</option>
                <option value="MARKETING">Estratega de Marketing</option>
                <option value="COMMERCIAL">Asistente Comercial</option>
                <option value="FINANCIAL">Analista Financiero</option>
                <option value="OPERATIONAL">Gestor de Operaciones</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors font-bold disabled:opacity-50"
            >
              {createMutation.isPending ? 'Contratando...' : 'Contratar'}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <p>Cargando agentes...</p>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl">Error: {(error as Error).message}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-700">Tus Agentes</h2>
            {(agents as any)?.map((agent: any) => (
              <div
                key={agent.id}
                className={`bg-white p-4 rounded-xl shadow-sm border transition-all cursor-pointer ${
                  selectedAgentId === agent.id ? 'border-green-500 ring-2 ring-green-50' : 'border-gray-100'
                }`}
                onClick={() => setSelectedAgentId(agent.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-xl">
                      🤖
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">{agent.name}</h3>
                      <p className="text-xs text-gray-500">{agent.type}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                    agent.status === 'ACTIVE' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {agent.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[400px]">
            <h2 className="text-xl font-bold mb-4 text-slate-700">Registro de Tareas</h2>
            {!selectedAgentId ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <p>Selecciona un agente para ver su actividad.</p>
              </div>
            ) : isLoadingTasks ? (
              <p>Cargando tareas...</p>
            ) : (
              <div className="space-y-4">
                {(tasks as any)?.map((task: any) => (
                  <div key={task.id} className="border-b border-gray-50 pb-3">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-sm font-bold text-slate-800">{task.title}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        task.status === 'COMPLETED' ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'
                      }`}>
                        {task.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">{task.description}</p>
                    {task.result && (
                      <div className="mt-2 p-2 bg-gray-50 rounded text-[10px] font-mono text-gray-600 overflow-x-auto">
                        {JSON.stringify(task.result, null, 2)}
                      </div>
                    )}
                  </div>
                ))}
                {(!tasks || (tasks as any).length === 0) && (
                  <p className="text-sm text-gray-400 italic">No hay tareas registradas para este agente.</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const SimulationsPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [variables, setVariables] = useState('{\n  "precio_actual": 100,\n  "aumento_precio": 0.10\n}');
  const [selectedSimId, setSelectedSimId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: simulations, isLoading, error } = useQuery({
    queryKey: ['simulations'],
    queryFn: () => simulationService.getSimulations(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => simulationService.createSimulation(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] });
      setShowForm(false);
      setName('');
      setDescription('');
    },
  });

  const runMutation = useMutation({
    mutationFn: (id: string) => simulationService.runSimulation(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['simulations'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const vars = JSON.parse(variables);
      createMutation.mutate({ name, description, variables: vars });
    } catch (err) {
      alert('Variables debe ser un JSON válido');
    }
  };

  const selectedSim = (simulations as any)?.find((s: any) => s.id === selectedSimId);

  const chartData = selectedSim?.results ? [
    { name: 'Actual', valor: 100 },
    { name: 'Pesimista', valor: selectedSim.results.worst_case ? 95 : 90 },
    { name: 'Probable', valor: selectedSim.results.probable_case ? 110 : 105 },
    { name: 'Optimista', valor: selectedSim.results.best_case ? 125 : 120 },
  ] : [];

  return (
    <div className="p-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Simulación Estratégica</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors font-bold shadow-sm"
        >
          {showForm ? 'Cancelar' : '+ Nueva Simulación'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-teal-100">
          <h2 className="text-xl font-bold mb-4 text-slate-700">Crear Escenario de Simulación</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre del Escenario</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Aumento de Precios Q4"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 border"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Variables (JSON)</label>
              <textarea
                value={variables}
                onChange={(e) => setVariables(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 p-2 border font-mono text-sm"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full bg-teal-600 text-white py-2 rounded-md hover:bg-teal-700 transition-colors font-bold"
            >
              {createMutation.isPending ? 'Creando...' : 'Crear Escenario'}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <p>Cargando simulaciones...</p>
      ) : error ? (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl">Error: {(error as Error).message}</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold text-slate-700">Historial de Escenarios</h2>
            {(simulations as any)?.map((sim: any) => (
              <div
                key={sim.id}
                className={`bg-white p-4 rounded-xl shadow-sm border transition-all cursor-pointer ${
                  selectedSimId === sim.id ? 'border-teal-500 ring-2 ring-teal-50' : 'border-gray-100'
                }`}
                onClick={() => setSelectedSimId(sim.id)}
              >
                <h3 className="font-bold text-slate-800">{sim.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[10px] text-gray-400">{new Date(sim.createdAt).toLocaleDateString()}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    sim.status === 'COMPLETED' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {sim.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 min-h-[500px]">
            {selectedSim ? (
              <div className="h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">{selectedSim.name}</h2>
                    <p className="text-gray-500">{selectedSim.description}</p>
                  </div>
                  <button
                    onClick={() => runMutation.mutate(selectedSim.id)}
                    disabled={runMutation.isPending}
                    className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700 transition-colors font-bold shadow-md disabled:opacity-50"
                  >
                    {runMutation.isPending ? 'Ejecutando...' : 'Ejecutar Simulación'}
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Variables de Entrada</h3>
                    <div className="bg-slate-50 p-4 rounded-lg font-mono text-sm overflow-auto max-h-48 border border-slate-100">
                      <pre>{JSON.stringify(selectedSim.variables, null, 2)}</pre>
                    </div>

                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 mt-6">Visualización de Impacto</h3>
                    {selectedSim.results ? (
                      <div className="h-48">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="name" tick={{fontSize: 10}} />
                            <YAxis hide />
                            <Tooltip />
                            <Bar dataKey="valor" fill="#2dd4bf" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    ) : (
                      <div className="h-48 bg-slate-50 rounded-lg flex items-center justify-center text-xs text-slate-400 italic">
                        Gráfico disponible tras ejecución
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Resultados Proyectados</h3>
                    {!selectedSim.results ? (
                      <div className="bg-yellow-50 p-4 rounded-lg text-yellow-700 text-sm italic border border-yellow-100">
                        Aún no se ha ejecutado la simulación.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {Object.entries(selectedSim.results).map(([key, val]: any) => (
                          <div key={key} className="bg-white border border-gray-100 p-3 rounded-lg shadow-sm">
                            <p className="text-xs font-bold text-slate-500 uppercase">{key}</p>
                            <p className="text-sm text-slate-700 mt-1">{typeof val === 'string' ? val : JSON.stringify(val)}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <div className="text-6xl mb-4">🎲</div>
                <p>Selecciona un escenario para analizar resultados.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const DBAnalyzerPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('postgresql');
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState(5432);
  const [database, setDatabase] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [selectedConnId, setSelectedConnId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [isNL, setIsNL] = useState(false);

  const queryClient = useQueryClient();

  const { data: connections, isLoading, error } = useQuery({
    queryKey: ['connections'],
    queryFn: () => dbAnalyzerService.getConnections(),
  });

  const { data: schemas, isLoading: isLoadingSchemas } = useQuery({
    queryKey: ['schemas', selectedConnId],
    queryFn: () => dbAnalyzerService.getSchemas(selectedConnId!),
    enabled: !!selectedConnId,
  });

  const connectMutation = useMutation({
    mutationFn: (data: any) => dbAnalyzerService.connect(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['connections'] });
      setShowForm(false);
    },
  });

  const analyzeMutation = useMutation({
    mutationFn: (id: string) => dbAnalyzerService.analyze(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['schemas', selectedConnId] });
    },
  });

  const queryMutation = useMutation({
    mutationFn: (data: any) => dbAnalyzerService.executeQuery(selectedConnId!, data),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    connectMutation.mutate({ name, type, host, port, database, username, password });
  };

  const handleQuerySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    queryMutation.mutate({
      connectionId: selectedConnId,
      query: query,
      naturalLanguage: isNL ? query : undefined
    });
  };

  const selectedConn = (connections as any)?.find((c: any) => c.id === selectedConnId);

  return (
    <div className="p-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Analizador de BD</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors font-bold shadow-sm"
        >
          {showForm ? 'Cancelar' : '+ Nueva Conexión'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-orange-100">
          <h2 className="text-xl font-bold mb-4 text-slate-700">Conectar Base de Datos</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Tipo</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 p-2 border">
                  <option value="postgresql">PostgreSQL</option>
                  <option value="mysql">MySQL</option>
                  <option value="sqlserver">SQL Server</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Host</label>
                <input type="text" value={host} onChange={(e) => setHost(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 p-2 border" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Puerto</label>
                <input type="number" value={port} onChange={(e) => setPort(Number(e.target.value))} required className="mt-1 block w-full rounded-md border-gray-300 p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Base de Datos</label>
                <input type="text" value={database} onChange={(e) => setDatabase(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Usuario</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 p-2 border" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full rounded-md border-gray-300 p-2 border" />
              </div>
            </div>
            <button type="submit" disabled={connectMutation.isPending} className="w-full bg-orange-600 text-white py-2 rounded-md hover:bg-orange-700 font-bold">
              {connectMutation.isPending ? 'Conectando...' : 'Guardar Conexión'}
            </button>
          </form>
        </div>
      )}

      {isLoading ? (
        <p>Cargando conexiones...</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-xl font-bold text-slate-700">Conexiones</h2>
            {(connections as any)?.map((conn: any) => (
              <div
                key={conn.id}
                onClick={() => setSelectedConnId(conn.id)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedConnId === conn.id ? 'bg-orange-50 border-orange-500 shadow-sm' : 'bg-white border-gray-100 hover:border-orange-200'
                }`}
              >
                <h3 className="font-bold text-slate-800">{conn.name}</h3>
                <p className="text-[10px] text-gray-500 uppercase">{conn.type} • {conn.host}</p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-3 space-y-6">
            {selectedConn ? (
              <>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-slate-800">Estructura de Datos</h2>
                    <button
                      onClick={() => analyzeMutation.mutate(selectedConn.id)}
                      disabled={analyzeMutation.isPending}
                      className="text-sm bg-slate-800 text-white px-4 py-1.5 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                      {analyzeMutation.isPending ? 'Analizando...' : 'Analizar Esquema'}
                    </button>
                  </div>

                  {isLoadingSchemas ? (
                    <p className="text-sm text-gray-400 italic">Cargando tablas...</p>
                  ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {(schemas as any)?.map((schema: any) => (
                        <div key={schema.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                          <p className="text-sm font-bold text-slate-700">{schema.tableName}</p>
                          <p className="text-[10px] text-gray-400">{schema.columns.length} columnas</p>
                        </div>
                      ))}
                      {(!schemas || (schemas as any).length === 0) && (
                        <p className="col-span-full text-sm text-gray-400 italic">No se ha analizado el esquema aún.</p>
                      )}
                    </div>
                  )}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-xl font-bold mb-4 text-slate-800">Consulta Inteligente</h2>
                  <form onSubmit={handleQuerySubmit} className="space-y-4">
                    <div className="flex items-center space-x-4 mb-2">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" checked={!isNL} onChange={() => setIsNL(false)} className="text-orange-600" />
                        <span className="text-sm font-medium">SQL</span>
                      </label>
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input type="radio" checked={isNL} onChange={() => setIsNL(true)} className="text-orange-600" />
                        <span className="text-sm font-medium">Lenguaje Natural (IA)</span>
                      </label>
                    </div>
                    <textarea
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder={isNL ? "¿Cuáles fueron las ventas del mes pasado por categoría?" : "SELECT * FROM sales LIMIT 10;"}
                      rows={3}
                      className="w-full rounded-lg border-gray-300 p-3 border focus:ring-orange-500 focus:border-orange-500"
                    ></textarea>
                    <button type="submit" disabled={queryMutation.isPending} className="bg-orange-600 text-white px-8 py-2 rounded-lg font-bold hover:bg-orange-700 shadow-md disabled:opacity-50">
                      {queryMutation.isPending ? 'Ejecutando...' : 'Ejecutar Consulta'}
                    </button>
                  </form>

                  {queryMutation.data && (
                    <div className="mt-6">
                      <h3 className="text-sm font-bold text-gray-400 uppercase mb-3">Resultado</h3>
                      <div className="bg-slate-900 text-green-400 p-4 rounded-lg font-mono text-xs overflow-auto max-h-64">
                        <pre>{JSON.stringify((queryMutation.data as any).result, null, 2)}</pre>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="bg-white p-12 rounded-xl border border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 min-h-[400px]">
                <div className="text-6xl mb-4">🗄️</div>
                <p className="font-medium">Selecciona una conexión para interactuar con la base de datos.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const AutomationPage: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('SCHEDULED');
  const [action, setAction] = useState('{\n  "type": "EMAIL",\n  "to": "admin@empresa.com",\n  "subject": "Alerta de Inventario"\n}');

  const queryClient = useQueryClient();

  const { data: rules, isLoading: isLoadingRules } = useQuery({
    queryKey: ['rules'],
    queryFn: () => automationService.getRules(),
  });

  const { data: logs, isLoading: isLoadingLogs } = useQuery({
    queryKey: ['automationLogs'],
    queryFn: () => automationService.getLogs(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => automationService.createRule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
      setShowForm(false);
      setName('');
    },
  });

  const executeMutation = useMutation({
    mutationFn: (id: string) => automationService.executeRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automationLogs'] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      createMutation.mutate({ name, trigger, action: JSON.parse(action) });
    } catch (err) {
      alert('La acción debe ser un JSON válido');
    }
  };

  return (
    <div className="p-6 pb-24">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-slate-800">Automatización</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-bold shadow-sm"
        >
          {showForm ? 'Cancelar' : '+ Nueva Regla'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 bg-white p-6 rounded-xl shadow-md border border-indigo-100">
          <h2 className="text-xl font-bold mb-4 text-slate-700">Crear Regla de Automatización</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre de la Regla</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ej: Reporte Diario de Ventas"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 border"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Trigger</label>
                <select
                  value={trigger}
                  onChange={(e) => setTrigger(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 p-2 border"
                >
                  <option value="SCHEDULED">Programado (Heartbeat)</option>
                  <option value="ON_EVENT">Por Evento</option>
                  <option value="MANUAL">Manual</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Acción (JSON)</label>
              <textarea
                value={action}
                onChange={(e) => setAction(e.target.value)}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 p-2 border font-mono text-sm"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 font-bold"
            >
              {createMutation.isPending ? 'Guardando...' : 'Guardar Regla'}
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-slate-700">Reglas Activas</h2>
          {isLoadingRules ? <p>Cargando reglas...</p> : (
            <div className="space-y-3">
              {(rules as any)?.map((rule: any) => (
                <div key={rule.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div>
                    <p className="font-bold text-slate-800">{rule.name}</p>
                    <p className="text-xs text-gray-500">{rule.trigger} • {rule.status}</p>
                  </div>
                  <button
                    onClick={() => executeMutation.mutate(rule.id)}
                    disabled={executeMutation.isPending}
                    className="text-[10px] bg-white border border-indigo-200 text-indigo-600 px-3 py-1 rounded hover:bg-indigo-50 font-bold"
                  >
                    Ejecutar
                  </button>
                </div>
              ))}
              {(!rules || (rules as any).length === 0) && <p className="text-sm text-gray-400 italic">No hay reglas configuradas.</p>}
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4 text-slate-700">Historial de Ejecución</h2>
          {isLoadingLogs ? <p>Cargando logs...</p> : (
            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
              {(logs as any)?.map((log: any) => (
                <div key={log.id} className="p-3 border-b border-gray-50 text-sm">
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-slate-700">{log.ruleName || 'Tarea Manual'}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      log.status === 'SUCCESS' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{new Date(log.createdAt).toLocaleString()}</p>
                  {log.error && <p className="text-[10px] text-red-400 mt-1 italic">{log.error}</p>}
                </div>
              ))}
              {(!logs || (logs as any).length === 0) && <p className="text-sm text-gray-400 italic">No hay registros de ejecución.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const CommunicationPage: React.FC = () => {
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const queryClient = useQueryClient();

  const { data: conversations, isLoading: isLoadingConvs } = useQuery({
    queryKey: ['conversations'],
    queryFn: () => communicationService.getConversations(),
  });

  const { data: messages, isLoading: isLoadingMessages } = useQuery({
    queryKey: ['messages', selectedConvId],
    queryFn: () => communicationService.getMessages(selectedConvId!),
    enabled: !!selectedConvId,
    refetchInterval: 5000,
  });

  const sendMutation = useMutation({
    mutationFn: (data: any) => communicationService.sendMessage(data),
    onSuccess: () => {
      setMessage('');
      queryClient.invalidateQueries({ queryKey: ['messages', selectedConvId] });
    },
  });

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedConvId) return;

    const conv = (conversations as any)?.find((c: any) => c.id === selectedConvId);
    sendMutation.mutate({
      recipient: conv?.contact,
      channel: conv?.channel,
      message: message,
    });
  };

  return (
    <div className="h-full flex flex-col pb-16">
      <div className="p-6 border-b border-gray-100 bg-white">
        <h1 className="text-3xl font-bold text-slate-800">Comunicación</h1>
        <p className="text-sm text-gray-500">Omnicanalidad: WhatsApp, Email, Slack y más.</p>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 border-r border-gray-100 bg-white overflow-y-auto">
          {isLoadingConvs ? <p className="p-4">Cargando chats...</p> : (
            <div className="divide-y divide-gray-50">
              {(conversations as any)?.map((conv: any) => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConvId(conv.id)}
                  className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors ${
                    selectedConvId === conv.id ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <p className="font-bold text-slate-800">{conv.contact}</p>
                    <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded uppercase font-bold">
                      {conv.channel}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{conv.lastMessage || 'Sin mensajes'}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 flex flex-col bg-slate-50">
          {selectedConvId ? (
            <>
              <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {isLoadingMessages ? <p>Cargando mensajes...</p> : (
                  <>
                    {(messages as any)?.map((msg: any) => (
                      <div key={msg.id} className={`flex ${msg.direction === 'OUTGOING' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[70%] p-3 rounded-2xl text-sm shadow-sm ${
                          msg.direction === 'OUTGOING'
                            ? 'bg-blue-600 text-white rounded-tr-none'
                            : 'bg-white text-slate-800 rounded-tl-none border border-gray-100'
                        }`}>
                          <p>{msg.content}</p>
                          <p className={`text-[10px] mt-1 ${msg.direction === 'OUTGOING' ? 'text-blue-100' : 'text-gray-400'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div id="messages-end"></div>
                  </>
                )}
              </div>

              <div className="p-4 bg-white border-t border-gray-100">
                <form onSubmit={handleSend} className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={sendMutation.isPending || !message.trim()}
                    className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    ✈️
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
              <div className="text-6xl mb-4">💬</div>
              <p className="font-medium">Selecciona una conversación para comenzar.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const BusinessUnderstandingPage: React.FC = () => {
  const [selectedConnId, setSelectedConnId] = useState('');

  const queryClient = useQueryClient();

  const { data: connections } = useQuery({
    queryKey: ['connections'],
    queryFn: () => dbAnalyzerService.getConnections(),
  });

  const { data: profile, isLoading } = useQuery({
    queryKey: ['businessProfile'],
    queryFn: () => businessService.getProfile(),
  });

  const analyzeMutation = useMutation({
    mutationFn: (id: string) => businessService.analyze(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessProfile'] });
    },
  });

  const profileData = profile as any;

  return (
    <div className="p-6 pb-24">
      <h1 className="text-3xl font-bold text-slate-800 mb-6">Comprensión Empresarial</h1>
      <p className="text-gray-500 mb-8 max-w-2xl">
        Esta capa utiliza IA para analizar tus bases de datos y construir un modelo mental de tu organización.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-700 mb-4">Analizar Nueva Fuente</h2>
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">Seleccionar Base de Datos</label>
              <select
                value={selectedConnId}
                onChange={(e) => setSelectedConnId(e.target.value)}
                className="w-full p-2 border rounded-lg"
              >
                <option value="">-- Seleccionar --</option>
                {(connections as any)?.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <button
                onClick={() => selectedConnId && analyzeMutation.mutate(selectedConnId)}
                disabled={analyzeMutation.isPending || !selectedConnId}
                className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold disabled:opacity-50"
              >
                {analyzeMutation.isPending ? 'Analizando...' : 'Inferir Modelo'}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {isLoading ? (
            <p>Cargando perfil...</p>
          ) : profileData ? (
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">{profileData.industry}</h2>
                  <p className="text-blue-600 font-medium">Tamaño: {profileData.size}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Productos/Servicios</h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData.productsServices?.map((s: string) => (
                      <span key={s} className="px-3 py-1 bg-slate-100 rounded-lg text-sm">{s}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Segmentos</h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData.customerSegments?.map((s: string) => (
                      <span key={s} className="px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-sm">{s}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50">
                <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Procesos Clave</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {profileData.processes?.map((p: string) => (
                    <div key={p} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="text-sm font-bold text-slate-700">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-400">Modelo aún no construido.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export const VirtualSecretaryPage: React.FC = () => {
  const [showEventForm, setShowEventForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');

  const queryClient = useQueryClient();

  const { data: events } = useQuery({
    queryKey: ['events'],
    queryFn: () => secretaryService.getEvents(),
  });

  const { data: reminders } = useQuery({
    queryKey: ['reminders'],
    queryFn: () => secretaryService.getReminders(),
  });

  const scheduleMutation = useMutation({
    mutationFn: (data: any) => secretaryService.scheduleEvent(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
      setShowEventForm(false);
      setTitle('');
    },
  });

  const completeReminderMutation = useMutation({
    mutationFn: (id: string) => secretaryService.completeReminder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
    },
  });

  return (
    <div className="p-6 pb-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Secretaria Virtual</h1>
        <button
          onClick={() => setShowEventForm(!showEventForm)}
          className="bg-purple-600 text-white px-4 py-2 rounded-xl font-bold hover:bg-purple-700 transition-colors"
        >
          {showEventForm ? 'Cancelar' : '+ Agendar Evento'}
        </button>
      </div>

      {showEventForm && (
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-purple-100">
          <h2 className="text-xl font-bold text-slate-700 mb-4">Nueva Cita con Contexto IA</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Título de la Reunión</label>
              <input
                type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej: Revisión con Proveedor"
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Fecha y Hora</label>
              <input
                type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 border rounded-lg"
              />
            </div>
            <div className="md:col-span-1 flex items-end">
              <button
                onClick={() => scheduleMutation.mutate({ title, date: new Date(date).toISOString(), duration: 60, attendees: [] })}
                disabled={!title || !date || scheduleMutation.isPending}
                className="w-full bg-purple-600 text-white py-2 rounded-lg font-bold hover:bg-purple-700 disabled:opacity-50"
              >
                {scheduleMutation.isPending ? 'Procesando Contexto...' : 'Agendar'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center">
            <span className="mr-2">📅</span> Agenda Próxima
          </h2>
          <div className="space-y-4">
            {(events as any)?.map((event: any) => (
              <div key={event.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold text-purple-600 uppercase tracking-widest mb-1">
                      {new Date(event.date).toLocaleString()}
                    </p>
                    <h3 className="text-lg font-bold text-slate-800">{event.title}</h3>
                  </div>
                  <span className="bg-slate-100 text-slate-500 px-3 py-1 rounded-full text-xs font-bold">60 min</span>
                </div>
                <div className="mt-4 p-4 bg-slate-50 rounded-xl border-l-4 border-purple-500">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Contexto IA Sugerido:</p>
                  <p className="text-sm text-slate-600 leading-relaxed italic">"{event.description}"</p>
                </div>
              </div>
            ))}
            {(!events || (events as any).length === 0) && (
              <div className="bg-white p-12 rounded-2xl text-center text-slate-400 border-2 border-dashed border-slate-100">
                <p>No hay eventos programados.</p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <h2 className="text-xl font-bold text-slate-700 mb-4 flex items-center">
            <span className="mr-2">🔔</span> Recordatorios Inteligentes
          </h2>
          <div className="space-y-3">
            {(reminders as any)?.map((rem: any) => (
              <div key={rem.id} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 group">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full uppercase">{rem.type}</span>
                  <button
                    onClick={() => completeReminderMutation.mutate(rem.id)}
                    className="text-slate-300 hover:text-green-500 transition-colors"
                  >
                    ✓
                  </button>
                </div>
                <p className="text-sm font-bold text-slate-800 mb-1">{rem.contextMessage || 'Tarea pendiente'}</p>
                <p className="text-[10px] text-slate-400">Vence: {new Date(rem.dueDate).toLocaleDateString()}</p>
              </div>
            ))}
            {(!reminders || (reminders as any).length === 0) && (
              <p className="text-sm text-slate-400 italic">Sin recordatorios pendientes.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AlertsPage: React.FC = () => {
  const [showRuleForm, setShowRuleForm] = useState(false);
  const [metric, setMetric] = useState('');
  const [threshold, setThreshold] = useState(0);
  const [condition, setCondition] = useState('>');
  const [severity, setSeverity] = useState('WARNING');

  const queryClient = useQueryClient();

  const { data: alerts } = useQuery({ queryKey: ['alerts'], queryFn: () => alertService.getAlerts() });
  const { data: rules } = useQuery({ queryKey: ['alertRules'], queryFn: () => alertService.getRules() });

  const createRuleMutation = useMutation({
    mutationFn: (data: any) => alertService.createRule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alertRules'] });
      setShowRuleForm(false);
    },
  });

  const checkMutation = useMutation({
    mutationFn: () => alertService.triggerCheck(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => alertService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['alerts'] });
    },
  });

  return (
    <div className="p-6 pb-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Alertas y Anomalías</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => checkMutation.mutate()}
            disabled={checkMutation.isPending}
            className="bg-slate-800 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-700"
          >
            {checkMutation.isPending ? 'Escaneando...' : 'Escanear Ahora'}
          </button>
          <button
            onClick={() => setShowRuleForm(!showRuleForm)}
            className="bg-red-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-red-700"
          >
            {showRuleForm ? 'Cancelar' : '+ Nueva Regla'}
          </button>
        </div>
      </div>

      {showRuleForm && (
        <div className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-red-100">
          <h2 className="text-xl font-bold text-slate-700 mb-4">Configurar Regla de Monitoreo</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700">Métrica</label>
              <input type="text" value={metric} onChange={(e) => setMetric(e.target.value)} placeholder="Ej: Ventas Diarias" className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Condición</label>
              <select value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full p-2 border rounded-lg">
                <option value=">">{'>'} Mayor que</option>
                <option value="<">{'<'}</option>
                <option value="=">=</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Umbral</label>
              <input type="number" value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} className="w-full p-2 border rounded-lg" />
            </div>
            <button
              onClick={() => createRuleMutation.mutate({ metric, condition, threshold, severity })}
              className="bg-red-600 text-white py-2 rounded-lg font-bold"
            >
              Guardar Regla
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-slate-700 mb-4">Historial de Alertas</h2>
          {(alerts as any)?.map((alert: any) => (
            <div key={alert.id} className={`p-6 rounded-2xl border-l-8 bg-white shadow-sm flex justify-between items-start ${
              alert.severity === 'CRITICAL' ? 'border-red-500' : alert.severity === 'WARNING' ? 'border-yellow-500' : 'border-blue-500'
            } ${alert.isRead ? 'opacity-60' : ''}`}>
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{new Date(alert.createdAt).toLocaleString()}</span>
                  {!alert.isRead && <span className="w-2 h-2 bg-red-500 rounded-full"></span>}
                </div>
                <h3 className="text-lg font-bold text-slate-800">{alert.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{alert.description}</p>
              </div>
              {!alert.isRead && (
                <button onClick={() => markReadMutation.mutate(alert.id)} className="text-blue-600 font-bold text-sm hover:underline">Marcar como leída</button>
              )}
            </div>
          ))}
          {(!alerts || (alerts as any).length === 0) && <p className="text-center py-12 text-slate-400 border-2 border-dashed rounded-2xl">No hay alertas generadas.</p>}
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-bold text-slate-700 mb-4">Reglas de Alerta</h2>
            <div className="space-y-3">
              {(rules as any)?.map((rule: any) => (
                <div key={rule.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <p className="font-bold text-slate-800 text-sm">{rule.metric}</p>
                  <p className="text-xs text-slate-500">{rule.condition} {rule.threshold} • {rule.severity}</p>
                </div>
              ))}
              {(!rules || (rules as any).length === 0) && <p className="text-xs text-slate-400 italic">No hay reglas configuradas.</p>}
            </div>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-orange-50 p-6 rounded-2xl border border-red-100">
            <h3 className="text-red-800 font-bold mb-2">🤖 Detección de Anomalías</h3>
            <p className="text-xs text-red-700 leading-relaxed">
              El sistema analiza automáticamente patrones históricos. Si una métrica se desvía más de 2 desviaciones estándar,
              se genera una alerta de anomalía automáticamente.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const GrowthAdvisorPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: status } = useQuery({
    queryKey: ['growthStatus'],
    queryFn: () => growthService.getStatus(),
  });

  const diagnoseMutation = useMutation({
    mutationFn: () => growthService.diagnose(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['growthStatus'] }),
  });

  const planMutation = useMutation({
    mutationFn: () => growthService.generatePlan(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['growthStatus'] }),
  });

  const growthData = status as any;

  const radarData = growthData?.diagnosis ? [
    { subject: 'Organización', A: growthData.diagnosis.organizationLevel, fullMark: 10 },
    { subject: 'Tecnología', A: growthData.diagnosis.technologyLevel, fullMark: 10 },
    { subject: 'Finanzas', A: growthData.diagnosis.financialLevel, fullMark: 10 },
    { subject: 'Comercial', A: growthData.diagnosis.commercialLevel, fullMark: 10 },
  ] : [];

  return (
    <div className="p-6 pb-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800">Asistente de Crecimiento</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => diagnoseMutation.mutate()}
            disabled={diagnoseMutation.isPending}
            className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700"
          >
            {diagnoseMutation.isPending ? 'Analizando...' : 'Nuevo Diagnóstico'}
          </button>
          <button
            onClick={() => planMutation.mutate()}
            disabled={planMutation.isPending || !growthData?.diagnosis}
            className="bg-green-600 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-green-700 disabled:opacity-50"
          >
            {planMutation.isPending ? 'Trazando Ruta...' : 'Generar Plan de Acción'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
            <span className="mr-2">📊</span> Madurez Empresarial
          </h2>

          {growthData?.diagnosis ? (
            <div className="flex flex-col items-center">
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" tick={{fontSize: 12, fontWeight: 'bold'}} />
                    <PolarRadiusAxis angle={30} domain={[0, 10]} />
                    <Radar name="Empresa" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-8 grid grid-cols-2 gap-4 w-full">
                <div className="text-center p-4 bg-slate-50 rounded-xl">
                  <p className="text-xs font-bold text-slate-400 uppercase">Score Global</p>
                  <p className="text-4xl font-black text-indigo-600">{growthData.diagnosis.overallScore}/10</p>
                </div>
                <div className="text-center p-4 bg-slate-50 rounded-xl flex items-center justify-center">
                  <p className="text-sm font-bold text-slate-700">Etapa: {growthData.plan?.stage || 'No definida'}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed rounded-xl">
              <p>Realiza un diagnóstico para ver tus métricas.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
              <span className="mr-2">🚀</span> Ruta de Crecimiento
            </h2>
            {growthData?.plan ? (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Recomendaciones Estratégicas</h4>
                  <div className="space-y-3">
                    {growthData.plan.recommendations.map((rec: string, idx: number) => (
                      <div key={idx} className="flex items-start space-x-3 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                        <span className="bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">{idx+1}</span>
                        <p className="text-sm text-indigo-900 font-medium">{rec}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-100">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Impacto Estimado</p>
                  <p className="text-lg font-bold text-green-600">{growthData.plan.estimatedImpact}</p>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400">
                <p>Genera un plan basado en tu madurez actual.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
