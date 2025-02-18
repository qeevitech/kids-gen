import {
  Home,
  Layers,
  Users,
  CreditCard,
  MessageCircleQuestion,
} from "lucide-react";

export interface MenuItem {
  href: string;
  icon: any; // LucideIcon type
  label: string;
  isExternal?: boolean;
  requiresAuth?: boolean;
  requiresPro?: boolean;
}

export const menuItems: MenuItem[] = [
  {
    href: "/",
    icon: Home,
    label: "Home",
  },
  {
    href: "/train",
    icon: Layers,
    label: "Train Model",
    requiresAuth: true,
  },
  {
    href: "/my-models",
    icon: Users,
    label: "My Models",
    requiresAuth: true,
  },
  {
    href: "/billing",
    icon: CreditCard,
    label: "Billing",
    requiresAuth: true,
    requiresPro: true,
  },
  {
    href: "mailto:support@kidbooks.fun",
    icon: MessageCircleQuestion,
    label: "Get Help",
    isExternal: true,
  },
];
