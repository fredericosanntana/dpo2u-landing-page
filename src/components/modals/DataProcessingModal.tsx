'use client'

import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { XMarkIcon, ChartBarIcon, ShieldCheckIcon, Cog6ToothIcon } from '@heroicons/react/24/outline'
import { Button } from '../ui/button'

interface DataProcessingModalProps {
  isOpen: boolean
  onClose: () => void
}

interface ProcessingStep {
  id: string
  name: string
  description: string
  status: 'pending' | 'processing' | 'completed'
  icon: React.ReactNode
  duration: number
}

export default function DataProcessingModal({ isOpen, onClose }: DataProcessingModalProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)

  const processingSteps: ProcessingStep[] = [
    {
      id: 'analysis',
      name: 'Análise Organizacional',
      description: 'Avaliando estrutura organizacional e necessidades de compliance',
      status: 'pending',
      icon: <ChartBarIcon className="w-6 h-6" />,
      duration: 2000
    },
    {
      id: 'validation',
      name: 'Diagnóstico de Conformidade',
      description: 'Identificando gaps de conformidade LGPD e oportunidades de melhoria',
      status: 'pending',
      icon: <ShieldCheckIcon className="w-6 h-6" />,
      duration: 3000
    },
    {
      id: 'optimization',
      name: 'Roadmap Estratégico',
      description: 'Definindo estratégia de transformação digital e implementação multiagente',
      status: 'pending',
      icon: <Cog6ToothIcon className="w-6 h-6" />,
      duration: 2500
    }
  ]

  const [steps, setSteps] = useState(processingSteps)

  const startProcessing = () => {
    setIsProcessing(true)
    setCurrentStep(0)
    
    const runStep = (stepIndex: number) => {
      if (stepIndex >= steps.length) {
        setIsProcessing(false)
        return
      }

      setSteps(prev => prev.map((step, index) => ({
        ...step,
        status: index === stepIndex ? 'processing' : index < stepIndex ? 'completed' : 'pending'
      })))

      setTimeout(() => {
        setSteps(prev => prev.map((step, index) => ({
          ...step,
          status: index === stepIndex ? 'completed' : step.status
        })))
        
        setTimeout(() => {
          setCurrentStep(stepIndex + 1)
          runStep(stepIndex + 1)
        }, 500)
      }, steps[stepIndex]?.duration || 2000)
    }

    runStep(0)
  }

  useEffect(() => {
    if (!isOpen) {
      setSteps(processingSteps)
      setCurrentStep(0)
      setIsProcessing(false)
    }
  }, [isOpen])

  const getStatusColor = (status: ProcessingStep['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'processing': return 'text-blue-600 bg-blue-100 animate-pulse'
      case 'pending': return 'text-gray-400 bg-gray-100'
    }
  }

  const getProgressWidth = () => {
    const completedSteps = steps.filter(step => step.status === 'completed').length
    return (completedSteps / steps.length) * 100
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          open={isOpen}
          onClose={onClose}
          className="relative z-50"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm"
            aria-hidden="true"
          />

          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel
              as={motion.div}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 } as any}
              className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-6 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <Dialog.Title className="text-2xl font-bold">
                      Assessment Inicial DPO2U
                    </Dialog.Title>
                    <p className="text-blue-100 mt-1">
                      Avaliação estratégica da maturidade digital e compliance
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-white/80 hover:text-white transition-colors p-2 rounded-lg hover:bg-white/10"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Progresso do Assessment</span>
                    <span className="text-sm text-gray-500">{Math.round(getProgressWidth())}% Concluído</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${getProgressWidth()}%` }}
                      transition={{ duration: 0.5 }}
                      className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                    />
                  </div>
                </div>

                {/* Processing Steps */}
                <div className="space-y-4 mb-8">
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center p-4 rounded-xl border border-gray-200 bg-gray-50"
                    >
                      <div className={`p-3 rounded-lg mr-4 ${getStatusColor(step.status)}`}>
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{step.name}</h3>
                        <p className="text-gray-600 text-sm">{step.description}</p>
                      </div>
                      <div className="ml-4">
                        {step.status === 'completed' && (
                          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        {step.status === 'processing' && (
                          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                        )}
                        {step.status === 'pending' && (
                          <div className="w-6 h-6 bg-gray-300 rounded-full" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Digital Transformation Benefits */}
                <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8">
                  <h3 className="font-semibold text-gray-900 mb-3">🚀 Benefícios do Assessment DPO2U</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                      <span>Diagnóstico completo em 72h</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2" />
                      <span>Roadmap personalizado de implementação</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2" />
                      <span>Estratégia de compliance automatizada</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-brand-sapphire-500 rounded-full mr-2" />
                      <span>ROI projetado e cronograma detalhado</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-4">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    disabled={isProcessing}
                  >
                    Fechar
                  </Button>
                  {!isProcessing && getProgressWidth() < 100 && (
                    <Button
                      onClick={startProcessing}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                      Iniciar Assessment
                    </Button>
                  )}
                  {getProgressWidth() === 100 && (
                    <Button
                      onClick={() => {/* Implement save functionality */}}
                      className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                    >
                      Agendar Consultoria
                    </Button>
                  )}
                </div>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  )
}