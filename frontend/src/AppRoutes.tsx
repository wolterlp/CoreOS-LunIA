import { Routes, Route, Navigate } from 'react-router-dom';
import { Dashboard } from './components/Dashboard';
import { LoginPage } from './pages/LoginPage';
import {
  MemoryPage,
  AgentsPage,
  SimulationsPage,
  DBAnalyzerPage,
  AutomationPage,
  CommunicationPage,
  BusinessUnderstandingPage,
  VirtualSecretaryPage,
  AlertsPage,
  GrowthAdvisorPage
} from './pages/ModulePages';
import { Sidebar } from './components/Sidebar';

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen bg-slate-50">
    <Sidebar />
    <main className="flex-1 overflow-y-auto">
      {children}
    </main>
  </div>
);

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<MainLayout><Dashboard /></MainLayout>} />
      <Route path="/memory" element={<MainLayout><MemoryPage /></MainLayout>} />
      <Route path="/agents" element={<MainLayout><AgentsPage /></MainLayout>} />
      <Route path="/simulations" element={<MainLayout><SimulationsPage /></MainLayout>} />
      <Route path="/db-analyzer" element={<MainLayout><DBAnalyzerPage /></MainLayout>} />
      <Route path="/automation" element={<MainLayout><AutomationPage /></MainLayout>} />
      <Route path="/communication" element={<MainLayout><CommunicationPage /></MainLayout>} />
      <Route path="/business-understanding" element={<MainLayout><BusinessUnderstandingPage /></MainLayout>} />
      <Route path="/secretary" element={<MainLayout><VirtualSecretaryPage /></MainLayout>} />
      <Route path="/alerts" element={<MainLayout><AlertsPage /></MainLayout>} />
      <Route path="/growth" element={<MainLayout><GrowthAdvisorPage /></MainLayout>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
