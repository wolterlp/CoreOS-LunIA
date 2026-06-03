import { Sidebar } from './components/Sidebar'
import { Dashboard } from './components/Dashboard'

function App() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Dashboard />
      </main>
    </div>
  )
}

export default App
