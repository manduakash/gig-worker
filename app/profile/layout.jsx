"use client";
import React, { Suspense, useEffect, useState } from "react";
import Loading from "./loading";
import AppSidebar from "@/components/sidebar-layout";
import Header from "@/components/dasboard-header";

const Layout = ({ children }) => {


  const breadcrumb = [{ name: "Worker" }, { name: "User Details" }];

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
