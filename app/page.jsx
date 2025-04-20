"use client";

import Header from "../components/Header";
import Hero from "../components/Hero";
import Footer from "../components/Footer";
import Cookies from "react-cookies";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner"
import { getLandingPageDetailsAPI } from "./workers-registration-form/api";

export default function Home() {
  const [landingPageDetails, setLandingPageDetails] = useState({});
  useEffect(() => {
    Cookies.remove("aadhaar_no");
    Cookies.remove("access_token");
    Cookies.remove("address");
    Cookies.remove("aid");
    Cookies.remove("apiToken");
    Cookies.remove("application_no");
    Cookies.remove("authority_id");
    Cookies.remove("authority_user_desigantion");
    Cookies.remove("authority_user_id");
    Cookies.remove("authority_user_type_id");
    Cookies.remove("base64Credentials");
    Cookies.remove("boundary_id");
    Cookies.remove("boundary_level_id");
    Cookies.remove("boundary_name");
    Cookies.remove("dob");
    Cookies.remove("gender");
    Cookies.remove("name");
    Cookies.remove("otpToken");
    Cookies.remove("step");
    Cookies.remove("udin_token");
    Cookies.remove("uid");
    Cookies.remove("user_type");
    Cookies.remove("user_type_id");
    localStorage.clear();
  }, []);

  useEffect(() => {
    const getLandingPageDetails = async () => {
      try {
        const result = await getLandingPageDetailsAPI();
        setLandingPageDetails(result?.data || null)
      } catch (error) {
        console.log(error);
      }
    };

    getLandingPageDetails();

  }, []);

  return (
    <div className="min-h-screen bg-yellow-400 font-sans">
      <Hero landingPageDetails={landingPageDetails} />
    </div>
  );
}
