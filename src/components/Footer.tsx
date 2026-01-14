
import React from 'react';
import { Shield, ArrowRight } from 'lucide-react';
import { ConsultationDialog } from '@/components/ui/premium-dialog';

export default function Footer() {
  return (
    <footer className="bg-brand-sapphire-900 border-t border-brand-sapphire-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 mb-12">
            {/* Brand Section */}
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-brand-blue-500 to-brand-green-500 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-2xl text-white">DPO2U</h3>
                  <p className="text-sm text-slate-400">Legal Tech + IA</p>
                </div>
              </div>
              <p className="text-slate-300 text-lg mb-6 max-w-md leading-relaxed">
                Especialistas em implementações de Stacks de IA em infraestrutura privada (VPS).
                Transformação digital com soberania de dados para empresas que valorizam sua propriedade intelectual.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-slate-400">
                  <div className="w-2 h-2 bg-brand-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">contato@dpo2u.com.br</span>
                </div>
                <div className="flex items-center text-slate-400">
                  <div className="w-2 h-2 bg-brand-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm">+55 11 9999-9999</span>
                </div>
                <div className="flex items-center text-slate-400">
                  <div className="w-2 h-2 bg-brand-purple-500 rounded-full mr-3"></div>
                  <span className="text-sm">São Paulo, SP - Brasil</span>
                </div>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-white text-lg mb-6">Soluções</h4>
              <ul className="space-y-4">
                {[
                  'Adequação LGPD/GDPR',
                  'DPO as a Service',
                  'Auditoria de IA',
                  'Compliance Digital',
                  'Treinamentos Corporativos'
                ].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-slate-400 hover:text-brand-green-400 transition-colors text-sm flex items-center group">
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="font-semibold text-white text-lg mb-6">Empresa</h4>
              <ul className="space-y-4">
                {[
                  'Sobre a DPO2U',
                  'Nossa Equipe',
                  'Cases de Sucesso',
                  'Blog & Recursos',
                  'Carreiras'
                ].map((item, index) => (
                  <li key={index}>
                    <a href="#" className="text-slate-400 hover:text-brand-green-400 transition-colors text-sm flex items-center group">
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-brand-blue-500/10 to-brand-green-500/10 rounded-2xl border border-brand-blue-500/20 p-8 mb-12">
            <div className="text-center">
              <h4 className="text-2xl font-serif font-bold text-white mb-4">
                Pronto para acelerar sua transformação digital?
              </h4>
              <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
                Agende uma demonstração e veja como podemos montar sua estrutura de IA em 72h.
              </p>
              <ConsultationDialog />
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-sapphire-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-400 text-sm text-center md:text-left">
              <p>&copy; 2025 DPO2U Tecnologia Jurídica Ltda. Todos os direitos reservados.</p>
              <p className="mt-1">CNPJ: XX.XXX.XXX/0001-XX • Certificada ISO 27001 • Membro ANPPD</p>
            </div>

            <div className="flex items-center space-x-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                Política de Privacidade
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                Termos de Uso
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm">
                LGPD
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
