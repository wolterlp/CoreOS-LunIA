import React from 'react';

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

export const Dashboard: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Panel de Control Inteligente</h1>

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Últimas Decisiones de la IA</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-1">
              <p className="text-sm font-bold">Optimización de Inventario</p>
              <p className="text-xs text-gray-500">Sugerencia: Aumentar stock de "Producto A" en un 15% basado en tendencia de ventas.</p>
            </div>
            <div className="border-l-4 border-green-500 pl-4 py-1">
              <p className="text-sm font-bold">Detección de Anomalía</p>
              <p className="text-xs text-gray-500">Alerta: Las ventas en la región Norte bajaron un 12% comparado con el mes anterior.</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-4">Estado del Heartbeat</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-blue-100 flex items-center justify-center">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-800">Sistema Activo</p>
              <p className="text-xs text-gray-500">Último pulso: Hace 12 minutos</p>
              <p className="text-xs text-gray-500">Próxima revisión: En 18 minutos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
