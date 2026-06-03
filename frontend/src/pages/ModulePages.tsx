import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memoryService, agentService, simulationService, dbAnalyzerService } from '../services/api';

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
    <div className="p-6">
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
    <div className="p-6">
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

  return (
    <div className="p-6">
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
    <div className="p-6">
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

export const AutomationPage: React.FC = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-6">Automatización</h1>
    <p>Reglas de negocio y ejecución de acciones autónomas.</p>
  </div>
);

export const CommunicationPage: React.FC = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-6">Comunicación</h1>
    <p>Centro unificado de mensajes y canales externos.</p>
  </div>
);
