export const metadata = {
  title: 'Termos de Uso | DPO2U',
  description: 'Termos de Uso do site DPO2U.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-brand-chrome-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-chrome-900 dark:text-white mb-6">Termos de Uso</h1>
        <p className="text-brand-platinum-800 dark:text-brand-platinum-400 mb-4">
          Ao acessar e utilizar este site, você concorda com estes Termos. A DPO2U poderá atualizar estes Termos quando necessário.
        </p>
        <h2 className="text-xl font-semibold text-brand-chrome-900 dark:text-white mt-8 mb-2">Uso do Conteúdo</h2>
        <p className="text-brand-platinum-800 dark:text-brand-platinum-400">O conteúdo é fornecido para fins informativos. Não constitui aconselhamento jurídico.</p>
        <h2 className="text-xl font-semibold text-brand-chrome-900 dark:text-white mt-8 mb-2">Responsabilidades</h2>
        <p className="text-brand-platinum-800 dark:text-brand-platinum-400">Você concorda em não utilizar o site de forma ilícita ou que viole direitos de terceiros.</p>
        <h2 className="text-xl font-semibold text-brand-chrome-900 dark:text-white mt-8 mb-2">Contato</h2>
        <p className="text-brand-platinum-800 dark:text-brand-platinum-400">Para dúvidas, entre em contato com nossa equipe.</p>
        <p className="text-brand-platinum-800 dark:text-brand-platinum-400 mt-8">Última atualização: {new Date().toISOString().slice(0, 10)}</p>
      </div>
    </main>
  );
}

