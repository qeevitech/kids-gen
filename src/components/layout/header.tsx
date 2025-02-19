"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  BookOpen,
  FileText,
  Video,
  Newspaper,
  ChevronDown,
  ChevronUp,
  LucideIcon,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DropdownItem {
  name: string;
  href: string;
}

interface NavigationItemBase {
  name: string;
  href: string;
}

interface NavigationItemWithDropdown extends NavigationItemBase {
  dropdown: DropdownItem[];
}

interface ResourcesMenuItem extends NavigationItemBase {
  sections: {
    title: string;
    items: {
      name: string;
      href: string;
      icon: LucideIcon;
    }[];
  }[];
  banner: {
    title: string;
    description: string;
    image: string;
    link: string;
  };
}

type NavigationItem =
  | NavigationItemBase
  | NavigationItemWithDropdown
  | ResourcesMenuItem;

const resourcesMenu: ResourcesMenuItem = {
  name: "Resources",
  href: "/#resources",
  sections: [
    {
      title: "Learning Resources",
      items: [
        { name: "Documentation", href: "/docs", icon: FileText },
        { name: "Tutorials", href: "/tutorials", icon: Video },
        { name: "Blog", href: "/blog", icon: Newspaper },
        { name: "Guides", href: "/guides", icon: BookOpen },
      ],
    },
  ],
  banner: {
    title: "New Tutorial",
    description: "Learn how to create your first AI storybook in 5 minutes",
    image: "/images/tutorial-preview.jpeg",
    link: "/tutorials/first-story",
  },
};

const navigation: NavigationItem[] = [
  {
    name: "Features",
    href: "/#features",
    dropdown: [
      { name: "AI Story Generation", href: "/#ai-generation" },
      { name: "Custom Characters", href: "/#custom-characters" },
      { name: "Editor", href: "/#editor" },
    ],
  },
  {
    name: "Pricing",
    href: "/pricing",
  },
  {
    name: "Examples",
    href: "/#examples",
  },
  resourcesMenu,
];

function ResourcesMegaMenu() {
  return (
    <div className="absolute left-1/2 right-0 w-screen -translate-x-1/2 bg-white shadow-lg ring-1 ring-gray-900/5">
      <div className="mx-auto max-w-7xl px-6 py-6 lg:px-8">
        <div className="grid grid-cols-4 gap-x-8 gap-y-10">
          <div className="col-span-3">
            <div className="grid grid-cols-3 gap-8">
              {resourcesMenu.sections.map((section) => (
                <div key={section.title}>
                  <p className="text-sm font-medium text-gray-500">
                    {section.title}
                  </p>
                  <ul className="mt-4 space-y-4">
                    {section.items.map((item) => (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className="hover:text-brand-primary group flex items-center gap-x-3 text-sm font-medium text-gray-900"
                        >
                          <item.icon className="h-5 w-5 flex-none" />
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="col-span-1">
            <div className="overflow-hidden rounded-lg">
              <Link href={resourcesMenu.banner.link} className="group">
                <div className="relative aspect-video">
                  <Image
                    src={resourcesMenu.banner.image}
                    alt={resourcesMenu.banner.title}
                    fill
                    className="object-cover transition group-hover:opacity-90"
                  />
                </div>
                <div className="bg-gray-50 p-4 group-hover:bg-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {resourcesMenu.banner.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {resourcesMenu.banner.description}
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const pathname = usePathname();

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const renderDesktopMenuItem = (item: NavigationItem) => {
    if (item === resourcesMenu) {
      return (
        <div key={item.name} className="group relative">
          <button className="hover:text-brand-primary flex items-center gap-x-1 text-sm font-medium leading-6 text-gray-900">
            {item.name}
            <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
          </button>
          <div className="invisible fixed inset-x-0 top-full pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
            <ResourcesMegaMenu />
          </div>
        </div>
      );
    }

    if ("dropdown" in item && item.dropdown) {
      return (
        <div key={item.name} className="group relative">
          <button className="hover:text-brand-primary flex items-center gap-x-1 text-sm font-medium leading-6 text-gray-900">
            {item.name}
            <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
          </button>
          <div className="invisible absolute left-0 top-full pt-2 opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
            <div className="w-48 rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
              {item.dropdown.map((subItem) => (
                <Link
                  key={subItem.name}
                  href={subItem.href}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  {subItem.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        href={item.href}
        className="hover:text-brand-primary text-sm font-medium leading-6 text-gray-900"
      >
        {item.name}
      </Link>
    );
  };

  const renderMobileMenuItem = (item: NavigationItem) => {
    if (item === resourcesMenu) {
      return (
        <div key={item.name} className="space-y-4">
          <button
            onClick={() => toggleDropdown(item.name)}
            className="flex w-full items-center justify-between px-3 text-base font-semibold text-gray-900"
          >
            Resources
            {openDropdown === item.name ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
          {openDropdown === item.name && (
            <div className="space-y-2">
              {resourcesMenu.sections.map((section) => (
                <ul key={section.title} className="space-y-2">
                  {section.items.map((subItem) => (
                    <li key={subItem.name}>
                      <Link
                        href={subItem.href}
                        className="flex items-center gap-x-3 px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                      >
                        <subItem.icon className="h-5 w-5 flex-none" />
                        {subItem.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          )}
        </div>
      );
    }

    if ("dropdown" in item && item.dropdown) {
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleDropdown(item.name)}
            className="flex w-full items-center justify-between px-3 py-2 text-base font-semibold text-gray-900"
          >
            {item.name}
            {openDropdown === item.name ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
          {openDropdown === item.name && (
            <div className="space-y-2">
              {item.dropdown.map((subItem) => (
                <Link
                  key={subItem.name}
                  href={subItem.href}
                  className="block px-6 py-2 text-base font-medium text-gray-900 hover:bg-gray-50"
                >
                  {subItem.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.name}
        href={item.href}
        className="block px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50"
      >
        {item.name}
      </Link>
    );
  };

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 bg-white/80 backdrop-blur-sm">
        <nav
          className="relative mx-auto flex max-w-7xl items-center justify-between p-4 shadow-sm lg:px-8"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
            <Link href="/" className="-m-1.5 p-1.5">
              <Image
                className="h-[36px] w-auto"
                src="/logo.svg"
                alt="Logo"
                width={92}
                height={36}
              />
            </Link>
          </div>

          <div className="flex items-center lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Toggle menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map(renderDesktopMenuItem)}
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-4">
            <Button variant="ghost" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/register">Get Started</Link>
            </Button>
          </div>
        </nav>
      </header>

      {mobileMenuOpen && (
        <div className="relative z-50">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div className="fixed inset-y-0 right-0 w-full overflow-y-auto bg-white p-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link href="/" className="-m-1.5 p-1.5">
                <Image
                  className="h-10 w-auto"
                  src="/logo.svg"
                  alt="Logo"
                  width={92}
                  height={36}
                />
              </Link>
              <button
                type="button"
                className="rounded-md p-2.5 text-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {navigation.map(renderMobileMenuItem)}
                </div>
                <div className="space-y-3 py-6">
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button className="w-full" asChild>
                    <Link href="/register">Get Started</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
