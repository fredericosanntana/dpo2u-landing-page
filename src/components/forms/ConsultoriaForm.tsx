'use client';

import React, { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { motion } from 'framer-motion';
import { 
  Building2, 
  Mail, 
  Phone, 
  User, 
  Users, 
  Shield, 
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
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

const consultoriaFormSchema = z.object({
  nome: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  telefone: z.string().min(10, 'Telefone deve ter pelo menos 10 dígitos'),
  empresa: z.string().min(2, 'Nome da empresa obrigatório'),
  cargo: z.string().min(2, 'Cargo obrigatório'),
  segmento: z.string(),
  funcionarios: z.string(),
  desafio: z.string(),
  urgencia: z.string(),
  orcamento: z.string(),
});

type ConsultoriaFormValues = z.infer<typeof consultoriaFormSchema>;

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function ConsultoriaForm({ onClose }: { onClose?: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();

  const form = useForm<ConsultoriaFormValues>({
    resolver: zodResolver(consultoriaFormSchema),
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      empresa: '',
      cargo: '',
      segmento: '',
      funcionarios: '',
      desafio: '',
      urgencia: '',
      orcamento: '',
    },
  });

  async function onSubmit(values: ConsultoriaFormValues) {
    setIsSubmitting(true);
    
    // Simulação de envio
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Form submitted:', values);
    
    toast({
      title: "Consultoria Agendada! 🎉",
      description: "Entraremos em contato em até 2h para agendar sua consultoria gratuita.",
    });
    
    setIsSubmitting(false);
    onClose?.();
  }

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  return (
    <Card className="w-full max-w-2xl mx-auto bg-gradient-to-br from-white to-brand-platinum-50 border-brand-sapphire-200/30 shadow-2xl">
      <CardHeader className="text-center pb-6">
        <div className="flex justify-center mb-4">
          <Badge variant="glassmorphism" size="xl" className="px-6 py-2">
            <Sparkles className="h-5 w-5 mr-2" />
            Consultoria Executive Gratuita
          </Badge>
        </div>
        
        <CardTitle className="text-3xl font-serif font-bold bg-gradient-to-r from-brand-sapphire-600 to-brand-emerald-600 bg-clip-text text-transparent">
          Transformação Digital LGPD
        </CardTitle>
        
        <p className="text-slate-600 text-lg mt-2">
          Diagnóstico completo + Roadmap personalizado + Demo da plataforma
        </p>

        {/* Progress Bar */}
        <div className="flex justify-center mt-6 space-x-2">
          {[1, 2, 3].map((step) => (
            <div
              key={step}
              className={`h-2 w-16 rounded-full transition-all duration-300 ${
                step <= currentStep 
                  ? 'bg-gradient-to-r from-brand-sapphire-500 to-brand-emerald-500' 
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Step 1: Informações Pessoais */}
            {currentStep === 1 && (
              <motion.div {...fadeInUp} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-brand-gray-700 font-medium">
                          <User className="h-4 w-4 mr-2" />
                          Nome Completo
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Seu nome completo" 
                            className="border-brand-gray-300 focus:border-brand-sapphire-500" 
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
                        <FormLabel className="flex items-center text-brand-gray-700 font-medium">
                          <Shield className="h-4 w-4 mr-2" />
                          Cargo/Função
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="CEO, CTO, DPO, etc." 
                            className="border-brand-gray-300 focus:border-brand-sapphire-500"
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
                        <FormLabel className="flex items-center text-brand-gray-700 font-medium">
                          <Mail className="h-4 w-4 mr-2" />
                          Email Corporativo
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="email@empresa.com" 
                            className="border-brand-gray-300 focus:border-brand-sapphire-500"
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
                        <FormLabel className="flex items-center text-brand-gray-700 font-medium">
                          <Phone className="h-4 w-4 mr-2" />
                          Telefone
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="(11) 99999-9999" 
                            className="border-brand-gray-300 focus:border-brand-sapphire-500"
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

            {/* Step 2: Informações da Empresa */}
            {currentStep === 2 && (
              <motion.div {...fadeInUp} className="space-y-4">
                <FormField
                  control={form.control}
                  name="empresa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-brand-gray-700 font-medium">
                        <Building2 className="h-4 w-4 mr-2" />
                        Nome da Empresa
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Nome da sua empresa" 
                          className="border-brand-gray-300 focus:border-brand-sapphire-500"
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
                        <FormLabel>Segmento</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-brand-gray-300 focus:border-brand-sapphire-500">
                              <SelectValue placeholder="Selecione o segmento" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="fintech">Fintech</SelectItem>
                            <SelectItem value="saude">Saúde</SelectItem>
                            <SelectItem value="educacao">Educação</SelectItem>
                            <SelectItem value="ecommerce">E-commerce</SelectItem>
                            <SelectItem value="tecnologia">Tecnologia</SelectItem>
                            <SelectItem value="servicos">Serviços</SelectItem>
                            <SelectItem value="industria">Indústria</SelectItem>
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
                        <FormLabel className="flex items-center text-brand-gray-700 font-medium">
                          <Users className="h-4 w-4 mr-2" />
                          Nº de Funcionários
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-brand-gray-300 focus:border-brand-sapphire-500">
                              <SelectValue placeholder="Tamanho da empresa" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 funcionários</SelectItem>
                            <SelectItem value="11-50">11-50 funcionários</SelectItem>
                            <SelectItem value="51-200">51-200 funcionários</SelectItem>
                            <SelectItem value="201-500">201-500 funcionários</SelectItem>
                            <SelectItem value="500+">500+ funcionários</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Necessidades e Orçamento */}
            {currentStep === 3 && (
              <motion.div {...fadeInUp} className="space-y-4">
                <FormField
                  control={form.control}
                  name="desafio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Principal Desafio LGPD</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-brand-gray-300 focus:border-brand-sapphire-500">
                            <SelectValue placeholder="Qual seu maior desafio?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="compliance">Conformidade total LGPD</SelectItem>
                          <SelectItem value="dpo">Necessito de DPO especializado</SelectItem>
                          <SelectItem value="automacao">Automação de processos</SelectItem>
                          <SelectItem value="auditoria">Auditoria de compliance</SelectItem>
                          <SelectItem value="treinamento">Treinamento das equipes</SelectItem>
                          <SelectItem value="documentacao">Documentação e políticas</SelectItem>
                          <SelectItem value="incidentes">Gestão de incidentes</SelectItem>
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
                        <FormLabel>Urgência</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-brand-gray-300 focus:border-brand-sapphire-500">
                              <SelectValue placeholder="Quando precisar implementar?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="imediato">Imediato (esta semana)</SelectItem>
                            <SelectItem value="30-dias">Próximos 30 dias</SelectItem>
                            <SelectItem value="3-meses">Próximos 3 meses</SelectItem>
                            <SelectItem value="6-meses">Próximos 6 meses</SelectItem>
                            <SelectItem value="planejamento">Ainda em planejamento</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="orcamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Orçamento Mensal</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-brand-gray-300 focus:border-brand-sapphire-500">
                              <SelectValue placeholder="Investimento disponível" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="5k-10k">R$ 5.000 - R$ 10.000</SelectItem>
                            <SelectItem value="10k-25k">R$ 10.000 - R$ 25.000</SelectItem>
                            <SelectItem value="25k-50k">R$ 25.000 - R$ 50.000</SelectItem>
                            <SelectItem value="50k+">R$ 50.000+</SelectItem>
                            <SelectItem value="personalizado">Orçamento personalizado</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6">
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
                  variant="brand" 
                  onClick={nextStep}
                  className="flex items-center ml-auto"
                >
                  Próximo
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  variant="cta-primary" 
                  size="lg"
                  loading={isSubmitting}
                  className="ml-auto"
                >
                  {isSubmitting ? (
                    'Agendando...'
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Agendar Consultoria Gratuita
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>

        {/* Trust Indicators */}
        <div className="mt-8 pt-6 border-t border-brand-gray-200">
          <div className="flex flex-wrap justify-center gap-4 text-sm text-brand-gray-600">
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-brand-green-500 mr-2" />
              <span>Consultoria 100% gratuita</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-brand-green-500 mr-2" />
              <span>Resposta em até 2h</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-brand-green-500 mr-2" />
              <span>Sem compromisso</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}