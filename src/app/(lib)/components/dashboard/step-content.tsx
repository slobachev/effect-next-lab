import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, ShoppingCart } from "lucide-react";
import { type FC } from "react";

const steps = ["Cart", "Shipping", "Payment", "Confirmation"];

const mockCartItems = [
  { id: 1, name: "Wireless Earbuds", price: 79.99, quantity: 1 },
  { id: 2, name: "Smartphone Case", price: 19.99, quantity: 2 },
  { id: 3, name: "USB-C Cable", price: 9.99, quantity: 3 },
];

const mockShippingForm = [
  { label: "Full Name", type: "text", placeholder: "John Doe" },
  { label: "Address", type: "text", placeholder: "123 Main St" },
  { label: "City", type: "text", placeholder: "New York" },
  { label: "Zip Code", type: "text", placeholder: "10001" },
];

const mockPaymentForm = [
  { label: "Card Number", type: "text", placeholder: "1234 5678 9012 3456" },
  { label: "Expiration Date", type: "text", placeholder: "MM/YY" },
  { label: "CVV", type: "text", placeholder: "123" },
];

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.5 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

interface StepContentProps {
  activeStep: number;
}

const StepContent: FC<StepContentProps> = ({ activeStep }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeStep}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="bg-white shadow sm:rounded-lg"
      >
        <div className="px-4 py-5 sm:p-6">
          <h3 className="mb-4 text-lg font-medium leading-6 text-gray-900">
            {steps[activeStep]}
          </h3>
          {activeStep === 0 && (
            <motion.div className="space-y-4">
              {mockCartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between border-b pb-2"
                >
                  <div className="flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5 text-green-600" />
                    <span>{item.name}</span>
                  </div>
                  <div>
                    <span className="font-medium">${item.price}</span>
                    <span className="ml-2 text-sm text-gray-500">
                      x{item.quantity}
                    </span>
                  </div>
                </motion.div>
              ))}
              <motion.div
                variants={itemVariants}
                className="mt-4 text-right text-xl font-bold"
              >
                Total: $
                {mockCartItems
                  .reduce(
                    (total, item) => total + item.price * item.quantity,
                    0,
                  )
                  .toFixed(2)}
              </motion.div>
            </motion.div>
          )}
          {activeStep === 1 && (
            <motion.div className="space-y-4">
              {mockShippingForm.map((field, index) => (
                <motion.div
                  key={field.label}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
          {activeStep === 2 && (
            <motion.div className="space-y-4">
              {mockPaymentForm.map((field, index) => (
                <motion.div
                  key={field.label}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                >
                  <label className="block text-sm font-medium text-gray-700">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50"
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
          {activeStep === 3 && (
            <motion.div
              className="flex flex-col items-center justify-center space-y-4"
              variants={containerVariants}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20,
                }}
              >
                <CheckCircle className="h-16 w-16 text-green-500" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-xl font-medium"
              >
                Order confirmed!
              </motion.span>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="text-center text-gray-600"
              >
                Thank you for your purchase. Your order will be shipped soon.
              </motion.p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StepContent;
