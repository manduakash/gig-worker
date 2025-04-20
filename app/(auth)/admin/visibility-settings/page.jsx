"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import moment from "moment";
import Image from "next/image";
import BackgroundImg from "@/assets/bg_img_1.jpg";
import { Label } from "@/components/ui/label";
import { saveApplicationSectionVisibility } from "./api";
import { Switch } from "@/components/ui/switch";
import Cookies from "react-cookies";

const Page = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState({
    from_date: moment().subtract(1, "day").format("YYYY-MM-DD"),
    to_date: moment().subtract(1, "day").format("YYYY-MM-DD"),
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bankDetailsVisibility, setBankDetailsVisibility] = useState(null);
  const [personalVehicleVisibility, setPersonalVehicleVisibility] = useState(null);



  const updateSetting = async () => {
    setLoading(true);
    setError(null);
    try {
      const userID = Cookies.load("authority_user_id");
      const result = await saveApplicationSectionVisibility(
        userID,
        bankDetailsVisibility ? 1 : 0,
        personalVehicleVisibility ? 1 : 0
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


  return (
    <div className="px-6 py-2 justify-center flex w-full">
      <Image
        src={BackgroundImg}
        alt="Background Image"
        objectFit="cover"
        className="absolute opacity-10 inset-0 mt-[3rem] -z-2"
      />
      <Card className="max-w-6xl w-full mx-auto z-10">
        <div className="my-0 bg-white dark:bg-gray-800 overflow-hidden rounded-md">
          <div className="bg-gradient-to-r from-violet-600 to-amber-600 px-6 py-3 mb-3">
            <h2 className="text-2xl font-bold text-white">
              Visibility Settings
            </h2>
          </div>

          {/* Visibility Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-6 mb-6">
            <div className="flex items-center justify-center gap-6">
              <Label htmlFor="bankDetailsVisibility">Bank Details Visibility</Label>
              <Switch
                id="bankDetailsVisibility"
                checked={bankDetailsVisibility}
                onCheckedChange={setBankDetailsVisibility}
              />
            </div>

            <div className="flex items-center justify-center gap-6">
              <Label htmlFor="personalVehicleVisibility">Personal Vehicle Visibility</Label>
              <Switch
                id="personalVehicleVisibility"
                checked={personalVehicleVisibility}
                onCheckedChange={setPersonalVehicleVisibility}
              />
            </div>
          </div>

          <Button
            className="bg-blue-600 flex justify-center mx-auto mb-10 hover:bg-blue-700 text-white"
            onClick={updateSetting}
            disabled={loading}
          >
            {loading ? "Loading..." : "Update Settings"}
          </Button>
        </div>
        {error && <p className="text-red-600">{error}</p>}

      </Card >
    </div >
  );
};

export default Page;
