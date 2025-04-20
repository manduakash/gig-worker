"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import BackgroundImg from "@/assets/bg_img_1.jpg";
import { Label } from "@/components/ui/label";
import { saveGigWorkerOccupationType } from "./api";
import { Input } from "@/components/ui/input";

const Page = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [natureIndustryName, setNatureIndustryName] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await saveGigWorkerOccupationType(
        natureIndustryName
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
              Add Occupation Type
            </h2>
          </div>

          {/* Nature of Industry */}
          <div className="gap-4 px-6 mb-6 flex justify-center items-end py-10">
            <div className="flex flex-col justify-center gap-2 mx-auto min-w-[400px]">
              <Label htmlFor="natureIndustryName">Occupation Type</Label>
              <Input
                value={natureIndustryName || ""}
                onChange={(e) => {
                  setNatureIndustryName(e.target.value)
                }}
                placeholder="Enter Occupation Type"
              />
            <Button
              className="bg-blue-600 flex justify-center mx-auto mb-10 hover:bg-blue-700 text-white"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Loading..." : "Submit"}
            </Button>
            </div>
          </div>

        </div>
        {error && <p className="text-red-600">{error}</p>}

      </Card >
    </div >
  );
};

export default Page;
