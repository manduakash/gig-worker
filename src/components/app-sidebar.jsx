"use client";

import React from "react";
import { Menu } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    10: {
      name: "Worker",
      email: "worker@example.com",
      avatar: "/img/user.jpg",
    },
    20: {
      name: "Admin",
      email: "admin@example.com",
      avatar: "/img/admin.jpg",
    },
  },
  navMain: [
    {
      title: "Navigation Menu",
      url: "#",
      icon: Menu,
      isActive: true,
      type: ["10"], // Worker Type
      items: [
        {
          title: "Dashboard",
          url: "/worker-dashboard",
        },
        {
          title: "Worker Registration",
          url: "/workers-registration-form",
        },
        {
          title: "User Profile",
          url: "/profile",
        },
        // {
        //   title: "Logout",
        //   url: "/logout",
        // },
      ],
    },
    // for admin
    {
      title: "General",
      url: "#",
      icon: Menu,
      isActive: true,
      type: ["20","30","40","50","60","70","80","100"], // Admin Type
      items: [
        {
          title: "Dashboard",
          url: "/admin/dashboard",
        },
        {
          title: "Udin Generated Details",
          url: "/admin/udin-generation-tbl",
        },
        {
          title: "No of GIG Workers Applied",
          url: "/admin/gig-workers-applied-tbl",
        },
        {
          title: "Search By UDIN Number",
          url: "/admin/search-by-udin-no",
        },
      ],
    },
    {
      title: "MIS Report",
      url: "#",
      icon: Menu,
      isActive: true,
      type: ["20","30","40","50","60","70","80","100"], // Admin Type
      items: [
        {
          title: "Location Wise MIS Report",
          url: "/admin/location-wise-mis-report",
        },
        {
          title: "Gender Wise MIS Report",
          url: "/admin/gender-wise-mis-report",
        },
        {
          title: "Work Type Wise MIS Report",
          url: "/admin/work-type-wise-mis-report",
        },
        {
          title: "Platform Wise MIS Report",
          url: "/admin/platform-wise-mis-report",
        },
        {
          title: "Custom Query Wise MIS Report",
          url: "/admin/custom-query-wise-mis-report",
        },
      ],
    },
    {
      title: "Other Operations",
      url: "#",
      icon: Menu,
      isActive: true,
      type: ["100"], // Admin Type
      items: [
        {
          title: "Visibility Settings",
          url: "/admin/visibility-settings",
        },
        {
          title: "Add Organization",
          url: "/admin/add-organization",
        },
        {
          title: "Add Nature of Industry",
          url: "/admin/add-nature-of-industry",
        },
        {
          title: "Add Occupation",
          url: "/admin/add-occupation",
        },
      ],
    },
  ],
};

export const AdminAppSidebar = (props) => {
  return (
    <Sidebar
      collapsible="icon"
      {...props}
      className="mt-[10px] pb-[10px] flex flex-col h-full z-20"
    >
      <SidebarHeader></SidebarHeader>
      <SidebarContent className="flex-grow">
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};
