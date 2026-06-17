export const metadata = {
  title: 'Terms of Use | DPO2U',
  description: 'DPO2U website Terms of Use.',
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-brand-chrome-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-chrome-900 dark:text-white mb-6">Terms of Use</h1>
        <p className="text-brand-platinum-800 dark:text-brand-platinum-400 mb-4">
          By accessing and using this site, you agree to these Terms. DPO2U may update these Terms when necessary.
        </p>
        <h2 className="text-xl font-semibold text-brand-chrome-900 dark:text-white mt-8 mb-2">Use of Content</h2>
        <p className="text-brand-platinum-800 dark:text-brand-platinum-400">The content is provided for informational purposes. It does not constitute legal advice.</p>
        <h2 className="text-xl font-semibold text-brand-chrome-900 dark:text-white mt-8 mb-2">Responsibilities</h2>
        <p className="text-brand-platinum-800 dark:text-brand-platinum-400">You agree not to use the site unlawfully or in a way that violates third-party rights.</p>
        <h2 className="text-xl font-semibold text-brand-chrome-900 dark:text-white mt-8 mb-2">Contact</h2>
        <p className="text-brand-platinum-800 dark:text-brand-platinum-400">For questions, get in touch with our team.</p>
        <p className="text-brand-platinum-800 dark:text-brand-platinum-400 mt-8">Last updated: {new Date().toISOString().slice(0, 10)}</p>
      </div>
    </main>
  );
}
