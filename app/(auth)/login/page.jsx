"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import LoginPage from "@/components/LoginPage";
import Cookies from "react-cookies";

const Page = () => {

  return <LoginPage />;
};

export default Page;
