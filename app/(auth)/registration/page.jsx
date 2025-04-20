"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import RegistrationPage from "@/components/RegistrationPage";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const Page = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  return <RegistrationPage />;
};

export default Page;
