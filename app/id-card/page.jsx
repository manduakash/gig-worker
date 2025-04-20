"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { User, FileSignature, QrCode, Download, Printer, ImageDown, FileText } from "lucide-react";
import BackgroundImg from "@/assets/bg_img_1.jpg";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";
import qr_img from "@/assets/qr.png";
import applicant_img from "@/assets/gig_user.jpg";
import BiswaBangla from "@/assets/biswa_bangla.png";
import signature from "@/assets/Big-Signature.webp";
import { Button } from "@/components/ui/button";
import { getGigWorkerIDCardDetailsApi } from "./api";
import { Skeleton } from "@/components/ui/skeleton";

const IDCardPage = () => {
  const cardRef = useRef();
  const [workerDetails, setWorkerDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleExportPNG = async () => {
    try {
      if (!cardRef.current) {
        throw new Error("Card reference is not available.");
      }


      const dataUrl = await toPng(cardRef.current, {
        cacheBust: true,
        backgroundColor: "#ffffff", // Ensure a white background for the PNG
      });

      if (!dataUrl) {
        throw new Error("Failed to generate PNG data URL.");
      }

      const link = document.createElement("a");
      link.download = "gig_worker_id.png";
      link.href = dataUrl;
      
      link.click();
    } catch (error) {
      console.error("Failed to export PNG:", error.message || error);
      alert("An error occurred while exporting the PNG. Please try again.");
    }
  };

  const handleExportPDF = async () => {
    if (cardRef.current) {
      const dataUrl = await toPng(cardRef.current);
      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("gig_worker_id.pdf");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const response = await getGigWorkerIDCardDetailsApi();
      console.log("response", response);
      setWorkerDetails(response?.data);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col items-center w-full min-h-screen bg-gray-100 py-10">
      <Image
        src={BackgroundImg}
        alt="Background Image"
        fill
        className="object-cover absolute opacity-5 inset-0 mt-[3rem] -z-2"
      />
      <div className="p-6 w-full flex flex-col items-center justify-center mx-auto relative z-10">
        {/* Buttons */}
        {/* <div className="mb-4 flex gap-4">
          <Button
            variant="outline"
            onClick={handleExportPNG}
            className="spx-4 py-2 rounded-md flex items-center gap-2"
          >
            <ImageDown className="w-4 h-4" /> Export PNG
          </Button>
          <Button
            variant="outline"
            onClick={handleExportPDF}
            className="px-4 py-2 rounded-md flex items-center gap-2"
          >
            <FileText className="w-4 h-4" /> Export PDF
          </Button>
        </div> */}

        {/* ID Card */}
        {loading ? (
          <div className="relative border-2 border-violet-500/20 rounded-lg shadow-md p-4 w-[500px] bg-gradient-to-r from-blue-100 to-violet-200">
            <div className="flex justify-between items-center mb-2">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="w-32 h-6" />
              <Skeleton className="w-16 h-16 rounded-full" />
            </div>
            <div className="flex items-center mb-2">
              <Skeleton className="w-20 h-20 rounded-full" />
              <div className="ml-4 flex-1">
                <Skeleton className="w-full h-4 mb-2" />
                <Skeleton className="w-3/4 h-4 mb-2" />
                <Skeleton className="w-1/2 h-4 mb-2" />
                <Skeleton className="w-full h-4" />
              </div>
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="w-20 h-10" />
              <Skeleton className="w-32 h-4" />
            </div>
          </div>
        ) : (
          <div
            ref={cardRef}
            id="generate-png"
            className="relative border-2 border-violet-500/20 rounded-lg shadow-md p-4 w-[500px] bg-gradient-to-r from-blue-100 to-violet-200"
          >
            <div className="flex justify-between items-center mb-2 relative z-10">
              <Image
                src={BiswaBangla}
                alt="BiswaBangla Logo"
                width={60}
                height={60}
                className="rounded bg-transparent"
              />
              <h2 className="text-md text-center font-bold text-violet-800 leading-tight">
                GIG Worker Registration
                <br />
                Government of West Bengal
              </h2>
              {workerDetails?.base64_qr_code ? (
                <Image
                  src={`data:image/svg+xml;base64,${workerDetails?.base64_qr_code}`}
                  alt="QR Code"
                  width={56}
                  height={56}
                  className="rounded shadow-sm bg-gray-50 border-4 border-white"
                />
              ) : (
                <QrCode className="w-12 h-12 text-gray-400" />
              )}
            </div>
            <div className="flex items-center mb-2 relative z-10">
              {workerDetails?.photo_file_url ? (
                <Image
                  src={workerDetails?.photo_file_url}
                  alt="Photo"
                  width={100}
                  height={100}
                  className="w-[80px] h-[80px] rounded-full border bg-gray-50 shadow-sm ring-2 ring-violet-400 object-fit"
                />
              ) : (
                <User className="w-24 h-24 text-gray-400 border rounded-full" />
              )}
              <div className="ml-4">
                <p className="text-sm text-gray-700">
                  <strong>Name:</strong> {workerDetails?.user_full_name}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Registration No:</strong>{" "}
                  {workerDetails?.application_number}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Mobile No.:</strong> {workerDetails?.mobile_number}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Blood Group:</strong> {workerDetails?.blood_group}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Address:</strong>{" "}
                  <span className="text-xs">{workerDetails?.address}</span>
                </p>
              </div>
            </div>
            <div className="flex justify-between items-center relative z-10">
              <div>
                <p className="text-xs text-gray-500">GIG Worker's Signature</p>
                {workerDetails?.signature_file_url ? (
                  <Image
                    src={workerDetails?.signature_file_url}
                    alt="Signature"
                    width={80}
                    height={40}
                    className="border-t"
                  />
                ) : (
                  <FileSignature className="w-20 h-10 text-gray-400 border-t" />
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Issued by</p>
                <p className="text-sm font-semibold text-violet-800">
                  GIG Workers Authority
                </p>
                <p className="text-xs font-semibold text-violet-800">
                  Labour Department of West Bengal
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IDCardPage;
