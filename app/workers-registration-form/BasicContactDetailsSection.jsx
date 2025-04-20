"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import AddressDetailsSection from "./AddressDetailsSection";
import Cookies from "react-cookies";
import { getBloodGroupDetailsApi } from "./api";

function BasicContactDetailsSection({ formData, setFormData, onTabChange }) {

  const udinNo = Cookies.load("uno");
  const readOnly = udinNo ? true : false;
  const [bloodGroupOptions, setBloodGroupOptions] = useState([]);

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "father_or_husband_name") {
      const isValid = /^[A-Za-z\s]*$/.test(value);
      if (!isValid) return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const getBloodGroupDetails = async () => {
      try {
        const response = await getBloodGroupDetailsApi();
        setBloodGroupOptions(response.data.map((item) => ({ label: item.blood_group_name, value: item.blood_group_id })));
      } catch (error) {
        console.error("Error fetching blood group details:", error);
      }
    };

    getBloodGroupDetails();
  }, []);

  return (
    <>
      {/* Basic Information */}
      <div className="p-4 border rounded w-full">
        <h3 className="text-xl font-semibold mb-4">Basic Information</h3>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <Label htmlFor="gig_worker_name">Name</Label>
            <Input
              readOnly
              className="bg-slate-50 cursor-not-allowed"
              id="gig_worker_name"
              name="gig_worker_name"
              value={formData?.gig_worker_name || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="gender_id">Gender</Label>
            <Input
              value={
                formData?.gender_id === 1
                  ? "Male"
                  : formData?.gender_id === 2
                    ? "Female"
                    : formData?.gender_id === 3
                      ? "Other"
                      : 0
              }
              readOnly
              className="bg-slate-50 cursor-not-allowed"
            />
          </div>

          <div className="pt-1 flex flex-col w-full">
            <Label className="pb-1" htmlFor="date_of_birth">
              Date of Birth
            </Label>
            <DatePicker
              disabled
              id="date_of_birth"
              selected={formData?.date_of_birth}
              onChange={(date) => handleSelectChange("date_of_birth", date)}
              placeholderText="Select Date of Birth"
              className="w-full px-4 py-2 text-sm border-gray-300 rounded-sm border-[1px] cursor-not-allowed"
              dateFormat="dd/MM/yyyy"
            />
          </div>
          <div>
            <Label htmlFor="father_or_husband_name">
              Father’s/Husband’s Name
            </Label>
            <Input
              disabled={readOnly}
              id="father_or_husband_name"
              name="father_or_husband_name"
              value={formData?.father_or_husband_name || ""}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="blood_group_id">Blood Group</Label>
            <Select
              value={formData?.blood_group_id || ""}
              onValueChange={(value) => handleChange({ target: { name: "blood_group_id", value } })}
              disabled={readOnly}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Blood Group" />
              </SelectTrigger>
              <SelectContent>
                {bloodGroupOptions.map((group) => (
                  <SelectItem key={group.value} value={group.value}>
                    {group.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="pan_card">
              PAN Card No.
            </Label>
            <Input
              disabled={readOnly}
              id="pan_card"
              name="pan_card"
              value={formData?.pan_card || ""}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="marital_status">Marital Status</Label>
            <Select
              value={formData?.marital_status || ""}
              onValueChange={(value) => handleChange({ target: { name: "marital_status", value } })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Marital Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Married</SelectItem>
                <SelectItem value="0">Not Married</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Address Details */}
      <div className="mt-4">
        <AddressDetailsSection
          formData={formData}
          setFormData={setFormData}
          handleSelectChange={handleSelectChange}
          handleChange={handleChange}
        />
      </div>
    </>
  );
}

export default BasicContactDetailsSection;
