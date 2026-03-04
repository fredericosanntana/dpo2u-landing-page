import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-6">
          Terms of Use
        </h1>

        <p className="text-slate-700 dark:text-slate-300 mb-6">
          By accessing and using this website, you agree to these Terms.
          DPO2U may update these Terms as needed.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">Use of Content</h2>
        <p className="text-slate-700 dark:text-slate-300">
          Content is provided for informational purposes only and does not constitute legal advice.
          All intellectual property rights remain with DPO2U.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">Responsibilities</h2>
        <p className="text-slate-700 dark:text-slate-300">
          You agree not to use this site in any unlawful manner or in a way that
          violates the rights of third parties.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">Limitation of Liability</h2>
        <p className="text-slate-700 dark:text-slate-300">
          DPO2U provides this website and its content "as is" without warranties of any kind.
          We are not liable for any damages arising from the use of this site.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">Contact</h2>
        <p className="text-slate-700 dark:text-slate-300">
          For questions about these terms, please contact us at contato@dpo2u.com.br.
        </p>

        <p className="text-slate-500 dark:text-slate-500 mt-12 text-sm">
          Last updated: {new Date().toISOString().slice(0, 10)}
        </p>
      </main>
      <Footer />
    </div>
  );
}
