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
  nome: z.string().min(2, 'Name must have at least 2 characters'),
  email: z.string().email('Invalid email'),
  telefone: z.string().min(10, 'Phone must have at least 10 digits'),
  empresa: z.string().min(2, 'Company name is required'),
  cargo: z.string().min(2, 'Position is required'),
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
    
    // Simulate API submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Form submitted:', values);
    
    toast({
      title: "Consultation Scheduled!",
      description: "We will contact you within 2h to schedule your free consultation.",
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
            Free Executive Consultation
          </Badge>
        </div>

        <CardTitle className="text-3xl font-serif font-bold bg-gradient-to-r from-brand-sapphire-600 to-brand-emerald-600 bg-clip-text text-transparent">
          LGPD Digital Transformation
        </CardTitle>

        <p className="text-slate-600 text-lg mt-2">
          Complete diagnostic + Custom roadmap + Platform demo
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
            
            {/* Step 1: Personal Information */}
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
                          Full Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your full name" 
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
                          Position/Role
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
                          Corporate Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="email@company.com" 
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
                          Phone
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+1 (555) 000-0000" 
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

            {/* Step 2: Company Information */}
            {currentStep === 2 && (
              <motion.div {...fadeInUp} className="space-y-4">
                <FormField
                  control={form.control}
                  name="empresa"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center text-brand-gray-700 font-medium">
                        <Building2 className="h-4 w-4 mr-2" />
                        Company Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your company name" 
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
                        <FormLabel>Industry</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-brand-gray-300 focus:border-brand-sapphire-500">
                              <SelectValue placeholder="Select your industry" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="fintech">Fintech</SelectItem>
                            <SelectItem value="saude">Healthcare</SelectItem>
                            <SelectItem value="educacao">Education</SelectItem>
                            <SelectItem value="ecommerce">E-commerce</SelectItem>
                            <SelectItem value="tecnologia">Technology</SelectItem>
                            <SelectItem value="servicos">Services</SelectItem>
                            <SelectItem value="industria">Manufacturing</SelectItem>
                            <SelectItem value="outro">Other</SelectItem>
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
                          Number of Employees
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-brand-gray-300 focus:border-brand-sapphire-500">
                              <SelectValue placeholder="Company size" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-10">1-10 employees</SelectItem>
                            <SelectItem value="11-50">11-50 employees</SelectItem>
                            <SelectItem value="51-200">51-200 employees</SelectItem>
                            <SelectItem value="201-500">201-500 employees</SelectItem>
                            <SelectItem value="500+">500+ employees</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </motion.div>
            )}

            {/* Step 3: Requirements and Budget */}
            {currentStep === 3 && (
              <motion.div {...fadeInUp} className="space-y-4">
                <FormField
                  control={form.control}
                  name="desafio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Main LGPD Challenge</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="border-brand-gray-300 focus:border-brand-sapphire-500">
                            <SelectValue placeholder="What is your biggest challenge?" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="compliance">Full LGPD compliance</SelectItem>
                          <SelectItem value="dpo">Need a specialized DPO</SelectItem>
                          <SelectItem value="automacao">Process automation</SelectItem>
                          <SelectItem value="auditoria">Compliance audit</SelectItem>
                          <SelectItem value="treinamento">Team training</SelectItem>
                          <SelectItem value="documentacao">Documentation & policies</SelectItem>
                          <SelectItem value="incidentes">Incident management</SelectItem>
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
                        <FormLabel>Urgency</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-brand-gray-300 focus:border-brand-sapphire-500">
                              <SelectValue placeholder="When do you need to implement?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="imediato">Immediate (this week)</SelectItem>
                            <SelectItem value="30-dias">Next 30 days</SelectItem>
                            <SelectItem value="3-meses">Next 3 months</SelectItem>
                            <SelectItem value="6-meses">Next 6 months</SelectItem>
                            <SelectItem value="planejamento">Still planning</SelectItem>
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
                        <FormLabel>Monthly Budget</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-brand-gray-300 focus:border-brand-sapphire-500">
                              <SelectValue placeholder="Available investment" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="5k-10k">$5,000 - $10,000</SelectItem>
                            <SelectItem value="10k-25k">$10,000 - $25,000</SelectItem>
                            <SelectItem value="25k-50k">$25,000 - $50,000</SelectItem>
                            <SelectItem value="50k+">$50,000+</SelectItem>
                            <SelectItem value="personalizado">Custom budget</SelectItem>
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
                  Back
                </Button>
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  variant="brand"
                  onClick={nextStep}
                  className="flex items-center ml-auto"
                >
                  Next
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
                    'Scheduling...'
                  ) : (
                    <>
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Schedule Free Consultation
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
              <span>100% free consultation</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-brand-green-500 mr-2" />
              <span>Response within 2h</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-brand-green-500 mr-2" />
              <span>No commitment</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}