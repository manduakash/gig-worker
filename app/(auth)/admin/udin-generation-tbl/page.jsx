"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { getApplicationInfoByStatusIDAuthority } from "./api";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { downloadUdinCerificate } from "@/app/gen-udin/api";
import { Badge } from "@/components/ui/badge";
import moment from "moment";
import Image from "next/image";
import BackgroundImg from "@/assets/bg_img_1.jpg";
const UdinGeneratedDtlsTable = () => {
  const [isClient, setIsClient] = useState(false);
  const [data, setData] = useState([]);
  const [filters, setFilters] = useState({
    from_date: moment().subtract(1, "day").format("YYYY-MM-DD"),
    to_date: moment().subtract(1, "day").format("YYYY-MM-DD"),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [downloadingUDIN, setDownloadingUDIN] = useState(null);

  useEffect(() => {
    handleSearch();
    setIsClient(true);
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getApplicationInfoByStatusIDAuthority(
        1,
        filters.from_date,
        filters.to_date,
        8,
        2,
        1
      );

      if (result?.status === 4) {
        setError(result?.message);
        setData([]);
      } else {
        // **Filter only records where `udin_no` exists**
        const filteredData = (result?.data || []).filter(
          (item) => item?.udin_no && item?.udin_no.trim() !== ""
        );
        setData(filteredData);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadUDIN = async (udin_no) => {
    setDownloadingUDIN(udin_no);
    toast({
      title: "Downloading...",
      description: `Fetching UDIN Certificate #${udin_no}`,
    });

    try {
      const response = await downloadUdinCerificate(udin_no);

      if (!response?.data?.doc_base64) {
        throw new Error("Invalid document data");
      }

      let base64Data = response.data.doc_base64.trim();

      // Remove "data:application/pdf;base64," if present
      const base64Prefix = /^data:application\/pdf;base64,/;
      if (base64Prefix.test(base64Data)) {
        base64Data = base64Data.replace(base64Prefix, "");
      }

      // Ensure Base64 is a multiple of 4 for decoding
      while (base64Data.length % 4 !== 0) {
        base64Data += "=";
      }

      // Convert Base64 to binary
      let byteCharacters;
      try {
        byteCharacters = atob(base64Data);
      } catch (decodeError) {
        throw new Error("Error decoding Base64 string");
      }

      // Convert characters to byte array
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      // Convert to Blob
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });

      // Create and trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `UDIN_Certificate_${udin_no}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Success Toast
      toast({
        title: "Download Successful",
        description: `UDIN Certificate #${udin_no} downloaded successfully.`,
      });

    } catch (error) {
      console.error("Error downloading document:", error);
      toast({
        title: "Download Failed",
        description: error.message || "Something went wrong!",
        variant: "destructive",
      });

    } finally {
      setDownloadingUDIN(null);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  if (!isClient) return null;

  return (
    <div className="px-6 py-2 justify-center flex w-full">
      <Image
              src={BackgroundImg}
              alt="Background Image"
              objectFit="cover"
              className="absolute opacity-10 inset-0 mt-[3rem] -z-2"
            />
      <Card className="max-w-6xl w-full mx-auto z-10">
        <div className="my-0 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden min-h-[200px]">
          <div className="bg-gradient-to-r from-violet-600 to-amber-600 px-6 py-3 mb-3">
            <h2 className="text-2xl font-bold text-white">
              UDIN Generated Details
            </h2>
          </div>
          <CardContent>
            <div className="flex gap-4 mb-4 py-4">
              <Input
                type="date"
                name="from_date"
                value={filters.from_date}
                onChange={handleChange}
              />
              <Input
                type="date"
                name="to_date"
                value={filters.to_date}
                onChange={handleChange}
              />
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? "Loading..." : "Search"}
              </Button>
            </div>
            {error && <p className="text-red-600">{error}</p>}
            <div className="py-5">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Registration No.</TableHead>
                    <TableHead>Gig Worker Name</TableHead>
                    <TableHead>UDIN No.</TableHead>
                    <TableHead>Certificate Date (UDIN)</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{item.application_no || "N/A"}</TableCell>
                        <TableCell>{item.gig_worker_name}</TableCell>
                        <TableCell>{item.udin_no}</TableCell>
                        <TableCell>{item.udin_generate_on || "N/A"}</TableCell>
                        <TableCell>{item.payment_status_id ? <Badge className="bg-green-100 text-slate-600 border-[1px] border-green-300">Complete</Badge> : <Badge className="bg-yellow-100 text-slate-600 border-[1px] border-yellow-300">Pending</Badge>}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            className="rounded-full hover:animate-pulse px-[0.6rem]"
                            onClick={() => handleDownloadUDIN(item?.udin_no)}
                            disabled={downloadingUDIN === item?.udin_no}
                          >
                            {downloadingUDIN === item?.udin_no ? (
                              <Loader2 className="animate-spin" />
                            ) : (
                              <FileDown />
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="7" className="text-center">
                        No UDIN records found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default UdinGeneratedDtlsTable;
