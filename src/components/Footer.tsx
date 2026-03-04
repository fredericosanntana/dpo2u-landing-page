import React from 'react';
import { Shield, ArrowRight, Github, Twitter, Linkedin } from 'lucide-react';

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
                <div className="w-10 h-10 bg-gradient-to-br from-brand-sapphire-500 to-brand-emerald-500 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-2xl text-white">DPO2U</h3>
                  <p className="text-sm text-brand-platinum-500">Private AI Stack</p>
                </div>
              </div>
              <p className="text-brand-platinum-400 text-lg mb-6 max-w-md leading-relaxed">
                5 integrated products transforming compliance into a self-funding,
                privacy-preserving, on-chain cryptographic asset.
                Built on Midnight Network.
              </p>

              {/* Social Links */}
              <div className="flex items-center space-x-4 mb-6">
                <a href="https://github.com/fredericosanntana" target="_blank" rel="noopener noreferrer" className="text-brand-platinum-500 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
                <a href="https://x.com/fredsanntana" target="_blank" rel="noopener noreferrer" className="text-brand-platinum-500 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="https://www.linkedin.com/in/fredericosantana/" target="_blank" rel="noopener noreferrer" className="text-brand-platinum-500 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-brand-platinum-500">
                  <div className="w-2 h-2 bg-brand-emerald-500 rounded-full mr-3"></div>
                  <span className="text-sm">contato@dpo2u.com.br</span>
                </div>
                <div className="flex items-center text-brand-platinum-500">
                  <div className="w-2 h-2 bg-brand-purple-500 rounded-full mr-3"></div>
                  <span className="text-sm">São Paulo, Brazil</span>
                </div>
              </div>
            </div>

            {/* Products */}
            <div>
              <h4 className="font-semibold text-white text-lg mb-6">Products</h4>
              <ul className="space-y-4">
                {[
                  { label: 'Compliance Engine', href: '/compliance-automate' },
                  { label: 'AI Compliance Brain', href: '/mcp-brain' },
                  { label: 'ZK Compliance Protocol', href: '/midnight-protocol' },
                  { label: 'Self-Funding Agents', href: '/self-funding-agent' },
                  { label: 'Private AI Stack', href: '/private-stack' },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-brand-platinum-500 hover:text-brand-emerald-400 transition-colors text-sm flex items-center group">
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Technology */}
            <div>
              <h4 className="font-semibold text-white text-lg mb-6">Technology</h4>
              <ul className="space-y-4">
                {[
                  { label: 'Midnight Network', href: '/midnight-protocol' },
                  { label: 'Compact Contracts', href: '/midnight-protocol' },
                  { label: 'MCP Server', href: '/mcp-brain' },
                  { label: '$NIGHT / $DUST', href: '/self-funding-agent' },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-brand-platinum-500 hover:text-brand-emerald-400 transition-colors text-sm flex items-center group">
                      <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-brand-sapphire-500/10 to-brand-emerald-500/10 rounded-2xl border border-brand-sapphire-500/20 p-8 mb-12">
            <div className="text-center">
              <h4 className="text-2xl font-serif font-bold text-white mb-4">
                Ready to build verifiable compliance?
              </h4>
              <p className="text-brand-platinum-400 mb-6 max-w-2xl mx-auto">
                Explore how DPO2U's 5 integrated products transform privacy compliance
                into a self-funding, privacy-preserving, on-chain cryptographic asset.
              </p>
              <a
                href="/midnight-protocol"
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-purple-500 to-brand-sapphire-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Explore Midnight Protocol
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-brand-sapphire-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-brand-platinum-500 text-sm text-center md:text-left">
              <p>&copy; 2026 DPO2U. All rights reserved.</p>
            </div>

            <div className="flex items-center space-x-6">
              <a href="/privacy" className="text-brand-platinum-500 hover:text-white transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="/terms" className="text-brand-platinum-500 hover:text-white transition-colors text-sm">
                Terms of Use
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
