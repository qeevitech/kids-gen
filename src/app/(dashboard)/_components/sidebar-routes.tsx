"use client";

import { CreditCard, Home, MessageCircleQuestion } from "lucide-react";
import { usePathname } from "next/navigation";

// import { usePaywall } from "@/features/subscriptions/hooks/use-paywall";
// import { useCheckout } from "@/features/subscriptions/api/use-checkout";
// import { useBilling } from "@/features/subscriptions/api/use-billing";

import { Separator } from "@/components/ui/separator";

import { SidebarItem } from "./sidebar-item";

export const SidebarRoutes = () => {
  // const mutation = useCheckout();
  // const billingMutation = useBilling();
  // const { shouldBlock, isLoading, triggerPaywall } = usePaywall();

  const pathname = usePathname();

  const onClick = () => {
    // if (shouldBlock) {
    //   triggerPaywall();
    //   return;
    // }

    // billingMutation.mutate();
    console.log("clicked");
  };

  return (
    <div className="flex flex-1 flex-col gap-y-4">
      <ul className="flex flex-col gap-y-1 px-3">
        <SidebarItem
          href="/"
          icon={Home}
          label="Home"
          isActive={pathname === "/"}
        />
      </ul>
      <div className="px-3">
        <Separator />
      </div>
      <ul className="flex flex-col gap-y-1 px-3">
        <SidebarItem
          href={pathname}
          icon={CreditCard}
          label="Billing"
          onClick={onClick}
        />
        <SidebarItem
          href="mailto:support@codewithantonio.com"
          icon={MessageCircleQuestion}
          label="Get Help"
        />
      </ul>
    </div>
  );
};
