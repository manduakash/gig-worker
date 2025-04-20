"use client";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  ArrowRight,
  BadgeCheck,
  FilePen,
  MoveRight,
  FileDown,
  Download,
  Loader2,
  CheckCircle2,
  Eye,
  IdCard,
} from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardData } from "./api";
import Cookies from "react-cookies";
import Image from "next/image";
import BackgroundImg from "@/assets/bg_img_1.jpg";
import { Button } from "@/components/ui/button";
import { downloadUdinCerificate } from "@/app/gen-udin/api";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  const [step, setStep] = useState(0);
  const [udinNo, setUdinNo] = useState("");
  const [applicationNo, setApplicationNo] = useState("");

  const cardData = [
    {
      title: "Register for Certificate",
      subtitle: "Apply new GIG worker's application",
      value: "40",
      icon: FileText,
      color: "bg-[#51829B]",
      link: "/workers-registration-form",
      type: "pre-udin",
      step: [0],
    },
    {
      title: "Update Application",
      subtitle: "Update existing GIG worker's application",
      value: "40",
      icon: FilePen,
      color: "bg-[#DEAA79]",
      link: "/workers-registration-form",
      type: "pre-udin",
      step: [1, 2, 3, 4, 5, 6],
    },
    {
      title: "Generate Certificate",
      subtitle: "Generate certificate against GIG worker's application",
      value: "40",
      icon: BadgeCheck,
      color: "bg-[#A594F9]",
      link: "/gen-udin",
      type: "pre-udin",
      step: [6],
    },
    {
      title: "View Registration",
      subtitle: `Registration No: ${applicationNo || "N/A"}`,
      value: "40",
      icon: Eye,
      color: "bg-[#295F98]",
      link: "/workers-registration-form",
      type: "application-view",
      step: ["post-udin"],
    },
    {
      title: "Download Certificate",
      subtitle: "",
      value: "40",
      icon: FileDown,
      color: "bg-[#A594F9]",
      link: "#",
      type: "udin-download",
      step: ["post-udin"],
    },
    {
      title: "Generate Registration Card",
      subtitle: "",
      value: "40",
      icon: IdCard,
      color: "bg-[#DEAA79]",
      link: "/id-card",
      type: "application-view",
      step: ["post-udin"],
    },
  ];

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData();
        Cookies.save("application_no", data?.data[0]?.application_no || "");
        setApplicationNo(data?.data[0]?.application_no || "");
        Cookies.save("aid", data?.data[0]?.application_id || 0);
        Cookies.save("step", data?.data[0]?.form_step || 0);
        Cookies.save("bank_details_visibility", data?.data[0]?.bank_details_visibility || 0);
        Cookies.save("personal_vehicle_visibility", data?.data[0]?.personal_vehicle_visibility || 0);
        Cookies.save(
          "uno",
          data?.data[0]?.udin_no ? btoa(data?.data[0]?.udin_no) : ""
        );
        setUdinNo(data?.data[0]?.udin_no || "");

        setStep(data?.data[0]?.form_step || 0);

        if (data?.data[0]?.udin_no) {
          setStep("post-udin");
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);
  const handleDownloadUDIN = async (udinNo) => {
    setLoading(true);
    toast({
      variant: "success",
      title: "Downloading...",
      description: `Fetching UDIN Certificate #${udinNo}`,
    });

    try {
      const response = await downloadUdinCerificate(udinNo);
      const base64Data = response?.data?.doc_base64?.replace(
        /^data:application\/pdf;base64,/,
        ""
      );
      if (!base64Data) throw new Error("Invalid document data");

      const byteCharacters = atob(base64Data);
      const byteNumbers = new Uint8Array(
        [...byteCharacters].map((char) => char.charCodeAt(0))
      );
      const blob = new Blob([byteNumbers], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `UDIN_Certificate_${udinNo}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        variant: "success",
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>{response?.message || "Download Successful"}</span>
          </div>
        ),
        description: `Certificate #${udinNo} downloaded.`,
      });
    } catch (error) {
      toast({
        title: (
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            <span>{response?.message || "Download Failed"}</span>
          </div>
        ),
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center px-4 py-6">
      <Image
        src={BackgroundImg}
        alt="Background Image"
        objectFit="cover"
        className="absolute opacity-10 inset-0 mt-[3rem] -z-2"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
        {cardData.map(
          (card, index) =>
            card.step.includes(step) && (
              <Card
                key={index}
                className={`w-full p-4 text-white shadow-lg rounded-xl transform transition-all hover:ring-2 hover:ring-white hover:shadow-2xl ${card.color}`}
              >
                <CardContent className="p-4 flex flex-col justify-between h-full">
                  <div className="flex items-center justify-between">
                    <p className="text-xl font-bold">{card.title}</p>
                    <card.icon size={30} className="opacity-70" />
                  </div>
                  <p className="text-xs mt-2 font-medium whitespace-pre-wrap">
                    {card?.step == "post-udin" &&
                    card?.type != "application-view"
                      ? udinNo
                      : card?.subtitle}
                  </p>
                  {card?.step == "post-udin" &&
                  card?.type != "application-view" ? (
                    <Button
                      disabled={loading}
                      onClick={() => handleDownloadUDIN(udinNo)}
                      variant="ghost"
                      className="mt-3 disabled:bg-slate-50/10 disabled:text-white bg-slate-50/10 hover:bg-slate-50/20 hover:text-white border hover:border-2 w-[100px] text-xs group"
                    >
                      {loading ? (
                        <div className="flex items-center justify-center gap-1">
                          Loading <Loader2 className="animate-spin" />
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          Download <Download />
                        </div>
                      )}
                    </Button>
                  ) : (
                    <Link
                      href={card.link}
                      className="text-sm mt-4 flex gap-1 items-center w-auto hover:underline group"
                    >
                      Click here
                      <span className="text-white">
                        <MoveRight className="group-hover:animate-pulse" />
                      </span>
                    </Link>
                  )}
                </CardContent>
              </Card>
            )
        )}
      </div>
    </div>
  );
}
