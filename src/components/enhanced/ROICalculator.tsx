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
  BarChart3,
  Server,
  Layers
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface ROIMetrics {
  currentSaaSCosts: number;
  userCount: number;
  internalDevCost: number;
  projectDuration: number; // months
  maintenanceCost: number;
}

interface ROIResults {
  monthlySavings: number;
  annualSavings: number;
  roi: number;
  paybackPeriod: number;
  assetValue: number;
  tcoReduction: number;
}

const ROICalculator: React.FC = () => {
  const [metrics, setMetrics] = useState<ROIMetrics>({
    currentSaaSCosts: 15000,
    userCount: 50,
    internalDevCost: 25000,
    projectDuration: 24,
    maintenanceCost: 5000
  });

  const [results, setResults] = useState<ROIResults>({
    monthlySavings: 0,
    annualSavings: 0,
    roi: 0,
    paybackPeriod: 0,
    assetValue: 0,
    tcoReduction: 0
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
        currentSaaSCosts,
        userCount,
        internalDevCost,
        maintenanceCost
      } = metrics;

      // VPS Cost estimate (Fixed)
      const vpsCost = 800; // R$ 800/mo estimate for good VPS
      const managementCost = 2000; // R$ 2000/mo support estimate

      // Monthly expenses comparison
      const currentMonthlyExpense = currentSaaSCosts + (userCount * 50); // SaaS + License per user estimate
      const newMonthlyExpense = vpsCost + managementCost; // Fixed infra + support

      const monthlySavings = Math.max(0, currentMonthlyExpense - newMonthlyExpense);
      const annualSavings = monthlySavings * 12;

      // Investment (One-time setup fee estimate)
      const setupInvestment = 15000;

      const roi = ((annualSavings - setupInvestment) / setupInvestment) * 100;
      const paybackPeriod = (setupInvestment / monthlySavings);

      // Asset Value (Intellectual Property gained)
      // Estimated as (internalDevCost * 1.5) because buying the solution is cheaper than building but you get the same asset value
      const assetValue = internalDevCost * 1.5;

      const tcoReduction = ((currentMonthlyExpense - newMonthlyExpense) / currentMonthlyExpense) * 100;

      setResults({
        monthlySavings,
        annualSavings,
        roi,
        paybackPeriod,
        assetValue,
        tcoReduction
      });

      setIsCalculating(false);
      setActiveTab('results');
    }, 800);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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
            <span className="text-sm font-semibold text-brand-emerald-700">TCO & ROI Calculator</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-brand-text-dark mb-6">
            SaaS vs.{' '}
            <span className="bg-gradient-to-r from-brand-emerald-600 to-brand-sapphire-600 bg-clip-text text-transparent">
              Your Own Stack
            </span>
          </h2>

          <p className="text-lg text-brand-gray-600 max-w-3xl mx-auto leading-relaxed">
            Compare the costs of renting software (SaaS) versus investing in your own AI infrastructure (VPS)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
            {[
              {
                icon: TrendingUp,
                value: "-60%",
                label: "TCO Reduction",
                description: "Total Cost of Ownership"
              },
              {
                icon: Server,
                value: "100%",
                label: "Proprietary Asset",
                description: "Software is your equity"
              },
              {
                icon: DollarSign,
                value: "Zero",
                label: "Per-User License",
                description: "Unlimited scaling on VPS"
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
                  <div className="font-semibold text-brand-gray-900 mb-1">{stat.label}</div>
                  <div className="text-sm text-brand-gray-600">{stat.description}</div>
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
            <div className="flex border-b border-brand-gray-200">
              <button
                onClick={() => setActiveTab('calculator')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${activeTab === 'calculator'
                    ? 'text-brand-sapphire-600 border-b-2 border-brand-sapphire-600 bg-brand-sapphire-50'
                    : 'text-brand-gray-600 hover:text-brand-gray-800'
                  }`}
              >
                <Calculator className="h-5 w-5 inline mr-2" />
                Configure SaaS Costs
              </button>
              <button
                onClick={() => setActiveTab('results')}
                className={`flex-1 px-6 py-4 text-center font-semibold transition-colors ${activeTab === 'results'
                    ? 'text-brand-emerald-600 border-b-2 border-brand-emerald-600 bg-brand-emerald-50'
                    : 'text-brand-gray-600 hover:text-brand-gray-800'
                  }`}
              >
                <BarChart3 className="h-5 w-5 inline mr-2" />
                Projected Savings
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
                      <h3 className="text-xl font-semibold text-brand-gray-900 mb-4">
                        Your Current Costs (SaaS)
                      </h3>

                      <div>
                        <Label className="text-brand-gray-700 font-medium">Total Monthly Software Spend ($)</Label>
                        <Input
                          type="number"
                          value={metrics.currentSaaSCosts}
                          onChange={(e) => updateMetric('currentSaaSCosts', Number(e.target.value))}
                          className="mt-2 border-brand-gray-300 focus:border-brand-sapphire-500"
                          placeholder="15000"
                        />
                        <p className="text-sm text-brand-gray-600 mt-1">Sum of all subscriptions (CRM, ERP, AI, etc.)</p>
                      </div>

                      <div>
                        <Label className="text-brand-gray-700 font-medium">Number of Users</Label>
                        <Input
                          type="number"
                          value={metrics.userCount}
                          onChange={(e) => updateMetric('userCount', Number(e.target.value))}
                          className="mt-2 border-brand-gray-300 focus:border-brand-sapphire-500"
                          placeholder="50"
                        />
                        <p className="text-sm text-brand-gray-600 mt-1">Many SaaS charge per license/user</p>
                      </div>

                      <div>
                        <Label className="text-brand-gray-700 font-medium">Cost to develop internally ($)</Label>
                        <Input
                          type="number"
                          value={metrics.internalDevCost}
                          onChange={(e) => updateMetric('internalDevCost', Number(e.target.value))}
                          className="mt-2 border-brand-gray-300 focus:border-brand-sapphire-500"
                          placeholder="50000"
                        />
                        <p className="text-sm text-brand-gray-600 mt-1">How much would it cost to hire devs to build this from scratch?</p>
                      </div>
                    </div>

                    {/* Right Column - Visual */}
                    <div className="flex flex-col justify-center space-y-6 bg-brand-platinum-100 p-6 rounded-xl border border-brand-platinum-300">
                      <h3 className="text-lg font-semibold text-brand-gray-800">Comparative Scenario</h3>

                      <div className="space-y-4">
                        <div className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm">
                          <div className="flex items-center">
                            <Users className="h-5 w-5 text-brand-sapphire-500 mr-3" />
                            <span>SaaS Model (Rental)</span>
                          </div>
                          <span className="font-bold text-red-500">High Recurring</span>
                        </div>

                        <div className="flex justify-center">
                          <ArrowRight className="h-6 w-6 text-brand-platinum-500 rotate-90" />
                        </div>

                        <div className="flex justify-between items-center bg-gradient-to-r from-brand-emerald-50 to-teal-50 border border-brand-emerald-100 p-3 rounded-lg shadow-sm">
                          <div className="flex items-center">
                            <Server className="h-5 w-5 text-brand-emerald-600 mr-3" />
                            <span className="font-medium text-brand-emerald-900">Own Stack Model (VPS)</span>
                          </div>
                          <span className="font-bold text-brand-emerald-600">Low Fixed</span>
                        </div>
                      </div>

                      <p className="text-sm text-brand-gray-500 text-center mt-4">
                        With Your Own Stack, you pay for infrastructure (VPS), not per user. The software is yours forever.
                      </p>

                      <Button
                        onClick={calculateROI}
                        disabled={isCalculating}
                        className="w-full mt-2 bg-gradient-to-r from-brand-emerald-600 to-brand-sapphire-600 hover:from-brand-emerald-700 hover:to-brand-sapphire-700 text-white font-semibold py-3"
                      >
                        {isCalculating ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Calculating Savings...
                          </>
                        ) : (
                          <>
                            <Zap className="h-5 w-5 mr-2" />
                            Compare Scenarios
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
                      <h3 className="text-2xl font-bold text-brand-gray-900 mb-4">
                        Projected Annual Savings
                      </h3>
                      <div className="text-5xl font-bold bg-gradient-to-r from-brand-emerald-600 to-brand-sapphire-600 bg-clip-text text-transparent">
                        {formatCurrency(results.annualSavings)}
                      </div>
                      <p className="text-brand-gray-600 mt-2">Cost difference SaaS vs VPS over 12 months</p>
                    </div>

                    {/* Results Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        {
                          icon: DollarSign,
                          label: "Monthly Savings",
                          value: formatCurrency(results.monthlySavings),
                          color: "emerald"
                        },
                        {
                          icon: TrendingUp,
                          label: "ROI (1st Year)",
                          value: `${Math.round(results.roi)}%`,
                          color: "sapphire"
                        },
                        {
                          icon: Clock,
                          label: "Investment Payback",
                          value: `${results.paybackPeriod.toFixed(1)} months`,
                          color: "purple"
                        },
                        {
                          icon: Layers,
                          label: "Asset Value (IP)",
                          value: formatCurrency(results.assetValue),
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
                            <div className="text-xl font-bold text-brand-gray-900 mb-1">{result.value}</div>
                            <div className="text-sm text-brand-gray-600">{result.label}</div>
                          </Card>
                        </motion.div>
                      ))}
                    </div>

                    {/* Benefits List */}
                    <Card className="p-6 bg-gradient-to-r from-brand-emerald-50 to-brand-sapphire-50 border-brand-emerald-200">
                      <h4 className="text-lg font-semibold text-brand-gray-900 mb-4">Own Stack Advantages:</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          "No cost per additional user",
                          "100% your source code (no lock-in)",
                          "Data never leaves your infrastructure",
                          "Dedicated high-performance VPS",
                          "Predictable and fixed costs",
                          "Auditable security with hardening included",
                          "Complete setup in 72h",
                          "Growing company asset value"
                        ].map((benefit, idx) => (
                          <div key={idx} className="flex items-center text-sm">
                            <CheckCircle className="h-4 w-4 text-brand-emerald-600 mr-2 flex-shrink-0" />
                            <span className="text-brand-gray-700">{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </Card>

                    {/* CTA */}
                    <div className="text-center pt-6">
                      <Button className="bg-gradient-to-r from-brand-emerald-600 to-brand-sapphire-600 hover:from-brand-emerald-700 hover:to-brand-sapphire-700 text-white font-semibold px-8 py-3 text-lg">
                        <Sparkles className="h-5 w-5 mr-2" />
                        I Want My Own Stack
                        <ArrowRight className="h-5 w-5 ml-2" />
                      </Button>
                      <p className="text-sm text-brand-gray-600 mt-3">
                        Free technical feasibility analysis • Guaranteed setup
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