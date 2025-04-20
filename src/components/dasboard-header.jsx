"use client";

import { useState } from "react";
import Image from "next/image";
import BiswaBangla from "@/assets/biswa_bangla.png";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import { logout } from "@/app/commonApi";

const Header = () => {
  const [menu, setMenu] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const toggleMenu = () => {
    setMenu(!menu);
  };

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      const response = await logout();
    } catch (error){
      console.error(error);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <>
      <header className="bg-violet-100 w-full fixed top-0 z-50 shadow">
        <div className="w-full mx-auto flex flex-col md:flex-row items-center justify-between py-2 px-4">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <Image
              src={BiswaBangla}
              alt="West Bengal State Emblem"
              className="h-10 w-auto"
            />
            <div className="flex flex-col leading-tight border-l-2 border-slate-300 pl-4">
              <h1 className="text-lg font-bold leading-tight text-violet-700">
                GIG Worker Registration Portal
              </h1>
              <h2 className="text-sm font-semibold leading-tight text-violet-600">
                Department of Labour
              </h2>
            </div>
          </div>

          {/* Logout Button */}
          <Button
            variant="ghost"
            className="flex items-center gap-2 hover:bg-red-50 text-violet-700 hover:text-red-900 hover:ring-1 hover:ring-red-200"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            {loggingOut ? 'Wait...' : 'Logout'}
          </Button>
        </div>
      </header>

      {/* Add some space below header so content is not hidden under header */}
      <div className="pb-10 md:pb-10"></div>
    </>
  );
};

export default Header;
