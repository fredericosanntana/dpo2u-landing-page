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
  nome: z.string().min(2, 'Name must have at least 2 characters'),
  email: z.string().email('Invalid email'),
  telefone: z.string().min(10, 'Phone must have at least 10 digits'),
  empresa: z.string().min(2, 'Company name is required'),
  cargo: z.string().min(2, 'Position is required'),
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
      // Simulate API submission
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Multi-Agent System Form submitted:', values);

      setIsSuccess(true);

      toast({
        title: "Diagnostic Scheduled Successfully!",
        description: "Our specialized team will contact you within 2 hours to schedule your personalized analysis.",
      });

      // Auto close after success
      setTimeout(() => {
        onClose?.();
      }, 3000);

    } catch (error) {
      toast({
        title: "Submission error",
        description: "Please try again or contact us directly.",
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
              Diagnostic Scheduled!
            </h3>
            <p className="text-gray-600 text-lg mb-6">
              Our solutions architects will contact you within <strong>2 hours</strong> to schedule your personalized analysis.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-white/80 rounded-lg p-4">
                <Clock className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Analysis in 72h</div>
                <div className="text-xs text-gray-600">Complete diagnostic</div>
              </div>
              <div className="bg-white/80 rounded-lg p-4">
                <Brain className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">AI Roadmap</div>
                <div className="text-xs text-gray-600">Custom implementation</div>
              </div>
              <div className="bg-white/80 rounded-lg p-4">
                <Activity className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                <div className="text-sm font-medium text-gray-900">Live Demo</div>
                <div className="text-xs text-gray-600">Production system</div>
              </div>
            </div>

            <p className="text-sm text-gray-500">
              In the meantime, you can monitor our system in real time on the dashboard above.
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
            Infrastructure Diagnostic
          </Badge>
        </div>

        <CardTitle className="text-3xl font-serif font-bold mb-4">
          Intelligent Digital Transformation
        </CardTitle>

        <p className="text-slate-300 text-lg">
          Personalized assessment in <strong>72h</strong> + Implementation roadmap + AI platform demo
        </p>

        {/* Enhanced Progress Bar */}
        <div className="flex justify-center mt-6 space-x-2">
          {[
            { step: 1, label: 'Profile', icon: User },
            { step: 2, label: 'Company', icon: Building2 },
            { step: 3, label: 'Requirements', icon: Target }
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
              {/* Step 1: Executive Profile */}
              {currentStep === 1 && (
                <motion.div key="step1" {...fadeInUp} className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Executive Profile</h3>
                    <p className="text-gray-600">Information to personalize your analysis</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="nome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center text-gray-700 font-medium">
                            <User className="h-4 w-4 mr-2 text-slate-600" />
                            Full Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your full name"
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
                            Position/Role
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="CEO, CTO, COO, Director, etc."
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
                            Corporate Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="email@company.com"
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
                            Phone
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+1 (555) 000-0000"
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

              {/* Step 2: Company Profile */}
              {currentStep === 2 && (
                <motion.div key="step2" {...fadeInUp} className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Company Profile</h3>
                    <p className="text-gray-600">To size the right solution for you</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="empresa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-gray-700 font-medium">
                          <Building2 className="h-4 w-4 mr-2 text-slate-600" />
                          Company Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your company name"
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
                          <FormLabel>Industry</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-300 focus:border-emerald-500">
                                <SelectValue placeholder="Select your industry" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fintech">Fintech / Financial Services</SelectItem>
                              <SelectItem value="saude">Healthcare</SelectItem>
                              <SelectItem value="educacao">Education / EdTech</SelectItem>
                              <SelectItem value="ecommerce">E-commerce / Retail</SelectItem>
                              <SelectItem value="tecnologia">Technology / Software</SelectItem>
                              <SelectItem value="servicos">Business Services</SelectItem>
                              <SelectItem value="industria">Industry / Manufacturing</SelectItem>
                              <SelectItem value="consultoria">Consulting</SelectItem>
                              <SelectItem value="juridico">Legal / Legal Tech</SelectItem>
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
                          <FormLabel className="flex items-center text-gray-700 font-medium">
                            <Users className="h-4 w-4 mr-2 text-slate-600" />
                            Company Size
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-300 focus:border-emerald-500">
                                <SelectValue placeholder="Number of employees" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="startup">Startup (1-10 employees)</SelectItem>
                              <SelectItem value="pequena">Small (11-50 employees)</SelectItem>
                              <SelectItem value="media">Medium (51-200 employees)</SelectItem>
                              <SelectItem value="grande">Large (201-500 employees)</SelectItem>
                              <SelectItem value="enterprise">Enterprise (500+ employees)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </motion.div>
              )}

              {/* Step 3: Requirements and Goals */}
              {currentStep === 3 && (
                <motion.div key="step3" {...fadeInUp} className="space-y-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Requirements & Goals</h3>
                    <p className="text-gray-600">To create the ideal implementation roadmap</p>
                  </div>

                  <FormField
                    control={form.control}
                    name="principal_desafio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center text-gray-700 font-medium">
                          <Target className="h-4 w-4 mr-2 text-slate-600" />
                          Main Business Challenge
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-gray-300 focus:border-emerald-500">
                              <SelectValue placeholder="What is your biggest challenge?" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="automacao-processos">Manual process automation</SelectItem>
                            <SelectItem value="compliance-lgpd">Full LGPD/GDPR compliance</SelectItem>
                            <SelectItem value="eficiencia-operacional">Operational efficiency</SelectItem>
                            <SelectItem value="escalabilidade">Business scalability</SelectItem>
                            <SelectItem value="reducao-custos">Operational cost reduction</SelectItem>
                            <SelectItem value="qualidade-servicos">Service quality improvement</SelectItem>
                            <SelectItem value="competitividade">Competitive advantage with AI</SelectItem>
                            <SelectItem value="transformacao-digital">Complete digital transformation</SelectItem>
                            <SelectItem value="gestao-dados">Data management & protection</SelectItem>
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
                            Implementation Timeline
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-300 focus:border-emerald-500">
                                <SelectValue placeholder="When do you need to implement?" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="imediato">Immediate (this week)</SelectItem>
                              <SelectItem value="30-dias">Next 30 days</SelectItem>
                              <SelectItem value="trimestre">This quarter (3 months)</SelectItem>
                              <SelectItem value="semestre">This half (6 months)</SelectItem>
                              <SelectItem value="ano">This year</SelectItem>
                              <SelectItem value="planejamento">Still planning</SelectItem>
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
                            Monthly Investment
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="border-gray-300 focus:border-emerald-500">
                                <SelectValue placeholder="Available budget" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ate-10k">Up to $10,000/mo</SelectItem>
                              <SelectItem value="10k-25k">$10,000 - $25,000/mo</SelectItem>
                              <SelectItem value="25k-50k">$25,000 - $50,000/mo</SelectItem>
                              <SelectItem value="50k-100k">$50,000 - $100,000/mo</SelectItem>
                              <SelectItem value="100k-plus">$100,000+/mo</SelectItem>
                              <SelectItem value="customizado">Custom proposal</SelectItem>
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
                  Back
                </Button>
              )}

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center ml-auto bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white"
                >
                  Continue
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
                      Processing...
                    </>
                  ) : (
                    <>
                      <Zap className="h-5 w-5 mr-2" />
                      Schedule FREE Diagnostic
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
              <div className="text-sm font-medium text-gray-900">100% Free</div>
              <div className="text-xs text-gray-600">No commitment</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-2">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="text-sm font-medium text-gray-900">Response in 2h</div>
              <div className="text-xs text-gray-600">Express service</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-white" />
              </div>
              <div className="text-sm font-medium text-gray-900">Guaranteed ROI</div>
              <div className="text-xs text-gray-600">400% proven</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}