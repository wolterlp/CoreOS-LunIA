import React from 'react';

export const LoginPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-100">
    <div className="bg-white p-8 rounded-xl shadow-lg w-96">
      <h1 className="text-2xl font-bold mb-6 text-center">Iniciar Sesión</h1>
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Contraseña</label>
          <input type="password" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" />
        </div>
        <button type="button" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors">
          Entrar
        </button>
      </form>
    </div>
  </div>
);
