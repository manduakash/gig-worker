"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Cookies from "react-cookies";
import Image from "next/image";
import BackgroundImg from "@/assets/bg_img_1.jpg";
const UserProfile = () => {
  const [isMounted, setIsMounted] = useState(false);
  const type = Cookies.load("type");
  const name = Cookies.load("name");
  const user_type = Cookies.load("user_type");
  const aadhaar_no = Cookies.load("aadhaar_no");
  const address = Cookies.load("address");
  const gender = Cookies.load("gender");
  const dob = Cookies.load("dob");
  const authority_name = Cookies.load("authority_user_desigantion");
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const pic = localStorage.getItem("pic");
      setUser({
        type: user_type,
        name,
        pic,
        aadhaar_no,
        address,
        gender,
        dob,
        authority_name,
      });
    } catch (error) {
      setUser({});
    }
    setIsMounted(true);
  }, []);

  if (!isMounted || !user) return null;

  return (
    <div className="flex items-center justify-center w-full p-4">
      <Image
        src={BackgroundImg}
        alt="Background Image"
        objectFit="cover"
        className="absolute opacity-10 inset-0 mt-[3rem] -z-2"
      />
      <Card className="max-w-6xl w-full p-0 rounded-xl shadow-lg bg-white dark:bg-gray-800 overflow-hidden z-10">
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-yellow-300 to-amber-600 px-6 py-3">
          <h2 className="text-2xl font-bold text-white text-center">
            User Details
          </h2>
        </div>

        {/* Card Content */}
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            {/* Profile Picture */}

            {user.pic ? (
              <Image
                className="w-24 h-24 rounded-full shadow-md object-cover ring-4 ring-slate-300 dark:ring-slate-300"
                src={
                  user?.pic ? `data:image/png;base64,${user?.pic}` : DefaultUser
                }
                width={96}
                height={96}
                alt="Profile"
              />
            ) : (
              <div className="w-24 h-24 flex items-center justify-center rounded-full bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xl font-bold">
                {user?.name && user?.name[0]
                  ? user?.name[0]
                  : user?.authority_name && user?.authority_name[0]
                  ? user?.authority_name[0]
                  : "N/A"}
              </div>
            )}

            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
              {user?.name ? atob(user?.name) : "User" }
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              {user.type || "User Type Not Available"}
            </p>
          </div>

          {/* User Details */}
          <div className="mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Detail
                label="Aadhaar No"
                value={user?.aadhaar_no ? atob(user?.aadhaar_no) : "-"}
              />
              <Detail
                label="Address"
                value={user.address ? atob(user?.address) : "-"}
              />
              <Detail
                label="Gender"
                value={user.gender ? atob(user?.gender) : "-"}
              />
              <Detail
                label="Date of Birth"
                value={user.dob ? atob(user?.dob) : "-"}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Detail Component for cleaner code
const Detail = ({ label, value }) => (
  <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg shadow-sm">
    <p className="text-xs text-gray-500 dark:text-gray-400">{label}</p>
    <p className="text-gray-900 dark:text-white font-medium">
      {value || "N/A"}
    </p>
  </div>
);

export default UserProfile;
