'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  XMarkIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  Cog6ToothIcon,
  StarIcon,
  ArrowRightIcon,
  ServerIcon,
  CommandLineIcon
} from '@heroicons/react/24/outline'
import { Button } from '../ui/button'

interface CustomerJourneyMapProps {
  onClose: () => void
}

interface JourneyStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  status: 'active' | 'completed' | 'upcoming'
  metrics: string[]
  cta: string
  gradient: string
}

export default function CustomerJourneyMap({ onClose }: CustomerJourneyMapProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(true)

  const journeySteps: JourneyStep[] = [
    {
      id: 'discovery',
      title: 'Diagnóstico de Infraestrutura',
      description: 'Analisamos seus dados e requisitos para dimensionar a VPS ideal e a arquitetura da sua Stack de IA.',
      icon: <ServerIcon className="w-8 h-8" />,
      status: 'active',
      metrics: ['Análise de segurança', 'Sizing de hardware', 'Mapeamento de dados'],
      cta: 'Iniciar Diagnóstico',
      gradient: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'architecture',
      title: 'Setup da Stack Privada',
      description: 'Provisionamento da VPS, hardening de segurança e instalação do core (Docker, Traefik, Gitea).',
      icon: <CommandLineIcon className="w-8 h-8" />,
      status: 'upcoming',
      metrics: ['Entrega do código-fonte', 'Ambiente CI/CD', 'SSL & Firewall'],
      cta: 'Ver Arquitetura Base',
      gradient: 'from-purple-600 to-pink-600'
    },
    {
      id: 'implementation',
      title: 'Deploy da Aplicação',
      description: 'Instalação da stack de aplicação (Next.js + Python/FastAPI) e customização dos modelos.',
      icon: <RocketLaunchIcon className="w-8 h-8" />,
      status: 'upcoming',
      metrics: ['Deploy em 72h', 'Testes automatizados', 'Documentação API'],
      cta: 'Agendar Deploy',
      gradient: 'from-emerald-600 to-teal-600'
    },
    {
      id: 'optimization',
      title: 'Transferência de Controle',
      description: 'Entrega final das chaves, treinamento da equipe e início do suporte sob demanda.',
      icon: <ShieldCheckIcon className="w-8 h-8" />,
      status: 'upcoming',
      metrics: ['100% Autonomia', 'Sem lock-in', 'Garantia de 30 dias'],
      cta: 'Planejar Transição',
      gradient: 'from-orange-600 to-red-600'
    }
  ]

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false)
      }, 2000)
      return () => clearTimeout(timer)
    }
    return undefined
  }, [isAnimating])

  const nextStep = () => {
    if (currentStep < journeySteps.length - 1) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const currentJourneyStep = journeySteps[currentStep]!

  return (
    <div className="section-padding bg-white">
      <div className="container mx-auto container-padding">
        <div className="relative">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-full border border-blue-200 mb-6"
            >
              <RocketLaunchIcon className="h-5 w-5 text-blue-600 mr-3" />
              <span className="font-medium text-blue-800">Jornada de Soberania Digital</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6"
            >
              Do Zero à <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Stack Própria</span> em 4 Etapas
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-gray-600 max-w-3xl mx-auto"
            >
              Processo estruturado para garantir que você tenha sua infraestrutura de IA rodando em sua própria VPS em 72h.
            </motion.p>

            <button
              onClick={onClose}
              className="absolute top-0 right-0 text-gray-400 hover:text-gray-600 transition-colors p-2"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between mb-4">
              {journeySteps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${index <= currentStep
                        ? `bg-gradient-to-r ${step.gradient} text-white shadow-lg`
                        : 'bg-gray-200 text-gray-400'
                      }`}
                  >
                    {step.icon}
                  </div>
                  {index < journeySteps.length - 1 && (
                    <div
                      className={`w-16 h-1 mx-4 transition-all duration-500 ${index < currentStep ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 'bg-gray-200'
                        }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-between text-sm text-gray-600">
              {journeySteps.map((step, index) => (
                <div key={step.id} className="text-center" style={{ width: '12rem' }}>
                  <span className={`font-medium ${index === currentStep ? 'text-blue-600' : ''}`}>
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Current Step Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-8 border border-gray-200 shadow-xl mb-8"
            >
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Content */}
                <div>
                  <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${currentJourneyStep.gradient} text-white rounded-full mb-6`}>
                    {currentJourneyStep.icon}
                    <span className="ml-2 font-medium">Etapa {currentStep + 1}</span>
                  </div>

                  <h3 className="text-3xl font-serif font-bold text-gray-900 mb-4">
                    {currentJourneyStep.title}
                  </h3>

                  <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                    {currentJourneyStep.description}
                  </p>

                  {/* Metrics */}
                  <div className="space-y-3 mb-8">
                    {currentJourneyStep.metrics.map((metric, index) => (
                      <div key={index} className="flex items-center">
                        <div className={`w-3 h-3 bg-gradient-to-r ${currentJourneyStep.gradient} rounded-full mr-3`} />
                        <span className="text-gray-700 font-medium">{metric}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`bg-gradient-to-r ${currentJourneyStep.gradient} hover:shadow-lg transform hover:scale-105 transition-all duration-200 text-white px-8 py-3`}
                  >
                    {currentJourneyStep.cta}
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </Button>
                </div>

                {/* Visual */}
                <div className="relative">
                  <div className={`bg-gradient-to-br ${currentJourneyStep.gradient} opacity-10 rounded-2xl h-64 flex items-center justify-center`}>
                    <div className={`text-6xl bg-gradient-to-r ${currentJourneyStep.gradient} bg-clip-text text-transparent`}>
                      {currentJourneyStep.icon}
                    </div>
                  </div>

                  {/* Animated Elements */}
                  {isAnimating && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-32 h-32 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ArrowRightIcon className="w-5 h-5 mr-2 rotate-180" />
              Anterior
            </Button>

            <div className="flex space-x-2">
              {journeySteps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                />
              ))}
            </div>

            <Button
              onClick={nextStep}
              disabled={currentStep === journeySteps.length - 1}
              className="flex items-center"
            >
              Próximo
              <ArrowRightIcon className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* ROI Summary */}
          <div className="mt-12 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-8 border border-emerald-200">
            <div className="text-center">
              <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                Resultados Esperados
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                    -60%
                  </div>
                  <div className="text-gray-600">de Custo (TCO)</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                    72h
                  </div>
                  <div className="text-gray-600">Implementação Total</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                    100%
                  </div>
                  <div className="text-gray-600">Propriedade Intelectual</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}