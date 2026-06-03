import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { name: 'Dashboard', icon: '📊', path: '/' },
  { name: 'Memoria', icon: '🧠', path: '/memory' },
  { name: 'Analizador BD', icon: '🗄️', path: '/db-analyzer' },
  { name: 'Simulación', icon: '🎲', path: '/simulations' },
  { name: 'Automatización', icon: '⚙️', path: '/automation' },
  { name: 'Agentes', icon: '🤖', path: '/agents' },
  { name: 'Comunicación', icon: '💬', path: '/communication' },
];

export const Sidebar: React.FC = () => {
  const location = useLocation();

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
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors group ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
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
