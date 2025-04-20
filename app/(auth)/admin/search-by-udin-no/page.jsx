"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { downloadUdinCerificate } from "@/app/gen-udin/api";
import { Download, Loader2 } from "lucide-react";
import Image from "next/image";
import BackgroundImg from "@/assets/bg_img_1.jpg";
const UdinGeneratedDtlsTable = () => {
  const [filters, setFilters] = useState({
    udin_no: "",
  });
  const [loading, setLoading] = useState(false);

  const handleDownloadUDIN = async (udin_no) => {
    setLoading(true);
    toast({
      title: "Downloading...",
      description: `Fetching UDIN Certificate #${udin_no}`,
    });

    try {
      const response = await downloadUdinCerificate(udin_no);
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
      a.download = `UDIN_Certificate_${udin_no}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "Download Successful",
        description: `Certificate #${udin_no} downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!filters.udin_no.trim()) {
      toast({ title: "Error", description: "Please enter a valid UDIN number", variant: "destructive" });
      return;
    }
    await handleDownloadUDIN(filters.udin_no);
  };

  const handleChange = (e) => {
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="px-6 py-6 w-full flex justify-center">
       <Image
                    src={BackgroundImg}
                    alt="Background Image"
                    objectFit="cover"
                    className="absolute opacity-10 inset-0 mt-[3rem] -z-2"
                  />
      <Card className="w-full max-w-6xl z-10">
        <div className="bg-gradient-to-r from-violet-600 to-amber-600 rounded-t-xl p-6">
          <h2 className="text-2xl font-bold text-white">Download UDIN Certificate</h2>
        </div>
        <CardContent className="flex flex-col items-center justify-center">
          <div className="flex items-center gap-4 my-7">
          <label className="text-gray-700" htmlFor="udin_no">UDIN Number:</label>
            <Input
              type="text"
              name="udin_no"
              placeholder="Enter UDIN Number"
              className="w-80"
              value={filters.udin_no || ""}
              onChange={handleChange}
            />
             <Button onClick={handleSearch} disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
              {loading ? <Loader2 className="animate-spin" /> : <><Download className="mr-2" /> Download</>}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UdinGeneratedDtlsTable;