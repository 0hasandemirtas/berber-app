"use client";

import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";

interface Step {
  number: number;
  title: string;
}

interface BookingStepsProps {
  currentStep: number;
  steps: Step[];
}

export function BookingSteps({ currentStep, steps }: BookingStepsProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => {
        const isCompleted = currentStep > step.number;
        const isCurrent = currentStep === step.number;

        return (
          <div key={step.number} className="flex items-center gap-2">
            <div className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                  isCompleted
                    ? "bg-primary text-primary-foreground"
                    : isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {isCompleted ? <Check className="h-4 w-4" /> : step.number}
              </div>
              <span
                className={`hidden text-sm sm:inline ${
                  isCurrent ? "font-medium" : "text-muted-foreground"
                }`}
              >
                {step.title}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-px w-8 sm:w-12 ${
                  isCompleted ? "bg-primary" : "bg-muted"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
