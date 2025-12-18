'use client';

import React from 'react';
import { Check } from 'lucide-react';
import clsx from 'clsx';

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
    stepTitles: string[];
}

export default function StepIndicator({ currentStep, totalSteps, stepTitles }: StepIndicatorProps) {
    return (
        <div className="w-full py-8">
            <div className="flex items-center justify-between">
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
                    <React.Fragment key={step}>
                        {/* Step Circle */}
                        <div className="flex flex-col items-center flex-1">
                            <div
                                className={clsx(
                                    "w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all",
                                    step < currentStep && "bg-primary text-primary-foreground",
                                    step === currentStep && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                                    step > currentStep && "bg-muted text-muted-foreground"
                                )}
                            >
                                {step < currentStep ? (
                                    <Check className="w-6 h-6" />
                                ) : (
                                    <span>{step}</span>
                                )}
                            </div>
                            <div className="mt-2 text-xs sm:text-sm font-medium text-center px-2">
                                {stepTitles[index]}
                            </div>
                        </div>

                        {/* Connector Line */}
                        {index < totalSteps - 1 && (
                            <div
                                className={clsx(
                                    "flex-1 h-1 mx-2 transition-all",
                                    step < currentStep ? "bg-primary" : "bg-muted"
                                )}
                            />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>
    );
}
