"use client";
import React, { Suspense, useEffect, useState } from "react";
import Loading from "./loading";
import AppSidebar from "@/components/sidebar-layout";
import { useSelector } from "react-redux";
// import Footer from "@/components/Footer";
import Header from "@/components/dasboard-header";

const Layout = ({ children }) => {
  // const [authToken, setAuthToken] = useState("");
  // const [user, setUser] = useState("");
  // const token = useSelector((state) => state.auth.token);
  // const userDetails = useSelector((state) => state.auth.user);

  // useEffect(() => {
  //   setAuthToken(token);
  //   setUser(userDetails);
  // }, [token, userDetails]);

  const breadcrumb = [{ name: "Worker" }, { name: "Dashboard" }];

  return (
    <>
      <Header />
      <div className="flex flex-col h-screen">
        <AppSidebar breadcrumb={breadcrumb}>
          <div className="flex flex-1">
            <Suspense fallback={<Loading />}>{children}</Suspense>
          </div>
        </AppSidebar>
      </div>
    </>
  );
};

export default Layout;
