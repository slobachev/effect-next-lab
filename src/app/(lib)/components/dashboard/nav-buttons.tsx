import { cn } from "@/lib/utils";
import { Effect } from "effect";
import { useState, type FC } from "react";
import { AppRuntime } from "../../runtimes/app-runtime";
import { NetworkService } from "../../services/network-service";
import { StepperService } from "../../services/stepper-service";

interface NavigationButtonsProps {
  steps: string[];
  activeStep: number;
}

const NavigationButtons: FC<NavigationButtonsProps> = ({
  steps,
  activeStep,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePrev = Effect.gen(function* (_) {
    const stepperService = yield* _(StepperService);
    const networkService = yield* _(NetworkService);
    const currentStep = yield* _(stepperService.getStep);

    setIsLoading(true);
    yield* _(networkService.simulateNetworkDelay);
    setIsLoading(false);

    if (currentStep > 0) {
      yield* _(stepperService.setStep(currentStep - 1));
    }
  });

  const handleNext = Effect.gen(function* (_) {
    const stepperService = yield* _(StepperService);
    const networkService = yield* _(NetworkService);
    const currentStep = yield* _(stepperService.getStep);

    setIsLoading(true);
    yield* _(
      networkService.simulateNetworkDelay,
      Effect.tapBoth({
        onSuccess: () => Effect.sync(() => setIsLoading(false)),
        onFailure: () =>
          Effect.flatMap(
            Effect.log("Network delay failed").pipe(
              Effect.annotateLogs({ network: "error" }),
            ),
            () => Effect.sync(() => setIsLoading(false)),
          ),
      }),
    );

    if (currentStep < steps.length - 1) {
      yield* _(stepperService.setStep(currentStep + 1));
    }
  });

  return (
    <div className="mt-8 flex justify-between">
      <button
        onClick={() => {
          void handlePrev.pipe(AppRuntime.runPromise);
        }}
        disabled={activeStep === 0 || isLoading}
        className={cn(
          "rounded-md border border-transparent px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500",
          activeStep !== 0 && "bg-green-600 text-white hover:bg-green-700",
        )}
      >
        Previous
      </button>

      <button
        onClick={() => {
          void handleNext.pipe(AppRuntime.runPromise);
        }}
        disabled={activeStep === steps.length - 1 || isLoading}
        className={cn(
          "rounded-md border border-transparent px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500",
          activeStep === steps.length - 1
            ? "cursor-not-allowed bg-gray-300 text-gray-500"
            : "bg-green-600 text-white hover:bg-green-700",
        )}
      >
        {activeStep === steps.length - 1 ? "Finish" : "Next"}
      </button>
    </div>
  );
};

export default NavigationButtons;
