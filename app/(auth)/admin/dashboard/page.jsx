"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AdminDashboardCount } from "./api";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Clock, ArrowBigRight, ArrowRight } from "lucide-react";
import { Users, Briefcase, FileCheck } from "lucide-react";
import Image from "next/image";
import BackgroundImg from "@/assets/bg_img_1.jpg";

const Dashboard = () => {
  const [counts, setCounts] = useState({
    TotalGigApplicationCount: 0,
    TotalUdinGeneratedCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await AdminDashboardCount();

      if (data?.data) {
        setCounts({
          TotalGigApplicationCount: data?.data.totalGigApplicationCount,
          TotalUdinGeneratedCount: data?.data.totalUdinGeneratedCount,
        });
      }
    };

    fetchData();
  }, []);

  const stats = [
    // {
    //   title: "No of Registered GIG Workers",
    //   value: counts.TotalRegisteredGigWorkerCount,
    //   icon: <Users size={30} className="opacity-70" />,
    //   bgColor: "bg-[#78B3CE]",
    //   url: "/admin/gig-workers-tbl",
    // },
    {
      title: "Total GIG Workers Applied",
      value: counts.TotalGigApplicationCount,
      icon: <Briefcase size={30} className="opacity-70" />,
      bgColor: "bg-[#DEAA79]",
      url: "/admin/gig-workers-applied-tbl",
    },
    {
      title: "Total UDIN Generated",
      value: counts.TotalUdinGeneratedCount,
      icon: <FileCheck size={30} className="opacity-70" />,
      bgColor: "bg-[#8967B3]",
      url: "/admin/udin-generation-tbl",
    },
  ];

  return (
    <div className="w-full flex justify-center px-4 py-6">
      <Image
        src={BackgroundImg}
        alt="Background Image"
        objectFit="cover"
        className="absolute opacity-10 inset-0 mt-[3rem] -z-2"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {stats.map((stat, index) => (
          <Card
            key={index}
            className={`w-full p-4 text-white shadow-lg rounded-xl transform transition-all hover:ring-2 hover:ring-white hover:shadow-2xl ${stat.bgColor}`}
          >
            <CardContent className="p-3 flex flex-col justify-between h-full">
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">{stat.value}</p>
                {stat.icon}
              </div>
              <p className="text-sm mt-2 font-medium">{stat.title}</p>
              <Link href={stat.url}>
                <div className="mt-3 text-white/80 text-xs flex items-center gap-1 cursor-pointer hover:text-white">
                  Click here{" "}
                  <span className="text-white">
                    <ArrowRight />
                  </span>
                </div>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
