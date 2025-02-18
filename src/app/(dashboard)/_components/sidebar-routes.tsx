"use client";

import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarItem } from "./sidebar-item";
import { menuItems } from "@/config/menu";

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const mainMenuItems = menuItems.filter((item) => !item.isExternal);
  const helpMenuItems = menuItems.filter((item) => item.isExternal);

  return (
    <div className="flex flex-1 flex-col gap-y-4">
      <ul className="flex flex-col gap-y-1 px-3">
        {mainMenuItems.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isActive={pathname === item.href}
          />
        ))}
      </ul>
      <div className="px-3">
        <Separator />
      </div>
      <ul className="flex flex-col gap-y-1 px-3">
        {helpMenuItems.map((item) => (
          <SidebarItem
            key={item.href}
            href={item.href}
            icon={item.icon}
            label={item.label}
            isExternal={item.isExternal}
          />
        ))}
      </ul>
    </div>
  );
};
