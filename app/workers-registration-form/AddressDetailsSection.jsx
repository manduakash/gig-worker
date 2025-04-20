"use client";

import React, { useState, useEffect } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchBoundaryDetailsAPI } from "./api.js";
import { Textarea } from "@/components/ui/textarea.jsx";
import Cookies from "react-cookies";
import { Checkbox } from "@/components/ui/checkbox.jsx";

function AddressDetailsSection({ formData, setFormData }) {
  // States for dropdown options
  const [districts, setDistricts] = useState([]);
  const [subDivisions, setSubDivisions] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const [gramPanchayats, setGramPanchayats] = useState([]);
  const [wards, setWards] = useState([]);

  // Local state for controlling popovers for each combobox
  const [districtOpen, setDistrictOpen] = useState(false);
  const [subDivisionOpen, setSubDivisionOpen] = useState(false);
  const [locationTypeOpen, setLocationTypeOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [gpOpen, setGpOpen] = useState(false);
  const [municipalityOpen, setMunicipalityOpen] = useState(false);
  const udinNo = Cookies.load("uno");
  const readOnly = udinNo ? true : false;
  const [sameAsPermanent, setSameAsPermanent] = useState(false);
  const [sameAsAadhaar, setSameAsAadhaar] = useState(false);
  const [errors, setErrors] = useState({});

  const [permDistrictOpen, setPermDistrictOpen] = useState(false);
  const [permSubDivisionOpen, setPermSubDivisionOpen] = useState(false);
  const [permLocationTypeOpen, setPermLocationTypeOpen] = useState(false);
  const [permBlockOpen, setPermBlockOpen] = useState(false);
  const [permGpOpen, setPermGpOpen] = useState(false);
  const [permMunicipalityOpen, setPermMunicipalityOpen] = useState(false);

  const [permDistricts, setPermDistricts] = useState([]);
  const [permSubDivisions, setPermSubDivisions] = useState([]);
  const [permBlocks, setPermBlocks] = useState([]);
  const [permMunicipalities, setPermMunicipalities] = useState([]);
  const [permGramPanchayats, setPermGramPanchayats] = useState([]);
  const [permWards, setPermWards] = useState([]);

  const loginUserID = 1;

  // 1. On load: Fetch districts
  useEffect(() => {
    const getDistricts = async () => {
      try {
        const response = await fetchBoundaryDetailsAPI(1, 1, 1, loginUserID);
        setDistricts(response?.data || []);
      } catch (error) {
        console.error("Error fetching districts:", error);
        setDistricts([]);
      }
    };
    getDistricts();
  }, []);

  // 2. Fetch Subdivisions after District selection
  useEffect(() => {
    if (formData?.district?.inner_boundary_id) {
      const getSubDivisions = async () => {
        try {
          const { inner_boundary_id } = formData?.district;
          const response = await fetchBoundaryDetailsAPI(
            2,
            inner_boundary_id,
            1,
            loginUserID
          );
          setSubDivisions(response.data || []);
        } catch (error) {
          console.error("Error fetching sub-divisions:", error);
        }
      };
      getSubDivisions();
    } else {
      setSubDivisions([]);
    }
  }, [formData?.district]);

  // 3a. If locationType === "block" => fetch Blocks (is_urban=0)
  useEffect(() => {
    if (
      formData?.subDivision?.inner_boundary_id &&
      formData?.locationType === "block"
    ) {
      const getBlocks = async () => {
        try {
          const { inner_boundary_id } = formData?.subDivision;
          const response = await fetchBoundaryDetailsAPI(
            4,
            inner_boundary_id,
            0,
            loginUserID
          );
          setBlocks(response.data || []);
        } catch (error) {
          console.error("Error fetching blocks:", error);
        }
      };
      getBlocks();
    } else {
      setBlocks([]);
    }
  }, [formData?.subDivision, formData?.locationType]);

  // 3b. If block is selected => fetch Gram Panchayats (is_urban=0)
  useEffect(() => {
    if (
      formData?.block?.inner_boundary_id &&
      formData?.locationType === "block"
    ) {
      const getGramPanchayats = async () => {
        try {
          const response = await fetchBoundaryDetailsAPI(
            5,
            formData?.block.inner_boundary_id,
            0,
            loginUserID
          );
          setGramPanchayats(response.data || []);
        } catch (error) {
          console.error("Error fetching gram panchayats:", error);
        }
      };
      getGramPanchayats();
    } else {
      setGramPanchayats([]);
    }
  }, [formData?.block, formData?.locationType]);

  // 4a. If locationType === "municipality" => fetch Municipalities (is_urban=1)
  useEffect(() => {
    if (
      formData?.subDivision?.inner_boundary_id &&
      formData?.locationType === "municipality"
    ) {
      const getMunicipalities = async () => {
        try {
          const { inner_boundary_id } = formData?.subDivision;
          const response = await fetchBoundaryDetailsAPI(
            2,
            inner_boundary_id,
            1,
            loginUserID
          );
          setMunicipalities(response.data || []);
        } catch (error) {
          console.error("Error fetching municipalities:", error);
        }
      };
      getMunicipalities();
    } else {
      setMunicipalities([]);
    }
  }, [formData?.subDivision, formData?.locationType]);

  // 4b. If municipality is selected => fetch Wards (is_urban=1)
  useEffect(() => {
    if (
      formData?.municipality?.inner_boundary_id &&
      formData?.locationType === "municipality"
    ) {
      const getWards = async () => {
        try {
          const response = await fetchBoundaryDetailsAPI(
            formData?.municipality.inner_boundary_id,
            1,
            1,
            loginUserID
          );
          setWards((response.data ||= []));
        } catch (error) {
          console.error("Error fetching wards:", error);
        }
      };
      getWards();
    } else {
      setWards([]);
    }
  }, [formData?.municipality, formData?.locationType]);

  // Set default district
  useEffect(() => {
    if (formData?.district_id && districts.length > 0 && !formData?.district) {
      const selectedDistrict = districts.find(
        (d) => d.inner_boundary_id === formData?.district_id
      );
      if (selectedDistrict) {
        setFormData((prev) => ({
          ...prev,
          district: selectedDistrict,
        }));
      }
    }
  }, [districts, formData?.district_id, formData?.district, setFormData]);

  // Set default subdivision
  useEffect(() => {
    if (
      formData.subdivision_id &&
      subDivisions.length > 0 &&
      !formData.subDivision
    ) {
      const selectedSubDivision = subDivisions.find(
        (sd) => sd.inner_boundary_id === formData.subdivision_id
      );
      if (selectedSubDivision) {
        setFormData((prev) => ({
          ...prev,
          subDivision: selectedSubDivision,
        }));
      }
    }
  }, [
    subDivisions,
    formData.subdivision_id,
    formData.subDivision,
    setFormData,
  ]);

  // Set default block
  useEffect(() => {
    if (
      formData?.locationType === "block" &&
      formData?.block_id &&
      blocks.length > 0 &&
      !formData?.block
    ) {
      const selectedBlock = blocks.find(
        (b) => b.inner_boundary_id === formData?.block_id
      );
      if (selectedBlock) {
        setFormData((prev) => ({
          ...prev,
          block: selectedBlock,
        }));
      }
    }
  }, [
    blocks,
    formData?.block_id,
    formData?.block,
    formData?.locationType,
    setFormData,
  ]);

  // Set default gram panchayat
  useEffect(() => {
    if (
      formData?.block &&
      formData?.gram_panchayat_id &&
      gramPanchayats.length > 0 &&
      !formData?.gramPanchayat
    ) {
      const selectedGP = gramPanchayats.find(
        (gp) => gp.inner_boundary_id === formData?.gram_panchayat_id
      );
      if (selectedGP) {
        setFormData((prev) => ({
          ...prev,
          gramPanchayat: selectedGP,
        }));
      }
    }
  }, [
    gramPanchayats,
    formData?.gram_panchayat_id,
    formData?.gramPanchayat,
    formData?.block,
    setFormData,
  ]);

  // Set default municipality
  useEffect(() => {
    if (
      formData?.locationType === "municipality" &&
      formData?.corporation_municipality_id &&
      municipalities.length > 0 &&
      !formData?.municipality
    ) {
      const selectedMunicipality = municipalities.find(
        (m) => m.inner_boundary_id === formData?.corporation_municipality_id
      );
      if (selectedMunicipality) {
        setFormData((prev) => ({
          ...prev,
          municipality: selectedMunicipality,
        }));
      }
    }
  }, [
    municipalities,
    formData?.corporation_municipality_id,
    formData?.municipality,
    formData?.locationType,
    setFormData,
  ]);

  useEffect(() => {
    if (formData?.locationType) {
      return;
    }
    if (formData?.locationType == null && formData.block_id > 0) {
      setFormData((prev) => ({ ...prev, locationType: "block" }));
    }
    if (
      formData?.locationType == null &&
      formData.corporation_municipality_id > 0
    ) {
      setFormData((prev) => ({ ...prev, locationType: "municipality" }));
    }
  }, [
    formData.locationType,
    formData.block_id,
    formData.corporation_municipality_id,
    setFormData,
  ]);

  // 1. On load: Fetch permanent districts
useEffect(() => {
  const getPermDistricts = async () => {
    try {
      const response = await fetchBoundaryDetailsAPI(1, 1, 1, loginUserID);
      setPermDistricts(response?.data || []);
    } catch (error) {
      console.error("Error fetching permanent districts:", error);
      setPermDistricts([]);
    }
  };
  getPermDistricts();
}, []);

// 2. Fetch Permanent Subdivisions after District selection
useEffect(() => {
  if (formData?.permDistrict?.inner_boundary_id) {
    const getPermSubDivisions = async () => {
      try {
        const { inner_boundary_id } = formData.permDistrict;
        const response = await fetchBoundaryDetailsAPI(
          2,
          inner_boundary_id,
          1,
          loginUserID
        );
        setPermSubDivisions(response.data || []);
      } catch (error) {
        console.error("Error fetching permanent sub-divisions:", error);
      }
    };
    getPermSubDivisions();
  } else {
    setPermSubDivisions([]);
  }
}, [formData.permDistrict]);

// 3a. If permLocationType === "block" => fetch Blocks (is_urban=0)
useEffect(() => {
  if (
    formData?.permSubDivision?.inner_boundary_id &&
    formData?.permLocationType === "block"
  ) {
    const getPermBlocks = async () => {
      try {
        const { inner_boundary_id } = formData?.permSubDivision;
        const response = await fetchBoundaryDetailsAPI(
          4,
          inner_boundary_id,
          0,
          loginUserID
        );
        setPermBlocks(response.data || []);
      } catch (error) {
        console.error("Error fetching permanent blocks:", error);
      }
    };
    getPermBlocks();
  } else {
    setPermBlocks([]);
  }
}, [formData.permSubDivision, formData.permLocationType]);

// 3b. If block is selected => fetch Gram Panchayats (is_urban=0)
useEffect(() => {
  if (
    formData?.permBlock?.inner_boundary_id &&
    formData?.permLocationType === "block"
  ) {
    const getPermGramPanchayats = async () => {
      try {
        const response = await fetchBoundaryDetailsAPI(
          5,
          formData?.permBlock.inner_boundary_id,
          0,
          loginUserID
        );
        setPermGramPanchayats(response.data || []);
      } catch (error) {
        console.error("Error fetching permanent gram panchayats:", error);
      }
    };
    getPermGramPanchayats();
  } else {
    setPermGramPanchayats([]);
  }
}, [formData.permBlock, formData.permLocationType]);

// 4a. If permLocationType === "municipality" => fetch Municipalities (is_urban=1)
useEffect(() => {
  if (
    formData?.permSubDivision?.inner_boundary_id &&
    formData?.permLocationType === "municipality"
  ) {
    const getPermMunicipalities = async () => {
      try {
        const { inner_boundary_id } = formData?.permSubDivision;
        const response = await fetchBoundaryDetailsAPI(
          2,
          inner_boundary_id,
          1,
          loginUserID
        );
        setPermMunicipalities(response.data || []);
      } catch (error) {
        console.error("Error fetching permanent municipalities:", error);
      }
    };
    getPermMunicipalities();
  } else {
    setPermMunicipalities([]);
  }
}, [formData.permSubDivision, formData.permLocationType]);

// 4b. If municipality is selected => fetch Wards (is_urban=1)
useEffect(() => {
  if (
    formData?.permMunicipality?.inner_boundary_id &&
    formData?.permLocationType === "municipality"
  ) {
    const getPermWards = async () => {
      try {
        const response = await fetchBoundaryDetailsAPI(
          formData?.permMunicipality.inner_boundary_id,
          1,
          1,
          loginUserID
        );
        setPermWards((response.data ||= []));
      } catch (error) {
        console.error("Error fetching permanent wards:", error);
      }
    };
    getPermWards();
  } else {
    setPermWards([]);
  }
}, [formData.permMunicipality, formData.permLocationType]);

// Set default permanent district
useEffect(() => {
  if (formData?.perm_district_id && permDistricts.length > 0 && !formData?.permDistrict) {
    const selectedPermDistrict = permDistricts.find(
      (d) => d.inner_boundary_id === formData?.perm_district_id
    );
    if (selectedPermDistrict) {
      setFormData((prev) => ({
        ...prev,
        permDistrict: selectedPermDistrict,
      }));
    }
  }
}, [permDistricts, formData.perm_district_id, formData.permDistrict]);

// Set default permanent subdivision
useEffect(() => {
  if (
    formData.perm_subdivision_id &&
    permSubDivisions.length > 0 &&
    !formData.permSubDivision
  ) {
    const selectedPermSubDivision = permSubDivisions.find(
      (sd) => sd.inner_boundary_id === formData.perm_subdivision_id
    );
    if (selectedPermSubDivision) {
      setFormData((prev) => ({
        ...prev,
        permSubDivision: selectedPermSubDivision,
      }));
    }
  }
}, [
  permSubDivisions,
  formData.perm_subdivision_id,
  formData.permSubDivision,
]);

// Set default permanent block
useEffect(() => {
  if (
    formData?.permLocationType === "block" &&
    formData?.perm_block_id &&
    permBlocks.length > 0 &&
    !formData?.permBlock
  ) {
    const selectedPermBlock = permBlocks.find(
      (b) => b.inner_boundary_id === formData?.perm_block_id
    );
    if (selectedPermBlock) {
      setFormData((prev) => ({
        ...prev,
        permBlock: selectedPermBlock,
      }));
    }
  }
}, [
  permBlocks,
  formData.perm_block_id,
  formData.permBlock,
  formData.permLocationType,
]);

// Set default permanent gram panchayat
useEffect(() => {
  if (
    formData?.permBlock &&
    formData?.perm_gram_panchayat_id &&
    permGramPanchayats.length > 0 &&
    !formData?.permGramPanchayat
  ) {
    const selectedPermGP = permGramPanchayats.find(
      (gp) => gp.inner_boundary_id === formData?.perm_gram_panchayat_id
    );
    if (selectedPermGP) {
      setFormData((prev) => ({
        ...prev,
        permGramPanchayat: selectedPermGP,
      }));
    }
  }
}, [
  permGramPanchayats,
  formData.perm_gram_panchayat_id,
  formData.permGramPanchayat,
  formData.permBlock,
]);

// Set default permanent municipality
useEffect(() => {
  if (
    formData?.permLocationType === "municipality" &&
    formData?.perm_corporation_municipality_id &&
    permMunicipalities.length > 0 &&
    !formData?.permMunicipality
  ) {
    const selectedPermMunicipality = permMunicipalities.find(
      (m) => m.inner_boundary_id === formData?.perm_corporation_municipality_id
    );
    if (selectedPermMunicipality) {
      setFormData((prev) => ({
        ...prev,
        permMunicipality: selectedPermMunicipality,
      }));
    }
  }
}, [
  permMunicipalities,
  formData.perm_corporation_municipality_id,
  formData.permMunicipality,
  formData.permLocationType,
]);

// Set location type based on existing data
useEffect(() => {
  if (formData?.permLocationType) {
    return;
  }
  if (formData?.permLocationType == null && formData.perm_block_id > 0) {
    setFormData((prev) => ({ ...prev, permLocationType: "block" }));
  }
  if (
    formData?.permLocationType == null &&
    formData.perm_corporation_municipality_id > 0
  ) {
    setFormData((prev) => ({ ...prev, permLocationType: "municipality" }));
  }
}, [
  formData.permLocationType,
  formData.perm_block_id,
  formData.perm_corporation_municipality_id,
]);

  const handleSameAsAadhaar = (checked) => {
    setSameAsAadhaar(checked);

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        permanent_address: prev.aadhaar_address
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        permanent_address: ""
      }));
    }
  };

  const handleSameAsPermanent = (checked) => {
    setSameAsPermanent(checked);

    if (checked) {
      setFormData((prev) => ({
        ...prev,
        current_address: prev.permanent_address,
        current_pincode: prev.permanent_pincode,
        current_phone: prev.permanent_phone,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        current_address: "",
        current_pincode: "",
        current_phone: "",
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    handleValidation(name, value);

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Extend validation rules
  const validationRules = {
    name: /^[A-Za-z\s]+$/,
    current_address: /^[A-Za-z0-9\s,.-]+$/,
    permanent_address: /^[A-Za-z0-9\s,.-]+$/,
    pincode: /^\d{6}$/,
    permanent_pincode: /^\d{6}$/,
    current_pincode: /^\d{6}$/,
    phone: /^\d{10}$/,
    permanent_phone: /^\d{10}$/,
    current_phone: /^\d{10}$/,
    ward_no: /^\d+$/,
    address_other_details: /^[A-Za-z0-9\s,.-]*$/,
  };

  const handleValidation = (name, value) => {
    let errorMsg = "";

    if (validationRules[name] && !validationRules[name].test(value)) {
      switch (name) {
        case "permanent_address":
        case "current_address":
          errorMsg = "Invalid address format.";
          break;
        case "permanent_pincode":
        case "current_pincode":
        case "pincode":
          errorMsg = "Pincode must be 6 digits.";
          break;
        case "permanent_phone":
        case "current_phone":
        case "phone":
          errorMsg = "Phone number must be 10 digits.";
          break;
        case "ward_no":
          errorMsg = "Ward number must be numeric.";
          break;
        case "address_other_details":
          errorMsg = "Invalid characters in landmark.";
          break;
        default:
          errorMsg = "Invalid input.";
      }
    }

    setErrors((prevErrors) => ({ ...prevErrors, [name]: errorMsg }));
  };

  return (
    <>
      {/* Aadhaar Address */}
      <div className="p-4 border rounded mb-4">
        <h3 className="text-xl font-semibold mb-4">AADHAAR Address</h3>
        <div className="mb-4">
          <Label htmlFor="aadhaar_address">
            Address from Aadhaar
            <span className="text-slate-600"> (Non-editable)</span>
          </Label>
          <Textarea
            readOnly={true}
            id="aadhaar_address"
            name="aadhaar_address"
            value={formData?.aadhaar_address || ""}
            required
            className="text-start focus-visible:ring-1 focus-visible:shadow-none shadow-sm bg-slate-100 cursor-not-allowed h-20"
          />
        </div>
      </div>

      {/* Permanent Address */}
      <div className="p-4 border rounded mb-4">
        <h3 className="text-xl font-semibold mb-4">Permanent Address Details</h3>

        {/* Permanent Address */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="permanent_address">
              Permanent Address
              <span className="text-red-700">*</span>
            </Label>
            {/* Checkbox */}
            <div className="flex items-center">
              <Checkbox
                id="sameAsAadhaar"
                checked={sameAsAadhaar}
                onCheckedChange={handleSameAsAadhaar}
                className="border-slate-400 shadow-sm"
                disabled={readOnly}
              />
              <Label htmlFor="sameAsAadhaar" className="ml-2">
                Same as Aadhaar Address
              </Label>
            </div>
          </div>
          <Textarea
            id="permanent_address"
            name="permanent_address"
            value={formData?.permanent_address || ""}
            onChange={handleChange}
            required
            disabled={readOnly}
            className="text-start focus-visible:ring-1 focus-visible:shadow-none shadow-sm"
          />
        </div>

        {/* District / Sub-Division / Location Type row */}
        <div className="grid grid-cols-3 gap-6 mb-4">
          {/* District Combobox */}
          <div>
            <Label htmlFor="district">
              District<span className="text-red-700">*</span>
            </Label>
            <Popover open={permDistrictOpen} onOpenChange={setPermDistrictOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={permDistrictOpen}
                  className={`w-full justify-between ${readOnly ? "pointer-events-none opacity-50" : ""
                    }`}
                  id="district"
                >
                  {formData?.permDistrict
                    ? formData?.permDistrict.inner_boundary_name
                    : "Select District"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search district..."
                    className="h-9 outline-none"
                  />
                  <CommandList>
                    <CommandEmpty>No district found.</CommandEmpty>
                    <CommandGroup>
                      {districts.map((district, index) => (
                        <CommandItem
                          key={index}
                          value={district.inner_boundary_name || ""}
                          onSelect={() => {
                            setFormData((prev) => ({
                              ...prev,
                              permDistrict: district || null,
                              perm_district_id: district?.inner_boundary_id || 0,
                              permSubDivision: null,
                              perm_subdivision_id: 0,
                              permLocationType: "",
                              permBlock: null,
                              perm_block_id: 0,
                              permMunicipality: null,
                              perm_corporation_municipality_id: 0,
                              permGramPanchayat: null,
                              perm_gram_panchayat_id: 0,
                              permWard: "",
                              permWard_id: 0,
                            }));
                            setPermDistrictOpen(false);
                          }}
                        >
                          {district.inner_boundary_name}
                          {formData?.permDistrict?.inner_boundary_id ===
                            district.inner_boundary_id && (
                              <Check className={cn("ml-auto")} />
                            )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Sub-Division Combobox */}
          <div>
            <Label htmlFor="subDivision">
              Sub-Division<span className="text-red-700">*</span>
            </Label>
            <Popover open={permSubDivisionOpen} onOpenChange={setPermSubDivisionOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={permSubDivisionOpen}
                  className={`w-full justify-between ${readOnly ? "pointer-events-none opacity-50" : ""
                    }`}
                  id="subDivision"
                  disabled={!formData.permDistrict}
                >
                  {formData?.permSubDivision
                    ? formData?.permSubDivision.inner_boundary_name
                    : "Select Sub-Division"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search sub-division..."
                    className="h-9 outline-none"
                  />
                  <CommandList>
                    <CommandEmpty>No sub-division found.</CommandEmpty>
                    <CommandGroup>
                      {subDivisions.map((subDiv) => (
                        <CommandItem
                          key={subDiv.inner_boundary_id}
                          value={subDiv.inner_boundary_name}
                          onSelect={() => {
                            setFormData((prev) => ({
                              ...prev,
                              permSubDivision: subDiv,
                              perm_subdivision_id: subDiv.inner_boundary_id,
                              permLocationType: "",
                              permBlock: null,
                              perm_block_id: 0,
                              permMunicipality: null,
                              perm_corporation_municipality_id: 0,
                              permGramPanchayat: null,
                              perm_gram_panchayat_id: 0,
                              permWard: "",
                              permWard_id: 0,
                            }));
                            setPermSubDivisionOpen(false);
                          }}
                        >
                          {subDiv.inner_boundary_name}
                          {formData?.permSubDivision?.inner_boundary_id ===
                            subDiv.inner_boundary_id && (
                              <Check className={cn("ml-auto")} />
                            )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Location Type Combobox */}
          <div>
            <Label htmlFor="locationType">
              Block/Municipality<span className="text-red-700">*</span>
            </Label>
            <Popover open={permLocationTypeOpen} onOpenChange={setPermLocationTypeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={permLocationTypeOpen}
                  className={`w-full justify-between ${readOnly ? "pointer-events-none opacity-50" : ""
                    }`}
                  id="locationType"
                  disabled={!formData?.permSubDivision || readOnly}
                >
                  {formData?.permLocationType
                    ? formData?.permLocationType.charAt(0).toUpperCase() +
                    formData?.permLocationType.slice(1)
                    : "Select Type"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search type..."
                    className="h-9 outline-none"
                  />
                  <CommandList>
                    <CommandEmpty>No type found.</CommandEmpty>
                    <CommandGroup>
                      {["block", "municipality"].map((type) => (
                        <CommandItem
                          key={type}
                          value={type.charAt(0).toUpperCase() + type.slice(1)}
                          onSelect={() => {
                            setFormData((prev) => ({
                              ...prev,
                              permLocationType: type,
                              permBlock: null,
                              perm_block_id: 0,
                              permMunicipality: null,
                              perm_corporation_municipality_id: 0,
                              permGramPanchayat: null,
                              perm_gram_panchayat_id: 0,
                              permWard: "",
                              permWard_id: 0,
                            }));
                            setPermLocationTypeOpen(false);
                          }}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                          {formData?.permLocationType === type && (
                            <Check className={cn("ml-auto")} />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* If "Block", show Blocks & Gram Panchayats */}
        {formData?.permLocationType === "block" && (
          <div className="grid grid-cols-2 gap-6 mb-4">
            {/* Block Combobox */}
            <div>
              <Label htmlFor="block">Block</Label>
              <Popover open={permBlockOpen} onOpenChange={setPermBlockOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={permBlockOpen}
                    className={`w-full justify-between ${readOnly ? "pointer-events-none opacity-50" : ""
                      }`}
                    id="block"
                    disabled={
                      !formData?.permLocationType ||
                      formData?.permLocationType !== "block" || 
                      readOnly
                    }
                  >
                    {formData?.permBlock
                      ? formData?.permBlock.inner_boundary_name
                      : "Select Block"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search block..."
                      className="h-9 outline-none"
                    />
                    <CommandList>
                      <CommandEmpty>No block found.</CommandEmpty>
                      <CommandGroup>
                        {blocks.map((block) => (
                          <CommandItem
                            key={block.inner_boundary_id}
                            value={block.inner_boundary_name}
                            onSelect={() => {
                              setFormData((prev) => ({
                                ...prev,
                                permBlock: block,
                                perm_block_id: block.inner_boundary_id,
                                permGramPanchayat: null,
                                perm_gram_panchayat_id: 0,
                              }));
                              setPermBlockOpen(false);
                            }}
                          >
                            {block.inner_boundary_name}
                            {formData?.permBlock?.inner_boundary_id ===
                              block.inner_boundary_id && (
                                <Check className={cn("ml-auto")} />
                              )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Gram Panchayat Combobox */}
            {formData?.permBlock && (
              <div>
                <Label htmlFor="permGramPanchayat">
                  Gram Panchayat<span className="text-red-700">*</span>
                </Label>
                <Popover open={permGpOpen} onOpenChange={setPermGpOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={permGpOpen}
                      className={`w-full justify-between ${readOnly ? "pointer-events-none opacity-50" : ""
                        }`}
                      id="permGramPanchayat"
                      disabled={readOnly}
                    >
                      {formData?.permGramPanchayat
                        ? formData?.gramPanchayat.inner_boundary_name
                        : "Select Gram Panchayat"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search gram panchayat..."
                        className="h-9 outline-none"
                      />
                      <CommandList>
                        <CommandEmpty>No gram panchayat found.</CommandEmpty>
                        <CommandGroup>
                          {gramPanchayats.map((gp) => (
                            <CommandItem
                              key={gp.inner_boundary_id}
                              value={gp.inner_boundary_name}
                              onSelect={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  permGramPanchayat: gp,
                                  perm_gram_panchayat_id: gp.inner_boundary_id,
                                }));
                                setPermGpOpen(false);
                              }}
                            >
                              {gp.inner_boundary_name}
                              {formData?.permGramPanchayat?.inner_boundary_id ===
                                gp.inner_boundary_id && (
                                  <Check className={cn("ml-auto")} />
                                )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        )}

        {/* If "Municipality", show Municipalities & Wards */}
        {formData?.permLocationType === "municipality" && (
          <div className="grid grid-cols-2 gap-6 mb-4">
            {/* Municipality Combobox */}
            <div>
              <Label htmlFor="municipality">
                Municipality<span className="text-red-700">*</span>
              </Label>
              <Popover open={permMunicipalityOpen} onOpenChange={setPermMunicipalityOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={permMunicipalityOpen}
                    className={`w-full justify-between ${readOnly ? "pointer-events-none opacity-50" : ""
                      }`}
                    id="municipality"
                    disabled={
                      !formData?.permLocationType ||
                      formData?.permLocationType !== "municipality" || 
                      readOnly
                    }
                  >
                    {formData?.permMunicipality
                      ? formData?.permMunicipality.inner_boundary_name
                      : "Select Municipality"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search municipality..."
                      className="h-9 outline-none"
                    />
                    <CommandList>
                      <CommandEmpty>No municipality found.</CommandEmpty>
                      <CommandGroup>
                        {municipalities.map((mun) => (
                          <CommandItem
                            key={mun.inner_boundary_id}
                            value={mun.inner_boundary_name}
                            onSelect={() => {
                              setFormData((prev) => ({
                                ...prev,
                                permMunicipality: mun,
                                perm_corporation_municipality_id:
                                  mun.inner_boundary_id,
                                permWard: "",
                                permWard_id: 0,
                              }));
                              setPermMunicipalityOpen(false);
                            }}
                          >
                            {mun.inner_boundary_name}
                            {formData?.permMunicipality?.inner_boundary_id ===
                              mun.inner_boundary_id && (
                                <Check className={cn("ml-auto")} />
                              )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {/* Ward Input */}
            {formData?.permMunicipality && (
              <div>
                <Label htmlFor="ward_no">
                  Ward<span className="text-red-700">*</span>
                </Label>
                <Input
                  id="ward_no"
                  name="ward_no"
                  value={formData?.perm_ward_no || ""}
                  onChange={(e) => {
                    handleValidation("ward_no", e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      perm_ward_no: e.target.value,
                    }));
                  }}
                  placeholder="Enter Ward"
                  disabled={!formData?.permMunicipality || readOnly}
                  className={`${errors?.perm_ward_no
                    ? "border-red-400 focus-visible:border-red-400 border-2"
                    : ""
                    }`}
                />
                {errors?.perm_ward_no && (
                  <p className="text-red-500 text-sm">{errors?.perm_ward_no}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* PIN Code / Other Details */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="pincode">
              PIN Code<span className="text-red-700">*</span>
            </Label>
            <Input
              id="perm_pincode"
              name="perm_pincode"
              type="number"
              value={formData?.perm_pincode || ""}
              onChange={(e) => {
                const numericValue =
                  e.target.value === "" ? "" : Number(e.target.value);
                handleValidation("perm_pincode", numericValue);
                setFormData((prev) => ({
                  ...prev,
                  perm_pincode: numericValue,
                }));
              }}
              disabled={readOnly}
              required
              className={`${errors?.perm_pincode
                ? "border-red-400 focus-visible:border-red-400 border-2"
                : ""
                }`}
            />
            {errors?.perm_pincode && (
              <p className="text-red-500 text-sm">{errors?.perm_pincode}</p>
            )}
          </div>
        </div>
      </div>

      {/* Present Address */}
      <div className="p-4 border rounded mb-4">
        <h3 className="text-xl font-semibold mb-4">Present Address Details (Current Address)</h3>

        {/* Current Address */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="current_address">
              Present Address
              <span className="text-[10px]">
                {" "}
                (Flat/ House no./ Street/ Area/ Village){" "}
              </span>
              <span className="text-red-700">*</span>
            </Label>
            {/* Checkbox */}
            <div className="flex items-center">
              <Checkbox
                id="sameAsPermanent"
                checked={sameAsPermanent}
                onCheckedChange={handleSameAsPermanent}
                className="border-slate-400 shadow-sm"
              />
              <Label htmlFor="sameAsPermanent" className="ml-2">
                Same as Permanent Address
              </Label>
            </div>
          </div>

          <Textarea
            id="current_address"
            name="current_address"
            value={formData?.current_address || ""}
            onChange={handleChange}
            required
            className={`text-start focus-visible:ring-none focus-visible:ring-0 transition-all ${errors?.current_address
              ? "border-red-400 focus-visible:border-red-400 border-2"
              : ""
              }`}
          />
          {errors?.current_address && (
            <p className="text-red-500 text-sm">{errors?.current_address}</p>
          )}
        </div>

        {/* District / Sub-Division / Location Type row */}
        <div className="grid grid-cols-3 gap-6 mb-4">
          {/* District Combobox */}
          <div>
            <Label htmlFor="district">
              District<span className="text-red-700">*</span>
            </Label>
            <Popover open={districtOpen} onOpenChange={setDistrictOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={districtOpen}
                  className={`w-full justify-between`}
                  id="district"
                >
                  {formData?.district
                    ? formData?.district.inner_boundary_name
                    : "Select District"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search district..."
                    className="h-9 outline-none"
                  />
                  <CommandList>
                    <CommandEmpty>No district found.</CommandEmpty>
                    <CommandGroup>
                      {districts.map((district, index) => (
                        <CommandItem
                          key={index}
                          value={district.inner_boundary_name || ""}
                          onSelect={() => {
                            setFormData((prev) => ({
                              ...prev,
                              district: district || null,
                              district_id: district?.inner_boundary_id || 0,
                              subDivision: null,
                              subdivision_id: 0,
                              locationType: "",
                              block: null,
                              block_id: 0,
                              municipality: null,
                              corporation_municipality_id: 0,
                              gramPanchayat: null,
                              gram_panchayat_id: 0,
                              ward: "",
                              ward_id: 0,
                            }));
                            setDistrictOpen(false);
                          }}
                        >
                          {district.inner_boundary_name}
                          {formData?.district?.inner_boundary_id ===
                            district.inner_boundary_id && (
                              <Check className={cn("ml-auto")} />
                            )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Sub-Division Combobox */}
          <div>
            <Label htmlFor="subDivision">
              Sub-Division<span className="text-red-700">*</span>
            </Label>
            <Popover open={subDivisionOpen} onOpenChange={setSubDivisionOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={subDivisionOpen}
                  className={`w-full justify-between`}
                  id="subDivision"
                  disabled={!formData.district}
                >
                  {formData?.subDivision
                    ? formData?.subDivision.inner_boundary_name
                    : "Select Sub-Division"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search sub-division..."
                    className="h-9 outline-none"
                  />
                  <CommandList>
                    <CommandEmpty>No sub-division found.</CommandEmpty>
                    <CommandGroup>
                      {subDivisions.map((subDiv) => (
                        <CommandItem
                          key={subDiv.inner_boundary_id}
                          value={subDiv.inner_boundary_name}
                          onSelect={() => {
                            setFormData((prev) => ({
                              ...prev,
                              subDivision: subDiv,
                              subdivision_id: subDiv.inner_boundary_id,
                              locationType: "",
                              block: null,
                              block_id: 0,
                              municipality: null,
                              corporation_municipality_id: 0,
                              gramPanchayat: null,
                              gram_panchayat_id: 0,
                              ward: "",
                              ward_id: 0,
                            }));
                            setSubDivisionOpen(false);
                          }}
                        >
                          {subDiv.inner_boundary_name}
                          {formData?.subDivision?.inner_boundary_id ===
                            subDiv.inner_boundary_id && (
                              <Check className={cn("ml-auto")} />
                            )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Location Type Combobox */}
          <div>
            <Label htmlFor="locationType">
              Block/Municipality<span className="text-red-700">*</span>
            </Label>
            <Popover open={locationTypeOpen} onOpenChange={setLocationTypeOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={locationTypeOpen}
                  className={`w-full justify-between`}
                  id="locationType"
                  disabled={!formData?.subDivision}
                >
                  {formData?.locationType
                    ? formData?.locationType.charAt(0).toUpperCase() +
                    formData?.locationType.slice(1)
                    : "Select Type"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search type..."
                    className="h-9 outline-none"
                  />
                  <CommandList>
                    <CommandEmpty>No type found.</CommandEmpty>
                    <CommandGroup>
                      {["block", "municipality"].map((type) => (
                        <CommandItem
                          key={type}
                          value={type.charAt(0).toUpperCase() + type.slice(1)}
                          onSelect={() => {
                            setFormData((prev) => ({
                              ...prev,
                              locationType: type,
                              block: null,
                              block_id: 0,
                              municipality: null,
                              corporation_municipality_id: 0,
                              gramPanchayat: null,
                              gram_panchayat_id: 0,
                              ward: "",
                              ward_id: 0,
                            }));
                            setLocationTypeOpen(false);
                          }}
                        >
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                          {formData?.locationType === type && (
                            <Check className={cn("ml-auto")} />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* If "Block", show Blocks & Gram Panchayats */}
        {formData?.locationType === "block" && (
          <div className="grid grid-cols-2 gap-6 mb-4">
            {/* Block Combobox */}
            <div>
              <Label htmlFor="block">Block</Label>
              <Popover open={blockOpen} onOpenChange={setBlockOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={blockOpen}
                    className={`w-full justify-between`}
                    id="block"
                    disabled={
                      !formData?.locationType ||
                      formData?.locationType !== "block"
                    }
                  >
                    {formData?.block
                      ? formData?.block.inner_boundary_name
                      : "Select Block"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search block..."
                      className="h-9 outline-none"
                    />
                    <CommandList>
                      <CommandEmpty>No block found.</CommandEmpty>
                      <CommandGroup>
                        {blocks.map((block) => (
                          <CommandItem
                            key={block.inner_boundary_id}
                            value={block.inner_boundary_name}
                            onSelect={() => {
                              setFormData((prev) => ({
                                ...prev,
                                block: block,
                                block_id: block.inner_boundary_id,
                                gramPanchayat: null,
                                gram_panchayat_id: 0,
                              }));
                              setBlockOpen(false);
                            }}
                          >
                            {block.inner_boundary_name}
                            {formData?.block?.inner_boundary_id ===
                              block.inner_boundary_id && (
                                <Check className={cn("ml-auto")} />
                              )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {/* Gram Panchayat Combobox */}
            {formData?.block && (
              <div>
                <Label htmlFor="gramPanchayat">
                  Gram Panchayat<span className="text-red-700">*</span>
                </Label>
                <Popover open={gpOpen} onOpenChange={setGpOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={gpOpen}
                      className={`w-full justify-between`}
                      id="gramPanchayat"
                    >
                      {formData?.gramPanchayat
                        ? formData?.gramPanchayat.inner_boundary_name
                        : "Select Gram Panchayat"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput
                        placeholder="Search gram panchayat..."
                        className="h-9 outline-none"
                      />
                      <CommandList>
                        <CommandEmpty>No gram panchayat found.</CommandEmpty>
                        <CommandGroup>
                          {gramPanchayats.map((gp) => (
                            <CommandItem
                              key={gp.inner_boundary_id}
                              value={gp.inner_boundary_name}
                              onSelect={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  gramPanchayat: gp,
                                  gram_panchayat_id: gp.inner_boundary_id,
                                }));
                                setGpOpen(false);
                              }}
                            >
                              {gp.inner_boundary_name}
                              {formData?.gramPanchayat?.inner_boundary_id ===
                                gp.inner_boundary_id && (
                                  <Check className={cn("ml-auto")} />
                                )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
        )}

        {/* If "Municipality", show Municipalities & Wards */}
        {formData?.locationType === "municipality" && (
          <div className="grid grid-cols-2 gap-6 mb-4">
            {/* Municipality Combobox */}
            <div>
              <Label htmlFor="municipality">
                Municipality<span className="text-red-700">*</span>
              </Label>
              <Popover open={municipalityOpen} onOpenChange={setMunicipalityOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={municipalityOpen}
                    className={`w-full justify-between`}
                    id="municipality"
                    disabled={
                      !formData?.locationType ||
                      formData?.locationType !== "municipality"
                    }
                  >
                    {formData?.municipality
                      ? formData?.municipality.inner_boundary_name
                      : "Select Municipality"}
                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput
                      placeholder="Search municipality..."
                      className="h-9 outline-none"
                    />
                    <CommandList>
                      <CommandEmpty>No municipality found.</CommandEmpty>
                      <CommandGroup>
                        {municipalities.map((mun) => (
                          <CommandItem
                            key={mun.inner_boundary_id}
                            value={mun.inner_boundary_name}
                            onSelect={() => {
                              setFormData((prev) => ({
                                ...prev,
                                municipality: mun,
                                corporation_municipality_id:
                                  mun.inner_boundary_id,
                                ward: "",
                                ward_id: 0,
                              }));
                              setMunicipalityOpen(false);
                            }}
                          >
                            {mun.inner_boundary_name}
                            {formData?.municipality?.inner_boundary_id ===
                              mun.inner_boundary_id && (
                                <Check className={cn("ml-auto")} />
                              )}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {/* Ward Input */}
            {formData?.municipality && (
              <div>
                <Label htmlFor="ward_no">
                  Ward<span className="text-red-700">*</span>
                </Label>
                <Input
                  id="ward_no"
                  name="ward_no"
                  value={formData?.ward_no || ""}
                  onChange={(e) => {
                    handleValidation("ward_no", e.target.value);
                    setFormData((prev) => ({
                      ...prev,
                      ward_no: e.target.value,
                    }));
                  }}
                  placeholder="Enter Ward"
                  disabled={!formData?.municipality}
                  className={`${errors?.ward_no
                    ? "border-red-400 focus-visible:border-red-400 border-2"
                    : ""
                    }`}
                />
                {errors?.ward_no && (
                  <p className="text-red-500 text-sm">{errors?.ward_no}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* PIN Code / Other Details */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="pincode">
              PIN Code<span className="text-red-700">*</span>
            </Label>
            <Input
              id="pincode"
              name="pincode"
              type="number"
              value={formData?.pincode || ""}
              onChange={(e) => {
                const numericValue =
                  e.target.value === "" ? "" : Number(e.target.value);
                handleValidation("pincode", numericValue);
                setFormData((prev) => ({
                  ...prev,
                  pincode: numericValue,
                }));
              }}
              required
              className={`${errors?.pincode
                ? "border-red-400 focus-visible:border-red-400 border-2"
                : ""
                }`}
            />
            {errors?.pincode && (
              <p className="text-red-500 text-sm">{errors?.pincode}</p>
            )}
          </div>
        </div>
      </div>

      {/* Other Address */}
      <div className="p-4 border rounded">
        <h3 className="text-xl font-semibold mb-4">Other Address Details <span className="text-slate-400 text-sm">(if any)</span></h3>

        {/* Current Address */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <Label htmlFor="current_address">
              Any Other Address
              <span className="text-[10px]">
                {" "}
                (optional){" "}
              </span>
            </Label>
          </div>

          <Textarea
            id="address_other_details"
            name="address_other_details"
            value={formData?.address_other_details || ""}
            disabled={readOnly}
            onChange={handleChange}
            required
            className={`text-start focus-visible:ring-none focus-visible:ring-0 transition-all ${errors?.address_other_details
              ? "border-red-400 focus-visible:border-red-400 border-2"
              : ""
              }`}
          />
          {errors?.address_other_details && (
            <p className="text-red-500 text-sm">{errors?.address_other_details}</p>
          )}
        </div>

      </div>
    </>
  );
}

export default AddressDetailsSection;
