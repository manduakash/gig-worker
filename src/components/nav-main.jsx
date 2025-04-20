"use client";

import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import Cookies from "react-cookies";
import Link from "next/link";

export function NavMain({ items }) {
  const pathname = usePathname();
  const type_id = Cookies.load("user_type_id") || Cookies.load("authority_user_type_id");
  const [type, setType] = useState(null);
  useEffect(() => {
    try {
      type_id && setType(type_id);
    } catch (error) {
      setType(null);
    }
  }, [type_id]);

  return (
    <SidebarGroup>
      <SidebarGroupLabel></SidebarGroupLabel>
      <SidebarMenu>
        {items.map(
          (item) =>
            item?.type?.includes(type) && (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            className={`text-xs ${
                              pathname == subItem.url &&
                              "font-semibold text-indigo-500 hover:text-indigo-600 bg-indigo-100 hover:bg-indigo-100"
                            }`}
                            asChild
                          >
                            <Link
                              className={`text-xs ${
                                pathname == subItem.url &&
                                "font-semibold text-indigo-500 hover:text-indigo-600 bg-indigo-100 hover:bg-indigo-100"
                              }`}
                              href={subItem.url}
                            >
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
