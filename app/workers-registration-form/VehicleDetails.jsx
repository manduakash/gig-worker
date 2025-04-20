// VehicleDetails.jsx
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
import { Button } from "@/components/ui/button";
import { getAllVehicleMasterDataAPI } from "./api";
import { PlusCircle, SquarePenIcon, Trash2 } from "lucide-react";
import Cookies from "react-cookies";

function VehicleDetails({ formData, setFormData, initialVehicles }) {
  const [vehicleMasterData, setVehicleMasterData] = useState(null);
  const personal_vehicle_visibility = Cookies.load("personal_vehicle_visibility");
  // Manage index of the record being edited.
  const [editIndex, setEditIndex] = useState(null);
  // Save a copy of the original record for later comparison.
  const [originalVehicle, setOriginalVehicle] = useState(null);
  const udinNo = Cookies.load("uno");
  const readOnly = false;

  // Fetch master data for dropdown options.
  useEffect(() => {
    const fetchVehicleMasterData = async () => {
      try {
        const result = await getAllVehicleMasterDataAPI(0);
        if (result && result.data) {
          setVehicleMasterData(result.data);
        }
      } catch (error) {
        console.error("Error fetching vehicle master data:", error);
      }
    };
    fetchVehicleMasterData();
  }, []);

  // Debug: Log vehicles list when it changes.
  useEffect(() => {
  }, [formData?.arr_vehicle_details]);

  const handleSelectChange = (field, value) => {
    console.log(field, value);
    
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field == "automobile_cycle_id" && value == 20){
      setFormData((prev) => ({ ...prev, is_self_owned: 1, vehicle_type_id: 200, registration_number: "", driving_license: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddVehicle = () => {
    // Validate required fields.
    if (
      !formData?.registration_type_id ||
      !formData?.automobile_cycle_id ||
      !formData?.vehicle_type_id
    ) {
      return;
    }

    // Build a new vehicle object from the form fields.
    let newVehicle = {
      vehicle_id: formData?.vehicle_id || 0,
      registration_type_id: formData?.registration_type_id,
      vehicle_registration_type_id: formData?.registration_type_id, //
      automobile_cycle_id: formData?.automobile_cycle_id,
      vehicle_category_id: formData?.automobile_cycle_id, //
      vehicle_type_id: formData?.vehicle_type_id,
      is_self_owned: formData?.is_self_owned || 0,
      registration_number: formData?.registration_number || "",
      driving_license: formData?.driving_license || "",
      operation_type: "i",
    };

    // For table rendering, copy the values into the DB-named properties.
    if (newVehicle.vehicle_id) {
      newVehicle.vehicle_registration_type_id = newVehicle.registration_type_id;
      newVehicle.vehicle_category_id = newVehicle.automobile_cycle_id;
    }

    // If editing (i.e. record exists), compare with the original API record.
    if (newVehicle.vehicle_id) {
      const originalRecord = initialVehicles?.find(
        (v) => v.vehicle_id === newVehicle.vehicle_id
      );
      if (originalRecord) {
        const unchanged =
          newVehicle.registration_type_id ===
          originalRecord.vehicle_registration_type_id &&
          newVehicle.automobile_cycle_id ===
          originalRecord.vehicle_category_id &&
          newVehicle.vehicle_type_id === originalRecord.vehicle_type_id &&
          newVehicle.is_self_owned === originalRecord.is_self_owned &&
          newVehicle.registration_number === originalRecord.registration_number &&
          newVehicle.driving_license === originalRecord.driving_license;
        newVehicle.operation_type = unchanged ? "n" : "e";
      } else {
        newVehicle.operation_type = "i";
      }
    }


    setFormData((prev) => {
      const updatedVehicles = [...(prev.arr_vehicle_details || [])];
      if (editIndex !== null) {
        // Replace the edited record.
        updatedVehicles[editIndex] = newVehicle;
      } else {
        // Append new record.
        updatedVehicles.push(newVehicle);
      }
      return {
        ...prev,
        arr_vehicle_details: updatedVehicles,
        // Reset form fields.
        vehicle_id: 0,
        registration_type_id: "",
        automobile_cycle_id: "",
        vehicle_type_id: "",
        is_self_owned: "",
        registration_number: "",
        driving_license: "",
      };
    });

    setEditIndex(null);
    setOriginalVehicle(null);
  };

  const handleEditVehicle = (index) => {
    const vehicle = formData?.arr_vehicle_details[index];
    // Save a copy for later comparison.
    setOriginalVehicle({ ...vehicle });
    // Populate the form.
    setFormData((prev) => ({
      ...prev,
      vehicle_id: vehicle.vehicle_id,
      // Use DB property if available, else fall back.
      registration_type_id:
        vehicle.registration_type_id ||
        vehicle.vehicle_registration_type_id ||
        "",
      automobile_cycle_id:
        vehicle.automobile_cycle_id || vehicle.vehicle_category_id || "",
      vehicle_type_id: vehicle.vehicle_type_id,
      is_self_owned: vehicle.is_self_owned,
      registration_number: vehicle.registration_number,
      driving_license: vehicle.driving_license,
    }));
    setEditIndex(index);
  };

  const handleDeleteVehicle = (index) => {
    setFormData((prev) => {
      const updatedVehicles = [...prev.arr_vehicle_details];
      const vehicle = updatedVehicles[index];

      if (vehicle.vehicle_id) {
        // For an existing record from DB, mark for deletion.
        updatedVehicles[index] = {
          ...vehicle,
          operation_type: "d",
        };
      } else {
        // For new records, remove it completely.
        updatedVehicles.splice(index, 1);
      }
      return { ...prev, arr_vehicle_details: updatedVehicles };
    });

    if (editIndex === index) {
      setEditIndex(null);
      setOriginalVehicle(null);
    }
  };

  useEffect(()=>{
    if(personal_vehicle_visibility == 0){
      setFormData({...formData, registration_type_id: 1, automobile_cycle_id: 20, vehicle_type_id: 200})
    }
  }, [personal_vehicle_visibility])

  return (
    <div className="p-4 border rounded">
      <h3 className="text-xl font-semibold mb-4">Vehicle Details</h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Personal/Commercial */}
        <div>
          <Label htmlFor="registration_type_id">Personal/Commercial</Label>
          <Select
            onValueChange={(value) =>
              handleSelectChange("registration_type_id", Number(value))
            }
            value={
              formData?.registration_type_id
                ? String(formData?.registration_type_id)
                : ""
            }
            disabled={readOnly}
          >
            <SelectTrigger id="registration_type_id" disabled={personal_vehicle_visibility == 0}>
              <SelectValue placeholder="Select Option">
                {
                  vehicleMasterData?.registration_type_master?.find(
                    (item) =>
                      item.registration_type_id === formData?.registration_type_id 
                  )?.registration_type_name
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {vehicleMasterData?.registration_type_master ? (
                vehicleMasterData.registration_type_master.map((item) => (
                  <SelectItem
                    key={item.registration_type_id}
                    value={String(item.registration_type_id)}
                  >
                    {item.registration_type_name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading">Loading...</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Automobile/Cycle */}
        <div>
          <Label htmlFor="automobile_cycle_id">Automobile/Cycle</Label>
          <Select
            onValueChange={(value) =>
              handleSelectChange("automobile_cycle_id", Number(value))
            }
            value={
              formData?.automobile_cycle_id
                ? String(formData?.automobile_cycle_id)
                : ""
            }
            disabled={readOnly}
          >
            <SelectTrigger id="automobile_cycle_id" disabled={personal_vehicle_visibility == 0}>
              <SelectValue placeholder="Select Option">
                {
                  vehicleMasterData?.vehicle_category?.find(
                    (item) =>
                      item.automobile_cycle_type_id ===
                      formData?.automobile_cycle_id
                  )?.automobile_cycle_type_name
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {vehicleMasterData?.vehicle_category ? (
                vehicleMasterData.vehicle_category.map((item) => (
                  <SelectItem
                    key={item.automobile_cycle_type_id}
                    value={String(item.automobile_cycle_type_id)}
                  >
                    {item.automobile_cycle_type_name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading">Loading...</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-6">
        {/* Two-Wheelers/Four-Wheelers */}
        <div>
          <Label htmlFor="vehicle_type_id">Two-Wheelers/Four-Wheelers</Label>
          <Select
            onValueChange={(value) =>
              handleSelectChange("vehicle_type_id", Number(value))
            }
            value={
              formData?.vehicle_type_id ? String(formData?.vehicle_type_id) : ""
            }
            disabled={readOnly || formData.automobile_cycle_id == 20}
          >
            <SelectTrigger id="vehicle_type_id" disabled={personal_vehicle_visibility == 0}>
              <SelectValue placeholder="Select Option">
                {
                  vehicleMasterData?.vehicle_type_master?.find(
                    (item) => item.vehicle_type_id === formData?.vehicle_type_id
                  )?.vehicle_type_name
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {vehicleMasterData?.vehicle_type_master ? (
                vehicleMasterData.vehicle_type_master.map((item) => (
                  <SelectItem
                    key={item.vehicle_type_id}
                    value={String(item.vehicle_type_id)}
                  >
                    {item.vehicle_type_name}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="loading">Loading...</SelectItem>
              )}
            </SelectContent>
          </Select>
        </div>

        {/* Self-owned */}
        <div>
          <Label htmlFor="is_self_owned">Self-owned</Label>
          <Select
            onValueChange={(value) =>
              handleSelectChange("is_self_owned", Number(value))
            }
            value={
              formData?.is_self_owned !== undefined
                ? String(formData?.is_self_owned)
                : ""
            }
            disabled={readOnly || formData.automobile_cycle_id == 20}
          >
            <SelectTrigger id="is_self_owned">
              <SelectValue placeholder="Select Option">
                {formData?.is_self_owned === 1
                  ? "Yes"
                  : formData?.is_self_owned === 0
                    ? "No"
                    : ""}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">Yes</SelectItem>
              <SelectItem value="0">No</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Registration No. (conditional) */}
        {formData?.automobile_cycle_id == 10 && (
          <div className="col-span-1">
            <Label htmlFor="registration_number">Registration No.</Label>
            <Input
              id="registration_number"
              name="registration_number"
              value={formData?.registration_number || ""}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </div>
        )}

        {/* Driving License No. (conditional) */}
        {formData?.automobile_cycle_id == 10 && (
          <div className="col-span-1">
            <Label htmlFor="driving_license">Driving License No.</Label>
            <Input
              id="driving_license"
              name="driving_license"
              value={formData?.driving_license || ""}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </div>
        )}
      </div>

      <div className="flex justify-end pt-3">
        <Button
          variant="secondary"
          className="border rounded-full hover:bg-gray-200"
          onClick={handleAddVehicle}
        >
          {editIndex !== null ? (
            "Update Vehicle"
          ) : (
            <>
              <PlusCircle />
              Add Vehicle
            </>
          )}
        </Button>
      </div>

      {/* Display Table: filter out records marked as deleted */}
      {formData?.arr_vehicle_details &&
        formData?.arr_vehicle_details.filter(
          (vehicle) => vehicle.operation_type !== "d"
        ).length > 0 && (
          <div className="mt-6 overflow-x-auto w-full">
            <div className="w-full inline-block transform origin-top-left">
              <table className="border-collapse w-full text-sm">
                <thead>
                  <tr>
                    <th className="border text-left px-4 py-2">Sl. No</th>
                    <th className="border text-left px-4 py-2">Vehicle Type</th>
                    <th className="border text-left px-4 py-2">Automobile/Bicycle</th>
                    <th className="border text-left px-4 py-2">Wheelers</th>
                    <th className="border text-left px-4 py-2">Self-owned</th>
                    <th className="border text-left px-4 py-2">Registration No.</th>
                    <th className="border text-left px-4 py-2">Driving License No.</th>
                    <th className="border text-left px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {formData?.arr_vehicle_details
                    .filter((vehicle) => vehicle.operation_type !== "d")
                    .map((vehicle, index) => (
                      <tr key={index}>
                        <td className="border px-4 py-2 text-center">
                          {index + 1}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {vehicleMasterData?.registration_type_master?.find(
                            (item) =>
                              item.registration_type_id ===
                              vehicle.vehicle_registration_type_id
                          )?.registration_type_name || "N/A"}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {vehicleMasterData?.vehicle_category?.find(
                            (item) =>
                              item.automobile_cycle_type_id ===
                              vehicle.vehicle_category_id
                          )?.automobile_cycle_type_name || "N/A"}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {vehicleMasterData?.vehicle_type_master?.find(
                            (item) =>
                              item.vehicle_type_id === vehicle.vehicle_type_id
                          )?.vehicle_type_name || "N/A"}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {vehicle.is_self_owned === 1 ? "Yes" : "No"}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {vehicle.registration_number || "N/A"}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {vehicle.driving_license || "N/A"}
                        </td>
                        <td className="border px-4 py-2 text-center space-x-2">
                          <div className="flex justify-center space-x-2">
                            <Button
                              variant="outline"
                              className="text-yellow-600 hover:text-yellow-900 rounded-full w-8 h-8 flex items-center justify-center hover:bg-yellow-500"
                              onClick={() => handleEditVehicle(index)}
                              disabled={readOnly}
                            >
                              <SquarePenIcon />
                            </Button>
                            <Button
                              variant="outline"
                              className="text-red-500 hover:text-slate-100 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-500"
                              onClick={() => handleDeleteVehicle(index)}
                              disabled={readOnly}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  );
}

export default VehicleDetails;
