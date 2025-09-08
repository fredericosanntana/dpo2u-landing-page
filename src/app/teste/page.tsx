export default function TestePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-indigo-700 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          🚀 Central de Testes DPO2U
        </h1>
        
        <div className="grid gap-6">
          {/* Link para página de testes */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Páginas de Teste Disponíveis
            </h2>
            <div className="space-y-3">
              <a 
                href="/test-site-functionality.html" 
                target="_blank"
                className="block p-4 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
              >
                <div className="font-semibold text-indigo-700">
                  🧪 Teste de Funcionalidades Completo
                </div>
                <div className="text-sm text-gray-600">
                  Testa APIs, Dashboard, Performance e JavaScript
                </div>
              </a>
              
              <a 
                href="/dashboard" 
                className="block p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
              >
                <div className="font-semibold text-purple-700">
                  📊 Dashboard de Métricas
                </div>
                <div className="text-sm text-gray-600">
                  Visualização em tempo real das métricas do sistema
                </div>
              </a>
              
              <a 
                href="/api-config.js" 
                target="_blank"
                className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
              >
                <div className="font-semibold text-green-700">
                  ⚙️ Verificar API Config
                </div>
                <div className="text-sm text-gray-600">
                  Arquivo de configuração da API (JavaScript)
                </div>
              </a>
            </div>
          </div>
          
          {/* Status rápido */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Status do Sistema
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-2xl mb-1">✅</div>
                <div className="text-sm text-gray-600">Site Online</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-2xl mb-1">🌐</div>
                <div className="text-sm text-gray-600">SSL Ativo</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-2xl mb-1">🚀</div>
                <div className="text-sm text-gray-600">Next.js 15</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded">
                <div className="text-2xl mb-1">📡</div>
                <div className="text-sm text-gray-600">API Gateway</div>
              </div>
            </div>
          </div>
          
          {/* Links úteis */}
          <div className="bg-white rounded-lg shadow-xl p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Links Úteis
            </h2>
            <div className="flex flex-wrap gap-3">
              <a 
                href="http://195.200.2.56:8090/api/dashboard"
                target="_blank"
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                API Dashboard
              </a>
              <a 
                href="http://195.200.2.56:8090/api/health"
                target="_blank"
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                API Health
              </a>
              <a 
                href="/"
                className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
              >
                Home
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}