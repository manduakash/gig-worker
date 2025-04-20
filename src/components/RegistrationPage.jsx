"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import BannerLogo from "@/assets/Landing_bg_img.webp";
import Header from "@/components/Header";
import {
  AadhaarSendOtp,
  AadhaarVerifyOtp,
  individualRegister,
} from "@/app/(auth)/registration/api";
import { AlertCircle, AlertTriangle, CheckCircle2, Clock, Loader, LoaderCircle, NotebookPen } from "lucide-react";
import { time } from "motion";
import { Label } from "./ui/label";

const RegistrationPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [aadhaar, setAadhaar] = useState(""); // Use this state for Aadhaar
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [transId, setTransId] = useState("");
  const [authPersonName, setAuthPersonName] = useState("");
  const [fullName, setfullName] = useState("");
  const [authPersonMobile, setAuthPersonMobile] = useState("");
  const [altMobileNo, setAuthPersonAltMobile] = useState("");
  const [showRegistrationFields, setShowRegistrationFields] = useState(false);
  const [resendOtpLoading, setResendOtpLoading] = useState(false);
  // Removed separate AADHAAR state to use a single state variable
  const [AADHAARError, setAADHAARError] = useState("");
  const [validAADHAARMsg, setValidAADHAARMsg] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleVerifyAadhaar = async () => {
    setLoading(true);

    // CHANGED: Remove hyphens before checking isNaN and length.
    const numericAadhaar = aadhaar.split("-").join("");
    if (isNaN(numericAadhaar) || numericAadhaar.length !== 12) {
      toast({
        variant: "destructive",
        title: "Invalid Aadhaar",
        description: "Enter a valid 12-digit Aadhaar number.",
        status: "error",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await AadhaarSendOtp(numericAadhaar);

      if (response?.status === 0) {
        toast({
          title: "OTP Sent",
          description: response?.message,
          status: "success",
        });
        setShowOtp(true);
        setTransId(response?.data?.transaction_id); // Correctly extracting transaction_id
      } else {
        toast({
          variant: "destructive",
          title: "OTP Sending Failed",
          description: response?.message || "Something went wrong",
          status: "error",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to send OTP. Please try again.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendOtpLoading(true);

    try {
      const response = await AadhaarSendOtp(aadhaar?.split("-")?.join(""));
      if (response?.status === 0) {
        setShowOtp(true);
        setResendTimer(60);
        toast({
          title: "OTP Sent",
          description: response?.message,
          status: "success",
        });
      } else {
        toast({
          variant: "destructive",
          title: "OTP Sending Failed",
          description: response?.message || "Something went wrong",
          status: "error",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error?.message || "Failed to resend OTP. Please try again.",
        status: "error",
      });
    } finally {
      setResendOtpLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);

    if (otp.length !== 6 || isNaN(otp)) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Enter a valid 6-digit OTP.",
        status: "error",
      });
      setLoading(false);
      return;
    }

    try {
      const response = await AadhaarVerifyOtp(transId, otp);

      if (response && response?.status === 0) {
        toast({
          title: "Success",
          description: response?.message,
          status: "success",
        });
        setAuthPersonName(response?.data?.user_full_name);
        setAuthPersonMobile(response?.message?.match(/\b\d{10}\b/)[0]);
        setShowRegistrationFields(true);
      } else {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: response?.message,
          status: "error",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to verify OTP.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const isValidIndianMobileNumber = (authPersonMobile) => {
    const indianMobileRegex = /^[6789]\d{9}$/;
    return indianMobileRegex.test(authPersonMobile);
  };

  const maskAadhaar = (aadhaar) => {
    return aadhaar.split("-").join("").length === 12
      ? `xxxxxxxx${aadhaar.slice(-4)}`
      : aadhaar;
  };

  const handleRegister = async () => {
    const maskedAadhaar = maskAadhaar(aadhaar);

    if (!authPersonMobile) {
      toast({
        title: "Error",
        description: "Please enter your mobile number.",
        status: "error",
      });
      return;
    }
    if (!isValidIndianMobileNumber(authPersonMobile)) {
      toast({
        title: "Error",
        description: "Please enter a valid Indian mobile number.",
        status: "error",
      });
      return;
    }

    try {
      const response = await individualRegister(
        fullName,
        transId,
        authPersonMobile,
        altMobileNo,
        maskedAadhaar
      );

      if (response && response?.status === 0) {
        toast({
          title: "Success",
          description: response?.message,
          status: "success",
        });
        router.push("/login");
      } else if (response?.status === false) {
        toast({
          variant: "destructive",
          title: "Failed",
          description: response?.message,
          status: "error",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Verification Failed",
          description: response?.message,
          status: "error",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error?.message || "Failed to Register.",
        status: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // CHANGED: Update the "aadhaar" state (used in OTP sending) directly.
  const handleAadharChange = (input) => {
    // Remove non-numeric characters
    let numericInput = input.replace(/\D/g, "");

    // Format the input as xxxx-xxxx-xxxx
    let formattedAADHAAR = numericInput
      .slice(0, 12)
      .replace(/(\d{4})(\d{4})?(\d{4})?/, (match, p1, p2, p3) =>
        [p1, p2, p3].filter(Boolean).join("-")
      );

    setAadhaar(formattedAADHAAR);
    if (formattedAADHAAR.split("-").join("").length !== 12) {
      setAADHAARError("Please enter 12-digit valid AADHAAR number");
      setValidAADHAARMsg("");
    } else {
      setAADHAARError("");
      setValidAADHAARMsg("Valid AADHAAR Number");
    }
  };

  useEffect(() => {
    if (showOtp) {
      const timer = setInterval(() => {
        if (resendTimer > 0) {
          setResendTimer((prev) => prev - 1);
        } else {
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showOtp, resendTimer]);

  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-grow items-center justify-center relative">
        <Image
          src={BannerLogo || "/placeholder.svg"}
          alt="Hero Banner"
          fill
          className="absolute object-cover blur-[2px]"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="flex items-center justify-center bg-gray-100 p-4">
          <Card className="w-96 h-auto shadow-lg p-6 rounded-2xl bg-gray-100 z-10">
            <CardContent className="space-y-4">
              <h2 className="text-xl font-bold text-center">
                Aadhaar Verification
              </h2>
              <div className="bg-violet-100 font-sans border border-slate-300 tracking-tighter text-sm text-slate-600 leading-[14px] text-justify p-2 rounded-md shadow-sm">
                <AlertCircle className="h-6 w-6 mx-auto text-violet-500"/> We are not storing your Aadhaar details in our system. It is used only for verification purposes during this session and is handled securely. We follow all necessary measures to protect your personal information.
              </div>
              {showRegistrationFields ? (
                <div className="mt-4">
                  <Label className="text-sm font-medium mb-2">
                    Full Name<span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter Full Name"
                    value={fullName}
                    onChange={(e) => setfullName(e.target.value)}
                    className="mb-4"
                  />

                  <Label className="text-sm font-medium mb-2">
                    Mobile Number<span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter Mobile Number"
                    value={authPersonMobile}
                    onChange={(e) => setAuthPersonMobile(e.target.value)}
                    className="mb-4 bg-gray-200 cursor-not-allowed"
                    readOnly
                  />

                  <Label className="text-sm font-medium mb-2">
                    Alternative Mobile Number <span className="text-red-500 text-lg">*</span>
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter Alternative Mobile Number"
                    value={altMobileNo}
                    onChange={(e) => setAuthPersonAltMobile(e.target.value)}
                    className="mb-4"
                  />
                  <Button
                    onClick={handleRegister}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader className="animate-spin w-5 h-5" />{" "}
                        Registering...
                      </div>
                    ) : (
                      <span className="flex gap-1 justify-center items-center"><NotebookPen /> Register</span>
                    )}
                  </Button>
                </div>
              ) : showOtp ? (
                <div>
                  <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="mb-2"
                  />
                  <Button
                    onClick={handleVerifyOtp}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader className="animate-spin w-5 h-5" /> Verifing...
                      </div>
                    ) : (
                      "Verify OTP"
                    )}
                  </Button>
                  <p className="whitespace-pre-wrap pt-3 text-center text-sm">
                    {resendTimer !== 0 ? (
                      `Didn't receive the OTP? \nYou can resend in ${resendTimer} seconds.`
                    ) : (
                      <>
                        Didn't receive the OTP?
                        <Button
                          variant="link"
                          onClick={handleResendOtp}
                          className={`text-blue-500 font-bold px-1`}
                          disabled={resendTimer === 0 ? false : true}
                        >
                          {resendOtpLoading ? (
                            <>
                              Please wait...
                              <LoaderCircle className="animate-spin" />
                            </>
                          ) : (
                            <> Resend OTP</>
                          )}
                        </Button>
                      </>
                    )}
                  </p>
                </div>
              ) : (
                <div>
                  <Input
                    type="text"
                    placeholder="AADHAAR No. (XXXX-XXXX-XXXX)"
                    value={aadhaar}
                    onChange={(e) => handleAadharChange(e.target.value)}
                    className={`w-full rounded-sm focus-visible:ring-none mb-2 ${AADHAARError
                      ? "border-red-400 border-2"
                      : validAADHAARMsg
                        ? "border-green-400 border-2"
                        : "border"
                      }`}
                  />
                  <div className="">
                    {AADHAARError && (
                      <span className="text-red-500 text-xs mb-2 flex justify-left items-center gap-1 font-mono">
                        <AlertTriangle size={18} />
                        {AADHAARError}
                      </span>
                    )}
                    {validAADHAARMsg && (
                      <span className="text-green-600 text-xs mb-2 flex justify-left items-center gap-1 font-mono">
                        <CheckCircle2 size={18} />
                        {validAADHAARMsg}
                      </span>
                    )}
                  </div>
                  <Button
                    onClick={handleVerifyAadhaar}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <Loader className="animate-spin w-5 h-5" /> Verifing...
                      </div>
                    ) : (
                      "Verify Aadhaar"
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
