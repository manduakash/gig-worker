"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { getAuthorityMISReport } from "./api"
import { Check, ChevronsUpDown, ContactRound, Loader2 } from "lucide-react"
import {
  Select,
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import moment from "moment"
import Image from "next/image"
import BackgroundImg from "@/assets/bg_img_1.jpg"
import { DataTable } from "@/components/reusable-datatable"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { fetchBoundaryDetailsAPI, getAllOrganizationAPI } from "@/app/workers-registration-form/api"
import Cookies from "react-cookies"
import { DatePicker } from "@/components/reusables/date-picker"

const UdinGeneratedDtlsTable = () => {
  const [isClient, setIsClient] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState([])
  const [organizationOptions, setOrganizationOptions] = useState([]);
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
    organization_id: "0"
  })
  const [errors, setErrors] = useState({})
  const [startDate, setStartDate] = useState(moment(new Date()).format("YYYY-MM-DD"));
  const [endDate, setEndDate] = useState(moment(new Date()).format("YYYY-MM-DD"));

  const uid = Cookies.load("authority_user_id")

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
        uid || 1,
        startDate,
        endDate,
        formData.district_id || 0,
        formData.subdivision_id || 0,
        formData.locationType === "block" ? formData.block_id : 0,
        formData.locationType === "municipality" ? formData.corporation_municipality_id : 0,
        formData.locationType === "block" ? formData.gram_panchayat_id : 0,
        formData.locationType === "municipality" ? formData.ward_id : 0,
        formData.locationType === "municipality" ? formData.ward_no : 0,
        0,
        0,
        formData.organization_id || 0,
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

  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;

    const fetchOrganizations = async () => {
      try {
        const result = await getAllOrganizationAPI(0, 0, {
          signal,
        });
        if (result && result.data) {
          const mapped = result.data.map((item) => ({
            value: item.organization_id.toString(),
            label: item.organization_name,
          }));
          setOrganizationOptions(mapped);
        }
      } catch (error) {
        if (error.name === "AbortError") {
        } else {
          console.error("Error fetching organization data:", error);
        }
      }
    };

    fetchOrganizations();

    return () => {
      abortController.abort();
    };
  }, []);

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
            <h2 className="text-2xl font-bold text-white">Platform Wise MIS Report</h2>
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

              {/* Organization Dropdown */}
              <div className="flex flex-col gap-2 justify-end">
                <Label>Organization</Label>
                <Select value={formData.organization_id} onValueChange={(value) => setFormData((prev) => ({ ...prev, organization_id: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Organization" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">
                      All Organizations
                    </SelectItem>
                    {organizationOptions.map((option, i) => (
                      <SelectItem key={i} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
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
