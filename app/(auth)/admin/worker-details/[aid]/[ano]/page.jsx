"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Briefcase,
  CreditCard,
  Car,
  MapPin,
  GraduationCap,
  Users,
  Calendar,
  Building,
  Clock,
  FileText,
} from "lucide-react";
import { useState, useEffect, use } from "react";
import {
  getGigWorkerBankInfoAPI,
  getGigWorkerBasicInfoAPI,
  getGigWorkerWorkRelatedInfoAPI,
  getGigWorkerVehicleInfoAPI
} from "@/app/workers-registration-form/api";
import Image from "next/image";
import BackgroundImg from "@/assets/bg_img_1.jpg";
const Page = ({ params }) => {
  const unwrappedParams = use(params);
  const { aid, ano } = unwrappedParams;
  const dec_aid = decodeURIComponent(aid);
  const dec_ano = decodeURIComponent(ano);
  const application_id = atob(dec_aid);
  const application_no = atob(dec_ano);
  const [workData, setWorkData] = useState(null);
  const [basicData, setBasicData] = useState(null);
  const [bankData, setBankData] = useState(null);
  const [vehicleData, setVehicleData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("basic");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workResponse = await getGigWorkerWorkRelatedInfoAPI(
          application_id,
          0
        );
        const basicResponse = await getGigWorkerBasicInfoAPI(application_id, 0);
        const bankResponse = await getGigWorkerBankInfoAPI(application_id, 0);
        const vehicleResponse = await getGigWorkerVehicleInfoAPI(application_id, 0);

        setWorkData(workResponse.data);
        setBasicData(basicResponse.data);
        setBankData(bankResponse.data);
        setVehicleData(vehicleResponse.data);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [application_id]);

  const InfoItem = ({ icon, label, value, className = "" }) => (
    <div
      className={`flex items-start space-x-3 p-3 rounded-lg transition-colors ${className}`}
    >
      <div className="flex-shrink-0 mt-1">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="font-medium">{value || "-"}</p>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div>
        <Image
          src={BackgroundImg}
          alt="Background Image"
          objectFit="cover"
          className="absolute opacity-10 inset-0 mt-[3rem] -z-2"
        />
      </div>
      <div className="relative w-[80vw] mx-auto py-8 px-4 md:px-6">
        <Card className="border-0 shadow-lg overflow-hidden z-1">
          <div className="bg-gradient-to-r from-[#3674B5] to-[#578FCA] p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex items-center">
              <div className="bg-white/10 p-3 rounded-full mr-4">
                <User 
                src={basicData?.photo_file}
                className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {loading
                    ? "Loading..."
                    : basicData?.gig_worker_name || "GIG Worker Details"}
                </h1>
                {!loading && basicData && (
                  <p className="text-white/80 flex items-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" />
                    {basicData.district_name}, {basicData.block_name}
                  </p>
                )}
              </div>
            </div>
            {!loading && basicData && (
              <Badge className="bg-white/20 hover:bg-white/30 text-white border-none">
                Registration No: {application_no}
              </Badge>
            )}
          </div>

          <CardContent className="p-0">
            {loading ? (
              <div className="p-6 space-y-6">
                <div className="space-y-4">
                  <Skeleton className="h-8 w-1/3" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-24 w-full" />
                  </div>
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-48 w-full" />
                </div>
              </div>
            ) : error ? (
              <div className="p-6">
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg text-center">
                  <FileText className="h-6 w-6 mx-auto mb-2" />
                  {error}
                </div>
              </div>
            ) : (
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <div className="border-b">
                  <TabsList className="h-auto p-0 bg-transparent w-full justify-start overflow-x-auto">
                    <TabsTrigger
                      value="basic"
                      className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Basic Info
                    </TabsTrigger>
                    <TabsTrigger
                      value="vehicle"
                      className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
                    >
                      <Car className="h-4 w-4 mr-2" />
                      Vehicle Details
                    </TabsTrigger>
                    <TabsTrigger
                      value="work"
                      className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
                    >
                      <Briefcase className="h-4 w-4 mr-2" />
                      Work Experience
                    </TabsTrigger>
                    <TabsTrigger
                      value="bank"
                      className="py-3 px-4 data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none rounded-none"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Banking Info
                    </TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="basic" className="p-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <User className="h-5 w-5 mr-2 text-primary" />
                        Personal Information
                      </h3>
                      <div className="bg-muted/30 rounded-xl p-2">
                        <InfoItem
                          icon={<User className="h-5 w-5 text-primary" />}
                          label="Full Name"
                          value={basicData.gig_worker_name}
                        />
                        <InfoItem
                          icon={<Users className="h-5 w-5 text-primary" />}
                          label="Gender"
                          value={basicData.gender_name}
                        />
                        <InfoItem
                          icon={<User className="h-5 w-5 text-primary" />}
                          label="Father/Husband Name"
                          value={basicData.father_or_husband_name}
                        />
                        
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Users className="h-5 w-5 mr-2 text-primary" />
                        Address
                      </h3>
                      <div className="bg-muted/30 rounded-xl p-2">
                      <InfoItem
                          icon={
                            <GraduationCap className="h-5 w-5 text-primary" />
                          }
                          label="District"
                          value={basicData.district_name}
                        />
                        <InfoItem
                          icon={
                            <GraduationCap className="h-5 w-5 text-primary" />
                          }
                          label="Sub-Division"
                          value={basicData.sub_division_name}
                        />
                       
                        <InfoItem
                          icon={<MapPin className="h-5 w-5 text-primary" />}
                          label="Address"
                          value={`${basicData.permanent_address}, ${basicData.district_name}, ${basicData.block_name}`}
                        />
                        <InfoItem
                          icon={<MapPin className="h-5 w-5 text-primary" />}
                          label="PIN Code"
                          value={basicData.pin_code}
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="vehicle" className="p-6 mt-0">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Car className="h-5 w-5 mr-2 text-primary" />
                    Vehicle Details
                  </h3>
                  <div className="overflow-hidden rounded-xl border shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Registration Type
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Vehicle Category
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Vehicle Type
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Registration Number
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {vehicleData?.arr_vehicle_details &&
                          vehicleData?.arr_vehicle_details?.length > 0 ? (
                            vehicleData?.arr_vehicle_details?.map(
                              (vehicle, index) => (
                                <tr
                                  key={index}
                                  className={
                                    index % 2 === 0
                                      ? "bg-background"
                                      : "bg-muted/20 hover:bg-muted/30"
                                  }
                                >
                                  <td className="px-4 py-3 text-sm">
                                    {vehicle.vehicle_registration_type_name}
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    {vehicle.vehicle_category_name || "-"}
                                  </td>
                                  <td className="px-4 py-3 text-sm">
                                    {vehicle.vehicle_type_name}
                                  </td>
                                  <td className="px-4 py-3 text-sm font-medium">
                                    <Badge
                                      variant="outline"
                                      className="font-mono"
                                    >
                                      {vehicle.registration_number || "-"}
                                    </Badge>
                                  </td>
                                </tr>
                              )
                            )
                          ) : (
                            <tr>
                              <td
                                colSpan="4"
                                className="text-center py-8 text-muted-foreground"
                              >
                                <Car className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                No vehicle data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="work" className="p-6 mt-0">
                  <h3 className="text-lg font-semibold mb-4 flex items-center">
                    <Briefcase className="h-5 w-5 mr-2 text-primary" />
                    Work Experience
                  </h3>
                  <div className="overflow-hidden rounded-xl border shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="bg-muted/50">
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Occupation
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Industry
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Organization
                            </th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                              Experience
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {workData && workData.length > 0 ? (
                            workData.map((worker, index) => (
                              <tr
                                key={index}
                                className={
                                  index % 2 === 0
                                    ? "bg-background"
                                    : "bg-muted/20 hover:bg-muted/30"
                                }
                              >
                                <td className="px-4 py-3 text-sm">
                                  <div className="flex items-center">
                                    <Briefcase className="h-4 w-4 mr-2 text-primary/70" />
                                    {worker.occupation_type_name}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  <div className="flex items-center">
                                    <Building className="h-4 w-4 mr-2 text-primary/70" />
                                    {worker.nature_industry_name}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  {worker.organization_name}
                                </td>
                                <td className="px-4 py-3 text-sm">
                                  <Badge className="flex items-center bg-primary/10 text-primary hover:bg-primary/20 border-none">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {worker.experience_year} years
                                  </Badge>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan="4"
                                className="text-center py-8 text-muted-foreground"
                              >
                                <Briefcase className="h-10 w-10 mx-auto mb-2 opacity-20" />
                                No work experience data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="bank" className="p-6 mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-muted/20 rounded-xl p-5 border">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-primary" />
                        Self Banking Details
                      </h3>
                      <div className="space-y-4">
                        <InfoItem
                          icon={<Building className="h-5 w-5 text-primary" />}
                          label="Bank Name"
                          value={bankData.self_bank_name}
                        />
                        <InfoItem
                          icon={<MapPin className="h-5 w-5 text-primary" />}
                          label="Branch"
                          value={bankData.self_bank_branch}
                        />
                        <InfoItem
                          icon={<FileText className="h-5 w-5 text-primary" />}
                          label="IFSC Code"
                          value={bankData.self_bank_ifsc_code}
                          className="font-mono"
                        />
                        <InfoItem
                          icon={<CreditCard className="h-5 w-5 text-primary" />}
                          label="Account Number"
                          value={bankData.self_bank_acc_no}
                          className="font-mono"
                        />
                      </div>
                    </div>

                    <div className="bg-muted/20 rounded-xl p-5 border">
                      <h3 className="text-lg font-semibold mb-4 flex items-center">
                        <Users className="h-5 w-5 mr-2 text-primary" />
                        Nominee Banking Details
                      </h3>
                      <div className="space-y-4">
                        <InfoItem
                          icon={<Building className="h-5 w-5 text-primary" />}
                          label="Bank Name"
                          value={bankData.nominee_bank_name}
                        />
                        <InfoItem
                          icon={<MapPin className="h-5 w-5 text-primary" />}
                          label="Branch"
                          value={bankData.nominee_bank_branch}
                        />
                        <InfoItem
                          icon={<FileText className="h-5 w-5 text-primary" />}
                          label="IFSC Code"
                          value={bankData.nominee_bank_ifsc_code}
                          className="font-mono"
                        />
                        <InfoItem
                          icon={<CreditCard className="h-5 w-5 text-primary" />}
                          label="Account Number"
                          value={bankData.nominee_bank_acc_no}
                          className="font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Page;
