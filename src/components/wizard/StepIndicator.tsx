
import React from 'react';
import { Check } from 'lucide-react';
import clsx from 'clsx';

interface StepIndicatorProps {
    currentStep: number;
    totalSteps: number;
    stepTitles: string[];
    orientation?: 'horizontal' | 'vertical';
}

export default function StepIndicator({
    currentStep,
    totalSteps,
    stepTitles,
    orientation = 'horizontal'
}: StepIndicatorProps) {
    const isVertical = orientation === 'vertical';

    return (
        <div className={clsx("w-full py-4", isVertical ? "" : "py-8")}>
            <div className={clsx(
                "flex",
                isVertical ? "flex-col space-y-0" : "items-center justify-between"
            )}>
                {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step, index) => (
                    <React.Fragment key={step}>
                        {/* Step Item */}
                        <div className={clsx(
                            "flex items-center",
                            isVertical ? "w-full min-h-[60px] relative" : "flex-col flex-1"
                        )}>
                            {/* Circle */}
                            <div className={clsx(
                                "flex-shrink-0 flex items-center justify-center font-bold transition-all z-10",
                                isVertical ? "w-10 h-10 mr-4" : "w-12 h-12 mb-2",
                                step < currentStep && "bg-primary text-primary-foreground",
                                step === currentStep && "bg-primary text-primary-foreground ring-4 ring-primary/20",
                                step > currentStep && "bg-muted text-muted-foreground"
                            )}>
                                {step < currentStep ? (
                                    <Check className={isVertical ? "w-5 h-5" : "w-6 h-6"} />
                                ) : (
                                    <span>{step}</span>
                                )}
                            </div>

                            {/* Title */}
                            <div className={clsx(
                                "font-medium transition-colors",
                                isVertical ? "text-left text-sm" : "text-center text-xs sm:text-sm px-2",
                                step === currentStep ? "text-primary font-bold" : "text-gray-500",
                                step < currentStep && "text-gray-700 dark:text-gray-300"
                            )}>
                                {stepTitles[index]}
                            </div>

                            {/* Vertical Connector Line (Absolute) */}
                            {isVertical && index < totalSteps - 1 && (
                                <div className={clsx(
                                    "absolute top-10 left-5 w-0.5 h-[calc(100%-10px)] -translate-x-1/2",
                                    step < currentStep ? "bg-primary" : "bg-gray-200 dark:bg-gray-700"
                                )}></div>
                            )}
                        </div>

                        {/* Horizontal Connector Line */}
                        {!isVertical && index < totalSteps - 1 && (
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
