"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import BackgroundImg from "@/assets/bg_img_1.jpg";
import { Label } from "@/components/ui/label";
import { saveGigWorkerOrganization } from "./api";
import Cookies from "react-cookies";
import { Input } from "@/components/ui/input";
import { getAllNatureIndustryAPI } from "@/app/workers-registration-form/api";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

const Page = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [organizationName, setOrganizationName] = useState("");
  const [industryId, setIndustryId] = useState(0);
  const [natureIndustryOptions, setNatureIndustryOptions] = useState([]);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const userID = Cookies.load("authority_user_id");
      const nature_industry_id = 0;
      const result = await saveGigWorkerOrganization(
        userID,
        nature_industry_id,
        organizationName
      );

      if (result?.status == 0) {
        toast({
          title: "Success!",
          description: result?.message,
          status: "success",
        });
      } else {
        toast({
          variant: "destructive",
          title: "Failure!",
          description: result?.message,
          status: "error",
        });
      }
    } catch (err) {
      setError("Failed to save data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch Nature Industry Options using AbortController.
  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchNatureIndustry = async () => {
      try {
        const result = await getAllNatureIndustryAPI(0, { signal });
        if (result && result.data) {
          console.log(result)
          const mapped = result.data.map((item) => ({
            value: item.nature_of_industry_id.toString(),
            label: item.nature_of_industry_name,
          }));
          setNatureIndustryOptions(mapped);
        }
      } catch (error) {
        if (error.name === "AbortError") {
        } else {
          console.error("Error fetching nature industry options:", error);
        }
      }
    };

    fetchNatureIndustry();

    return () => {
      abortController.abort();
    };
  }, []);


  return (
    <div className="px-6 py-2 justify-center flex w-full">
      <Image
        src={BackgroundImg}
        alt="Background Image"
        objectFit="cover"
        className="absolute opacity-10 inset-0 mt-[3rem] -z-2"
      />
      <Card className="max-w-2xl w-full mx-auto z-10">
        <div className="my-0 bg-white dark:bg-gray-800 overflow-hidden rounded-md">
          <div className="bg-gradient-to-r from-violet-600 to-amber-600 px-6 py-3 mb-3">
            <h2 className="text-2xl font-bold text-white">
              Add Organization
            </h2>
          </div>

          {/* Organization */}
          <div className="gap-4 px-6 mb-6 flex justify-center items-end py-10">
            <div className="flex flex-col justify-center gap-2 mx-auto flex-1">
              <Label htmlFor="organizationName">Organization Name</Label>
              <Input
                value={organizationName || ""}
                onChange={(e) => {
                  setOrganizationName(e.target.value)
                }}
                placeholder="Enter Nature of Industry"
              />
            </div>
            <div className="flex flex-col gap-2 justify-end flex-1">
                <Label>Nature of Industry</Label>
                <Select value={industryId} onValueChange={(value) => setIndustryId(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Nature of Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {natureIndustryOptions?.map((option, i) => (
                      <SelectItem key={i} value={option?.value}>
                        {option?.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </Button>
          </div>

        </div>
        {error && <p className="text-red-600">{error}</p>}

      </Card >
    </div >
  );
};

export default Page;
