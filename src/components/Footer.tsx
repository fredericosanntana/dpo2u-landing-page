'use client';

import React from 'react';
import { Shield, ArrowRight } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-800 text-white">
      <div className="container mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-bold text-2xl text-white">DPO2U</h3>
                <p className="text-sm text-slate-400">Consultoria em Proteção de Dados</p>
              </div>
            </div>
            <p className="text-slate-300 text-base mb-6 max-w-md leading-relaxed">
              Transformação digital com privacidade e IA. Líder em Legal Tech no Brasil, 
              oferecendo soluções inovadoras para conformidade LGPD/GDPR.
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-white text-lg mb-6">Nossos Serviços</h4>
            <ul className="space-y-4">
              {[
                'Diagnóstico de Conformidade',
                'Automação de Processos', 
                'DPO as a Service',
                'Consultoria Estratégica',
              ].map((item, index) => (
                <li key={index}>
                  <a href="#services" className="text-slate-400 hover:text-blue-400 transition-colors text-sm flex items-center group">
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" aria-hidden="true" />
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
                'Sobre Nós',
                'Cases de Sucesso',
                'Blog & Recursos',
                'Contato',
              ].map((item, index) => (
                <li key={index}>
                  <a href="#" className="text-slate-400 hover:text-blue-400 transition-colors text-sm flex items-center group">
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" aria-hidden="true" />
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-400 text-sm text-center md:text-left">
              <p>&copy; {new Date().getFullYear()} DPO2U Tecnologia Jurídica Ltda. Todos os direitos reservados.</p>
            </div>
            <div className="flex items-center space-x-6">
              <a href="/privacy" className="text-slate-400 hover:text-white transition-colors text-sm">
                Política de Privacidade
              </a>
              <a href="/terms" className="text-slate-400 hover:text-white transition-colors text-sm">
                Termos de Uso
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
