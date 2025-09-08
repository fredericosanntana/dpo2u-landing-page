export const metadata = {
  title: 'Política de Privacidade | DPO2U',
  description: 'Política de Privacidade da DPO2U conforme LGPD/GDPR.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-6">Política de Privacidade</h1>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Esta Política descreve como a DPO2U trata dados pessoais em conformidade com a LGPD (Lei 13.709/2018) e, quando aplicável, o GDPR.
        </p>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-2">Controlador</h2>
        <p className="text-slate-700 dark:text-slate-300">DPO2U Tecnologia Jurídica Ltda.</p>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-2">Finalidades</h2>
        <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300">
          <li>Atender solicitações e contato.</li>
          <li>Mensurar audiência do site (analytics) mediante consentimento.</li>
          <li>Ofertar serviços e conteúdos (marketing) mediante consentimento.</li>
        </ul>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-2">Direitos do Titular</h2>
        <p className="text-slate-700 dark:text-slate-300">Você pode solicitar acesso, correção, anonimização, portabilidade, eliminação e informações sobre compartilhamento.</p>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-2">Cookies e Consentimento</h2>
        <p className="text-slate-700 dark:text-slate-300">Utilizamos cookies para funcionalidades essenciais, analytics e marketing. Você pode aceitar, recusar ou personalizar suas preferências pelo banner de cookies.</p>
        <p className="text-slate-700 dark:text-slate-300 mt-8">Última atualização: {new Date().toISOString().slice(0, 10)}</p>
      </div>
    </main>
  );
}

