"use client";

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  CreditCard,
  LogOut,
  KeyRound,
  UserRound,
  User,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Cookies from "react-cookies";
import { useEffect, useState } from "react";
import Image from "next/image";
import DefaultUser from "@/assets/default_user.jpg";
import { logout } from "@/app/commonApi";
import { Button } from "./ui/button";

export function NavUser() {
  const name = Cookies.load("name") ? atob(Cookies.load("name")) : Cookies.load("authority_user_desigantion") ? Cookies.load("authority_user_desigantion") : "USER";
  const user_type = Cookies.load("user_type");
  const authority_boundary_name = Cookies.load("boundary_name");
  const authority_user_type = Cookies.load("authority_user_type_id");
  const [user, setUser] = useState(null);
  const { isMobile } = useSidebar();

  useEffect(() => {
    try {
      const pic = localStorage.getItem("pic");
      setUser({
        type: user_type,
        name,
        pic,
        authority_boundary_name,
        authority_user_type,
      });
    } catch (error) {
      setUser({});
    }
  }, []);

  const handleLogout = async () => {
    const response = await logout();
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground min-w-[100%] ml-auto bg-slate-100 border p-2"
            >
              {user?.name || "N/A"}
              <div className="bg-slate-300 ml-auto rounded-full">
                <Image
                  className="size-10 bg-slate-300 rounded-full"
                  src={
                    user?.pic
                      ? `data:image/png;base64,${user?.pic}`
                      : DefaultUser
                  }
                  width={40} // Explicit width
                  height={40} // Explicit height
                  alt="P"
                />
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <div className="rounded-full p-2">
                  <Image
                    className="size-10 rounded-full"
                    src={
                      user?.pic
                        ? `data:image/png;base64,${user?.pic}`
                        : DefaultUser
                    }
                    width={40} // Explicit width
                    height={40} // Explicit height
                    alt="P"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate text-xs">
                    Name:{" "}
                    {user?.name || "N/A"}
                  </span>
                  <span className="truncate text-xs">
                    User Type:{" "}
                    {user?.type
                      ? user?.type
                      : "N/A" && user?.authority_boundary_name
                      ? user?.authority_boundary_name
                      : "N/A"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            {user?.authority_user_type != 20 && (
              <Link href="/profile" className="bg-primary">
                <DropdownMenuItem>
                  <User />
                  User Profile
                </DropdownMenuItem>
              </Link>
            )}

            <DropdownMenuSeparator />

            <Button
              variant="ghost"
              className="w-full text-start justify-start px-0"
              onClick={handleLogout}
            >
              <DropdownMenuItem>
                <LogOut />
                Logout
              </DropdownMenuItem>
            </Button>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
