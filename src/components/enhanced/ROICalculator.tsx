'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calculator,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Zap,
  Brain,
  CheckCircle,
  ArrowRight,
  Target,
  Sparkles,
  Building2,
  BarChart3
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface ROIMetrics {
  currentCosts: number;
  timeSaved: number;
  errorReduction: number;
  complianceImprovement: number;
  employeeCount: number;
  avgSalary: number;
}

interface ROIResults {
  monthlySavings: number;
  annualSavings: number;
  roi: number;
  paybackPeriod: number;
  complianceBenefit: number;
  productivityGain: number;
}

const ROICalculator: React.FC = () => {
  const [metrics, setMetrics] = useState<ROIMetrics>({
    currentCosts: 50000,
    timeSaved: 60, // percentage
    errorReduction: 85,
    complianceImprovement: 90,
    employeeCount: 100,
    avgSalary: 8000
  });

  const [results, setResults] = useState<ROIResults>({
    monthlySavings: 0,
    annualSavings: 0,
    roi: 0,
    paybackPeriod: 0,
    complianceBenefit: 0,
    productivityGain: 0
  });

  const [isCalculating, setIsCalculating] = useState(false);
  const [activeTab, setActiveTab] = useState<'calculator' | 'results'>('calculator');

  useEffect(() => {
    calculateROI();
  }, [metrics]);

  const calculateROI = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
      const {
        currentCosts,
        timeSaved,
        errorReduction,
        complianceImprovement,
        employeeCount,
        avgSalary
      } = metrics;

      // Time savings calculation
      const monthlyLaborCost = employeeCount * avgSalary;
      const timeSavingsValue = (monthlyLaborCost * (timeSaved / 100));
      
      // Error reduction savings
      const errorCostReduction = currentCosts * (errorReduction / 100) * 0.3;
      
      // Compliance improvement value
      const complianceBenefit = currentCosts * (complianceImprovement / 100) * 0.4;
      
      // System cost (estimated)
      const systemCost = Math.min(currentCosts * 0.2, 50000); // Max R$ 50k/month
      
      const monthlySavings = timeSavingsValue + errorCostReduction + complianceBenefit - systemCost;
      const annualSavings = monthlySavings * 12;
      const roi = (annualSavings / (systemCost * 12)) * 100;
      const paybackPeriod = (systemCost * 12) / annualSavings * 12; // in months
      
      setResults({
        monthlySavings,
        annualSavings,
        roi,
        paybackPeriod,
        complianceBenefit,
        productivityGain: timeSavingsValue
      });
      
      setIsCalculating(false);
      setActiveTab('results');
    }, 1000);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const updateMetric = (key: keyof ROIMetrics, value: number) => {
    setMetrics(prev => ({ ...prev, [key]: value }));
  };

  return (
    <section className="section-padding bg-gradient-to-br from-brand-sapphire-50 via-white to-brand-emerald-50">
      <div className="container mx-auto container-padding">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-brand-emerald-100 to-brand-sapphire-100 rounded-full mb-6 border border-brand-emerald-200">
            <Calculator className="h-5 w-5 text-brand-emerald-600 mr-2" />
            <span className="text-sm font-semibold text-brand-emerald-700">ROI Calculator Interativo</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-brand-text-dark mb-6">
            Calcule o{' '}
            <span className="bg-gradient-to-r from-brand-emerald-600 to-brand-sapphire-600 bg-clip-text text-transparent">
              Retorno Real
            </span>{' '}
            da Transformação Digital
          </h2>
          
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Descubra exatamente quanto sua empresa pode economizar e ganhar com nosso 
            sistema multiagente de automação e compliance LGPD
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            {[
              {
                icon: TrendingUp,
                value: "400%",
                label: "ROI Médio Comprovado",
                description: "Retorno em 12 meses"
              },
              {
                icon: Clock,
                value: "72h",
                label: "Deploy Completo",
                description: "Implementação total"
              },
              {
                icon: Target,
                value: "85%",
                label: "Redução de Erros",
                description: "Automação inteligente"
              }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="text-center p-6 border-brand-sapphire-200 hover:shadow-lg transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand-emerald-500 to-brand-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-brand-sapphire-600 mb-1">{stat.value}</div>
                  <div className="font-semibold text-gray-900 mb-1">{stat.label}</div>
                  <div className="text-sm text-gray-600">{stat.description}</div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Calculator Interface */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-6xl mx-auto"
        >
          <Card className="shadow-2xl border-brand-sapphire-200">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('calculator')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                  activeTab === 'calculator'
                    ? 'text-brand-sapphire-600 border-b-2 border-brand-sapphire-600 bg-brand-sapphire-50'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <Calculator className="h-5 w-5 inline mr-2" />
                Configurar Cenário
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${
                  activeTab === 'results'
                    ? 'text-brand-emerald-600 border-b-2 border-brand-emerald-600 bg-brand-emerald-50'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <BarChart3 className="h-5 w-5 inline mr-2" />
                Resultados
              </button>
            </div>

            <CardContent className="p-8">
              <AnimatePresence mode="wait">
                {activeTab === 'calculator' && (
                  <motion.div
                    key="calculator"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="grid md:grid-cols-2 gap-8"
                  >
                    {/* Left Column - Inputs */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Dados da Sua Empresa
                      </h3>

                      <div>
                        <Label className="text-gray-700 font-medium">Custos Mensais Atuais (R$)</Label>
                        <Input
                          type="number"
                          value={metrics.currentCosts}
                          onChange={(e) => updateMetric('currentCosts', Number(e.target.value))}
                          className="mt-2 border-gray-300 focus:border-brand-sapphire-500"
                          placeholder="50000"
                        />
                        <p className="text-sm text-gray-600 mt-1">Custos com compliance, processos manuais, etc.</p>
                      </div>

                      <div>
                        <Label className="text-gray-700 font-medium">Número de Funcionários</Label>
                        <Input
                          type="number"
                          value={metrics.employeeCount}
                          onChange={(e) => updateMetric('employeeCount', Number(e.target.value))}
                          className="mt-2 border-gray-300 focus:border-brand-sapphire-500"
                          placeholder="100"
                        />
                      </div>

                      <div>
                        <Label className="text-gray-700 font-medium">Salário Médio (R$)</Label>
                        <Input
                          type="number"
                          value={metrics.avgSalary}
                          onChange={(e) => updateMetric('avgSalary', Number(e.target.value))}
                          className="mt-2 border-gray-300 focus:border-brand-sapphire-500"
                          placeholder="8000"
                        />
                      </div>
                    </div>

                    {/* Right Column - Sliders */}
                    <div className="space-y-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Projeções de Melhoria
                      </h3>

                      <div>
                        <Label className="text-gray-700 font-medium">
                          Economia de Tempo: {metrics.timeSaved}%
                        </Label>
                        <Slider
                          value={[metrics.timeSaved]}
                          onValueChange={([value]) => updateMetric('timeSaved', value || 0)}
                          max={90}
                          step={5}
                          className="mt-3"
                        />
                        <p className="text-sm text-gray-600 mt-1">Automação de processos manuais</p>
                      </div>

                      <div>
                        <Label className="text-gray-700 font-medium">
                          Redução de Erros: {metrics.errorReduction}%
                        </Label>
                        <Slider
                          value={[metrics.errorReduction]}
                          onValueChange={([value]) => updateMetric('errorReduction', value || 0)}
                          max={95}
                          step={5}
                          className="mt-3"
                        />
                        <p className="text-sm text-gray-600 mt-1">Precisão da automação IA</p>
                      </div>

                      <div>
                        <Label className="text-gray-700 font-medium">
                          Melhoria Compliance: {metrics.complianceImprovement}%
                        </Label>
                        <Slider
                          value={[metrics.complianceImprovement]}
                          onValueChange={([value]) => updateMetric('complianceImprovement', value || 0)}
                          max={100}
                          step={5}
                          className="mt-3"
                        />
                        <p className="text-sm text-gray-600 mt-1">Conformidade LGPD/GDPR</p>
                      </div>

                      <Button
                        onClick={calculateROI}
                        disabled={isCalculating}
                        className="w-full mt-6 bg-gradient-to-r from-brand-emerald-600 to-brand-sapphire-600 hover:from-brand-emerald-700 hover:to-brand-sapphire-700 text-white font-semibold py-3"
                      >
                        {isCalculating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Calculando...
                          </>
                        ) : (
                          <>
                            <Zap className="h-5 w-5 mr-2" />
                            Calcular ROI
                          </>
                        )}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'results' && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="text-center mb-8">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4">
                        Seu ROI Projetado
                      </h3>
                      <div className="text-5xl font-bold bg-gradient-to-r from-brand-emerald-600 to-brand-sapphire-600 bg-clip-text text-transparent">
                        {Math.round(results.roi)}%
                      </div>
                      <p className="text-gray-600 mt-2">Retorno sobre investimento anual</p>
                    </div>

                    {/* Results Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        {
                          icon: DollarSign,
                          label: "Economia Mensal",
                          value: formatCurrency(results.monthlySavings),
                          color: "emerald"
                        },
                        {
                          icon: TrendingUp,
                          label: "Economia Anual",
                          value: formatCurrency(results.annualSavings),
                          color: "sapphire"
                        },
                        {
                          icon: Clock,
                          label: "Payback",
                          value: `${Math.round(results.paybackPeriod)} meses`,
                          color: "purple"
                        },
                        {
                          icon: Brain,
                          label: "Ganho Produtividade",
                          value: formatCurrency(results.productivityGain),
                          color: "emerald"
                        }
                      ].map((result, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <Card className={`p-6 text-center border-brand-${result.color}-200 bg-brand-${result.color}-50`}>
                            <div className={`w-12 h-12 bg-gradient-to-br from-brand-${result.color}-500 to-brand-${result.color}-600 rounded-full flex items-center justify-center mx-auto mb-4`}>
                              <result.icon className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-xl font-bold text-gray-900 mb-1">{result.value}</div>
                            <div className="text-sm text-gray-600">{result.label}</div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {/* Benefits List */}
                    <Card className="p-6 bg-gradient-to-r from-brand-emerald-50 to-brand-sapphire-50 border-brand-emerald-200">
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Benefícios Inclusos:</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          "Sistema multiagente 145+ especialistas",
                          "Implementação completa em 72h",
                          "Compliance LGPD/GDPR automatizado",
                          "Suporte técnico especializado 24/7",
                          "Atualizações e melhorias contínuas",
                          "Integração com sistemas existentes",
                          "Dashboard em tempo real",
                          "ROI monitorado continuamente"
                        ].map((benefit, idx) => (
                          <div key={idx} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-brand-emerald-600 mr-2 flex-shrink-0" />
                            <span className="text-gray-700">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* CTA */}
                    <div className="text-center pt-6">
                      <Button className="bg-gradient-to-r from-brand-emerald-600 to-brand-sapphire-600 hover:from-brand-emerald-700 hover:to-brand-sapphire-700 text-white font-semibold px-8 py-3 text-lg">
                        <Sparkles className="h-5 w-5 mr-2" />
                        Quero Implementar Este ROI
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                      <p className="text-sm text-gray-600 mt-3">
                        Consultoria gratuita • Implementação garantida • Sem compromisso
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default ROICalculator;