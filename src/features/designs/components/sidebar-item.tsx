import type { LucideIcon } from "lucide-react";
import type { IconType } from "react-icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarItemProps {
  icon: LucideIcon | IconType;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  iconClassName?: string;
}

export const SidebarItem = ({
  icon: Icon,
  label,
  isActive,
  onClick,
  iconClassName,
}: SidebarItemProps) => {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      className={cn(
        "flex aspect-video h-full w-full flex-col rounded-none p-3 py-4",
        isActive && "bg-muted text-primary",
      )}
    >
      <Icon className={cn("size-5 shrink-0 stroke-2", iconClassName)} />
      <span className="mt-2 text-xs">{label}</span>
    </Button>
  );
};
