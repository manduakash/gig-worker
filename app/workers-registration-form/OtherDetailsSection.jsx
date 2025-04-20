"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MultiSelect } from "@/components/multi-select";
import { Button } from "@/components/ui/button";
import {
  getAllLanguagesAPI,
  uploadGigWorkerFiles,
  getAllRelationTypeAPI,
  getGigWorkerBasicInfoAPI,
} from "./api";
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import {
  AlertCircle,
  CheckCircle2Icon,
  ChevronsUpDown,
  Upload,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useToast } from "@/hooks/use-toast";
import Cookies from "react-cookies";
import { DatePicker } from "@/components/reusables/date-picker";

function OtherDetailsSection({ formData, setFormData }) {
  const [languages, setLanguages] = useState([]);
  const [relationTypes, setRelationTypes] = useState([]);
  const [openRelationship, setOpenRelationship] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState(false);
  const udinNo = Cookies.load("uno");
  const readOnly = udinNo ? true : false;
  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    let sanitizedValue = value;

    if (name === "nominee_aadhar_no") {
      // Allow only digits, max 12
      sanitizedValue = value.replace(/\D/g, "").slice(0, 12);
    } else if (name === "nominee_contact_no") {
      // Allow only digits, max 10
      sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
    } else if (name === "nominee_name") {
      // Allow only alphabets and spaces
      sanitizedValue = value.replace(/[^a-zA-Z\s]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: sanitizedValue,
    }));
  };


  // Fetch languages and relation types on component mount
  useEffect(() => {
    const abortController = new AbortController();

    const fetchLanguages = async () => {
      try {
        const result = await getAllLanguagesAPI(0, {
          signal: abortController.signal,
        });
        if (result?.data) {
          setLanguages(result.data);
        }
      } catch (error) {
        if (error.name === "AbortError") return;
        console.error("Error fetching languages:", error);
      }
    };

    fetchLanguages();

    return () => {
      abortController.abort();
    };
  }, []);

  const gradeOptions = [
    { value: "1", label: "Undergraduate" },
    { value: "2", label: "Graduate" },
    { value: "3", label: "Postgraduate" },
    { value: "4", label: "PhD" },
    { value: "5", label: "Diploma" },
    { value: "6", label: "High School" },
    { value: "7", label: "None" },
  ];

  useEffect(() => {
    const fetchRelationTypes = async () => {
      try {
        const response = await getAllRelationTypeAPI(1); // Pass appropriate user_id
        if (response?.status === 0) {
          const filteredRelations = response?.data?.filter((relation) => relation.relation_type_id == 1 || relation.relation_type_id == 2 || relation.relation_type_id == 5)
          setRelationTypes(filteredRelations || []);
        }
      } catch (error) {
        console.error("Error fetching relation types:", error);
      }
    };

    fetchRelationTypes();
  }, [maritalStatus]);

  const languageOptions = languages.map((lang) => ({
    value: lang.lang_id,
    label: lang.lang_name,
  }));

  useEffect(() => {
    const applicationId = Cookies.load("aid");
    const userID = Cookies.load("uid");

    const fetchBasicData = async () => {
      const response = await getGigWorkerBasicInfoAPI(
        applicationId,
        userID
      );
      setMaritalStatus(response?.data?.marital_status);
    }

    fetchBasicData();


  }, []);

  return (
    <>
      {/* Languages & Education */}
      <div className="p-4 border rounded mt-8">
        <h3 className="text-xl font-semibold mb-4">Languages & Education</h3>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <Label htmlFor="languages">
              Written Languages<span className="text-red-500">*</span>
            </Label>
            <MultiSelect
              options={languageOptions}
              selected={languageOptions.filter((option) =>
                formData.arr_written_lang.includes(option.value)
              )}
              onChange={(selectedOptions) => {
                if (!readOnly) {
                  setFormData((prev) => ({
                    ...prev,
                    arr_written_lang: selectedOptions.map((opt) => opt.value),
                  }));
                }
              }}
              placeholder="Select languages..."
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
              readOnly={readOnly}
            />
          </div>
          <div>
            <Label htmlFor="spokenLanguages">
              Spoken Languages<span className="text-red-500">*</span>
            </Label>
            <MultiSelect
              options={languageOptions}
              selected={languageOptions.filter((option) =>
                formData.arr_spoken_lang.includes(option.value)
              )}
              onChange={(selectedOptions) => {
                if (!readOnly) {
                  setFormData((prev) => ({
                    ...prev,
                    arr_spoken_lang: selectedOptions.map((opt) => opt.value),
                  }));
                }
              }}
              placeholder="Languages"
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
            />
          </div>
          {/* Grade Selection Dropdown */}
          <div className="">
            <Label className="text-sm font-medium">Highest Qualification</Label>
            <Select value={formData?.grade || formData?.grade_id} onValueChange={(value) => handleSelectChange(value, "grade_id")}>
              <SelectTrigger>
                <SelectValue placeholder="Select Highest Qualification" />
              </SelectTrigger>
              <SelectContent>
                {gradeOptions.map((grade) => (
                  <SelectItem key={grade?.value} value={grade?.value}>
                    {grade?.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="educational_qualification">
              Academic Degree<span className="text-red-500">*</span>
            </Label>
            <Input
              id="educational_qualification"
              name="educational_qualification"
              placeholder="(like B.Sc. in Computer Science, MBA, etc."
              value={formData?.educational_qualification || ""}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </div>
        </div>
      </div>

      {/* Uploads */}

      {/* Social Security & Nominee Details */}
      <div className="p-4 border rounded mt-8">
        <h3 className="text-xl font-semibold mb-4">
          Social Security & Nominee Details
        </h3>
        <div className="grid grid-cols-2 gap-6">

          <div>
            <Label htmlFor="nomineeName">
              Name of the Nominee<span className="text-red-500">*</span>
            </Label>
            <Input
              id="nominee_name"
              name="nominee_name"
              value={formData?.nominee_name || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="nomineeRelation">
              Relationship with Nominee<span className="text-red-500">*</span>
            </Label>
            {/* Replacing the Select dropdown with a combobox */}
            <Popover
              open={openRelationship}
              onOpenChange={setOpenRelationship}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openRelationship}
                  id="nomineeRelation"
                  className={`w-full justify-between`}
                >
                  {formData.relationship_with_nominee_id &&
                    relationTypes.length > 0
                    ? relationTypes.find(
                      (relation) =>
                        Number(relation.relation_type_id) ===
                        Number(formData.relationship_with_nominee_id)
                    )?.relation_type_name || "Select Relationship"
                    : "Select Relationship"}
                  <ChevronsUpDown className="opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0">
                <Command>
                  <CommandInput
                    placeholder="Search Relationship..."
                    className="h-9"
                  />
                  <CommandList>
                    {relationTypes.length > 0 ? (
                      <CommandGroup>
                        {relationTypes.map((relation) => (
                          <CommandItem
                            key={relation.relation_type_id}
                            value={relation.relation_type_id.toString()}
                            onSelect={(currentValue) => {
                              setFormData((prev) => ({
                                ...prev,
                                relationship_with_nominee_id:
                                  Number(currentValue),
                              }));
                              setOpenRelationship(false);
                            }}
                          >
                            {relation.relation_type_name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ) : (
                      <CommandEmpty>Loading...</CommandEmpty>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <div>
            <Label htmlFor="nomineeAadhaar">
              Aadhaar Number of Nominee<span className="text-red-500">*</span>
            </Label>
            <Input
              id="nominee_aadhar_no"
              name="nominee_aadhar_no"
              type="text"
              value={formData?.nominee_aadhar_no || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="nominee_contact_no">
              Contact Number of Nominee<span className="text-red-500">*</span>
            </Label>
            <Input
              id="nominee_contact_no"
              name="nominee_contact_no"
              type="text"
              value={formData?.nominee_contact_no || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col justify-end">
            <Label htmlFor="nomineeDob" className="mb-1">
              Date of Birth of Nominee<span className="text-red-500">*</span>
            </Label>
            <DatePicker
              date={formData?.nominee_date_of_birth}
              setDate={(e) =>
                handleSelectChange("nominee_date_of_birth", e)
              }
              fromYear={1947}
              toYear={new Date().getFullYear() - 18}
            />

          </div>
        </div>
      </div>
    </>
  );
}

export default OtherDetailsSection;
