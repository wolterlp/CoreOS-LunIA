import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor for Auth
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor for Error Handling
api.interceptors.response.use(
  (response: any) => {
    return response.data.data !== undefined ? response.data.data : response.data;
  },
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong';
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(new Error(message));
  }
);

export const memoryService = {
  getMemories: (params?: any) => api.get('/api/memory', { params }),
  createMemory: (data: any) => api.post('/api/memory', data),
  deleteMemory: (id: string) => api.delete(`/api/memory/${id}`),
};

export const agentService = {
  getAgents: () => api.get('/api/agents'),
  createAgent: (data: any) => api.post('/api/agents', data),
  getAgentTasks: (agentId: string) => api.get(`/api/agents/${agentId}/tasks`),
  createTask: (agentId: string, data: any) => api.post(`/api/agents/${agentId}/tasks`, data),
};

export const simulationService = {
  getSimulations: () => api.get('/api/simulations/history'),
  createSimulation: (data: any) => api.post('/api/simulations', data),
  getSimulationById: (id: string) => api.get(`/api/simulations/history`).then((res: any) => res.find((s: any) => s.id === id)),
  runSimulation: (id: string) => api.post(`/api/simulations/${id}/run`),
};

export const dbAnalyzerService = {
  getConnections: () => api.get('/api/db-analyzer/connections'),
  connect: (data: any) => api.post('/api/db-analyzer/connections', data),
  analyze: (id: string) => api.post(`/api/db-analyzer/connections/${id}/analyze`),
  getSchemas: (id: string) => api.get(`/api/db-analyzer/connections/${id}/schemas`),
  executeQuery: (id: string, data: any) => api.post(`/api/db-analyzer/connections/${id}/query`, data),
};

export const automationService = {
  getRules: () => api.get('/api/automation/rules'),
  createRule: (data: any) => api.post('/api/automation/rules', data),
  executeRule: (id: string) => api.post(`/api/automation/rules/${id}/execute`),
  getLogs: () => api.get('/api/automation/history'),
};

export const communicationService = {
  getConversations: () => api.get('/api/communication/conversations'),
  getMessages: (convId: string) => api.get(`/api/communication/conversations/${convId}/messages`),
  sendMessage: (data: any) => api.post('/api/communication/send', data),
};

export const alertService = {
  getAlerts: () => api.get('/api/alerts'),
  markAsRead: (id: string) => api.patch(`/api/alerts/${id}/read`),
  deleteAlert: (id: string) => api.delete(`/api/alerts/${id}`),
};

export const authService = {
  login: (data: any) => api.post('/api/auth/login', data),
  register: (data: any) => api.post('/api/auth/register', data),
  getProfile: () => api.get('/api/auth/profile'),
};

export default api;
