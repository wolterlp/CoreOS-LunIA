import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { memoryService } from '../services/api';

export const MemoryPage: React.FC = () => {
  const { data: memories, isLoading, error } = useQuery({
    queryKey: ['memories'],
    queryFn: () => memoryService.getMemories(),
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Memoria Empresarial</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Nueva Entrada
        </button>
      </div>

      {isLoading ? (
        <p>Cargando memoria...</p>
      ) : error ? (
        <p className="text-red-500">Error al cargar la memoria: {(error as Error).message}</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(memories as any)?.map((entry: any) => (
            <div key={entry.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-600 rounded uppercase">
                  {entry.type}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">{entry.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-3">{entry.content}</p>
              <div className="mt-4 flex flex-wrap gap-1">
                {entry.tags?.map((tag: string) => (
                  <span key={tag} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
          {(!memories || (memories as any).length === 0) && (
            <div className="col-span-full py-12 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
              No hay registros en la memoria aún.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export const AgentsPage: React.FC = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-6">Agentes IA</h1>
    <p>Coordinación y gestión de agentes especializados.</p>
  </div>
);

export const SimulationsPage: React.FC = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-6">Simulación Estratégica</h1>
    <p>Visualización de escenarios y análisis de futuro.</p>
  </div>
);

export const DBAnalyzerPage: React.FC = () => (
  <div className="p-6">
    <h1 className="text-3xl font-bold mb-6">Analizador de BD</h1>
    <p>Escaneo de estructuras y generación dinámica de consultas.</p>
  </div>
);

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
