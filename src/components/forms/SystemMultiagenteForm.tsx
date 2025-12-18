'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain,
  Building2,
  Mail,
  Phone,
  User,
  Users,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Star,
  Activity,
  Clock,
  Target,
  DollarSign,
  Briefcase
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const systemMultiagenteFormSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  empresa: z.string().min(2, 'Nome da empresa obrigatório'),
  cargo: z.string().min(2, 'Cargo obrigatório'),
  segmento: z.string(),
  funcionarios: z.string(),
  principal_desafio: z.string(),
  urgencia: z.string(),
  investimento: z.string(),
});

type SystemMultiagenteFormValues = z.infer<typeof systemMultiagenteFormSchema>;

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

export default function SystemMultiagenteForm({ onClose }: { onClose?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const form = useForm<SystemMultiagenteFormValues>({
    resolver: zodResolver(systemMultiagenteFormSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      empresa: '',
      cargo: '',
      segmento: '',
      funcionarios: '',
      principal_desafio: '',
      urgencia: '',
      investimento: '',
    },
  });

  async function onSubmit(values: SystemMultiagenteFormValues) {
    setIsSubmitting(true);

    try {
      // Simulação de envio para API
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Sistema Multiagente Form submitted:', values);

      setIsSuccess(true);

      toast({
        title: "🚀 Diagnóstico Agendado com Sucesso!",
        description: "Nossa equipe especializada entrará em contato em até 2 horas para agendar sua análise personalizada.",
      });

      // Auto close after success
      setTimeout(() => {
        onClose?.();
      }, 3000);

    } catch (error) {
      toast({
        title: "Erro no envio",
        description: "Tente novamente ou entre em contato conosco diretamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const nextStep = () => {
    const currentStepFields = getStepFields(currentStep);
    form.trigger(currentStepFields).then(isValid => {
      if (isValid) {
        setCurrentStep(prev => Math.min(prev + 1, 3));
      }
    });
  };

  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const getStepFields = (step: number): (keyof SystemMultiagenteFormValues)[] => {
    switch (step) {
      case 1: return ['nome', 'email', 'telefone', 'cargo'];
      case 2: return ['empresa', 'segmento', 'funcionarios'];
      case 3: return ['principal_desafio', 'urgencia', 'investimento'];
      default: return [];
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-white to-emerald-50 border-emerald-200/50 shadow-2xl">
        <CardContent className="p-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Diagnóstico Agendado! 🎉
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              Nossa equipe de arquitetos de soluções entrará em contato em <strong>até 2 horas</strong> para agendar sua análise personalizada.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/80 rounded-lg p-4">
                <Clock className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Análise em 72h</div>
                <div className="text-xs text-gray-600">Diagnóstico completo</div>
              </div>
              <div className="bg-white/80 rounded-lg p-4">
                <Brain className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Roadmap IA</div>
                <div className="text-xs text-gray-600">Implementação personalizada</div>
              </div>
              <div className="bg-white/80 rounded-lg p-4">
                <Activity className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Demo Live</div>
                <div className="text-xs text-gray-600">Sistema em produção</div>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              Enquanto isso, você pode acompanhar nosso sistema em tempo real no dashboard acima.
            </p>
          </motion.div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-white to-slate-50 border-slate-200/50 shadow-2xl">
      <CardHeader className="text-center pb-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-t-lg">
        <div className="flex justify-center mb-4">
          <Badge variant="secondary" size="xl" className="px-6 py-2 bg-white/20 text-white border-white/30">
            <Brain className="h-5 w-5 mr-2" />
            Diagnóstico de Infraestrutura
          </Badge>
        </div>

        <CardTitle className="text-3xl font-serif font-bold mb-4">
          Transformação Digital Inteligente
        </CardTitle>

        <p className="text-slate-300 text-lg">
          Avaliação personalizada em <strong>72h</strong> + Roadmap de implementação + Demo da plataforma IA
        </p>

        {/* Enhanced Progress Bar */}
        <div className="flex justify-center mt-6 space-x-2">
          {[
            { step: 1, label: 'Perfil', icon: User },
            { step: 2, label: 'Empresa', icon: Building2 },
            { step: 3, label: 'Necessidades', icon: Target }
          ].map(({ step, label, icon: Icon }) => (
            <div key={step} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${step <= currentStep
                ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white'
                : 'bg-white/20 text-slate-400'
                }`}>
                <Icon className="h-4 w-4" />
              </div>
              <div className={`text-xs mt-1 transition-all duration-300 ${step <= currentStep ? 'text-emerald-300' : 'text-slate-400'
                }`}>
                {label}
              </div>
              {step < 3 && (
                <div className={`h-1 w-12 mt-2 rounded-full transition-all duration-300 ${step < currentStep ? 'bg-emerald-400' : 'bg-white/20'
                  }`} />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <AnimatePresence mode="wait">
              {/* Step 1: Perfil Executivo */}
              {currentStep === 1 && (
                <motion.div key="step1" {...fadeInUp} className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Perfil Executivo</h3>
                    <p className="text-gray-600">Informações para personalizar sua análise</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center text-gray-700 font-medium">
                            <User className="h-4 w-4 mr-2 text-slate-600" />
                            Nome Completo
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Seu nome completo"
                              className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="cargo"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center text-gray-700 font-medium">
                            <Briefcase className="h-4 w-4 mr-2 text-slate-600" />
                            Cargo/Função
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="CEO, CTO, COO, Diretor, etc."
                              className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center text-gray-700 font-medium">
                            <Mail className="h-4 w-4 mr-2 text-slate-600" />
                            Email Corporativo
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="email@empresa.com"
                              className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="telefone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center text-gray-700 font-medium">
                            <Phone className="h-4 w-4 mr-2 text-slate-600" />
                            WhatsApp
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="(11) 99999-9999"
                              className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 2: Perfil da Empresa */}
              {currentStep === 2 && (
                <motion.div key="step2" {...fadeInUp} className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Perfil da Empresa</h3>
                    <p className="text-gray-600">Para dimensionar a solução adequada</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="empresa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-gray-700 font-medium">
                          <Building2 className="h-4 w-4 mr-2 text-slate-600" />
                          Nome da Empresa
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nome da sua empresa"
                            className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="segmento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Segmento de Atuação</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-300 focus:border-emerald-500">
                                <SelectValue placeholder="Selecione o segmento" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fintech">Fintech / Serviços Financeiros</SelectItem>
                              <SelectItem value="saude">Saúde / Healthcare</SelectItem>
                              <SelectItem value="educacao">Educação / EdTech</SelectItem>
                              <SelectItem value="ecommerce">E-commerce / Varejo</SelectItem>
                              <SelectItem value="tecnologia">Tecnologia / Software</SelectItem>
                              <SelectItem value="servicos">Serviços Empresariais</SelectItem>
                              <SelectItem value="industria">Indústria / Manufatura</SelectItem>
                              <SelectItem value="consultoria">Consultoria</SelectItem>
                              <SelectItem value="juridico">Jurídico / Legal Tech</SelectItem>
                              <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="funcionarios"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center text-gray-700 font-medium">
                            <Users className="h-4 w-4 mr-2 text-slate-600" />
                            Porte da Empresa
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-300 focus:border-emerald-500">
                                <SelectValue placeholder="Número de funcionários" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="startup">Startup (1-10 funcionários)</SelectItem>
                              <SelectItem value="pequena">Pequena (11-50 funcionários)</SelectItem>
                              <SelectItem value="media">Média (51-200 funcionários)</SelectItem>
                              <SelectItem value="grande">Grande (201-500 funcionários)</SelectItem>
                              <SelectItem value="enterprise">Enterprise (500+ funcionários)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Necessidades e Objetivos */}
              {currentStep === 3 && (
                <motion.div key="step3" {...fadeInUp} className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Necessidades & Objetivos</h3>
                    <p className="text-gray-600">Para criar o roadmap de implementação ideal</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="principal_desafio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-gray-700 font-medium">
                          <Target className="h-4 w-4 mr-2 text-slate-600" />
                          Principal Desafio de Negócio
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-gray-300 focus:border-emerald-500">
                              <SelectValue placeholder="Qual seu maior desafio atual?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="automacao-processos">Automação de processos manuais</SelectItem>
                            <SelectItem value="compliance-lgpd">Conformidade LGPD/GDPR completa</SelectItem>
                            <SelectItem value="eficiencia-operacional">Eficiência operacional</SelectItem>
                            <SelectItem value="escalabilidade">Escalabilidade do negócio</SelectItem>
                            <SelectItem value="reducao-custos">Redução de custos operacionais</SelectItem>
                            <SelectItem value="qualidade-servicos">Melhoria na qualidade dos serviços</SelectItem>
                            <SelectItem value="competitividade">Vantagem competitiva com IA</SelectItem>
                            <SelectItem value="transformacao-digital">Transformação digital completa</SelectItem>
                            <SelectItem value="gestao-dados">Gestão e proteção de dados</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="urgencia"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center text-gray-700 font-medium">
                            <Clock className="h-4 w-4 mr-2 text-slate-600" />
                            Prazo para Implementação
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-300 focus:border-emerald-500">
                                <SelectValue placeholder="Quando precisa implementar?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="imediato">Imediato (esta semana)</SelectItem>
                              <SelectItem value="30-dias">Próximos 30 dias</SelectItem>
                              <SelectItem value="trimestre">Este trimestre (3 meses)</SelectItem>
                              <SelectItem value="semestre">Este semestre (6 meses)</SelectItem>
                              <SelectItem value="ano">Este ano</SelectItem>
                              <SelectItem value="planejamento">Em fase de planejamento</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="investimento"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center text-gray-700 font-medium">
                            <DollarSign className="h-4 w-4 mr-2 text-slate-600" />
                            Investimento Mensal
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-300 focus:border-emerald-500">
                                <SelectValue placeholder="Budget disponível" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ate-10k">Até R$ 10.000/mês</SelectItem>
                              <SelectItem value="10k-25k">R$ 10.000 - R$ 25.000/mês</SelectItem>
                              <SelectItem value="25k-50k">R$ 25.000 - R$ 50.000/mês</SelectItem>
                              <SelectItem value="50k-100k">R$ 50.000 - R$ 100.000/mês</SelectItem>
                              <SelectItem value="100k-plus">R$ 100.000+/mês</SelectItem>
                              <SelectItem value="customizado">Proposta customizada</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-8 border-t border-gray-200">
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={prevStep}
                  className="flex items-center"
                >
                  Voltar
                </Button>
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center ml-auto bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
                >
                  Continuar
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white text-lg px-8 py-3"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 mr-2" />
                      Agendar Diagnóstico GRATUITO
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>

        {/* Trust Indicators */}
        <div className="mt-8 pt-6 border-t border-gray-200 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mb-2">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div className="text-sm font-medium text-gray-900">100% Gratuito</div>
              <div className="text-xs text-gray-600">Sem compromisso</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="text-sm font-medium text-gray-900">Resposta em 2h</div>
              <div className="text-xs text-gray-600">Atendimento express</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div className="text-sm font-medium text-gray-900">ROI Garantido</div>
              <div className="text-xs text-gray-600">400% comprovado</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}