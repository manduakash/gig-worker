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
import { ContactRound, FileDown, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { downloadUdinCerificate } from "@/app/gen-udin/api";
import { getApplicationInfoByStatusIDAuthority } from "../udin-generation-tbl/api";
import Link from "next/link";
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
        setData(result?.data || []);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  if (!isClient) return null;

  return (
    <div className="px-6 py-2 justify-center flex w-full ">
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
              GIG Workers Details
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
                    <TableHead>Gig Worker Name</TableHead>
                    <TableHead>Gender</TableHead>
                    <TableHead>Date of Birth</TableHead>
                    <TableHead>Father or Husband Name</TableHead>
                    <TableHead>Udin Number</TableHead>
                    <TableHead>View Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{index + 1}</TableCell>

                        <TableCell>{item.gig_worker_name}</TableCell>
                        <TableCell>{item.gender_name}</TableCell>
                        <TableCell>{item.dob || "N/A"}</TableCell>
                        <TableCell>
                          {item.father_or_husband_name || "N/A"}
                        </TableCell>
                        <TableCell>{item.udin_no || "N/A"}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            className="rounded-full hover:animate-pulse"
                          >
                            <Link
                              href={`/admin/worker-details/${btoa(
                                item?.application_id
                              )}/${btoa(item?.application_no)}`}
                            >
                              <ContactRound />
                            </Link>
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
