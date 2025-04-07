"use client";

import { Home, ShoppingCart, Speaker, User, Flag, Car } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";
import Link from "next/link";

const items: {
  title: string;
  url: string;
  icon: React.ComponentType;
  isActive: (pathname: string) => boolean;
}[] = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: Home,
    isActive: (pathname: string) => pathname === "/admin",
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: User,
    isActive: (pathname: string) => pathname.startsWith("/admin/users"),
  },
  {
    title: "Products",
    url: "/admin/products",
    icon: Speaker,
    isActive: (pathname: string) => pathname.startsWith("/admin/products"),
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: ShoppingCart,
    isActive: (pathname: string) => pathname.startsWith("/admin/orders"),
  },
  {
    title: "Regions",
    url: "/admin/regions",
    icon: Flag,
    isActive: (pathname: string) => pathname.startsWith("/admin/regions"),
  },
  {
    title: "Cars",
    url: "/admin/cars",
    icon: Car,
    isActive: (pathname: string) => pathname.startsWith("/admin/cars"),
  },
];

export const Menu = () => {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton isActive={item.isActive(pathname)} asChild>
            <Link href={item.url}>
              <item.icon />
              <span>{item.title}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
};
