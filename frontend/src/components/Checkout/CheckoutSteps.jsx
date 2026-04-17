import React from 'react'
import styles from '../../styles/style'

const CheckoutSteps = ({ active }) => {
  const steps = ["Shipping", "Payment", "Success"];

  return (
    <div className="w-full flex justify-center py-6">
      <div className="flex items-center">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = active > stepNumber;
          const isCurrent = active === stepNumber;

          return (
            <div key={index} className="flex items-center">
              {/* Step Circle + Label */}
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors
                  ${isCompleted ? "bg-teal-600 text-white"
                    : isCurrent ? "bg-teal-600 text-white"
                    : "bg-gray-100 text-gray-400"}`}>
                  {isCompleted ? (
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : stepNumber}
                </div>
                <span className={`text-xs font-medium whitespace-nowrap
                  ${isCompleted || isCurrent ? "text-teal-600" : "text-gray-400"}`}>
                  {step}
                </span>
              </div>

              {/* Connector line between steps */}
              {index < steps.length - 1 && (
                <div className={`w-[50px] 800px:w-[90px] h-[2px] mx-2 mb-5 rounded-full transition-colors
                  ${active > stepNumber ? "bg-teal-600" : "bg-gray-200"}`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutSteps