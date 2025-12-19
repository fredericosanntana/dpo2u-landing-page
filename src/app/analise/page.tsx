'use client';

import React, { useState } from 'react';
import { Shield, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { CompleteFormData, CompanyInfo, DataInventoryItem, PurposeAndBasis, StorageAndRetention, ThirdPartyProcessor, SecurityMeasures, RiskAssessment, WizardStep } from '@/../types/wizard';
import Header from '@/components/Header';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import StepIndicator from '@/components/wizard/StepIndicator';
import NavigationButtons from '@/components/wizard/NavigationButtons';
import Step1CompanyInfo from '@/components/wizard/Step1CompanyInfo';
import Step2DataInventory from '@/components/wizard/Step2DataInventory';
import Step3PurposesAndBases from '@/components/wizard/Step3PurposesAndBases';
import Step4StorageAndRetention from '@/components/wizard/Step4StorageAndRetention';
import Step5ThirdParties from '@/components/wizard/Step5ThirdParties';
import Step6SecurityAndRisks from '@/components/wizard/Step6SecurityAndRisks';

const STEP_TITLES = [
    'Empresa',
    'Inventário',
    'Finalidades',
    'Armazenamento',
    'Terceiros',
    'Segurança'
];

export default function AnalisePage() {
    const [currentStep, setCurrentStep] = useState<WizardStep>(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ downloadUrl: string; logs: string } | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Form state
    const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
        nome: '',
        cnpj: '',
        setor: 'Tecnologia/Software',
        colaboradores: 5,
        coletaDados: true,
        possuiOperadores: true,
        responsavel: '',
        email: '',
        telefone: ''
    });

    const [dataInventory, setDataInventory] = useState<DataInventoryItem[]>([]);
    const [purposes, setPurposes] = useState<PurposeAndBasis[]>([]);
    const [storage, setStorage] = useState<StorageAndRetention[]>([]);
    const [thirdParties, setThirdParties] = useState<ThirdPartyProcessor[]>([]);
    const [security, setSecurity] = useState<SecurityMeasures>({
        tecnicas: {
            criptografia: false,
            controle_acesso: false,
            backup: false,
            firewall: false,
            antivirus: false,
            monitoramento: false,
            outras: []
        },
        organizacionais: {
            politica_privacidade_interna: false,
            treinamento_colaboradores: false,
            procedimentos_documentados: false,
            auditoria_regular: false,
            outras: []
        }
    });
    const [risks, setRisks] = useState<RiskAssessment>({
        atividades_alto_risco: false,
        decisoes_automatizadas: false,
        perfilamento: false,
        transferencia_internacional: false,
        incidentes_anteriores: false,
        medidas_mitigacao: ''
    });

    // Validation
    const isStepValid = (): boolean => {
        switch (currentStep) {
            case 1:
                return !!(companyInfo.nome && companyInfo.cnpj && companyInfo.responsavel && companyInfo.email);
            case 2:
                return dataInventory.length > 0 && dataInventory.every(item => item.tipo.trim() !== '');
            case 3:
                return purposes.every(p => p.finalidade.trim() !== '' && p.justificativa.trim() !== '');
            case 4:
                return storage.every(s => s.periodo_retencao.trim() !== '' && s.procedimento_exclusao.trim() !== '');
            case 5:
                return true; // Third parties are optional
            case 6:
                return risks.medidas_mitigacao.trim() !== '';
            default:
                return false;
        }
    };

    const handleNext = () => {
        if (currentStep < 6) {
            setCurrentStep((currentStep + 1) as WizardStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep((currentStep - 1) as WizardStep);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        const completeData: CompleteFormData = {
            step1_company: companyInfo,
            step2_inventory: dataInventory,
            step3_purposes: purposes,
            step4_storage: storage,
            step5_third_parties: thirdParties,
            step6_security: security,
            step6_risks: risks
        };

        try {
            const response = await fetch('/api/analise/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(completeData),
            });

            const json = await response.json();

            if (!response.ok) {
                throw new Error(json.error || 'Erro ao gerar documentos');
            }

            setResult(json);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro desconhecido');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <main className="container mx-auto px-4 py-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-5xl mx-auto"
                >
                    {isSubmitting ? (
                        /* Loading State */
                        <Card className="p-12 text-center space-y-8">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="w-20 h-20 border-4 border-primary border-t-transparent rounded-full mx-auto"
                            />
                            <div>
                                <h2 className="text-3xl font-bold mb-4">Gerando sua Adequação...</h2>
                                <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                                    Nossa IA está analisando seus dados, classificando bases legais e gerando
                                    todos os documentos obrigatórios. Isso pode levar alguns minutos.
                                </p>
                            </div>
                            <div className="max-w-md mx-auto bg-muted/50 rounded-lg p-4 text-sm text-muted-foreground">
                                <p className="mb-2">Estamos processando:</p>
                                <ul className="list-disc list-inside text-left space-y-1">
                                    <li>Mapeamento de Inventário</li>
                                    <li>Análise de Riscos e DPIA</li>
                                    <li>Política de Privacidade e Termos</li>
                                    <li>Relatório do DPO</li>
                                </ul>
                            </div>
                        </Card>
                    ) : !result ? (
                        <>
                            {/* Header */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center justify-center p-4 bg-primary/10 rounded-2xl mb-6">
                                    <Shield className="h-8 w-8 text-primary" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
                                    Adequação LGPD Completa
                                </h1>
                                <p className="text-xl text-muted-foreground">
                                    Preencha todas as etapas para gerar sua documentação personalizada.
                                </p>
                            </div>

                            {/* Step Indicator */}
                            <StepIndicator
                                currentStep={currentStep}
                                totalSteps={6}
                                stepTitles={STEP_TITLES}
                            />

                            {/* Form Card */}
                            <Card className="p-8 shadow-xl">
                                {/* Current Step Content */}
                                {currentStep === 1 && (
                                    <Step1CompanyInfo data={companyInfo} onChange={setCompanyInfo} />
                                )}
                                {currentStep === 2 && (
                                    <Step2DataInventory data={dataInventory} onChange={setDataInventory} />
                                )}
                                {currentStep === 3 && (
                                    <Step3PurposesAndBases
                                        data={purposes}
                                        dataInventory={dataInventory}
                                        onChange={setPurposes}
                                    />
                                )}
                                {currentStep === 4 && (
                                    <Step4StorageAndRetention
                                        data={storage}
                                        dataInventory={dataInventory}
                                        onChange={setStorage}
                                    />
                                )}
                                {currentStep === 5 && (
                                    <Step5ThirdParties
                                        data={thirdParties}
                                        dataInventory={dataInventory}
                                        onChange={setThirdParties}
                                    />
                                )}
                                {currentStep === 6 && (
                                    <Step6SecurityAndRisks
                                        security={security}
                                        risks={risks}
                                        onSecurityChange={setSecurity}
                                        onRisksChange={setRisks}
                                    />
                                )}

                                {/* Navigation */}
                                <NavigationButtons
                                    currentStep={currentStep}
                                    totalSteps={6}
                                    onBack={handleBack}
                                    onNext={handleNext}
                                    onSubmit={handleSubmit}
                                    isSubmitting={isSubmitting}
                                    isValid={isStepValid()}
                                />
                            </Card>

                            {/* Error Display */}
                            {error && (
                                <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start text-destructive">
                                    <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </div>
                            )}
                        </>
                    ) : (
                        /* Success Result */
                        <Card className="p-8 text-center space-y-8">
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                                <CheckCircle className="w-10 h-10 text-emerald-500" />
                            </div>

                            <div>
                                <h2 className="text-3xl font-bold mb-2">Adequação Concluída!</h2>
                                <p className="text-muted-foreground text-lg">
                                    Sua documentação LGPD foi gerada com sucesso.
                                </p>
                            </div>

                            <div className="p-4 bg-muted/50 rounded-lg text-left text-xs font-mono text-muted-foreground h-48 overflow-y-auto border border-border">
                                <pre>{result.logs}</pre>
                            </div>

                            <a
                                href={result.downloadUrl}
                                className="inline-flex items-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-lg shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Baixar Pacote Completo (.zip)
                            </a>

                            <button
                                onClick={() => {
                                    setResult(null);
                                    setCurrentStep(1);
                                }}
                                className="block w-full mt-4 text-muted-foreground hover:text-foreground text-sm underline"
                            >
                                Gerar nova adequação
                            </button>
                        </Card>
                    )}
                </motion.div>
            </main>
        </div>
    );
}
