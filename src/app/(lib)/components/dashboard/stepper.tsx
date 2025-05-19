"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Fragment, type FC } from "react";

interface StepperProps {
  steps: string[];
  activeStep: number;
}

const Stepper: FC<StepperProps> = ({ steps, activeStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-full ${
                  index <= activeStep
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                <AnimatePresence mode="wait">
                  {index < activeStep ? (
                    <motion.div
                      key="check"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <CheckCircle className="h-6 w-6" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key={`step-${index}`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      {index + 1}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="mt-2 text-sm">{step}</div>
            </div>
            {index < steps.length - 1 && (
              <div className="h-1 flex-1 bg-gray-200">
                <motion.div
                  className="h-full bg-indigo-600"
                  initial={{ width: "0%" }}
                  animate={{ width: index < activeStep ? "100%" : "0%" }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
