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
import Cookies from "react-cookies";
import { Toaster } from "@/components/ui/sonner";
import {
  GenerateApiToken,
  IndividualLoginOTP,
  IndividualVerifyOTP,
} from "@/app/(auth)/login/api";
import { AlertCircle, CheckCircle2, KeySquare, Loader, LoaderCircle, Smartphone } from "lucide-react";

const LoginPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [isVerifiedLoading, setIsVerifiedLoading] = useState(false);
  const [resendOtpLoading, setResendOtpLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isOtpSent && resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer); // Cleanup on unmount or when dependencies change
    }
  }, [isOtpSent, resendTimer]);

  const handleResendOtp = async () => {
    setResendOtpLoading(true);

    try {
      const response = await IndividualLoginOTP(phoneNumber);

      if (response?.status === 0) {
        setIsOtpSent(true);
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

  const handleSendOtp = async () => {
    setIsLoading(true);
    if (!phoneNumber.match(/^\d{10}$/)) {
      toast({
        variant: "destructive",
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit phone number.",
      });
      setIsLoading(false);
      return;
    }
    try {
      const response = await IndividualLoginOTP(phoneNumber);

      if (response?.status == 0) {
        toast({
          variant: "success",
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-white" />
              <span>Success!</span>
            </div>
          ),
          description: response?.message,
        });
        setIsOtpSent(true);
      } else {
        toast({
          variant: "destructive",
          title: (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>Failed to login!</span>
            </div>
          ),
          description: response?.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>Error</span>
          </div>
        ),
        description: "Failed to send OTP.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setIsVerifiedLoading(true);

    if (!otp.match(/^\d{6}$/)) {
      toast({
        variant: "destructive",
        title: "Invalid OTP",
        description: "Enter a valid 6-digit OTP.",
      });
      setIsVerifiedLoading(false);
      return;
    }

    try {
      // 1. Verify OTP First
      const verifyResponse = await IndividualVerifyOTP(phoneNumber, otp);

      if (!verifyResponse?.status == 0) {
        toast({
          variant: "destructive",
          title: "OTP Verification Failed",
          description:
            verifyResponse?.message || "Incorrect OTP. Please try again.",
        });
        setIsVerifiedLoading(false);
        return;
      }

      // 2. Generate API Token After Successful OTP Verification
      const base64_creds = btoa(`${phoneNumber}:${otp}`);
      const tokenResponse = await GenerateApiToken(base64_creds);

      if (!tokenResponse?.status == 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to verify otp.",
        });
        setIsVerifiedLoading(false);
        return;
      }

      // 3. Store API Token in Cookies
      Cookies.save("access_token", tokenResponse?.data?.access_token, {
        secure: true,
        sameSite: "Strict",
      });

      // 4. Show Success Message & Redirect
      toast({
        title: "Login Successful",
        description: "Redirecting to dashboard...",
      });

      setTimeout(() => {
        router.push("/worker-dashboard");
      }, 1000); // Small delay to ensure token is set
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsVerifiedLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-grow items-center justify-center relative">
        <Image
          src={BannerLogo}
          alt="Hero Banner"
          fill
          className="absolute object-cover blur-[2px]"
        />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <Card className="w-96 h-auto shadow-lg p-6 rounded-2xl bg-gray-100 z-10">
          <CardContent>
            <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  maxLength={10}
                  disabled={isOtpSent}
                />
              </div>
              <Button
                onClick={handleSendOtp}
                disabled={isLoading || isOtpSent}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-1">
                    <Loader className="animate-spin" />
                    Sending OTP...
                  </div>
                ) : (
                  <span className="flex items-center justify-center gap-1"><Smartphone />Send OTP</span>
                )}
              </Button>
              {isOtpSent && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      OTP
                    </label>
                    <Input
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter OTP"
                      maxLength={6}
                    />
                  </div>
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={isVerifiedLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isVerifiedLoading ? (
                      <div className="flex items-center justify-center gap-1">
                        <Loader className="animate-spin" />
                        Verifying OTP...
                      </div>
                    ) : (
                      <span className="flex items-center justify-center gap-1"><KeySquare />Verify OTP</span>
                    )}
                  </Button>

                  <div>
                    {resendTimer == 0 ? (
                      <div className="flex gap-2 justify-center items-center text-sm">
                        Didn't receive the OTP?
                        <Button
                          onClick={handleResendOtp}
                          disabled={resendOtpLoading}
                          variant="link"
                          className="text-blue-500 py-0 px-1"
                        >
                          {resendOtpLoading ? "Sending..." : "Resend OTP"}
                        </Button>
                      </div>
                    ) : (
                      <span className="text-center mb-2 text-sm flex justify-center mt-5 items-center gap-1 whitespace-pre-wrap">
                        {`Didn't receive the OTP? \nYou can resend after ${resendTimer} seconds.`}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
