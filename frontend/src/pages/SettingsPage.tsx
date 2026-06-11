import React, { useState, useEffect } from 'react';
import { settingsService } from '../services/api';
import { useAuthStore } from '../store/auth.store';
import { Settings as SettingsIcon, Save, Key, Mail, Shield, MessageCircle } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const data = await settingsService.getSettings();
      setSettings(data as any);
    } catch (error) {
      console.error('Error loading settings', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (key: string, value: string) => {
    setSaving(key);
    try {
      await settingsService.updateSetting(key, value);
      // Optional: show toast or success message
    } catch (error) {
      console.error('Error updating setting', error);
    } finally {
      setSaving(null);
    }
  };

  if (user?.role !== 'ADMIN') {
    return (
      <div className="p-8 text-center">
        <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-slate-800">Acceso Denegado</h1>
        <p className="text-slate-500">Solo los administradores pueden configurar el Cerebro.</p>
      </div>
    );
  }

  const categories = Array.from(new Set(settings.map(s => s.category)));

  const getIcon = (category: string) => {
    switch(category) {
      case 'AI': return <Key className="w-5 h-5" />;
      case 'COMMUNICATION': return <Mail className="w-5 h-5" />;
      default: return <SettingsIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-blue-100 text-blue-600 rounded-xl">
          <SettingsIcon size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Configuración del Sistema</h1>
          <p className="text-slate-500">Gestiona las llaves de IA y canales de comunicación sin tocar código.</p>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-slate-100 rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {categories.map(category => (
            <div key={category} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex items-center gap-2">
                {getIcon(category)}
                <h2 className="font-bold text-slate-800 uppercase tracking-wider text-sm">{category}</h2>
              </div>
              <div className="p-6 space-y-6">
                {settings.filter(s => s.category === category).map(setting => (
                  <div key={setting.key} className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-semibold text-slate-700">
                        {setting.description || setting.key}
                      </label>
                      <span className="text-xs font-mono text-slate-400">{setting.key}</span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type={setting.isSecret ? "password" : "text"}
                        defaultValue={setting.value}
                        onBlur={(e) => {
                          if (e.target.value !== setting.value) {
                            handleUpdate(setting.key, e.target.value);
                          }
                        }}
                        className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder={setting.isSecret ? "Ingrese la llave secreta" : "Ingrese el valor"}
                      />
                      <button
                        className={`p-2 rounded-lg transition-all ${saving === setting.key ? 'bg-blue-100 text-blue-600 animate-spin' : 'bg-slate-100 text-slate-400 hover:bg-blue-600 hover:text-white'}`}
                      >
                        <Save size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex gap-3">
            <Shield className="text-yellow-600 shrink-0" size={20} />
            <p className="text-sm text-yellow-800">
              <strong>Nota de Seguridad:</strong> Las llaves guardadas se aplican inmediatamente. Los secretos nunca se muestran en texto plano después de guardarse.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
