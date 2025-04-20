"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  AlertTriangle,
  CircleAlert,
  Loader2,
  LoaderCircle,
} from "lucide-react";
import Cookies from "react-cookies";
import {
  uploadSendOtp,
  uploadVerifyOtp,
  generateCertificateByApplicationID,
  downloadUdinCerificate,
} from "./api";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import BackgroundImg from "@/assets/bg_img_1.jpg";

const Page = () => {
  const { toast } = useToast();
  const [applicationNo, setApplicationNo] = useState(null);
  const [gig_worker_name, setGigWokerName] = useState(null);
  const [AADHAAR, setAADHAAR] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [loadingGenerateUDIN, setLoadingGenerateUDIN] = useState(false);
  const [loadingDownloadUDIN, setLoadingDownloadUDIN] = useState(false);
  const [certificateGenerated, setCertificateGenerated] = useState(false);
  const [udinNo, setUdinNo] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [base64Udin, setBase64Udin] = useState("");
  const [AADHAARError, setAADHAARError] = useState("");
  const [validAADHAARMsg, setValidAADHAARMsg] = useState("");
  const [resendTimer, setResendTimer] = useState(60);
  const [hydrated, setHydrated] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const application_no = Cookies.load("application_no") || "-";
    const gig_worker_name = Cookies.load("gig_worker_name") || "-";
    const udin_no = Cookies.load("udin_no");
    const pic = localStorage.getItem("pic");

    setApplicationNo(application_no);
    setUdinNo(udin_no);
    setGigWokerName(gig_worker_name);
  }, []);
  
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Timer for resend OTP
  useEffect(() => {
    if (otpSent) {
      const timer = setInterval(() => {
        if (resendTimer > 0) {
          setResendTimer(resendTimer - 1);
        } else {
          clearInterval(timer);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [otpSent, resendTimer]);

  const sendOtp = async () => {
    const aadhaarNumber = AADHAAR.split("-").join(""); // Clean the AADHAAR number

    // Validate if the AADHAAR number is 12 digits and contains only numbers
    if (aadhaarNumber.length !== 12 || !/^\d{12}$/.test(aadhaarNumber)) {
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>Invalid AADHAAR Number</span>
          </div>
        ),
        description: "Please enter a valid 12-digit numeric AADHAAR number.",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await uploadSendOtp(aadhaarNumber); // Use the cleaned aadhaarNumber

      if (data?.status === 0) {
        setOtpSent(true);
        setTransactionId(data?.data?.transaction_id);
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>OTP Sent!</span>
            </div>
          ),
          description: "An OTP has been sent to your AADHAAR-linked phone.",
        });

        // Simulate delay for OTP sending before resetting states
        setTimeout(() => {
          setLoading(false); // Stop loading state
          setResendTimer(60); // Reset timer after sending OTP
        }, 2000); // Mock delay of 2 seconds
      } else {
        throw new Error(data.message || "Failed to send OTP.");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>OTP Sending Failed</span>
          </div>
        ),
        description:
          error.message || "An unexpected error occurred while sending OTP.",
      });
    } finally {
      // Ensure loading is stopped, even if an error occurs
      if (!loading) {
        setLoading(false);
      }
    }
  };

  // Verify OTP
  const verifyOtp = async () => {
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>Invalid OTP</span>
          </div>
        ),
        description: "Please enter a valid 6-digit OTP.",
      });
      return;
    }

    setOtpLoading(true);
    try {
      const data = await uploadVerifyOtp(otp, transactionId);

      if (data.status === 0) {
        setOtpVerified(true);
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>OTP Verified!</span>
            </div>
          ),
          description: "Your OTP has been successfully verified.",
        });
      } else {
        throw new Error(data.message || "Failed to verify OTP.");
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>OTP Verification Failed</span>
          </div>
        ),
        description: error.message,
      });
    } finally {
      setOtpLoading(false);
    }
  };
  // Generate UDIN Certificate
  const generateUDINCertificate = async () => {
    setLoadingGenerateUDIN(true);
    try {
      const response = await generateCertificateByApplicationID();

      if (response?.status === 0) {
        setCertificateGenerated(true);
        setUdinNo(response?.data?.udin_number);
        toast({
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <span>UDIN Certificate Generated!</span>
            </div>
          ),
          description: "Your UDIN certificate has been generated successfully.",
        });
      } else {
        throw new Error(
          response.message || "Failed to generate UDIN certificate."
        );
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            <span>UDIN Generation Failed</span>
          </div>
        ),
        description: error.message,
      });
    } finally {
      setLoadingGenerateUDIN(false);
    }
  };

  const downloadUdinCertificate = async () => {
    if (!udinNo) {
      toast({
        variant: "destructive",
        title: "UDIN Not Available",
        description: "No UDIN found to download the certificate.",
      });
      return;
    }

    setLoadingDownloadUDIN(true);
    try {
      const data = await downloadUdinCerificate(udinNo);


      setBase64Udin(data?.data?.doc_base64);

      if (data.status == 0) {
        toast({
          title: "Download Successful",
          description: "The UDIN certificate has been downloaded.",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Download Failed",
          description: data?.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: error.message,
      });
    } finally {
      setLoadingDownloadUDIN(false);
    }
  };

  const handleAadharChange = (input) => {
    // Remove non-numeric characters
    let numericInput = input.replace(/\D/g, "");

    // Format the input as xxxx-xxxx-xxxx
    console.log("numericInput", AADHAAR.split("-").join("").length);
    let formattedAADHAAR = numericInput
      .slice(0, 12)
      .replace(/(\d{4})(\d{4})?(\d{4})?/, (match, p1, p2, p3) =>
        [p1, p2, p3].filter(Boolean).join("-")
      );

    setAADHAAR(formattedAADHAAR);
    if (formattedAADHAAR.split("-").join("").length != 12) {
      setAADHAARError("Please enter 12-digit valid AADHAAR number");
      setValidAADHAARMsg("");
    } else {
      setAADHAARError("");
      setValidAADHAARMsg("Valid AADHAAR Number");
    }
  };
  useEffect(() => {
    setHydrated(true);
  }, []);
  return (
    <div className="w-full flex justify-center px-4 py-6 bg-transparent relatives">
      <Image
        src={BackgroundImg}
        alt="Background Image"
        objectFit="cover"
        className="absolute opacity-10 inset-0 mt-[3rem] -z-2"
      />
      <div className="px-6 py-2 justify-center flex w-full z-1 relative">
        <Card className="w-[70vw] max-w-6xl mx-auto">
          <div className="my-0 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden min-h-[200px]">
            <div className="bg-gradient-to-r from-violet-600 to-amber-600 px-6 py-3 mb-3">
              <h2 className="text-2xl font-bold text-white">
                Generate UDIN Certificate
              </h2>
            </div>

            <CardContent className="flex flex-col justify-center p-4">
              <span className="text-xl text-center text-muted-foreground">
                Application Number:{" "}
                <b>{applicationNo !== null ? applicationNo : "-"}</b>
              </span>

              <div className="min-h-[50vh] w-full rounded-md flex flex-col items-center gap-4 mt-6">
                {!otpSent ? (
                  <>
                    <div className="flex">
                      <Input
                        type="text"
                        placeholder="Enter AADHAAR Number (XXXX-XXXX-1234)"
                        value={AADHAAR}
                        onChange={(e) => handleAadharChange(e.target.value)}
                        className={`w-80 rounded-e-none focus-visible:ring-none ${
                          AADHAARError
                            ? "border-red-400 border-2"
                            : validAADHAARMsg
                            ? "border-green-400 border-2"
                            : "border"
                        }`}
                      />
                      <Button
                        onClick={sendOtp}
                        disabled={loading}
                        className="bg-blue-500 rounded-md rounded-s-none hover:bg-blue-600 text-white w-40"
                      >
                        {loading ? (
                          <div className="flex justify-center items-center gap-1">
                            <Loader2 className="animate-spin" />
                            Sending...
                          </div>
                        ) : (
                          "Send OTP"
                        )}
                      </Button>
                    </div>
                    {AADHAARError && (
                      <span className="text-red-500 flex justify-center items-center gap-1 font-mono">
                        <AlertTriangle size={18} />
                        {AADHAARError}
                      </span>
                    )}
                    {validAADHAARMsg && (
                      <span className="text-green-600 flex justify-center items-center gap-1 font-mono">
                        <CheckCircle2 size={18} />
                        {validAADHAARMsg}
                      </span>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-4 mt-6">
                    {otpSent ? (
                      <>
                        <div className="flex">
                          <Input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            maxLength={6}
                            className="w-80 text-center rounded-e-none"
                          />
                          <Button
                            onClick={verifyOtp}
                            disabled={otpLoading}
                            className="bg-green-500 hover:bg-green-700 rounded-s-none text-white w-40"
                          >
                            {otpLoading ? (
                              <div className="flex justify-center items-center gap-1">
                                <Loader2 className="animate-spin" />
                                Verifying...
                              </div>
                            ) : (
                              "Verify OTP"
                            )}
                          </Button>
                        </div>

                        <p className="whitespace-pre-wrap text-center text-sm">
                          {hydrated &&
                            (resendTimer !== 0 ? (
                              `Didn't receive the OTP? \nYou can resend after ${resendTimer} seconds.`
                            ) : (
                              <>
                                Didn't receive the OTP?
                                <Button
                                  variant="link"
                                  onClick={sendOtp}
                                  className="text-blue-500 font-bold px-1"
                                  disabled={loading || resendTimer > 0}
                                >
                                  {loading ? (
                                    <>
                                      Please wait...{" "}
                                      <LoaderCircle className="animate-spin" />
                                    </>
                                  ) : (
                                    <>Resend OTP</>
                                  )}
                                </Button>
                              </>
                            ))}
                        </p>
                      </>
                    ) : null}
                  </div>
                )}

                <div className="min-h-[50vh] w-full rounded-md flex flex-col items-center gap-4 mt-6">
                  {/* {!udinNo && !certificateGenerated && otpVerified && ( */}
                  {!certificateGenerated && otpVerified && (
                    <Button
                      onClick={generateUDINCertificate}
                      disabled={loadingGenerateUDIN}
                      variant="outline"
                      className="rounded-full ring-1 ring-violet-600 bg-violet-200 hover:bg-violet-500 hover:text-white group"
                    >
                      {loadingGenerateUDIN
                        ? "Generating UDIN Certificate..."
                        : "Generate UDIN Certificate"}
                      <ArrowRight className="text-violet-600 group-hover:animate-pulse group-hover:text-white" />
                    </Button>
                  )}
                  {/* {(udinNo || certificateGenerated) && ( */}
                  {certificateGenerated && (
                    <Button
                      variant="outline"
                      className="rounded-full ring-1 ring-violet-600 bg-violet-200 hover:bg-violet-500 hover:text-white group"
                      onClick={downloadUdinCertificate}
                      disabled={loadingDownloadUDIN}
                    >
                      {loadingDownloadUDIN
                        ? "Downloading UDIN Certificate..."
                        : "Download UDIN Certificate"}
                      <ArrowRight className="text-violet-600 group-hover:animate-pulse group-hover:text-white" />
                    </Button>
                  )}

                  {base64Udin && (
                    <iframe
                      src={`${base64Udin}`}
                      width="100%"
                      height="600px"
                      className="border-none mt-[20px]"
                    />
                  )}
                  <div className="border p-10 rounded-md bg-violet-50 shadow-sm">
                    <div className="flex flex-col gap-2 text-gray-500">
                      <b className="flex justify-center items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-violet-600" />{" "}
                        Instructions
                      </b>

                      <span className="text-start flex mr-auto font-bold">
                        Steps:
                      </span>
                      <ul className="list-item list-disc text-sm">
                        <li>
                          1. Enter your AADHAAR no. click & on send otp button.
                        </li>
                        <li>
                          2. Enter OTP that you'll get to your AADHAAR linked
                          phone no.
                        </li>
                        <li>
                          3. Generate your certificate by clicking on 'Generate
                          UDIN Certificate' button.{" "}
                        </li>
                        <li>
                          4. Download your certificate by clicking on 'Download
                          UDIN Certificate' button.{" "}
                        </li>
                      </ul>

                      <span className="text-start flex mr-auto font-bold">
                        Technical issues & Solutions:
                      </span>
                      <ul className="list-item list-disc text-sm">
                        <li>
                          Please note that the UDIN certificate generation
                          process may take a few minutes or it may be failed to
                          generate the certificate several times due to server
                          busy.
                        </li>
                        <li>
                          If you encounter any issues while sending or verifying
                          OTP or generating the certificate, please try again
                          later.
                        </li>
                        <li>
                          If you are trying to resend otp then you will have to
                          wait for 60 seconds.
                        </li>
                        <li>
                          If the problem persists, please contact the support
                          team.
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Page;
