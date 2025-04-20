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
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";

const UdinGeneratedDtlsTable = () => {
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState([])
  const [formData, setFormData] = useState({
    district: null,
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
    gender_id: "0",
  })

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
        formData.gender_id, // gender_id
        formData.district_id || 0, // district_id
        formData.subdivision_id || 0, // subdivision_id
        formData.locationType === "block" ? formData.block_id : 0, // block_id
        formData.locationType === "municipality" ? formData.corporation_municipality_id : 0, // municipality_id
        0, // pin_code
        0, // grade_id
        0, // occupation_type_id
        0, // nature_of_industry_id
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
            <h2 className="text-2xl font-bold text-white">Gender Wise MIS Report</h2>
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

              {/* Gender Dropdown */}
              <div className="flex flex-col gap-2 justify-end">
                <Label>Gender</Label>
                <Select value={formData.gender_id || 0} onValueChange={(value) => setFormData((prev)=>({ ...prev, gender_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Type</SelectItem>
                    <SelectItem value="1">Male</SelectItem>
                    <SelectItem value="2">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
