import Link from "next/link";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
  isActive?: boolean;
  isExternal?: boolean;
  onClick?: () => void;
}

export const SidebarItem = ({
  icon: Icon,
  label,
  href,
  isActive,
  isExternal,
  onClick,
}: SidebarItemProps) => {
  const Component = isExternal ? "a" : Link;

  return (
    <Component
      href={href}
      onClick={onClick}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className={cn(
        "flex items-center gap-x-2 pl-6 text-sm font-[500] text-slate-500 transition-all hover:bg-slate-300/20 hover:text-slate-600",
        "rounded-lg py-4",
        isActive &&
          "bg-purple-200/20 text-purple-700 hover:bg-purple-200/20 hover:text-purple-700",
      )}
    >
      <Icon
        size={22}
        className={cn("text-slate-500", isActive && "text-purple-700")}
      />
      {label}
    </Component>
  );
};
