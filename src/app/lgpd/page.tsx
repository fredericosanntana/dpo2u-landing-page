export const metadata = {
  title: 'LGPD | DPO2U',
  description: 'Understand how we apply the LGPD: consent, data-subject rights, policies and data governance.',
};

export default function LGPDPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-brand-chrome-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-chrome-900 dark:text-white mb-6">LGPD at DPO2U</h1>
        <p className="text-brand-platinum-800 dark:text-brand-platinum-400 mb-4">
          We apply the LGPD (Law 13.709/2018) based on the principles of purpose, adequacy, necessity, transparency and security, with granular consent where applicable.
        </p>
        <h2 className="text-xl font-semibold text-brand-chrome-900 dark:text-white mt-8 mb-2">Consent and Cookies</h2>
        <p className="text-brand-platinum-800 dark:text-brand-platinum-400">You can accept, refuse or customize cookies. Without consent, we do not enable analytics/marketing. The banner lets you change your choices at any time.</p>
        <h2 className="text-xl font-semibold text-brand-chrome-900 dark:text-white mt-8 mb-2">Data Subject Rights</h2>
        <p className="text-brand-platinum-800 dark:text-brand-platinum-400">We provide mechanisms to request access, correction, anonymization, portability and deletion of data, as provided by law.</p>
        <h2 className="text-xl font-semibold text-brand-chrome-900 dark:text-white mt-8 mb-2">Legal Basis and Purposes</h2>
        <p className="text-brand-platinum-800 dark:text-brand-platinum-400">We process data for support, audience measurement (with consent) and communications (with consent). We do not sell your data.</p>
        <p className="text-brand-platinum-800 dark:text-brand-platinum-400 mt-8">Last updated: {new Date().toISOString().slice(0, 10)}</p>
      </div>
    </main>
  );
}
