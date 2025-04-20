"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { getAuthorityMISReport } from "./api"
import { Check, ChevronsUpDown, ContactRound, Loader2 } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import moment from "moment"
import Image from "next/image"
import BackgroundImg from "@/assets/bg_img_1.jpg"
import { DataTable } from "@/components/reusable-datatable"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { fetchBoundaryDetailsAPI } from "@/app/workers-registration-form/api"
import Cookies from "react-cookies"
import { DatePicker } from "@/components/reusables/date-picker"

const UdinGeneratedDtlsTable = () => {
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState([])

  const [formData, setFormData] = useState({
    district: null,
    district_id: "0",
    subDivision: null,
    subdivision_id: "0",
    locationType: "",
    block: null,
    block_id: "0",
    municipality: null,
    corporation_municipality_id: "0",
    gramPanchayat: null,
    gram_panchayat_id: "0",
    ward_no: "",
    ward_id: 0,
  })

  const boundary_level_id = Cookies.load("boundary_level_id")
  const boundary_id = Cookies.load("boundary_id")

  const [districtOpen, setDistrictOpen] = useState(false)
  const [subDivisionOpen, setSubDivisionOpen] = useState(false)
  const [locationTypeOpen, setLocationTypeOpen] = useState(false)
  const [blockOpen, setBlockOpen] = useState(false)
  const [gpOpen, setGpOpen] = useState(false)
  const [municipalityOpen, setMunicipalityOpen] = useState(false)

  const [districts, setDistricts] = useState([])
  const [subDivisions, setSubDivisions] = useState([])
  const [blocks, setBlocks] = useState([])
  const [municipalities, setMunicipalities] = useState([])
  const [gramPanchayats, setGramPanchayats] = useState([])
  const [wards, setWards] = useState([])
  const [errors, setErrors] = useState({})
  const [startDate, setStartDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
  useEffect(() => {
    if (!boundary_level_id || !boundary_id) return;

    setIsClient(true);

    const bLevel = parseInt(boundary_level_id);
    const bId = parseInt(boundary_id);

    // Utility to find from a list
    const findById = (list) => list.find((item) => item.inner_boundary_id == bId);

    if (bLevel === 2 && districts.length > 0) {
      const selectedDistrict = findById(districts);
      if (selectedDistrict) {
        setFormData((prev) => ({
          ...prev,
          district: selectedDistrict,
          district_id: selectedDistrict.inner_boundary_id,
        }));
      }
    } else if (bLevel === 4) {
      const getSubDivisions = async () => {
        try {
          const response = await fetchBoundaryDetailsAPI(2, 0, 1, loginUserID)
          setSubDivisions(response?.data || [])
          const selectedSubdivision = findById(subDivisions);
          if (selectedSubdivision) {
            setFormData((prev) => ({
              ...prev,
              subDivision: selectedSubdivision,
              subdivision_id: selectedSubdivision.inner_boundary_id,
            }));
          }
        } catch (error) {
          console.error("Error fetching sub-divisions:", error)
          setSubDivisions([])
        }
      }
      getSubDivisions()

    } else if (bLevel === 5) {
      const getBlocks = async () => {
        try {
          const response = await fetchBoundaryDetailsAPI(4, 0, 0, loginUserID)
          setBlocks(response?.data || [])
          const selectedBlock = findById(blocks);
          if (selectedBlock) {
            setFormData((prev) => ({
              ...prev,
              block: selectedBlock,
              block_id: selectedBlock.inner_boundary_id,
              locationType: "block",
            }));
          }
        } catch (error) {
          console.error("Error fetching blocks:", error)
          setBlocks([])
        }
      }
      getBlocks();

    } else if (bLevel === 7 && municipalities.length > 0) {
      const selectedMunicipality = findById(municipalities);
      if (selectedMunicipality) {
        setFormData((prev) => ({
          ...prev,
          municipality: selectedMunicipality,
          corporation_municipality_id: selectedMunicipality.inner_boundary_id,
          locationType: "municipality",
        }));
      }
    } else if (bLevel === 6 && gramPanchayats.length > 0) {
      const selectedGP = findById(gramPanchayats);
      if (selectedGP) {
        setFormData((prev) => ({
          ...prev,
          gramPanchayat: selectedGP,
          gram_panchayat_id: selectedGP.inner_boundary_id,
        }));
      }
    } else if (bLevel === 8) {
      setFormData((prev) => ({
        ...prev,
        ward_no: String(bId),
        ward_id: bId,
      }));
    }
  }, [
    boundary_level_id,
    boundary_id,
    districts,
    municipalities,
    gramPanchayats,
  ]);


  const loginUserID = Cookies.load("login_user_id") || 1
  const uid = Cookies.load("authority_user_id")
  const readOnly = 0

  // Validation function
  const handleValidation = (field, value) => {
    const newErrors = { ...errors }

    if (field === "ward_no") {
      if (!value.trim()) {
        newErrors.ward_no = "Ward is required"
      } else {
        delete newErrors.ward_no
      }
    }

    setErrors(newErrors)
  }

  // 1. On load: Fetch districts
  useEffect(() => {
    const getDistricts = async () => {
      try {
        const response = await fetchBoundaryDetailsAPI(1, 1, 1, loginUserID)
        setDistricts(response?.data || [])
      } catch (error) {
        console.error("Error fetching districts:", error)
        setDistricts([])
      }
    }
    getDistricts()
    setIsClient(true)
  }, [loginUserID])

  // 2. Fetch Subdivisions after District selection
  useEffect(() => {
    if (formData?.district?.inner_boundary_id) {
      const getSubDivisions = async () => {
        try {
          const { inner_boundary_id } = formData?.district
          const response = await fetchBoundaryDetailsAPI(2, inner_boundary_id, 1, loginUserID)
          setSubDivisions(response?.data || [])
        } catch (error) {
          console.error("Error fetching sub-divisions:", error)
          setSubDivisions([])
        }
      }
      getSubDivisions()
    } else {
      setSubDivisions([])
    }
  }, [formData?.district, loginUserID])

  // 3a. If locationType === "block" => fetch Blocks (is_urban=0)
  useEffect(() => {
    if (formData?.subDivision?.inner_boundary_id && formData?.locationType === "block") {
      const getBlocks = async () => {
        try {
          const { inner_boundary_id } = formData?.subDivision
          const response = await fetchBoundaryDetailsAPI(4, inner_boundary_id, 0, loginUserID)
          setBlocks(response?.data || [])
        } catch (error) {
          console.error("Error fetching blocks:", error)
          setBlocks([])
        }
      }
      getBlocks()
    } else {
      setBlocks([])
    }
  }, [formData?.subDivision, formData?.locationType, loginUserID])

  // 3b. If block is selected => fetch Gram Panchayats (is_urban=0)
  useEffect(() => {
    if (formData?.block?.inner_boundary_id && formData?.locationType === "block") {
      const getGramPanchayats = async () => {
        try {
          const response = await fetchBoundaryDetailsAPI(5, formData?.block.inner_boundary_id, 0, loginUserID)
          setGramPanchayats(response?.data || [])
        } catch (error) {
          console.error("Error fetching gram panchayats:", error)
          setGramPanchayats([])
        }
      }
      getGramPanchayats()
    } else {
      setGramPanchayats([])
    }
  }, [formData?.block, formData?.locationType, loginUserID])

  // 4a. If locationType === "municipality" => fetch Municipalities (is_urban=1)
  useEffect(() => {
    if (formData?.subDivision?.inner_boundary_id && formData?.locationType === "municipality") {
      const getMunicipalities = async () => {
        try {
          const { inner_boundary_id } = formData?.subDivision
          const response = await fetchBoundaryDetailsAPI(4, inner_boundary_id, 1, loginUserID)
          setMunicipalities(response?.data || [])
        } catch (error) {
          console.error("Error fetching municipalities:", error)
          setMunicipalities([])
        }
      }
      getMunicipalities()
    } else {
      setMunicipalities([])
    }
  }, [formData?.subDivision, formData?.locationType, loginUserID])

  // 4b. If municipality is selected => fetch Wards (is_urban=1)
  useEffect(() => {
    if (formData?.municipality?.inner_boundary_id && formData?.locationType === "municipality") {
      const getWards = async () => {
        try {
          const response = await fetchBoundaryDetailsAPI(5, formData?.municipality.inner_boundary_id, 1, loginUserID)
          setWards(response?.data || [])
        } catch (error) {
          console.error("Error fetching wards:", error)
          setWards([])
        }
      }
      getWards()
    } else {
      setWards([])
    }
  }, [formData?.municipality, formData?.locationType, loginUserID])

  const handleSearch = async () => {
    setLoading(true)
    setError(null)

    // Form validation before search
    let formIsValid = true
    const newErrors = {}

    if (formData.locationType === "municipality" && formData.municipality && !formData.ward_no) {
      newErrors.ward_no = "Ward is required"
      formIsValid = false
    }

    if (!formIsValid) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    try {
      const result = await getAuthorityMISReport(
        uid || 1, // login_user_id
        startDate, // from_date
        endDate, // to_date
        0, // gender_id
        formData.district_id || 0, // district_id
        formData.subdivision_id || 0, // subdivision_id
        formData.locationType === "block" ? formData.block_id : 0, // block_id
        formData.locationType === "municipality" ? formData.corporation_municipality_id : 0, // municipality_id
        0, // pin_code
        0, // grade_id
        0, // occupation_type_id
        0, // nature_of_industry_id
        "", // organisation_id
        0, // age_group_id
        0 // work_experience
      )

      if (result?.status === 4) {
        setError(result?.message || "No Data found")
        setData([])
      } else {
        console.log(result?.data)

        setData(result?.data || [])
        if (result?.data?.length == 0) {
          setError("No data found")
        }
      }
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to fetch data. Please try again.")
      setData([])
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    { accessorKey: "individual_name", header: "Name" },
    { accessorKey: "gender", header: "Gender" },
    { accessorKey: "blood_group", header: "Blood Group" },
    { accessorKey: "list_of_organisations", header: "Organizations" },
    { accessorKey: "district_name", header: "District" },
    { accessorKey: "sub_division_name", header: "Sub-Division" },
    { accessorKey: "block_name", header: "Block" },
    {
      header: "Actions",
      cell: ({ row }) => (
        <Button variant="outline" className="rounded-full hover:animate-pulse">
          <Link
            href={`/admin/worker-details/${btoa(
              row.original?.application_id || "",
            )}/${btoa(row.original?.application_number || "")}`}
          >
            <ContactRound />
          </Link>
        </Button>
      ),
    },
  ]


  useEffect(() => {
    console.log("hi")
  }, [data])

  if (!isClient) return null

  return (
    <div className="px-6 py-2 justify-center flex w-full">
      <Image
        src={BackgroundImg || "/placeholder.svg"}
        alt="Background Image"
        className="absolute opacity-10 inset-0 mt-[3rem] -z-10 object-cover"
        width={1920}
        height={1080}
        priority
      />
      <Card className="max-w-6xl w-full mx-auto z-10">
        <div className="my-0 bg-white dark:bg-gray-800 overflow-hidden rounded-md">
          <div className="bg-gradient-to-r from-violet-600 to-amber-600 px-6 py-3 mb-3">
            <h2 className="text-2xl font-bold text-white">Location Wise MIS Report</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Start Date */}
              <div className="flex flex-col gap-2 justify-end">
                <Label htmlFor="from_date">
                  Start Date<span className="text-red-700">*</span>
                </Label>
                <DatePicker date={startDate} setDate={setStartDate} />
              </div>

              {/* End Date */}
              <div className="flex flex-col gap-2 justify-end">
                <Label htmlFor="to_date">
                  To Date<span className="text-red-700">*</span>
                </Label>
                <DatePicker date={endDate} setDate={setEndDate} />
              </div>

              {/* District Combobox */}
              {
                (boundary_level_id != 4 && boundary_level_id != 5) &&
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
                        className="w-full justify-between mt-1"
                        id="district"
                        disabled={parseInt(boundary_level_id) === 2}
                      >
                        {formData?.district ? formData?.district.inner_boundary_name : "Select District"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <Command>
                        <CommandInput placeholder="Search district..." className="h-9 outline-none" />
                        <CommandList>
                          <CommandEmpty>No district found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem
                              value={0}
                              onSelect={() => {
                                setFormData((prev) => ({
                                  ...prev,
                                  district: 0,
                                  district_id: 0,
                                  subDivision: null,
                                  subdivision_id: 0,
                                  locationType: "",
                                  block: null,
                                  block_id: 0,
                                  municipality: null,
                                  corporation_municipality_id: 0,
                                  gramPanchayat: null,
                                  gram_panchayat_id: 0,
                                  ward_no: "",
                                  ward_id: 0,
                                }))
                                setDistrictOpen(false)
                              }}
                            >
                              All District
                            </CommandItem>
                            {districts.map((district) => (
                              <CommandItem
                                key={district.inner_boundary_id}
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
                                    ward_no: "",
                                    ward_id: 0,
                                  }))
                                  setDistrictOpen(false)
                                }}
                              >
                                {district.inner_boundary_name}
                                {formData?.district?.inner_boundary_id === district.inner_boundary_id && (
                                  <Check className="ml-auto h-4 w-4" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
              }
              {/* Sub-Division Combobox */}
              {boundary_level_id != 5 && <div>
                <Label htmlFor="subDivision">
                  Sub-Division<span className="text-red-700">*</span>
                </Label>
                <Popover open={subDivisionOpen} onOpenChange={setSubDivisionOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={subDivisionOpen}
                      className="w-full justify-between mt-1"
                      id="subDivision"
                      disabled={parseInt(boundary_level_id) === 4}
                    >
                      {formData?.subDivision ? formData?.subDivision.inner_boundary_name : "Select Sub-Division"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search sub-division..." className="h-9 outline-none" />
                      <CommandList>
                        <CommandEmpty>No sub-division found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value={0}
                            onSelect={() => {
                              setFormData((prev) => ({
                                ...prev,
                                district: 0,
                                district_id: 0,
                                subDivision: null,
                                subdivision_id: 0,
                                locationType: "",
                                block: null,
                                block_id: 0,
                                municipality: null,
                                corporation_municipality_id: 0,
                                gramPanchayat: null,
                                gram_panchayat_id: 0,
                                ward_no: "",
                                ward_id: 0,
                              }))
                              setDistrictOpen(false)
                            }}
                          >
                            All Sub-Division
                          </CommandItem>
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
                                  ward_no: "",
                                  ward_id: 0,
                                }))
                                setSubDivisionOpen(false)
                              }}
                            >
                              {subDiv.inner_boundary_name}
                              {formData?.subDivision?.inner_boundary_id === subDiv.inner_boundary_id && (
                                <Check className="ml-auto h-4 w-4" />
                              )}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>}

              {/* Location Type Combobox */}
              {boundary_level_id != 5 && <div>
                <Label htmlFor="locationType">
                  Block/Municipality<span className="text-red-700">*</span>
                </Label>
                <Popover open={locationTypeOpen} onOpenChange={setLocationTypeOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={locationTypeOpen}
                      className="w-full justify-between mt-1"
                      id="locationType"

                      disabled={!formData?.subDivision}
                    >
                      {formData?.locationType
                        ? formData?.locationType.charAt(0).toUpperCase() + formData?.locationType.slice(1)
                        : "Select Type"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0">
                    <Command>
                      <CommandInput placeholder="Search type..." className="h-9 outline-none" />
                      <CommandList>
                        <CommandEmpty>No type found.</CommandEmpty>
                        <CommandGroup>
                          <CommandItem
                            value={0}
                            onSelect={() => {
                              setFormData((prev) => ({
                                ...prev,
                                district: 0,
                                district_id: 0,
                                subDivision: null,
                                subdivision_id: 0,
                                locationType: "",
                                block: null,
                                block_id: 0,
                                municipality: null,
                                corporation_municipality_id: 0,
                                gramPanchayat: null,
                                gram_panchayat_id: 0,
                                ward_no: "",
                                ward_id: 0,
                              }))
                              setDistrictOpen(false)
                            }}
                          >
                            All Block/Municipalicty
                          </CommandItem>
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
                                  ward_no: "",
                                  ward_id: 0,
                                }))
                                setLocationTypeOpen(false)
                              }}
                            >
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                              {formData?.locationType === type && <Check className="ml-auto h-4 w-4" />}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>}

              {/* If "Block", show Blocks & Gram Panchayats */}
              {(formData?.locationType === "block" || boundary_level_id == 5) && (
                <>
                  {/* Block Combobox */}
                  <div>
                    <Label htmlFor="block">Block</Label>
                    <Popover open={blockOpen} onOpenChange={setBlockOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={blockOpen}
                          className="w-full justify-between mt-1"
                          id="block"

                          disabled={parseInt(boundary_level_id) === 5}
                        >
                          {formData?.block ? formData?.block.inner_boundary_name : "Select Block"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search block..." className="h-9 outline-none" />
                          <CommandList>
                            <CommandEmpty>No block found.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                value={0}
                                onSelect={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    district: 0,
                                    district_id: 0,
                                    subDivision: null,
                                    subdivision_id: 0,
                                    locationType: "",
                                    block: null,
                                    block_id: 0,
                                    municipality: null,
                                    corporation_municipality_id: 0,
                                    gramPanchayat: null,
                                    gram_panchayat_id: 0,
                                    ward_no: "",
                                    ward_id: 0,
                                  }))
                                  setDistrictOpen(false)
                                }}
                              >
                                All Block
                              </CommandItem>
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
                                    }))
                                    setBlockOpen(false)
                                  }}
                                >
                                  {block.inner_boundary_name}
                                  {formData?.block?.inner_boundary_id === block.inner_boundary_id && (
                                    <Check className="ml-auto h-4 w-4" />
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
                            className="w-full justify-between mt-1"
                            id="gramPanchayat"

                            disabled={parseInt(boundary_level_id) === 6}
                          >
                            {formData?.gramPanchayat
                              ? formData?.gramPanchayat.inner_boundary_name
                              : "Select Gram Panchayat"}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-0">
                          <Command>
                            <CommandInput placeholder="Search gram panchayat..." className="h-9 outline-none" />
                            <CommandList>
                              <CommandEmpty>No gram panchayat found.</CommandEmpty>
                              <CommandGroup>
                                <CommandItem
                                  value={0}
                                  onSelect={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      district: 0,
                                      district_id: 0,
                                      subDivision: null,
                                      subdivision_id: 0,
                                      locationType: "",
                                      block: null,
                                      block_id: 0,
                                      municipality: null,
                                      corporation_municipality_id: 0,
                                      gramPanchayat: null,
                                      gram_panchayat_id: 0,
                                      ward_no: "",
                                      ward_id: 0,
                                    }))
                                    setDistrictOpen(false)
                                  }}
                                >
                                  All Gram-Panchayat
                                </CommandItem>
                                {gramPanchayats.map((gp) => (
                                  <CommandItem
                                    key={gp.inner_boundary_id}
                                    value={gp.inner_boundary_name}
                                    onSelect={() => {
                                      setFormData((prev) => ({
                                        ...prev,
                                        gramPanchayat: gp,
                                        gram_panchayat_id: gp.inner_boundary_id,
                                      }))
                                      setGpOpen(false)
                                    }}
                                  >
                                    {gp.inner_boundary_name}
                                    {formData?.gramPanchayat?.inner_boundary_id === gp.inner_boundary_id && (
                                      <Check className="ml-auto h-4 w-4" />
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
                </>
              )}

              {/* If "Municipality", show Municipalities & Wards */}
              {formData?.locationType === "municipality" && (
                <>
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
                          className="w-full justify-between mt-1"
                          id="municipality"

                          disabled={parseInt(boundary_level_id) === 7}
                        >
                          {formData?.municipality ? formData?.municipality.inner_boundary_name : "Select Municipality"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Command>
                          <CommandInput placeholder="Search municipality..." className="h-9 outline-none" />
                          <CommandList>
                            <CommandEmpty>No municipality found.</CommandEmpty>
                            <CommandGroup>
                              <CommandItem
                                value={0}
                                onSelect={() => {
                                  setFormData((prev) => ({
                                    ...prev,
                                    district: 0,
                                    district_id: 0,
                                    subDivision: null,
                                    subdivision_id: 0,
                                    locationType: "",
                                    block: null,
                                    block_id: 0,
                                    municipality: null,
                                    corporation_municipality_id: 0,
                                    gramPanchayat: null,
                                    gram_panchayat_id: 0,
                                    ward_no: "",
                                    ward_id: 0,
                                  }))
                                  setDistrictOpen(false)
                                }}
                              >
                                All Municipality
                              </CommandItem>
                              {municipalities.map((mun) => (
                                <CommandItem
                                  key={mun.inner_boundary_id}
                                  value={mun.inner_boundary_name}
                                  onSelect={() => {
                                    setFormData((prev) => ({
                                      ...prev,
                                      municipality: mun,
                                      corporation_municipality_id: mun.inner_boundary_id,
                                      ward_no: "",
                                      ward_id: 0,
                                    }))
                                    setMunicipalityOpen(false)
                                  }}
                                >
                                  {mun.inner_boundary_name}
                                  {formData?.municipality?.inner_boundary_id === mun.inner_boundary_id && (
                                    <Check className="ml-auto h-4 w-4" />
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
                          handleValidation("ward_no", e.target.value)
                          setFormData((prev) => ({
                            ...prev,
                            ward_no: e.target.value,
                          }))
                        }}
                        placeholder="Enter Ward"
                        disabled={!formData?.municipality}
                        className={`mt-1 ${errors?.ward_no ? "border-red-400 focus-visible:border-red-400 border-2" : ""
                          }`}
                      />
                      {errors?.ward_no && <p className="text-red-500 text-sm mt-1">{errors?.ward_no}</p>}
                    </div>
                  )}
                </>
              )}
            </div>

            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white w-full md:w-auto md:px-8 mx-auto block"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Loading..." : "Search"}
            </Button>

            {error && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-center">
                {error}
              </div>
            )}
          </div>

          <hr className="my-4" />

          <div className="p-6">
            {loading ? (
              <div className="text-center py-8 text-gray-500">
                <span className="flex gap-1 justify-center items-center">
                  <Loader2 className="animate-spin" />
                  Loading...
                </span>
              </div>
            ) : data?.length == 0 ? (
              <div className="text-center py-8 text-gray-500">
                No data available. Please adjust your search criteria.
              </div>
            ) : (
              <DataTable data={data} columns={columns} className="w-full" />
            )}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default UdinGeneratedDtlsTable
