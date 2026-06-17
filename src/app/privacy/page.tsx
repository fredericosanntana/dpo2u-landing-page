export const metadata = {
  title: 'Privacy Policy | DPO2U',
  description: 'DPO2U Privacy Policy under LGPD/GDPR.',
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-brand-chrome-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-chrome-900 dark:text-white mb-6">Privacy Policy</h1>
        <p className="text-brand-platinum-800 dark:text-brand-platinum-400 mb-4">
          This Policy describes how DPO2U processes personal data in compliance with the LGPD (Law 13.709/2018) and, where applicable, the GDPR.
        </p>
        <h2 className="text-xl font-semibold text-brand-chrome-900 dark:text-white mt-8 mb-2">Controller</h2>
        <p className="text-brand-platinum-800 dark:text-brand-platinum-400">DPO2U Tecnologia Jurídica Ltda.</p>
        <h2 className="text-xl font-semibold text-brand-chrome-900 dark:text-white mt-8 mb-2">Purposes</h2>
        <ul className="list-disc pl-6 text-brand-platinum-800 dark:text-brand-platinum-400">
          <li>Respond to requests and contact.</li>
          <li>Measure site audience (analytics) with consent.</li>
          <li>Offer services and content (marketing) with consent.</li>
        </ul>
        <h2 className="text-xl font-semibold text-brand-chrome-900 dark:text-white mt-8 mb-2">Data Subject Rights</h2>
        <p className="text-brand-platinum-800 dark:text-brand-platinum-400">You can request access, correction, anonymization, portability, deletion and information about sharing.</p>
        <h2 className="text-xl font-semibold text-brand-chrome-900 dark:text-white mt-8 mb-2">Cookies and Consent</h2>
        <p className="text-brand-platinum-800 dark:text-brand-platinum-400">We use cookies for essential features, analytics and marketing. You can accept, refuse or customize your preferences through the cookie banner.</p>
        <p className="text-brand-platinum-800 dark:text-brand-platinum-400 mt-8">Last updated: {new Date().toISOString().slice(0, 10)}</p>
      </div>
    </main>
  );
}
