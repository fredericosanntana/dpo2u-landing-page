import React from 'react';
import { Shield, ArrowRight, Mail, Phone, MapPin } from 'lucide-react';
import { ConsultationDialog } from '@/components/ui/premium-dialog';

const solutionLinks = [
  'Adequação LGPD/GDPR',
  'DPO as a Service',
  'Stack de IA Privada',
  'Auditoria de IA',
  'Compliance Digital',
  'Treinamentos Corporativos',
];

const companyLinks = [
  { label: 'Sobre a DPO2U', href: '#about' },
  { label: 'Cases de Sucesso', href: '#cases' },
  { label: 'Blog & Recursos', href: '#' },
  { label: 'Política de Privacidade', href: '/privacy' },
  { label: 'Termos de Uso', href: '/terms' },
  { label: 'LGPD', href: '/lgpd' },
];

export default function Footer() {
  return (
    <footer className="bg-brand-gray-900 border-t border-brand-gray-800" aria-label="Rodapé">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* Conteúdo principal */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 mb-12">

            {/* Marca */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-hero rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-2xl text-white">DPO2U</h3>
                  <p className="text-sm text-brand-gray-400">Legal Tech + Stack de IA Privada</p>
                </div>
              </div>

              <p className="text-brand-gray-300 text-base mb-6 max-w-md leading-relaxed">
                Especialistas em implementação de Stacks de IA em infraestrutura privada (VPS).
                Transformação digital com soberania de dados para empresas que valorizam
                sua propriedade intelectual.
              </p>

              {/* Contato */}
              <address className="not-italic space-y-3">
                <div className="flex items-center text-brand-gray-400 hover:text-brand-green-400 transition-colors">
                  <Mail className="h-4 w-4 mr-3 flex-shrink-0 text-brand-green-500" />
                  <a href="mailto:contato@dpo2u.com.br" className="text-sm">
                    contato@dpo2u.com.br
                  </a>
                </div>
                <div className="flex items-center text-brand-gray-400">
                  <Phone className="h-4 w-4 mr-3 flex-shrink-0 text-brand-blue-500" />
                  <span className="text-sm">+55 11 9999-9999</span>
                </div>
                <div className="flex items-center text-brand-gray-400">
                  <MapPin className="h-4 w-4 mr-3 flex-shrink-0 text-brand-purple-500" />
                  <span className="text-sm">São Paulo, SP — Brasil</span>
                </div>
              </address>
            </div>

            {/* Soluções */}
            <div>
              <h4 className="font-display font-semibold text-white text-lg mb-6">Soluções</h4>
              <ul className="space-y-3">
                {solutionLinks.map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-brand-gray-400 hover:text-brand-green-400 transition-colors text-sm flex items-center group"
                    >
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all flex-shrink-0" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Empresa */}
            <div>
              <h4 className="font-display font-semibold text-white text-lg mb-6">Empresa</h4>
              <ul className="space-y-3">
                {companyLinks.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      className="text-brand-gray-400 hover:text-brand-green-400 transition-colors text-sm flex items-center group"
                    >
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all flex-shrink-0" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-brand-blue-500/10 to-brand-green-500/10 rounded-2xl border border-brand-blue-500/20 p-8 mb-4">
            <div className="text-center">
              <h4 className="text-2xl font-display font-bold text-white mb-3">
                Pronto para acelerar sua transformação digital?
              </h4>
              <p className="text-brand-gray-300 mb-6 max-w-2xl mx-auto text-base">
                Agende uma demonstração e veja como montamos sua infraestrutura de IA em 72h.
              </p>
              <ConsultationDialog />
            </div>
          </div>
        </div>

        {/* Barra inferior */}
        <div className="border-t border-brand-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
            <div className="text-brand-gray-500 text-sm text-center md:text-left">
              <p>&copy; {new Date().getFullYear()} DPO2U Tecnologia Jurídica Ltda. Todos os direitos reservados.</p>
              <p className="mt-1">CNPJ: XX.XXX.XXX/0001-XX · Certificada ISO 27001 · Membro ANPPD</p>
            </div>

            <div className="flex items-center space-x-6">
              <a href="/privacy" className="text-brand-gray-500 hover:text-white transition-colors text-sm">
                Privacidade
              </a>
              <a href="/terms" className="text-brand-gray-500 hover:text-white transition-colors text-sm">
                Termos
              </a>
              <a href="/lgpd" className="text-brand-gray-500 hover:text-white transition-colors text-sm">
                LGPD
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
