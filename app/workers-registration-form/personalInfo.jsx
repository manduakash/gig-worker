"use client";

import { useState } from "react";
import BasicContactDetailsSection from "./BasicContactDetailsSection";
import AddressDetailsSection from "./AddressDetailsSection";
import OtherDetailsSection from "./OtherDetailsSection";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import VehicleDetails from "./VehicleDetails";

function PersonalInfoForm({ formData, setFormData, onTabChange }) {
  // State to control which tab is active
  const [activeTab, setActiveTab] = useState("basic");
  const [editIndex, setEditIndex] = useState(null);

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const currentVehicle = {
      registration_type_id: formData.registration_type_id,
      automobile_cycle_id: formData.automobile_cycle_id,
      vehicle_type_id: formData.vehicle_type_id,
      is_self_owned: formData.is_self_owned,
      registration_number: formData.registration_number,
    };
    if (editIndex !== null) {
      setFormData((prev) => {
        const updatedVehicles = (prev.vehicleDetails || []).map(
          (vehicle, idx) => (idx === editIndex ? currentVehicle : vehicle)
        );
        return { ...prev, vehicleDetails: updatedVehicles };
      });
      setEditIndex(null);
    } else {
      setFormData((prev) => ({
        ...prev,
        vehicleDetails: [...(prev.vehicleDetails || []), currentVehicle],
      }));
    }

    setFormData((prev) => ({
      ...prev,
      registration_type_id: "",
      automobile_cycle_id: "",
      vehicle_type_id: "",
      is_self_owned: "",
      registration_number: "",
    }));
  };

  const handleEdit = (index) => {
    const vehicleToEdit = formData.vehicleDetails[index];
    setFormData((prev) => ({
      ...prev,
      registration_type_id: vehicleToEdit.registration_type_id,
      automobile_cycle_id: vehicleToEdit.automobile_cycle_id,
      vehicle_type_id: vehicleToEdit.vehicle_type_id,
      is_self_owned: vehicleToEdit.is_self_owned,
      registration_number: vehicleToEdit.registration_number,
    }));
    setEditIndex(index);
  };

  const handleDelete = (index) => {
    setFormData((prev) => ({
      ...prev,
      vehicleDetails: (prev.vehicleDetails || []).filter((_, i) => i !== index),
    }));
    if (editIndex === index) {
      setEditIndex(null);
      setFormData((prev) => ({
        ...prev,
        vehicleType: "",
        automobileCycle: "",
        wheelers: "",
        selfOwned: "",
        registrationNo: "",
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      let fileName = file.name;
      const maxChars = 70; // adjust as needed (50–70 characters)
      if (fileName.length > maxChars) {
        fileName = fileName.substring(0, maxChars) + "...";
      }
      setFormData((prev) => ({ ...prev, [name]: fileName }));
    }
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    if (onTabChange) {
      onTabChange(value);
    }
  };

  return (
    <div className="p-3 w-[60vw]">
      <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
        <BasicContactDetailsSection
          formData={formData}
          setFormData={setFormData}
          handleSelectChange={handleSelectChange}
          handleChange={handleChange}
          
        />
      </form>
    </div>
  );
}

export default PersonalInfoForm;
