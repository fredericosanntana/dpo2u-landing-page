import React, { useState } from 'react';
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
import PageShell from '@/components/landing/PageShell';
import PageHero from '@/components/landing/PageHero';
import PageSection from '@/components/landing/PageSection';

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
        <PageShell footer={false}>
            <PageHero
                badge={
                    <>
                        <Shield className="w-4 h-4 text-brand-emerald-400" />
                        <span>Diagnóstico de Adequação LGPD</span>
                    </>
                }
                title="Mapeamento de Conformidade"
                subtitle="Complete o formulário abaixo para gerar um diagnóstico preliminar e identificar gaps de conformidade na sua organização."
            />

            <PageSection className="py-16" innerClassName="max-w-6xl">
                <div className="grid lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-3">
                        <Card className="sticky top-28 p-6 liquid-glass rounded-3xl">
                            <StepIndicator currentStep={currentStep} totalSteps={6} stepTitles={STEP_TITLES} orientation="vertical" />

                            <div className="mt-8 pt-6 border-t border-white/10">
                                <h4 className="font-semibold text-apex-heading mb-4 flex items-center">
                                    <CheckCircle className="h-4 w-4 mr-2 text-brand-emerald-500" />
                                    Resumo do Progresso
                                </h4>
                                <div className="space-y-3 text-sm text-zinc-400">
                                    <div className="flex justify-between">
                                        <span>Empresa</span>
                                        <span className={currentStep > 1 ? "text-brand-emerald-400 font-semibold" : ""}>{currentStep > 1 ? "100%" : "Processando..."}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Inventário</span>
                                        <span className={currentStep > 2 ? "text-brand-emerald-400 font-semibold" : ""}>{currentStep > 2 ? "100%" : "Pendente"}</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-1.5 mt-2">
                                        <div
                                            className="bg-brand-emerald-500 h-1.5 rounded-full transition-all duration-500"
                                            style={{ width: `${((currentStep - 1) / 6) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-9">
                        <Card className="p-6 md:p-8 liquid-glass rounded-3xl min-h-[600px] flex flex-col justify-between">
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

                            <div className="mt-12 pt-6 border-t border-white/10">
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
            </PageSection>
        </PageShell>
    );
}
