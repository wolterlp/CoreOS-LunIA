import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store';

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
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="w-64 bg-slate-900 min-h-screen text-white p-4 flex flex-col">
      <div className="mb-8 px-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">C</div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">
            Cerebro IA
          </h1>
        </div>
        <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mt-1 ml-10">Smart OS</p>
      </div>

      <nav className="space-y-1 flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all group ${
              location.pathname === item.path
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-lg group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-800">
        <div className="flex items-center justify-between group">
          <div className="flex items-center space-x-3 px-2">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-600 to-teal-400 flex items-center justify-center font-bold text-sm shadow-inner">
              {user?.name?.substring(0, 2).toUpperCase() || 'AI'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate text-slate-200">{user?.name || 'Admin User'}</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">{user?.role || 'Director General'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-red-400 transition-colors"
            title="Cerrar Sesión"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};
