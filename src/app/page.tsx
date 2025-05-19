"use client";

import { Effect, Fiber, Schedule, Stream } from "effect";
import { useEffect, useState } from "react";
import NavigationButtons from "./(lib)/components/dashboard/nav-buttons";
import StepContent from "./(lib)/components/dashboard/step-content";
import Stepper from "./(lib)/components/dashboard/stepper";
import { AppRuntime } from "./(lib)/runtimes/app-runtime";
import { StepperService } from "./(lib)/services/stepper-service";
import TopNavigationBar from "./(lib)/components/top-nav-bar";

const steps = ["Cart", "Shipping", "Payment", "Confirmation"];

export default function HomePage() {
  const [activeStep, setActiveStep] = useState(0);

  // updates the active step when the stepper service changes
  useEffect(() => {
    const fiber = AppRuntime.runFork(
      Effect.gen(function* (_) {
        const stepperService = yield* _(StepperService);
        yield* _(
          stepperService.stepStream.pipe(
            Stream.tap((step) => Effect.sync(() => setActiveStep(step))),
            Stream.tap((step) => Effect.log("Received step:", step)),
            Stream.runDrain,
          ),
        );
      }).pipe(Effect.annotateLogs({ background: "task" })),
    );

    return () => {
      void AppRuntime.runPromise(Fiber.interrupt(fiber));
    };
  }, []);

  // periodically logs the current step
  useEffect(() => {
    const fiber = AppRuntime.runFork(
      Effect.gen(function* (_) {
        const stepperService = yield* _(StepperService);

        yield* _(
          Effect.repeat(
            Effect.gen(function* (_) {
              const currentStep = yield* _(stepperService.getStep);
              yield* _(
                Effect.log(`Current step: ${currentStep}`).pipe(
                  Effect.annotateLogs({ background: "task" }),
                ),
              );
            }),
            Schedule.spaced("5 seconds"),
          ),
        );
      }),
    );

    return () => {
      void AppRuntime.runPromise(Fiber.interrupt(fiber));
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation Bar */}
      <TopNavigationBar />

      {/* Main Content */}
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="mb-8 text-3xl font-bold text-gray-900">
            Checkout Process
          </h1>

          {/* Stepper */}
          <Stepper steps={steps} activeStep={activeStep} />

          {/* Step Content */}
          <StepContent activeStep={activeStep} />

          {/* Navigation Buttons */}
          <NavigationButtons steps={steps} activeStep={activeStep} />
        </div>
      </main>
    </div>
  );
}
