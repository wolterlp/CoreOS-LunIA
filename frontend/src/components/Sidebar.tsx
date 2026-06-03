import React from 'react';

const menuItems = [
  { name: 'Dashboard', icon: '📊' },
  { name: 'Memoria', icon: '🧠' },
  { name: 'Analizador BD', icon: '🗄️' },
  { name: 'Simulación', icon: '🎲' },
  { name: 'Automatización', icon: '⚙️' },
  { name: 'Agentes', icon: '🤖' },
  { name: 'Comunicación', icon: '💬' },
  { name: 'Configuración', icon: '🛠️' },
];

export const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-slate-900 min-h-screen text-white p-4">
      <div className="mb-8 px-2">
        <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
          Cerebro Empresarial
        </h1>
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Smart OS</p>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <a
            key={item.name}
            href="#"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors text-slate-300 hover:text-white group"
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </a>
        ))}
      </nav>

      <div className="mt-auto pt-8 border-t border-slate-800 absolute bottom-4 w-52">
        <div className="flex items-center space-x-3 px-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold">
            AD
          </div>
          <div>
            <p className="text-sm font-bold truncate">Admin User</p>
            <p className="text-xs text-slate-500">Director General</p>
          </div>
        </div>
      </div>
    </div>
  );
};
