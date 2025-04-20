"use client";
import React from "react";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";

const SessionExpired = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <TriangleAlert className="text-xl mx-auto my-2 text-yellow-600" />
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          Session Expired
        </h1>
        <p className="text-gray-600 mb-6 text-justify">
          Your session has expired due to inactivity or because this account is
          logged in on another device. Please log in again to continue.
        </p>
        <Link
          href="/login"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Login Again
        </Link>
      </div>
    </div>
  );
};

export default SessionExpired;
