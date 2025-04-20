import {
  BriefcaseBusiness,
  CarIcon,
  Check,
  CheckCheckIcon,
  CheckCircleIcon,
  GraduationCap,
  Landmark,
  Upload,
  UserIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Cookies from "react-cookies";

export default function Stepper({ currentStep, setCurrentStep, formStep }) {
  const steps = [1, 2, 3, 4, 5, 6];
  const [savedStep, setSavedStep] = useState(1);
  const [isBankDetailsVisible, setIsBankDetailsVisible] = useState(1);

  useEffect(() => {
    const savedStep_cookie = Cookies.load("step") || 0;
    const bank_details_visibility = Cookies.load("bank_details_visibility");
    setIsBankDetailsVisible(bank_details_visibility)
    setSavedStep(savedStep_cookie);
  }, [currentStep]);

  const stepTooltips = [
    "Personal Information",
    "Vehicle Details",
    "Education Details",
    "Work Experience",
    "Bank Details",
    "Upload Documents",
  ];

  return (
    <TooltipProvider>
      <div className="flex justify-center my-[16px]">
        {steps?.map((step, index) => (

          isBankDetailsVisible == 0 && step == 5 ? null :
            <div className="flex justify-center items-center" key={step}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => setCurrentStep(step)}
                    className={`flex items-center justify-center mx-2 w-8 h-8 rounded-full cursor-pointer text-slate-700 ring-1 ring-slate-300 transition-colors ${currentStep === index + 1
                      ? "bg-blue-300"
                      : "bg-transparent hover:bg-violet-100 hover:text-violet-600"
                      } ${savedStep > index + 1 ? "bg-green-200" : ""}`}
                  >
                    {savedStep >= step ? (
                      <Check size={16} />
                    ) : step === 1 ? (
                      <UserIcon size={16} />
                    ) : step === 2 ? (
                      <CarIcon size={16} />
                    ) : step === 3 ? (
                      <GraduationCap size={16} />
                    ) : step === 4 ? (
                      <BriefcaseBusiness size={16} />
                    ) : step === 5 ? (
                      <Landmark size={16} />
                    ) : (
                      <Upload size={16} />
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" align="center">
                  {stepTooltips[index]}
                </TooltipContent>
              </Tooltip>

              {index !== steps.length - 1 && (
                <div className="h-[1px] w-16 bg-slate-400"></div>
              )}
            </div>
        ))}
      </div>
    </TooltipProvider>
  );
}
