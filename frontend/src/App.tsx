function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg">
        <h1 className="text-3xl font-bold text-blue-600 mb-4">
          Cerebro Empresarial IA
        </h1>
        <p className="text-gray-600 mb-4">
          Plataforma de inteligencia artificial empresarial.
        </p>
        <div className="border-t pt-4 mt-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase mb-2">Módulos</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-blue-50 p-2 rounded">Memoria Empresarial</div>
            <div className="bg-green-50 p-2 rounded">Agentes IA</div>
            <div className="bg-purple-50 p-2 rounded">Simulación Estratégica</div>
            <div className="bg-orange-50 p-2 rounded">Analizador BD</div>
            <div className="bg-red-50 p-2 rounded">Automatización</div>
            <div className="bg-teal-50 p-2 rounded">Comunicación</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
