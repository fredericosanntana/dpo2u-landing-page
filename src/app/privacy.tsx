import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-32 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-serif font-bold text-slate-900 dark:text-white mb-6">
          Privacy Policy
        </h1>

        <p className="text-slate-700 dark:text-slate-300 mb-6">
          This policy describes how DPO2U handles personal data in compliance with
          LGPD (Law 13.709/2018) and, where applicable, the GDPR.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">Data Controller</h2>
        <p className="text-slate-700 dark:text-slate-300">
          DPO2U — Frederico Santana, Sole Proprietor.
          <br />
          Contact: contato@dpo2u.com.br
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">Purposes</h2>
        <ul className="list-disc pl-6 text-slate-700 dark:text-slate-300 space-y-2">
          <li>Respond to inquiries and contact requests.</li>
          <li>Measure site audience (analytics) with your consent.</li>
          <li>Provide services and relevant content (marketing) with your consent.</li>
        </ul>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">Data Subject Rights</h2>
        <p className="text-slate-700 dark:text-slate-300">
          You may request access, correction, anonymization, portability, deletion,
          and information about data sharing at any time by contacting us.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">Cookies &amp; Consent</h2>
        <p className="text-slate-700 dark:text-slate-300">
          We use cookies for essential functionality, analytics, and marketing.
          You can accept, reject, or customize your preferences via the cookie banner.
        </p>

        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mt-8 mb-3">Data Security</h2>
        <p className="text-slate-700 dark:text-slate-300">
          We implement appropriate technical and organizational measures to protect your
          personal data, including encryption in transit (TLS) and at rest.
        </p>

        <p className="text-slate-500 dark:text-slate-500 mt-12 text-sm">
          Last updated: {new Date().toISOString().slice(0, 10)}
        </p>
      </main>
      <Footer />
    </div>
  );
}
