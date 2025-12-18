'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, Loader2, CheckCircle } from 'lucide-react';

interface NavigationButtonsProps {
    currentStep: number;
    totalSteps: number;
    onBack: () => void;
    onNext: () => void;
    onSubmit: () => void;
    isSubmitting?: boolean;
    isValid: boolean;
}

export default function NavigationButtons({
    currentStep,
    totalSteps,
    onBack,
    onNext,
    onSubmit,
    isSubmitting = false,
    isValid
}: NavigationButtonsProps) {
    const isFirstStep = currentStep === 1;
    const isLastStep = currentStep === totalSteps;

    return (
        <div className="flex justify-between items-center pt-8 border-t border-border mt-8">
            <Button
                type="button"
                variant="outline"
                onClick={onBack}
                disabled={isFirstStep || isSubmitting}
                className="flex items-center gap-2"
            >
                <ArrowLeft className="w-4 h-4" />
                Voltar
            </Button>

            {isLastStep ? (
                <Button
                    type="button"
                    onClick={onSubmit}
                    disabled={!isValid || isSubmitting}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Gerando Documentos...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-4 h-4" />
                            Gerar Adequação LGPD
                        </>
                    )}
                </Button>
            ) : (
                <Button
                    type="button"
                    onClick={onNext}
                    disabled={!isValid}
                    className="flex items-center gap-2"
                >
                    Próxima Etapa
                    <ArrowRight className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
}
