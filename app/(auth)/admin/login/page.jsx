"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AdminLogin, GenerateApiToken } from "./api";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Header from "@/components/Header";
import BannerLogo from "@/assets/Landing_bg_img.webp";
import Cookies from "react-cookies";

import {
  Eye,
  EyeOff,
  LoaderCircle,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

const Page = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [userName, setUserName] = useState("");
  const [adminPassword, setadminPassword] = useState("");
  const router = useRouter();
  const { toast } = useToast();
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  useEffect(() => {
    Cookies.remove("base64Credentials");
    Cookies.remove("authority_id");
    Cookies.remove("authority_user_id");
    Cookies.remove("authority_user_type_id");
    Cookies.remove("authority_user_desigantion");
    Cookies.remove("boundary_level_id");
    Cookies.remove("boundary_id");
    Cookies.remove("boundary_name");
    setIsMounted(true);
  }, []);

  const handleLogin = async () => {
    if (!userName || !adminPassword) {
      toast({
        variant: "destructive",
        title: "Missing credentials",
        description: "Please enter both username and password.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const response = await AdminLogin(userName, adminPassword);

      if (response?.status === 0) {
        toast({
          variant: "success",
          title: (
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              <span>{response?.message || "Login Successful"}</span>
            </div>
          ),
          description: response?.message,
        });

        try {
          const base64_creds = btoa(`${userName}:${adminPassword}`);
          const tokenResponse = await GenerateApiToken(base64_creds);

          if (tokenResponse?.status !== 0) {
            throw new Error("Failed to generate API token");
          }

          Cookies.save("access_token", tokenResponse?.data?.access_token, {
            secure: true,
            sameSite: "Strict",
          });

          // toast({
          //   title: "API Token Generated",
          //   description: "Your API token has been successfully generated.",
          // });

          router.push("/admin/dashboard");
          router.refresh();
        } catch (tokenError) {
          // console.error("Token generation error:", tokenError);
          toast({
            variant: "destructive",
            title: "Failed",
            description: "Failed to login!. Try again later.",
          });
        }
      } else {
        toast({
          variant: "destructive",
          title: (
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              <span>{response?.message || "Failed to login"}</span>
            </div>
          ),
          description: "Please try again",
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred during login. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isMounted) return null;

  return (
    <div className="flex flex-col h-screen">
      <Header /> {/* Adding the Header component here */}
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
            <h2 className="text-2xl font-bold mb-4 text-center">Admin Login</h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium mb-1"
                >
                  Username
                </label>
                <Input
                  id="username"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full text-sm text-slate-600 bg-white border border-slate-300 appearance-none rounded-lg ps-3.5 pe-10 py-2.5 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                />
              </div>
              <div className="relative">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium mb-1"
                >
                  Password
                </label>
                <Input
                  id="password"
                  className="w-full text-sm text-slate-600 bg-white border border-slate-300 appearance-none rounded-lg ps-3.5 pe-10 py-2.5 outline-none focus:bg-white focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
                  value={adminPassword}
                  onChange={(e) => setadminPassword(e.target.value)}
                  type={isVisible ? "text" : "password"}
                  placeholder="Enter your password"
                  aria-label="Password"
                />
                <button
                  className="absolute right-0 flex items-center z-20 px-2.5 top-1/2 transform  cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus-visible:text-indigo-500 hover:text-indigo-500 transition-colors"
                  type="button"
                  onClick={toggleVisibility}
                  aria-label={isVisible ? "Hide password" : "Show password"}
                  aria-pressed={isVisible}
                  aria-controls="password"
                >
                  {isVisible ? (
                    <EyeOff size={20} aria-hidden="true" />
                  ) : (
                    <Eye size={20} aria-hidden="true" />
                  )}
                </button>
              </div>
              <Button
                onClick={handleLogin}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <LoaderCircle className="animate-spin mr-2" />
                ) : null}
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
