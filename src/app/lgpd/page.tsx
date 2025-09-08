export const metadata = {
  title: 'LGPD | DPO2U',
  description: 'Entenda como aplicamos a LGPD: consentimento, direitos do titular, políticas e governança de dados.',
};

export default function LGPDPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-6">LGPD na DPO2U</h1>
        <p className="text-slate-700 dark:text-slate-300 mb-4">
          Aplicamos a LGPD (Lei 13.709/2018) com base nos princípios de finalidade, adequação, necessidade, transparência e segurança, com consentimento granular quando aplicável.
        </p>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-2">Consentimento e Cookies</h2>
        <p className="text-slate-700 dark:text-slate-300">Você pode aceitar, recusar ou personalizar cookies. Sem consentimento, não ativamos analytics/marketing. O banner permite alterar escolhas a qualquer momento.</p>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-2">Direitos do Titular</h2>
        <p className="text-slate-700 dark:text-slate-300">Garantimos mecanismos para solicitação de acesso, correção, anonimização, portabilidade e eliminação de dados, conforme previsto em lei.</p>
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-2">Base Legal e Finalidades</h2>
        <p className="text-slate-700 dark:text-slate-300">Tratamos dados para atendimento, mensuração de audiência (com consentimento) e comunicações (com consentimento). Não vendemos seus dados.</p>
        <p className="text-slate-700 dark:text-slate-300 mt-8">Última atualização: {new Date().toISOString().slice(0, 10)}</p>
      </div>
    </main>
  );
}

