
import React, { useState } from 'react';
import Header from '@/components/Header';
import { motion } from 'framer-motion';
import { Shield, CheckCircle } from 'lucide-react';
import Step1CompanyInfo from '@/components/wizard/Step1CompanyInfo';
import Step2DataInventory from '@/components/wizard/Step2DataInventory';
import Step3PurposesAndBases from '@/components/wizard/Step3PurposesAndBases';
import Step4StorageAndRetention from '@/components/wizard/Step4StorageAndRetention';
import Step5ThirdParties from '@/components/wizard/Step5ThirdParties';
import Step6SecurityAndRisks from '@/components/wizard/Step6SecurityAndRisks';
import NavigationButtons from '@/components/wizard/NavigationButtons';
import StepIndicator from '@/components/wizard/StepIndicator';
import { CompleteFormData, WizardStep } from '@/../types/wizard';
import { Card } from '@/components/ui/card';
import Footer from '@/components/Footer';

// Initial state matching the interface
const INITIAL_DATA: CompleteFormData = {
    step1_company: {
        nome: '', cnpj: '', setor: 'Tecnologia/Software', colaboradores: 5,
        coletaDados: false, possuiOperadores: false, responsavel: '', email: ''
    },
    step2_inventory: [],
    step3_purposes: [],
    step4_storage: [],
    step5_third_parties: [],
    step6_security: {
        tecnicas: {
            criptografia: false, controle_acesso: false, backup: false,
            firewall: false, antivirus: false, monitoramento: false, outras: []
        },
        organizacionais: {
            politica_privacidade_interna: false, treinamento_colaboradores: false,
            procedimentos_documentados: false, auditoria_regular: false, outras: []
        }
    },
    step6_risks: {
        atividades_alto_risco: false, decisoes_automatizadas: false, perfilamento: false,
        transferencia_internacional: false, incidentes_anteriores: false, medidas_mitigacao: ''
    }
};

const STEP_TITLES = [
    "Dados da Empresa",
    "Inventário de Dados",
    "Finalidades e Bases",
    "Armazenamento",
    "Terceiros",
    "Segurança e Riscos"
];

export default function AnalysisPage() {
    const [currentStep, setCurrentStep] = useState<WizardStep>(1);
    const [formData, setFormData] = useState<CompleteFormData>(INITIAL_DATA);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = () => {
        if (currentStep < 6) {
            setCurrentStep(prev => (prev + 1) as WizardStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            handleSubmit();
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => (prev - 1) as WizardStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert('Diagnóstico enviado com sucesso! (Simulação)');
        setIsSubmitting(false);
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1CompanyInfo data={formData.step1_company} onChange={(d) => setFormData({ ...formData, step1_company: d })} />;
            case 2:
                return <Step2DataInventory data={formData.step2_inventory} onChange={(d) => setFormData({ ...formData, step2_inventory: d })} />;
            case 3:
                return <Step3PurposesAndBases dataInventory={formData.step2_inventory} data={formData.step3_purposes} onChange={(d) => setFormData({ ...formData, step3_purposes: d })} />;
            case 4:
                return <Step4StorageAndRetention dataInventory={formData.step2_inventory} data={formData.step4_storage} onChange={(d) => setFormData({ ...formData, step4_storage: d })} />;
            case 5:
                return <Step5ThirdParties dataInventory={formData.step2_inventory} data={formData.step5_third_parties} onChange={(d) => setFormData({ ...formData, step5_third_parties: d })} />;
            case 6:
                return <Step6SecurityAndRisks
                    security={formData.step6_security}
                    risks={formData.step6_risks}
                    onSecurityChange={(d) => setFormData({ ...formData, step6_security: d })}
                    onRisksChange={(d) => setFormData({ ...formData, step6_risks: d })}
                />;
            default:
                return <div>Erro: Passo desconhecido</div>;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            <Header />

            {/* Header Section */}
            <div className="bg-gradient-premium pt-24 pb-12 px-4 shadow-lg">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-3xl mx-auto"
                    >
                        <div className="inline-flex items-center px-4 py-2 bg-white/10 rounded-full mb-6 backdrop-blur-sm border border-white/20">
                            <Shield className="h-4 w-4 text-brand-emerald-400 mr-2" />
                            <span className="text-sm font-medium">Diagnóstico de Adequação LGPD</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-serif font-bold mb-6 text-white">
                            Mapeamento de Conformidade
                        </h1>
                        <p className="text-lg text-brand-platinum-200 leading-relaxed">
                            Complete o formulário abaixo para gerar um diagnóstico preliminar e identificar gaps de conformidade na sua organização.
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Wizard Container */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20 relative z-10">
                <div className="grid lg:grid-cols-12 gap-8">
                    {/* Sidebar / Progress */}
                    <div className="lg:col-span-3">
                        <Card className="sticky top-24 p-6 shadow-xl border-t-4 border-t-brand-emerald-500">
                            <StepIndicator currentStep={currentStep} totalSteps={6} stepTitles={STEP_TITLES} orientation="vertical" />

                            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <h4 className="font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                                    <CheckCircle className="h-4 w-4 mr-2 text-brand-emerald-500" />
                                    Resumo do Progresso
                                </h4>
                                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
                                    <div className="flex justify-between">
                                        <span>Empresa</span>
                                        <span className={currentStep > 1 ? "text-green-600 font-bold" : ""}>{currentStep > 1 ? "100%" : "Processando..."}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Inventário</span>
                                        <span className={currentStep > 2 ? "text-green-600 font-bold" : ""}>{currentStep > 2 ? "100%" : "Pendente"}</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                                        <div
                                            className="bg-brand-emerald-500 h-1.5 rounded-full transition-all duration-500"
                                            style={{ width: `${((currentStep - 1) / 6) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Main Form */}
                    <div className="lg:col-span-9">
                        <Card className="p-6 md:p-8 shadow-2xl min-h-[600px] flex flex-col justify-between">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                                className="flex-grow"
                            >
                                {renderStep()}
                            </motion.div>

                            <div className="mt-12 pt-6 border-t border-gray-100 dark:border-gray-800">
                                <NavigationButtons
                                    currentStep={currentStep}
                                    totalSteps={6}
                                    onBack={handleBack}
                                    onNext={handleNext}
                                    onSubmit={handleSubmit}
                                    isSubmitting={isSubmitting}
                                    isValid={true}
                                />
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}
